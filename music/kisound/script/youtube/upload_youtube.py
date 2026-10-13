#!/usr/bin/env python3
"""Upload an album's rendered videos to YouTube and build its playlist.

Reads the manifest produced by script/build_youtube_metadata.rb and uploads
every video that is not already recorded in xx_youtube/upload_state.json, so
interrupted or quota-limited runs can simply be repeated.

    script/youtube/upload_youtube.py Network-Engineer-Album01 [options]

The default quota has a separate bucket of 100 video uploads per day and
10,000 units per day for other API endpoints. The script stops cleanly when
the quota is exhausted; run it again after the reset to continue.

See script/youtube/README.md for the one-time Google Cloud setup.
"""

from __future__ import annotations

import argparse
import json
import os
import random
import secrets
import sys
import time
import webbrowser
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qs
from wsgiref.simple_server import WSGIRequestHandler, make_server

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
]

DEFAULT_CONFIG_DIR = Path(
    os.environ.get("KISOUND_CONFIG_DIR", Path.home() / ".config" / "kisound")
)
DEFAULT_CLIENT_SECRET = Path(
    os.environ.get("KISOUND_YT_CLIENT_SECRET", DEFAULT_CONFIG_DIR / "youtube_client_secret.json")
)
DEFAULT_TOKEN = Path(
    os.environ.get("KISOUND_YT_TOKEN", DEFAULT_CONFIG_DIR / "youtube_token.json")
)

# Video uploads have their own quota bucket; other API operations are separate.
DEFAULT_UPLOADS_PER_DAY = 100
RETRIABLE_STATUS = {500, 502, 503, 504, 429}
MAX_RETRIES = 8

MISSING_DEPS = """
Missing Google API libraries. Install them into a local virtualenv:

    python3 -m venv script/youtube/.venv
    script/youtube/.venv/bin/pip install -r script/youtube/requirements.txt

then run this script with script/youtube/.venv/bin/python.
"""

try:
    from google.auth.exceptions import RefreshError
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
    from googleapiclient.http import MediaFileUpload
    from oauthlib.oauth2 import OAuth2Error
except ImportError:  # pragma: no cover - environment guard
    sys.exit(MISSING_DEPS)


def log(message: str) -> None:
    print(message, flush=True)


def load_json(path: Path, default):
    if not path.exists():
        return default
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def save_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    with tmp.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, indent=2, ensure_ascii=False)
        handle.write("\n")
    tmp.replace(path)


def browser_sign_in(flow, timeout_seconds: int = 180):
    """Keep the loopback server alive through favicon/probe/old-tab requests."""
    response_uri = None
    expected_state = ""

    class QuietHandler(WSGIRequestHandler):
        def log_message(self, format, *args):
            # Callback URLs contain authorization codes; do not log them.
            pass

    def callback(environ, start_response):
        nonlocal response_uri
        query = parse_qs(environ.get("QUERY_STRING", ""))
        state = query.get("state", [""])[0]
        valid = (environ.get("PATH_INFO") == "/" and bool(state)
                 and secrets.compare_digest(state.encode(), expected_state.encode())
                 and ("code" in query or "error" in query))
        if valid:
            response_uri = flow.redirect_uri + "?" + environ["QUERY_STRING"]
            start_response("200 OK", [("Content-Type", "text/plain; charset=utf-8")])
            return [b"Anmeldung empfangen. Dieses Fenster kann geschlossen werden."]
        start_response("400 Bad Request", [("Content-Type", "text/plain; charset=utf-8")])
        return [b"Bitte die Anmeldung im neuesten Google-Tab abschliessen."]

    with make_server("127.0.0.1", 0, callback, handler_class=QuietHandler) as server:
        flow.redirect_uri = f"http://localhost:{server.server_port}/"
        url, expected_state = flow.authorization_url(prompt="consent")
        webbrowser.open(url, new=1, autoraise=True)
        deadline = time.monotonic() + timeout_seconds
        while response_uri is None:
            remaining = deadline - time.monotonic()
            if remaining <= 0:
                raise TimeoutError("Google sign-in timed out")
            server.timeout = min(remaining, 1)
            server.handle_request()
    # oauthlib requires an HTTPS response URI even for the allowed loopback redirect.
    flow.fetch_token(authorization_response=response_uri.replace("http://", "https://", 1))
    return flow.credentials


def authenticate(client_secret: Path, token_path: Path):
    creds = None
    if token_path.exists():
        creds = Credentials.from_authorized_user_file(str(token_path), SCOPES)

    if creds and creds.valid:
        return build("youtube", "v3", credentials=creds, cache_discovery=False)

    if creds and creds.expired and creds.refresh_token:
        try:
            creds.refresh(Request())
        except RefreshError as error:
            if "invalid_grant" not in str(error):
                raise
            log("The saved Google authorization is expired or revoked; a new browser sign-in is required.")
            creds = None

    if not creds or not creds.valid:
        if not client_secret.exists():
            sys.exit(
                f"OAuth client secret not found at {client_secret}.\n"
                "See script/youtube/README.md for how to create it."
            )
        flow = InstalledAppFlow.from_client_secrets_file(str(client_secret), SCOPES)
        log("Opening a browser for Google sign-in; approve access for the channel you upload to.")
        try:
            creds = browser_sign_in(flow)
        except TimeoutError:
            sys.exit("Google sign-in was not completed within 180 seconds. Run --check-auth again to reconnect.")
        except OAuth2Error:
            sys.exit("Google sign-in could not be verified. Run --check-auth again and complete the newest browser tab; the existing token was preserved.")

    token_path.parent.mkdir(parents=True, exist_ok=True)
    token_path.write_text(creds.to_json(), encoding="utf-8")
    token_path.chmod(0o600)
    return build("youtube", "v3", credentials=creds, cache_discovery=False)


def is_quota_error(error: HttpError) -> bool:
    text = str(error)
    return "quotaExceeded" in text or "uploadLimitExceeded" in text


class QuotaExhausted(RuntimeError):
    pass


def is_playlist_missing(error: HttpError) -> bool:
    return error.resp.status == 404 and "playlistNotFound" in str(error)


def execute(request, what: str, tolerate_missing_playlist: bool = False):
    """Run a googleapiclient request with backoff on transient failures.

    A playlist created seconds earlier is not immediately visible to other
    endpoints, so callers touching a fresh playlist can opt into retrying the
    404 as well.
    """
    for attempt in range(MAX_RETRIES):
        try:
            return request.execute()
        except HttpError as error:
            if is_quota_error(error):
                raise QuotaExhausted(what) from error
            retriable = error.resp.status in RETRIABLE_STATUS or (
                tolerate_missing_playlist and is_playlist_missing(error)
            )
            if not retriable or attempt == MAX_RETRIES - 1:
                raise
            delay = min(2**attempt, 60) + random.random()
            log(f"  {what}: HTTP {error.resp.status}, retrying in {delay:.1f}s")
            time.sleep(delay)
    raise RuntimeError(f"{what}: retries exhausted")


def upload_video(youtube, video: dict, media_path: Path, privacy: str) -> str:
    body = {
        "snippet": {
            "title": video["title"],
            "description": video["description"],
            "tags": video.get("tags", []),
            "categoryId": str(video.get("category_id", "10")),
            "defaultLanguage": video.get("default_language", "en"),
            "defaultAudioLanguage": video.get("default_audio_language") or video.get("default_language", "en"),
        },
        "status": {
            "privacyStatus": privacy,
            "selfDeclaredMadeForKids": bool(video.get("made_for_kids", False)),
            "license": video.get("license", "youtube"),
            "embeddable": True,
        },
    }

    media = MediaFileUpload(str(media_path), chunksize=8 * 1024 * 1024, resumable=True, mimetype="video/mp4")
    request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)

    response = None
    last_percent = -5
    attempt = 0
    while response is None:
        try:
            status, response = request.next_chunk()
            if status:
                percent = int(status.progress() * 100)
                if percent >= last_percent + 5:
                    log(f"  uploading… {percent}%")
                    last_percent = percent
        except HttpError as error:
            if is_quota_error(error):
                raise QuotaExhausted(video["title"]) from error
            if error.resp.status not in RETRIABLE_STATUS or attempt >= MAX_RETRIES:
                raise
            attempt += 1
            delay = min(2**attempt, 60) + random.random()
            log(f"  chunk failed (HTTP {error.resp.status}), retrying in {delay:.1f}s")
            time.sleep(delay)

    return response["id"]


def set_thumbnail(youtube, video_id: str, thumbnail: Path) -> bool:
    try:
        execute(
            youtube.thumbnails().set(videoId=video_id, media_body=MediaFileUpload(str(thumbnail))),
            "thumbnail",
        )
        log(f"  thumbnail set from {thumbnail.name}")
        return True
    except QuotaExhausted:
        raise
    except HttpError as error:
        # A custom thumbnail needs a verified channel, and YouTube rate-limits
        # them per account, so failing here must not lose a finished upload.
        # --retry-thumbnails picks these up later.
        log(f"  thumbnail skipped: {error}")
        return False


def find_or_create_playlist(youtube, title: str, description: str, privacy: str) -> tuple[str, bool]:
    page_token = None
    while True:
        response = execute(
            youtube.playlists().list(part="snippet", mine=True, maxResults=50, pageToken=page_token),
            "playlists.list",
        )
        for item in response.get("items", []):
            if item["snippet"]["title"] == title:
                log(f"Using existing playlist '{title}' ({item['id']})")
                return item["id"], False
        page_token = response.get("nextPageToken")
        if not page_token:
            break

    response = execute(
        youtube.playlists().insert(
            part="snippet,status",
            body={
                "snippet": {"title": title, "description": description},
                "status": {"privacyStatus": privacy},
            },
        ),
        "playlists.insert",
    )
    log(f"Created playlist '{title}' ({response['id']})")
    return response["id"], True


def playlist_video_ids(youtube, playlist_id: str) -> set[str]:
    ids: set[str] = set()
    page_token = None
    while True:
        try:
            response = execute(
                youtube.playlistItems().list(
                    part="contentDetails", playlistId=playlist_id, maxResults=50, pageToken=page_token
                ),
                "playlistItems.list",
                tolerate_missing_playlist=True,
            )
        except HttpError as error:
            if is_playlist_missing(error):
                log(f"  playlist {playlist_id} not reachable, treating as empty")
                return ids
            raise
        for item in response.get("items", []):
            ids.add(item["contentDetails"]["videoId"])
        page_token = response.get("nextPageToken")
        if not page_token:
            break
    return ids


def write_urls_file(path: Path, manifest: dict, state: dict) -> None:
    lines = [f"# YouTube URLs - {manifest['album']}", "", "| # | Title | URL |", "|---|---|---|"]
    for video in manifest["videos"]:
        entry = state["videos"].get(video["key"], {})
        video_id = entry.get("video_id")
        url = f"https://youtu.be/{video_id}" if video_id else ""
        # Titles routinely contain "|", which would split the table cell.
        title = video["title"].replace("|", "\\|")
        lines.append(f"| {video['key']} | {title} | {url} |")
    playlist_id = state.get("playlist_id")
    playlist_url = f"https://www.youtube.com/playlist?list={playlist_id}" if playlist_id else ""
    lines += ["", f"Playlist URL: {playlist_url}", ""]
    path.write_text("\n".join(lines), encoding="utf-8")


def parse_args(argv):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("album_dir", nargs="?", default="Network-Engineer-Album01")
    parser.add_argument("--manifest", help="path to upload_manifest.json (default: <album>/xx_youtube/)")
    parser.add_argument("--privacy", choices=["private", "unlisted", "public"], help="override the manifest privacy")
    parser.add_argument("--only", action="append", default=[], metavar="KEY",
                        help="upload only this manifest key (e.g. 00, album); repeatable")
    parser.add_argument("--max-uploads", type=int, default=None,
                        help="stop after N uploads this run (default: as many as quota allows)")
    parser.add_argument("--no-playlist", action="store_true", help="do not create or fill the playlist")
    parser.add_argument("--no-thumbnails", action="store_true", help="do not set custom thumbnails")
    parser.add_argument("--dry-run", action="store_true", help="show what would happen, call no API")
    parser.add_argument("--check-auth", action="store_true",
                        help="sign in, print the connected channel and exit (costs 1 quota unit)")
    parser.add_argument("--retry-thumbnails", action="store_true",
                        help="set thumbnails that earlier runs could not set, then exit")
    parser.add_argument("--update-privacy", choices=["private", "unlisted", "public"],
                        help="patch already uploaded videos to this visibility and exit")
    parser.add_argument("--client-secret", type=Path, default=DEFAULT_CLIENT_SECRET)
    parser.add_argument("--token", type=Path, default=DEFAULT_TOKEN)
    return parser.parse_args(argv)


def validate_upload_files(base: Path, videos: list[dict], include_thumbnails: bool = True) -> None:
    """Fail before authentication when upload inputs are absent or empty."""
    errors = []
    for video in videos:
        files = [("video", video["file"])]
        if include_thumbnails and video.get("thumbnail"):
            files.append(("thumbnail", video["thumbnail"]))
        for kind, filename in files:
            path = base / filename
            if not path.is_file() or path.stat().st_size == 0:
                errors.append(f"[{video['key']}] missing or empty {kind}: {path}")
    if errors:
        raise ValueError("Upload file validation failed:\n" + "\n".join(errors))


def main(argv=None) -> int:
    args = parse_args(argv)

    # Verifying the connection must work before any album has been rendered.
    if args.check_auth:
        youtube = authenticate(args.client_secret, args.token)
        response = execute(
            youtube.channels().list(part="snippet,contentDetails,status", mine=True),
            "channels.list",
        )
        items = response.get("items", [])
        if not items:
            log("Signed in, but this Google account has no YouTube channel.")
            return 1
        for channel in items:
            log(f"Connected channel: {channel['snippet']['title']}")
            log(f"  channel id:      {channel['id']}")
            log(f"  url:             https://www.youtube.com/channel/{channel['id']}")
            log(f"  token cached in: {args.token}")
        log("\nIf this is the wrong channel, delete the token file and run again.")
        return 0

    album_dir = Path(args.album_dir)
    manifest_path = Path(args.manifest) if args.manifest else album_dir / "xx_youtube" / "upload_manifest.json"
    if not manifest_path.exists():
        sys.exit(
            f"Manifest not found: {manifest_path}\n"
            f"Run script/build_album_videos.rb {album_dir} and "
            f"script/build_youtube_metadata.rb {album_dir} first."
        )

    manifest = load_json(manifest_path, None)
    base = manifest_path.parent
    state_path = base / "upload_state.json"
    state = load_json(state_path, {"videos": {}, "playlist_id": None})
    state.setdefault("videos", {})
    state.setdefault("playlist_id", None)

    videos = manifest["videos"]
    if args.only:
        videos = [v for v in videos if v["key"] in args.only]
        if not videos:
            sys.exit(f"No manifest entries match --only {args.only}")

    # Privacy updates and thumbnail recovery do not require local video files.
    if args.dry_run or not (args.retry_thumbnails or args.update_privacy):
        required_videos = videos
        if not args.dry_run:
            required_videos = [v for v in videos if not state["videos"].get(v["key"], {}).get("video_id")]
            if args.max_uploads is not None:
                required_videos = required_videos[:max(0, args.max_uploads)]
        try:
            validate_upload_files(base, required_videos, include_thumbnails=not args.no_thumbnails)
        except ValueError as error:
            log(str(error))
            return 1

    if args.dry_run:
        log(f"Album:    {manifest['album']} by {manifest['artist']}")
        log(f"Manifest: {manifest_path}")
        log(f"Playlist: {manifest['playlist']['title']} ({manifest['playlist']['privacy']})")
        pending = 0
        for video in videos:
            done = state["videos"].get(video["key"], {}).get("video_id")
            privacy = args.privacy or video.get("privacy", "private")
            size_mb = (base / video["file"]).stat().st_size / 1e6
            mark = f"already uploaded ({done})" if done else f"would upload as {privacy}"
            if not done:
                pending += 1
            log(f"  [{video['key']}] {video['title']}  {size_mb:.0f} MB  -- {mark}")
        log(f"\n{pending} upload(s) pending. Default video-upload quota: "
            f"{DEFAULT_UPLOADS_PER_DAY}/day in a separate bucket.")
        log("Other API endpoints share 10,000 units/day. Remaining project quota is not checked by --dry-run.")
        return 0

    youtube = authenticate(args.client_secret, args.token)

    if args.retry_thumbnails:
        pending = [
            v for v in videos
            if state["videos"].get(v["key"], {}).get("video_id")
            and not state["videos"][v["key"]].get("thumbnail_set")
            and v.get("thumbnail")
        ]
        if not pending:
            log("All uploaded videos already have their thumbnail.")
            return 0
        for video in pending:
            entry = state["videos"][video["key"]]
            thumb_path = base / video["thumbnail"]
            if not thumb_path.exists():
                log(f"[{video['key']}] missing {thumb_path}, skipping")
                continue
            log(f"[{video['key']}] setting thumbnail for {entry['video_id']}")
            entry["thumbnail_set"] = set_thumbnail(youtube, entry["video_id"], thumb_path)
            save_json(state_path, state)
        return 0

    if args.update_privacy:
        for video in videos:
            entry = state["videos"].get(video["key"], {})
            video_id = entry.get("video_id")
            if not video_id:
                continue
            execute(
                youtube.videos().update(
                    part="status",
                    body={
                        "id": video_id,
                        "status": {
                            "privacyStatus": args.update_privacy,
                            "selfDeclaredMadeForKids": bool(video.get("made_for_kids", False)),
                            "license": video.get("license", "youtube"),
                            "embeddable": True,
                        },
                    },
                ),
                f"videos.update {video_id}",
            )
            entry["privacy"] = args.update_privacy
            log(f"[{video['key']}] {video_id} -> {args.update_privacy}")
        save_json(state_path, state)
        return 0

    uploaded_this_run = 0
    quota_hit = False

    try:
        for video in videos:
            key = video["key"]
            entry = state["videos"].get(key)
            if entry and entry.get("video_id"):
                log(f"[{key}] already uploaded as {entry['video_id']}, skipping")
                continue
            if args.max_uploads is not None and uploaded_this_run >= args.max_uploads:
                log(f"Reached --max-uploads {args.max_uploads}, stopping.")
                break

            media_path = base / video["file"]
            if not media_path.exists():
                log(f"[{key}] missing video file {media_path}, skipping")
                continue

            privacy = args.privacy or video.get("privacy", "private")
            log(f"[{key}] uploading {media_path.name} ({media_path.stat().st_size / 1e6:.0f} MB) as {privacy}")
            video_id = upload_video(youtube, video, media_path, privacy)
            state["videos"][key] = {
                "video_id": video_id,
                "title": video["title"],
                "privacy": privacy,
                "uploaded_at": datetime.now(timezone.utc).isoformat(),
            }
            save_json(state_path, state)
            uploaded_this_run += 1
            log(f"  https://youtu.be/{video_id}")

            thumbnail = video.get("thumbnail")
            if thumbnail and not args.no_thumbnails:
                thumb_path = base / thumbnail
                if thumb_path.exists():
                    state["videos"][key]["thumbnail_set"] = set_thumbnail(youtube, video_id, thumb_path)
                    save_json(state_path, state)

        if not args.no_playlist:
            track_videos = [v for v in manifest["videos"] if v.get("playlist_position") is not None]
            available = [v for v in track_videos if state["videos"].get(v["key"], {}).get("video_id")]
            if available:
                playlist_id = state.get("playlist_id")
                just_created = False
                if not playlist_id:
                    playlist_id, just_created = find_or_create_playlist(
                        youtube,
                        manifest["playlist"]["title"],
                        manifest["playlist"]["description"],
                        manifest["playlist"]["privacy"],
                    )
                    state["playlist_id"] = playlist_id
                    save_json(state_path, state)

                # A playlist created moments ago is empty and not yet queryable.
                existing = set() if just_created else playlist_video_ids(youtube, playlist_id)
                for video in sorted(available, key=lambda v: v["playlist_position"]):
                    video_id = state["videos"][video["key"]]["video_id"]
                    if video_id in existing:
                        continue
                    execute(
                        youtube.playlistItems().insert(
                            part="snippet",
                            body={
                                "snippet": {
                                    "playlistId": playlist_id,
                                    "position": video["playlist_position"],
                                    "resourceId": {"kind": "youtube#video", "videoId": video_id},
                                }
                            },
                        ),
                        f"playlistItems.insert {video['key']}",
                        tolerate_missing_playlist=True,
                    )
                    log(f"[{video['key']}] added to playlist at position {video['playlist_position']}")
    except QuotaExhausted as exhausted:
        quota_hit = True
        log(
            f"\nYouTube API quota exhausted while handling: {exhausted}\n"
            "Progress is saved in upload_state.json - re-run this command after the\n"
            "quota resets (midnight Pacific Time) to continue."
        )
    finally:
        save_json(state_path, state)
        write_urls_file(base / "youtube_urls.md", manifest, state)

    done = sum(1 for v in manifest["videos"] if state["videos"].get(v["key"], {}).get("video_id"))
    log(f"\n{done}/{len(manifest['videos'])} videos uploaded. URLs in {base / 'youtube_urls.md'}")
    return 1 if quota_hit else 0


if __name__ == "__main__":
    sys.exit(main())

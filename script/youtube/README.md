# YouTube Upload

One-time setup and day-to-day use of the automated YouTube release path.

## Pipeline

```sh
# 1. render one video per track plus the full-album video into <album>/xx_youtube/
script/build_album_videos.rb Network-Engineer-Album01

# 2. build titles, descriptions, tags, chapters -> upload_manifest.json
script/build_youtube_metadata.rb Network-Engineer-Album01

# 3. check what would be uploaded (no API calls, no credentials needed)
script/youtube/.venv/bin/python script/youtube/upload_youtube.py Network-Engineer-Album01 --dry-run

# 4. upload and build the playlist
script/youtube/.venv/bin/python script/youtube/upload_youtube.py Network-Engineer-Album01
```

Everything the pipeline needs beyond the prompt files lives in `<album>/album.yml`.
A new album needs a copy of that file, not a code change.

## One-time setup

### 1. Python environment

```sh
python3 -m venv script/youtube/.venv
script/youtube/.venv/bin/pip install -r script/youtube/requirements.txt
```

The virtualenv is git-ignored.

### 2. Google Cloud project and OAuth client

Newer consoles moved the consent screen under **Google Auth Platform**; the
older ones keep it under **APIs & Services → OAuth consent screen**. The steps
are the same either way.

1. Open <https://console.cloud.google.com/> and create a project, e.g.
   `kisound-youtube`. Make sure the project selector at the top shows it before
   continuing.
2. **APIs & Services → Library →** search for **YouTube Data API v3** and
   enable it. Without this every call fails with `accessNotConfigured`.
3. **OAuth consent screen / Google Auth Platform → Branding**: user type
   *External*, app name, your own email as support and developer contact.
4. **Audience → Test users**: add the Google account that owns the channel.
   While the app is in *Testing*, only listed accounts can authorise it.
5. **Data Access → Add or remove scopes**: add
   `https://www.googleapis.com/auth/youtube.upload` and
   `https://www.googleapis.com/auth/youtube`. Both are *sensitive* scopes, so
   the consent screen will warn that the app is unverified - expected.
6. **Clients → Create client → Desktop app**, then download the JSON.
7. Store it where the script looks for it:

```sh
mkdir -p ~/.config/kisound
mv ~/Downloads/client_secret_*.json ~/.config/kisound/youtube_client_secret.json
chmod 600 ~/.config/kisound/youtube_client_secret.json
```

Credentials deliberately live outside the repository. Override the locations
with `--client-secret` / `--token` or the environment variables
`KISOUND_YT_CLIENT_SECRET` and `KISOUND_YT_TOKEN`.

### 3. Authorise and verify

```sh
script/youtube/.venv/bin/python script/youtube/upload_youtube.py --check-auth
```

This opens a browser, asks for consent (click **Advanced → Go to … (unsafe)**
on the unverified-app warning), caches the refresh token in
`~/.config/kisound/youtube_token.json` with mode 600, and prints the channel it
is connected to. It costs one quota unit and uploads nothing.

Check the printed channel name. If the account owns several channels or a brand
account, the browser account chooser decides which one is used; to pick a
different one, delete the token file and run the command again.

Later runs are non-interactive.

**Keep the app out of *Testing* for automation.** In testing status Google
expires refresh tokens after seven days, so every run a week later asks for the
browser flow again. Setting the publishing status to *In production* on the
consent screen keeps the token valid; the app stays unverified either way, which
only means the warning screen stays and the app is capped at 100 users.

## Two limits that shape the workflow

**Custom thumbnails need a verified channel and are rate-limited.** Until the
channel is verified by phone at <https://www.youtube.com/verify>,
`thumbnails.set` fails outright. Even on a verified channel YouTube answers
`uploadRateLimitExceeded` (HTTP 429) after roughly ten thumbnails in quick
succession, which a full album release reaches. Either way the uploader logs it,
records `thumbnail_set: false` in the state file and keeps the finished upload.
Set the missing ones an hour or so later with:

```sh
script/youtube/.venv/bin/python script/youtube/upload_youtube.py Network-Engineer-Album01 \
  --retry-thumbnails
```

**Uploads are forced to private.** YouTube locks videos uploaded through an
API project that has not passed an audit to `private`, and they cannot be made
public from the API either. This is why `album.yml` sets `privacy: private`.
To lift it, submit the audit form linked from
<https://support.google.com/youtube/contact/yt_api_form> once the channel and
the uploads look final. Until then, flip visibility by hand in YouTube Studio,
or after the audit run:

```sh
script/youtube/.venv/bin/python script/youtube/upload_youtube.py Network-Engineer-Album01 \
  --update-privacy public
```

**Quota allows about six uploads per day.** The default quota is 10,000 units
per day; `videos.insert` costs 1,600, `playlistItems.insert` and
`thumbnails.set` cost 50 each. Eleven videos therefore need two days. The
script records every finished upload in `<album>/xx_youtube/upload_state.json`
and skips those on the next run, so the second day is just the same command
again. Use `--max-uploads N` to pace a run deliberately. Quota resets at
midnight Pacific Time.

## Useful flags

| Flag | Effect |
|---|---|
| `--check-auth` | sign in, print the connected channel, exit |
| `--dry-run` | print the plan, estimate quota, touch no API |
| `--only 00 --only album` | restrict the run to single manifest keys |
| `--max-uploads 6` | stop after N uploads this run (`0` = only fill the playlist) |
| `--privacy unlisted` | override the manifest visibility for this run |
| `--no-playlist` | skip playlist creation and insertion |
| `--no-thumbnails` | skip custom thumbnails (they need a verified channel) |
| `--retry-thumbnails` | set thumbnails a previous run could not set, then exit |
| `--update-privacy public` | patch already uploaded videos and exit |

## Files produced

| Path | Purpose |
|---|---|
| `xx_youtube/*.mp4` | one video per track plus `<Album>_Full_Album.mp4` |
| `xx_youtube/thumbnails/*.jpg` | 1280x720 thumbnails matching the video look |
| `xx_youtube/upload_manifest.json` | machine-readable upload input |
| `xx_youtube/youtube_upload_sheet.md` | same data for manual upload |
| `xx_youtube/upload_state.json` | video IDs, playlist ID, resume point |
| `xx_youtube/youtube_urls.md` | resulting URLs, rewritten after every run |

`xx_youtube/` is git-ignored like the other delivery folders; it can be
regenerated from the prompts, WAVs and `album.yml` at any time.

## Adding another album

1. Create the album folder with the usual `NN_Track_Name/` layout and final
   `*_1.0.txt` prompts.
2. Copy `Network-Engineer-Album01/album.yml` next to it and edit album title,
   artist, year, cover, per-track genre/theme/style/tags and the YouTube
   templates.
3. Run the four commands at the top of this file with the new album directory.

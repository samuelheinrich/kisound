"""Local regression tests; no OAuth flow or YouTube API calls."""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import subprocess
import tempfile
import threading
import unittest
from urllib.error import HTTPError
from urllib.request import urlopen
from unittest.mock import Mock, patch
import wave

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("upload_youtube", ROOT / "script/youtube/upload_youtube.py")
upload = importlib.util.module_from_spec(spec)
spec.loader.exec_module(upload)


class UploadTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.base = Path(self.tmp.name)
        self.video = {"key": "01", "file": "track.mp4", "thumbnail": "thumb.jpg",
                      "title": "Test", "description": "Beschreibung", "privacy": "private"}
        (self.base / "track.mp4").write_bytes(b"video")
        (self.base / "thumb.jpg").write_bytes(b"image")

    def test_languages_and_legacy_fallback(self):
        for fields, expected in [({}, "en"), ({"default_language": "de"}, "de"),
                                 ({"default_language": "en", "default_audio_language": "de"}, "de")]:
            with self.subTest(fields=fields):
                youtube = Mock()
                youtube.videos.return_value.insert.return_value.next_chunk.return_value = (None, {"id": "test"})
                with patch.object(upload, "MediaFileUpload"):
                    upload.upload_video(youtube, self.video | fields, self.base / "track.mp4", "private")
                snippet = youtube.videos.return_value.insert.call_args.kwargs["body"]["snippet"]
                self.assertEqual(snippet["defaultAudioLanguage"], expected)
                self.assertEqual(snippet["defaultLanguage"], fields.get("default_language", "en"))

    def test_missing_or_empty_inputs_fail(self):
        for filename in ["track.mp4", "thumb.jpg"]:
            p = self.base / filename
            original = p.read_bytes()
            for missing in [True, False]:
                with self.subTest(filename=filename, missing=missing):
                    p.unlink()
                    if not missing:
                        p.touch()
                    with self.assertRaises(ValueError):
                        upload.validate_upload_files(self.base, [self.video])
                    p.write_bytes(original)

    def test_no_thumbnails_allows_missing_thumbnail(self):
        (self.base / "thumb.jpg").unlink()
        upload.validate_upload_files(self.base, [self.video], include_thumbnails=False)

    def run_dry(self):
        manifest = self.base / "upload_manifest.json"
        manifest.write_text(json.dumps({"album": "Test", "artist": "Test",
                                       "playlist": {"title": "Test", "privacy": "private"},
                                       "videos": [self.video]}))
        output = io.StringIO()
        with patch.object(upload, "authenticate", side_effect=AssertionError("dry-run called OAuth")), \
             contextlib.redirect_stdout(output):
            code = upload.main(["--manifest", str(manifest), "--dry-run"])
        self.assertFalse((self.base / "upload_state.json").exists())
        self.assertFalse((self.base / "youtube_urls.md").exists())
        return code, output.getvalue()

    def test_dry_run_quota_and_no_side_effects(self):
        code, output = self.run_dry()
        self.assertEqual(code, 0)
        self.assertIn("1 upload(s) pending", output)
        self.assertIn("100/day in a separate bucket", output)
        self.assertIn("Remaining project quota is not checked", output)
        self.assertNotIn("1600", output)

    def test_dry_run_rejects_missing_media_without_oauth(self):
        (self.base / "track.mp4").unlink()
        code, output = self.run_dry()
        self.assertEqual(code, 1)
        self.assertIn("missing or empty video", output)

    def test_resume_does_not_require_media_for_completed_uploads(self):
        self.run_dry()
        (self.base / "upload_state.json").write_text(json.dumps({"videos": {"01": {"video_id": "done"}}}))
        (self.base / "track.mp4").unlink()
        with patch.object(upload, "authenticate", return_value=Mock()), \
             patch.object(upload, "upload_video") as send, contextlib.redirect_stdout(io.StringIO()):
            code = upload.main(["--manifest", str(self.base / "upload_manifest.json"), "--no-playlist"])
        self.assertEqual(code, 0)
        send.assert_not_called()


class MetadataTests(unittest.TestCase):
    def test_generator_languages_and_german_tracklist(self):
        for language, audio_language in [("en", None), ("de", "de"), ("en", "de")]:
            with self.subTest(language=language, audio_language=audio_language), tempfile.TemporaryDirectory() as tmp:
                album = Path(tmp) / "Album"
                track = album / "01_Test"
                out = album / "xx_youtube"
                track.mkdir(parents=True)
                out.mkdir()
                (track / "01_Test_1.0.txt").write_text("VERSION: 1.0\nTRACK: 01 - Test\nRELEASE AUDIO: audio.wav\n")
                with wave.open(str(track / "audio.wav"), "wb") as wav:
                    wav.setnchannels(1)
                    wav.setsampwidth(2)
                    wav.setframerate(8000)
                    wav.writeframes(b"\0\0" * 8000)
                # Real ffprobe duration without a slow video render.
                (out / "01_Test.mp4").write_bytes((track / "audio.wav").read_bytes())
                (out / "Test_Full_Album.mp4").write_bytes((track / "audio.wav").read_bytes())
                audio = f"  default_audio_language: {audio_language}\n" if audio_language else ""
                (album / "album.yml").write_text(
                    f"album: Test\nyoutube:\n  default_language: {language}\n{audio}"
                    "  description_template: '{tracklist}'\n  album_description_template: '{chapters}'\n")
                subprocess.run(["ruby", str(ROOT / "script/build_youtube_metadata.rb"), str(album)],
                               check=True, capture_output=True, text=True)
                manifest = json.loads((out / "upload_manifest.json").read_text())
                self.assertEqual(len(manifest["videos"]), 2)
                for video in manifest["videos"]:
                    self.assertEqual(video["default_language"], language)
                    self.assertEqual(video["default_audio_language"], audio_language or language)
                self.assertIn("Trackliste:" if language == "de" else "Tracklist:",
                              manifest["videos"][0]["description"])
                self.assertIn("0:00 01 Test", manifest["videos"][1]["description"])


class AuthenticationTests(unittest.TestCase):
    def test_revoked_refresh_token_reconnects_without_deleting_existing_token(self):
        with tempfile.TemporaryDirectory() as tmp:
            token = Path(tmp) / "token.json"
            secret = Path(tmp) / "client.json"
            token.write_text("old token")
            secret.write_text("client fixture")
            old = Mock(valid=False, expired=True, refresh_token="old")
            old.refresh.side_effect = upload.RefreshError("invalid_grant")
            renewed = Mock(valid=True)
            renewed.to_json.return_value = '{"renewed": true}'
            flow = Mock()
            with patch.object(upload.Credentials, "from_authorized_user_file", return_value=old), \
                 patch.object(upload.InstalledAppFlow, "from_client_secrets_file", return_value=flow), \
                 patch.object(upload, "browser_sign_in", return_value=renewed), \
                 patch.object(upload, "build") as build, contextlib.redirect_stdout(io.StringIO()):
                upload.authenticate(secret, token)
            self.assertEqual(json.loads(token.read_text()), {"renewed": True})
            self.assertEqual(token.stat().st_mode & 0o777, 0o600)
            self.assertEqual(build.call_args.kwargs["credentials"], renewed)

    def test_browser_timeout_preserves_existing_token(self):
        with tempfile.TemporaryDirectory() as tmp:
            token = Path(tmp) / "token.json"
            secret = Path(tmp) / "client.json"
            token.write_text("old token")
            secret.write_text("client fixture")
            old = Mock(valid=False, expired=True, refresh_token="old")
            old.refresh.side_effect = upload.RefreshError("invalid_grant")
            flow = Mock()
            with patch.object(upload.Credentials, "from_authorized_user_file", return_value=old), \
                 patch.object(upload.InstalledAppFlow, "from_client_secrets_file", return_value=flow), \
                 patch.object(upload, "browser_sign_in", side_effect=TimeoutError()), \
                 contextlib.redirect_stdout(io.StringIO()), self.assertRaises(SystemExit):
                upload.authenticate(secret, token)
            self.assertEqual(token.read_text(), "old token")

    def test_invalid_browser_response_preserves_existing_token(self):
        with tempfile.TemporaryDirectory() as tmp:
            token = Path(tmp) / "token.json"
            secret = Path(tmp) / "client.json"
            token.write_text("old token")
            secret.write_text("client fixture")
            old = Mock(valid=False, expired=True, refresh_token="old")
            old.refresh.side_effect = upload.RefreshError("invalid_grant")
            flow = Mock()
            with patch.object(upload.Credentials, "from_authorized_user_file", return_value=old), \
                 patch.object(upload.InstalledAppFlow, "from_client_secrets_file", return_value=flow), \
                 patch.object(upload, "browser_sign_in", side_effect=upload.OAuth2Error()), \
                 contextlib.redirect_stdout(io.StringIO()), self.assertRaises(SystemExit):
                upload.authenticate(secret, token)
            self.assertEqual(token.read_text(), "old token")

    def test_loopback_waits_through_unrelated_requests_and_rejects_wrong_state(self):
        flow = Mock()
        flow.authorization_url.return_value = ("https://example.invalid/authorize", "expected-state")
        responses = []
        worker = None

        def browse(*args, **kwargs):
            def requests():
                for suffix in ["favicon.ico", "?code=wrong&state=wrong-state", "?code=fixture&state=expected-state"]:
                    try:
                        with urlopen(flow.redirect_uri + suffix, timeout=3) as response:
                            responses.append(response.status)
                    except HTTPError as error:
                        responses.append(error.code)
                        error.close()
            nonlocal worker
            worker = threading.Thread(target=requests)
            worker.start()

        with patch.object(upload.webbrowser, "open", side_effect=browse):
            self.assertEqual(upload.browser_sign_in(flow, timeout_seconds=5), flow.credentials)
        worker.join(timeout=5)
        self.assertEqual(responses, [400, 400, 200])
        self.assertIn("code=fixture&state=expected-state", flow.fetch_token.call_args.kwargs["authorization_response"])


if __name__ == "__main__":
    unittest.main()

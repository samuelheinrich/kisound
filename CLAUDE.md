# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

Not a software project: it is an **AI-assisted music production repository**. The "source code" is
the set of text prompt files that were fed to a generative music service (Tad.ai); the build outputs
are WAV/MP3/FLAC files, covers and upload metadata. `script/` holds small Ruby release helpers.

`agent.md` is the pre-existing agent instruction file and is the authority on file hygiene, tagging
and git-ignore policy. Keep it and this file consistent when either changes.

## Release scripts

Ruby scripts (no gems, no Gemfile) plus one Python uploader. They expect `ffmpeg`/`ffprobe` on
`PATH`. Run them from the repo root; the album directory is the first argument and defaults to
`Network-Engineer-Album01`. Artist/album/year default to `album.yml` and only need to be passed to
override it.

```sh
# strip macOS download xattrs (kMDItemWhereFroms can leak tad.ai source URLs)
script/clean_macos_file_metadata.rb Network-Engineer-Album01

# write ID3-style tags into the release WAVs, in place (--dry-run to preview)
script/tag_album_wavs.rb Network-Engineer-Album01

# tagged 320k MP3 + FLAC compatibility exports (xx_mp3/, xx_flac/)
script/export_album_mp3_flac.rb Network-Engineer-Album01

# YouTube: render videos, build metadata, upload + playlist
script/build_album_videos.rb Network-Engineer-Album01
script/build_youtube_metadata.rb Network-Engineer-Album01
script/youtube/.venv/bin/python script/youtube/upload_youtube.py Network-Engineer-Album01 --dry-run
```

There are no tests, linters or build system. Verify changes by running the script and inspecting
output: `ffprobe -hide_banner <file>` for tags, `--dry-run` for the tagger and the uploader,
`--list` for the video builder.

Note that `tag_album_wavs.rb` rewrites each WAV **in place** (ffmpeg to a `.metadata_tmp.wav`, then
rename). Repeated runs are safe but the file is replaced, so ensure the working tree is clean first.

`script/lib/album.rb` is the shared model: it parses the final prompts, merges them with `album.yml`
and exposes `Album::Track` (number, title, slug, genre, theme, style, tags, cover, audio). Every
script goes through it; none of them parse prompts on their own.

## Album layout and naming

```
<Album-Name>/
  README.md              # release table: track, cover, duration, release WAV, theme, style
  tracklist.txt          # plain track order + durations
  cover/                 # album cover
  NN_Track_Name/         # one directory per track, NN = 00..09
    NN_Track_Name_<ver>-<variant>.wav          # generated audio candidates
    NN_Track_Name_<ver>-<variant>_commercial_license.pdf
    NN_Track_Name_cover.png
    NN_Track_Name_1.0.txt                      # FINAL prompt, points at the chosen WAV
  album.yml              # release config: artist, year, per-track metadata, video + YouTube settings
  xx_mp3/  xx_flac/  xx_telegram/  xx_soundcloud/  xx_youtube/   # delivery folders, all git-ignored
```

- `_0.3-1` style suffixes are `promptVersion-generatedVariant`. They are internal only and never
  appear in a public track title.
- Only the `*_1.0.txt` file is the final prompt. Older prompt versions get deleted once a release
  is picked (see commit "Remove obsolete prompt versions").
- Anything under `xx_*` is a local delivery artifact and stays out of git (`.gitignore`).

## Prompt file format (this is what the scripts parse)

Final prompt files are `KEY: value` headers followed by free-text blocks:

```
VERSION: 1.0
ALBUM: Network Engineer Album
TRACK: 08 - MTU
THEMA: ...
VORGESCHLAGENE ZEIT: 4:10
STATUS: Final
RELEASE AUDIO: 08_MTU_0.2-2.wav

LYRIC PROMPT:
...

STYLE PROMPT:
...
```

`tag_album_wavs.rb` and `export_album_mp3_flac.rb` read only `TRACK` (split on the first `-` into
number and title) and `RELEASE AUDIO` (a filename resolved relative to the prompt's own directory).
Renaming those keys, or the `NN_*/**_1.0.txt` glob shape, breaks both scripts silently — they just
`warn` and skip.

Conventions inside the prompts: lyrics are English, style/direction text is German, and every style
prompt ends with an instruction not to sing the section names and to avoid recognizable melody
references.

## album.yml

Per-album config, read by every script through `Album::Config`. It carries what the prompts do not:
artist/album/year, the cover path, per-track `genre` / `theme` / `style` / `tags`, the video
rendering parameters, and the YouTube title/description templates. Adding a new album means copying
and editing this file — no script should need a code change. Tracks missing from `tracks:` fall back
to genre `Electronic` and empty theme/style.

Track numbering starts at `00`, but the ID3 `track` field is written as `index + 1`, so file `00` is
tagged track `1/10`. That mismatch is intentional; don't "fix" it without checking the exports.

## YouTube pipeline

`build_album_videos.rb` renders one 1080p video per track — blurred cover as background, sharp cover
breathing on top, slow hue wave, pulsing vignette — plus 1280x720 thumbnails.

Two shortcuts make this fast, and both constrain how the animation may be changed:

- Every effect is a function of `t` whose period divides `video.loop_seconds`, so only that one
  seamless loop is encoded per track; the track video is the loop stream-copied under the audio.
  Adding an effect with a period that does not divide `loop_seconds` produces a visible jump every
  loop — the script warns about it rather than failing.
- `-shortest` cannot end that mux (ffmpeg flushes whole extra loops past the audio), so the length is
  set explicitly from the WAV's probed duration.

The full-album video is a **stream copy concat of the already rendered track videos**, so it inherits
each track's own cover animation and costs almost nothing; re-rendering a single track invalidates it.
Blurred background and oversampled cover are cached as PNGs in `xx_youtube/.cache/`.

`build_youtube_metadata.rb` turns `album.yml` templates into `xx_youtube/upload_manifest.json`,
measuring chapter timestamps from the rendered MP4s (not the WAVs) so they stay accurate. It clamps
titles to 100 chars, descriptions to 5000, and the tag list to YouTube's shared 500-char budget.

`script/youtube/upload_youtube.py` (needs `script/youtube/.venv`) consumes the manifest and is
resumable: every finished upload is written to `xx_youtube/upload_state.json` and skipped next run.
That matters because the default API quota is ~6 uploads/day, and because uploads from an unaudited
API project are force-locked to `private` by YouTube. `script/youtube/README.md` has the Google Cloud
setup and both limits in full. OAuth credentials live in `~/.config/kisound/`, never in the repo.

## Licensing and publishing constraints

- Tad.ai commercial license PDFs live next to the WAV they cover. They grant usage rights only —
  they are not copyright registration and do not guarantee originality or distributor acceptance.
- SoundCloud uploads are manual: `xx_soundcloud/soundcloud_upload_sheet.md` is the copy/paste sheet,
  URLs get pasted back into `soundcloud_urls.md`. Never commit tokens, cookies, OAuth or session
  material into that folder (it has its own defensive `.gitignore`).

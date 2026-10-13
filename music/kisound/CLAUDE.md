# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This directory holds the music sources in a shared repository with code videos
(`../../videos/kisound/`) and the website (`../../web/kisound/`). Prompts,
release metadata and transcripts describe the albums; WAV/MP3/FLAC files stay
local. `script/` holds the music release helpers.

`agent.md` is the pre-existing agent instruction file and is the authority on file hygiene, tagging
and git-ignore policy. Keep it and this file consistent when either changes.

## Release scripts

Ruby scripts (no gems, no Gemfile) plus one Python uploader. They expect `ffmpeg`/`ffprobe` on
`PATH`. Run them from `music/kisound`; the album directory is the first argument and defaults to
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

Tests live in `script/tests/`. Also inspect release output with `ffprobe -hide_banner <file>`
for tags, `--dry-run` for the tagger and uploader, and `--list` for the video builder.

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
  NN_Track_Name/         # one directory per track; album 01: 00..09, album 02: 01..08
    NN_Track_Name_<ver>-<variant>.wav          # generated audio candidates
    NN_Track_Name_<ver>-<variant>_commercial_license.pdf
    NN_Track_Name_cover.png
    NN_Track_Name_1.0.txt                      # FINAL prompt, points at the chosen WAV
  album.yml              # release config: artist, year, per-track metadata, video + YouTube settings
  xx_mp3/  xx_flac/  xx_telegram/  xx_soundcloud/  xx_youtube/   # local delivery folders; URL tables are tracked
```

- `_0.3-1` style suffixes are `promptVersion-generatedVariant`. They are internal only and never
  appear in a public track title.
- Only the `*_1.0.txt` file is the final prompt for the Network Engineer albums.
  Older drafts of Album 02 and the candidate structures of draft albums remain in their archives.
- The `xx_*` delivery folders stay local except for `youtube_urls.md` and
  `soundcloud_urls.md`, which the website reads.

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

Conventions inside the prompts: the style/direction text is always German, and every style prompt
ends with an instruction not to sing the section names and to avoid recognizable melody references.
The lyric language is per album — album 01 is English, album 02 is German with the networking
vocabulary left in English. When an album is not sung in English its style prompts must say so
explicitly, or the generator defaults to English vocals; those albums also carry a `SPRACHE:` header
in the prompt files. The section labels (Intro, Verse, Chorus …) stay English either way. New and revised Suno style prompts follow the labelled schema and separate option placeholders in `agent.md`, section "Suno Prompt Format".

## album.yml

Per-album config, read by every script through `Album::Config`. It carries what the prompts do not:
artist/album/year, the cover path, per-track `genre` / `theme` / `style` / `tags`, the video
rendering parameters, and the YouTube title/description templates. Adding a new album means copying
and editing this file — no script should need a code change. Tracks missing from `tracks:` fall back
to genre `Electronic` and empty theme/style.

Album 01 track filenames start at `00`; album 02 starts at `01`. The ID3 `track` field
is always written as the track's position (`index + 1`) divided by the album total,
independent of the filename prefix. Thus both albums' first track is tagged `1/total`.

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
That matters because the default API quota has a separate 100 uploads/day bucket, and because uploads from an unaudited
API project are force-locked to `private` by YouTube. `script/youtube/README.md` has the Google Cloud
setup and both limits in full. OAuth credentials live in `~/.config/kisound/`, never in the repo.

## Code-based music videos

Some tracks get a hand-built video instead of the animated-cover video from `build_album_videos.rb`.
Those projects live in `../../videos/kisound/<Album>/<NN-track>/` (Node +
Three.js, renderer carried over from an earlier film project). They read the track's audio and its timed
transcript (`NN_Track_Transkript.json`, which carries the audio's sha256) from the track folder by
relative path. Every such track folder has an `NN_Track_Video.md` pointer that names the files the
video depends on — don't rename or move those without updating the video project. First one:
`Network-Engineer-Album02/03_TrustSec/03_TrustSec_Video.md`.

The full production handbook is `../../videos/kisound/PRODUKTION.md`. Read it before starting a new piece.

## Website (kisound.ch)

The website is built in `../../web/kisound`. It reads the music sources: final
prompts (`TRACK`, `RELEASE AUDIO`, `LYRIC PROMPT`), the release WAVs, `NN_*_cover.png`, `album.yml`
(album text, genre/theme/style/tags) and the `xx_youtube`/`xx_soundcloud` URL tables. Which albums
are public is decided in `web/kisound/site.config.json`, not here. Renaming those keys or files
changes the site on its next build; run `npm run build && npm run check` there afterwards.

## Licensing and publishing constraints

- Tad.ai commercial license PDFs live next to the WAV they cover. They grant usage rights only —
  they are not copyright registration and do not guarantee originality or distributor acceptance.
- SoundCloud uploads are manual: `xx_soundcloud/soundcloud_upload_sheet.md` is the copy/paste sheet,
  URLs get pasted back into `soundcloud_urls.md`. Never commit tokens, cookies, OAuth or session
  material into that folder (it has its own defensive `.gitignore`).

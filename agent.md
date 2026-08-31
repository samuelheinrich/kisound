# Agent Notes

## Album Configuration

Every album directory carries an `album.yml` that is the single source of truth
for the release automation: artist, album title, year, cover, per-track genre /
theme / style / tags, video rendering parameters and the YouTube templates.

Adding a new album means copying and editing that file - no script needs to be
changed. Scripts share `script/lib/album.rb`, which parses the final `*_1.0.txt`
prompts and merges them with `album.yml`.

## Audio File Hygiene

After downloading or generating audio/image/license files from external services, remove local macOS download metadata before release work.

Use:

```sh
script/clean_macos_file_metadata.rb Network-Engineer-Album01
```

This removes local Finder extended attributes such as:

- `com.apple.metadata:kMDItemWhereFroms`
- `com.apple.quarantine`
- `com.apple.provenance`

These attributes can contain source URLs like `https://tad.ai/...`. They are not audio tags and usually are not committed to Git, but they are visible in Finder file info and should be removed from release/export folders.

## Audio Tags

Final release WAV files should include embedded metadata so players do not show `Unknown Artist`.

Use:

```sh
script/tag_album_wavs.rb Network-Engineer-Album01 "Samuel Heinrich" "Network Engineer" 2026
```

The script reads each final `*_1.0.txt` file, finds its `RELEASE AUDIO`, and writes metadata:

- title
- artist
- album
- album artist where supported
- track number
- genre
- date
- comment

WAV metadata support varies by playback device. For car stereos, tagged MP3 or FLAC files are usually more reliable.

## MP3 / FLAC Exports

Create tagged compatibility exports from the final WAV files with:

```sh
script/export_album_mp3_flac.rb Network-Engineer-Album01 "Samuel Heinrich" "Network Engineer" 2026
```

Outputs are written to:

- `Network-Engineer-Album01/xx_mp3/`
- `Network-Engineer-Album01/xx_flac/`

These export folders are intentionally ignored by Git.

The export script embeds track cover images when available and falls back to the album cover.

## YouTube Release

Three steps, all reproducible for future albums:

```sh
# 1. render a video per track (animated cover) plus the full-album video
script/build_album_videos.rb Network-Engineer-Album01

# 2. build titles, descriptions, tags and chapter timestamps
script/build_youtube_metadata.rb Network-Engineer-Album01

# 3. upload and build the playlist
script/youtube/.venv/bin/python script/youtube/upload_youtube.py Network-Engineer-Album01
```

Output goes to `Network-Engineer-Album01/xx_youtube/` (git-ignored).

Two constraints drive the workflow and are documented in
`script/youtube/README.md`:

- Uploads from an unaudited API project are locked to `private` by YouTube.
- The default API quota allows roughly six uploads per day, so an eleven video
  album takes two runs. `upload_state.json` records what is done and the next
  run continues from there.

OAuth credentials live in `~/.config/kisound/`, never in the repository.

## Git Ignore Policy

Local delivery/export folders should stay out of Git:

- `xx_telegram/`
- `xx_soundcloud/`
- `xx_mp3/`
- `xx_flac/`
- `xx_youtube/`

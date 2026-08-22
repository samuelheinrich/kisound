# Agent Notes

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

## Git Ignore Policy

Local delivery/export folders should stay out of Git:

- `xx_telegram/`
- `xx_soundcloud/`
- `xx_mp3/`
- `xx_flac/`

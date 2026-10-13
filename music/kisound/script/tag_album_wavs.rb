#!/usr/bin/env ruby
# frozen_string_literal: true

# Writes embedded metadata into the release WAV files so players do not show
# "Unknown Artist". Track data comes from the final prompts and album.yml.
#
#   script/tag_album_wavs.rb [album_dir] [artist] [album] [year] [--dry-run]
#
# Each WAV is rewritten in place (ffmpeg to a temp file, then rename), so run
# this on a clean working tree.

require 'fileutils'

$LOAD_PATH.unshift(File.expand_path('lib', __dir__))
require 'album'

dry_run = ARGV.delete('--dry-run') ? true : false

Album.require_tool!('ffmpeg')
album_dir, cfg = Album.load(ARGV[0])
artist = ARGV[1] || cfg.artist
album = ARGV[2] || cfg.album
year = ARGV[3] || cfg.year

def tag_wav(path, metadata)
  tmp = "#{path}.metadata_tmp.wav"
  cmd = ['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', path, '-map', '0:a', '-c:a', 'copy']
  metadata.each do |key, value|
    next if value.nil? || value.to_s.empty?

    cmd += ['-metadata', "#{key}=#{value}"]
  end
  cmd << tmp

  ok = system(*cmd)
  abort "ffmpeg failed for #{path}" unless ok && File.exist?(tmp) && File.size(tmp).positive?

  File.rename(tmp, path)
end

Album.tracks(album_dir, cfg) { |warning| warn warning }.each do |track|
  metadata = {
    'title' => track.display_title,
    'artist' => artist,
    'album_artist' => artist,
    'album' => album,
    'track' => track.track_field,
    'genre' => track.genre,
    'date' => year,
    'comment' => "#{album} album by #{artist}"
  }

  if dry_run
    puts "#{track.audio_path}\n  #{metadata.map { |k, v| "#{k}=#{v}" }.join(' | ')}"
  else
    tag_wav(track.audio_path, metadata)
    puts "tagged #{track.audio_path}"
  end
end

#!/usr/bin/env ruby
# frozen_string_literal: true

# Creates tagged MP3 and FLAC compatibility exports from the release WAV files,
# with the track cover embedded as attached picture (album cover as fallback).
#
#   script/export_album_mp3_flac.rb [album_dir] [artist] [album] [year]
#
# Outputs land in <album>/xx_mp3/ and <album>/xx_flac/, both git-ignored.

require 'fileutils'

$LOAD_PATH.unshift(File.expand_path('lib', __dir__))
require 'album'

Album.require_tool!('ffmpeg')
album_dir, cfg = Album.load(ARGV[0])
artist = ARGV[1] || cfg.artist
album = ARGV[2] || cfg.album
year = ARGV[3] || cfg.year

mp3_dir = File.join(album_dir, 'xx_mp3')
flac_dir = File.join(album_dir, 'xx_flac')
FileUtils.mkdir_p(mp3_dir)
FileUtils.mkdir_p(flac_dir)

def metadata_args(metadata)
  metadata.flat_map do |key, value|
    next [] if value.nil? || value.to_s.empty?

    ['-metadata', "#{key}=#{value}"]
  end
end

def run_ffmpeg(cmd, output)
  ok = system(*cmd)
  abort "ffmpeg failed for #{output}" unless ok && File.exist?(output) && File.size(output).positive?
end

Album.tracks(album_dir, cfg) { |warning| warn warning }.each do |track|
  cover = track.cover_path
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

  mp3_out = File.join(mp3_dir, "#{track.slug}.mp3")
  flac_out = File.join(flac_dir, "#{track.slug}.flac")

  mp3_cmd = ['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', track.audio_path]
  if cover
    mp3_cmd += ['-i', cover, '-map', '0:a:0', '-map', '1:v:0', '-c:a', 'libmp3lame', '-b:a', '320k',
                '-c:v', 'mjpeg', '-disposition:v', 'attached_pic', '-id3v2_version', '3']
  else
    mp3_cmd += ['-map', '0:a:0', '-c:a', 'libmp3lame', '-b:a', '320k', '-id3v2_version', '3']
  end
  mp3_cmd += metadata_args(metadata)
  mp3_cmd << mp3_out
  run_ffmpeg(mp3_cmd, mp3_out)
  puts "wrote #{mp3_out}"

  flac_cmd = ['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', track.audio_path]
  if cover
    flac_cmd += ['-i', cover, '-map', '0:a:0', '-map', '1:v:0', '-c:a', 'flac', '-compression_level', '8',
                 '-c:v', 'copy', '-disposition:v', 'attached_pic']
  else
    flac_cmd += ['-map', '0:a:0', '-c:a', 'flac', '-compression_level', '8']
  end
  flac_cmd += metadata_args(metadata)
  flac_cmd << flac_out
  run_ffmpeg(flac_cmd, flac_out)
  puts "wrote #{flac_out}"
end

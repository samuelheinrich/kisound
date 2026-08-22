#!/usr/bin/env ruby
# frozen_string_literal: true

require 'fileutils'

album_dir = ARGV[0] || 'Network-Engineer-Album01'
artist = ARGV[1] || 'Samuel Heinrich'
album = ARGV[2] || 'Network Engineer'
year = ARGV[3] || Time.now.year.to_s

unless Dir.exist?(album_dir)
  warn "Album directory does not exist: #{album_dir}"
  exit 1
end

genre_by_number = {
  '00' => 'Industrial Electro',
  '01' => 'Techno',
  '02' => 'Trance',
  '03' => 'Electronic',
  '04' => 'Industrial Techno',
  '05' => 'Drum & Bass',
  '06' => 'Progressive Trance',
  '07' => 'Psytrance',
  '08' => 'UK Garage',
  '09' => 'Progressive Trance'
}

mp3_dir = File.join(album_dir, 'xx_mp3')
flac_dir = File.join(album_dir, 'xx_flac')
FileUtils.mkdir_p(mp3_dir)
FileUtils.mkdir_p(flac_dir)

final_prompts = Dir[File.join(album_dir, '[0-9][0-9]_*', '*_1.0.txt')].sort
abort "No final prompt files found in #{album_dir}" if final_prompts.empty?

def extract_field(text, name)
  text[/^#{Regexp.escape(name)}:\s*(.+)$/i, 1]&.strip
end

def safe_name(number, title)
  clean = title.gsub(/[^0-9A-Za-z]+/, '_').gsub(/_+/, '_').gsub(/^_|_$/, '')
  "#{number}_#{clean}"
end

def cover_for(track_dir, album_dir)
  Dir[File.join(track_dir, '*_cover.{png,jpg,jpeg}')].first ||
    Dir[File.join(album_dir, 'cover', '*.{png,jpg,jpeg}')].first
end

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

final_prompts.each_with_index do |prompt, index|
  text = File.read(prompt)
  track_line = extract_field(text, 'TRACK')
  release_audio = extract_field(text, 'RELEASE AUDIO')
  unless track_line && release_audio
    warn "Skipping #{prompt}: missing TRACK or RELEASE AUDIO"
    next
  end

  number, title = track_line.split('-', 2).map(&:strip)
  track_number = number[/\d+/] || format('%02d', index)
  track_dir = File.dirname(prompt)
  wav_path = File.join(track_dir, release_audio)
  unless File.exist?(wav_path)
    warn "Skipping #{prompt}: missing release audio #{wav_path}"
    next
  end

  display_title = "#{track_number} #{title}"
  base = safe_name(track_number, title)
  cover = cover_for(track_dir, album_dir)
  metadata = {
    'title' => display_title,
    'artist' => artist,
    'album_artist' => artist,
    'album' => album,
    'track' => "#{index + 1}/#{final_prompts.length}",
    'genre' => genre_by_number[track_number] || 'Electronic',
    'date' => year,
    'comment' => "#{album} album by #{artist}"
  }

  mp3_out = File.join(mp3_dir, "#{base}.mp3")
  flac_out = File.join(flac_dir, "#{base}.flac")

  mp3_cmd = ['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', wav_path]
  if cover
    mp3_cmd += ['-i', cover, '-map', '0:a:0', '-map', '1:v:0', '-c:a', 'libmp3lame', '-b:a', '320k', '-c:v', 'mjpeg', '-disposition:v', 'attached_pic', '-id3v2_version', '3']
  else
    mp3_cmd += ['-map', '0:a:0', '-c:a', 'libmp3lame', '-b:a', '320k', '-id3v2_version', '3']
  end
  mp3_cmd += metadata_args(metadata)
  mp3_cmd << mp3_out
  run_ffmpeg(mp3_cmd, mp3_out)
  puts "wrote #{mp3_out}"

  flac_cmd = ['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', wav_path]
  if cover
    flac_cmd += ['-i', cover, '-map', '0:a:0', '-map', '1:v:0', '-c:a', 'flac', '-compression_level', '8', '-c:v', 'copy', '-disposition:v', 'attached_pic']
  else
    flac_cmd += ['-map', '0:a:0', '-c:a', 'flac', '-compression_level', '8']
  end
  flac_cmd += metadata_args(metadata)
  flac_cmd << flac_out
  run_ffmpeg(flac_cmd, flac_out)
  puts "wrote #{flac_out}"
end

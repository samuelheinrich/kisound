#!/usr/bin/env ruby
# frozen_string_literal: true

require 'fileutils'
require 'shellwords'

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

final_prompts = Dir[File.join(album_dir, '[0-9][0-9]_*', '*_1.0.txt')].sort
abort "No final prompt files found in #{album_dir}" if final_prompts.empty?

def extract_field(text, name)
  text[/^#{Regexp.escape(name)}:\s*(.+)$/i, 1]&.strip
end

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

final_prompts.each_with_index do |prompt, index|
  text = File.read(prompt)
  track_line = extract_field(text, 'TRACK')
  release_audio = extract_field(text, 'RELEASE AUDIO')
  unless track_line && release_audio
    warn "Skipping #{prompt}: missing TRACK or RELEASE AUDIO"
    next
  end

  number, title = track_line.split('-', 2).map(&:strip)
  wav_path = File.join(File.dirname(prompt), release_audio)
  unless File.exist?(wav_path)
    warn "Skipping #{prompt}: missing release audio #{wav_path}"
    next
  end

  track_number = number[/\d+/] || format('%02d', index)
  display_title = "#{track_number} #{title}"
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

  tag_wav(wav_path, metadata)
  puts "tagged #{wav_path}"
end

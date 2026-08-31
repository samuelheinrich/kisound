#!/usr/bin/env ruby
# frozen_string_literal: true

# Builds the YouTube upload manifest for an album.
#
# Reads album.yml plus the rendered videos in <album>/xx_youtube/ and writes:
#
#   xx_youtube/upload_manifest.json     machine-readable input for the uploader
#   xx_youtube/youtube_upload_sheet.md  human-readable copy of the same data
#   xx_youtube/youtube_urls.md          table to collect the resulting URLs
#
# Chapter timestamps for the full-album video are measured from the rendered
# track videos, so they stay correct even if a track is re-rendered.
#
#   script/build_youtube_metadata.rb [album_dir]

require 'fileutils'
require 'json'
require 'time'

$LOAD_PATH.unshift(File.expand_path('lib', __dir__))
require 'album'

# YouTube API limits.
TITLE_LIMIT = 100
DESCRIPTION_LIMIT = 5000
TAGS_TOTAL_LIMIT = 500

Album.require_tool!('ffprobe')
album_dir, cfg = Album.load(ARGV[0])
tracks = Album.tracks(album_dir, cfg) { |warning| warn warning }

out_dir = File.join(album_dir, 'xx_youtube')
thumb_dir = File.join(out_dir, 'thumbnails')
unless Dir.exist?(out_dir)
  abort "#{out_dir} does not exist. Run script/build_album_videos.rb #{album_dir} first."
end

yt = cfg.youtube
album_slug = cfg.album.gsub(/[^0-9A-Za-z]+/, '_').gsub(/^_|_$/, '')
album_video = File.join(out_dir, "#{album_slug}_Full_Album.mp4")

def fill(template, values)
  return '' unless template

  values.reduce(template.dup) do |text, (key, value)|
    text.gsub("{#{key}}", value.to_s)
  end.gsub(/\n{3,}/, "\n\n").strip
end

def clamp_title(title)
  return title if title.length <= TITLE_LIMIT

  warn "Title too long (#{title.length} > #{TITLE_LIMIT}), truncating: #{title}"
  "#{title[0, TITLE_LIMIT - 1].rstrip}…"
end

def clamp_description(description)
  return description if description.length <= DESCRIPTION_LIMIT

  warn "Description too long (#{description.length} > #{DESCRIPTION_LIMIT}), truncating."
  description[0, DESCRIPTION_LIMIT]
end

# YouTube counts the whole tag list, quotes included, against one 500 char
# budget. Drop tags from the end until it fits instead of letting the API
# reject the whole insert.
def clamp_tags(tags)
  kept = []
  length = 0
  tags.each do |tag|
    clean = tag.to_s.strip
    next if clean.empty? || kept.any? { |k| k.casecmp?(clean) }

    cost = clean.length + (clean.include?(' ') ? 2 : 0) + (kept.empty? ? 0 : 1)
    break if length + cost > TAGS_TOTAL_LIMIT

    kept << clean
    length += cost
  end
  warn "Dropped #{tags.length - kept.length} tag(s) to stay under #{TAGS_TOTAL_LIMIT} characters." if kept.length < tags.length
  kept
end

common_tags = yt['common_tags'] || []
base_values = {
  'artist' => cfg.artist,
  'album' => cfg.album,
  'year' => cfg.year,
  'track_total' => tracks.length
}
footer = fill(yt['footer'], base_values)

tracklist_lines = tracks.map { |t| "#{t.number}  #{t.title}" }
tracklist = "Tracklist:\n#{tracklist_lines.join("\n")}"

videos = []

tracks.each do |track|
  video_path = File.join(out_dir, "#{track.slug}.mp4")
  unless File.exist?(video_path)
    warn "Skipping #{track.display_title}: #{video_path} not rendered yet."
    next
  end

  values = base_values.merge(
    'number' => track.number,
    'title' => track.title,
    'track_number' => track.number,
    'genre' => track.genre,
    'theme' => track.theme.to_s,
    'style' => track.style.to_s,
    'tracklist' => tracklist,
    'footer' => footer
  )

  thumb = File.join(thumb_dir, "#{track.slug}.jpg")
  videos << {
    'key' => track.number,
    'kind' => 'track',
    'file' => "#{track.slug}.mp4",
    'thumbnail' => File.exist?(thumb) ? "thumbnails/#{track.slug}.jpg" : nil,
    'title' => clamp_title(fill(yt['title_template'] || '{artist} - {title} | {album}', values)),
    'description' => clamp_description(fill(yt['description_template'], values)),
    'tags' => clamp_tags(track.tags + common_tags),
    'category_id' => (yt['category_id'] || '10').to_s,
    'privacy' => yt['privacy'] || 'private',
    'made_for_kids' => yt.fetch('made_for_kids', false),
    'license' => yt['license'] || 'youtube',
    'default_language' => yt['default_language'] || 'en',
    'playlist_position' => track.index
  }.compact
end

if File.exist?(album_video)
  offset = 0.0
  chapter_lines = tracks.map do |track|
    line = "#{Album.format_timestamp(offset)} #{track.number} #{track.title}"
    rendered = File.join(out_dir, "#{track.slug}.mp4")
    offset += (Album.duration_seconds(rendered) || Album.duration_seconds(track.audio_path) || 0)
    line
  end
  # YouTube only enables chapters when the first one starts at 0:00.
  chapter_lines[0] = chapter_lines[0].sub(/^\S+/, '0:00')

  values = base_values.merge(
    'title' => cfg.album,
    'chapters' => chapter_lines.join("\n"),
    'tracklist' => tracklist,
    'album_description' => fill(yt['album_description'], base_values),
    'footer' => footer
  )

  album_thumb = File.join(thumb_dir, "#{album_slug}_Full_Album.jpg")
  videos << {
    'key' => 'album',
    'kind' => 'album',
    'file' => File.basename(album_video),
    'thumbnail' => File.exist?(album_thumb) ? "thumbnails/#{album_slug}_Full_Album.jpg" : nil,
    'title' => clamp_title(fill(yt['album_title_template'] || '{artist} - {album} (Full Album)', values)),
    'description' => clamp_description(fill(yt['album_description_template'], values)),
    'tags' => clamp_tags(['full album', cfg.album, cfg.artist] + common_tags),
    'category_id' => (yt['category_id'] || '10').to_s,
    'privacy' => yt['privacy'] || 'private',
    'made_for_kids' => yt.fetch('made_for_kids', false),
    'license' => yt['license'] || 'youtube',
    'default_language' => yt['default_language'] || 'en',
    'playlist_position' => nil
  }.compact
else
  warn "No full-album video at #{album_video} (run build_album_videos.rb without --no-album-video)."
end

abort 'No videos found to describe.' if videos.empty?

playlist_cfg = yt['playlist'] || {}
manifest = {
  'generated_at' => Time.now.utc.iso8601,
  'album' => cfg.album,
  'artist' => cfg.artist,
  'year' => cfg.year,
  'album_dir' => album_dir,
  'playlist' => {
    'title' => playlist_cfg['title'] || cfg.album,
    'description' => fill(yt['album_description'], base_values),
    'privacy' => playlist_cfg['privacy'] || yt['privacy'] || 'private'
  },
  'videos' => videos
}

manifest_path = File.join(out_dir, 'upload_manifest.json')
File.write(manifest_path, "#{JSON.pretty_generate(manifest)}\n")
puts "wrote #{manifest_path} (#{videos.length} videos)"

sheet = +"# YouTube Upload Sheet - #{cfg.album}\n\n"
sheet << "Generated by `script/build_youtube_metadata.rb`. Uploaded automatically by\n"
sheet << "`script/youtube/upload_youtube.py`; this file is the manual fallback.\n\n"
sheet << "- Playlist: `#{manifest['playlist']['title']}` (#{manifest['playlist']['privacy']})\n"
sheet << "- Category: `#{videos.first['category_id']}` (10 = Music)\n"
sheet << "- Default visibility: `#{videos.first['privacy']}`\n\n"
videos.each do |video|
  sheet << "## #{video['key']} #{video['title']}\n\n"
  sheet << "- File: `#{video['file']}`\n"
  sheet << "- Thumbnail: `#{video['thumbnail'] || '(none)'}`\n"
  sheet << "- Tags: `#{video['tags'].join(', ')}`\n\n"
  sheet << "```\n#{video['description']}\n```\n\n"
end
sheet_path = File.join(out_dir, 'youtube_upload_sheet.md')
File.write(sheet_path, sheet)
puts "wrote #{sheet_path}"

urls_path = File.join(out_dir, 'youtube_urls.md')
unless File.exist?(urls_path)
  urls = +"# YouTube URLs - #{cfg.album}\n\nFilled in automatically after upload.\n\n"
  urls << "| # | Title | URL |\n|---|---|---|\n"
  videos.each { |v| urls << "| #{v['key']} | #{v['title']} |  |\n" }
  urls << "\nPlaylist URL:\n"
  File.write(urls_path, urls)
  puts "wrote #{urls_path}"
end

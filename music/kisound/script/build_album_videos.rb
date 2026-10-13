#!/usr/bin/env ruby
# frozen_string_literal: true

# Renders one YouTube video per track from the release WAV and the track cover,
# plus a concatenated full-album video, into <album>/xx_youtube/.
#
# The animation is deliberately cheap: a blurred, darkened copy of the cover
# fills the 16:9 frame, the sharp cover breathes on top of it, and a slow hue
# wave plus a pulsing vignette run over the whole picture.
#
# Because every effect is a function of time with a period that divides
# video.loop_seconds, only that one loop is encoded per track; the track video
# is then a stream copy of the loop repeated under the audio. Rendering a whole
# album therefore costs about as much as rendering a few seconds per track.
#
#   script/build_album_videos.rb [album_dir] [options]
#
#     --force            re-render even if the output is newer than its inputs
#     --only NN          render a single track number (repeatable)
#     --no-album-video   skip the concatenated full-album video
#     --list             show what would be rendered and exit

require 'fileutils'
require 'shellwords'

$LOAD_PATH.unshift(File.expand_path('lib', __dir__))
require 'album'

options = { force: false, only: [], album_video: true, list: false }
positional = []
args = ARGV.dup
until args.empty?
  arg = args.shift
  case arg
  when '--force' then options[:force] = true
  when '--only' then options[:only] << args.shift.to_s.rjust(2, '0')
  when '--no-album-video' then options[:album_video] = false
  when '--list' then options[:list] = true
  when '-h', '--help'
    doc = File.readlines(__FILE__).drop(2).take_while { |l| l.start_with?('#') || l.strip.empty? }
    puts doc.join.gsub(/^# ?/, '').strip
    exit 0
  else
    arg.start_with?('-') ? abort("Unknown option: #{arg}") : positional << arg
  end
end

Album.require_tool!('ffmpeg', 'ffprobe')
album_dir, cfg = Album.load(positional[0])
tracks = Album.tracks(album_dir, cfg) { |warning| warn warning }
tracks = tracks.select { |t| options[:only].include?(t.number) } unless options[:only].empty?
abort 'No tracks selected.' if tracks.empty?

v = cfg.video
WIDTH = (v['width'] || 1920).to_i
HEIGHT = (v['height'] || 1080).to_i
FPS = (v['fps'] || 25).to_i
COVER_SIZE = (v['cover_size'] || (HEIGHT * 0.9).round).to_i
ZOOM_AMOUNT = (v['zoom_amount'] || 0.035).to_f
ZOOM_PERIOD = (v['zoom_period'] || 10).to_f
HUE_DEGREES = (v['hue_degrees'] || 10).to_f
HUE_PERIOD = (v['hue_period'] || 20).to_f
BLUR = (v['background_blur'] || 36).to_f
BG_BRIGHTNESS = (v['background_brightness'] || -0.08).to_f
BG_SATURATION = (v['background_saturation'] || 1.2).to_f
VIGNETTE_AMOUNT = (v['vignette_amount'] || 0.06).to_f
VIGNETTE_PERIOD = (v['vignette_period'] || 5).to_f
CRF = (v['crf'] || 18).to_i
PRESET = v['preset'] || 'medium'
AUDIO_BITRATE = v['audio_bitrate'] || '384k'
# 0 disables looping and renders every track over its full length.
LOOP_SECONDS = (v['loop_seconds'] || 20).to_f

# A loop is only seamless if every effect completes a whole number of cycles in
# it. Warn rather than abort: a visible seam is a cosmetic problem, not a broken
# render.
if LOOP_SECONDS.positive?
  { 'zoom_period' => ZOOM_PERIOD, 'hue_period' => HUE_PERIOD, 'vignette_period' => VIGNETTE_PERIOD }
    .each do |name, period|
      next if period.zero? || (LOOP_SECONDS % period).abs < 1e-6

      warn "video.#{name} (#{period}s) does not divide video.loop_seconds (#{LOOP_SECONDS}s); " \
           'the loop will visibly jump.'
    end
end

OUT_DIR = File.join(album_dir, 'xx_youtube')
THUMB_DIR = File.join(OUT_DIR, 'thumbnails')
CACHE_DIR = File.join(OUT_DIR, '.cache')

# Size at which the sharp cover is shown, fitted into a COVER_SIZE box.
def cover_display_size(cover_path)
  size = Album.image_size(cover_path)
  return [COVER_SIZE, COVER_SIZE] unless size

  width, height = size
  scale = COVER_SIZE.to_f / [width, height].max
  [Album.even(width * scale), Album.even(height * scale)]
end

def background_chain(width, height, blur)
  [
    "scale=#{width}:#{height}:force_original_aspect_ratio=increase:flags=lanczos",
    "crop=#{width}:#{height}",
    "gblur=sigma=#{blur.round(2)}",
    "eq=brightness=#{BG_BRIGHTNESS}:saturation=#{BG_SATURATION}",
    'setsar=1'
  ].join(',')
end

# Input 0 is the pre-rendered blurred background, input 1 the oversampled cover.
# Both are cached stills, so the per-frame work is only zoompan, overlay, hue
# and vignette.
def video_filter(fg_w, fg_h)
  cycle_frames = (FPS * ZOOM_PERIOD).round
  zoom = "'1+#{ZOOM_AMOUNT}*(0.5-0.5*cos(2*PI*on/#{cycle_frames}))'"

  [
    '[0:v]setsar=1[bg]',
    "[1:v]fps=#{FPS},zoompan=z=#{zoom}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':" \
      "d=1:s=#{fg_w}x#{fg_h}:fps=#{FPS},setsar=1[fg]",
    '[bg][fg]overlay=(W-w)/2:(H-h)/2:shortest=0,' \
      "hue=h='#{HUE_DEGREES}*sin(2*PI*t/#{HUE_PERIOD})'," \
      "vignette=a='PI/4+#{VIGNETTE_AMOUNT}*sin(2*PI*t/#{VIGNETTE_PERIOD})':eval=frame," \
      'format=yuv420p[v]'
  ].join(';')
end

def thumbnail_filter(cover_path)
  width = 1280
  height = 720
  fg_h = Album.even(height * 0.82)
  size = Album.image_size(cover_path) || [1, 1]
  fg_w = Album.even(size[0] * fg_h.to_f / size[1])
  if fg_w > width * 0.9
    fg_w = Album.even(width * 0.9)
    fg_h = Album.even(size[1] * fg_w.to_f / size[0])
  end

  "[0:v]#{background_chain(width, height, BLUR * width / WIDTH.to_f)}[bg];" \
    "[0:v]scale=#{fg_w}:#{fg_h}:flags=lanczos,setsar=1[fg];" \
    '[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p'
end

def newer_than_inputs?(output, inputs)
  return false unless File.exist?(output)

  out_time = File.mtime(output)
  inputs.compact.all? { |i| File.exist?(i) && File.mtime(i) <= out_time }
end

def run!(cmd, output)
  ok = system(*cmd)
  return if ok && File.exist?(output) && File.size(output).positive?

  FileUtils.rm_f(output)
  abort "ffmpeg failed for #{output}\n  #{cmd.shelljoin}"
end

def render_still(cover_path, filter, output)
  run!(%w[ffmpeg -y -hide_banner -loglevel error] +
       ['-i', cover_path, '-filter_complex', filter, '-frames:v', '1', output], output)
end

def encoder_args
  ['-c:v', 'libx264', '-preset', PRESET, '-crf', CRF.to_s,
   '-profile:v', 'high', '-pix_fmt', 'yuv420p',
   '-r', FPS.to_s, '-g', (FPS * 2).to_s, '-bf', '2']
end

# The silent animation loop. Every track video is built from this by repeating
# it, so it is encoded once per cover.
def render_loop(background, foreground, fg_w, fg_h, output)
  cmd = %w[ffmpeg -y -hide_banner -loglevel error -stats]
  cmd += ['-framerate', FPS.to_s, '-loop', '1', '-i', background]
  cmd += ['-framerate', FPS.to_s, '-loop', '1', '-i', foreground]
  cmd += ['-filter_complex', video_filter(fg_w, fg_h)]
  cmd += ['-map', '[v]', '-an', '-t', format('%.3f', LOOP_SECONDS)]
  cmd += encoder_args + ['-movflags', '+faststart', output]
  run!(cmd, output)
end

# Repeat the loop under the track audio without re-encoding the picture.
# -shortest is not enough here: with an endlessly looping video input ffmpeg
# flushes whole loops past the end of the audio, so the length is set explicitly.
def mux_track(loop_path, track, output)
  duration = Album.duration_seconds(track.audio_path)
  abort "Could not read duration of #{track.audio_path}" unless duration

  cmd = %w[ffmpeg -y -hide_banner -loglevel error]
  cmd += ['-stream_loop', '-1', '-i', loop_path, '-i', track.audio_path]
  cmd += ['-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy']
  cmd += ['-c:a', 'aac', '-b:a', AUDIO_BITRATE, '-ar', '48000', '-ac', '2']
  cmd += ['-t', format('%.3f', duration), '-movflags', '+faststart', output]
  run!(cmd, output)
end

# Fallback path when looping is disabled: encode the full track length.
def render_full_track(background, foreground, fg_w, fg_h, track, output)
  cmd = %w[ffmpeg -y -hide_banner -loglevel error -stats]
  cmd += ['-framerate', FPS.to_s, '-loop', '1', '-i', background]
  cmd += ['-framerate', FPS.to_s, '-loop', '1', '-i', foreground]
  cmd += ['-i', track.audio_path]
  cmd += ['-filter_complex', video_filter(fg_w, fg_h)]
  cmd += ['-map', '[v]', '-map', '2:a:0']
  cmd += encoder_args
  cmd += ['-c:a', 'aac', '-b:a', AUDIO_BITRATE, '-ar', '48000', '-ac', '2']
  cmd += ['-shortest', '-movflags', '+faststart', output]
  run!(cmd, output)
end

# The album video is a stream copy of the already rendered track videos, so it
# inherits each track's own cover animation and costs almost nothing.
def render_album_video(video_paths, output)
  list = "#{output}.concat.txt"
  File.write(list, video_paths.map { |p| "file '#{File.expand_path(p).gsub("'", "'\\\\''")}'" }.join("\n"))
  cmd = %w[ffmpeg -y -hide_banner -loglevel error -stats]
  cmd += ['-f', 'concat', '-safe', '0', '-i', list]
  cmd += ['-c', 'copy', '-movflags', '+faststart', output]
  run!(cmd, output)
ensure
  FileUtils.rm_f(list)
end

if options[:list]
  tracks.each { |t| puts format('%s  %-26s %-18s %s', t.number, t.title, t.genre, File.basename(t.audio_path)) }
  exit 0
end

FileUtils.mkdir_p([THUMB_DIR, CACHE_DIR])
rendered = []

tracks.each do |track|
  output = File.join(OUT_DIR, "#{track.slug}.mp4")
  thumb = File.join(THUMB_DIR, "#{track.slug}.jpg")
  background = File.join(CACHE_DIR, "#{track.slug}_bg.png")
  foreground = File.join(CACHE_DIR, "#{track.slug}_fg.png")
  loop_path = File.join(CACHE_DIR, "#{track.slug}_loop.mp4")
  unless track.cover_path && File.exist?(track.cover_path)
    abort "No cover for #{track.display_title}. Expected #{track.dir}/#{track.slug}_cover.png " \
          'or an album cover in cover/.'
  end
  fg_w, fg_h = cover_display_size(track.cover_path)

  if !options[:force] && newer_than_inputs?(output, [track.audio_path, track.cover_path])
    puts "skip   #{output} (up to date)"
  else
    unless newer_than_inputs?(background, [track.cover_path])
      render_still(track.cover_path, "[0:v]#{background_chain(WIDTH, HEIGHT, BLUR)}", background)
    end
    unless newer_than_inputs?(foreground, [track.cover_path])
      # Oversampled once so zoompan's integer panning stays sub-pixel later.
      render_still(track.cover_path, "[0:v]scale=#{fg_w * 2}:#{fg_h * 2}:flags=lanczos", foreground)
    end

    if LOOP_SECONDS.positive?
      unless newer_than_inputs?(loop_path, [background, foreground])
        puts "loop   #{loop_path} (#{LOOP_SECONDS.round}s)"
        render_loop(background, foreground, fg_w, fg_h, loop_path)
      end
      puts "render #{output}"
      mux_track(loop_path, track, output)
    else
      puts "render #{output} (full length)"
      render_full_track(background, foreground, fg_w, fg_h, track, output)
    end
  end
  rendered << output

  if options[:force] || !newer_than_inputs?(thumb, [track.cover_path])
    render_still(track.cover_path, thumbnail_filter(track.cover_path), thumb)
    puts "thumb  #{thumb}"
  end
end

if options[:album_video] && options[:only].empty?
  album_slug = cfg.album.gsub(/[^0-9A-Za-z]+/, '_').gsub(/^_|_$/, '')
  album_output = File.join(OUT_DIR, "#{album_slug}_Full_Album.mp4")
  if options[:force] || !newer_than_inputs?(album_output, rendered)
    puts "render #{album_output}"
    render_album_video(rendered, album_output)
  else
    puts "skip   #{album_output} (up to date)"
  end

  album_thumb = File.join(THUMB_DIR, "#{album_slug}_Full_Album.jpg")
  if cfg.cover_path && (options[:force] || !newer_than_inputs?(album_thumb, [cfg.cover_path]))
    render_still(cfg.cover_path, thumbnail_filter(cfg.cover_path), album_thumb)
    puts "thumb  #{album_thumb}"
  end
end

puts "\nDone. Videos in #{OUT_DIR}"

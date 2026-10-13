# frozen_string_literal: true

require 'yaml'
require 'json'
require 'shellwords'

# Shared album model for the release scripts.
#
# An album directory contains one folder per track (NN_Track_Name), each holding
# a final prompt file NN_Track_Name_1.0.txt. The prompt file names the release
# WAV; album.yml carries everything the prompt does not (genre, theme, style,
# tags, YouTube templates).
module Album
  DEFAULT_ALBUM_DIR = 'Network-Engineer-Album01'
  CONFIG_FILE = 'album.yml'

  # Used when an album has no album.yml (older layout) or omits a track.
  FALLBACK_GENRE = 'Electronic'

  Track = Struct.new(
    :number, :title, :index, :total, :dir, :prompt_path, :audio_path,
    :cover_path, :genre, :theme, :style, :tags, :duration,
    keyword_init: true
  ) do
    # "00 Network Engineers" -- the form used in audio tags and video titles.
    def display_title
      "#{number} #{title}"
    end

    # Filesystem-safe base name shared by every export of this track.
    def slug
      clean = title.gsub(/[^0-9A-Za-z]+/, '_').gsub(/_+/, '_').gsub(/^_|_$/, '')
      "#{number}_#{clean}"
    end

    # ID3 track field. Track numbering starts at 00, tag numbering at 1.
    def track_field
      "#{index + 1}/#{total}"
    end
  end

  class Config
    attr_reader :dir, :data

    def initialize(album_dir)
      @dir = album_dir
      path = File.join(album_dir, CONFIG_FILE)
      @data = File.exist?(path) ? (YAML.load_file(path) || {}) : {}
    end

    def album
      data['album'] || File.basename(dir).tr('-', ' ')
    end

    def artist
      data['artist'] || 'Unknown Artist'
    end

    def year
      (data['year'] || Time.now.year).to_s
    end

    # Album-level cover, resolved against the album directory. Falls back to the
    # first image in cover/.
    def cover_path
      configured = data['cover']
      candidate = configured ? File.join(dir, configured) : nil
      return candidate if candidate && File.exist?(candidate)

      Dir[File.join(dir, 'cover', '*.{png,jpg,jpeg}')].sort.first
    end

    def video
      data['video'] || {}
    end

    def youtube
      data['youtube'] || {}
    end

    def track_config(number)
      (data['tracks'] || {})[number] || {}
    end
  end

  module_function

  def config(album_dir)
    Config.new(album_dir)
  end

  def extract_field(text, name)
    text[/^#{Regexp.escape(name)}:\s*(.+)$/i, 1]&.strip
  end

  def final_prompts(album_dir)
    Dir[File.join(album_dir, '[0-9][0-9]_*', '*_1.0.txt')].sort
  end

  # Cover for a track, falling back to the album cover.
  def cover_for(track_dir, cfg)
    Dir[File.join(track_dir, '*_cover.{png,jpg,jpeg}')].sort.first || cfg.cover_path
  end

  def duration_seconds(path)
    out = `ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 #{path.shellescape} 2>/dev/null`
    value = out.to_s.strip.to_f
    value.positive? ? value : nil
  end

  def image_size(path)
    out = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x #{path.shellescape} 2>/dev/null`
    width, height = out.to_s.strip.split('x').map(&:to_i)
    return nil unless width&.positive? && height&.positive?

    [width, height]
  end

  # yuv420p needs even dimensions everywhere.
  def even(value)
    v = value.round
    v.odd? ? v + 1 : v
  end

  def format_timestamp(seconds)
    total = seconds.round
    hours = total / 3600
    minutes = (total % 3600) / 60
    secs = total % 60
    hours.positive? ? format('%d:%02d:%02d', hours, minutes, secs) : format('%d:%02d', minutes, secs)
  end

  # Parses every final prompt in the album into Track structs.
  # Tracks whose prompt lacks TRACK/RELEASE AUDIO, or whose WAV is missing, are
  # reported through the block (if given) and skipped.
  def tracks(album_dir, cfg = config(album_dir))
    prompts = final_prompts(album_dir)
    abort "No final prompt files (*_1.0.txt) found in #{album_dir}" if prompts.empty?

    total = prompts.length
    prompts.each_with_index.map do |prompt, index|
      text = File.read(prompt)
      track_line = extract_field(text, 'TRACK')
      release_audio = extract_field(text, 'RELEASE AUDIO')
      unless track_line && release_audio
        yield "Skipping #{prompt}: missing TRACK or RELEASE AUDIO" if block_given?
        next
      end

      raw_number, title = track_line.split('-', 2).map(&:strip)
      number = raw_number[/\d+/] || format('%02d', index)
      track_dir = File.dirname(prompt)
      audio_path = File.join(track_dir, release_audio)
      unless File.exist?(audio_path)
        yield "Skipping #{prompt}: missing release audio #{audio_path}" if block_given?
        next
      end

      tc = cfg.track_config(number)
      Track.new(
        number: number,
        title: title,
        index: index,
        total: total,
        dir: track_dir,
        prompt_path: prompt,
        audio_path: audio_path,
        cover_path: cover_for(track_dir, cfg),
        genre: tc['genre'] || FALLBACK_GENRE,
        theme: tc['theme'],
        style: tc['style'],
        tags: tc['tags'] || []
      )
    end.compact
  end

  # Shared CLI preamble: resolve the album directory and load its config.
  def load(album_dir_arg)
    album_dir = album_dir_arg || DEFAULT_ALBUM_DIR
    unless Dir.exist?(album_dir)
      warn "Album directory does not exist: #{album_dir}"
      exit 1
    end
    [album_dir, config(album_dir)]
  end

  def require_tool!(*tools)
    missing = tools.reject { |t| system('which', t, out: File::NULL, err: File::NULL) }
    return if missing.empty?

    abort "Missing required tool(s): #{missing.join(', ')}. Install with: brew install #{missing.join(' ')}"
  end
end

#!/usr/bin/env ruby
# frozen_string_literal: true

require 'shellwords'

target = ARGV[0] || 'Network-Engineer-Album01'

unless File.exist?(target)
  warn "Target does not exist: #{target}"
  exit 1
end

attrs = [
  'com.apple.metadata:kMDItemWhereFroms',
  'com.apple.quarantine',
  'com.apple.provenance'
]

attrs.each do |attr|
  system('xattr', '-dr', attr, target, out: File::NULL, err: File::NULL)
end

remaining = `xattr -lr #{target.shellescape} 2>/dev/null`
attrs.each do |attr|
  status = remaining.include?(attr) ? 'still present' : 'not present'
  puts "#{attr}: #{status}"
end

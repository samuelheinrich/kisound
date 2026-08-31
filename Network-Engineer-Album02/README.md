# Network Engineer 02

Second album in the Network Engineer series. Where the first album covered the
foundations - switching, routing, DNS, WiFi - this one goes a layer deeper:
identity instead of addresses, overlays on top of fabrics, the internet held
together by trust between autonomous systems, and what happens when all of it
breaks at three in the morning.

**Language: German.** Unlike album 01, the lyrics are German and the networking
vocabulary stays English - `Broadcast Storm`, `Handshake`, `AS Path`, `S-Y-N`
and so on are never translated. Every style prompt says so explicitly, because
the generator otherwise defaults to English vocals. The YouTube titles,
descriptions and tags in `album.yml` remain English for reach.

**Status: in production.** No audio has been generated yet. Prompts are drafts at
version `0.1`; the release pipeline in `script/` only picks up a track once its
final `*_1.0.txt` exists and names a `RELEASE AUDIO` file.

## Planned Tracks

| # | Track Title | Planned | Genre | Theme | Style |
|---|---|---|---|---|---|
| 00 | Cold Start | 3:40 | Cinematic Techno | The network waking up: links negotiating, neighbours forming, protocols converging before the first packet moves. | Cold cinematic techno opener with a slow build, deep sub-bass and serious spoken vocals. |
| 01 | Handshake | 3:20 | Electro | TCP three-way handshake, retransmits, window size, congestion control and half-open connections. | Dry punching electro-techno built around a three-beat call and response. |
| 02 | TrustSec * | 4:00 | Acid Techno | Identity instead of IP: security group tags, SGACLs, tag propagation and inline tagging. | Dark acid techno with an authoritative hypnotic 303 sequence. |
| 03 | Broadcast Storm | 3:30 | Drum & Bass | A loop with no end: flooding, pegged CPUs, a network eating itself alive. | Aggressive neurofunk drum and bass with torn basslines and controlled chaos. |
| 04 | Overlay | 4:30 | Progressive House | VXLAN and EVPN: tunnels over fabric, VNIs, leaf-spine, a network inside the network. | Layered hypnotic progressive house with a rolling bassline and stacked arpeggios. |
| 05 | AS Path | 4:40 | Trance | BGP: peering, AS paths, route leaks and hijacks - the internet runs on trust. | Big uplifting trance with a journey arc and euphoric width. |
| 06 | Certificate Expired | 3:50 | Bass House | The classic 3am outage: dead TLS handshake, PKI, and the words it worked yesterday. | Playful bass house with a humorous hook and funky club energy. |
| 07 | Dark Fiber | 5:00 | Dub Techno | Light in glass across thousands of kilometres: submarine cables and unlit strands in the ground. | Wide atmospheric dub techno with few elements and a lot of space. |
| 08 | Anycast | 3:35 | Breakbeat | One address in many places, the closest one wins: CDN, load spreading and DDoS absorption. | Breakbeat with big beat energy - many voices becoming one. |
| 09 | Convergence | 5:10 | Melodic Techno | Everything settles: routes stable, topology quiet, the network healing itself. | Epic cinematic closer with large builds and a resolving finale. |

\* TrustSec exists already and is only scaffolded here; its prompt file is a
placeholder to be overwritten.

## Still Missing

- Album cover at `cover/kisound_network-engineer-02-cover.png` (path set in `album.yml`).
- Per-track covers `NN_Track_Name_cover.png` in each track folder.
- Generated audio, and a final `*_1.0.txt` per track pointing at the chosen WAV.

## Release Steps

Identical to album 01, with this directory as the argument:

```sh
script/clean_macos_file_metadata.rb Network-Engineer-Album02
script/tag_album_wavs.rb Network-Engineer-Album02
script/export_album_mp3_flac.rb Network-Engineer-Album02
script/build_album_videos.rb Network-Engineer-Album02
script/build_youtube_metadata.rb Network-Engineer-Album02
script/youtube/.venv/bin/python script/youtube/upload_youtube.py Network-Engineer-Album02
```

All album-specific settings live in `album.yml`; no script needs editing.

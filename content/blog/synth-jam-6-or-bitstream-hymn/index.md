---
title: Synth Jam 6 | bitstream hymn
date: 1593132427404
createdAt: 1593132427404
publishedAt: 1593132427404
slug: synth-jam-6-or-bitstream-hymn
tags:
    [
        "music",
        "video",
        "synths",
        "livelooping",
        "sonicpi",
        "proceduralgeneration",
    ]
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/4JZvE5nQtC0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Recording Notes

For this episode of the [synth jam series](/tags/synth/), I brought the laptop back into the mix. Specifically, to use SonicPi as my AI drummer. SonicPi sends a generative stream of drum hits to the Digitakt via usb+midi. I then played over it for a bit. Eventually, I let the digitakt record the inputs from sonicpi events as midi tracks. once I had two measures-worth of events, I stopped sonicpi and let the digitakt repeat the last 2 measures of beat. I then layered a few synth parts on top.

### Programming Notes

This [AI autodrummer script for SonicPi and Digitakt](https://gist.github.com/omardelarosa/04b80a3c9dfbdd5b9bd5b64a21953e7a) can be used to control your digitakt automatically via USB+MIDI. This will send generative "beats" to your Digitakt hence the name "autodrummer".

It assumes that your sample pads 1-8 are mapped to MIDI channels 1-8.

This is the instrument to channel mapping and can be re-configured accordingly:

```ruby
DTAKT = {
  bd: 1,
  sn: 2,
  lo_tom: 3,
  clap: 4,
  cb: 5,
  hat: 6,
  open_hat: 7,
  cymb: 8,
}
```

The `USE_MIDI` boolean can be set to `false` to debug using the SonicPi instruments. On first run, I recommend setting `USE_MIDI=false` in order to ensure the script runs as expected.

### Code

```ruby
# sonicpi_autodrummer_for_digitakt.rb

use_bpm 75

T = 4.0

# MIDI clock
live_loop :m_clock do
  midi_clock_beat
  sleep T/4.0
end

### AI Drummer

M = 4.0

# velocity adjustments
kick_vel_scaling = 1.75
snare_vel_scaling = 1.5

# determines whether hihats ignore level changes
persist_hihats = false

# Toggle Using SonicPI synths or external MIDI instruments
USE_MIDI = true

# DIGITAKT mappings
DTAKT = {
  bd: 1,
  sn: 2,
  lo_tom: 3,
  clap: 4,
  cb: 5,
  hat: 6,
  open_hat: 7,
  cymb: 8,
}

# Initial States
set :ch, 1

# Level Transitions
LV = {
  0 => [1,1,1,0],
  1 => [0,0,1,1]
}

LEVELS = {
  hats: 1,
  kicks: 1,
  snares: 1,
  claps: 1
}

# Update Levels
live_loop :levels do
  LEVELS.each {|k,v| LEVELS[k] = LV[v].sample }
  sleep M/1
end

rhythm = range(0,16).ring
durations = (ring, 16)
##| melody = make_melody(48)
set :rh, 0

### Utility Functions

define :tr do |inst, dur = (T/4), vel = 5.0, n = 0|
  vel /= 10.0
  n_chan = DTAKT[inst] # send to a particular midi channel, assumes pads 1-8 are mapped to channels 1-8
  port_a = 'elektron_digitakt_digitakt_out_1' # main port

  n = :C2 # assumes middle C is the "default" pitch, but this can be adapted for different tunings
  if vel > 0.1 # assumes velocity gt 0.1 is a "hit"
    (midi n, vel_f: vel, port: port_a, sustain: dur, channel: n_chan) if n_chan
  end
end

### STATE TRANSITIONS -- these are tuples of each note's possible frequency of occurence
kick_dur = [
  [4, 1],
  [8, 2],
  [3, 2],
  [12, 3],
]

kicks = [
  ringify('1000 0000 1000 0000')
]

hats = [
  [16, 4],
  [16, 4],
  [16, 4],
  [32, 8],
  [48, 12],
  [12, 3]
].ring

snare_dur = [
  [4, 1],
  [4, 1],
  [4, 1],
  [4, 1],
  [8, 2],
  [12, 3],
  [24, 3],
  [64, 4],
  [128, 8],
].ring

snares = [
  ringify('0000 1000 0000 1000')
]


live_loop :ht do
  h = hats.tick
  h[1].times do
    if persist_hihats
      l = 3.0
    else
      l = 3.0 * LEVELS[:hats]
    end
    ##| (sample :elec_tick, amp: l) if not USE_MIDI
    (tr :hat, M/16, l) if USE_MIDI
    sleep M/h[0]
  end
end

live_loop :bt do
  r = rhythm.tick

  # Kicks
  in_thread do
    s = kicks[0][r]
    if s == 1
      d = kick_dur.choose
      d[1].times do |n|
        l = ((8.0 / ((n*2)+1)) * LEVELS[:kicks]) * kick_vel_scaling
        (sample :bd_fat, amp: l) if not USE_MIDI
        (tr :bd, M/d[0], l) if USE_MIDI
        sleep M/(d[0])
      end
    end
  end

  # Snares
  in_thread do
    s = snares[0][r]
    if s == 1
      d = snare_dur.choose
      d[1].times do |n|
        l = (4.0 / ((n*2)+1) * LEVELS[:snares]) * snare_vel_scaling
        dur = M/d[0]
        (sample :sn_dolf, amp: l) if not USE_MIDI
        (tr :sn, dur, l) if USE_MIDI
        sleep dur
      end
    end
  end

  ##| Claps
  in_thread do
    s = snares[0][r]
    if s == 1
      l = 4.0 * LEVELS[:claps]
      (sample :sn_dolf, amp: l) if not USE_MIDI
      (tr :clap, M/16, l) if USE_MIDI
    end
  end
  sleep M/16
end
```

# V9.1 Musical Generative Engine

Issue: #13

## Why

The 2026-09-30 video review showed a stable runtime but weak musical coupling:
visual activity could stay busy through calm passages and nearly empty during stronger musical passages.
Frames also shared too much temporal grammar and some constructions were interrupted before completion.

## Runtime policy

V9.1 keeps the validated physical/render architecture intact:

`grid1 -> group1 -> transform3 -> group2 -> transform4 -> endGrid`

No camera-width changes. No GLSL vec multiparm-count changes.

The runtime remains:

- `MUSIC_BRAIN/MUSIC_STATE`
- `PIXEL_LIFE/agent_compute`
- `PIXEL_LIFE/pixel_render_compute`

`LUMINA_V3_ENGINE` stays a compact registry/documentation COMP only.

## Music conductor

The brain is track-normalized and exposes:

- BPM + confidence
- calmness
- drive
- flow
- kick presence
- transient rate
- section change
- 9 adaptive spectral bands + novelty
- beat/bar phase

BPM is a structural clock. It must not make the entire installation flash together.

A phase is stateful and must finish before the next effect can replace it.
Portal Relay and long-lightning phases therefore reach their destination before switching.

## Asynchrony

Each frame/cell gets its own BPM-related:

- phase offset
- construction duration
- direction
- construction style
- activation epoch

Strict Y symmetry shares the same timing seed only with the mirrored partner.
Otherwise objects remain independent.

Autonomous pixels are also independent and music-gated. Calm music reduces spawn probability
and speed while allowing longer journeys.

## Colour

There is no manual artistic palette selector in V9.1.

At most three semantic source colours are active:

1. WHITE / structural light
2. PRIMARY ACCENT
3. SECONDARY ACCENT

The three roles evolve together through curated harmonic families. No random RGB and no rainbow cycling.

## 60 live effect recipes

The 60 registered V3 effects are live additive recipes built from stable primitives.
They do not replace Portal Relay, long-lightning, async frames, ceiling, side or mobile layers.
Adding an effect must not delete a previously accepted capability.

## Validation

The installer is transactional and requires empty runtime errors on:

- `MUSIC_STATE`
- `agent_glsl`
- `AGENT_STATE`
- `pixel_render_glsl`
- `STATE_OUT`

Temporary backup DATs are removed after success.

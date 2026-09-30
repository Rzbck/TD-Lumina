# V9.1 video review — 2026-09-30 09:09 capture

Source review: 86.6 s TouchDesigner screen recording, after V9.0.2 cleanup.

## Observed problems

- Runtime/network is stable, but musical coupling is still too weak.
- Estimated musical tempo in the capture is about 125 BPM, yet visible motion does not become materially stronger on beat than between beats.
- Calm/less active audio passages do not reduce visual density/motion enough; conversely stronger/rhythmic passages can still remain visually sparse.
- Several frame/cell constructions share similar timing, so separate objects can read as one synchronized block.
- Some geometric constructions begin but are visually replaced before their phrase clearly resolves.
- There are several very sparse/dark passages even while music continues.
- The palette shader is already automatic, but the old manual V8palette UI/uniform reference still exists and must be removed cleanly.

## V9.1 corrections

1. Track-normalized musical descriptors: `calmness`, `drive`, `flow`, `kickpresence`, `transientrate`, `sectionchange`, BPM + confidence, adaptive 9-band novelty.
2. Calm music -> fewer, slower and longer-lived events; rhythmic music -> more motion/density without synchronized packets.
3. BPM is a structural clock, not a global brightness flash.
4. Stateful phase conductor: a started visual construction must finish before another effect replaces it.
5. Frames/cells use independent BPM-related phase offsets, durations, directions and construction styles. Strict mirrored partners share timing only when symmetry is explicitly ON.
6. Portal Relay stays asymmetric and complete: Portal A -> far real-graph path -> Portal B -> Portal A closes.
7. Slow full-arch lightning is asymmetric, travels far and reaches its destination before phase switch.
8. Long autonomous pixels remain independent and music-gated; calm tracks reduce spawn/speed while permitting long journeys.
9. Remove the manual palette selector. Maximum three simultaneous semantic roles only: WHITE + primary accent + secondary accent; all three evolve together through curated harmonic families.
10. Keep ceiling, left side, right side, frames, portal, lightning, mobile pixels and the 60 registered generative modes additive. Adding a new grammar must never delete an accepted one.

## Validation gate

Do not merge V9.1 until TouchDesigner reports empty warnings/errors for `MUSIC_STATE`, `agent_glsl`, `AGENT_STATE`, `pixel_render_glsl`, and `STATE_OUT`, and a new calm + rhythmic video review confirms musical pacing, completed phrases, asynchronous frames and palette evolution.

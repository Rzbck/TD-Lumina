# LUMINA V9 network architecture

## Runtime principle

V9 is additive on top of the validated V8.6.x TouchDesigner graph. It does **not** rebuild or alter the structural chain:

`grid1 -> group1 -> transform3 -> group2 -> transform4 -> endGrid`

The actual runtime stays only in the existing live systems:

- `MUSIC_BRAIN/MUSIC_STATE`: adaptive full-spectrum analysis, BPM/bar/phrase context and long-form conductor.
- `PIXEL_LIFE/agent_compute`: autonomous graph travelers with independent spawn/speed/lifetime/spectral affinity.
- `PIXEL_LIFE/pixel_render_compute`: geometry renderer, Portal Relay and evolving color engine.

`LUMINA_V3_ENGINE` is deliberately **not another runtime graph**. It is a compact project registry/status COMP so TouchDesigner stays readable.

## Clean LUMINA_V3_ENGINE layout

Only these DATs should remain inside the COMP:

- `README`
- `STATUS`
- `REGIONS`
- `PHASE_LIBRARY`
- `COLOR_SYSTEM`
- `EFFECT_LIBRARY`

Do not duplicate the live renderer with unused `PHASE_STATE`, `PORTAL_STATE`, `PALETTE_STATE`, `MASTER_STATE`, `OUT_STATE`, callback DATs or source-snapshot DATs. Source history belongs in GitHub; runtime state belongs in the real live nodes above.

## Physical region model

- flattened upper area -> one physical side of the arch;
- central cell rows -> the ceiling **area**, not one line;
- flattened lower area -> opposite physical side;
- full-arch effects traverse all regions through real `endGrid` node/edge IDs.

## Phase policy

Frames/cells may be strict mirror or asymmetric. Symmetry is binary when active. Portal Relay and slow lightning are independent controlled asymmetric grammars and disable symmetry for their duration.

## Portal Relay state machine

1. Portal A constructs progressively.
2. A holds.
3. One slow trail/path leaves A and traverses a far real-graph route.
4. Portal B starts opening on arrival.
5. B becomes the new focus.
6. A closes/deconstructs after the hand-off.
7. Autonomous pixels continue living independently throughout.

Portal edge order, trail mode, source/destination and direction vary per event, but the event remains readable and controlled.

## Color engine

The artistic renderer does not use a hand-picked fixed palette menu. At most three semantic source colors are active:

1. white / structural light;
2. primary accent;
3. secondary accent.

The roles evolve together through curated harmonic families. Music changes impact and weighting without random RGB jumps or rainbow drift.

## Non-regression

Adding a new grammar must not delete existing accepted capabilities. The effect library remains a registry even when only a subset is active in one phase.

## V9.0.1 source-integrity rule

Before force-cooking a shader, installers must audit accidental boolean-OR corruption (`||` becoming `//`) and validate the live shader source. The renderer may otherwise continue showing an older compiled program while the text DAT itself is already invalid. After every installer, force-cook and check `MUSIC_STATE`, `agent_glsl`, `AGENT_STATE`, `pixel_render_glsl`, and `STATE_OUT` before cleaning backups or declaring success.

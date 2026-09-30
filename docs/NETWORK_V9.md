# LUMINA V9 network architecture

## Runtime principle

V9 is additive on top of the validated V8.6.x TouchDesigner graph. It does **not** rebuild or alter the structural chain:

`grid1 -> group1 -> transform3 -> group2 -> transform4 -> endGrid`

The live renderer remains under `PIXEL_LIFE`; the new `LUMINA_V3_ENGINE` COMP is the registry, state-monitor and source-of-truth layer for the modular engine.

## Live layers

- `MUSIC_BRAIN/MUSIC_STATE`: adaptive full-spectrum analysis, BPM/bar phase, long-form conductor.
- `PIXEL_LIFE/agent_compute`: autonomous graph walkers with independent spawn/speed/lifetime/spectral affinity.
- `PIXEL_LIFE/pixel_render_compute`: structure renderer, Portal Relay, asynchronous cell/frame construction, evolving color engine.
- `LUMINA_V3_ENGINE`: effect registry, physical-region registry, phase library, palette monitor, portal monitor, source snapshots.

## LUMINA_V3_ENGINE nodes

- `README`
- `USER_EFFECT_LIBRARY_SPEC`
- `COLOR_SYSTEM_SPEC`
- `EFFECT_LIBRARY`
- `REGIONS`
- `PHASE_LIBRARY`
- `CONTROL_SOURCES`
- `PHASE_STATE` + `phase_state_callbacks`
- `PORTAL_STATE` + `portal_state_callbacks`
- `PALETTE_STATE` + `palette_state_callbacks`
- `MASTER_STATE`
- `OUT_STATE`
- `MUSIC_BRAIN_LIVE_SOURCE`
- `GLSL_AGENT_LIVE_SOURCE`
- `GLSL_PIXEL_LIVE_SOURCE`
- `GLSL_DYNAMIC_PALETTE`
- `GLSL_PORTAL_HELPERS`
- `GLSL_PORTAL_BLOCK`

## Physical region model

- flattened upper area -> one physical side of the arch;
- central cell rows -> the ceiling **area**, not one line;
- flattened lower area -> opposite physical side;
- full-arch effects traverse all regions through real `endGrid` node/edge IDs.

## Phase policy

Frames/cells may be strict mirror or asymmetric. Symmetry is binary when active. Portal Relay and slow lightning are independent asymmetric grammars and disable symmetry for their duration.

## Portal Relay state machine

1. Portal A constructs progressively.
2. A holds.
3. One slow trail/path leaves A and traverses a far real-graph route.
4. Portal B starts opening on arrival.
5. B becomes the new focus.
6. A closes/deconstructs after the hand-off.
7. Autonomous pixels continue living independently throughout.

Portal edge order, trail mode, source/destination and direction vary per event, but the event remains readable and controlled.

## Non-regression

Adding a new grammar must not delete existing accepted capabilities. The effect library remains a registry even when only a subset is active in one phase.

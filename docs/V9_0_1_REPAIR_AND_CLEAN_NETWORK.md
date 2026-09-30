# V9.0.1 — source repair and clean TouchDesigner network

## Root cause found from the 2026-09-30 project dump

The failed V9 cook was not primarily caused by the Portal Relay idea itself. Several live GLSL boolean OR operators had been corrupted in source text from `||` to `//`.

Examples found in the current live source included:

- `musicSpawn // autonomousSpawn`
- `(a == n0 && b == n1) // (a == n1 && b == n0)`
- `w <= 0 // h <= 0`
- `step < 0 // totalSteps <= 0`
- `primary // mirrorPrimary`
- `row == 1 // row == 2`

Because the POP could still retain its previously compiled program, the project could appear visually alive until a forced cook. V9 validation then forced a compile and exposed the broken source.

V9.0.1 therefore repairs the live source first, force-cooks `MUSIC_STATE`, `agent_glsl`, `AGENT_STATE`, `pixel_render_glsl` and `STATE_OUT`, and rolls back immediately if any validation fails.

## Clean-network rule

`LUMINA_V3_ENGINE` is no longer allowed to duplicate runtime state with unused Script CHOPs and callback DATs.

Runtime remains only in the real live nodes:

- `MUSIC_BRAIN/MUSIC_STATE`
- `PIXEL_LIFE/agent_compute`
- `PIXEL_LIFE/pixel_render_compute`

`LUMINA_V3_ENGINE` is rebuilt as a compact registry/status COMP containing only:

- `README`
- `STATUS`
- `REGIONS`
- `PHASE_LIBRARY`
- `COLOR_SYSTEM`
- `EFFECT_LIBRARY`

No duplicate `PHASE_STATE`, `PORTAL_STATE`, `PALETTE_STATE`, `MASTER_STATE`, `OUT_STATE`, source snapshots or auto-generated callback DATs should remain there.

## Preserved V9 capabilities

The repair must preserve:

- V8.6.3 autonomous anti-packet travelers;
- automatic evolving palette with white + two coherent accents;
- Portal Relay grammar;
- ceiling as central area;
- strict symmetry only in phases that request it;
- Portal Relay and long pathway as controlled asymmetric grammars;
- additive effect-library policy.

## Validation gate

Do not merge V9 until TouchDesigner reports empty errors for the five runtime nodes and a new 30–60 second recording is reviewed.
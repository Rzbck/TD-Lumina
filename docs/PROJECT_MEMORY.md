# Project memory

## Physical graph

- Root: `/project1/Renders/Saison3/base2/new1`
- Structural source: `endGrid`
- Grid: 9 columns x 5 rows = 45 structural intersections.
- Real graph: 76 segments / 152 segment endpoints.
- Dense visual population is created after semantic edge mapping by line division; structural intersections are not the LED count.
- Camera orthographic width is 1.0.
- `pixel_divide` remains 100 unless profiling proves a change is necessary.

## Canonical semantic foundation

The physical tunnel is now explicitly mapped before dense pixel subdivision. See `docs/ARCH_SEMANTICS.md`.

Canonical chain:

`in1 -> node_id -> ARCH_NODE_SEMANTICS -> edge_unique -> edge_attrs -> ARCH_EDGE_SEMANTICS -> edge_strips -> pixel_divide -> pixel_attrs`

`ARCH_NODE_SEMANTICS` and `ARCH_EDGE_SEMANTICS` add metadata only. They do not change point positions or topology.

### Node attributes

- `archid` — 0..8
- `traverseid` — 0..4 / T1..T5
- `dmxxy` — exact Sender sample coordinate
- `physicalm` — tunnel meters + unfolded arch meters
- `logicaluv` — normalized logical grid position
- `mirrorids` — longitudinal and left/right mirror node IDs
- `noderegion` — left / ceiling / right

### Edge attributes

- `edgekind` — arch span vs traverse span
- `archspan` — `(archid, spanid)`
- `traversebay` — `(traverseid, bayid)`
- `zones` — adjacent semantic zone IDs
- `regionband` — broad region + band
- `dmxedge` — exact Sender endpoints
- `physedge` — physical endpoints in meters
- `edgemetrics` — physical length / Sender span / known fixture point budgets
- `fixturemap` — physical block + local fixture metadata

Existing `nodeid`, `segmentid`, `segmentu`, `segmentmid`, `mirrorx`, `mirrory`, `mirrorrot` remain valid and must be preserved.

## Physical arch interpretation

The flattened canvas represents the 3D tunnel unfolded into a 2D graph.

Longitudinally:

- 9 arches;
- ideal positions every 1.5 m from 0 to 12 m;
- exact Sender X samples: `0, 89, 179, 269, 359, 450, 539, 629, 719`.

Across one U-shaped arch:

- left upright: 2.21733 m;
- ceiling: 2.465 m;
- right upright: 2.21733 m;
- total unfolded length: 6.89966 m;
- full physical arch: 414 points = 133 + 148 + 133;
- ceiling semantic split: 74 + 74 points.

Traverse levels:

- T1 = Sender Y 1 / 0.00000 m;
- T2 = Sender Y 134 / 2.21733 m;
- T3 = Sender Y 208 / 3.44983 m;
- T4 = Sender Y 281 / 4.68233 m;
- T5 = Sender Y 414 / 6.89966 m.

The four cross bands are:

1. `LEFT_UPRIGHT`
2. `CEILING_LEFT`
3. `CEILING_RIGHT`
4. `RIGHT_UPRIGHT`

The ceiling is therefore a true area made of two bands, never one center line.

## Semantic zones

Nine arches produce eight longitudinal bays. Five traverse levels produce four bands.

`8 bays x 4 bands = 32 semantic zones`

Canonical formula:

`zoneid = bayid * 4 + bandid`

Future scene code should select zones and their boundary edges rather than reconstructing rectangles from screen coordinates.

## Physical traverse mapping

The downstream Art-Net mapping groups traverses into four 3 m blocks. Each complete 3 m traverse line uses 179 points.

Do not invent a per-bay LED count when the physical mapping does not explicitly provide it. Use exact Sender coordinates, physical lengths and `segmentu` for spatial precision.

## Mandatory GLSL reference wiring

The semantic edge stream is a topology/reference input to advanced GLSL POPs:

- `ARCH_EDGE_SEMANTICS -> agent_glsl input 2`
- `ARCH_EDGE_SEMANTICS -> pixel_render_glsl input 3`

This wiring is required for topology attribute access such as `TDInPoint_nodeid`, `TDInPoint_segmentmid` and mirror lookups.

## Current development direction

The semantic mapping is now the trusted foundation. Scene discovery is being moved out of TouchDesigner into a standalone Scene Lab before final runtime integration.

Canonical Scene Lab location:

`scene-lab/`

The standalone lab must reproduce the exact semantic tunnel model, but it must not modify the TouchDesigner runtime while scene language is still being discovered.

Every scene is treated independently and must be:

1. selectable and runnable alone;
2. versioned independently;
3. tested under several musical contexts;
4. reviewed with written critique and diagnostic ratings;
5. revised without requiring unrelated scenes to change;
6. explicitly marked `VALIDATED` by the user before TouchDesigner integration.

The preferred first runner is lightweight WebGL2 / pure GLSL. The scene specification and review data remain engine-neutral so Godot or another runner may be substituted later.

See:

- `scene-lab/README.md`
- `scene-lab/SCENE_CONTRACT.md`
- `scene-lab/REVIEW_WORKFLOW.md`
- `scene-lab/scene-registry.json`
- `scene-lab/NEXT_AI_PROMPT.md`

### Scene design contract

Every standalone scene owns three layers:

- **FOUNDATION** — enough architectural light to keep the tunnel readable;
- **MOTION** — meaningful travel, wave, migration, growth, relay or living pixels;
- **ACCENT** — sparse punctuation/arrival/closure.

Scenes must visibly evolve internally instead of remaining effectively unchanged for long stretches.

Symmetry must be explicit: `STRICT`, `OFF` or an authored `RELEASE` from strict symmetry into deliberate asymmetry.

Living pixels must vary length, speed, phase and route. They may share BPM/phrase timing but should not read as one synchronized packet.

Audio controls choreography and timing, not global brightness pumping.

### Integration gate

Only standalone scenes with status `VALIDATED` should be ported back into TouchDesigner.

After integration, compare the TD result against the standalone reference before marking it `TD_INTEGRATED`.

## Initial Scene Lab prototype set

The current standalone registry starts with 12 unvalidated prototypes:

1. Tunnel Ribs
2. Ceiling River
3. Left Ceiling Right
4. Parallel Chambers
5. Arch March
6. Traverse Wave
7. Mirror Cathedral
8. Symmetry Release Journey
9. Zone Relay
10. Shadow Light Alternation
11. Living Pixel Species
12. Sonic Weave

These names do not imply acceptance. They are starting points for scene-by-scene review.

## Non-regression rule

Do not improve one mode by deleting other accepted possibilities.

New versions should preserve the capability library and change the conductor/scheduler that decides when a capability is visible. If a capability must be removed, document the decision first.

## Visual invariants

- fixed geometry; light/state moves;
- mobile heads autonomous, not synchronized packets;
- no mid-edge direction reversal;
- strict symmetry mirrors every visible contribution;
- deliberate asymmetric full-arch routes remain possible;
- ceiling / left / right / full-arch regions all participate over time;
- the tunnel should rarely be nearly black while music is present;
- audio may organize choreography but must not become global brightness pumping;
- maximum three coherent semantic colors at once.

## Performance target

- target: 30 FPS;
- frame budget: 33.3 ms;
- optimize actual cook cost before reducing physical/dense mapping quality;
- do not reduce `pixel_divide` or render resolution as the first response to performance problems.

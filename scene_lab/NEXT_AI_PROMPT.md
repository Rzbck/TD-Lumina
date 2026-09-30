# Prompt for the next AI / coding session

Copy the prompt below into a fresh AI/Codex session when starting or continuing the standalone Lumina Scene Lab.

---

You are working on **TD-Lumina / Lumina Scene Lab**.

Your task is **NOT** to modify TouchDesigner first. Build and iterate a lightweight standalone Scene Lab where each Lumina scene and transition can be developed, viewed, scored and criticized independently before approved work is ported back into TouchDesigner.

## Repository

GitHub repository:

`Rzbck/TD-Lumina`

Read these files before changing code:

- `README.md`
- `docs/ARCH_SEMANTICS.md`
- `docs/PROJECT_MEMORY.md`
- `docs/VISUAL_LANGUAGE.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `scene_lab/README.md`
- `scene_lab/SCENE_CONTRACT.md`
- `scene_lab/TRANSITION_CONTRACT.md`
- `scene_lab/REVIEW_TEMPLATE.md`
- `scene_lab/scenes/manifest.json`

Treat those documents as the source of truth.

## Current mission

Create a **local lightweight browser Scene Lab using WebGL2 + GLSL with a minimal JavaScript UI**.

Do not use TouchDesigner as the authoring/debugging loop for scene ideas.

Do not introduce a heavy framework unless there is a concrete reason. A small Vite or plain-module web project is acceptable. Keep startup fast and laptop-friendly.

Godot may be added later for a richer perspective view, but the first renderer should be WebGL2 because the scene logic will eventually return to TouchDesigner GLSL.

## Immutable physical tunnel

The tunnel semantic model is fixed.

Structural grid:

- 9 physical arches;
- 5 traverse levels `T1..T5`;
- 45 structural intersections;
- 76 real graph edges;
- 8 longitudinal bays;
- 4 cross bands;
- 32 semantic zones.

Longitudinal arch positions:

`0.0, 1.5, 3.0, 4.5, 6.0, 7.5, 9.0, 10.5, 12.0 m`

Exact Sender X samples:

`0, 89, 179, 269, 359, 450, 539, 629, 719`

Across one U-shaped arch:

- left upright = `2.21733 m`;
- ceiling = `2.465 m`;
- right upright = `2.21733 m`;
- unfolded total = `6.89966 m`;
- full physical arch point budget = `414 = 133 + 148 + 133`;
- ceiling semantic halves = `74 + 74`.

Traverse levels:

- `T1`: Sender Y `1`, unfolded distance `0.00000 m`;
- `T2`: Sender Y `134`, unfolded distance `2.21733 m`;
- `T3`: Sender Y `208`, unfolded distance `3.44983 m`;
- `T4`: Sender Y `281`, unfolded distance `4.68233 m`;
- `T5`: Sender Y `414`, unfolded distance `6.89966 m`.

Cross bands:

1. `LEFT_UPRIGHT`
2. `CEILING_LEFT`
3. `CEILING_RIGHT`
4. `RIGHT_UPRIGHT`

The ceiling is an **area consisting of two bands**, never one center line.

Canonical zone formula:

`zoneid = bayid * 4 + bandid`

There are exactly 32 zones.

## Semantic data model

The standalone lab should reproduce the same conceptual attributes used in TouchDesigner:

Node semantics:

- `archid`
- `traverseid`
- `dmxxy`
- `physicalm`
- `logicaluv`
- mirror node IDs
- left / ceiling / right region

Edge semantics:

- `edgekind`
- `archspan = (archid, spanid)`
- `traversebay = (traverseid, bayid)`
- `zones = (zone_a, zone_b)`
- `regionband = (regionid, bandid)`
- `dmxedge`
- `physedge`
- `segmentu`

Scene code must select architecture from these semantics. Do not rebuild rectangles from arbitrary screen coordinates when semantic zones/edges can express the same thing.

## TouchDesigner invariants for later integration

When eventually porting approved work back, never casually modify:

`/project1/Renders/Saison3/base2/new1`

Immutable structural chain:

`grid1 -> group1 -> transform3 -> group2 -> transform4 -> endGrid`

Also preserve:

- camera orthographic width `1.0`;
- `pixel_divide = 100` unless actual profiling proves otherwise;
- `ARCH_NODE_SEMANTICS`;
- `ARCH_EDGE_SEMANTICS`;
- downstream Art-Net / DMX mapping;
- semantic edge reference wiring used by advanced GLSL POPs.

The Scene Lab phase must not edit TouchDesigner at all unless explicitly asked.

## Artistic goal

Lumina is a long-running architectural generative light installation under a tunnel.

The result must feel:

- architectural;
- spatial;
- luminous without becoming a full wash;
- composed with shadow and light;
- always evolving;
- full of meaningful movement;
- sometimes strictly symmetric;
- sometimes deliberately asymmetric;
- capable of journeys along all 9 arches;
- capable of travel from left side -> ceiling -> right side;
- capable of several parallel movements at once;
- capable of completed structures that stay alive internally;
- capable of autonomous living pixel scenes.

Avoid:

- one lonely line over a mostly black tunnel for long periods;
- full checkerboards;
- generic portals everywhere;
- random flashing;
- rainbow hue soup;
- global volume-to-brightness pumping;
- identical pixel heads moving like a synchronized packet;
- abrupt shape/topology-looking glitches at scene changes.

Use at most three coherent semantic colours at once. White is sparse punctuation, not the dominant base.

## Mandatory scene structure

Every scene must implement three contributions:

### FOUNDATION
Architecture that remains readable and lights the tunnel.

### MOTION
Travel, construction, migration, parallel fronts, zone relay, waves or pixel movement.

### ACCENT
Sparse arrival/closure/impact punctuation.

A scene should normally contain enough FOUNDATION to prevent the tunnel from disappearing while music is present.

## Music behaviour

Music controls choreography, not global brightness.

Use a 16-beat / 4-bar phrase as the main internal grid.

Useful subdivisions:

- 2 beats;
- 1 beat;
- 1/2 beat;
- 1/4 beat for rhythmic material.

Calm material must remain fluid rather than mechanically quantized.

Useful high-level descriptors:

- calmness;
- drive;
- flow;
- rhythm strength/confidence;
- kick presence;
- transient rate;
- section change.

Audio may change:

- movement speed;
- route;
- direction;
- number of parallel fronts;
- phrase duration;
- transition timing;
- symmetry release timing;
- pixel species activity.

Do not multiply the entire scene brightness by RMS every frame.

## Pixel scenes

Pixels are a full scene family, not a permanent overlay.

Create multiple independent species with different:

- lengths / tail lengths;
- speeds;
- directions;
- paths;
- lifetimes;
- phase offsets;
- rhythmic couplings;
- spectral affinities.

No mid-edge visible forward/backward jitter.

## Scene Lab interface requirements

Build a review-oriented UI with:

- scene selector;
- scene version display;
- status display;
- play / pause / restart;
- seed selector;
- BPM control for test mode;
- 16-beat phrase timeline;
- synthetic beat mode;
- optional local audio-file input;
- unfolded semantic tunnel view;
- optional perspective preview;
- scene A / scene B selector for transition tests;
- transition family selector;
- transition duration in beats;
- written critique field;
- numeric scores /10;
- status buttons: draft / rework / approved / rejected;
- export/import review JSON;
- deterministic capture reference: scene version + seed + BPM + time/beat.

Review controls are development tools only and must not become installation parameters.

## Granular workflow

Never rewrite all scenes together because one scene received criticism.

One scene = one isolated source file + one version history + one review history.

Use `scene_lab/scenes/manifest.json` as the registry.

For each scene:

1. open/select only that scene;
2. test several seeds and BPMs;
3. write criticism;
4. score it;
5. change only that scene;
6. increment scene version;
7. keep accepted behaviour from the previous version;
8. approve only when composition is stable;
9. then test transitions to other approved scenes.

## Initial scene registry

The current 12 design directions are:

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

These names are starting points, not proof of quality. Each must earn approval independently.

## Transition requirements

Transitions are authored, not generic fades.

Implement and review at least:

- longitudinal handoff;
- cross-arch left/ceiling/right handoff;
- zone relay;
- symmetry collapse/release;
- structural inheritance;
- draw/retract handoff.

A transition should preserve spatial continuity and avoid a perceptual black dip or topology-looking glitch.

## First implementation milestone

Do **not** implement all 12 scenes immediately.

First build the Scene Lab shell and prove the semantic model with three scenes:

1. `Tunnel Ribs` — multiple arches + multiple longitudinal fronts;
2. `Parallel Chambers` — real 32-zone selection + internal motion after chamber completion;
3. `Living Pixel Species` — autonomous different lengths/speeds/routes.

Then add one transition between each pair.

Only after the review workflow works should the remaining scenes be implemented.

## Definition of done for the Scene Lab shell

The milestone is complete when a user can:

- launch the app locally quickly;
- select Scene 1 / 4 / 11 independently;
- see correct semantic tunnel geometry;
- play movement synchronized to a test BPM;
- test a transition A -> B;
- write notes and numeric ratings;
- save/export those reviews;
- reload the app without losing the ability to reproduce a reviewed scene from seed/BPM/version.

At the end of each coding session, update the repository documentation and scene manifest so another AI can continue without relying on chat history.

---

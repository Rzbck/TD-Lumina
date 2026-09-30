# TD-Lumina agent instructions

Read these files before modifying code:

1. `docs/PROJECT_MEMORY.md`
2. `docs/ARCH_SEMANTICS.md`
3. `scene-lab/README.md`
4. `scene-lab/SCENE_CONTRACT.md`
5. `scene-lab/REVIEW_WORKFLOW.md`
6. `scene-lab/scene-registry.json`
7. `docs/GENERATIVE_SYSTEMS.md`
8. `docs/LUMINA_V3_EFFECT_LIBRARY.md`
9. `docs/COLOR_ENGINE.md`
10. `docs/VISUAL_LANGUAGE.md`
11. `docs/ARCHITECTURE.md`
12. `docs/DECISIONS.md`
13. `docs/TEST_PROTOCOL.md`
14. latest relevant file in `docs/reviews/` and `scene-lab/reviews/`

## Non-negotiable topology

Never rebuild or alter the physical structural chain unless explicitly requested:

`grid1 -> group1 -> transform3 -> group2 -> transform4 -> endGrid`

`endGrid` is the source of truth for the 45 structural nodes and 76 real edges. Dense visual pixels are generated only after it.

Do not infer fake architectural routing from screen coordinates when semantic IDs are available.

## Non-negotiable semantic foundation

The canonical POP path is:

`in1 -> node_id -> ARCH_NODE_SEMANTICS -> edge_unique -> edge_attrs -> ARCH_EDGE_SEMANTICS -> edge_strips -> pixel_divide -> pixel_attrs`

The semantic layers add attributes only. They do not move geometry.

The physical/semantic model is:

- 9 arches;
- 5 traverse levels T1..T5;
- 8 longitudinal bays;
- 4 cross bands;
- 32 semantic zones;
- `zoneid = bayid * 4 + bandid`.

Cross bands are:

- 0 `LEFT_UPRIGHT`
- 1 `CEILING_LEFT`
- 2 `CEILING_RIGHT`
- 3 `RIGHT_UPRIGHT`

The ceiling is an area composed of bands 1 + 2.

New scenes must target semantic arches/traverses/bays/bands/zones. Do not recreate these meanings from approximate XY tests.

## Semantic attributes

Node attributes include:

- `archid`
- `traverseid`
- `dmxxy`
- `physicalm`
- `logicaluv`
- `mirrorids`
- `noderegion`

Edge attributes include:

- `edgekind`
- `archspan`
- `traversebay`
- `zones`
- `regionband`
- `dmxedge`
- `physedge`
- `edgemetrics`
- `fixturemap`

Preserve existing graph attributes including `nodeid`, `segmentid`, `segmentu`, `segmentmid`, `mirrorx`, `mirrory`, `mirrorrot`.

## Mandatory GLSL reference inputs

The semantic edge stream is also a reference/topology input:

- `ARCH_EDGE_SEMANTICS -> agent_glsl input 2`
- `ARCH_EDGE_SEMANTICS -> pixel_render_glsl input 3`

Do not disconnect these. Existing shader code uses topology functions such as `TDInPoint_nodeid` and `TDInPoint_segmentmid` on those inputs.

## Physical precision

Canonical physical values are documented in `docs/ARCH_SEMANTICS.md`.

Important values:

- ideal arch spacing: 1.5 m;
- tunnel length across 9 arches: 12 m;
- U-arch: 2.21733 m + 2.465 m + 2.21733 m = 6.89966 m;
- full arch point budget: 414 = 133 + 148 + 133;
- exact Sender X arch samples: `0,89,179,269,359,450,539,629,719`;
- exact Sender Y traverse samples: `1,134,208,281,414`;
- each complete 3 m traverse line: 179 points.

Never invent an unknown per-bay LED count. Use semantic IDs plus physical/Sender coordinates.

## Scene Lab development rule

Scene discovery and visual iteration now happen in `scene-lab/` before TouchDesigner integration.

The standalone lab must use the same semantic architecture as TouchDesigner, but it must not modify the TouchDesigner runtime while scenes are still being discovered.

Every scene is independently selectable, versioned and reviewed. A scene is ported back into TouchDesigner only after the user explicitly validates it in the standalone lab.

Every standalone scene must follow `scene-lab/SCENE_CONTRACT.md` and contain:

- FOUNDATION — enough architectural light to reveal the tunnel;
- MOTION — meaningful travel/growth/wave/relay/living-pixel behavior;
- ACCENT — sparse punctuation, not permanent white dominance;
- explicit symmetry policy;
- internal evolution;
- authored entrance and exit;
- clear music/timing role;
- no accidental long near-black state while active music is present.

Do not hide a weak scene by layering generic effects on top. Improve the scene itself.

Standalone reviews are append-only and follow `scene-lab/review-schema.json`. Do not mark a scene `VALIDATED` without explicit user acceptance.

## Capability non-regression

`docs/GENERATIVE_SYSTEMS.md` and `docs/LUMINA_V3_EFFECT_LIBRARY.md` are permanent capability registries.

Do not solve one visual problem by silently deleting previously accepted grammars. A phase may activate only a subset, but the project must keep the other accepted systems available to the conductor.

If a capability is intentionally removed, record the reason in `docs/DECISIONS.md` before changing code.

## Visual invariants

- Fixed pixels: light/state moves, geometry does not.
- Mobile heads must feel autonomous; never create a synchronized packet by default.
- Mobile and structural objects may share BPM/bar timing while having independent phase offsets and speeds.
- Never reverse a mobile head in the middle of an edge. Route changes happen at graph junctions.
- Symmetry is binary: when a grammar is symmetric, every visible contribution must respect it, including secondary shapes and retained feedback. Otherwise symmetry is OFF.
- A pathway/lightning grammar is intentionally non-symmetric and must visibly travel through the graph over time.
- Frames/portals must be drawable stateful objects, not only full rectangles switched on as blocks.
- Avoid full-frame or repeated whole-cell blocks unless a specific macro grammar calls for them.
- Maximum three semantic source colors at once.
- The tunnel should rarely become almost completely black while music is present.
- Global audio level may gate silence but must not become a global brightness pump.

## Audio invariants

Use full-spectrum novelty and adaptive baselines. Do not reduce music response to only low/mid/high RMS. Low/mid/high can describe broad musical roles, but subtle spectral peaks, flux, centroid, transient density, BPM/bar/phrase context, and local per-agent spectral novelty must contribute to variation.

## Versioning

- Stable accepted foundations live on `main`.
- Experimental visual changes go on a feature branch and PR.
- Standalone Scene Lab implementation work should use a feature branch/PR; the Scene Lab specification itself is an accepted foundation on `main`.
- Keep complete TouchDesigner injection patches in `patches/` once runtime-tested.
- Keep corresponding GLSL/Python source snapshots in `src/` when runtime shader or brain logic changes.
- Update `docs/PROJECT_MEMORY.md`, `docs/ARCH_SEMANTICS.md` and `docs/DECISIONS.md` when architecture changes.
- Record explicit user likes/dislikes in `docs/VISUAL_LANGUAGE.md`.
- Add a dated `docs/reviews/` note when a user video materially changes the diagnosis.
- Add standalone scene reviews under `scene-lab/reviews/` without overwriting previous reviews.

## Validation

Do not call a runtime version complete until:

- TouchDesigner reports no warnings/errors for the semantic POP chain, `MUSIC_STATE`, `agent_glsl`, `AGENT_STATE`, `pixel_render_glsl`, `STATE_OUT`.
- The semantic reference inputs are still connected at agent input 2 and pixel renderer input 3.
- A visual version has been reviewed for repetition, darkness, symmetry purity, mobile-head autonomy, timing, junction behavior, music sensitivity and regional use.
- The previous working shader/script is recoverable through backup or git history.

Do not call a Scene Lab scene complete until:

- it has been reviewed individually in multiple music contexts;
- its written review has no blocking issues;
- the user explicitly accepts it;
- its registry status is changed to `VALIDATED`;
- only then is TouchDesigner integration allowed.

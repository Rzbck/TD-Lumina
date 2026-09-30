# TD-Lumina agent instructions

Read these files before modifying code:

1. `docs/PROJECT_MEMORY.md`
2. `docs/GENERATIVE_SYSTEMS.md`
3. `docs/LUMINA_V3_EFFECT_LIBRARY.md`
4. `docs/COLOR_ENGINE.md`
5. `docs/VISUAL_LANGUAGE.md`
6. `docs/ARCHITECTURE.md`
7. `docs/DECISIONS.md`
8. `docs/TEST_PROTOCOL.md`
9. latest relevant file in `docs/reviews/`

## Non-negotiable topology

Never rebuild or alter the physical structural chain unless explicitly requested:

`grid1 -> group1 -> transform3 -> group2 -> transform4 -> endGrid`

`endGrid` is the source of truth for the 45 structural nodes and 76 real edges. Dense visual pixels are generated only after it. Do not infer fake row/column routing when real node/edge IDs are available.

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
- Portal Relay is an independent controlled asymmetric grammar: Portal A -> slow real-graph path -> Portal B -> Portal A closes.
- Frames/portals must be drawable stateful objects, not only full rectangles switched on as blocks.
- Avoid full-frame or repeated whole-cell blocks unless a specific macro grammar calls for them.
- Maximum three semantic source colors at once. The automatic color engine uses white/structural light + two coherent accent roles that evolve together; no manual fixed-palette dependence and no rainbow drift.
- The tunnel should rarely become almost completely black while music is present.
- Global audio level may gate silence but must not become a global brightness pump.

## Physical-region invariants

Treat the flattened graph as an unfolded 3D arch:

- central area/band = ceiling, not one single line;
- upper flattened area = one physical side;
- lower flattened area = the opposite physical side;
- ceiling/left/right/full-arch are selectable artistic regions;
- Portal Relay and cross-arch pathways may connect these regions through real graph edges.

## Audio invariants

Use full-spectrum novelty and adaptive baselines. Do not reduce music response to only low/mid/high RMS. Low/mid/high can describe broad musical roles, but subtle spectral peaks, flux, centroid, transient density, BPM/bar/phrase context, and local per-agent spectral novelty must contribute to variation.

## Versioning

- Stable accepted versions live on `main`.
- Experimental changes go on a feature branch and PR.
- Every visual version must include a complete TouchDesigner injection patch in `patches/`.
- Keep corresponding GLSL/Python source snapshots in `src/` when a visual version changes runtime shader or brain logic.
- Update `docs/PROJECT_MEMORY.md` and `docs/DECISIONS.md` when behavior or architecture changes.
- Record explicit user likes/dislikes in `docs/VISUAL_LANGUAGE.md`.
- Update `docs/GENERATIVE_SYSTEMS.md` whenever a new desired grammar/capability is introduced.
- Update `docs/LUMINA_V3_EFFECT_LIBRARY.md` when the long-term effect library changes.
- Update `docs/COLOR_ENGINE.md` when color behavior changes.
- Add a dated `docs/reviews/` note when a user video materially changes the diagnosis.

## Validation

Do not call a version complete until:

- TouchDesigner reports no warnings/errors for `MUSIC_STATE`, `agent_glsl`, `AGENT_STATE`, `pixel_render_glsl`, `STATE_OUT`.
- A 20-60 second video has been reviewed for repetition, darkness, symmetry purity, mobile-head autonomy, asynchronous frame timing, junction behavior, music sensitivity, regional use and capability regressions.
- The previous working shader/script is recoverable through a backup or git history.
- The new version has not silently removed a system listed in `docs/GENERATIVE_SYSTEMS.md` or `docs/LUMINA_V3_EFFECT_LIBRARY.md`.

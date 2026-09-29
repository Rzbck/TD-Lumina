# TD-Lumina agent instructions

Read these files before modifying code:

1. `docs/PROJECT_MEMORY.md`
2. `docs/VISUAL_LANGUAGE.md`
3. `docs/ARCHITECTURE.md`
4. `docs/DECISIONS.md`
5. `docs/TEST_PROTOCOL.md`

## Non-negotiable topology

Never rebuild or alter the physical structural chain unless explicitly requested:

`grid1 -> group1 -> transform3 -> group2 -> transform4 -> endGrid`

`endGrid` is the source of truth for the 45 structural nodes and 76 real edges. Dense visual pixels are generated only after it. Do not infer fake row/column routing when real node/edge IDs are available.

## Visual invariants

- Fixed pixels: light/state moves, geometry does not.
- Mobile heads must feel autonomous; never create a synchronized packet by default.
- Never reverse a mobile head in the middle of an edge. Route changes happen at graph junctions.
- Symmetry is binary: when a grammar is symmetric, every visible contribution must respect it, including secondary shapes and retained feedback. Otherwise symmetry is OFF.
- A pathway/lightning grammar is intentionally non-symmetric and must visibly travel through the graph over time.
- Avoid full-frame or repeated whole-cell blocks unless a specific macro grammar calls for them.
- Maximum three coherent colors at once. Color must communicate a role; no rainbow drift.
- The tunnel should rarely become almost completely black while music is present.
- Global audio level may gate silence but must not become a global brightness pump.

## Audio invariants

Use full-spectrum novelty and adaptive baselines. Do not reduce music response to only low/mid/high RMS. Low/mid/high can describe broad musical roles, but subtle spectral peaks, flux, centroid, transient density, and local per-agent spectral novelty must contribute to variation.

## Versioning

- Stable accepted versions live on `main`.
- Experimental changes go on a feature branch and PR.
- Every visual version must include a complete TouchDesigner injection patch in `patches/`.
- Update `docs/PROJECT_MEMORY.md` and `docs/DECISIONS.md` when behavior or architecture changes.
- Record explicit user likes/dislikes in `docs/VISUAL_LANGUAGE.md`.

## Validation

Do not call a version complete until:

- TouchDesigner reports no warnings/errors for `MUSIC_STATE`, `agent_glsl`, `AGENT_STATE`, `pixel_render_glsl`, `STATE_OUT`.
- A 20-30 second video has been reviewed for repetition, darkness, symmetry purity, mobile-head autonomy, junction behavior, and music sensitivity.
- The previous working shader/script is recoverable through a backup or git history.

# Prompt for the next AI — build Lumina Scene Lab

Copy the prompt below into the next coding/design AI session.

---

You are working on the public GitHub repository `Rzbck/TD-Lumina`.

Your task is **NOT to modify TouchDesigner**. Build a standalone local visual authoring/review tool inside `scene-lab/` so Lumina scenes can be designed, played, criticized and iterated independently before being ported back into TouchDesigner.

## Read first

Before writing code, read in this order:

1. `AGENTS.md`
2. `docs/ARCH_SEMANTICS.md`
3. `docs/PROJECT_MEMORY.md`
4. `docs/VISUAL_LANGUAGE.md`
5. `scene-lab/README.md`
6. `scene-lab/SCENE_CONTRACT.md`
7. `scene-lab/TRANSITION_CONTRACT.md`
8. `scene-lab/REVIEW_WORKFLOW.md`
9. `scene-lab/scene-registry.json`
10. `scene-lab/review-schema.json`

Treat those files as the source of truth. Do not replace or simplify the semantic architecture after reading it.

## Goal

Create a lightweight local **Scene Lab** that runs well on a modest laptop and lets the user work scene-by-scene.

Preferred implementation: **WebGL2 + pure GLSL + lightweight TypeScript/JavaScript UI**. Avoid Electron and heavy frameworks unless there is a demonstrated need. A small Vite-style local app is acceptable.

Godot may be added later for a richer 3D walk-through, but the first renderer should stay WebGL2 because scene logic will eventually return to TouchDesigner GLSL. Scene definitions and review data must remain engine-neutral.

The user must be able to:

- select any implemented scene independently;
- start / pause / restart it;
- scrub through its lifecycle;
- run it at configurable BPM;
- emulate calm / rhythmic / energetic musical contexts;
- inspect the 9 arches, T1..T5, ceiling halves, sides and 32 semantic zones;
- switch between flattened semantic view and a simple tunnel/arch spatial preview if feasible;
- select deterministic random seeds;
- select scene A and scene B and repeatedly test transition A -> B;
- write free-form critique while the scene is playing;
- enter diagnostic ratings defined in `review-schema.json`;
- record blocking issues, things to keep and next changes;
- save review records without overwriting previous reviews;
- export/import review JSON;
- see scene status and version from `scene-registry.json`;
- see FPS / frame time;
- reproduce a review from scene version + seed + BPM + capture beat/time.

## Critical visual requirement

Do not build a generic screensaver/effect browser.

Lumina is an architectural tunnel installation. Every structural scene must be designed as:

1. **FOUNDATION** — controlled architectural light that keeps the tunnel readable;
2. **MOTION** — actual travel, construction, wave, relay, migration or living pixel motion;
3. **ACCENT** — rare punctuation/arrival/closure.

There must be designed shadow between lit structures, but active music should not produce long periods where almost the entire tunnel is black.

Movement is essential. Internal visual change is essential. Scenes must not remain essentially unchanged for 60-90 seconds.

## Canonical spatial model

Use the real semantic architecture, not approximate screen-space rectangles:

- 9 arches `A1..A9`;
- 5 traverse levels `T1..T5`;
- 8 longitudinal bays;
- 4 cross bands;
- 32 zones where `zone = bay * 4 + band`;
- bands:
  - 0 `LEFT_UPRIGHT`
  - 1 `CEILING_LEFT`
  - 2 `CEILING_RIGHT`
  - 3 `RIGHT_UPRIGHT`
- ceiling = bands 1 + 2;
- longitudinal physical span = 12 m;
- cross-arch U path = 6.89966 m;
- exact Sender X samples = `0, 89, 179, 269, 359, 450, 539, 629, 719`;
- exact Sender Y samples = `1, 134, 208, 281, 414`.

Read all exact physical details from `docs/ARCH_SEMANTICS.md`.

Create a reusable semantic geometry module. Scene code must query semantic arch/traverse/bay/band/zone IDs rather than duplicating geometry logic in every scene.

## Scene architecture in code

Every scene must live in its own file/module and expose a small common interface, conceptually:

```ts
interface LuminaScene {
  id: number;
  slug: string;
  version: string;
  reset(seed: number): void;
  update(ctx: MusicContext, time: SceneTime): void;
  render(ctx: SemanticTunnelContext): void;
}
```

Exact API may differ, but scenes must stay independent and individually replaceable.

Shared semantic geometry, palettes, rhythm utilities and transition utilities belong in shared modules. Scene-specific artistic behavior belongs in that scene file.

Do not create dozens of UI sliders to compensate for weak scene design. Debug controls are allowed, but the finished scene behavior must be authored in code.

## Scene registry

`scene-lab/scene-registry.json` contains 12 current design directions:

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

These are starting directions, not validated art. Do not merely make twelve color/name variants.

## First implementation milestone — do not implement all 12 at once

First build the Scene Lab shell and prove the entire granular workflow with only three very different scenes:

### Scene 1 — Tunnel Ribs

- several architectural arches visible at once;
- multiple parallel longitudinal fronts;
- real movement through the 12 m depth;
- enough FOUNDATION to reveal the tunnel;
- optional coherent symmetry.

### Scene 4 — Parallel Chambers

- build chambers from real semantic zones;
- use several chambers simultaneously;
- once a chamber is complete, animate internal arches/traverses so it stays alive;
- shadow remains deliberately designed between chambers.

### Scene 11 — Living Pixel Species

- multiple independent pixel species;
- different lengths/tail lengths;
- different speeds;
- different phase offsets;
- arch-path and traverse-path species;
- shared musical timing without synchronized packet motion;
- route changes only at junctions, never visible mid-edge reversals.

Then implement at least one repeatable transition between each pair and make review persistence work.

Only after the user can independently select, criticize, rate, version and reproduce these three scenes should you expand to the remaining registry.

This rule exists to prevent another situation where many scene names produce only a few real visual grammars.

## Rhythm / audio simulation

For Scene Lab, do not rebuild the entire TouchDesigner audio-analysis brain yet.

Create deterministic simulated music contexts that expose at least:

- BPM;
- beat phase / beat index;
- bar / 16-beat phrase position;
- rhythm confidence;
- calmness;
- drive;
- flow;
- transient rate;
- section-change event;
- optional low/mid/high or spectral proxy values.

Movement may use 2-beat, 1-beat, 1/2-beat and 1/4-beat grids when rhythm confidence is strong. Calm contexts should stay fluid instead of mechanical.

Audio context must control choreography and timing, not globally pump brightness.

## Color

Maximum three semantic source colors at once:

- structural primary;
- motion secondary;
- sparse white/tinted-white accent.

No rainbow cycling.

## Transition Lab

Transitions are first-class objects, not afterthoughts. Follow `scene-lab/TRANSITION_CONTRACT.md`.

Create a mode where the user chooses scene A and scene B and loops A -> transition -> B.

Initial semantic transition grammars should include:

- longitudinal handoff;
- left/ceiling/right handoff;
- semantic zone relay;
- symmetry collapse / release;
- structural inheritance;
- draw / retract.

A transition must not replace unrelated geometry in one frame and should not create an accidental black dip.

## Review UI

Create a review panel based on `review-schema.json`.

The user must be able to save review data containing at least:

- scene ID + version;
- seed;
- BPM;
- capture beat/time;
- music context;
- ratings;
- free-form notes;
- blocking issues;
- `keep` list;
- `change_next` list;
- decision/status.

Reviews are append-only. Preserve previous critique so visual evolution can be understood later.

A low score is useful. Do not inflate ratings to make a scene look finished.

## Workflow / Git

Work in `scene-lab/` only for this task, except for small documentation links if needed.

Do not modify TouchDesigner patches, GLSL runtime snapshots, semantic POP setup, DMX/Art-Net output or the structural chain.

Use a feature branch/PR for implementation. `main` holds the accepted foundation and Scene Lab specification.

Make incremental commits by concern: semantic geometry, runner, review UI, transition lab, individual scenes.

Never rewrite several scene implementations just because one scene received bad review feedback.

## TouchDesigner invariants for later integration

Do not edit these during Scene Lab development:

- root `/project1/Renders/Saison3/base2/new1`;
- structural chain `grid1 -> group1 -> transform3 -> group2 -> transform4 -> endGrid`;
- `ARCH_NODE_SEMANTICS`;
- `ARCH_EDGE_SEMANTICS`;
- camera orthographic width `1.0`;
- `pixel_divide = 100` unless measured profiling later proves otherwise;
- downstream Art-Net / DMX mapping.

## Definition of done for the first Scene Lab milestone

The first milestone is complete only when:

- the app launches locally with documented commands;
- Scene 1, Scene 4 and Scene 11 are independently selectable;
- the semantic flattened preview is correct;
- scene play/pause/restart/scrub works;
- deterministic seed works;
- calm/rhythmic/energetic test contexts work;
- transition A -> B testing works for those three scenes;
- review notes + ratings can be saved/exported and reloaded;
- a review can be reproduced from version + seed + BPM + capture beat/time;
- FPS is visible;
- no scene is falsely marked `VALIDATED`;
- README explains how to use the lab;
- no TouchDesigner runtime file has been changed.

After implementation, stop. Do **not** port scenes back into TouchDesigner. The user will review scenes one by one first.

---

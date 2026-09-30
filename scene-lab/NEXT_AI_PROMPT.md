# Prompt for the next AI — build Lumina Scene Lab

Copy the prompt below into the next coding/design AI session.

---

You are working on the public GitHub repository `Rzbck/TD-Lumina`.

Your task is **NOT to modify TouchDesigner**. Build a standalone local visual authoring/review tool inside `scene-lab/` so Lumina scenes can be designed, played, criticized and iterated independently before being ported back into TouchDesigner.

## Read first

Before writing code, read in this order:

1. `AGENTS.md`
2. `docs/ARCH_SEMANTICS.md`
3. `docs/VISUAL_LANGUAGE.md`
4. `scene-lab/README.md`
5. `scene-lab/SCENE_CONTRACT.md`
6. `scene-lab/REVIEW_WORKFLOW.md`
7. `scene-lab/scene-registry.json`
8. `scene-lab/review-schema.json`

Do not replace or simplify the semantic architecture after reading it.

## Goal

Create a lightweight local **Scene Lab** that runs well on a modest laptop and lets the user work scene-by-scene.

Preferred implementation: **WebGL2 + pure GLSL + lightweight TypeScript/JavaScript UI**. Avoid Electron and heavy frameworks unless there is a demonstrated need. A small Vite-style local app is acceptable. Godot may be considered only if it clearly improves the workflow while keeping scene definitions engine-neutral.

The user must be able to:

- select any scene independently;
- start / pause / restart it;
- scrub through its lifecycle;
- run it at configurable BPM;
- emulate calm / rhythmic / energetic musical contexts;
- inspect the 9 arches, T1..T5, ceiling halves, sides and 32 semantic zones;
- switch between flattened semantic view and a simple tunnel/arch spatial preview if feasible;
- force `STRICT`, `OFF` or authored `RELEASE` symmetry for debugging where the scene contract allows it;
- select deterministic random seeds;
- compare two versions of the same scene if practical;
- select scene A and scene B and repeatedly test the transition A -> B;
- write free-form critique while the scene is playing;
- enter 1-5 diagnostic ratings defined in `review-schema.json`;
- record blocking issues, things to keep and next changes;
- save review records without overwriting previous reviews;
- export/import review JSON;
- see scene status and version from `scene-registry.json`;
- see FPS / frame time.

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
- cross-arch U path = 6.89966 m.

Read exact Sender coordinates and physical details from `docs/ARCH_SEMANTICS.md`.

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

## Initial scene set

Implement the 12 entries already listed in `scene-registry.json` as **prototypes**, not validated scenes:

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

Do not merely make twelve color/name variants. Each must have a visibly distinct spatial and motion grammar.

### Important examples

`Parallel Chambers` should construct several semantic zone chambers and, once their boundaries exist, animate internal arches/traverses so the completed geometry remains alive.

`Mirror Cathedral` must be truly strict: all visible structure, moving elements and trails mirror correctly.

`Symmetry Release Journey` must visibly begin in strict symmetry, then intentionally release into one asymmetric full-tunnel route. The asymmetry is the event.

`Zone Relay` must visibly use the 32 mapped zones instead of drawing arbitrary rectangles.

`Living Pixel Species` must contain multiple independent pixel populations with different lengths, speeds, phase offsets and routes. They may share BPM/bar timing but must not look like one synchronized packet. A moving head never reverses halfway through an edge; route changes happen at junctions.

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

Transitions are first-class objects, not afterthoughts.

Create a mode where the user chooses scene A and scene B and loops A -> transition -> B.

Initial semantic transition grammars should include:

- longitudinal handoff;
- left/ceiling/right handoff;
- center expansion/collapse;
- semantic zone dissolve;
- outgoing path reaches the starting zone of incoming motion.

A transition must not replace unrelated geometry in one frame.

## Review UI

Create a review panel based on `review-schema.json`.

The user must be able to save a review such as:

```json
{
  "scene_id": 4,
  "scene_version": "0.2",
  "reviewed_at": "...",
  "music_context": "rhythmic",
  "ratings": {
    "architecture_readability": 4,
    "light_shadow_balance": 3,
    "movement_quality": 4,
    "internal_evolution": 2,
    "spatial_use": 5,
    "symmetry_quality": 4,
    "asymmetry_quality": 3,
    "pixel_liveliness": 3,
    "music_sync": 4,
    "transition_quality": 2,
    "originality": 4,
    "performance": 5
  },
  "notes": ["..."],
  "blocking_issues": ["interior becomes static after construction"],
  "keep": ["three chamber composition"],
  "change_next": ["animate internal traverses after closure"],
  "decision": "REVISION"
}
```

Reviews should be append-only. Preserve previous critique so visual evolution can be understood later.

## Workflow / Git

Work in `scene-lab/` only for this task, except for small documentation links if needed.

Do not modify TouchDesigner patches, GLSL runtime snapshots, semantic POP setup, DMX/Art-Net output or the structural chain.

Use a feature branch/PR for the implementation. `main` currently holds the accepted foundation and Scene Lab specification.

Make incremental commits by concern: semantic geometry, runner, review UI, transition lab, individual scenes.

## Definition of done for the first implementation

The task is complete only when:

- the app launches locally with documented commands;
- all 12 scenes are independently selectable;
- at least the semantic flattened preview is correct;
- scene play/pause/restart/scrub works;
- deterministic seed works;
- calm/rhythmic/energetic test contexts work;
- transition A -> B testing works;
- review notes + 1-5 ratings can be saved/exported;
- FPS is visible;
- no scene is falsely marked `VALIDATED`;
- README explains how to use the lab;
- no TouchDesigner runtime file has been changed.

After implementation, stop. Do **not** port scenes back into TouchDesigner. The user will review scenes one by one first.

---
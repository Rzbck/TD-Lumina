# Lumina Scene Lab

This directory is the standalone visual R&D space for Lumina scenes.

The purpose is to leave TouchDesigner temporarily while individual scenes are designed, reviewed and improved in isolation. TouchDesigner remains the final integration/runtime environment, but it is no longer the place where every visual idea must be invented and debugged at the same time.

## Why this exists

The current project has a strong physical foundation: a fixed 9 x 5 structural graph, 9 arches, 5 traverse levels, 32 semantic zones, exact physical/DMX coordinates and semantic POP attributes. The weak point has been scene authoring: too many visual ideas were mixed directly into the runtime before each scene was visually mature.

Scene Lab separates those concerns.

A scene is now treated as an independent visual object that can be:

- launched by itself;
- paused, restarted and scrubbed;
- tested at different BPM / musical intensities;
- reviewed with written notes and numeric ratings;
- versioned independently;
- accepted, rejected or sent back for revision;
- imported back into TouchDesigner only after validation.

Transitions are reviewed independently too. A scene can be good while a specific A -> B handoff is still bad.

## Recommended implementation

The repository is intentionally engine-independent, but the preferred first runner is a very small local **WebGL2 / pure GLSL** application.

Reasons:

- light enough for a modest laptop;
- starts instantly in a browser;
- keeps shader logic close to GLSL;
- simple UI for scene selector, play/pause, BPM, symmetry mode and review panel;
- easy JSON persistence for scene metadata and reviews;
- no need to rebuild the TouchDesigner project during scene design.

Godot 4 is an acceptable later option if a richer 3D walk-through becomes useful, but scene definitions and review data must stay engine-neutral so the project is not locked to Godot.

## Canonical architecture model

Scene Lab must reproduce the semantic model from `docs/ARCH_SEMANTICS.md` rather than invent a simplified fake tunnel.

Fixed model:

- 9 arches: `A1..A9`;
- 5 traverse levels: `T1..T5`;
- 8 longitudinal bays;
- 4 cross bands;
- 32 semantic zones;
- 12 m tunnel length;
- U-arch path length 6.89966 m;
- bands: `LEFT_UPRIGHT`, `CEILING_LEFT`, `CEILING_RIGHT`, `RIGHT_UPRIGHT`;
- ceiling = bands 1 + 2;
- exact Sender coordinates remain documented in `docs/ARCH_SEMANTICS.md`.

A standalone preview may use a simplified renderer, but semantic IDs and spatial relationships must match the real installation.

## Scene contract

Every scene must define three visual layers:

1. **Foundation** — architectural light that keeps the tunnel readable.
2. **Motion** — travel, wave, migration, growth, relay, living pixels or another clear movement grammar.
3. **Accent** — sparse punctuation, arrival, closure or exceptional event.

A scene must also explicitly define:

- spatial scope: arches / traverses / bands / zones;
- symmetry policy: `STRICT`, `OFF`, or an authored `RELEASE` from symmetry to asymmetry;
- minimum architectural occupancy while music is active;
- movement direction(s), speed family and length family;
- rhythmic relationship: 2 beats / 1 beat / 1/2 beat / 1/4 beat or fluid;
- entrance grammar;
- internal evolution chapters;
- exit grammar;
- compatible next-scene handoff(s);
- color roles, maximum 3 semantic colors;
- silence behavior.

See `SCENE_CONTRACT.md`.

## Review workflow

A scene is not accepted because it compiles.

Each scene gets a review record containing ratings and free-form critique. The core questions are:

- Is the architecture readable?
- Is there enough light to reveal the tunnel?
- Is there real movement?
- Is there enough internal change over time?
- Does it use the semantic zones meaningfully?
- Is symmetry exact when enabled?
- Does asymmetry feel intentional when used?
- Are living pixels autonomous rather than a synchronized packet?
- Are transitions clean and spatially motivated?
- Does the scene invite the eye to travel through the 12 m installation?
- Does it avoid generic effect / screensaver aesthetics?

See `REVIEW_WORKFLOW.md` and `review-schema.json`.

## Transition Lab

Transitions are first-class authored objects.

The lab must let the reviewer choose scene A and scene B, loop the handoff and judge it separately from the two scenes.

Initial handoff families include:

- longitudinal travel;
- left / ceiling / right cross-arch handoff;
- semantic zone relay;
- symmetry collapse / release;
- structural inheritance;
- draw / retract.

See `TRANSITION_CONTRACT.md`.

## Status vocabulary

Each scene has one status:

- `IDEA`
- `PROTOTYPE`
- `REVIEW`
- `REVISION`
- `VALIDATED`
- `REJECTED`
- `TD_INTEGRATED`

Only `VALIDATED` scenes should be ported into TouchDesigner. `TD_INTEGRATED` means the standalone version and the TD runtime version have been visually compared and accepted.

## First implementation milestone

Do **not** rush to implement all 12 scene names at once.

First prove the Scene Lab shell and granular workflow with three very different scenes:

1. `Tunnel Ribs` — several arches plus multiple longitudinal fronts;
2. `Parallel Chambers` — real zone-based chambers that continue to live internally after construction;
3. `Living Pixel Species` — independent pixel populations with different lengths, speeds, paths and rhythmic coupling.

Then prove at least one reviewed transition between each pair. Once selecting, reproducing, rating, commenting and versioning those three works correctly, expand to the remaining registry.

This prevents another "many scene names, few real visual grammars" failure.

## Local runner — V0.1

The first standalone implementation lives in `scene-lab/web/` and is served by the lightweight FastAPI runner in `server.py`.

From the repository root:

```bash
cd scene-lab
uv sync
uv run uvicorn server:app --reload --port 8765
```

Then open `http://127.0.0.1:8765` in a WebGL2-capable browser.

Current prototype scenes:

- `Tunnel Ribs`;
- `Parallel Chambers`;
- `Living Pixel Species`.

The renderer has two views: a flattened semantic map and a simple perspective tunnel view. Both are driven by the same canonical 45-node / 76-edge semantic graph.

### Transport and exact pause

- `Space` toggles play/pause when focus is not inside an input field;
- `R` restarts the scene;
- left/right arrows scrub by 0.25 s;
- the timeline can scrub directly;
- BPM, deterministic seed and simulated musical context are editable.

Pause is treated as a reproducible diagnostic event. A paused snapshot records the exact scene/version, shader signature, seed, BPM, musical context, time, beat, beat phase, bar/phrase position, palette, view mode and current agent states when applicable.

The same `scene version + shader signature + seed + BPM + context + time` is the reproducibility key for the V0.1 runner.

### Realtime feedback events

The right panel records granular feedback independently from formal 1-5 scene reviews. A feedback event can refer to:

- what is visible **now**;
- what was **just seen**;
- what the user **wants the scene to do**.

When feedback is saved, the local server writes an append-only JSON record under `scene-lab/reviews/events/`. It also stores:

- a PNG of the referenced instant;
- up to roughly 8 seconds of low-resolution visual context from before the instant;
- a 4 Hz state/timing history for that same recent window;
- current per-agent edge/`segment_u` diagnostics for Living Pixel Species.

Images are stored under `scene-lab/reviews/assets/<feedback_id>/`. See `feedback-schema.json`.

This means a later code/design pass can distinguish "the frozen frame is wrong" from "the movement that led into this frame is wrong".

### Microphone comments

The UI optionally exposes browser speech recognition with language `fr-FR` when the browser provides `SpeechRecognition` / `webkitSpeechRecognition`.

This is explicitly **experimental** and is not required for the review workflow. If the browser does not support it, the button disables itself. If recognition quality is not good enough in practice, keep using typed comments; no project feature depends on dictation.

## Directory map

- `scene-registry.json` — machine-readable scene catalog and status.
- `SCENE_CONTRACT.md` — mandatory scene design rules.
- `TRANSITION_CONTRACT.md` — authored handoff rules.
- `REVIEW_WORKFLOW.md` — granular review / iteration method.
- `review-schema.json` — formal review data format.
- `feedback-schema.json` — realtime contextual feedback event format.
- `web/` — WebGL2 Scene Lab runner and scene modules.
- `server.py` / `pyproject.toml` — local `uv` runner and append-only feedback API.
- `scenes/` — scene specifications / future engine-neutral artifacts.
- `reviews/` — review history; never overwrite old critique.
- `NEXT_AI_PROMPT.md` — handoff prompt for the next coding/design AI.

## Golden rule

Do not bring a scene back into TouchDesigner while its movement, lighting, spatial logic and transition behavior are still being discovered.

Scene Lab is where scenes become visually good. TouchDesigner is where validated scenes are integrated, synchronized with the full audio brain and sent to the real installation.

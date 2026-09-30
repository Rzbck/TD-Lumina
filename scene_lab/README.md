# Lumina Scene Lab

`scene_lab/` is the **offline visual R&D workspace** for Lumina scenes and transitions.

The purpose is to stop iterating on visual ideas inside TouchDesigner while the ideas are still unstable. TouchDesigner remains the final integration/runtime environment, but scene design, critique and approval happen here first.

## Why this exists

The previous workflow mixed four problems at once:

1. physical/semantic mapping;
2. scene composition;
3. musical behaviour;
4. TouchDesigner integration and regressions.

That made it hard to tell whether a bad result came from the artistic idea or the runtime patch.

The new workflow is granular:

- map the tunnel once;
- prototype **one scene at a time** outside TouchDesigner;
- prototype **one transition at a time**;
- review and score each scene independently;
- keep written criticism next to the scene;
- only port approved scenes back into TouchDesigner.

## Recommended implementation

Start with a **local browser Scene Lab using WebGL2 + GLSL and a very small JavaScript UI**.

Reasons:

- lightweight on a laptop;
- very fast edit/reload loop;
- GLSL logic is close to the final TouchDesigner renderer;
- no heavy engine/project overhead for a graph that is fundamentally 9 x 5 + dense line samples;
- easy scene selector, transport controls, audio file input and review UI;
- easy to keep each scene isolated in its own source file;
- deterministic screenshots/video captures are simple.

Godot is still a valid future option for a richer 3D walk-through, but it should not be the first dependency. The semantic scene definition must stay engine-agnostic so the same scene can later be rendered in WebGL, Godot or TouchDesigner.

## Canonical physical model

The Scene Lab must reproduce the same semantic tunnel documented in [`../docs/ARCH_SEMANTICS.md`](../docs/ARCH_SEMANTICS.md):

- 9 physical arches / `archid 0..8`;
- 5 traverse levels / `T1..T5`;
- 45 structural intersections;
- 76 real graph edges;
- 8 longitudinal bays;
- 4 cross bands;
- 32 semantic zones;
- longitudinal positions: `0.0 .. 12.0 m` every 1.5 m;
- unfolded arch path: `6.89966 m`;
- bands: `LEFT_UPRIGHT`, `CEILING_LEFT`, `CEILING_RIGHT`, `RIGHT_UPRIGHT`;
- exact Sender X samples: `0, 89, 179, 269, 359, 450, 539, 629, 719`;
- exact Sender Y samples: `1, 134, 208, 281, 414`.

The lab must never invent another geometry model.

## Scene Lab UI

The first usable Scene Lab should provide:

- scene selector by ID and name;
- play / pause / restart;
- deterministic seed selector;
- BPM and 16-beat phrase transport;
- optional audio-file input plus a synthetic beat test mode;
- unfolded 2D semantic view as the canonical view;
- optional perspective tunnel preview as a secondary view;
- scene A / scene B transition preview;
- transition duration in beats;
- review panel with numeric ratings and written notes;
- scene status: `draft`, `rework`, `approved`, `rejected`;
- export/import of review JSON;
- capture button or reproducible timestamp/seed for later comparison.

The review UI is for development only. These controls do **not** become final installation parameters.

## Scene architecture

Every authored scene owns three visual layers:

- **FOUNDATION** — enough architecture remains visible to reveal the tunnel;
- **MOTION** — travel, construction, exchange, wave, migration or pixel movement;
- **ACCENT** — sparse arrival/closure/punctuation, including rare white.

A scene is not accepted if it is only one moving line over a mostly black tunnel unless that darkness is explicitly authored and short-lived.

## Movement and music

Movement is mandatory.

Musical timing should organize progression using 16-beat phrases and subdivisions such as:

- 2 beats;
- 1 beat;
- 1/2 beat;
- 1/4 beat when rhythmic confidence is high.

Calm music must remain fluid rather than looking quantized.

Audio may choose scene, movement speed, phrase length, direction, density, handoff timing and pixel behaviour. Audio must **not** become global RMS brightness pumping.

## Symmetry and asymmetry

Symmetry is a scene-level authored state:

- strict symmetry mirrors **everything visible**;
- asymmetric scenes are deliberately asymmetric, not accidental;
- a scene may explicitly release from symmetry into an asymmetric journey.

## Pixel scenes

Pixels are a full scene family, not a permanent overlay.

Pixel species should differ in:

- body/tail length;
- speed;
- direction;
- path family;
- rhythmic response;
- lifetime;
- spectral affinity.

They should feel autonomous, not like synchronized packets.

## Granular approval workflow

For each scene:

1. implement only that scene;
2. test it on several seeds, BPMs and audio examples;
3. save written criticism;
4. score it with [`REVIEW_TEMPLATE.md`](REVIEW_TEMPLATE.md);
5. revise the same scene without changing unrelated scenes;
6. mark it `approved` only when its composition is stable;
7. test its transitions to compatible approved scenes;
8. only then add it to the TouchDesigner integration queue.

The same rule applies to transitions: each transition can be reviewed independently from the scenes it connects.

## Repository structure

- [`SCENE_CONTRACT.md`](SCENE_CONTRACT.md) — portable scene API and invariants.
- [`TRANSITION_CONTRACT.md`](TRANSITION_CONTRACT.md) — authored handoff rules.
- [`REVIEW_TEMPLATE.md`](REVIEW_TEMPLATE.md) — scoring + written critique format.
- [`NEXT_AI_PROMPT.md`](NEXT_AI_PROMPT.md) — complete handoff prompt for the next AI/coding session.
- [`scenes/manifest.json`](scenes/manifest.json) — scene registry and approval status.
- `scenes/` — one independent implementation per scene.
- `reviews/` — one review history per scene / transition.

## TouchDesigner boundary

While working in Scene Lab, do not modify:

- `/project1/Renders/Saison3/base2/new1`;
- `grid1 -> group1 -> transform3 -> group2 -> transform4 -> endGrid`;
- `ARCH_NODE_SEMANTICS` / `ARCH_EDGE_SEMANTICS`;
- `pixel_divide`;
- camera orthographic width 1.0;
- downstream Art-Net / DMX mapping.

TouchDesigner integration is a separate phase after scene approval.

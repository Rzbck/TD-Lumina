# Scene contract

This document defines the portable contract for every Lumina scene authored outside TouchDesigner.

A scene must be expressible from the semantic tunnel model alone. It must not depend on TouchDesigner node paths, hidden state, screen-space guesses or engine-specific geometry tricks.

## Semantic inputs

A renderer may expose the data differently, but every scene must conceptually have access to:

- `archid 0..8`;
- `traverseid 0..4`;
- `edgekind` — arch span or traverse span;
- `archspan = (archid, spanid)`;
- `traversebay = (traverseid, bayid)`;
- `zones = (zone_a, zone_b)`;
- `regionband = (regionid, bandid)`;
- `segmentu 0..1`;
- `physedge` physical endpoints in meters;
- `dmxedge` Sender endpoints;
- semantic mirror relationships;
- scene progress;
- beat / bar / 16-beat phrase position;
- curated audio descriptors such as drive, flow, calmness, transient rate and rhythmic confidence.

Canonical geometry is documented in [`../docs/ARCH_SEMANTICS.md`](../docs/ARCH_SEMANTICS.md).

## Scene identity

Each scene has a stable ID and slug.

Required metadata:

```text
id
slug
name
version
status
family
compatible_symmetry_modes
preferred_phrase_bars
audio_dependencies
transition_tags
```

IDs must not be recycled after a scene has been reviewed.

## Visual output contract

Every scene produces three semantic contributions:

```text
foundation
motion
accent
```

Each is normalized conceptually to `0..1` per dense physical pixel.

### FOUNDATION

Purpose: make the architecture readable.

Examples:

- multiple arches held at low/moderate intensity;
- ceiling bands remaining present while a motion passes through;
- several parallel traverses forming a spatial chamber;
- dim guide architecture supporting a pixel-only scene.

Foundation is not a global ambient wash. It should reveal selected architecture and preserve shadow elsewhere.

### MOTION

Purpose: visible evolution.

Examples:

- longitudinal fronts;
- multiple staggered parallel fronts;
- left -> ceiling -> right migration;
- zone-to-zone relay;
- rectangle/chamber construction followed by internal movement;
- arch marching;
- traverse waves;
- independent pixel species.

A structural scene with no meaningful motion is incomplete.

### ACCENT

Purpose: sparse punctuation.

Examples:

- arrival head;
- closure point;
- section-change punctuation;
- rare white highlight;
- short impact at a handoff destination.

Accent must not become the main illumination layer.

## Architectural occupation

While music is active, most scenes should keep enough selected structure visible to read the tunnel volume.

This does not mean "turn on everything". The goal is contrast between lit systems and shadow.

A scene must explicitly decide:

- which arches are support architecture;
- which traverses are support architecture;
- which semantic zones are active;
- which regions are intentionally dark;
- how many simultaneous motion fronts exist.

## Parallelization rule

Lumina should often use more than one motion at once.

Examples:

- two or three longitudinal fronts with different offsets;
- paired mirrored movements;
- a primary route plus a weaker delayed route;
- multiple completed chambers containing different internal motions;
- different pixel species moving independently.

Parallel motion must remain compositionally legible; it is not a license for random overlays.

## Symmetry modes

Supported authored modes:

- `strict` — every visible contribution mirrors, including pixels and feedback;
- `asymmetric` — no forced mirror;
- `release` — begins strictly symmetric and intentionally breaks symmetry later;
- `optional` — conductor may choose strict or asymmetric at scene start, but it stays coherent for that scene chapter.

A strict-symmetry scene fails review if any visible layer breaks the mirror.

## Musical timing

The preferred macro grid is a 16-beat phrase / 4 bars.

Scene motion may use:

- 2-beat steps;
- 1-beat steps;
- half-beat steps;
- quarter-beat steps only for sufficiently rhythmic material.

Musical timing controls **motion and choreography**, not global brightness.

Calm material should interpolate smoothly through the same semantic structure.

## Audio contract

Scenes may respond to stable descriptors such as:

- `calmness`;
- `drive`;
- `flow`;
- `rhythm_strength`;
- `kick_presence`;
- `transient_rate`;
- `section_change`;
- broad/spectral emphasis when needed.

Allowed uses:

- choose movement cadence;
- choose number of parallel fronts;
- choose route family;
- choose direction;
- choose pixel species activity;
- alter phrase duration;
- choose when to release symmetry;
- trigger a sparse accent.

Rejected use:

- multiplying the whole scene brightness directly by RMS every frame.

## Pixel contract

Pixel motion is a scene family or an explicitly authored hybrid.

A pixel species has at least:

```text
path family
speed
length / tail length
direction
lifetime
phase offset
rhythmic coupling
spectral affinity
```

Multiple species should not share identical speed, length and phase.

No visible forward/backward jitter on an edge.

## Colour contract

Maximum three coherent semantic colours at a time.

Suggested roles:

- primary structural colour;
- secondary motion colour;
- sparse white/tinted-white accent.

No rainbow cycling as a default visual language.

## Determinism

Every scene must support deterministic reproduction from:

```text
scene_id
scene_version
seed
bpm / phrase clock
audio descriptor snapshot or test pattern
```

This is required so a review can refer to a specific moment and reproduce it later.

## Engine independence

Scene source should separate:

1. semantic selection;
2. timing functions;
3. motion functions;
4. colour roles;
5. engine-specific drawing/output.

The semantic logic should be portable to WebGL2, Godot shader code and TouchDesigner GLSL with minimal reinterpretation.

## Acceptance rule

A scene can be marked `approved` only when:

- architecture is clearly readable;
- movement is meaningful throughout the scene;
- light/shadow composition is deliberate;
- it uses the semantic map rather than screen-coordinate guessing;
- symmetry behaviour is correct;
- audio behaviour is musical without brightness pumping;
- its entry and exit can hand off cleanly;
- it has a saved review with no blocking critique.

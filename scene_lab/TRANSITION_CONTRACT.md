# Transition contract

Transitions are first-class authored material. They are not a generic crossfade applied after scene design.

The Scene Lab must let a reviewer choose `scene A -> scene B` and inspect the handoff independently.

## Transition goals

A good Lumina transition should:

- preserve spatial continuity;
- avoid shape popping / topology-looking glitches;
- avoid perceptual black dips unless darkness is intentionally authored;
- make the outgoing scene relinquish space while the incoming scene takes ownership;
- respect the semantic tunnel rather than changing everywhere at once;
- land on a musically meaningful boundary.

## Transition grammar

The first transition families to support are:

### 1. Longitudinal handoff

Outgoing material retracts or dissolves from one tunnel end while incoming material grows from that same physical region.

Use when scenes share a longitudinal travel direction.

### 2. Cross-arch handoff

Ownership moves through the physical U:

`LEFT_UPRIGHT -> CEILING_LEFT -> CEILING_RIGHT -> RIGHT_UPRIGHT`

or the reverse.

### 3. Zone relay

A semantic zone or group of zones becomes the handoff destination. The outgoing scene leaves a visible trace there, and the incoming scene starts from those same zone boundaries.

### 4. Symmetry handoff

Strictly symmetric A can collapse into the center or mirrored edge pair, then B grows from the same mirrored anchors.

If B is asymmetric, the symmetry break must be explicit and readable.

### 5. Structural inheritance

Part of A's FOUNDATION becomes B's FOUNDATION while the motion language changes.

This is useful for avoiding the feeling that the tunnel topology changes between scenes.

### 6. Draw / retract

A completed architectural frame, chamber or route retracts in an authored direction while the next structure is drawn from the released area.

## Timing

Preferred transition lengths:

- 2 beats for strong rhythmic material;
- 4 beats for most scenes;
- 8 beats for calm / large spatial handoffs.

Transition progress must be reproducible from beat time.

## Equal-energy principle

During a normal handoff, the total perceived structural presence should remain reasonably stable.

This does not require literal energy conservation, but it should avoid:

- A fading almost to zero before B is readable;
- both scenes simultaneously at full strength for too long;
- a generic full-screen fade that ignores architecture.

## Semantic compatibility tags

Each scene should publish tags such as:

```text
starts_left
starts_right
starts_center
starts_ceiling
ends_left
ends_right
ends_center
ends_ceiling
strict_symmetry
asymmetric
zone_destination
longitudinal_forward
longitudinal_reverse
pixel_scene
structural_scene
```

The Scene Lab may use these tags to suggest plausible A -> B transitions, but it must not auto-approve them.

## Review requirements

Every approved scene must have at least:

- one approved entry from another structural scene;
- one approved exit to another structural scene;
- if it is a pixel scene, one tested structural <-> pixel handoff;
- if it uses symmetry release, one reviewed strict -> asymmetric transition.

A transition review records:

- scene A version;
- scene B version;
- transition family;
- duration in beats;
- seed;
- BPM;
- scores for continuity, readability, light preservation and musical timing;
- written critique;
- status: `draft`, `rework`, `approved`, `rejected`.

## Non-goals

Do not hide bad scene composition with long crossfades, blur or feedback.

If A and B cannot hand off cleanly because their spatial logic is incompatible, fix the scenes or author a real bridge scene rather than masking the problem.

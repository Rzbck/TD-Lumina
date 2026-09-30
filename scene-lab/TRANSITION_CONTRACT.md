# Transition Contract

Transitions are first-class authored material. They are not a generic crossfade applied after scene design.

The Scene Lab must let the reviewer select `scene A -> scene B`, loop the handoff and score it independently from the two scenes.

## Goals

A good Lumina transition should:

- preserve spatial continuity;
- avoid shape popping / topology-looking glitches;
- avoid perceptual black dips unless darkness is explicitly authored;
- let the outgoing scene relinquish space while the incoming scene takes ownership;
- use semantic arches, traverses, bands or zones rather than changing everywhere at once;
- land on a musically meaningful boundary.

## Initial transition grammars

### Longitudinal handoff

Outgoing material retracts or dissolves along the 12 m tunnel while incoming material grows from the same destination/origin region.

### Cross-arch handoff

Ownership moves through the physical U:

`LEFT_UPRIGHT -> CEILING_LEFT -> CEILING_RIGHT -> RIGHT_UPRIGHT`

or the reverse.

### Zone relay

A semantic zone or group of zones becomes the handoff destination. The outgoing scene leaves a visible trace there and the incoming scene starts from those same boundaries.

### Symmetry handoff

Strictly symmetric A can collapse toward the center or a mirrored arch pair. B grows from the same mirrored anchors. If B is asymmetric, the symmetry break must be deliberate and readable.

### Structural inheritance

Part of A's FOUNDATION becomes B's FOUNDATION while the motion grammar changes. This is useful for preventing the impression that the tunnel topology changes between scenes.

### Draw / retract

A completed frame, chamber or route retracts in an authored direction while the next structure is drawn from the released area.

## Timing

Preferred transition lengths:

- 2 beats for strong rhythmic material;
- 4 beats for most handoffs;
- 8 beats for calm or large spatial handoffs.

Transition progress must be deterministic from beat time.

## Equal-presence principle

During a normal handoff, perceived architectural presence should remain reasonably stable.

Avoid:

- A fading almost to zero before B becomes readable;
- A and B both sitting at full strength for too long;
- a generic full-screen fade that ignores architecture.

## Compatibility tags

Scenes may publish tags such as:

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

The lab may suggest likely A -> B pairings from these tags, but only review can approve a transition.

## Transition review

Record at minimum:

- scene A ID + version;
- scene B ID + version;
- transition revision;
- transition family;
- duration in beats;
- seed;
- BPM;
- musical context;
- continuity score;
- readability score;
- light-preservation score;
- musical timing score;
- written critique;
- blocking issues;
- status: `PROTOTYPE`, `REVISION`, `VALIDATED`, or `REJECTED`.

Every validated scene should eventually have at least one validated entry and exit. Pixel scenes should have at least one reviewed structural <-> pixel handoff. Symmetry-release scenes should have an explicitly reviewed strict -> asymmetric passage.

## Non-goals

Do not hide a weak scene with long fades, blur or feedback.

If A and B cannot hand off cleanly because their spatial logic is incompatible, fix the scenes or author a real bridge scene rather than masking the problem.

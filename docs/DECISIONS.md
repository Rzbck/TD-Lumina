# Decision log

## D001 — `endGrid` is the topology source of truth

Earlier versions guessed segment routing from grid coordinates and produced displaced intersections. The corrected system derives node/segment IDs from the real `endGrid` graph.

**Status:** permanent.

## D002 — Separate mobile heads from structural grammar

Earlier agents could become whole-segment or cluster modes, producing ugly blocks. V8.5 separates autonomous moving heads from structural cell/path drawing.

**Status:** accepted.

## D003 — No mid-edge bounce

Meetings may alter speed/style/next-junction routing, but **must never reverse direction mid-edge**.

**Status:** permanent.

## D004 — Strict symmetry is an invariant

When symmetry is ON, secondary shapes, mobile heads and feedback residue must also be symmetric. A mirrored main motif plus unrelated asymmetric detail is considered a bug, not variation.

**Status:** permanent.

## D005 — Pathway can be deliberately asymmetric

Full-arch pathway/lightning grammars may turn symmetry OFF and cross the physical graph over several beats/bars.

**Status:** permanent capability.

## D006 — GitHub is project memory

Accepted source, physical facts, user feedback, architectural constraints and current next steps are stored in this repository. Chat history is useful but is not the canonical project record.

**Status:** permanent.

## D007 — Semantic mapping precedes scene authoring

The scene-first / shader-first approach repeatedly forced visual code to guess architectural meaning from screen coordinates. This produced weak spatial control, difficult transitions and patch regressions.

The project now treats semantic POP mapping as a required foundation.

Canonical chain:

`in1 -> node_id -> ARCH_NODE_SEMANTICS -> edge_unique -> edge_attrs -> ARCH_EDGE_SEMANTICS -> edge_strips -> pixel_divide -> pixel_attrs`

The semantic layers add metadata only. They never move geometry.

Future scene code must select arches, traverses, bands, bays and zones directly rather than reconstructing architecture from approximate coordinates.

**Status:** permanent.

## D008 — The tunnel has 32 canonical architectural zones

Nine arches create eight longitudinal bays. Five traverse levels create four cross bands.

`8 x 4 = 32 zones`

Canonical formula:

`zoneid = bayid * 4 + bandid`

Cross bands are:

1. `LEFT_UPRIGHT`
2. `CEILING_LEFT`
3. `CEILING_RIGHT`
4. `RIGHT_UPRIGHT`

The ceiling is explicitly an area made of two bands.

**Status:** permanent physical/semantic model.

## D009 — Preserve exact physical and Sender coordinates as attributes

The semantic graph stores both physical-meter coordinates and downstream Sender sample coordinates. This lets future code animate by real tunnel distance, physical regions or exact output-space positions without changing Art-Net/DMX routing.

Key physical values:

- arches every 1.5 m over 12 m;
- U-arch path 6.89966 m = 2.21733 + 2.465 + 2.21733 m;
- one arch = 414 physical points = 133 + 148 + 133;
- exact Sender X arch samples = `0,89,179,269,359,450,539,629,719`;
- exact Sender Y traverse samples = `1,134,208,281,414`;
- each complete 3 m traverse line = 179 points.

Do not invent per-bay LED counts that are not explicitly present in the physical mapping.

**Status:** permanent.

## D010 — Semantic edge stream is a mandatory GLSL reference input

The advanced GLSL POPs require topology attributes from the semantic edge stream.

Mandatory wiring:

- `ARCH_EDGE_SEMANTICS -> agent_glsl input 2`
- `ARCH_EDGE_SEMANTICS -> pixel_render_glsl input 3`

Removing these connections breaks topology attribute access such as `TDInPoint_nodeid(...)` and `TDInPoint_segmentmid(...)`.

**Status:** permanent runtime invariant.

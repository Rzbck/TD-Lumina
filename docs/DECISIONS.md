# Decision log

## D001 — `endGrid` is the topology source of truth

Earlier versions guessed segment routing from grid coordinates and produced displaced intersections. The corrected system derives node/segment IDs from the real `endGrid` graph.

**Status:** permanent.

## D002 — Separate mobile heads from structural grammar

Earlier agents could become whole-segment or cluster modes, producing ugly blocks. V8.5 separates autonomous moving heads from structural cell/path drawing.

**Status:** accepted in V8.5.

## D003 — No mid-edge bounce

V8.5 still reverses `direction` when two agents meet on the same segment. Visually this reads as a broken head moving forward/backward rapidly.

From V8.6 onward, meetings may alter speed/style/next-junction routing, but **must never reverse direction mid-edge**.

## D004 — Strict symmetry is an invariant

When symmetry is ON, secondary shapes, mobile heads and feedback residue must also be symmetric. A mirrored main motif plus unrelated asymmetric detail is considered a bug, not variation.

## D005 — Pathway is deliberately asymmetric

The lightning/pathway grammar turns symmetry OFF and crosses the physical graph from one longitudinal side to the other over several beats/bars.

## D006 — GitHub is project memory

Accepted source, user feedback, architectural constraints and current next steps are stored in this repository. ChatGPT memory is helpful but not sufficient as the only project record.

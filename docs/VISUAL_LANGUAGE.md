# Visual language — accepted and rejected behavior

This file is the human taste memory for TD-Lumina. Update it whenever the user explicitly likes or dislikes something.

## Accepted / liked

- V8.5/V8.6 architecture is a much better base than the earlier V7/V8 iterations.
- Real graph routing based on `endGrid` IDs and real intersections.
- Distinct layers: autonomous pixels + geometric structure.
- Central ceiling treated as an actual area of cells, not one line.
- Sparse zone decomposition can work when it stays readable.
- A pixel tracing/closing a square or rectangle can be visually strong.
- Shortest-path / lightning-like graph traversal is desired.
- Long-term generative evolution is desired, with scenes/sub-scenes that develop rather than cut randomly.
- Frames/doors should be **constructed**, not simply switched on as completed blocks.
- Several objects can belong to the same musical phrase while remaining asynchronous: different birth times, speeds, edge order, trail and fade.
- Portal relay is a desired major grammar: Portal A -> slow pathway/lightning -> Portal B -> delayed fade of A.
- Mobile pixels may sometimes have very long lives and cross a large part of the arch.
- BPM/bar/phrase organization is desired, but internal object timing should remain offset and alive.

## Rejected / disliked

- Large ugly blocks that repeatedly light the same places.
- Full checkerboards or whole-cell groups dominating the tunnel.
- Random flashing with no readable rule.
- Multiple frames sharing one clock and moving at the same speed.
- A complete frame appearing as one rigid block when the construction should be visible.
- Mobile pixels travelling as synchronized packs.
- Mobile pixels visibly bouncing forward/backward on the same edge.
- Half-symmetry: a mirrored composition plus unrelated asymmetric elements.
- Symmetry treated as only one temporary scene when the current grammar is supposed to be mirrored.
- Repetitive portal/frame patterns in the same locations.
- Long periods where almost everything is black while music is present.
- Rainbow / hue drift with no semantic meaning.
- Global volume driving all brightness together.
- New versions silently removing previously accepted visual capabilities.

## Asynchrony rule

"Musically synchronized" does **not** mean "everything starts together".

Objects may share the same BPM, bar or phrase while using independent:

- phase offset;
- construction direction;
- speed;
- edge order;
- hold duration;
- fade duration;
- trail mode;
- region;
- spectral affinity.

A phrase should feel coordinated but not mechanically cloned.

## Desired choreography

A strong sequence can look like:

1. fully mirrored geometric construction;
2. clean transition;
3. symmetry OFF;
4. Portal A finishes or reaches a stable state;
5. a single slow pathway/lightning head leaves Portal A and traverses the entire arch through graph corners;
6. autonomous micro-pixels continue living independently;
7. on arrival, Portal B constructs asynchronously;
8. Portal A fades only after the handoff;
9. another structural grammar grows from a different region;
10. later the conductor may return to full symmetry, ceiling-only behavior, side call-and-response, sparse walkers, rectangles, quinconce, etc.

The transition must feel intentional. When symmetry is ON, all visible contributions must be symmetric. When OFF, the system can deconstruct freely but should remain rule-based.

## Diversity target

The viewer should rarely think "I already saw exactly this animation".

Diversity should come from a structured combination of region, source/destination, construction method, direction, duration, phase offset, trail mode, symmetry state, path choice, population, musical subdivision and palette role — not from uncontrolled random flashing.

# Visual language — accepted and rejected behavior

This file is the human taste memory for TD-Lumina. Update it whenever the user explicitly likes or dislikes something.

## Accepted / liked

- V8.5 architecture is a much better base than the earlier V7/V8 iterations.
- Real graph routing based on `endGrid` IDs and real intersections.
- Distinct layers: autonomous pixels + geometric structure.
- Central ceiling treated as an actual area of cells, not one line.
- Sparse zone decomposition can work when it stays readable.
- A pixel tracing/closing a square or rectangle can be visually strong.
- Shortest-path / lightning-like graph traversal is desired.
- Long-term generative evolution is desired, with scenes/sub-scenes that develop rather than cut randomly.

## Rejected / disliked

- Large ugly blocks that repeatedly light the same places.
- Full checkerboards or whole-cell groups dominating the tunnel.
- Random flashing with no readable rule.
- Mobile pixels travelling as synchronized packs.
- Mobile pixels visibly bouncing forward/backward on the same edge.
- Half-symmetry: a mirrored composition plus unrelated asymmetric elements.
- Symmetry treated as only one temporary scene when the current grammar is supposed to be mirrored.
- Repetitive portal/frame patterns.
- Long periods where almost everything is black while music is present.
- Rainbow / hue drift with no semantic meaning.
- Global volume driving all brightness together.

## Desired choreography

A strong sequence can look like:

1. fully mirrored geometric construction;
2. clean transition;
3. symmetry OFF;
4. a single slow pathway/lightning head traverses the entire arch, taking graph corners;
5. autonomous micro-pixels continue living independently;
6. another structural grammar grows from different cells/regions.

The transition must feel intentional. When symmetry is ON, all visible contributions must be symmetric. When OFF, the system can deconstruct freely but should remain rule-based.

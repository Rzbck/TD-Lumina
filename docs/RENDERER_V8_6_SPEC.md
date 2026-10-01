# V8.6 renderer specification

The generated TouchDesigner runtime patch contains the complete `pixel_render_compute` source. This document records the renderer changes that must survive future refactors.

## Feedback transitions

- In strict symmetry macros, incompatible old asymmetric feedback must not remain visible. Retained feedback is therefore cleared/suppressed at the symmetry transition.
- Entering slow-lightning also strongly suppresses the previous structural residue so the asymmetric pathway reads clearly.

## Cells / blocks

- Avoid ambient `wholeCell()` fills.
- Background persistence should use a faint moving trace rather than filling an entire cell.
- Cell cycles are slower than V8.5.
- Secondary cells in symmetric macros must be mirrored too.
- Sparse chase secondary rows must respect strict symmetry.

## Strict symmetry

When `symmetrymode == 1`, every structural contribution, mobile contribution and visible retained state must obey the same Y mirror. There is no concept of “main shape symmetric but detail free”.

## Slow full-arch lightning

Motif 3 is deliberately asymmetric.

- force start/end columns to opposite graph sides: 0 and 8 (or reverse);
- choose rows independently and avoid a repeatedly straight path;
- use the real node/edge graph and corner routing;
- only about 1.25–2 full paths during a macro instead of rapidly changing endpoints;
- ease the travelling head so it reads as slow-motion lightning;
- `symmetrymode` must be 0 for this macro.

## Large rectangle trace

A large rectangle is closed by a moving head instead of appearing as a fully lit block. Bounds change only after a completed trace/sub-state.

## Palette

Maximum three semantic colors. No hue drift/rainbow behavior.

# Project memory

## Physical graph

- Root: `/project1/Renders/Saison3/base2/new1`
- Structural source: `endGrid`
- Grid: 9 columns x 5 rows = 45 structural intersections.
- Real graph: 76 segments / 152 segment endpoints.
- Dense visual population is created after `endGrid` by line division; structural intersections are not the LED count.
- Camera orthographic width is 1.0.

## Current accepted direction

V8.5 is the first base the user explicitly described as "déjà beaucoup mieux". Keep its separation:

- **mobile layer** = autonomous moving heads on real graph edges;
- **structure layer** = traced cells, rectangles and paths;
- **music brain** = long-form organization and musical events.

## Known V8.5 problems to solve next

1. Some mobile heads appear to advance, reverse rapidly, then continue. Root cause: V8.5 can reverse `direction` during a mid-edge collision.
2. Junctions clamp progress to exactly 0/1 and discard sub-frame overshoot, creating a tiny stop/restart feel.
3. Music analysis is still too shallow for subtle events. Need adaptive multi-band spectral novelty, not only 3-band RMS.
4. Strict symmetry can be contaminated by:
   - unmirrored secondary shapes in some structure motifs;
   - retained feedback from a previous asymmetric state.
5. Lightning/pathway needs to cross most/all of the arch, take graph corners, and move like slow-motion lightning instead of changing endpoints too often.
6. Block/cell drawings should be slower, cleaner and more deliberately constructed.

## Current user-facing controls

Keep the front panel small. Current useful controls are approximately:

- music reactivity
- mobile pixels min/max
- movement
- interaction
- geometry
- complexity
- evolution length
- trail
- contrast / darkness
- ceiling amount
- allow Y symmetry
- palette

Complexity belongs behind these controls.

## Palette rule

Maximum three colors simultaneously. Prefer restrained coherent palettes such as ice/steel/teal or ivory/copper/desaturated teal. Color is semantic, not decorative rainbow drift.

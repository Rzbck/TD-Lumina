# Architecture

## Structural graph

The physical chain is fixed:

`grid1 -> group1 -> transform3 -> group2 -> transform4 -> endGrid`

`endGrid` is the canonical source for 45 structural nodes and 76 real segments. The grid is 9 arches x 5 traverse levels. Geometry is immutable during visual runtime.

## Semantic POP foundation

All future visual logic must operate on the semantic tunnel map defined in [`ARCH_SEMANTICS.md`](ARCH_SEMANTICS.md).

The structural-to-pixel chain is:

`in1 -> node_id -> ARCH_NODE_SEMANTICS -> edge_unique -> edge_attrs -> ARCH_EDGE_SEMANTICS -> edge_strips -> pixel_divide -> pixel_attrs`

The semantic POPs add metadata only; they do not move geometry.

### Node semantics

`ARCH_NODE_SEMANTICS` provides:

- `archid`;
- `traverseid`;
- `dmxxy`;
- `physicalm`;
- `logicaluv`;
- `mirrorids`;
- `noderegion`.

### Edge semantics

`ARCH_EDGE_SEMANTICS` provides:

- `edgekind`;
- `archspan`;
- `traversebay`;
- `zones`;
- `regionband`;
- `dmxedge`;
- `physedge`;
- `edgemetrics`;
- `fixturemap`.

The existing `nodeid`, `segmentid`, `segmentu`, `segmentmid`, `mirrorx`, `mirrory` and `mirrorrot` remain part of the graph interface.

## Semantic zones

Nine arches create 8 longitudinal bays. Five traverse levels create 4 cross bands.

`8 x 4 = 32 semantic zones`

Canonical zone formula:

`zoneid = bayid * 4 + bandid`

Bands are:

1. `LEFT_UPRIGHT`
2. `CEILING_LEFT`
3. `CEILING_RIGHT`
4. `RIGHT_UPRIGHT`

The ceiling is therefore a true area formed by two bands.

## Physical precision

The semantic map contains both logical and physical coordinates:

- arches are ideally spaced every 1.5 m over 12 m;
- exact Sender X samples are `0, 89, 179, 269, 359, 450, 539, 629, 719`;
- exact traverse Sender Y samples are `1, 134, 208, 281, 414`;
- one U-shaped arch unfolds to 6.89966 m;
- arch dimensions are 2.21733 m left upright + 2.465 m ceiling + 2.21733 m right upright;
- a complete arch uses 414 physical points: 133 + 148 + 133;
- the ceiling is semantically split into two 74-point halves;
- each complete 3 m traverse line in the physical Art-Net mapping uses 179 points.

Do not invent a per-bay LED count when it is not explicitly present in the physical source. Use `dmxedge`, `physedge` and `segmentu` for exact spatial interpolation.

## Dense pixels

Dense pixels are generated after semantic mapping by `pixel_divide`. Current division is 100 and remains unchanged unless profiling proves a reduction is necessary.

Pixel positions never move; only state and light move.

Because an edge carries constant semantic IDs at both endpoints, its subdivided pixels inherit the same architectural identity. `segmentu` remains the local 0..1 coordinate along the real edge.

## Reference inputs for advanced GLSL POPs

The semantic edge stream is also the topology/reference input for existing advanced GLSL code:

- `ARCH_EDGE_SEMANTICS -> agent_glsl input 2`;
- `ARCH_EDGE_SEMANTICS -> pixel_render_glsl input 3`.

These connections are mandatory because the shaders read topology attributes with functions such as `TDInPoint_nodeid`, `TDInPoint_segmentmid` and mirror attributes.

## Mobile state layer

The agent path remains:

`agent_grid -> agent_index -> agent_audio -> agent_attrs -> agent_glsl -> AGENT_STATE`

with feedback from `AGENT_STATE` into the next frame. Agents store segment, progress, direction, energy, spectrum memory, cooldown, speed, lifetime, style and symmetry state.

Route changes belong at junctions, not in the middle of an edge.

## Music brain

`MUSIC_BRAIN/MUSIC_STATE` combines broad RMS context with full-spectrum adaptive band energy, spectral novelty, positive flux, centroid, spread, entropy, crest, rolloff, transient envelopes, BPM/beat/bar timing and long-form organization.

Audio should select scene family, pacing and transition timing. It should not become a global brightness meter.

## Scene-authoring rule

Future structure scenes must select semantic architecture directly: arches, traverses, bands, bays, zones and mirrors. They should no longer reconstruct architectural meaning from approximate screen coordinates.

Examples:

- all `CEILING_LEFT` edges between arches 2 and 6;
- T3 through bays 1..5;
- perimeter of zones 8..15;
- all left uprights followed by a ceiling handoff;
- strict mirrored zone pairs using explicit mirror IDs.

The Art-Net / DMX output network is downstream of this renderer and is not part of the scene-authoring layer.

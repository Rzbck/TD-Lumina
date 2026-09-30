# Arch semantics foundation

This file defines the canonical semantic map for the Lumina tunnel. It is a **foundation layer**, not a visual effect.

## Immutable structural source

The physical structural chain remains:

`grid1 -> group1 -> transform3 -> group2 -> transform4 -> endGrid`

Never move, rebuild or resize this chain unless explicitly required by the physical installation. `endGrid` remains the canonical geometric source.

The structural graph is fixed at:

- 9 arches / longitudinal columns;
- 5 physical traverse levels `T1..T5`;
- 45 structural intersections;
- 76 real graph edges;
- 152 edge endpoints before line-strip conversion;
- dense render pixels are created **after** semantic mapping.

## Physical tunnel mapping

The flattened 9 x 5 grid is an unfolded representation of the 3D tunnel.

Longitudinally:

- `archid 0..8` corresponds to physical arches 1..9;
- ideal longitudinal positions are `0.0, 1.5, 3.0, 4.5, 6.0, 7.5, 9.0, 10.5, 12.0 m`;
- exact Sender sample X coordinates are `0, 89, 179, 269, 359, 450, 539, 629, 719`.

Across one U-shaped arch:

- left upright = `2.21733 m`;
- ceiling = `2.465 m`;
- right upright = `2.21733 m`;
- total unfolded path length = `6.89966 m`;
- full physical arch point budget = `414`;
- physical point split = `133 + 148 + 133`;
- for semantic mapping, the 148-point ceiling is split into two 74-point halves.

The five traverse/sample levels are:

| traverseid | name | Sender Y | unfolded arch distance | semantic meaning |
| --- | --- | ---: | ---: | --- |
| 0 | T1 | 1 | 0.00000 m | left lower boundary |
| 1 | T2 | 134 | 2.21733 m | left / ceiling hinge |
| 2 | T3 | 208 | 3.44983 m | ceiling center |
| 3 | T4 | 281 | 4.68233 m | ceiling / right hinge |
| 4 | T5 | 414 | 6.89966 m | right lower boundary |

The traverse system is grouped physically into four 3 m blocks. Each complete 3 m traverse line is authored with 179 points in the Art-Net mapping. Do **not** invent a per-bay LED count when the physical source does not state one explicitly; use exact Sender coordinates and physical lengths instead.

## Four cross bands

The 5 traverse levels define 4 semantic bands:

| bandid | name | physical region |
| ---: | --- | --- |
| 0 | `LEFT_UPRIGHT` | T1 -> T2 |
| 1 | `CEILING_LEFT` | T2 -> T3 |
| 2 | `CEILING_RIGHT` | T3 -> T4 |
| 3 | `RIGHT_UPRIGHT` | T4 -> T5 |

For broader region selection:

- region `LEFT` = band 0;
- region `CEILING` = bands 1 + 2;
- region `RIGHT` = band 3;
- traverse edges are boundaries between adjacent zones.

The ceiling is therefore an **area**, not a single center line.

## 32 semantic zones

Nine arches create eight longitudinal bays. Five traverse levels create four cross bands.

`8 bays x 4 bands = 32 zones`

Canonical formula:

`zoneid = bayid * 4 + bandid`

A zone is bounded by two neighboring arches and two neighboring traverse levels. Future scene code should select semantic zones and their bordering edges rather than reconstructing rectangles from screen coordinates.

## Node attributes

`ARCH_NODE_SEMANTICS` adds semantic attributes while leaving point positions unchanged:

- `archid` — integer 0..8;
- `traverseid` — integer 0..4;
- `dmxxy` — exact Sender sample coordinate `(x,y)`;
- `physicalm` — `(tunnel_m, unfolded_arch_m)`;
- `logicaluv` — normalized logical position in the 9 x 5 map;
- `mirrorids` — `(longitudinal_mirror_node, left_right_mirror_node)`;
- `noderegion` — left / ceiling / right classification.

## Edge attributes

`ARCH_EDGE_SEMANTICS` adds semantic edge attributes while leaving topology unchanged:

- `edgekind` — `0 = arch span`, `1 = traverse span`;
- `archspan` — `(archid, spanid)` for arch edges;
- `traversebay` — `(traverseid, bayid)` for traverse edges;
- `zones` — `(zone_a, zone_b)`, with `-1` outside the tunnel boundary;
- `regionband` — `(regionid, bandid)`;
- `dmxedge` — exact Sender endpoints `(x0,y0,x1,y1)`;
- `physedge` — physical endpoints `(tunnel0,cross0,tunnel1,cross1)` in meters;
- `edgemetrics` — physical length, Sender span, semantic segment point count where known, whole fixture point count;
- `fixturemap` — physical block/local fixture metadata and point budgets.

The existing `nodeid`, `segmentid`, `segmentu`, `segmentmid`, `mirrorx`, `mirrory` and `mirrorrot` remain valid and should be preserved.

## Dense-pixel inheritance

Semantic mapping occurs **before** `pixel_divide`.

Canonical runtime chain:

`in1 -> node_id -> ARCH_NODE_SEMANTICS -> edge_unique -> edge_attrs -> ARCH_EDGE_SEMANTICS -> edge_strips -> pixel_divide -> pixel_attrs`

`pixel_divide` remains at 100 divisions unless profiling justifies a change.

Because semantic edge attributes are identical on the two endpoints of an edge, line subdivision can carry those semantics into the dense pixel population. `segmentu` remains the local 0..1 position along the physical edge.

Future code can therefore derive precise positions without guessing topology:

- physical position = interpolate `physedge.xy -> physedge.zw` by `segmentu`;
- Sender position = interpolate `dmxedge.xy -> dmxedge.zw` by `segmentu`.

## GLSL reference-input invariant

The semantic edge stream must remain available as the topology/reference input used by the existing advanced GLSL POPs:

- `ARCH_EDGE_SEMANTICS -> agent_glsl input 2`;
- `ARCH_EDGE_SEMANTICS -> pixel_render_glsl input 3`.

Removing these reference inputs breaks functions such as `TDInPoint_nodeid(...)`, `TDInPoint_segmentmid(...)` and mirror lookups.

## Scene-authoring rule from this point forward

New scenes should be written against semantic architecture, for example:

- arches 2..6;
- `CEILING_LEFT + CEILING_RIGHT`;
- traverse T3 across bays 1..5;
- zones 8..15 and their perimeter;
- all left uprights, then ceiling handoff, then right uprights;
- mirrored semantic zones rather than coordinate approximations.

Do not add new visual-scene complexity until this map is verified clean in TouchDesigner.

# Architecture

## Structural graph

The physical chain is fixed: `grid1 -> group1 -> transform3 -> group2 -> transform4 -> endGrid`.

`endGrid` is the canonical source for 45 structural nodes and 76 real segments. Downstream code derives node IDs, segment IDs, segment midpoints, mirror mappings, and dense render samples from that graph.

## Dense pixels

Dense pixels are generated after `endGrid` by subdividing the real segments. Pixel positions never move; only state and light move.

## Mobile state layer

The agent path is `agent_grid -> agent_index -> agent_audio -> agent_attrs -> agent_glsl -> AGENT_STATE`, with feedback from `AGENT_STATE` into the next frame. Agents store segment, progress, direction, energy, spectrum memory, cooldown, speed, lifetime, style, and symmetry state.

Route changes belong at junctions, not in the middle of an edge.

## Music brain

`MUSIC_BRAIN/MUSIC_STATE` should combine broad RMS context with full-spectrum adaptive band energy, spectral novelty, positive flux, centroid, spread, entropy, crest, rolloff, transient envelopes, BPM/beat/bar timing, and long-form macro/sub-state organization.

## Structure renderer

The structure layer supports traced cells, growing cells, local quinconce, full-arch lightning/pathways, sparse chases, and large rectangle traces. Structure and mobile layers share a restrained palette but stay logically separate.

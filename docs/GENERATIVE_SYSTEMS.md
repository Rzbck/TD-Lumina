# Generative systems registry

This file is the capability registry for TD-Lumina. New versions must be **additive**: a new experiment may disable a system in a particular phase, but it must not silently delete an accepted capability from the project.

## Non-regression rule

Before changing shaders or the music brain:

1. read this file;
2. identify which systems are being modified;
3. preserve all other accepted systems behind the same front-end controls or an internal scheduler;
4. if a system is intentionally removed, record the reason in `docs/DECISIONS.md` first.

The goal is not to stack every system at once. The goal is to keep a library of visual grammars that the conductor can activate by phase.

## Physical region model

The flattened 9x5 `endGrid` is a plan/view representation of a 3D arch.

- **Central ceiling region**: an area/band in the middle of the flattened canvas, not one single horizontal line. It must support cells, rectangles, corners, centers, intersections, traces and local waves.
- **Left physical side of the arch**: represented by the upper part of the flattened canvas.
- **Right physical side of the arch**: represented by the lower part of the flattened canvas.
- The exact structural nodes/edges must always come from the real `endGrid` graph IDs.
- Do not infer fake geometry from dense divided pixels.

## Layer A — autonomous mobile pixels

Required behavior:

- many independent walkers, never a default synchronized packet;
- each walker has its own spawn phase, speed, lifetime, spectral affinity, route personality and refractory time;
- music influences each walker independently, including subtle full-spectrum peaks;
- walkers can be short or can live long enough to cross a large part of the arch;
- route decisions happen at real intersections;
- no mid-edge forward/backward jitter;
- preserve sub-frame overshoot at junctions;
- walkers may occasionally interact, but interaction must not collapse them into a flock or block;
- some phases may show only a few very visible solo walkers;
- other phases may have a richer population, still asynchronous.

## Layer B — frame / door / portal construction

A frame is not a block that appears all at once. It is a drawable object with independent edge timing.

Supported construction styles should include:

- one edge at a time;
- start from a corner and travel around the perimeter;
- start from the center and grow outward;
- two opposite sides growing at different speeds;
- top then sides then bottom;
- bottom then sides then top;
- partial frame followed by delayed closure;
- no trail;
- short trail;
- persistent completed frame;
- single frame only;
- mirrored pair only when the active grammar is strictly symmetric.

Important: multiple frames must not share one clock. Their start times, edge speeds, direction and closure timing must be independently phase-offset while still quantized to musical subdivisions.

## Layer C — Portal Relay

Target choreography:

1. Portal A is constructed in one region.
2. Once A is sufficiently established, a single slow pathway/lightning head leaves it.
3. The pathway traverses real graph corners toward another region of the arch.
4. On arrival, Portal B begins drawing.
5. Portal B completes or reaches a musically meaningful state.
6. Portal A fades or deconstructs after a delay.
7. The relay can continue toward Portal C later.

Rules:

- never spawn all portal edges simultaneously;
- source and destination regions must change over time;
- portal lifetime, construction direction and fade behavior may depend on BPM, bar phase and spectral events;
- relay timing must be state-machine based, not random flashing;
- the lightning/pathway is non-symmetric unless explicitly running a mirrored relay grammar.

## Layer D — slow lightning / pathway

Required behavior:

- choose two structural regions/nodes far enough apart;
- compute a graph path through real intersections;
- prefer a readable route with angle changes, like slow-motion lightning;
- one head should visibly progress through the path;
- the path must not appear fully lit immediately;
- optional short trail behind the head;
- path duration can span multiple beats/bars;
- endpoints remain stable for the duration of the event;
- pathway can trigger destination geometry on arrival;
- pathway grammar is normally asymmetric and must disable unrelated mirrored overlays.

## Layer E — ceiling grammars

The ceiling is the **central area**, not one line. Preserve several ceiling-specific grammars:

- single cell trace;
- rectangle construction;
- square construction;
- corner-to-corner trace;
- center expansion;
- intersection accents;
- local checker / quinconce, never a giant static checkerboard;
- longitudinal chase through ceiling cells;
- staggered cells with different start times and speeds;
- one cell closes completely while neighboring cells stay quiet;
- traveling portal construction through ceiling regions;
- wave that grows across several adjacent cells then breaks apart.

## Layer F — left-side / right-side arch grammars

The two physical sides are distinct artistic regions.

Capabilities to preserve:

- independent left-only or right-only structural phrase;
- call-and-response left -> right;
- delayed mirror left/right;
- strict simultaneous symmetry when the symmetry grammar is active;
- vertical/upright trace from top, bottom or center;
- staggered door/frame construction along depth;
- pathway moving from one side, through ceiling, to the other side;
- local deconstruction without globally random flashing.

## Layer G — strict symmetry

Symmetry is a global grammar state, not an optional extra object.

When symmetry is ON:

- every visible primary shape is mirrored;
- secondary shapes are mirrored;
- autonomous walkers that are visible in that grammar have paired mirrored state or are intentionally suppressed;
- feedback/trails cannot preserve asymmetric leftovers;
- construction timing and edge phase are mirrored too.

When symmetry is OFF:

- free/asymmetric pathways, portals and solo walkers are allowed.

Never display strict symmetry plus one unrelated asymmetric effect on top.

## Layer H — asynchronous geometry scheduler

This is required to stop the current "everything moves together" look.

Every drawable object receives its own state:

- `birthBeat`
- `phaseOffset`
- `speed`
- `direction`
- `constructionStyle`
- `trailMode`
- `holdDuration`
- `fadeDuration`
- `region`
- `musicAffinity`

The conductor may quantize object births to 1/4, 1/8, 1/16, bar or phrase boundaries, but objects should then evolve independently.

Example: four frames can all belong to the same musical phrase while starting on different eighth-notes and closing at different speeds.

## Layer I — generative phase conductor

The installation should feel continuously authored rather than randomly shuffled.

A phase contains:

- one main grammar;
- optional compatible secondary grammar;
- a population range for autonomous pixels;
- a symmetry state;
- regional focus (ceiling / left / right / full arch);
- palette of maximum three coherent colors;
- BPM subdivision rules;
- transition conditions.

Transitions should happen on meaningful musical boundaries when possible, but internal events continue asynchronously inside the phase.

Desired hierarchy:

`track context -> phrase -> phase -> sub-scene -> object events -> individual pixel events`

## Layer J — music analysis / event vocabulary

Keep the V8.6 direction and extend it rather than reverting to low/mid/high only.

Required descriptors:

- adaptive multi-band novelty;
- local spectral peaks;
- spectral flux;
- centroid / spread;
- entropy / crest;
- rolloff;
- kick/snare/hat/micro-transients;
- BPM confidence;
- beat/bar/phrase phase;
- per-agent spectral lookup / affinity.

Different musical events should do different jobs:

- kick: structural advance, portal milestone, strong route step;
- snare/mid transient: secondary edge, side response, closure event;
- hats/high detail: autonomous micro-pixels, tiny local changes;
- spectral novelty: select region/style or introduce a new object;
- bar/phrase: phase/sub-scene evolution;
- silence gate: true black only when the source is genuinely silent.

## Layer K — additional generative modes to keep available

These are library modes, not instructions to show them simultaneously:

- slow cell perimeter trace;
- growing rectangle;
- shrinking rectangle;
- nested rectangles;
- staggered portals along depth;
- local quinconce;
- chair/ladder-like sparse geometry;
- center-out / outside-in construction;
- travelling architectural wave;
- shortest-path lightning;
- portal relay;
- one-pixel long-distance journey;
- mirrored paired journey;
- left/right call-and-response;
- ceiling-only phrase;
- side-only phrase;
- full-arch sweep with staggered timing;
- intersection constellation;
- temporary sparse blackout effect, used rarely;
- deconstruction where completed geometry breaks back into autonomous pixels.

## Diversity requirement

The user should not regularly think "I already saw this exact animation".

Variation must come from combinations of:

- region;
- source/destination;
- construction method;
- start corner/center;
- direction;
- duration;
- independent speed;
- trail mode;
- symmetry state;
- mobile population;
- path choice;
- musical subdivision;
- palette role;
- phase ordering.

Randomness alone is not enough. Variations must still expose a readable rule.

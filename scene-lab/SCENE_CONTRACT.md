# Scene Contract

Every Lumina scene developed outside TouchDesigner must satisfy this contract before it can be considered for integration.

## 1. Semantic space first

Never author a scene from anonymous screen coordinates alone.

The canonical address space is:

- arches `A1..A9`;
- traverses `T1..T5`;
- bays `0..7`;
- bands `0..3`;
- zones `0..31` with `zone = bay * 4 + band`;
- longitudinal physical coordinate `0..12 m`;
- cross-arch physical coordinate `0..6.89966 m`.

The scene may render a 2D flattened preview, a pseudo-3D arch preview or both, but its logic must be expressible with the semantic model above.

## 2. Three-layer visual grammar

Each scene owns exactly these conceptual layers.

### Foundation

Persistent architectural light. It reveals the physical tunnel and gives the motion something to inhabit.

Foundation must not be a full white wash. It should establish selected arches, traverses, bands or zone boundaries with controlled shadow between them.

### Motion

The main evolving visual event.

Examples:

- multiple parallel fronts;
- longitudinal travel from A1 to A9;
- motion around the U-shape left -> ceiling -> right;
- zone-to-zone relay;
- mirrored growth;
- symmetry release into a single journey;
- waves across traverses;
- several living pixel species with different speed/length families.

A scene that only changes brightness without spatial travel or construction does not satisfy the motion requirement.

### Accent

Rare punctuation: arrival, closure, crossing, collision-like meeting, terminal pulse or short white semantic accent.

Accent must not become the permanent dominant layer.

## 3. Light and shadow

While music is active, a structural scene should normally keep enough lit architecture to make the tunnel readable.

Darkness is part of the composition, not the default background caused by insufficient content.

Every scene must declare a target occupancy range, for example:

- `foundation_occupancy_min: 0.22`
- `foundation_occupancy_max: 0.55`

This is a design target, not a literal global-brightness multiplier.

## 4. Internal evolution

Every scene must visibly evolve before it ends.

Recommended structure:

- intro / reveal;
- build;
- development A;
- development B;
- hold or climax;
- authored exit.

Internal chapters should normally align to 4-beat units inside a 16-beat phrase when music is rhythmic. Calm music may interpolate fluidly through the same chapters.

A scene should not spend 60-90 seconds showing essentially one unchanged pattern.

## 5. Symmetry policy

Every scene explicitly chooses one of:

- `STRICT` — every visible contribution mirrors correctly, including moving heads and retained trails;
- `OFF` — intentional asymmetry;
- `RELEASE` — begins in strict symmetry and deliberately breaks into an authored asymmetric journey.

Partial accidental symmetry is not a valid mode.

## 6. Motion diversity

Motion should use several independent dimensions where appropriate:

- direction;
- speed;
- length;
- phase offset;
- route;
- lifetime;
- rhythmic subdivision.

Living pixels must not default to identical speed, identical tail length and identical phase.

No mobile head reverses direction halfway through an edge. Route changes happen at semantic graph junctions.

## 7. Music relationship

Audio controls choreography, not global brightness pumping.

Allowed roles include:

- choose or bias scene family;
- choose motion density;
- set tempo and phrase timing;
- choose 2-beat / beat / half-beat / quarter-beat movement grids;
- affect pixel species count, route preference or speed family;
- trigger sparse accents;
- influence transition timing;
- detect silence and decay to black.

Full-spectrum novelty, transient density, spectral balance and BPM confidence should remain more important than raw master level.

## 8. Color

Maximum 3 semantic source colors visible at once.

Suggested roles:

- structural primary;
- moving secondary;
- sparse white/tinted-white accent.

Avoid rainbow walking and uncontrolled hue cycling.

## 9. Transition contract

Each scene specifies at least one clean entrance and one clean exit.

A transition should be spatially motivated, for example:

- retract into a destination zone;
- hand off from one arch group to another;
- wipe longitudinally A1 -> A9;
- collapse toward ceiling center;
- dissolve by semantic zones;
- outgoing motion reaches the origin of incoming motion.

Do not morph one unrelated geometry into another in a single frame.

## 10. Validation gate

A scene may move to `VALIDATED` only when the user has reviewed it individually and the review record contains no blocking issue for:

- architecture readability;
- light level;
- movement quality;
- internal evolution;
- symmetry correctness when applicable;
- intentional asymmetry when applicable;
- transition quality;
- visual originality;
- music synchronization;
- performance.

Only after this gate should a TouchDesigner implementation be produced.
# Scene Review Workflow

Scene Lab is intentionally granular. A scene is improved independently rather than hiding its weaknesses inside a large generative system.

## Review cycle

1. Select exactly one scene.
2. Run it alone for at least 30-60 seconds.
3. Test at minimum three musical contexts:
   - calm / low transient;
   - rhythmic / medium drive;
   - energetic / high transient.
4. Test its entrance, internal development and exit.
5. Write critique before changing code.
6. Save the review as a new record; never overwrite prior reviews.
7. Change only the scene or transition being reviewed unless a shared foundation bug is proven.
8. Re-run the same contexts.
9. Mark `VALIDATED` only when no blocking critique remains.

## Ratings

Use 1-5 ratings. These are diagnostic, not a global beauty score.

- `architecture_readability` — can the viewer understand the physical tunnel?
- `light_shadow_balance` — enough light, but still designed shadow?
- `movement_quality` — meaningful travel/growth rather than static brightness changes?
- `internal_evolution` — does the scene develop over time?
- `spatial_use` — does it exploit arches, traverses, ceiling, sides and zones?
- `symmetry_quality` — exact and intentional when used?
- `asymmetry_quality` — intentional journey rather than broken symmetry?
- `pixel_liveliness` — varied length/speed/phase and autonomous motion where relevant?
- `music_sync` — movement phrasing follows the music without brightness pumping?
- `transition_quality` — clean entrance/exit/handoff?
- `originality` — architectural identity rather than generic screensaver/effect?
- `performance` — stable on the lightweight preview machine?

A low score is useful. Do not inflate ratings to make a scene appear finished.

## Blocking critique

A review can contain any number of written notes, but `blocking_issues` identify problems that prevent validation.

Examples:

- "too dark for more than 8 beats"
- "strict symmetry broken by pixel trails"
- "looks unchanged for 40 seconds"
- "only ceiling is used; sides remain dead"
- "transition jumps geometry in one frame"
- "all pixel heads have same length and speed"
- "audio response is just global flashing"

## Scene status transitions

Recommended path:

`IDEA -> PROTOTYPE -> REVIEW -> REVISION -> REVIEW -> VALIDATED -> TD_INTEGRATED`

`REJECTED` is allowed at any stage. Rejection is not a failure: it prevents weak ideas from contaminating the runtime.

## Versioning

Each scene owns a version number such as `0.1`, `0.2`, `1.0`.

- bump patch/minor while visually iterating;
- `1.0` means standalone validation, not TouchDesigner integration;
- after TD integration, keep the standalone reference so regressions can be compared visually.

## Transition reviews

Transitions should also be reviewed independently.

A good test pair is:

- scene A alone;
- scene B alone;
- A -> B repeated 5-10 times;
- B -> A repeated 5-10 times.

The transition should preserve spatial continuity. Whenever possible, the outgoing scene should leave light in the location from which the incoming scene starts.

## What not to do

Do not:

- fix several scenes simultaneously;
- hide a weak scene by layering another scene on top;
- add controls instead of improving authored behavior;
- accept a scene because it is technically different from another scene;
- call a 60-scene catalog successful if only two visual grammars are visible;
- port a scene to TouchDesigner before standalone review is complete.
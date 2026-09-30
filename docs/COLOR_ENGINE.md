# LUMINA automatic color engine

The artistic engine must not depend on manually selecting one of a few fixed palettes.

## Active color roles

At any instant the renderer owns at most three semantic source colors:

1. **White / structural light** — near-white, optionally lightly tinted.
2. **Primary accent** — saturated, impactful color.
3. **Secondary accent** — harmonically related support color.

White is always part of the available color language.

## Evolution

The three roles morph together between curated harmonious families. Evolution is continuous and slow enough to be perceived as one coherent palette changing over time rather than random hue switching.

Music can increase saturation/impact and change how strongly the roles are mixed, but it must not choose unrelated RGB colors on each beat.

## Constraints

- maximum three semantic source colors at once;
- no rainbow drift;
- no per-frame random hue;
- palette evolution must preserve harmony during interpolation;
- color is semantic and may differentiate structure, low-frequency accents and high/detail events;
- real black remains available for intentional blackout effects, not as the normal state while music is present.

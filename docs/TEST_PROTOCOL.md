# Visual test protocol

For every new version, record 20-30 seconds with representative music and inspect the following.

## 1. Mobile heads

- Do several heads move independently?
- Any synchronized packet that looks like one clump?
- Any forward/backward jitter on one edge?
- Do heads cross graph intersections smoothly without a visible pause?

## 2. Symmetry

When symmetry mode is active:

- every main shape mirrored;
- every secondary shape mirrored;
- mobile heads mirrored;
- no old asymmetric trail remains.

One asymmetric visible element means the symmetry test fails.

## 3. Pathway / lightning

- symmetry must be OFF;
- start/end should be far apart, preferably opposite longitudinal sides;
- path follows real graph edges and corners;
- head visibly travels along the path over time;
- endpoints must not jump multiple times per second.

## 4. Structure drawings

- cells/rectangles should read as constructed geometry;
- avoid whole blocks lighting simultaneously unless intentional;
- repeated shapes should move to new regions and vary size/direction;
- ceiling and both physical sides should participate over time.

## 5. Music analysis

Test tracks with different loudness and genres. Quiet transients, hats, percussion texture, bass accents and musical changes should produce different behavior without globally pumping brightness.

## 6. Darkness / palette

- tunnel should rarely be almost entirely black while music is present;
- maximum 3 coherent colors at once;
- no uncontrolled rainbow drift.

## Definition of done

TouchDesigner must report empty warnings/errors for `MUSIC_STATE`, `agent_glsl`, `AGENT_STATE`, `pixel_render_glsl`, and `STATE_OUT`.

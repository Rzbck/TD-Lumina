# LUMINA V9.2 — Curated Scenes

## Runtime policy
V9.2 stops scheduling unfinished generic effect recipes directly. Music chooses **scene, tempo, phase length, calm/drive/flow and timing**; each scene owns its visual construction. Structural brightness and colour are no longer pumped directly from instantaneous kick/snare/onset amplitude.

## Curated live scenes
1. **MASTER RECT TRACE** — one large architectural rectangle, open → hold → release.
2. **DECONSTRUCTED RECT** — one rectangle built in deliberate chapters.
3. **ARCH BAR SEQUENCE** — physical side A → ceiling area → side B → full-arch slice, one bar at a time.
4. **FULL ARCH JOURNEY** — slow long-distance path through the real graph.
5. **PORTAL RELAY** — portal A → far graph path → portal B → close A.
6. **MOBILE PIXELS** — independent music-gated long-lived travelers.

## Colour
- Accent colour is the default structural colour.
- White is semantic punctuation only: closure, arrival, rare structural accent.
- Maximum three evolving harmonious roles remain: white + primary accent + secondary accent.
- No per-beat hue lottery and no direct per-hit white/saturation pumping.

## 60-effect library
All 60 named ideas remain preserved. Only authored/mastered scenes are marked `CURATED LIVE`; unfinished ideas remain `REGISTERED` until they receive a dedicated choreography. Adding one scene must never delete another idea.

## Performance
- Remove the former 4×8 cell scan from the main structural path.
- Disable the generic 60-effect overlay and generic effect post layer.
- Render at most 16 active traveler agents while keeping dense physical pixels and the real graph topology.
- Keep `grid1 -> group1 -> transform3 -> group2 -> transform4 -> endGrid` untouched.
- Keep orthographic camera width at 1.0.
- Do not change GLSL vec multiparm counts.

## Validation
`MUSIC_STATE`, `agent_glsl`, `AGENT_STATE`, `pixel_render_glsl`, and `STATE_OUT` must all have empty warnings/errors. No extra front-end art-direction parameters are added.
# LUMINA V3 effect capability registry

This registry is derived from the user-provided V3 effect-library specification. It is a **non-regression list**: implementations may activate only a subset per phase, but future work must not silently delete registered capabilities.

## Core architecture requirements

- V3 must work without radar/tracking first; time, speed, BPM, audio, oscillators, manual/MIDI/OSC triggers, presets, automations, sequences and controlled random are valid modulation sources.
- Future radar/person tracking becomes another generic modulation source; effects must not need to be rewritten for it.
- Shared pipeline: spatial LED map -> effect generators -> influence fields -> masks -> colorisation -> temporal FX -> master -> power limiter -> pixel reorder -> Art-Net.
- Separate **GEOMETRY**, **BEHAVIOUR** and **LOOK** so one primitive can be recombined many ways.
- Professional output requirements include gamma correction, nonlinear fades, temporal dithering, power limiting, global brightness, crossfades and effect blending.
- Tempo lock supports musical subdivisions from bars down to 1/32 plus multi-bar phrases.
- Audio accent events must trigger selected structural events instead of flashing the whole tunnel.

## Registered effects (60)

1. **Depth Chase**
2. **Reverse Depth Chase**
3. **Perspective Compression**
4. **Explosion centrale**
5. **Wavefront 3D**
6. **Light Slice / Scanner**
7. **Double Scanner**
8. **Helix**
9. **Double / Triple Helix**
10. **Barber Pole 3D**
11. **Perspective Rotation**
12. **Moiré spatial**
13. **Standing Wave**
14. **Traveling Sinus**
15. **Echo**
16. **Afterglow**
17. **Motion Trails autonome**
18. **Aura virtuelle**
19. **Negative Aura**
20. **Attraction Field**
21. **Repulsion Field**
22. **Wake / Sillage**
23. **Speed Stretch**
24. **Collision virtuelle**
25. **Fusion**
26. **Voronoi autonome**
27. **Territory**
28. **Crowd Simulation**
29. **Portal**
30. **Moving Portal**
31. **Infinite Tunnel**
32. **Perspective Zoom**
33. **Collapse**
34. **Rebuild**
35. **Light Rain**
36. **Gravity Particles**
37. **Spark Field**
38. **Noise Flow**
39. **Turbulence Field**
40. **Reaction Diffusion**
41. **Cellular Automata**
42. **Swarm / Boids**
43. **Data Stream**
44. **Glitch spatial**
45. **Frame Drop**
46. **Time Echo**
47. **Feedback Spatial**
48. **Bass Shockwave**
49. **Spectral Mapping**
50. **Beat Rotation**
51. **Tempo Lock**
52. **Accent Events**
53. **Blackout Chase**
54. **Color Drain**
55. **Temperature Wave**
56. **Palette Morphing**
57. **Section Takeover**
58. **Chain Reaction**
59. **Memory Tunnel**
60. **Idle / Presence / Engage / Release**

## Current Lumina-specific additions

- Portal Relay: Portal A constructs -> slow graph lightning travels to a distant region -> Portal B constructs -> Portal A closes.
- Strict symmetry is a phase grammar for selected frame/cell modes; Portal Relay and free lightning may intentionally run asymmetric.
- Ceiling is the central **area** of the unfolded canvas, not a single line.
- Left and right physical arch sides remain separate artistic regions.
- Autonomous pixels have independent spawn, speed, lifetime, route and spectral affinity; no synchronized packet default.
- Color is automatic and evolving: white + two coherent accent roles, max three semantic colors at once.
- All accepted modes remain available in the library even when not active in the current phase.

// LUMINA V9.1 GLSL CONTRACT
// Source-of-truth for the V9.1 renderer additions installed into
// PIXEL_LIFE/pixel_render_compute by the transactional TD installer.
//
// IMPORTANT: this is a module/contract, not a standalone TD Compute DAT.
// It deliberately reuses existing vec uniforms instead of changing multiparm count.

// uBrain.y  = effectcode = effectId + substate * 0.1
// uControl.z = detected BPM (the old manual V8palette input is removed)

const int LUMINA_EFFECT_MIN = 1;
const int LUMINA_EFFECT_MAX = 60;

// Palette invariant:
// role 0 = WHITE / structural light
// role 1 = PRIMARY ACCENT
// role 2 = SECONDARY ACCENT
// Maximum three semantic source colours at once.
// Families morph continuously; no manual palette menu, no random RGB, no rainbow cycle.

void luminaPaletteFamily(int family, out float h1, out float h2, out float hw)
{
    int f = family % 12;
    h1 = 0.055; h2 = 0.505; hw = 0.070; // copper + teal + warm white
    if (f == 1)  { h1 = 0.585; h2 = 0.520; hw = 0.565; }
    if (f == 2)  { h1 = 0.105; h2 = 0.625; hw = 0.090; }
    if (f == 3)  { h1 = 0.930; h2 = 0.665; hw = 0.955; }
    if (f == 4)  { h1 = 0.475; h2 = 0.760; hw = 0.500; }
    if (f == 5)  { h1 = 0.020; h2 = 0.105; hw = 0.040; }
    if (f == 6)  { h1 = 0.545; h2 = 0.865; hw = 0.570; }
    if (f == 7)  { h1 = 0.155; h2 = 0.485; hw = 0.135; }
    if (f == 8)  { h1 = 0.700; h2 = 0.955; hw = 0.730; }
    if (f == 9)  { h1 = 0.040; h2 = 0.575; hw = 0.020; }
    if (f == 10) { h1 = 0.335; h2 = 0.585; hw = 0.360; }
    if (f == 11) { h1 = 0.085; h2 = 0.905; hw = 0.060; }
}

// Asynchronous-frame invariant:
// every cell owns an independent BPM-related phase offset, construction duration,
// direction, trail style and activation epoch. In strict Y symmetry only the
// mirrored pair shares its seed/timing.

// Long-path invariant:
// Portal Relay and SLOW LIGHTNING are explicitly asymmetric grammars.
// Portal Relay: Portal A -> far real-graph path -> Portal B -> close A.
// Lightning: endpoints should be selected from opposite arch regions and the
// phase conductor must let the journey finish before the next phase takes over.

// 60 additive recipes (IDs are stable project memory):
//  1 Depth Chase
//  2 Reverse Depth Chase
//  3 Perspective Compression
//  4 Explosion centrale
//  5 Wavefront 3D
//  6 Light Slice / Scanner
//  7 Double Scanner
//  8 Helix
//  9 Double / Triple Helix
// 10 Barber Pole 3D
// 11 Perspective Rotation
// 12 Moire spatial
// 13 Standing Wave
// 14 Traveling Sinus
// 15 Echo
// 16 Afterglow
// 17 Motion Trails autonome
// 18 Aura virtuelle
// 19 Negative Aura
// 20 Attraction Field
// 21 Repulsion Field
// 22 Wake / Sillage
// 23 Speed Stretch
// 24 Collision virtuelle
// 25 Fusion
// 26 Voronoi autonome
// 27 Territory
// 28 Crowd Simulation
// 29 Portal
// 30 Moving Portal
// 31 Infinite Tunnel
// 32 Perspective Zoom
// 33 Collapse
// 34 Rebuild
// 35 Light Rain
// 36 Gravity Particles
// 37 Spark Field
// 38 Noise Flow
// 39 Turbulence Field
// 40 Reaction Diffusion
// 41 Cellular Automata
// 42 Swarm / Boids
// 43 Data Stream
// 44 Glitch spatial
// 45 Frame Drop
// 46 Time Echo
// 47 Feedback Spatial
// 48 Bass Shockwave
// 49 Spectral Mapping
// 50 Beat Rotation
// 51 Tempo Lock
// 52 Accent Events
// 53 Blackout Chase
// 54 Color Drain
// 55 Temperature Wave
// 56 Palette Morphing
// 57 Section Takeover
// 58 Chain Reaction
// 59 Memory Tunnel
// 60 Idle / Presence / Engage / Release

// These recipes are additive: choosing one does not delete the core mobile,
// frame, ceiling, side, portal or long-path capabilities.

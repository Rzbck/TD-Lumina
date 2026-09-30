# LUMINA V9.3 — 60 Authored Scene Engine

## Runtime contract
- 60 authored scenes, selected with controlled random weighted by BPM/calm/drive/flow/section change.
- No permanent pixel overlay.
- Maximum two visual scene slots at once.
- Scene B is either the outgoing scene during transition or one approved compatible secondary scene.
- Every scene has an authored entry mode, exit mode, symmetry policy, region policy and energy profile.
- White is punctuation only.
- Generic 60-effect overlay is disabled.
- Agent collision search is disabled for the current authored library.
- Dense pixel division remains 100 for the first V9.3 performance test.

## Families
- 1-8: Frames
- 9-16: Deconstructed frames
- 17-24: Bars
- 25-30: Ceiling area
- 31-36: Left/right sides
- 37-41: Full-arch journeys
- 42-44: Lightning
- 45-48: Portals
- 49-56: Pixel-only
- 57-60: Hybrids

## Transition grammar
Entry/exit modes are data, not global random overlays. Current library uses fade, directional reveal/retract, segment dissolve, center collapse, edge reveal, line wipe, and portal handoff. The outgoing scene stays in slot B until its authored exit completes; afterwards slot B may host one compatible sparse secondary scene.

## Performance contract
- Runtime scene COMPs: 0. Scene definitions are rows/data plus one compiled scene renderer.
- Maximum visual scene slots evaluated per dense pixel: 2.
- Maximum visible mobile agents evaluated by the renderer: 16.
- Agent-agent collision scan: OFF for V9.3 library.
- Generic V9.1 60-effect overlay: removed from runtime.
- Permanent pixel overlay: OFF.
- Target budget: 30 FPS / 33.3 ms per frame; must be measured in TouchDesigner because parent compositing outside PIXEL_LIFE may still dominate.

## Scene catalog
The TouchDesigner installer writes the complete 60-row catalog into `LUMINA_V3_ENGINE/SCENE_CATALOG` and `MUSIC_BRAIN/SCENE_NAMES`. Pixel scenes 49-56 are complete standalone scenes. Hybrids 57-60 are explicitly authored compatible combinations, not accidental stacking.

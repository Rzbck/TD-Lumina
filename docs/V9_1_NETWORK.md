# V9.1 TouchDesigner Network

Validated physical source chain (never modify):

`grid1 -> group1 -> transform3 -> group2 -> transform4 -> endGrid`

## Runtime

`endGrid -> PIXEL_LIFE`

Inside `PIXEL_LIFE`:

- `in1 -> node_id -> edge_unique -> edge_attrs -> edge_strips -> pixel_divide -> pixel_attrs`
- autonomous agent state: `agent_grid -> agent_index -> agent_audio -> agent_attrs -> agent_glsl -> AGENT_STATE`, with `agent_feedback`
- render state: `pixel_attrs + feedback1 + AGENT_STATE + edge_attrs -> pixel_render_glsl -> STATE_OUT`
- `STATE_OUT -> geo1` instancing
- `geo1 + cam1 -> render1 -> RENDER_OUT -> out1`

Audio:

- `switch1 -> AUDIO_FEATURES -> audio_features`
- `switch1 -> AUDIO_PIXEL_MAP -> audio_pixel_spectrum`
- `audio_features + audio_pixel_spectrum -> MUSIC_BRAIN/MUSIC_STATE`

V9.1 keeps GLSL uniform vec multiparm counts unchanged. It reuses existing pixel-render uniforms:

- `uBrain.y` carries `effectcode = effectId + substate * 0.1`
- `uControl.z`, previously wired to the obsolete manual `V8palette`, carries detected BPM

## Compact project registry

`LUMINA_V3_ENGINE` remains documentation/registry only:

- `README`
- `STATUS`
- `REGIONS`
- `COLOR_SYSTEM`
- `PHASE_LIBRARY`
- `EFFECT_LIBRARY`

No duplicate runtime state network is allowed there.

## V9.1 cleanup

After the new runtime compiles, remove only exact unused TouchDesigner template DATs when no parameter references them:

- `MUSIC_BRAIN/MUSIC_STATE_callbacks`
- `PIXEL_LIFE/agent_glsl_compute`
- `PIXEL_LIFE/agent_index_compute1`
- `PIXEL_LIFE/edge_attrs_compute1`
- `PIXEL_LIFE/node_id_compute1`
- `PIXEL_LIFE/pixel_render_glsl_compute`

The manual `V8palette` custom parameter is removed only after the renderer has been rewired to BPM and no expression references it.

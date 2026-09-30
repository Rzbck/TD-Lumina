# V9 implementation notes

The V9 installer patches the **current live compiled** V8.6.x shader text instead of rebuilding the renderer from a copied historical shader. This is deliberate after V8.6 compile failures caused by corrupted source copies.

Validation order:

1. compile Python music callback;
2. assign brain / agent / pixel source;
3. cook `MUSIC_STATE`;
4. cook `agent_glsl`;
5. cook `AGENT_STATE`;
6. cook `pixel_render_glsl`;
7. cook `STATE_OUT`;
8. rollback all three live sources if any required node reports an error.

V9 changes:

- Portal Relay becomes motif 5;
- motif 5 is asymmetric by invariant;
- frame/cell phases receive independent deterministic speed/phase offsets;
- mobile agent lifetime extends up to ~52 seconds in some cases;
- static manual palette selector is ignored by the renderer;
- automatic palette is white + two evolving coherent accents;
- `LUMINA_V3_ENGINE` stores the effect registry and live source snapshots.

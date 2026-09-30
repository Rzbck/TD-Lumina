# Scene specifications

Each Lumina scene gets its own independent specification and implementation in this directory.

Recommended naming:

- `01-tunnel-ribs.md`
- `02-ceiling-river.md`
- ...
- `12-sonic-weave.md`

When the standalone runner is implemented, code should follow the same slugs in a nearby source directory.

Each scene specification should contain:

- scene ID / slug / current version / status;
- visual intention in plain language;
- semantic spatial scope;
- Foundation behavior;
- Motion behavior;
- Accent behavior;
- symmetry policy;
- lifecycle chapters;
- rhythmic behavior;
- pixel species behavior when relevant;
- entrance;
- exit;
- preferred transition handoffs;
- target occupancy / shadow strategy;
- palette roles;
- performance notes;
- current blocking critique;
- next revision goal.

The point is to make scene evolution granular. Changing scene 04 must not require redesigning scene 07.
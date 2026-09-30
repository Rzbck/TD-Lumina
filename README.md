# TD-Lumina

Versioned TouchDesigner control system for the Lumina arch installation.

## Foundation

The project uses a fixed 9 x 5 structural graph from `endGrid`:

- 9 physical arches;
- 5 traverse levels `T1..T5`;
- 45 structural nodes;
- 76 real graph edges;
- dense visual pixels generated only after the structural graph;
- structural points never move; only light/state travels over the graph.

The canonical physical/semantic mapping is now documented in [`docs/ARCH_SEMANTICS.md`](docs/ARCH_SEMANTICS.md). This semantic map is the foundation for all future scene authoring.

Important semantic facts:

- 8 longitudinal bays x 4 cross bands = 32 addressable architectural zones;
- cross bands are `LEFT_UPRIGHT`, `CEILING_LEFT`, `CEILING_RIGHT`, `RIGHT_UPRIGHT`;
- the ceiling is an area made of two semantic bands, not one center line;
- node/edge attributes carry physical arch IDs, traverse IDs, zone adjacency, mirror IDs, Sender coordinates and physical-meter coordinates;
- semantic mapping happens before `pixel_divide`, so dense pixels inherit architectural meaning;
- Art-Net/DMX output is downstream and must not be modified by scene development.

## Runtime constraints

- TouchDesigner: **2025.33070**
- Python: **3.11.15**
- Root: `/project1/Renders/Saison3/base2/new1`
- Structural chain: `grid1 -> group1 -> transform3 -> group2 -> transform4 -> endGrid`
- Camera: orthographic width **1.0**
- Dense line division: **100** unless profiling proves a reduction is necessary
- Target: **30 FPS / 33.3 ms frame budget**

## Repository map

- [`AGENTS.md`](AGENTS.md) — short contract for ChatGPT/Codex and future coding agents.
- [`docs/PROJECT_MEMORY.md`](docs/PROJECT_MEMORY.md) — stable facts and current state.
- [`docs/ARCH_SEMANTICS.md`](docs/ARCH_SEMANTICS.md) — canonical physical + semantic tunnel map.
- [`docs/VISUAL_LANGUAGE.md`](docs/VISUAL_LANGUAGE.md) — what is visually wanted / rejected.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — TouchDesigner graph and data flow.
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — important design decisions and why they were made.
- [`docs/TEST_PROTOCOL.md`](docs/TEST_PROTOCOL.md) — how every new version must be evaluated.
- [`src/glsl/`](src/glsl/) — canonical GLSL snapshots.
- [`src/python/`](src/python/) — music-analysis brain snapshots.
- [`patches/`](patches/) — complete TouchDesigner injection scripts.

## Working rule

GitHub is the long-term source of truth. Chat history is useful context, but accepted physical facts, semantic attributes, architecture constraints, rejected behaviors and next actions must be written here so a new ChatGPT/Codex session can resume without reconstructing the project from memory.

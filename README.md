# TD-Lumina

Versioned TouchDesigner control system for the Lumina arch installation.

The project uses a fixed 9 x 5 structural graph from `endGrid` (45 nodes / 76 edges) and a dense pixel renderer generated after the structural graph. Structural points never move; only light/state travels over the graph.

## Current baseline

- Stable accepted base: **V8.5 Architecture Fix**
- Next development line: **V8.6 Audio + Motion + Strict Symmetry**
- TouchDesigner: **2025.33070**
- Python: **3.11.15**
- Camera: orthographic width **1.0**

## Repository map

- [`AGENTS.md`](AGENTS.md) — short contract for ChatGPT/Codex and future coding agents.
- [`docs/PROJECT_MEMORY.md`](docs/PROJECT_MEMORY.md) — stable facts and current state.
- [`docs/VISUAL_LANGUAGE.md`](docs/VISUAL_LANGUAGE.md) — what is visually wanted / rejected.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — TouchDesigner graph and data flow.
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — important design decisions and why they were made.
- [`docs/TEST_PROTOCOL.md`](docs/TEST_PROTOCOL.md) — how every new version must be evaluated.
- [`src/glsl/`](src/glsl/) — canonical GLSL snapshots.
- [`src/python/`](src/python/) — music-analysis brain snapshots.
- [`patches/`](patches/) — complete TouchDesigner injection scripts.

## Working rule

GitHub is the long-term source of truth. Chat history is useful context, but accepted versions, rejected behaviors, architecture constraints, and next actions must be written here so a new ChatGPT/Codex session can resume without reconstructing the project from memory.

# ChatGPT / Codex handoff

Use this at the beginning of a fresh project chat or coding session:

> Work on `Rzbck/TD-Lumina`. Before proposing or changing anything, read `AGENTS.md`, `docs/PROJECT_MEMORY.md`, `docs/VISUAL_LANGUAGE.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, and `docs/TEST_PROTOCOL.md`. Check open issues and the current draft PR. Treat the repository as the source of truth. Do not rebuild `endGrid` topology. Preserve the last accepted version until the new version passes the visual test protocol. When I explicitly like/dislike a behavior, update `docs/VISUAL_LANGUAGE.md`; when an architecture rule changes, update `docs/DECISIONS.md` and `docs/PROJECT_MEMORY.md`.

## Session close-out

Before ending a substantial session:

1. note the last runtime-tested version;
2. record what the user liked/disliked;
3. record unresolved visual/code problems;
4. update the relevant issue/PR;
5. leave the next exact test or patch in `docs/PROJECT_MEMORY.md` or the active ExecPlan.

This is more reliable than expecting chat memory alone to preserve shader-level implementation details.

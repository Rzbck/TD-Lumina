# Scene Lab reviews

This folder stores granular review history for scenes and transitions.

Do not overwrite the only review of an older scene version. Reviews are evidence of why the next version changed.

## Scene review naming

Use:

`scene-XX-vYY.md`

Example:

`scene-04-v03.md`

A review should follow [`../REVIEW_TEMPLATE.md`](../REVIEW_TEMPLATE.md).

## Transition review naming

Use:

`transition-AA-vXX_to_BB-vYY-vZZ.md`

where `ZZ` is the transition revision.

Example:

`transition-07-v02_to_08-v03-v01.md`

## Status discipline

Allowed scene/review states:

- `draft`
- `rework`
- `approved`
- `rejected`

`approved` means that exact scene version is visually accepted. Later experiments should create a new scene version instead of silently changing approved behaviour.

## Review data that should always be reproducible

Record at minimum:

- scene version;
- seed;
- BPM;
- phrase position or capture beat;
- audio file/test mode when relevant;
- numeric ratings;
- written critique;
- required changes;
- accepted behaviour that must not regress.

The future Scene Lab UI should be able to export this information as JSON as well as display it interactively.

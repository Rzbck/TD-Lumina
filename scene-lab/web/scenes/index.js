import tunnelRibs from './tunnel-ribs.js';
import parallelChambers from './parallel-chambers.js';
import livingPixelSpecies from './living-pixel-species.js';
import { generatedScenes } from './generated-scenes.js';

const customScenes = [
  { ...tunnelRibs, family: 'ribs', status: 'PROTOTYPE' },
  { ...parallelChambers, family: 'chambers', status: 'PROTOTYPE' },
  { ...livingPixelSpecies, family: 'pixels', status: 'PROTOTYPE' },
];

export const scenes = [...generatedScenes, ...customScenes].sort((a, b) => a.id - b.id);
export const sceneBySlug = new Map(scenes.map((scene) => [scene.slug, scene]));

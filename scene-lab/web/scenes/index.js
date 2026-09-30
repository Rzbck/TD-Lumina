import tunnelRibs from './tunnel-ribs.js';
import parallelChambers from './parallel-chambers.js';
import livingPixelSpecies from './living-pixel-species.js';

export const scenes = [tunnelRibs, parallelChambers, livingPixelSpecies];
export const sceneBySlug = new Map(scenes.map((scene) => [scene.slug, scene]));

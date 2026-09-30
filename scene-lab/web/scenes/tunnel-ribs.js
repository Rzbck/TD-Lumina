export default {
  id: 1,
  slug: 'tunnel-ribs',
  title: 'Tunnel Ribs',
  version: '0.1-lab',
  usesAgents: false,
  shaderLabel: 'Ribs / multi-front',
  logic: `
SceneResult sceneEval() {
  float chapter = floor(uBeat / 8.0);
  float archCoord = mix(aFlat.x * 8.0, aWorld.z / 1.5, 0.5);
  float ribSelect = step(0.44, hash11(floor(max(aArchId, archCoord)) + chapter * 17.0 + uSeed * 0.13));
  float archEdge = 1.0 - step(0.5, aEdgeKind);
  float traverseEdge = step(0.5, aEdgeKind);

  float foundation = 0.10 + archEdge * ribSelect * 0.30;
  foundation += traverseEdge * 0.08 * (0.35 + 0.65 * uContextDrive);

  float frontA = mod(uBeat * mix(0.50, 0.92, uContextDrive) + uSeed * 0.37, 9.0);
  float frontB = mod(uBeat * mix(0.31, 0.68, uContextDrive) + 4.5 + uSeed * 0.19, 9.0);
  float da = abs(archCoord - frontA);
  float db = abs(archCoord - frontB);
  float motion = exp(-da * da * 2.6) + 0.65 * exp(-db * db * 3.1);

  float crossWave = 0.5 + 0.5 * sin((aFlat.y * 6.28318 * 1.5) - uBeat * 1.7 + hash11(aEdgeId) * 2.0);
  motion += archEdge * crossWave * 0.16 * uContextDrive;

  float accentPulse = pulseFract(fract(uBeat * 0.25 + hash11(chapter + uSeed)), 0.055);
  float accent = accentPulse * step(0.80, hash11(aEdgeId + chapter * 5.0)) * 0.75;

  vec3 c = uColorPrimary * foundation + uColorMotion * motion * 0.75 + uColorAccent * accent;
  float intensity = clamp(foundation + motion * 0.58 + accent, 0.0, 1.0);
  return SceneResult(c, intensity, 1.8 + motion * 2.8 + accent * 2.0);
}`,
};

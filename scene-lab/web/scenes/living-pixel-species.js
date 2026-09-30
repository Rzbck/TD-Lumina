export default {
  id: 11,
  slug: 'living-pixel-species',
  title: 'Living Pixel Species',
  version: '0.1-lab',
  usesAgents: true,
  shaderLabel: 'Agents / semantic cycles',
  logic: `
SceneResult sceneEval() {
  float edgeNoise = hash11(aEdgeId * 0.71 + uSeed * 0.13);
  float architectureFloor = mix(0.045, 0.10, uContextDrive) * (0.65 + 0.35 * edgeNoise);
  float ceilingBias = step(0.5, 1.0 - abs(aFlat.y - 0.5) * 1.6) * 0.025;
  float foundation = architectureFloor + ceilingBias;
  vec3 c = uColorPrimary * foundation;
  return SceneResult(c, clamp(foundation, 0.0, 0.18), 1.55);
}`,
};

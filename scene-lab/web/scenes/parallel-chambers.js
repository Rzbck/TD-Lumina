export default {
  id: 4,
  slug: 'parallel-chambers',
  title: 'Parallel Chambers',
  version: '0.1-lab',
  usesAgents: false,
  shaderLabel: 'Zones / chamber construction',
  logic: `
float zoneHit(float z, float target) {
  return 1.0 - step(0.25, abs(z - target));
}

SceneResult sceneEval() {
  float chapter = floor(uBeat / 8.0);
  float z0 = mod(floor(hash11(chapter + uSeed * 0.17) * 32.0), 32.0);
  float z1 = mod(z0 + 7.0 + floor(hash11(chapter + 11.0) * 8.0), 32.0);
  float z2 = mod(z0 + 17.0 + floor(hash11(chapter + 29.0) * 10.0), 32.0);

  float hit0 = max(zoneHit(aZoneA, z0), zoneHit(aZoneB, z0));
  float hit1 = max(zoneHit(aZoneA, z1), zoneHit(aZoneB, z1));
  float hit2 = max(zoneHit(aZoneA, z2), zoneHit(aZoneB, z2));
  float chamber = clamp(hit0 + hit1 + hit2, 0.0, 1.0);

  float localPhase = fract(aSegmentU + hash11(aEdgeId + chapter * 13.0) * 0.55);
  float build = smoothstep(0.0, 0.25, fract(uBeat * (0.12 + 0.06 * uContextDrive) + hash11(aEdgeId + chapter)) - localPhase * 0.22);
  float breath = 0.62 + 0.38 * sin(uBeat * 0.65 + hash11(aEdgeId) * 6.28318);

  float foundation = 0.09 + chamber * 0.28;
  float motion = chamber * (0.22 + 0.48 * build) * (0.72 + 0.28 * breath);

  float perimeterSpark = chamber * pulseFract(fract(uBeat * 0.5 + hash11(aEdgeId + chapter * 3.0)), 0.035);
  float accent = perimeterSpark * step(0.86, hash11(aEdgeId + z0 + z1 + z2)) * 0.75;

  vec3 c = uColorPrimary * foundation + uColorMotion * motion + uColorAccent * accent;
  float intensity = clamp(foundation + motion + accent, 0.0, 1.0);
  return SceneResult(c, intensity, 1.9 + chamber * 1.5 + accent * 2.2);
}`,
};

export const ARCH_COUNT = 9;
export const TRAVERSE_COUNT = 5;
export const BAY_COUNT = 8;
export const BAND_COUNT = 4;
export const ZONE_COUNT = 32;
export const TUNNEL_M = 12.0;
export const ARCH_PATH_M = 6.89966;
export const CEILING_WIDTH_M = 2.465;
export const UPRIGHT_M = 2.21733;
export const ARCH_X_M = [0, 1.5, 3.0, 4.5, 6.0, 7.5, 9.0, 10.5, 12.0];
export const CROSS_M = [0.0, 2.21733, 3.44983, 4.68233, 6.89966];
export const SENDER_X = [0, 89, 179, 269, 359, 450, 539, 629, 719];
export const SENDER_Y = [1, 134, 208, 281, 414];

// Exact physical fixture counts copied from /project1/ArtnetAll.
// One arch is 133 left + 148 ceiling + 133 right = 414 LEDs.
// Each 3 m traverse fixture block is 179 LEDs; there are 4 blocks x 5 traverses.
export const ARCH_LED_LEFT = 133;
export const ARCH_LED_CEILING = 148;
export const ARCH_LED_RIGHT = 133;
export const ARCH_LED_TOTAL = 414;
export const TRAVERSE_LED_PER_BLOCK = 179;
export const TRAVERSE_BLOCK_COUNT = 4;
export const PHYSICAL_ARCH_LED_COUNT = ARCH_COUNT * ARCH_LED_TOTAL;
export const PHYSICAL_TRAVERSE_LED_COUNT = TRAVERSE_COUNT * TRAVERSE_BLOCK_COUNT * TRAVERSE_LED_PER_BLOCK;
export const PHYSICAL_LED_COUNT = PHYSICAL_ARCH_LED_COUNT + PHYSICAL_TRAVERSE_LED_COUNT;

// Physical line geometry from ArtnetAll. The tiny offsets are deliberate in the TD fixture model.
const ARCH_HALF_WIDTH_M = CEILING_WIDTH_M * 0.5;
const ARCH_UPRIGHT_TOP_M = 2.2173;
const ARCH_CEILING_Y_M = 2.234;
const TRAVERSE_X_M = [-ARCH_HALF_WIDTH_M, -ARCH_HALF_WIDTH_M, 0.0, ARCH_HALF_WIDTH_M, ARCH_HALF_WIDTH_M];
const TRAVERSE_Y_M = [-0.025, 2.255, 2.255, 2.255, -0.025];
const TRAVERSE_BLOCK_Z_M = [-0.007, 3.007, 6.0212, 9.0355];

export const BAND_NAMES = [
  'LEFT_UPRIGHT',
  'CEILING_LEFT',
  'CEILING_RIGHT',
  'RIGHT_UPRIGHT',
];

export function nodeId(archId, traverseId) {
  return archId * TRAVERSE_COUNT + traverseId;
}

export function nodeFromId(id) {
  return {
    archId: Math.floor(id / TRAVERSE_COUNT),
    traverseId: id % TRAVERSE_COUNT,
  };
}

export function zoneId(bayId, bandId) {
  return bayId * BAND_COUNT + bandId;
}

export function bandRegion(bandId) {
  if (bandId === 0) return 0;
  if (bandId === 3) return 2;
  return 1;
}

export function crossSectionFromPath(crossM) {
  const half = CEILING_WIDTH_M * 0.5;
  if (crossM <= UPRIGHT_M) {
    return [-half, crossM];
  }
  if (crossM <= UPRIGHT_M + CEILING_WIDTH_M) {
    return [-half + (crossM - UPRIGHT_M), UPRIGHT_M];
  }
  return [half, ARCH_PATH_M - crossM];
}

function makeNode(archId, traverseId) {
  const xM = ARCH_X_M[archId];
  const crossM = CROSS_M[traverseId];
  const [crossX, heightY] = crossSectionFromPath(crossM);
  return {
    id: nodeId(archId, traverseId),
    archId,
    traverseId,
    logical: [archId / (ARCH_COUNT - 1), crossM / ARCH_PATH_M],
    physical: [xM, crossM],
    world: [crossX, heightY, xM],
    sender: [SENDER_X[archId], SENDER_Y[traverseId]],
  };
}

function zonesForArchEdge(archId, bandId) {
  const leftBay = archId - 1;
  const rightBay = archId;
  return [
    leftBay >= 0 && leftBay < BAY_COUNT ? zoneId(leftBay, bandId) : -1,
    rightBay >= 0 && rightBay < BAY_COUNT ? zoneId(rightBay, bandId) : -1,
  ];
}

function zonesForTraverseEdge(traverseId, bayId) {
  const lowerBand = traverseId - 1;
  const upperBand = traverseId;
  return [
    lowerBand >= 0 && lowerBand < BAND_COUNT ? zoneId(bayId, lowerBand) : -1,
    upperBand >= 0 && upperBand < BAND_COUNT ? zoneId(bayId, upperBand) : -1,
  ];
}

export function buildSemanticGraph() {
  const nodes = [];
  for (let a = 0; a < ARCH_COUNT; a += 1) {
    for (let t = 0; t < TRAVERSE_COUNT; t += 1) {
      nodes.push(makeNode(a, t));
    }
  }

  const edges = [];
  let edgeId = 0;

  // 36 cross-arch/U-path spans: 9 arches x 4 bands.
  for (let a = 0; a < ARCH_COUNT; a += 1) {
    for (let band = 0; band < BAND_COUNT; band += 1) {
      const n0 = nodes[nodeId(a, band)];
      const n1 = nodes[nodeId(a, band + 1)];
      edges.push({
        id: edgeId++,
        kind: 0,
        n0: n0.id,
        n1: n1.id,
        archId: a,
        traverseId: -1,
        bayId: -1,
        bandId: band,
        regionId: bandRegion(band),
        zones: zonesForArchEdge(a, band),
        lengthM: Math.abs(n1.physical[1] - n0.physical[1]),
      });
    }
  }

  // 40 longitudinal traverse spans: 5 traverses x 8 bays.
  for (let t = 0; t < TRAVERSE_COUNT; t += 1) {
    for (let bay = 0; bay < BAY_COUNT; bay += 1) {
      const n0 = nodes[nodeId(bay, t)];
      const n1 = nodes[nodeId(bay + 1, t)];
      edges.push({
        id: edgeId++,
        kind: 1,
        n0: n0.id,
        n1: n1.id,
        archId: -1,
        traverseId: t,
        bayId: bay,
        bandId: Math.max(0, Math.min(BAND_COUNT - 1, t === TRAVERSE_COUNT - 1 ? t - 1 : t)),
        regionId: -1,
        zones: zonesForTraverseEdge(t, bay),
        lengthM: Math.abs(n1.physical[0] - n0.physical[0]),
      });
    }
  }

  const adjacency = Array.from({ length: nodes.length }, () => []);
  for (const edge of edges) {
    adjacency[edge.n0].push({ edgeId: edge.id, other: edge.n1 });
    adjacency[edge.n1].push({ edgeId: edge.id, other: edge.n0 });
  }

  return { nodes, edges, adjacency };
}

export function interpolateEdge(graph, edgeId, u) {
  const edge = graph.edges[edgeId];
  const a = graph.nodes[edge.n0];
  const b = graph.nodes[edge.n1];
  const mix = (x, y) => x + (y - x) * u;
  return {
    flat: [mix(a.logical[0], b.logical[0]), mix(a.logical[1], b.logical[1])],
    world: [
      mix(a.world[0], b.world[0]),
      mix(a.world[1], b.world[1]),
      mix(a.world[2], b.world[2]),
    ],
  };
}

function pushSample(out, sample) {
  out.push(
    sample.flat[0], sample.flat[1],
    sample.world[0], sample.world[1], sample.world[2],
    sample.archId, sample.traverseId, sample.kind, sample.bandId,
    sample.zones[0], sample.zones[1], sample.segmentU,
    sample.edgeId, sample.bayId, sample.regionId,
  );
}

function archBandAndU(section, index, count) {
  if (section === 0) return [0, count <= 1 ? 0 : index / (count - 1)];
  if (section === 1) {
    // 148 ceiling LEDs = two physical halves of 74 LEDs each.
    if (index < 74) return [1, index / 73];
    return [2, (index - 74) / 73];
  }
  return [3, count <= 1 ? 0 : index / (count - 1)];
}

function physicalArchSamples(graph, out) {
  for (let archId = 0; archId < ARCH_COUNT; archId += 1) {
    const z = ARCH_X_M[archId];
    const senderX = SENDER_X[archId] / 719;
    let physicalIndex = 0;

    const sections = [ARCH_LED_LEFT, ARCH_LED_CEILING, ARCH_LED_RIGHT];
    for (let section = 0; section < sections.length; section += 1) {
      const count = sections[section];
      for (let i = 0; i < count; i += 1) {
        const f = count <= 1 ? 0 : i / (count - 1);
        let x;
        let y;
        if (section === 0) {
          x = -ARCH_HALF_WIDTH_M;
          y = ARCH_UPRIGHT_TOP_M * f;
        } else if (section === 1) {
          x = -ARCH_HALF_WIDTH_M + CEILING_WIDTH_M * f;
          y = ARCH_CEILING_Y_M;
        } else {
          x = ARCH_HALF_WIDTH_M;
          y = ARCH_UPRIGHT_TOP_M * (1 - f);
        }

        const [bandId, segmentU] = archBandAndU(section, i, count);
        const edgeId = archId * BAND_COUNT + bandId;
        const edge = graph.edges[edgeId];
        const senderY = (physicalIndex + 1) / 414;
        pushSample(out, {
          flat: [senderX, senderY],
          world: [x, y, z],
          archId,
          traverseId: -1,
          kind: 0,
          bandId,
          zones: edge.zones,
          segmentU,
          edgeId,
          bayId: -1,
          regionId: bandRegion(bandId),
        });
        physicalIndex += 1;
      }
    }
  }
}

function physicalTraverseSamples(graph, out) {
  for (let traverseId = 0; traverseId < TRAVERSE_COUNT; traverseId += 1) {
    for (let block = 0; block < TRAVERSE_BLOCK_COUNT; block += 1) {
      const z0Physical = TRAVERSE_BLOCK_Z_M[block] + (traverseId === 0 ? 0.0 : 0.00125);
      const z1Physical = TRAVERSE_BLOCK_Z_M[block] + (traverseId === 0 ? 3.0 : 2.99875);
      for (let i = 0; i < TRAVERSE_LED_PER_BLOCK; i += 1) {
        const f = i / (TRAVERSE_LED_PER_BLOCK - 1);
        // Semantic depth stays canonical 0..12 m; the rendered world coordinate keeps TD's tiny fixture offsets.
        const canonicalZ = block * 3.0 + f * 3.0;
        const physicalZ = z0Physical + (z1Physical - z0Physical) * f;
        const bayId = Math.min(BAY_COUNT - 1, Math.max(0, Math.floor(Math.min(canonicalZ, 11.999999) / 1.5)));
        const edgeId = ARCH_COUNT * BAND_COUNT + traverseId * BAY_COUNT + bayId;
        const edge = graph.edges[edgeId];
        const segmentU = Math.max(0, Math.min(1, (canonicalZ - bayId * 1.5) / 1.5));
        pushSample(out, {
          flat: [canonicalZ / TUNNEL_M, SENDER_Y[traverseId] / 414],
          world: [TRAVERSE_X_M[traverseId], TRAVERSE_Y_M[traverseId], physicalZ],
          archId: -1,
          traverseId,
          kind: 1,
          bandId: edge.bandId,
          zones: edge.zones,
          segmentU,
          edgeId,
          bayId,
          regionId: -1,
        });
      }
    }
  }
}

// Historical name retained for engine compatibility. This no longer invents a uniform
// number of samples per semantic edge. It emits the exact fixture point counts from ArtnetAll.
export function buildDenseSamples(graph) {
  const stride = 15;
  const values = [];
  physicalArchSamples(graph, values);
  physicalTraverseSamples(graph, values);
  const data = new Float32Array(values);
  const count = data.length / stride;
  if (count !== PHYSICAL_LED_COUNT) {
    throw new Error(`Physical LED map mismatch: expected ${PHYSICAL_LED_COUNT}, got ${count}`);
  }
  return {
    data,
    stride,
    count,
    physical: {
      arch_pixels: PHYSICAL_ARCH_LED_COUNT,
      traverse_pixels: PHYSICAL_TRAVERSE_LED_COUNT,
      total_pixels: PHYSICAL_LED_COUNT,
    },
  };
}

export function edgeIdBetween(graph, nodeA, nodeB) {
  for (const link of graph.adjacency[nodeA]) {
    if (link.other === nodeB) return link.edgeId;
  }
  return -1;
}

export function makeRectangularCycle(graph, archA, archB, traverseA, traverseB) {
  const a0 = Math.min(archA, archB);
  const a1 = Math.max(archA, archB);
  const t0 = Math.min(traverseA, traverseB);
  const t1 = Math.max(traverseA, traverseB);
  const nodes = [];

  for (let a = a0; a <= a1; a += 1) nodes.push(nodeId(a, t0));
  for (let t = t0 + 1; t <= t1; t += 1) nodes.push(nodeId(a1, t));
  for (let a = a1 - 1; a >= a0; a -= 1) nodes.push(nodeId(a, t1));
  for (let t = t1 - 1; t > t0; t -= 1) nodes.push(nodeId(a0, t));
  nodes.push(nodeId(a0, t0));

  const route = [];
  for (let i = 0; i < nodes.length - 1; i += 1) {
    const eid = edgeIdBetween(graph, nodes[i], nodes[i + 1]);
    if (eid < 0) throw new Error(`Invalid semantic route ${nodes[i]} -> ${nodes[i + 1]}`);
    route.push({ edgeId: eid, from: nodes[i], to: nodes[i + 1] });
  }
  return route;
}

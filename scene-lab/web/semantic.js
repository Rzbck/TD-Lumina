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

export function buildDenseSamples(graph, divisions = 52) {
  const stride = 15;
  const data = new Float32Array(graph.edges.length * divisions * stride);
  let k = 0;
  for (const edge of graph.edges) {
    for (let i = 0; i < divisions; i += 1) {
      const u = divisions === 1 ? 0 : i / (divisions - 1);
      const p = interpolateEdge(graph, edge.id, u);
      data[k++] = p.flat[0];
      data[k++] = p.flat[1];
      data[k++] = p.world[0];
      data[k++] = p.world[1];
      data[k++] = p.world[2];
      data[k++] = edge.archId;
      data[k++] = edge.traverseId;
      data[k++] = edge.kind;
      data[k++] = edge.bandId;
      data[k++] = edge.zones[0];
      data[k++] = edge.zones[1];
      data[k++] = u;
      data[k++] = edge.id;
      data[k++] = edge.bayId;
      data[k++] = edge.regionId;
    }
  }
  return { data, stride, count: graph.edges.length * divisions };
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

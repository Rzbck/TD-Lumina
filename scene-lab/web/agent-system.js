import { makeRectangularCycle, interpolateEdge } from './semantic.js';

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(seed, index) {
  const s = Math.floor(Number(seed) || 1) >>> 0;
  return (s ^ Math.imul(index + 1, 0x9E3779B1)) >>> 0;
}

export class AgentSystem {
  constructor(graph) {
    this.graph = graph;
    this.seed = null;
    this.agents = [];
  }

  reset(seed) {
    this.seed = Number(seed) || 1;
    this.agents = [];
    const count = 28;

    for (let i = 0; i < count; i += 1) {
      const rng = mulberry32(hashSeed(this.seed, i));
      let archA = Math.floor(rng() * 5);
      let archB = Math.min(8, archA + 3 + Math.floor(rng() * 5));
      if (archB <= archA) archB = Math.min(8, archA + 3);
      let traverseA = Math.floor(rng() * 4);
      let traverseB = traverseA + 1 + Math.floor(rng() * (4 - traverseA));
      traverseB = Math.min(4, traverseB);

      const route = makeRectangularCycle(this.graph, archA, archB, traverseA, traverseB);
      const segmentLengths = route.map(({ edgeId }) => this.graph.edges[edgeId].lengthM);
      const totalLength = segmentLengths.reduce((a, b) => a + b, 0);
      const species = i % 3;
      const baseSpeed = [0.45, 0.78, 1.08][species];
      const speed = baseSpeed * (0.72 + rng() * 0.62);
      const tail = [5, 9, 13][species] + Math.floor(rng() * 4);
      const phaseM = rng() * totalLength;
      const direction = rng() > 0.5 ? 1 : -1;
      const brightness = 0.66 + rng() * 0.34;
      const colorRole = species === 2 ? 2 : 1;

      this.agents.push({
        id: i,
        species,
        route,
        segmentLengths,
        totalLength,
        speed,
        tail,
        phaseM,
        direction,
        brightness,
        colorRole,
        archA,
        archB,
        traverseA,
        traverseB,
      });
    }
  }

  _routePosition(agent, distanceM) {
    const total = agent.totalLength;
    let d = ((distanceM % total) + total) % total;
    if (agent.direction < 0) d = total - d;

    for (let i = 0; i < agent.route.length; i += 1) {
      const segLen = agent.segmentLengths[i];
      if (d <= segLen || i === agent.route.length - 1) {
        const leg = agent.route[i];
        const edge = this.graph.edges[leg.edgeId];
        const uLocal = segLen > 0 ? Math.min(1, Math.max(0, d / segLen)) : 0;
        const forward = edge.n0 === leg.from;
        const u = forward ? uLocal : 1 - uLocal;
        const p = interpolateEdge(this.graph, leg.edgeId, u);
        return {
          edgeId: leg.edgeId,
          u,
          flat: p.flat,
          world: p.world,
          routeIndex: i,
        };
      }
      d -= segLen;
    }

    return null;
  }

  sample(timeSeconds, contextDrive = 0.5) {
    const output = [];
    const diagnostics = [];
    const density = 0.62 + contextDrive * 0.38;

    for (const agent of this.agents) {
      if ((agent.id % 10) / 10 > density) continue;
      const headDistance = agent.phaseM + timeSeconds * agent.speed;
      const tailStep = 0.075 + agent.species * 0.018;
      const head = this._routePosition(agent, headDistance);
      if (!head) continue;

      diagnostics.push({
        id: agent.id,
        species: agent.species,
        speed_mps: Number(agent.speed.toFixed(4)),
        tail_points: agent.tail,
        edge_id: head.edgeId,
        segment_u: Number(head.u.toFixed(5)),
        route_index: head.routeIndex,
        route_edges: agent.route.map((x) => x.edgeId),
      });

      for (let j = 0; j < agent.tail; j += 1) {
        const p = this._routePosition(agent, headDistance - j * tailStep);
        if (!p) continue;
        const fade = 1 - j / Math.max(1, agent.tail);
        output.push({
          flat: p.flat,
          world: p.world,
          intensity: agent.brightness * fade * fade,
          size: 4.5 + agent.species * 1.8 + (j === 0 ? 2.2 : 0),
          colorRole: agent.colorRole,
          agentId: agent.id,
        });
      }
    }

    return { points: output, diagnostics };
  }
}

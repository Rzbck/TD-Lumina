const TITLES = [
  null,
  'Tunnel Ribs', 'Ceiling River', 'Left Ceiling Right', 'Parallel Chambers', 'Arch March',
  'Traverse Wave', 'Mirror Cathedral', 'Symmetry Release Journey', 'Zone Relay', 'Shadow Light Alternation',
  'Living Pixel Species', 'Sonic Weave', 'Depth Loom', 'Rib Cascade', 'Ceiling Braids',
  'Left Wall Current', 'Right Wall Current', 'Cross Arch Sweep', 'Staggered Portals', 'Broken Symmetry Relay',
  'Quiet Constellation', 'Junction Sparks', 'Long Walker', 'Twin Walkers', 'Ceiling Cells',
  'Nested Chambers', 'Expanding Frames', 'Contracting Frames', 'Perimeter Chase', 'Corner Growth',
  'Center Out Doors', 'Zone Snake', 'Zone Bloom', 'Bay Pulse Train', 'Traverse Ladder',
  'Arch Ladder', 'Sparse Moire', 'Standing Field', 'Traveling Sinus', 'Depth Compression',
  'Perspective Scanner', 'Double Scanner', 'Helix Route', 'Dual Helix', 'Memory Trails',
  'Echo Corridor', 'Afterglow Relay', 'Collision Meeting', 'Rebuild From Pixels', 'Section Takeover',
];

const FIRST_FAMILIES = {
  2: 'ceiling', 3: 'cross', 5: 'ribs', 6: 'wave', 7: 'mirror', 8: 'relay',
  9: 'relay', 10: 'shadow', 12: 'weave',
};
const FAMILY_CYCLE = ['ribs', 'ceiling', 'cross', 'chambers', 'wave', 'mirror', 'relay', 'shadow', 'pixels', 'weave'];
const CUSTOM_IDS = new Set([1, 4, 11]);

function familyFor(id) {
  if (FIRST_FAMILIES[id]) return FIRST_FAMILIES[id];
  return FAMILY_CYCLE[(id - 13) % FAMILY_CYCLE.length];
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function logicFor(id, family) {
  const v = ((id - 1) % 5) + 1;
  const speed = (0.18 + 0.07 * v).toFixed(3);
  const phase = ((id * 0.137) % 1).toFixed(3);

  if (family === 'ribs') return `
SceneResult sceneEval() {
  float archEdge = 1.0 - step(0.5, aEdgeKind);
  float traverseEdge = step(0.5, aEdgeKind);
  float archCoord = max(aArchId, aFlat.x * 8.0);
  float selector = step(${(0.35 + 0.07 * (v % 3)).toFixed(3)}, hash11(floor(archCoord) + floor(uBeat/4.0)*11.0 + uSeed*0.17 + ${id}.0));
  float front = mod(uBeat*${speed} + ${(Number(phase) * 9).toFixed(3)}, 9.0);
  float d = abs(archCoord-front);
  float motion = exp(-d*d*${(1.7 + 0.35 * v).toFixed(3)});
  float foundation = 0.055 + archEdge*selector*${(0.35 + 0.04 * (v % 4)).toFixed(3)} + traverseEdge*0.035;
  float accent = pulseFract(fract(uBeat*0.25 + hash11(aEdgeId+${id}.0)),0.045)*step(0.91,hash11(aEdgeId*1.7+${id}.0));
  vec3 c = uColorPrimary*foundation + uColorMotion*motion*0.72 + uColorAccent*accent;
  return SceneResult(c, clamp(foundation+motion*0.62+accent,0.0,1.0), 1.7+motion*2.6+accent*1.5);
}`;

  if (family === 'ceiling') return `
SceneResult sceneEval() {
  float ceiling = (1.0-step(0.5,abs(aBandId-1.5))) * (1.0-step(0.5,aEdgeKind));
  ceiling = max(ceiling, step(0.5,aEdgeKind)*(1.0-step(1.5,abs(aTraverseId-2.0))));
  float x = aFlat.x*12.0;
  float river = 0.5+0.5*sin(x*${(1.1 + 0.18 * v).toFixed(3)}-uBeat*${(0.8 + 0.16 * v).toFixed(3)}+${id}.0);
  river = pow(max(river,0.0), ${(2.0 + 0.35 * v).toFixed(3)});
  float foundation = 0.035 + ceiling*${(0.18 + 0.03 * v).toFixed(3)};
  float motion = ceiling*river*(0.35+0.5*uContextDrive);
  float accent = ceiling*pulseFract(fract(uBeat*0.125+hash11(aEdgeId)),0.028)*0.55;
  vec3 c=uColorPrimary*foundation+uColorMotion*motion+uColorAccent*accent;
  return SceneResult(c,clamp(foundation+motion+accent,0.0,1.0),1.6+motion*3.1);
}`;

  if (family === 'cross') return `
SceneResult sceneEval() {
  float head=fract(uBeat*${speed}+${phase});
  float d=abs(aFlat.y-head); d=min(d,1.0-d);
  float motion=exp(-d*d*${70 + 10 * v}.0);
  float foundation=0.045 + (1.0-step(0.5,aEdgeKind))*0.08;
  float stagger=0.55+0.45*sin(aFlat.x*6.28318*${1 + (v % 3)}.0 + uBeat*0.27);
  motion*=0.55+0.45*stagger;
  float accent=motion*step(0.93,hash11(aEdgeId+floor(uBeat)+${id}.0))*0.7;
  vec3 c=uColorPrimary*foundation+uColorMotion*motion*0.8+uColorAccent*accent;
  return SceneResult(c,clamp(foundation+motion*0.8+accent,0.0,1.0),1.7+motion*3.0);
}`;

  if (family === 'chambers') return `
SceneResult sceneEval() {
  float chapter=floor(uBeat/8.0);
  float target=mod(floor(hash11(chapter+uSeed*0.13+${id}.0)*32.0)+${(id * 3) % 11}.0,32.0);
  float target2=mod(target+${5 + v * 2}.0,32.0);
  float h0=max(1.0-step(0.25,abs(aZoneA-target)),1.0-step(0.25,abs(aZoneB-target)));
  float h1=max(1.0-step(0.25,abs(aZoneA-target2)),1.0-step(0.25,abs(aZoneB-target2)));
  float hit=max(h0,h1);
  float draw=smoothstep(0.0,0.2,fract(uBeat*${(0.11 + 0.02 * v).toFixed(3)}+hash11(aEdgeId+chapter))-aSegmentU*0.18);
  float breathe=0.62+0.38*sin(uBeat*${(0.35 + 0.05 * v).toFixed(3)}+hash11(aEdgeId)*6.28318);
  float foundation=0.05+hit*0.22;
  float motion=hit*(0.16+0.52*draw)*breathe;
  float accent=hit*pulseFract(fract(uBeat*0.25+hash11(aEdgeId+${id}.0)),0.04)*0.55;
  vec3 c=uColorPrimary*foundation+uColorMotion*motion+uColorAccent*accent;
  return SceneResult(c,clamp(foundation+motion+accent,0.0,1.0),1.7+hit*1.3+accent*2.0);
}`;

  if (family === 'wave') return `
SceneResult sceneEval() {
  float traverse=step(0.5,aEdgeKind);
  float arch=1.0-traverse;
  float phase=aFlat.x*6.28318*${(0.7 + 0.15 * v).toFixed(3)} + aFlat.y*6.28318*${(0.3 + 0.08 * v).toFixed(3)} - uBeat*${(0.75 + 0.11 * v).toFixed(3)};
  float w=pow(max(0.5+0.5*sin(phase+${id}.0),0.0),${(1.8 + 0.25 * v).toFixed(3)});
  float foundation=0.045+arch*0.055+traverse*0.075;
  float motion=w*(0.2+0.6*uContextDrive)*(0.55+0.45*traverse);
  float accent=pulseFract(fract(uBeat*0.25+hash11(aEdgeId)),0.03)*step(0.95,hash11(aEdgeId+${id}.0));
  vec3 c=uColorPrimary*foundation+uColorMotion*motion+uColorAccent*accent;
  return SceneResult(c,clamp(foundation+motion+accent,0.0,1.0),1.65+motion*3.2);
}`;

  if (family === 'mirror') return `
SceneResult sceneEval() {
  float mx=abs(aFlat.x*2.0-1.0);
  float y=abs(aFlat.y-0.5)*2.0;
  float pulse=0.5+0.5*sin(mx*6.28318*${(1.0 + 0.18 * v).toFixed(3)}+y*3.14159*${(0.7 + 0.1 * v).toFixed(3)}-uBeat*${(0.55 + 0.08 * v).toFixed(3)});
  float structure=pow(max(pulse,0.0),${(2.2 + 0.2 * v).toFixed(3)});
  float pair=1.0-step(${(0.19 + 0.02 * v).toFixed(3)},abs(fract(mx*4.0+uBeat*0.05)-0.5));
  float foundation=0.07+pair*0.14;
  float motion=structure*0.62;
  float accent=pulseFract(fract(uBeat*0.125),0.03)*step(0.82,mx)*0.6;
  vec3 c=uColorPrimary*foundation+uColorMotion*motion+uColorAccent*accent;
  return SceneResult(c,clamp(foundation+motion+accent,0.0,1.0),1.75+motion*2.8);
}`;

  if (family === 'relay') return `
SceneResult sceneEval() {
  float chapter=floor(uBeat/4.0);
  float z0=mod(floor(hash11(chapter+uSeed*0.1+${id}.0)*32.0),32.0);
  float z1=mod(z0+${7 + v * 3}.0,32.0);
  float h0=max(1.0-step(0.25,abs(aZoneA-z0)),1.0-step(0.25,abs(aZoneB-z0)));
  float h1=max(1.0-step(0.25,abs(aZoneA-z1)),1.0-step(0.25,abs(aZoneB-z1)));
  float p=fract(uBeat*${(0.09 + 0.02 * v).toFixed(3)});
  float hand=mix(h0,h1,smoothstep(0.15,0.85,p));
  float path=exp(-pow(aFlat.x-p,2.0)*${35 + 6 * v}.0)*(0.35+0.65*(1.0-step(0.5,aEdgeKind)));
  float foundation=0.04+h0*(1.0-p)*0.24+h1*p*0.24;
  float motion=hand*0.38+path*0.55;
  float accent=h1*pulseFract(fract(p),0.035)*0.75;
  vec3 c=uColorPrimary*foundation+uColorMotion*motion+uColorAccent*accent;
  return SceneResult(c,clamp(foundation+motion+accent,0.0,1.0),1.7+motion*3.0);
}`;

  if (family === 'shadow') return `
SceneResult sceneEval() {
  float group=mod(floor(max(aArchId,aFlat.x*8.0))+floor(uBeat/${2 + (v % 3)}.0),2.0);
  float gate=mix(0.14,1.0,group);
  float sweep=0.5+0.5*sin(aFlat.x*6.28318*${(0.6 + 0.1 * v).toFixed(3)}-uBeat*${(0.45 + 0.08 * v).toFixed(3)}+aFlat.y*3.14159);
  float foundation=0.035+gate*0.16;
  float motion=pow(max(sweep,0.0),2.4)*gate*0.5;
  float accent=pulseFract(fract(uBeat*0.25+hash11(aEdgeId+${id}.0)),0.025)*step(0.94,hash11(aEdgeId));
  vec3 c=uColorPrimary*foundation+uColorMotion*motion+uColorAccent*accent;
  return SceneResult(c,clamp(foundation+motion+accent,0.0,1.0),1.6+motion*2.7);
}`;

  if (family === 'pixels') return `
SceneResult sceneEval() {
  float seed=hash11(aEdgeId*7.13+uSeed*0.17+${id}.0);
  float active=step(${(0.82 - 0.02 * v).toFixed(3)},seed);
  float dir=step(0.5,hash11(aEdgeId+${id * 2}.0))*2.0-1.0;
  float head=fract(uBeat*${(0.08 + 0.025 * v).toFixed(3)}*dir+seed+${phase});
  float d=abs(aSegmentU-head); d=min(d,1.0-d);
  float headLight=active*exp(-d*d*${220 + 35 * v}.0);
  float trail=active*exp(-d*d*${55 + 10 * v}.0)*0.28;
  float foundation=0.025+0.025*hash11(aEdgeId+3.0);
  float motion=headLight+trail;
  float accent=headLight*step(0.92,hash11(aEdgeId+floor(uBeat)+${id}.0))*0.8;
  vec3 c=uColorPrimary*foundation+uColorMotion*motion+uColorAccent*accent;
  return SceneResult(c,clamp(foundation+motion+accent,0.0,1.0),1.45+headLight*3.8);
}`;

  return `
SceneResult sceneEval() {
  float a=0.5+0.5*sin(aFlat.x*6.28318*${(0.8 + 0.1 * v).toFixed(3)}-uBeat*${(0.42 + 0.07 * v).toFixed(3)}+${id}.0);
  float b=0.5+0.5*sin(aFlat.y*6.28318*${(1.1 + 0.12 * v).toFixed(3)}+uBeat*${(0.31 + 0.05 * v).toFixed(3)});
  float inter=pow(max(a*b,0.0),${(1.6 + 0.2 * v).toFixed(3)});
  float typeMix=mix(a,b,step(0.5,aEdgeKind));
  float foundation=0.055+typeMix*0.12;
  float motion=inter*(0.28+0.55*uContextDrive);
  float accent=pulseFract(fract(uBeat*0.125+hash11(aEdgeId)),0.03)*step(0.9,inter)*0.65;
  vec3 c=uColorPrimary*foundation+uColorMotion*motion+uColorAccent*accent;
  return SceneResult(c,clamp(foundation+motion+accent,0.0,1.0),1.65+motion*3.1);
}`;
}

export const generatedScenes = [];
for (let id = 1; id <= 50; id += 1) {
  if (CUSTOM_IDS.has(id)) continue;
  const family = familyFor(id);
  generatedScenes.push({
    id,
    slug: slugify(TITLES[id]),
    title: TITLES[id],
    version: '0.1-lab',
    status: 'PROTOTYPE',
    family,
    usesAgents: false,
    shaderLabel: `${family.toUpperCase()} / V${((id - 1) % 5) + 1}`,
    logic: logicFor(id, family),
  });
}

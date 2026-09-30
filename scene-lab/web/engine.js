import { buildSemanticGraph, buildDenseSamples } from './semantic.js';
import { AgentSystem } from './agent-system.js';

const COMMON_FRAGMENT = `#version 300 es
precision highp float;
in vec3 vColor;
in float vIntensity;
out vec4 outColor;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(p, p);
  if (r2 > 1.0) discard;
  float core = smoothstep(1.0, 0.05, r2);
  float halo = smoothstep(1.0, 0.22, r2) * 0.38;
  float a = clamp((core + halo) * vIntensity, 0.0, 1.0);
  outColor = vec4(vColor * (0.74 + a * 0.7), a);
}`;

const AGENT_VERTEX = `#version 300 es
precision highp float;
in vec2 aFlat;
in vec3 aWorld;
in float aIntensity;
in float aSize;
in float aColorRole;
uniform float uViewMode;
uniform vec2 uResolution;
uniform vec3 uColorMotion;
uniform vec3 uColorAccent;
out vec3 vColor;
out float vIntensity;
vec2 projectPoint(vec2 flatPos, vec3 worldPos) {
  if (uViewMode < 0.5) {
    return vec2((flatPos.x * 2.0 - 1.0) * 0.93, (1.0 - flatPos.y * 2.0) * 0.88);
  }
  float depth = 1.0 + worldPos.z * 0.10;
  float x = (worldPos.x / depth) * 0.72;
  float y = ((worldPos.y - 1.08) / depth) * 0.80 - 0.02;
  return vec2(x, y);
}
void main() {
  vec2 clip = projectPoint(aFlat, aWorld);
  gl_Position = vec4(clip, 0.0, 1.0);
  gl_PointSize = max(1.0, aSize * (uViewMode < 0.5 ? 1.0 : 0.92));
  vColor = aColorRole > 1.5 ? uColorAccent : uColorMotion;
  vIntensity = aIntensity;
}`;

function sceneVertexSource(sceneLogic) {
  return `#version 300 es
precision highp float;
in vec2 aFlat;
in vec3 aWorld;
in float aArchId;
in float aTraverseId;
in float aEdgeKind;
in float aBandId;
in float aZoneA;
in float aZoneB;
in float aSegmentU;
in float aEdgeId;
in float aBayId;
in float aRegionId;
uniform float uTime;
uniform float uBeat;
uniform float uBeatPhase;
uniform float uBpm;
uniform float uSeed;
uniform float uContextDrive;
uniform float uViewMode;
uniform vec2 uResolution;
uniform vec3 uColorPrimary;
uniform vec3 uColorMotion;
uniform vec3 uColorAccent;
out vec3 vColor;
out float vIntensity;
struct SceneResult { vec3 color; float intensity; float size; };
float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}
float pulseFract(float phase, float width) {
  float d = min(phase, 1.0 - phase);
  return 1.0 - smoothstep(width * 0.25, width, d);
}
vec2 projectPoint(vec2 flatPos, vec3 worldPos) {
  if (uViewMode < 0.5) {
    return vec2((flatPos.x * 2.0 - 1.0) * 0.93, (1.0 - flatPos.y * 2.0) * 0.88);
  }
  float depth = 1.0 + worldPos.z * 0.10;
  float x = (worldPos.x / depth) * 0.72;
  float y = ((worldPos.y - 1.08) / depth) * 0.80 - 0.02;
  return vec2(x, y);
}
${sceneLogic}
void main() {
  SceneResult result = sceneEval();
  vec2 clip = projectPoint(aFlat, aWorld);
  gl_Position = vec4(clip, 0.0, 1.0);
  gl_PointSize = max(1.0, result.size * (uViewMode < 0.5 ? 1.0 : 0.90));
  vColor = result.color;
  vIntensity = result.intensity;
}`;
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log || 'Shader compilation failed');
  }
  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(log || 'Program link failed');
  }
  return program;
}

function fnv1a(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const n = Number.parseInt(clean, 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
}

function mix3(a, b, t) {
  return a.map((v, i) => v + (b[i] - v) * t);
}

const PALETTE_FAMILIES = [
  { primary: '#f1f5f9', motion: '#38bdf8', accent: '#f8fafc' },
  { primary: '#f3f4f6', motion: '#a78bfa', accent: '#ffffff' },
  { primary: '#f5f5f4', motion: '#fb7185', accent: '#fff7ed' },
  { primary: '#f0fdfa', motion: '#2dd4bf', accent: '#ffffff' },
];

function paletteAt(timeSeconds, seed) {
  const span = 32;
  const p = timeSeconds / span + (Number(seed) % 17) * 0.017;
  const i0 = Math.floor(p) % PALETTE_FAMILIES.length;
  const i1 = (i0 + 1) % PALETTE_FAMILIES.length;
  const t0 = p - Math.floor(p);
  const t = t0 * t0 * (3 - 2 * t0);
  const a = PALETTE_FAMILIES[i0];
  const b = PALETTE_FAMILIES[i1];
  return {
    primary: mix3(hexToRgb(a.primary), hexToRgb(b.primary), t),
    motion: mix3(hexToRgb(a.motion), hexToRgb(b.motion), t),
    accent: mix3(hexToRgb(a.accent), hexToRgb(b.accent), t),
    family: `${i0}->${i1}`,
    morph: Number(t.toFixed(5)),
  };
}

function contextDrive(name) {
  if (name === 'calm') return 0.24;
  if (name === 'energetic') return 0.95;
  return 0.61;
}

function setVec3(gl, loc, v) {
  gl.uniform3f(loc, v[0], v[1], v[2]);
}

export class SceneEngine {
  constructor(canvas, scenes) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl2', { antialias: true, alpha: false, preserveDrawingBuffer: true });
    if (!this.gl) throw new Error('WebGL2 est requis pour Lumina Scene Lab.');

    this.scenes = scenes;
    this.graph = buildSemanticGraph();
    this.samples = buildDenseSamples(this.graph, 52);
    this.agentSystem = new AgentSystem(this.graph);
    this.programs = new Map();
    this.scene = scenes[0];
    this.seed = 1337;
    this.bpm = 120;
    this.musicContext = 'rhythmic';
    this.viewMode = 1;
    this.timeSeconds = 0;
    this.playing = true;
    this.lastNow = performance.now();
    this.lastDiagnostics = null;
    this.lastAgentDiagnostics = [];
    this.frameMs = 0;
    this.fps = 0;
    this._fpsFrames = 0;
    this._fpsStarted = performance.now();
    this._history = [];
    this._lastHistoryTime = -Infinity;

    this._initStaticBuffer();
    this._initAgentBuffer();
    this._agentProgram = createProgram(this.gl, AGENT_VERTEX, COMMON_FRAGMENT);
    this.setScene(this.scene);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
    this.gl.disable(this.gl.DEPTH_TEST);
    this.resize();
  }

  _initStaticBuffer() {
    const gl = this.gl;
    this.staticBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.staticBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.samples.data, gl.STATIC_DRAW);
  }

  _initAgentBuffer() {
    this.agentBuffer = this.gl.createBuffer();
    this.agentCapacity = 0;
  }

  _sceneProgram(scene) {
    if (this.programs.has(scene.slug)) return this.programs.get(scene.slug);
    const vertex = sceneVertexSource(scene.logic);
    const program = createProgram(this.gl, vertex, COMMON_FRAGMENT);
    const bundle = { program, vertex, signature: fnv1a(vertex + COMMON_FRAGMENT) };
    this.programs.set(scene.slug, bundle);
    return bundle;
  }

  _bindStaticAttributes(program) {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.staticBuffer);
    const stride = this.samples.stride * 4;
    const specs = [
      ['aFlat', 2, 0],
      ['aWorld', 3, 2],
      ['aArchId', 1, 5],
      ['aTraverseId', 1, 6],
      ['aEdgeKind', 1, 7],
      ['aBandId', 1, 8],
      ['aZoneA', 1, 9],
      ['aZoneB', 1, 10],
      ['aSegmentU', 1, 11],
      ['aEdgeId', 1, 12],
      ['aBayId', 1, 13],
      ['aRegionId', 1, 14],
    ];
    for (const [name, size, offset] of specs) {
      const loc = gl.getAttribLocation(program, name);
      if (loc < 0) continue;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset * 4);
    }
  }

  _setCommonUniforms(program, palette) {
    const gl = this.gl;
    const beat = this.timeSeconds * this.bpm / 60;
    const uniforms = {
      uTime: this.timeSeconds,
      uBeat: beat,
      uBeatPhase: beat - Math.floor(beat),
      uBpm: this.bpm,
      uSeed: Number(this.seed),
      uContextDrive: contextDrive(this.musicContext),
      uViewMode: this.viewMode,
    };
    for (const [name, value] of Object.entries(uniforms)) {
      const loc = gl.getUniformLocation(program, name);
      if (loc) gl.uniform1f(loc, value);
    }
    const resLoc = gl.getUniformLocation(program, 'uResolution');
    if (resLoc) gl.uniform2f(resLoc, this.canvas.width, this.canvas.height);
    const p0 = gl.getUniformLocation(program, 'uColorPrimary');
    const p1 = gl.getUniformLocation(program, 'uColorMotion');
    const p2 = gl.getUniformLocation(program, 'uColorAccent');
    if (p0) setVec3(gl, p0, palette.primary);
    if (p1) setVec3(gl, p1, palette.motion);
    if (p2) setVec3(gl, p2, palette.accent);
  }

  _renderAgents(palette) {
    if (!this.scene.usesAgents) {
      this.lastAgentDiagnostics = [];
      return;
    }
    const gl = this.gl;
    const sample = this.agentSystem.sample(this.timeSeconds, contextDrive(this.musicContext));
    this.lastAgentDiagnostics = sample.diagnostics;
    const stride = 9;
    const data = new Float32Array(sample.points.length * stride);
    let k = 0;
    for (const p of sample.points) {
      data[k++] = p.flat[0];
      data[k++] = p.flat[1];
      data[k++] = p.world[0];
      data[k++] = p.world[1];
      data[k++] = p.world[2];
      data[k++] = p.intensity;
      data[k++] = p.size;
      data[k++] = p.colorRole;
      data[k++] = p.agentId;
    }

    gl.useProgram(this._agentProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.agentBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    const byteStride = stride * 4;
    const specs = [
      ['aFlat', 2, 0], ['aWorld', 3, 2], ['aIntensity', 1, 5], ['aSize', 1, 6], ['aColorRole', 1, 7],
    ];
    for (const [name, size, offset] of specs) {
      const loc = gl.getAttribLocation(this._agentProgram, name);
      if (loc < 0) continue;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, byteStride, offset * 4);
    }
    const viewLoc = gl.getUniformLocation(this._agentProgram, 'uViewMode');
    const resLoc = gl.getUniformLocation(this._agentProgram, 'uResolution');
    const mLoc = gl.getUniformLocation(this._agentProgram, 'uColorMotion');
    const aLoc = gl.getUniformLocation(this._agentProgram, 'uColorAccent');
    if (viewLoc) gl.uniform1f(viewLoc, this.viewMode);
    if (resLoc) gl.uniform2f(resLoc, this.canvas.width, this.canvas.height);
    if (mLoc) setVec3(gl, mLoc, palette.motion);
    if (aLoc) setVec3(gl, aLoc, palette.accent);
    gl.drawArrays(gl.POINTS, 0, sample.points.length);
  }

  setScene(scene) {
    this.scene = scene;
    this._sceneProgram(scene);
    this.agentSystem.reset(this.seed);
  }

  setSeed(seed) {
    this.seed = Number(seed) || 1;
    this.agentSystem.reset(this.seed);
  }

  setBpm(bpm) {
    this.bpm = Math.max(1, Number(bpm) || 120);
  }

  setMusicContext(context) {
    this.musicContext = context;
  }

  setViewMode(mode) {
    this.viewMode = Number(mode) ? 1 : 0;
  }

  seek(seconds) {
    this.timeSeconds = Math.max(0, Number(seconds) || 0);
    this.lastNow = performance.now();
    this._history = [];
    this._lastHistoryTime = -Infinity;
  }

  play() {
    if (this.playing) return;
    this.playing = true;
    this.lastNow = performance.now();
  }

  pause() {
    if (!this.playing) return;
    this.playing = false;
  }

  toggle() {
    if (this.playing) this.pause(); else this.play();
    return this.playing;
  }

  resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.floor(this.canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.gl.viewport(0, 0, w, h);
  }

  _sampleHistory() {
    if (this.timeSeconds - this._lastHistoryTime < 0.25) return;
    this._lastHistoryTime = this.timeSeconds;
    const diag = this.diagnostics(false);
    this._history.push(diag);
    const minTime = this.timeSeconds - 8.0;
    while (this._history.length && this._history[0].time_seconds < minTime) this._history.shift();
  }

  render(now = performance.now()) {
    const start = performance.now();
    if (this.playing) {
      const dt = Math.min(0.1, Math.max(0, (now - this.lastNow) / 1000));
      this.timeSeconds += dt;
    }
    this.lastNow = now;
    this.resize();

    const gl = this.gl;
    gl.clearColor(0.006, 0.008, 0.012, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const bundle = this._sceneProgram(this.scene);
    const palette = paletteAt(this.timeSeconds, this.seed);
    gl.useProgram(bundle.program);
    this._bindStaticAttributes(bundle.program);
    this._setCommonUniforms(bundle.program, palette);
    gl.drawArrays(gl.POINTS, 0, this.samples.count);
    this._renderAgents(palette);

    this.frameMs = performance.now() - start;
    this._fpsFrames += 1;
    if (now - this._fpsStarted >= 500) {
      this.fps = this._fpsFrames * 1000 / (now - this._fpsStarted);
      this._fpsFrames = 0;
      this._fpsStarted = now;
    }
    this._sampleHistory();
    this.lastDiagnostics = this.diagnostics(false);
    return this.lastDiagnostics;
  }

  diagnostics(includeAgents = true) {
    const beat = this.timeSeconds * this.bpm / 60;
    const bundle = this._sceneProgram(this.scene);
    const palette = paletteAt(this.timeSeconds, this.seed);
    return {
      scene_id: this.scene.id,
      scene_slug: this.scene.slug,
      scene_title: this.scene.title,
      scene_version: this.scene.version,
      shader_label: this.scene.shaderLabel,
      shader_signature: bundle.signature,
      seed: Number(this.seed),
      bpm: Number(this.bpm),
      music_context: this.musicContext,
      context_drive: contextDrive(this.musicContext),
      time_seconds: Number(this.timeSeconds.toFixed(6)),
      beat: Number(beat.toFixed(6)),
      beat_index: Math.floor(beat),
      beat_phase: Number((beat - Math.floor(beat)).toFixed(6)),
      bar_index: Math.floor(beat / 4),
      phrase_16beat_index: Math.floor(beat / 16),
      view_mode: this.viewMode === 0 ? 'semantic_flat' : 'tunnel_perspective',
      playing: this.playing,
      fps: Number(this.fps.toFixed(2)),
      frame_ms: Number(this.frameMs.toFixed(3)),
      palette,
      graph: {
        nodes: this.graph.nodes.length,
        edges: this.graph.edges.length,
        dense_samples: this.samples.count,
      },
      agents: includeAgents ? this.lastAgentDiagnostics : undefined,
    };
  }

  snapshot() {
    return {
      ...this.diagnostics(true),
      history_window_seconds: 8,
      state_history: this._history.map((x) => ({ ...x, agents: undefined })),
      reproducibility: {
        rule: 'scene_version + shader_signature + seed + bpm + music_context + time_seconds',
        deterministic: true,
      },
    };
  }
}

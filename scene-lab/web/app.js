import { SceneEngine } from './engine.js';
import { scenes } from './scenes/index.js';

const $ = (id) => document.getElementById(id);
const canvas = $('sceneCanvas');
const sceneSelect = $('sceneSelect');
const playPause = $('playPause');
const restart = $('restart');
const timeline = $('timeline');
const bpmInput = $('bpmInput');
const seedInput = $('seedInput');
const musicContext = $('musicContext');
const viewMode = $('viewMode');
const timeReadout = $('timeReadout');
const beatReadout = $('beatReadout');
const fpsReadout = $('fpsReadout');
const sceneMeta = $('sceneMeta');
const shaderChip = $('shaderChip');
const statusChip = $('statusChip');
const snapshotChip = $('snapshotChip');
const referenceType = $('referenceType');
const commentInput = $('commentInput');
const saveFeedback = $('saveFeedback');
const saveStatus = $('saveStatus');
const snapshotPreview = $('snapshotPreview');
const micButton = $('micButton');
const micStatus = $('micStatus');
const fatalError = $('fatalError');

let engine;
let pauseState = null;
let recentFrames = [];
let lastThumbAt = -Infinity;
let recognition = null;
let micRecording = false;
let micBaseText = '';

function isTypingTarget(target) {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable;
}

function compactSnapshot(snapshot) {
  return JSON.stringify({
    scene: snapshot.scene_slug,
    version: snapshot.scene_version,
    shader: snapshot.shader_signature,
    seed: snapshot.seed,
    bpm: snapshot.bpm,
    context: snapshot.music_context,
    time_s: snapshot.time_seconds,
    beat: snapshot.beat,
    beat_phase: snapshot.beat_phase,
    view: snapshot.view_mode,
    agents: snapshot.agents?.length ?? 0,
    history_samples: snapshot.state_history?.length ?? 0,
  }, null, 2);
}

function capturePng() {
  try {
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

function captureThumb(diag) {
  const width = 480;
  const ratio = canvas.height / Math.max(1, canvas.width);
  const height = Math.max(1, Math.round(width * ratio));
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const ctx = off.getContext('2d');
  ctx.drawImage(canvas, 0, 0, width, height);
  return {
    time_seconds: diag.time_seconds,
    beat: diag.beat,
    image: off.toDataURL('image/jpeg', 0.72),
  };
}

function updateRecentFrames(diag) {
  if (!engine.playing) return;
  if (diag.time_seconds - lastThumbAt < 1.0) return;
  lastThumbAt = diag.time_seconds;
  recentFrames.push(captureThumb(diag));
  const minTime = diag.time_seconds - 8.0;
  recentFrames = recentFrames.filter((frame) => frame.time_seconds >= minTime).slice(-10);
}

function capturePauseState() {
  const snapshot = engine.snapshot();
  pauseState = {
    snapshot,
    pauseImage: capturePng(),
    contextFrames: recentFrames.map((x) => ({ ...x })),
  };
  snapshotChip.classList.remove('hidden');
  snapshotChip.textContent = `snapshot @ ${snapshot.time_seconds.toFixed(3)}s`;
  snapshotPreview.textContent = compactSnapshot(snapshot);
}

function clearPauseState() {
  pauseState = null;
  snapshotChip.classList.add('hidden');
  snapshotPreview.textContent = 'LIVE — sera capturé au moment de l’envoi';
}

function syncPlayUi() {
  if (engine.playing) {
    playPause.textContent = 'Pause';
    statusChip.textContent = 'LIVE';
    statusChip.classList.add('live');
    statusChip.classList.remove('paused');
  } else {
    playPause.textContent = 'Play';
    statusChip.textContent = 'PAUSE';
    statusChip.classList.add('paused');
    statusChip.classList.remove('live');
  }
}

function pauseExact() {
  if (!engine.playing) return;
  engine.render(performance.now());
  engine.pause();
  capturePauseState();
  syncPlayUi();
}

function resume() {
  if (engine.playing) return;
  engine.play();
  clearPauseState();
  syncPlayUi();
}

function togglePlay() {
  if (engine.playing) pauseExact(); else resume();
}

function setScene(scene) {
  engine.setScene(scene);
  clearPauseState();
  recentFrames = [];
  lastThumbAt = -Infinity;
  shaderChip.textContent = scene.shaderLabel;
  sceneMeta.textContent = `${scene.title} · v${scene.version} · ID ${scene.id}`;
}

function initSceneSelect() {
  for (const scene of scenes) {
    const option = document.createElement('option');
    option.value = scene.slug;
    option.textContent = `${scene.id}. ${scene.title}`;
    sceneSelect.appendChild(option);
  }
  sceneSelect.addEventListener('change', () => {
    const scene = scenes.find((x) => x.slug === sceneSelect.value) || scenes[0];
    setScene(scene);
  });
}

function bindControls() {
  playPause.addEventListener('click', togglePlay);
  restart.addEventListener('click', () => {
    engine.seek(0);
    recentFrames = [];
    lastThumbAt = -Infinity;
    if (!engine.playing) {
      engine.render(performance.now());
      capturePauseState();
    }
  });

  timeline.addEventListener('input', () => {
    engine.seek(Number(timeline.value));
    recentFrames = [];
    lastThumbAt = -Infinity;
    if (!engine.playing) {
      engine.render(performance.now());
      capturePauseState();
    }
  });

  bpmInput.addEventListener('change', () => {
    engine.setBpm(bpmInput.value);
    if (!engine.playing) { engine.render(performance.now()); capturePauseState(); }
  });

  seedInput.addEventListener('change', () => {
    engine.setSeed(seedInput.value);
    recentFrames = [];
    if (!engine.playing) { engine.render(performance.now()); capturePauseState(); }
  });

  musicContext.addEventListener('change', () => {
    engine.setMusicContext(musicContext.value);
    if (!engine.playing) { engine.render(performance.now()); capturePauseState(); }
  });

  viewMode.addEventListener('change', () => {
    engine.setViewMode(viewMode.value);
    if (!engine.playing) { engine.render(performance.now()); capturePauseState(); }
  });

  window.addEventListener('keydown', (event) => {
    if (isTypingTarget(event.target)) return;
    if (event.code === 'Space') {
      event.preventDefault();
      togglePlay();
    } else if (event.key.toLowerCase() === 'r') {
      engine.seek(0);
      recentFrames = [];
      lastThumbAt = -Infinity;
      if (!engine.playing) { engine.render(performance.now()); capturePauseState(); }
    } else if (event.key === 'ArrowLeft') {
      engine.seek(Math.max(0, engine.timeSeconds - 0.25));
      if (!engine.playing) { engine.render(performance.now()); capturePauseState(); }
    } else if (event.key === 'ArrowRight') {
      engine.seek(engine.timeSeconds + 0.25);
      if (!engine.playing) { engine.render(performance.now()); capturePauseState(); }
    }
  });
}

async function postFeedback() {
  const comment = commentInput.value.trim();
  if (!comment) {
    saveStatus.textContent = 'Écris ou dicte un commentaire.';
    return;
  }

  saveFeedback.disabled = true;
  saveStatus.textContent = 'Enregistrement…';

  let packet;
  if (pauseState) {
    packet = pauseState;
  } else {
    engine.render(performance.now());
    packet = {
      snapshot: engine.snapshot(),
      pauseImage: capturePng(),
      contextFrames: recentFrames.map((x) => ({ ...x })),
    };
  }

  const feedbackId = crypto.randomUUID();
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feedback_id: feedbackId,
        reference_type: referenceType.value,
        comment,
        snapshot: packet.snapshot,
        pause_image: packet.pauseImage,
        context_frames: packet.contextFrames,
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.detail || 'Erreur serveur');
    saveStatus.textContent = `Sauvé: ${result.event_path}`;
    commentInput.value = '';
  } catch (error) {
    saveStatus.textContent = `Erreur: ${error.message}`;
  } finally {
    saveFeedback.disabled = false;
  }
}

function initMicrophone() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    micButton.disabled = true;
    micStatus.textContent = 'Indisponible dans ce navigateur — ignoré.';
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'fr-FR';
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    micRecording = true;
    micButton.textContent = 'Stop micro';
    micStatus.textContent = 'Écoute FR… (expérimental)';
    micBaseText = commentInput.value.trim();
  };

  recognition.onresult = (event) => {
    let finalText = '';
    let interimText = '';
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const text = event.results[i][0]?.transcript || '';
      if (event.results[i].isFinal) finalText += `${text} `;
      else interimText += text;
    }
    if (finalText.trim()) {
      micBaseText = [micBaseText, finalText.trim()].filter(Boolean).join(' ');
    }
    commentInput.value = [micBaseText, interimText.trim()].filter(Boolean).join(' ');
  };

  recognition.onerror = (event) => {
    micStatus.textContent = `Micro: ${event.error}. Tu peux l’ignorer et taper.`;
  };

  recognition.onend = () => {
    micRecording = false;
    micButton.textContent = 'Micro FR';
    if (!micStatus.textContent.startsWith('Micro:')) {
      micStatus.textContent = 'Prêt — français fr-FR, expérimental.';
    }
  };

  micButton.disabled = false;
  micStatus.textContent = 'Prêt — français fr-FR, expérimental.';
  micButton.addEventListener('click', () => {
    if (micRecording) recognition.stop();
    else recognition.start();
  });
}

function animationLoop(now) {
  try {
    const diag = engine.render(now);
    timeReadout.textContent = `${diag.time_seconds.toFixed(3)} s`;
    beatReadout.textContent = diag.beat.toFixed(3);
    fpsReadout.textContent = diag.fps.toFixed(1);
    if (!timeline.matches(':active')) timeline.value = String(Math.min(120, diag.time_seconds));
    updateRecentFrames(diag);
    requestAnimationFrame(animationLoop);
  } catch (error) {
    fatalError.textContent = `Erreur Scene Lab:\n${error.stack || error.message}`;
    fatalError.classList.remove('hidden');
  }
}

async function start() {
  try {
    engine = new SceneEngine(canvas, scenes);
    initSceneSelect();
    setScene(scenes[0]);
    bindControls();
    initMicrophone();
    saveFeedback.addEventListener('click', postFeedback);
    syncPlayUi();
    requestAnimationFrame(animationLoop);
  } catch (error) {
    fatalError.textContent = `Impossible de démarrer Scene Lab:\n${error.stack || error.message}`;
    fatalError.classList.remove('hidden');
  }
}

start();

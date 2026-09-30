export const RATING_AXES = [
  ['architecture_readability', 'Architecture', 'Est-ce que le tunnel et ses volumes restent lisibles ?'],
  ['physical_pixel_fidelity', 'Fidélité pixels', 'Densité, espacement et implantation crédibles par rapport au physique.'],
  ['light_shadow_balance', 'Lumière / ombre', 'Respiration, contraste et absence de noir accidentel.'],
  ['movement_quality', 'Qualité du mouvement', 'Le mouvement est-il beau, lisible et intentionnel ?'],
  ['movement_continuity', 'Continuité', 'Pas de jitter, saut, inversion ou cassure involontaire.'],
  ['internal_evolution', 'Évolution interne', 'La scène évolue-t-elle réellement dans le temps ?'],
  ['spatial_use', 'Usage de l’espace', 'Profondeur, plafond, côtés, zones et traverses sont-ils exploités ?'],
  ['symmetry_quality', 'Symétrie', 'Quand elle est active, est-elle stricte et complète ?'],
  ['asymmetry_quality', 'Asymétrie', 'Quand elle est active, paraît-elle volontaire et structurée ?'],
  ['pixel_liveliness', 'Vie des pixels', 'Autonomie, variété de vitesses, tailles, phases et trajets.'],
  ['music_sync', 'Relation musique', 'La musique organise-t-elle la chorégraphie sans pompage global ?'],
  ['color_palette', 'Couleur', 'Palette cohérente, lisible et non décorative.'],
  ['originality', 'Originalité', 'La grammaire a-t-elle une identité propre ?'],
  ['repetition_control', 'Répétition', 'La scène évite-t-elle de refaire trop vite la même chose ?'],
  ['transition_quality', 'Transition', 'Entrée, sortie et handoff sont-ils propres et motivés spatialement ?'],
  ['performance', 'Performance', 'Fluidité, stabilité et coût apparent du rendu.'],
];

export function initRatingMatrix(container) {
  container.innerHTML = '';
  const head = document.createElement('div');
  head.className = 'rating-head';
  head.innerHTML = '<span>Aspect</span><span>N/A</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>';
  container.appendChild(head);

  for (const [key, label, help] of RATING_AXES) {
    const row = document.createElement('div');
    row.className = 'rating-row';
    row.dataset.ratingKey = key;
    const title = document.createElement('div');
    title.className = 'rating-title';
    title.innerHTML = `<strong>${label}</strong><span>${help}</span>`;
    row.appendChild(title);

    for (const value of ['na', '1', '2', '3', '4', '5']) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'rating-cell';
      button.dataset.value = value;
      button.textContent = value === 'na' ? '—' : value;
      button.title = value === '1' ? '1 — très mauvais' : value === '3' ? '3 — moyen' : value === '5' ? '5 — excellent' : value === 'na' ? 'Non applicable' : value;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        for (const other of row.querySelectorAll('.rating-cell')) {
          other.classList.remove('selected');
          other.setAttribute('aria-pressed', 'false');
        }
        button.classList.add('selected');
        button.setAttribute('aria-pressed', 'true');
      });
      row.appendChild(button);
    }
    container.appendChild(row);
  }
}

export function collectRatings(container) {
  const ratings = {};
  for (const row of container.querySelectorAll('.rating-row')) {
    const selected = row.querySelector('.rating-cell.selected');
    if (!selected) continue;
    ratings[row.dataset.ratingKey] = selected.dataset.value === 'na' ? null : Number(selected.dataset.value);
  }
  return ratings;
}

export function clearRatings(container) {
  for (const button of container.querySelectorAll('.rating-cell.selected')) {
    button.classList.remove('selected');
    button.setAttribute('aria-pressed', 'false');
  }
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function initLocalMicrophone({ button, status, textarea }) {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    button.disabled = true;
    status.textContent = 'Micro non disponible dans ce navigateur.';
    return;
  }

  let recorder = null;
  let stream = null;
  let chunks = [];
  let stopping = false;
  let autoStop = null;

  const stop = () => {
    if (!recorder || recorder.state === 'inactive' || stopping) return;
    stopping = true;
    recorder.stop();
  };

  button.disabled = false;
  button.textContent = 'Dicter en français';
  status.textContent = 'Local Faster-Whisper — le premier lancement peut télécharger le modèle.';

  button.addEventListener('click', async () => {
    if (recorder && recorder.state === 'recording') {
      stop();
      return;
    }

    try {
      status.textContent = 'Autorisation micro…';
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferred = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];
      const mimeType = preferred.find((x) => MediaRecorder.isTypeSupported(x)) || '';
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunks = [];
      stopping = false;

      recorder.ondataavailable = (event) => {
        if (event.data?.size) chunks.push(event.data);
      };

      recorder.onerror = (event) => {
        status.textContent = `Erreur micro : ${event.error?.message || 'enregistrement impossible'}`;
      };

      recorder.onstop = async () => {
        clearTimeout(autoStop);
        button.disabled = true;
        button.textContent = 'Transcription…';
        status.textContent = 'Transcription locale en français…';
        for (const track of stream?.getTracks?.() || []) track.stop();

        try {
          const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
          if (blob.size < 1000) throw new Error('Enregistrement trop court');
          const audioData = await blobToDataUrl(blob);
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio_data: audioData, language: 'fr' }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.detail || 'Transcription impossible');
          const text = (result.text || '').trim();
          if (!text) throw new Error('Aucun texte reconnu');
          textarea.value = [textarea.value.trim(), text].filter(Boolean).join(' ');
          textarea.focus();
          status.textContent = `Transcrit localement avec ${result.model}.`;
        } catch (error) {
          status.textContent = `Micro : ${error.message}`;
        } finally {
          recorder = null;
          stream = null;
          chunks = [];
          stopping = false;
          button.disabled = false;
          button.textContent = 'Dicter en français';
        }
      };

      recorder.start(250);
      button.textContent = 'Stop + transcrire';
      status.textContent = 'Écoute… clique Stop quand ton commentaire est fini.';
      autoStop = setTimeout(stop, 60000);
    } catch (error) {
      for (const track of stream?.getTracks?.() || []) track.stop();
      recorder = null;
      stream = null;
      status.textContent = `Micro : ${error.message}`;
    }
  });
}

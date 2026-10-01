import math
import numpy as np

ROOT = '/project1/Renders/Saison3/base2/new1'

BAND_EDGES = np.asarray([
    35.0,
    70.0,
    140.0,
    280.0,
    560.0,
    1120.0,
    2240.0,
    4480.0,
    8960.0,
    16000.0,
], dtype=np.float64)

S = {
    'init': False,
    'spec_len': 0,
    'freqs': None,
    'band_masks': None,
    'prev_spec': None,
    'band_fast': np.zeros(9, dtype=np.float64),
    'band_slow': np.zeros(9, dtype=np.float64),
    'band_dev': np.ones(9, dtype=np.float64) * 0.01,
    'level_fast': 0.0,
    'level_slow': 0.0,
    'prev_centroid': 0.5,
    'prev_level': 0.0,
    'kick_env': 0.0,
    'snare_env': 0.0,
    'hat_env': 0.0,
    'onset_env': 0.0,
    'micro_env': 0.0,
    'last_kick': -999.0,
    'last_snare': -999.0,
    'last_hat': -999.0,
    'last_onset': -999.0,
    'last_micro': -999.0,
    'onset_times': [],
    'bpm_candidates': [],
    'bpm': 120.0,
    'bpm_conf': 0.0,
    'beat_anchor': None,
    'last_beat_index': -1,
    'last_bar_index': -1,
    'macro_index': -1,
    'macro_family': 0,
    'motif': 0,
    'symmetry': 1,
    'pattern_seed': 0.137,
    'density': 0.62,
    'motion': 0.72,
    'interaction': 0.035,
    'particle_count': 14.0,
    'growth': 0.76,
    'ambient': 0.10,
    'zones': np.ones(8, dtype=np.float64) * 0.08,
}


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ema(prev, value, dt, tau):
    tau = max(float(tau), 1e-6)
    a = 1.0 - math.exp(-max(float(dt), 1e-6) / tau)
    return prev + (value - prev) * a


def ema_vec(prev, value, dt, tau):
    tau = max(float(tau), 1e-6)
    a = 1.0 - math.exp(-max(float(dt), 1e-6) / tau)
    return prev + (value - prev) * a


def hash01(x):
    return (math.sin(x * 12.9898 + 78.233) * 43758.5453123) % 1.0


def pv(comp, name, default):
    p = getattr(comp.par, name, None)
    if p is None:
        return default
    try:
        return p.eval()
    except:
        return default


def pi(comp, name, default):
    try:
        return int(round(float(pv(comp, name, default))))
    except:
        return int(default)


def ensure_spectrum_layout(spec_len):
    if spec_len <= 0:
        return
    if S['spec_len'] == spec_len and S['band_masks'] is not None:
        return

    step = max(1, int(spec_len / 512))
    freqs_full = np.linspace(35.0, 16000.0, spec_len, dtype=np.float64)
    freqs = freqs_full[::step]
    masks = []
    for i in range(len(BAND_EDGES) - 1):
        lo = BAND_EDGES[i]
        hi = BAND_EDGES[i + 1]
        if i == len(BAND_EDGES) - 2:
            mask = (freqs >= lo) & (freqs <= hi)
        else:
            mask = (freqs >= lo) & (freqs < hi)
        masks.append(mask)

    S['spec_len'] = spec_len
    S['spec_step'] = step
    S['freqs'] = freqs
    S['band_masks'] = masks
    S['prev_spec'] = None
    S['band_fast'][:] = 0.0
    S['band_slow'][:] = 0.0
    S['band_dev'][:] = 0.01


def analyze_spectrum(spectrum_op, dt):
    bands = np.zeros(9, dtype=np.float64)
    novelty = np.zeros(9, dtype=np.float64)
    flux = 0.0
    centroid = 0.5
    spread = 0.25
    entropy = 0.5
    crest = 1.0
    rolloff = 0.7

    try:
        arr = spectrum_op.numpyArray()
        raw = np.asarray(arr[0], dtype=np.float64)
        raw = np.maximum(raw, 0.0)
        ensure_spectrum_layout(len(raw))
        step = S.get('spec_step', 1)
        small = raw[::step]
        comp = np.log1p(small * 140.0)

        for i, mask in enumerate(S['band_masks']):
            if np.any(mask):
                values = comp[mask]
                bands[i] = float(np.mean(values) * 0.72 + np.max(values) * 0.28)

        if not S['init'] or np.max(S['band_slow']) <= 1e-9:
            S['band_fast'] = bands.copy()
            S['band_slow'] = bands.copy()
            S['band_dev'][:] = np.maximum(bands * 0.15, 0.006)
        else:
            S['band_fast'] = ema_vec(S['band_fast'], bands, dt, 0.035)
            S['band_slow'] = ema_vec(S['band_slow'], bands, dt, 0.48)
            excursion = np.abs(S['band_fast'] - S['band_slow'])
            S['band_dev'] = ema_vec(S['band_dev'], excursion, dt, 1.8)

        positive = np.maximum(S['band_fast'] - S['band_slow'], 0.0)
        novelty = positive / (S['band_dev'] * 2.35 + 0.004)
        novelty = np.tanh(novelty * 0.78)

        prev = S['prev_spec']
        if prev is not None and len(prev) == len(comp):
            pos = np.maximum(comp - prev, 0.0)
            flux = float(np.mean(pos) / (np.mean(comp) + 1e-6))
            flux = clamp(math.tanh(flux * 2.4))
        S['prev_spec'] = comp.copy()

        total = float(np.sum(comp)) + 1e-12
        pos01 = (S['freqs'] - 35.0) / (16000.0 - 35.0)
        pos01 = np.clip(pos01, 0.0, 1.0)
        centroid = float(np.sum(pos01 * comp) / total)
        spread = float(math.sqrt(max(np.sum(((pos01 - centroid) ** 2) * comp) / total, 0.0)))
        prob = comp / total
        entropy = float(-np.sum(prob * np.log(prob + 1e-12)) / max(math.log(len(prob)), 1e-6))
        entropy = clamp(entropy)
        crest = float(np.max(comp) / (np.mean(comp) + 1e-6))
        crest = clamp((crest - 1.0) / 7.0)
        cumulative = np.cumsum(comp)
        target = total * 0.85
        idx = int(np.searchsorted(cumulative, target))
        idx = max(0, min(len(pos01) - 1, idx))
        rolloff = float(pos01[idx])
    except:
        pass

    return bands, novelty, flux, centroid, spread, entropy, crest, rolloff


def choose_macro(macro_index, centroid, entropy, flux, crest, allow_symmetry):
    sequence = (0, 1, 2, 3, 1, 2)
    family = sequence[macro_index % len(sequence)]

    if family == 0:
        symmetry = 1 if allow_symmetry else 0
        if entropy > 0.72:
            motif = 2
        elif centroid < 0.42:
            motif = 1
        else:
            motif = 0
    elif family == 1:
        symmetry = 0
        motif = 3
    elif family == 2:
        symmetry = 0
        motif = 4 if (flux + crest) > 0.45 else 0
    else:
        symmetry = 1 if allow_symmetry else 0
        motif = 5

    return family, motif, symmetry


def onSetupParameters(scriptOp):
    return


def onPulse(par):
    return


def onGetCookLevel(scriptOp):
    return CookLevel.ALWAYS


def onCook(scriptOp):
    life = op(ROOT + '/PIXEL_LIFE')
    feat = op(ROOT + '/audio_features')
    spectrum_op = op(ROOT + '/audio_pixel_spectrum')
    if life is None or feat is None or spectrum_op is None:
        return

    try:
        t = float(absTime.seconds)
        dt = float(absTime.stepSeconds)
    except:
        t = 0.0
        dt = 1.0 / 60.0
    if dt <= 0.0 or dt > 0.2:
        dt = 1.0 / 60.0

    react = clamp(float(pv(life, 'V8react', 0.92)))
    pmin = max(1, min(32, pi(life, 'V8pmin', 10)))
    pmax = max(pmin, min(32, pi(life, 'V8pmax', 24)))
    motion_ctl = clamp(float(pv(life, 'V8motion', 0.84)))
    interaction_ctl = clamp(float(pv(life, 'V8interaction', 0.03)))
    geometry_ctl = clamp(float(pv(life, 'V8geometry', 0.84)))
    complexity_ctl = clamp(float(pv(life, 'V8complexity', 0.82)))
    macro_bars = max(4, min(24, pi(life, 'V8evolution', 8)))
    contrast_ctl = clamp(float(pv(life, 'V8contrast', 0.28)))
    ceiling_ctl = clamp(float(pv(life, 'V8ceiling', 0.94)))
    allow_symmetry = bool(pv(life, 'V8symy', True))

    try:
        low = max(float(feat['low'][0]), 0.0)
        mid = max(float(feat['mid'][0]), 0.0)
        high = max(float(feat['high'][0]), 0.0)
        level = max(float(feat['level'][0]), 0.0)
    except:
        low = mid = high = level = 0.0

    bands, novelty, flux, centroid, spread, entropy, crest, rolloff = analyze_spectrum(spectrum_op, dt)

    if not S['init']:
        S['level_fast'] = level
        S['level_slow'] = level
        S['prev_level'] = level
        S['prev_centroid'] = centroid
        S['init'] = True

    S['level_fast'] = ema(S['level_fast'], level, dt, 0.045)
    S['level_slow'] = ema(S['level_slow'], level, dt, 1.6)
    level_rel = max(S['level_fast'] - S['level_slow'], 0.0) / (S['level_slow'] + 0.0012)
    centroid_delta = abs(centroid - S['prev_centroid'])
    S['prev_centroid'] = ema(S['prev_centroid'], centroid, dt, 0.25)

    kick_raw = clamp(novelty[1] * 0.72 + novelty[2] * 0.34 + low * 1.65)
    snare_raw = clamp(novelty[4] * 0.42 + novelty[5] * 0.50 + novelty[6] * 0.24 + mid * 0.72)
    hat_raw = clamp(novelty[6] * 0.26 + novelty[7] * 0.54 + novelty[8] * 0.38 + high * 0.48)
    micro_raw = clamp(float(np.max(novelty[3:])) * 0.72 + flux * 0.48 + crest * 0.18)
    onset_raw = clamp(max(kick_raw * 0.92, snare_raw * 0.86, hat_raw * 0.64, micro_raw * 0.80, flux * 0.92, level_rel * 0.38))

    kick_trig = snare_trig = hat_trig = onset_trig = micro_trig = 0.0
    if kick_raw > 0.22 and (t - S['last_kick']) > 0.16:
        kick_trig = kick_raw
        S['last_kick'] = t
    if snare_raw > 0.24 and (t - S['last_snare']) > 0.11:
        snare_trig = snare_raw
        S['last_snare'] = t
    if hat_raw > 0.20 and (t - S['last_hat']) > 0.055:
        hat_trig = hat_raw
        S['last_hat'] = t
    if micro_raw > 0.18 and (t - S['last_micro']) > 0.045:
        micro_trig = micro_raw
        S['last_micro'] = t
    if onset_raw > 0.25 and (t - S['last_onset']) > 0.075:
        onset_trig = onset_raw
        S['last_onset'] = t

    S['kick_env'] = max(kick_trig * react, S['kick_env'] * math.exp(-dt * 8.4))
    S['snare_env'] = max(snare_trig * react * 0.82, S['snare_env'] * math.exp(-dt * 10.0))
    S['hat_env'] = max(hat_trig * react * 0.56, S['hat_env'] * math.exp(-dt * 14.0))
    S['micro_env'] = max(micro_trig * react * 0.50, S['micro_env'] * math.exp(-dt * 18.0))
    S['onset_env'] = max(onset_trig * react * 0.72, S['onset_env'] * math.exp(-dt * 9.5))

    beat_event = kick_trig > 0.30 or onset_trig > 0.58
    bpm_min, bpm_max = 68.0, 170.0
    if beat_event:
        times = S['onset_times']
        if times:
            interval = t - times[-1]
            if 0.20 <= interval <= 1.60:
                cand = 60.0 / interval
                while cand < bpm_min:
                    cand *= 2.0
                while cand > bpm_max:
                    cand *= 0.5
                if bpm_min <= cand <= bpm_max:
                    S['bpm_candidates'].append(cand)
                    S['bpm_candidates'] = S['bpm_candidates'][-20:]
        times.append(t)
        S['onset_times'] = times[-28:]

    if len(S['bpm_candidates']) >= 4:
        arr = np.asarray(S['bpm_candidates'], dtype=np.float64)
        med = float(np.median(arr))
        mad = float(np.median(np.abs(arr - med)))
        conf = clamp(1.0 - mad / max(med * 0.075, 1e-6))
        S['bpm'] = ema(S['bpm'], med, dt, 2.0)
        S['bpm_conf'] = ema(S['bpm_conf'], conf, dt, 0.9)
    else:
        S['bpm_conf'] = ema(S['bpm_conf'], 0.0, dt, 4.0)

    S['bpm'] = clamp(S['bpm'], bpm_min, bpm_max)
    period = 60.0 / max(S['bpm'], 1.0)
    if S['beat_anchor'] is None:
        S['beat_anchor'] = t
    if beat_event and S['bpm_conf'] > 0.18:
        phase_now = ((t - S['beat_anchor']) / period) % 1.0
        phase_err = phase_now if phase_now < 0.5 else phase_now - 1.0
        S['beat_anchor'] += phase_err * period * (0.16 + 0.34 * S['bpm_conf'])

    beat_float = max((t - S['beat_anchor']) / period, 0.0)
    beat_index = int(math.floor(beat_float))
    beat_phase = beat_float - math.floor(beat_float)
    beat_trigger = 1.0 if beat_index != S['last_beat_index'] else 0.0
    S['last_beat_index'] = beat_index
    bar_index = beat_index // 4
    beat_in_bar = beat_index % 4
    bar_phase = (beat_in_bar + beat_phase) / 4.0
    bar_trigger = 1.0 if bar_index != S['last_bar_index'] else 0.0
    S['last_bar_index'] = bar_index
    beat_pulse = max((1.0 - beat_phase) ** 10.0, beat_trigger * 0.72)

    novelty_density = float(np.mean(novelty > 0.34))
    subtle_density = float(np.mean(novelty > 0.18))
    complexity = clamp(entropy * 0.56 + novelty_density * 0.28 + spread * 0.22)
    musical_change = clamp(flux * 0.58 + centroid_delta * 2.0 + abs(level - S['prev_level']) * 2.5 + onset_raw * 0.22)
    S['prev_level'] = level
    macro_energy = clamp(math.sqrt(max(S['level_slow'], 0.0)) * 2.0)

    macro_index = bar_index // macro_bars
    if macro_index != S['macro_index']:
        S['macro_index'] = macro_index
        family, motif, symmetry = choose_macro(macro_index, centroid, entropy, flux, crest, allow_symmetry)
        S['macro_family'] = family
        S['motif'] = motif
        S['symmetry'] = symmetry
        S['pattern_seed'] = hash01(macro_index * 31.71 + centroid * 17.3 + entropy * 11.9 + flux * 7.1 + rolloff * 5.7)

    bars_into_macro = bar_index - macro_index * macro_bars
    substate = int((bars_into_macro // 2) % 4)
    evolution_phase = ((bars_into_macro + bar_phase) / float(max(macro_bars, 1))) % 1.0
    if S['motif'] == 3:
        S['symmetry'] = 0
    elif not allow_symmetry:
        S['symmetry'] = 0

    S['density'] = ema(S['density'], clamp(0.40 + macro_energy * 0.18 + subtle_density * 0.30 + geometry_ctl * 0.08, 0.38, 0.84), dt, 1.4)
    S['motion'] = ema(S['motion'], clamp(0.46 + motion_ctl * 0.30 + centroid * 0.18 + S['micro_env'] * 0.08, 0.45, 1.08), dt, 1.0)
    S['interaction'] = ema(S['interaction'], clamp(0.008 + interaction_ctl * 0.10 + novelty_density * 0.035, 0.008, 0.12), dt, 1.8)
    target_particles = pmin + (pmax - pmin) * clamp(0.42 + subtle_density * 0.34 + S['micro_env'] * 0.16 + centroid * 0.08, 0.0, 1.0)
    S['particle_count'] = ema(S['particle_count'], target_particles, dt, 0.9)
    S['growth'] = ema(S['growth'], clamp(0.62 + geometry_ctl * 0.20 + macro_energy * 0.10, 0.58, 0.96), dt, 1.1)
    S['ambient'] = ema(S['ambient'], clamp(0.055 + (1.0 - contrast_ctl) * 0.07 + macro_energy * 0.025, 0.04, 0.16), dt, 1.4)

    z = np.ones(8, dtype=np.float64) * S['ambient']
    strongest_band = int(np.argmax(novelty))
    spectral_col = int(round((strongest_band / 8.0) * 7.0))
    beat_col = beat_index % 8
    if S['motif'] == 4:
        chase_col = (beat_col + substate * 2) % 8
        z[chase_col] = max(z[chase_col], 0.62 + S['kick_env'] * 0.25)
        z[(chase_col - 1) % 8] = max(z[(chase_col - 1) % 8], 0.18)
        z[(chase_col + 1) % 8] = max(z[(chase_col + 1) % 8], 0.18)
    else:
        z[spectral_col] = max(z[spectral_col], 0.18 + S['micro_env'] * 0.32)
    if kick_trig > 0.0:
        z[beat_col] = max(z[beat_col], 0.42 + S['kick_env'] * 0.34)
    if snare_trig > 0.0:
        z[(beat_col + 4) % 8] = max(z[(beat_col + 4) % 8], 0.26 + S['snare_env'] * 0.24)
    S['zones'] = ema_vec(S['zones'], np.clip(z, 0.0, 1.0), dt, 0.24)

    particle_count = int(round(clamp(S['particle_count'], float(pmin), float(pmax))))
    outputs = {
        'low': low, 'mid': mid, 'high': high, 'level': level,
        'kick': clamp(S['kick_env']), 'snare': clamp(S['snare_env']), 'hat': clamp(S['hat_env']),
        'onset': clamp(S['onset_env']), 'micro': clamp(S['micro_env']),
        'flux': flux, 'centroid': centroid, 'spread': spread, 'entropy': entropy,
        'crest': crest, 'rolloff': rolloff, 'complexity': complexity, 'change': musical_change,
        'bpm': S['bpm'], 'bpmconfidence': S['bpm_conf'], 'beatphase': beat_phase,
        'beatpulse': beat_pulse, 'beattrigger': beat_trigger, 'barphase': bar_phase,
        'bartrigger': bar_trigger, 'barindex': float(bar_index),
        'scene': float(S['motif']), 'motif': float(S['motif']), 'macrofamily': float(S['macro_family']),
        'substate': float(substate), 'symmetry': float(S['symmetry']), 'symmetrymode': float(S['symmetry']),
        'density': S['density'], 'motion': S['motion'], 'interaction': S['interaction'],
        'particlecount': float(particle_count), 'evolutionphase': float(evolution_phase),
        'growth': S['growth'], 'patternseed': float(S['pattern_seed']), 'ambientfloor': float(S['ambient']),
    }
    for i in range(9):
        outputs['band{}'.format(i)] = float(bands[i])
        outputs['novelty{}'.format(i)] = float(novelty[i])
    for i in range(8):
        outputs['zone{}'.format(i)] = float(S['zones'][i] * ceiling_ctl)

    scriptOp.clear()
    scriptOp.numSamples = 1
    for name, value in outputs.items():
        ch = scriptOp.appendChan(name)
        ch[0] = float(value)
    return

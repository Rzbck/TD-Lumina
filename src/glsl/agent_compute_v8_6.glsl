float hash11(float x)
{
    return fract(
        sin(x * 127.1 + uSeed.x * 311.7)
        * 43758.5453123
    );
}

void segmentNodes(int seg, out int a, out int b)
{
    a = int(TDInPoint_nodeid(2, uint(seg * 2)) + 0.5);
    b = int(TDInPoint_nodeid(2, uint(seg * 2 + 1)) + 0.5);
}

vec2 segmentMid(int seg)
{
    return TDInPoint_segmentmid(2, uint(seg * 2));
}

int chooseStart(int previous, int count, float seed)
{
    vec2 oldP = vec2(-10.0);
    if (previous >= 0)
        oldP = segmentMid(previous);

    int bestSeg = 0;
    float bestDistance = -1.0;

    for (int i = 0; i < 12; i++)
    {
        int s = int(floor(
            hash11(seed + float(i) * 29.731)
            * float(count)
        ));

        s = clamp(s, 0, count - 1);

        if (previous < 0)
            return s;

        float d = length(segmentMid(s) - oldP);

        if (d > bestDistance)
        {
            bestDistance = d;
            bestSeg = s;
        }

        if (d > 0.30)
            return s;
    }

    return bestSeg;
}

int chooseNextSegment(
    int currentSeg,
    int node,
    int count,
    float rnd,
    float straightBias,
    float roamBias
)
{
    vec2 pa = TDInPoint_P(2, uint(currentSeg * 2)).xy;
    vec2 pb = TDInPoint_P(2, uint(currentSeg * 2 + 1)).xy;

    int ca;
    int cb;
    segmentNodes(currentSeg, ca, cb);

    vec2 incoming =
        node == cb
        ? normalize(pb - pa)
        : normalize(pa - pb);

    int candidates[8];
    float scores[8];
    int n = 0;

    for (int s = 0; s < 128; s++)
    {
        if (s >= count)
            break;
        if (s == currentSeg)
            continue;

        int a;
        int b;
        segmentNodes(s, a, b);

        if (a != node && b != node)
            continue;

        if (n < 8)
        {
            vec2 sa = TDInPoint_P(2, uint(s * 2)).xy;
            vec2 sb = TDInPoint_P(2, uint(s * 2 + 1)).xy;
            vec2 outgoing =
                a == node
                ? normalize(sb - sa)
                : normalize(sa - sb);

            float align = dot(incoming, outgoing) * 0.5 + 0.5;
            float jitter = hash11(rnd * 31.7 + float(s) * 7.13);

            candidates[n] = s;
            scores[n] =
                align * straightBias
                + jitter * roamBias;

            n++;
        }
    }

    if (n <= 0)
        return currentSeg;

    int best = 0;
    float bestScore = -1.0;

    for (int i = 0; i < 8; i++)
    {
        if (i >= n)
            break;

        if (scores[i] > bestScore)
        {
            bestScore = scores[i];
            best = i;
        }
    }

    return candidates[best];
}

void main()
{
    uint id = TDIndex();
    if (id >= TDNumElements())
        return;

    int segmentCount = int(uSystem.x);
    int agentCount = int(uSystem.y);
    float dt = max(uSystem.z, 0.00001);
    float time = uSystem.w;

    float low = max(uAudio.x, 0.0);
    float mid = max(uAudio.y, 0.0);
    float high = max(uAudio.z, 0.0);
    float level = max(uAudio.w, 0.0);

    float kick = clamp(uHit.x, 0.0, 1.4);
    float snare = clamp(uHit.y, 0.0, 1.2);
    float hat = clamp(uHit.z, 0.0, 1.0);
    float onset = clamp(uHit.w, 0.0, 1.0);

    float density = clamp(uBrain.z, 0.05, 1.0);
    float motion = clamp(uBrain.w, 0.10, 1.5);
    float interaction = clamp(uBrain2.x, 0.0, 1.0);
    float complexity = clamp(uBrain2.y, 0.0, 1.0);
    float geometry = clamp(uBrain2.z, 0.0, 1.0);

    float patternSeed = uSeed.x;
    float evolution = clamp(uSeed.y, 0.0, 0.999999);
    int motif = clamp(int(floor(uSeed.z + 0.5)), 0, 5);
    int activeCount = clamp(int(floor(uSeed.w + 0.5)), 1, agentCount);

    float silenceGate = uControl2.w;

    float age = TDInPoint_age(1, id) + dt;

    int seg = int(TDInPoint_segmentid(1, id) + 0.5);
    float progress = TDInPoint_progress(1, id);
    float direction = TDInPoint_direction(1, id);
    float energy = TDInPoint_energy(1, id);
    float audioMemory = TDInPoint_audiomemory(1, id);
    float cooldown = TDInPoint_cooldown(1, id);
    int mode = int(TDInPoint_mode(1, id) + 0.5);
    float hue = TDInPoint_hue(1, id);
    float eventCount = TDInPoint_eventcount(1, id);
    float speed = TDInPoint_speed(1, id);
    float life = TDInPoint_life(1, id);
    float lifeMax = TDInPoint_lifemax(1, id);
    int originSegment = int(TDInPoint_originsegment(1, id) + 0.5);
    float style = TDInPoint_style(1, id);
    int symmetry = int(TDInPoint_symmetry(1, id) + 0.5);

    float spec = clamp(TDInPoint_specu(0, id), 0.0, 1.0);
    float raw = max(TDInPoint_audioraw(0, id), 0.0);

    if (age < dt * 2.0)
    {
        seg = int(id) % segmentCount;
        progress = hash11(float(id) * 3.71);
        direction = hash11(float(id) * 5.31) > 0.5 ? 1.0 : -1.0;
        energy = 0.0;
        audioMemory = raw;
        cooldown = hash11(float(id) * 9.17) * 1.2;
        mode = 1;
        hue = 0.5;
        eventCount = 0.0;
        speed = 0.5;
        life = 0.0;
        lifeMax = 1.0;
        originSegment = -1;
        style = hash11(float(id) * 11.73);
        symmetry = 0;
    }

    if (int(id) >= activeCount)
    {
        energy = 0.0;
        life = 0.0;
        cooldown = 0.25 + hash11(float(id) * 2.71);
        audioMemory = raw;
    }
    else if (level <= silenceGate)
    {
        energy = 0.0;
        life = 0.0;
        cooldown = 0.25 + hash11(float(id) * 4.17);
        audioMemory = 0.0;
    }
    else
    {
        float previousLife = life;

        float followRate = mix(1.1, 3.0, hash11(float(id) * 13.1));
        float follow = 1.0 - exp(-followRate * dt);
        float nextAudio = mix(audioMemory, raw, follow);

        float rise = max(raw - audioMemory, 0.0);
        float relativeRise = rise / (0.0012 + audioMemory * 0.40);
        audioMemory = nextAudio;

        float bassAffinity = pow(1.0 - spec, 2.0);
        float midAffinity = exp(-0.5 * pow((spec - 0.44) / 0.20, 2.0));
        float highAffinity = smoothstep(0.48, 0.96, spec);

        float bassHit = kick * bassAffinity;
        float midHit = snare * midAffinity;
        float highHit = hat * highAffinity;
        float localHit = clamp(relativeRise * 0.22, 0.0, 0.75);

        int semantic = 0;
        float musicHit = bassHit;

        if (midHit > musicHit)
        {
            musicHit = midHit;
            semantic = 1;
        }

        if (highHit > musicHit)
        {
            musicHit = highHit;
            semantic = 2;
        }

        if (localHit > musicHit)
        {
            musicHit = localHit;
            semantic = spec < 0.34 ? 0 : (spec < 0.67 ? 1 : 2);
        }

        musicHit = max(musicHit, onset * 0.35);

        cooldown = max(cooldown - dt, 0.0);
        life = max(life - dt, 0.0);

        if (previousLife > 0.0 && life <= 0.0)
        {
            cooldown = mix(
                0.18,
                1.45,
                hash11(float(id) * 17.7 + eventCount * 5.31 + patternSeed * 19.0)
            );
        }

        if (life > 0.0)
        {
            float fade = smoothstep(0.0, min(1.1, lifeMax * 0.18), life);
            energy = max(energy * exp(-0.07 * dt), 0.52 * fade);
        }
        else
        {
            energy *= exp(-4.0 * dt);
        }

        if (life > 0.0 && interaction > 0.001)
        {
            float meeting = 0.0;

            for (int k = 0; k < 32; k++)
            {
                if (k >= activeCount)
                    break;
                if (k == int(id))
                    continue;

                uint other = uint(k);
                if (TDInPoint_life(1, other) <= 0.0)
                    continue;

                int otherSeg = int(TDInPoint_segmentid(1, other) + 0.5);
                if (otherSeg != seg)
                    continue;

                float op = TDInPoint_progress(1, other);
                if (abs(op - progress) < 0.045)
                    meeting = max(meeting, TDInPoint_energy(1, other));
            }

            if (meeting > 0.35 && cooldown <= 0.02)
            {
                float ir = hash11(
                    float(id) * 31.1
                    + eventCount * 7.3
                    + floor(time * 1.7)
                );

                // V8.6: never reverse in the middle of an edge.
                // A meeting affects speed/style and therefore the NEXT junction.
                speed *= mix(0.90, 1.10, hash11(ir * 19.0));
                speed = clamp(speed, 0.18, 1.28);
                style = fract(style + 0.11 + ir * 0.37);
                cooldown = 0.34;
            }
        }

        float agentRnd = hash11(float(id) * 43.17 + patternSeed * 17.0);
        float interval = mix(0.55, 2.20, hash11(float(id) * 7.91 + patternSeed * 3.1));
        interval /= mix(0.72, 1.30, motion);

        float phase = fract(
            time / max(interval, 0.20)
            + hash11(float(id) * 19.27 + patternSeed * 11.0)
        );

        float window = clamp(dt / max(interval, 0.20) * 1.8, 0.006, 0.060);
        bool autonomousPulse = phase < window;

        int cohortCount = 7;
        int currentCohort = int(floor(time * mix(1.6, 3.2, motion))) % cohortCount;
        bool cohortOpen = (int(id) % cohortCount) == currentCohort;

        float musicProbability = clamp(
            density * mix(0.16, 0.48, musicHit),
            0.03,
            0.52
        );

        bool musicSpawn =
            cohortOpen
            && musicHit > mix(0.13, 0.07, uControl.x)
            && hash11(float(id) * 71.3 + floor(time * 5.0) + eventCount * 17.0) < musicProbability;

        float autonomousChance = mix(0.34, 0.78, density);
        bool autonomousSpawn =
            autonomousPulse
            && hash11(float(id) * 97.1 + floor(time / max(interval, 0.2))) < autonomousChance;

        bool trigger =
            life <= 0.0
            && cooldown <= 0.0
            && (musicSpawn || autonomousSpawn);

        if (trigger)
        {
            eventCount += 1.0;

            float eventSeed =
                float(id) * 17.91
                + eventCount * 83.71
                + floor(time * 1.7)
                + patternSeed * 53.0;

            seg = chooseStart(originSegment, segmentCount, eventSeed);
            originSegment = seg;

            progress = hash11(eventSeed + 11.0) > 0.5 ? 0.0 : 1.0;
            direction = progress < 0.5 ? 1.0 : -1.0;
            mode = 1;

            float individual = hash11(eventSeed + 23.0);
            speed = mix(0.24, 1.10, individual) * mix(0.72, 1.28, motion);

            life = mix(9.0, 28.0, hash11(eventSeed + 29.0));
            life *= mix(0.82, 1.18, complexity);
            lifeMax = life;

            float sourceStrength = max(musicHit, autonomousSpawn ? 0.34 : 0.0);
            energy = clamp(mix(0.62, 0.98, sourceStrength), 0.0, 1.0);

            if (autonomousSpawn && !musicSpawn)
                semantic = spec < 0.34 ? 0 : (spec < 0.68 ? 1 : 2);

            style = (float(semantic) + hash11(eventSeed + 37.0)) / 4.0;
            hue = float(semantic) / 3.0;
            symmetry = uBrain.y > 0.5 ? 1 : 0;
            cooldown = 0.10;
        }

        if (life > 0.0)
        {
            progress += direction * speed * dt;

            bool crossed = false;
            int endpoint = -1;
            float overflow = 0.0;

            if (progress >= 1.0)
            {
                overflow = progress - 1.0;
                progress = 1.0;
                crossed = true;
                int a;
                int b;
                segmentNodes(seg, a, b);
                endpoint = b;
            }
            else if (progress <= 0.0)
            {
                overflow = -progress;
                progress = 0.0;
                crossed = true;
                int a;
                int b;
                segmentNodes(seg, a, b);
                endpoint = a;
            }

            if (crossed)
            {
                float routeRnd = hash11(
                    float(id) * 13.77
                    + eventCount * 37.11
                    + float(endpoint) * 5.17
                    + floor(time * 0.73)
                    + evolution * 29.0
                );

                float personality = fract(
                    hash11(float(id) * 5.19 + patternSeed * 13.0)
                    + style * 0.47
                );
                float straightBias = mix(0.16, 0.78, personality);
                float roamBias = mix(0.84, 0.24, personality);

                if (motif == 3)
                    roamBias *= 1.25;
                else if (motif == 4)
                    straightBias *= 1.12;

                int next = chooseNextSegment(
                    seg,
                    endpoint,
                    segmentCount,
                    routeRnd,
                    straightBias,
                    roamBias
                );

                int a;
                int b;
                segmentNodes(next, a, b);
                seg = next;

                // Preserve sub-frame travel through the junction.
                overflow = min(overflow, 0.22);

                if (endpoint == a)
                {
                    progress = overflow;
                    direction = 1.0;
                }
                else
                {
                    progress = 1.0 - overflow;
                    direction = -1.0;
                }

                speed *= mix(0.94, 1.06, hash11(routeRnd * 41.0 + float(next)));
                speed = clamp(speed, 0.18, 1.28);
            }
        }
    }

    oTDPoint_P[id] = TDInPoint_P(0, id);
    oTDPoint_segmentid[id] = float(seg);
    oTDPoint_progress[id] = progress;
    oTDPoint_direction[id] = direction;
    oTDPoint_energy[id] = clamp(energy, 0.0, 1.0);
    oTDPoint_audiomemory[id] = audioMemory;
    oTDPoint_cooldown[id] = cooldown;
    oTDPoint_mode[id] = float(mode);
    oTDPoint_hue[id] = hue;
    oTDPoint_age[id] = age;
    oTDPoint_eventcount[id] = eventCount;
    oTDPoint_speed[id] = speed;
    oTDPoint_life[id] = life;
    oTDPoint_lifemax[id] = lifeMax;
    oTDPoint_originsegment[id] = float(originSegment);
    oTDPoint_style[id] = style;
    oTDPoint_symmetry[id] = float(symmetry);
}

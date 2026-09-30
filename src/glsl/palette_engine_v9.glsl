vec3 hsv2rgbLumina(vec3 c)
{
    vec3 p = abs(
        fract(
            c.xxx
            + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)
        ) * 6.0
        - 3.0
    );

    vec3 rgb = clamp(p - 1.0, 0.0, 1.0);
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);

    return c.z * mix(vec3(1.0), rgb, c.y);
}

vec3 luminaFamilyColor(int family, int role, float impact)
{
    int f = family % 6;

    float h1 = 0.05;
    float h2 = 0.50;

    if (f == 1) { h1 = 0.56; h2 = 0.47; }
    else if (f == 2) { h1 = 0.095; h2 = 0.60; }
    else if (f == 3) { h1 = 0.92; h2 = 0.66; }
    else if (f == 4) { h1 = 0.48; h2 = 0.74; }
    else if (f == 5) { h1 = 0.015; h2 = 0.085; }

    float satBoost = impact * 0.10;

    if (role == 0)
    {
        vec3 tint = hsv2rgbLumina(vec3(h1, 0.11 + impact * 0.035, 1.0));
        return mix(vec3(1.0), tint, 0.18);
    }

    if (role == 1)
        return hsv2rgbLumina(vec3(h1, clamp(0.68 + satBoost, 0.0, 0.92), 0.98));

    return hsv2rgbLumina(vec3(h2, clamp(0.58 + satBoost * 0.72, 0.0, 0.88), 0.94));
}

vec3 paletteColor(int role)
{
    float paletteClock = max(uSystem.z, 0.0) * 0.022 + uSeed.x * 0.61;
    float epoch = floor(paletteClock);
    float morph = smoothstep(0.08, 0.92, fract(paletteClock));

    int familyA = int(mod(epoch, 6.0));
    int familyB = (familyA + 1) % 6;

    float impact = clamp(max(uHit.x, max(uHit.y, uHit.w)), 0.0, 1.0);

    vec3 a = luminaFamilyColor(familyA, role, impact);
    vec3 b = luminaFamilyColor(familyB, role, impact);

    return mix(a, b, morph);
}

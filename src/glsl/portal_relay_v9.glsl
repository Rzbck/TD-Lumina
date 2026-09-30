float portalTrace(
    float perimeterPos,
    float perimeterLength,
    float phase,
    float reverseDirection,
    float trailMode
)
{
    if (perimeterPos < 0.0 || perimeterLength <= 0.0)
        return 0.0;

    float pos = perimeterPos;
    if (reverseDirection > 0.5)
        pos = perimeterLength - perimeterPos;

    float p = clamp(phase, 0.0, 1.0) * perimeterLength;
    float head = exp(-0.5 * pow((pos - p) / 0.075, 2.0));
    float passed = 1.0 - smoothstep(p - 0.025, p + 0.070, pos);
    float complete = smoothstep(0.90, 0.995, phase);

    if (trailMode < 0.333)
        return max(head, passed * complete * 0.48);

    if (trailMode < 0.666)
    {
        float tail = smoothstep(p - 1.45, p - 0.12, pos)
            * (1.0 - smoothstep(p - 0.02, p + 0.08, pos));
        return max(head, max(tail * 0.34, passed * complete * 0.46));
    }

    return max(head, passed * 0.46);
}

float relayPathShape(
    int seg,
    float u,
    int startNode,
    int endNode,
    float seed,
    float phase,
    float trailMode
)
{
    int fromNode;
    int toNode;
    int totalSteps;

    int step = pathStepForSegment(seg, startNode, endNode, seed, fromNode, toNode, totalSteps);
    if (step < 0 || totalSteps <= 0)
        return 0.0;

    float local = edgeUFromTo(seg, u, fromNode, toNode);
    float pathPos = float(step) + local;
    float headPos = clamp(phase, 0.0, 1.0) * float(totalSteps);
    float head = exp(-0.5 * pow((pathPos - headPos) / 0.115, 2.0));

    if (trailMode < 0.333)
        return head;

    float tailLength = trailMode < 0.666 ? 0.85 : 2.20;
    float tail = smoothstep(headPos - tailLength, headPos - 0.10, pathPos)
        * (1.0 - smoothstep(headPos - 0.015, headPos + 0.10, pathPos));

    return max(head, tail * (trailMode < 0.666 ? 0.30 : 0.42));
}

// Motif 5 body. This block is inserted into the existing V8.6.x renderer.
// Portal Relay is intentionally asymmetric.
if (motif == 5)
{
    float relay = clamp(evolutionPhase, 0.0, 1.0);
    float rs = fract(patternSeed * 0.913 + 0.173);

    bool sourceOnLeft = hash11(rs * 11.3 + 1.7) > 0.5;

    int srcWidth = clamp(1 + int(floor(hash11(rs * 13.7 + 2.2) * 2.0)), 1, 2);
    int dstWidth = clamp(1 + int(floor(hash11(rs * 17.1 + 3.4) * 2.0)), 1, 2);
    int srcHeight = clamp(1 + int(floor(hash11(rs * 19.9 + 4.1) * 2.0)), 1, 2);
    int dstHeight = clamp(1 + int(floor(hash11(rs * 23.3 + 5.8) * 2.0)), 1, 2);

    int srcLeft;
    int dstLeft;

    if (sourceOnLeft)
    {
        srcLeft = int(floor(hash11(rs * 29.1 + 2.0) * 2.0));
        dstLeft = 8 - dstWidth - int(floor(hash11(rs * 31.7 + 7.0) * 2.0));
    }
    else
    {
        srcLeft = 8 - srcWidth - int(floor(hash11(rs * 29.1 + 2.0) * 2.0));
        dstLeft = int(floor(hash11(rs * 31.7 + 7.0) * 2.0));
    }

    srcLeft = clamp(srcLeft, 0, 8 - srcWidth);
    dstLeft = clamp(dstLeft, 0, 8 - dstWidth);

    int srcTopCount = max(1, 5 - srcHeight);
    int dstTopCount = max(1, 5 - dstHeight);
    int srcTop = int(floor(hash11(rs * 37.9 + 1.0) * float(srcTopCount)));
    int dstTop = int(floor(hash11(rs * 41.3 + 6.0) * float(dstTopCount)));

    srcTop = clamp(srcTop, 0, 4 - srcHeight);
    dstTop = clamp(dstTop, 0, 4 - dstHeight);

    int srcRight = srcLeft + srcWidth;
    int srcBottom = srcTop + srcHeight;
    int dstRight = dstLeft + dstWidth;
    int dstBottom = dstTop + dstHeight;

    float aPerimeter = float(2 * (srcWidth + srcHeight));
    float bPerimeter = float(2 * (dstWidth + dstHeight));

    float aPos = rectPerimeterPosition(mySeg, myU, srcLeft, srcRight, srcTop, srcBottom);
    float bPos = rectPerimeterPosition(mySeg, myU, dstLeft, dstRight, dstTop, dstBottom);

    float aDirection = hash11(rs * 47.1 + 3.0) > 0.5 ? 1.0 : 0.0;
    float bDirection = sourceOnLeft ? 1.0 : 0.0;

    float aTrailMode = hash11(rs * 53.7 + 2.0);
    float bTrailMode = hash11(rs * 59.1 + 4.0);
    float pathTrailMode = hash11(rs * 61.9 + 9.0);

    float aProgress = smoothstep(0.02, 0.22, relay);
    if (relay > 0.74)
        aProgress = 1.0 - smoothstep(0.74, 0.97, relay);

    float bProgress = smoothstep(0.56, 0.82, relay);
    float pathProgress = smoothstep(0.20, 0.62, relay);

    float portalA = portalTrace(aPos, aPerimeter, aProgress, aDirection, aTrailMode);
    float portalB = portalTrace(bPos, bPerimeter, bProgress, bDirection, bTrailMode);

    int srcMidRow = clamp(srcTop + srcHeight / 2, 0, 4);
    int dstMidRow = clamp(dstTop + dstHeight / 2, 0, 4);
    int startCol = sourceOnLeft ? srcRight : srcLeft;
    int endCol = sourceOnLeft ? dstLeft : dstRight;
    int startNode = nodeID(startCol, srcMidRow);
    int endNode = nodeID(endCol, dstMidRow);

    float pathGate = smoothstep(0.18, 0.23, relay)
        * (1.0 - smoothstep(0.82, 0.96, relay));

    float relayPath = relayPathShape(
        mySeg, myU, startNode, endNode, rs, pathProgress, pathTrailMode
    ) * pathGate;

    float portalEnergy = 0.60 + kick * 0.18 + snare * 0.08 + onset * 0.12;

    structureIntensity = max(
        structureIntensity,
        max(max(portalA, portalB), relayPath * 1.14) * portalEnergy
    );
}

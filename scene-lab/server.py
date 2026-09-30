from __future__ import annotations

import base64
import json
import os
import re
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parent
WEB = ROOT / "web"
REVIEWS = ROOT / "reviews"
EVENTS = REVIEWS / "events"
ASSETS = REVIEWS / "assets"
REGISTRY = ROOT / "scene-registry.json"
REVIEW_SCHEMA = ROOT / "review-schema.json"
SAFE_ID = re.compile(r"^[a-zA-Z0-9._-]{1,120}$")
WHISPER_MODEL_NAME = os.getenv("LUMINA_WHISPER_MODEL", "small")
WHISPER_DEVICE = os.getenv("LUMINA_WHISPER_DEVICE", "cpu")
WHISPER_COMPUTE_TYPE = os.getenv("LUMINA_WHISPER_COMPUTE_TYPE", "int8")
RATING_KEYS = {
    "architecture_readability",
    "physical_pixel_fidelity",
    "light_shadow_balance",
    "movement_quality",
    "movement_continuity",
    "internal_evolution",
    "spatial_use",
    "symmetry_quality",
    "asymmetry_quality",
    "pixel_liveliness",
    "music_sync",
    "color_palette",
    "originality",
    "repetition_control",
    "transition_quality",
    "performance",
}

EVENTS.mkdir(parents=True, exist_ok=True)
ASSETS.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Lumina Scene Lab", version="0.2.0")
_whisper_model: Any | None = None


class FeedbackPayload(BaseModel):
    feedback_id: str | None = None
    reference_type: str = Field(pattern=r"^(instant|just_seen|desired)$")
    comment: str = Field(min_length=1, max_length=20000)
    snapshot: dict[str, Any]
    ratings: dict[str, int | None] = Field(default_factory=dict)
    pause_image: str | None = None
    context_frames: list[dict[str, Any]] = Field(default_factory=list)


class TranscriptionPayload(BaseModel):
    audio_data: str = Field(min_length=16, max_length=40_000_000)
    language: str = Field(default="fr", pattern=r"^[a-zA-Z-]{2,12}$")


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def safe_id(value: str | None) -> str:
    candidate = value or str(uuid4())
    if not SAFE_ID.fullmatch(candidate):
        raise HTTPException(status_code=400, detail="Invalid feedback id")
    return candidate


def decode_data_url(data_url: str, expected_prefix: str) -> bytes:
    if not data_url.startswith(expected_prefix):
        raise HTTPException(status_code=400, detail="Invalid image payload")
    try:
        _, encoded = data_url.split(",", 1)
        return base64.b64decode(encoded, validate=True)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail="Invalid base64 payload") from exc


def decode_audio_data_url(data_url: str) -> tuple[bytes, str]:
    if not data_url.startswith("data:audio/") or ";base64," not in data_url:
        raise HTTPException(status_code=400, detail="Invalid audio payload")
    try:
        header, encoded = data_url.split(",", 1)
        mime = header[5:].split(";", 1)[0].lower()
        raw = base64.b64decode(encoded, validate=True)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail="Invalid base64 audio") from exc
    suffixes = {
        "audio/webm": ".webm",
        "audio/ogg": ".ogg",
        "audio/mp4": ".m4a",
        "audio/mpeg": ".mp3",
        "audio/wav": ".wav",
        "audio/x-wav": ".wav",
    }
    return raw, suffixes.get(mime, ".webm")


def write_exclusive(path: Path, data: bytes | str) -> None:
    mode = "xb" if isinstance(data, bytes) else "x"
    kwargs = {} if isinstance(data, bytes) else {"encoding": "utf-8"}
    with path.open(mode, **kwargs) as fh:
        fh.write(data)


def validated_ratings(values: dict[str, int | None]) -> dict[str, int | None]:
    ratings: dict[str, int | None] = {}
    for key, value in values.items():
        if key not in RATING_KEYS:
            continue
        if value is None:
            ratings[key] = None
            continue
        if not 1 <= int(value) <= 5:
            raise HTTPException(status_code=400, detail=f"Rating {key} must be 1..5 or null")
        ratings[key] = int(value)
    return ratings


def get_whisper_model() -> Any:
    global _whisper_model
    if _whisper_model is None:
        try:
            from faster_whisper import WhisperModel

            _whisper_model = WhisperModel(
                WHISPER_MODEL_NAME,
                device=WHISPER_DEVICE,
                compute_type=WHISPER_COMPUTE_TYPE,
            )
        except Exception as exc:  # noqa: BLE001
            raise HTTPException(
                status_code=503,
                detail=f"Impossible de charger Faster-Whisper ({WHISPER_MODEL_NAME}): {exc}",
            ) from exc
    return _whisper_model


@app.get("/api/health")
def health() -> dict[str, Any]:
    return {
        "ok": True,
        "project": "Lumina Scene Lab",
        "feedback_dir": str(EVENTS.relative_to(ROOT)),
        "microphone": {
            "mode": "local_faster_whisper",
            "language": "fr",
            "server_transcription": True,
            "model": WHISPER_MODEL_NAME,
            "device": WHISPER_DEVICE,
            "compute_type": WHISPER_COMPUTE_TYPE,
        },
    }


@app.get("/api/config")
def config() -> dict[str, Any]:
    registry = json.loads(REGISTRY.read_text(encoding="utf-8")) if REGISTRY.exists() else {"scenes": []}
    review_schema = json.loads(REVIEW_SCHEMA.read_text(encoding="utf-8")) if REVIEW_SCHEMA.exists() else {}
    return {
        "registry": registry,
        "review_schema": review_schema,
        "feedback": {
            "context_window_seconds": 8,
            "context_frame_hz": 1,
            "pause_is_exact": True,
            "rating_scale": [1, 2, 3, 4, 5],
            "rating_keys": sorted(RATING_KEYS),
        },
        "transcription": {
            "engine": "faster-whisper",
            "model": WHISPER_MODEL_NAME,
            "language": "fr",
            "local": True,
        },
    }


@app.post("/api/transcribe")
def transcribe(payload: TranscriptionPayload) -> dict[str, Any]:
    raw, suffix = decode_audio_data_url(payload.audio_data)
    if len(raw) > 25_000_000:
        raise HTTPException(status_code=413, detail="Enregistrement audio trop volumineux")

    path: str | None = None
    try:
        with tempfile.NamedTemporaryFile(prefix="lumina_voice_", suffix=suffix, delete=False) as fh:
            fh.write(raw)
            path = fh.name

        model = get_whisper_model()
        segments, info = model.transcribe(
            path,
            language=payload.language,
            beam_size=5,
            vad_filter=True,
            condition_on_previous_text=True,
        )
        text = " ".join(segment.text.strip() for segment in segments if segment.text.strip()).strip()
        return {
            "ok": True,
            "text": text,
            "language": getattr(info, "language", payload.language),
            "language_probability": float(getattr(info, "language_probability", 0.0) or 0.0),
            "duration": float(getattr(info, "duration", 0.0) or 0.0),
            "model": WHISPER_MODEL_NAME,
            "local": True,
        }
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Transcription impossible: {exc}") from exc
    finally:
        if path:
            try:
                Path(path).unlink(missing_ok=True)
            except OSError:
                pass


@app.post("/api/feedback")
def save_feedback(payload: FeedbackPayload) -> dict[str, Any]:
    fid = safe_id(payload.feedback_id)
    scene_slug = str(payload.snapshot.get("scene_slug", "scene"))
    if not SAFE_ID.fullmatch(scene_slug):
        scene_slug = "scene"

    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S.%fZ")
    asset_rel = Path("reviews") / "assets" / fid
    asset_dir = ROOT / asset_rel
    if asset_dir.exists():
        raise HTTPException(status_code=409, detail="Feedback id already exists")
    asset_dir.mkdir(parents=True, exist_ok=False)

    pause_path: str | None = None
    if payload.pause_image:
        image = decode_data_url(payload.pause_image, "data:image/png;base64,")
        path = asset_dir / "pause.png"
        write_exclusive(path, image)
        pause_path = str(asset_rel / "pause.png")

    frame_records: list[dict[str, Any]] = []
    for index, frame in enumerate(payload.context_frames[:12]):
        image_data = frame.get("image")
        if not isinstance(image_data, str):
            continue
        mime = "image/jpeg" if image_data.startswith("data:image/jpeg;base64,") else "image/png"
        prefix = f"data:{mime};base64,"
        ext = ".jpg" if mime == "image/jpeg" else ".png"
        raw = decode_data_url(image_data, prefix)
        name = f"context_{index:02d}{ext}"
        write_exclusive(asset_dir / name, raw)
        frame_records.append(
            {
                "time_seconds": frame.get("time_seconds"),
                "beat": frame.get("beat"),
                "path": str(asset_rel / name),
            }
        )

    record = {
        "schema_version": 2,
        "kind": "feedback_event",
        "feedback_id": fid,
        "created_at": utc_now(),
        "reference_type": payload.reference_type,
        "comment": payload.comment.strip(),
        "ratings": validated_ratings(payload.ratings),
        "snapshot": payload.snapshot,
        "pause_capture": pause_path,
        "context_frames": frame_records,
    }

    event_name = f"{stamp}__{scene_slug}__{fid}.json"
    event_path = EVENTS / event_name
    try:
        write_exclusive(event_path, json.dumps(record, ensure_ascii=False, indent=2) + "\n")
    except FileExistsError as exc:
        raise HTTPException(status_code=409, detail="Feedback already exists") from exc

    return {
        "ok": True,
        "feedback_id": fid,
        "event_path": str(event_path.relative_to(ROOT)),
        "pause_capture": pause_path,
        "context_frame_count": len(frame_records),
        "rating_count": len(record["ratings"]),
    }


@app.get("/api/feedback")
def list_feedback(limit: int = 50) -> dict[str, Any]:
    limit = max(1, min(500, limit))
    files = sorted(EVENTS.glob("*.json"), reverse=True)[:limit]
    return {
        "items": [str(path.relative_to(ROOT)) for path in files],
        "count": len(files),
    }


@app.get("/")
def index() -> FileResponse:
    return FileResponse(WEB / "index.html")


app.mount("/web", StaticFiles(directory=WEB), name="web")

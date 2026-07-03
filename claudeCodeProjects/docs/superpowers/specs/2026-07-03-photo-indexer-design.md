# Photo Indexer — Design Spec

## Context

The user has a local folder (nested subfolders, unknown but potentially large number of files) containing pictures and movies. They want a tool that builds a searchable metadata index — creation date, who is in each picture, and optionally GPS location — without ever modifying the original media files. The eventual use case is pointing an LLM (Claude Code) at the resulting index to answer natural-language questions like "find photos of Alice from 2019." Identifying people requires face recognition that improves over time, with a human reviewing faces the system can't confidently match.

This becomes a third standalone tool in the workspace, alongside `folderMapper/` and `youtube2mp3/`, following the existing convention of each tool being self-contained with its own `CLAUDE.md` and dependencies.

## Scope

**In scope (v1):**
- Recursive scan of a folder tree for photos and videos
- Photo metadata: creation date (EXIF, falling back to file timestamp), GPS coordinates if present in EXIF (raw lat/long, no reverse geocoding)
- Video metadata: creation date, duration, resolution (via `ffprobe`) — no face detection on video frames
- Face detection + recognition on photos, with a growing named "gallery" of known people
- Human-in-the-loop review UI (React + Flask) for labeling faces the system can't confidently match, with unknown faces clustered so visually-similar faces are labeled once, not per-photo
- Incremental re-scanning: already-indexed, unchanged files are skipped on subsequent runs
- Output as `index.jsonl`, a plain-text, LLM-readable metadata file (one JSON object per media file)

**Out of scope (v1):**
- Reverse geocoding GPS to place names
- Face detection/recognition on video frames
- Cloud-based face recognition APIs (fully local/offline)
- Any modification of original media files (read-only access to the photo folder)
- Automated frontend tests (manual verification is acceptable for this personal tool)
- A dedicated search UI — search happens by pointing an LLM at `index.jsonl` directly

## Tech Stack

- **Backend:** Python, Flask (serves both the built React app and `/api/*` routes on one port, matching the `youtube2mp3` pattern of a single `python app.py` command)
- **Face recognition:** [DeepFace](https://github.com/serengil/deepface) — chosen over `face_recognition`/dlib (requires CMake + Visual C++ Build Tools to compile on Windows) and InsightFace (inconsistent Windows wheel availability). DeepFace is a clean `pip install`, auto-downloads its models on first run, and is fast enough for a periodic batch job on a CPU-only machine.
- **Clustering:** scikit-learn's DBSCAN, run on face embeddings to group visually-similar unknown faces
- **Image metadata:** Pillow (`Image.getexif()`) for EXIF date/GPS extraction
- **Video metadata:** `ffprobe` (part of ffmpeg, already a prerequisite of `youtube2mp3` in this workspace) via `subprocess`, following the same subprocess-to-external-binary pattern `youtube2mp3/app.py` uses for `yt-dlp`
- **Frontend:** React (Vite), built to static files and served by Flask — no separate dev server needed for normal use

## Project Structure

```
photoIndexer/
  backend/
    app.py              Flask app: serves built React app + /api/* routes
    scanner.py           walks folder tree, extracts EXIF date/GPS/video metadata, detects new/changed files
    face_pipeline.py     DeepFace detection + embeddings, gallery matching, clustering unknowns
    storage.py            reads/writes index.jsonl, gallery.json, review_queue.json
    cli.py                 `python -m backend.cli scan <folder>` entry point
  frontend/                React app (Vite), built output goes to backend/static_dist/
    src/
      App.jsx
      ReviewQueue.jsx     lists pending unknown-face clusters
      FaceCluster.jsx      shows crop thumbnails for one cluster + name input + "not a person" button
  data/                    git-ignored: index.jsonl, gallery.json, review_queue.json, face_crops/
  requirements.txt
  package.json             inside frontend/
  CLAUDE.md
```

Face crop thumbnails are derived images written to `data/face_crops/` for review purposes only. Original files in the scanned folder are opened read-only and never modified, moved, or renamed.

## Data Schemas

**`index.jsonl`** — one JSON object per line, one line per media file. This is the file an LLM (Claude Code) is pointed at to answer search questions:

```json
{"path": "2019/summer/IMG_042.jpg", "media_type": "photo", "size": 3421001, "mtime": 1717000000,
 "created_at": "2019-07-14T15:22:00", "gps": {"lat": 32.08, "lon": 34.78},
 "people": ["Alice", "Bob"], "status": "processed"}
```

Fields:
- `path` — relative path from the scanned root folder
- `media_type` — `"photo"` or `"video"`
- `size`, `mtime` — used to detect changed/new files on re-scan (no content hashing)
- `created_at` — ISO 8601 string; EXIF `DateTimeOriginal` for photos, container creation time (via `ffprobe`) for videos, falling back to filesystem creation time if metadata is missing
- `gps` — `{"lat": float, "lon": float}` or `null` if no GPS EXIF data present (photos only)
- `people` — list of names already resolved for this file; can be partially filled while other faces in the same photo are still `pending_review`
- `status` — one of:
  - `"processed"` — every detected face resolved (named or explicitly marked not-a-person)
  - `"pending_review"` — has one or more unresolved unknown faces
  - `"no_faces_detected"` — photo processed, zero faces found
  - `"metadata_only"` — video (no face pipeline applied)

**`gallery.json`** — named people → their known face embeddings, used to auto-match faces on future scans without requiring review:

```json
{"Alice": [[0.12, -0.44, "... 512 floats"], [0.09, -0.41, "..."]], "Bob": [["..."]]}
```

**`review_queue.json`** — pending unknown-face clusters, persisted across runs so a partially-reviewed batch survives closing and reopening the app:

```json
{"clusters": [
  {"cluster_id": "c1",
   "crop_paths": ["data/face_crops/c1_0.jpg", "data/face_crops/c1_1.jpg"],
   "source_files": ["2019/summer/IMG_042.jpg"],
   "embeddings": [["... 512 floats"]]}
]}
```

## Pipeline Logic

1. **Scan** (`python -m backend.cli scan <folder>`): `storage.py` loads `index.jsonl` into an in-memory dict keyed by `path` (the whole file is rewritten on save — thousands of entries is small enough that this is simpler than in-place line edits). Walk the folder tree recursively; for each file, look up its `path` in that dict. If an entry exists and its `size`+`mtime` match the file on disk, skip it (already indexed and unchanged). If the entry exists but `size`/`mtime` differ, treat it as changed: replace that entry (re-running the full pipeline below) rather than appending a duplicate. If no entry exists, it's new — extract metadata immediately:
   - Photos: EXIF `DateTimeOriginal` and GPS via Pillow; fallback to file creation time if EXIF is absent
   - Videos: `ffprobe -show_format -show_streams` for creation time, duration, resolution; status set to `metadata_only` immediately (no face pipeline)
2. **Face pipeline** (photos only, run as part of the same scan): DeepFace `represent()` returns one embedding per detected face in the photo.
   - For each embedding, compute cosine distance to every embedding in `gallery.json`. If the minimum distance for a person is below DeepFace's model-recommended threshold, tag the photo with that person's name directly — no review needed.
   - If no confident match: try to merge the embedding into an existing pending cluster in `review_queue.json` (distance to cluster centroid below the same threshold). If no cluster matches, start a new cluster and write a cropped face thumbnail to `data/face_crops/`.
   - Photos with zero detected faces get `status: "no_faces_detected"`. Photos with a mix of matched and unmatched faces get `status: "pending_review"` with `people` containing only the already-matched names.
3. Index entries update incrementally — a photo's `people` list and `status` are revised in place whenever a face belonging to it gets resolved, whether during the initial scan (auto-match) or later during review (human label).

## Review UI (React + Flask API)

- `GET /api/review-queue` → list of pending clusters with crop thumbnail URLs and count of affected source files
- `POST /api/review-queue/<cluster_id>/label` body `{"name": "Alice"}` →
  - Appends the cluster's embeddings to `gallery.json` under that name (creating the person if new)
  - Updates every `index.jsonl` entry in `source_files`: adds the name to `people`, re-evaluates `status` (only `"processed"` once no unresolved faces remain in that file)
  - Removes the cluster from `review_queue.json`
- `POST /api/review-queue/<cluster_id>/ignore` →
  - Marks the cluster resolved with no associated name (handles false-positive face detections, e.g. a statue or pet)
  - Updates affected `index.jsonl` entries' `status` the same way (without adding to `people`)
  - Removes the cluster from `review_queue.json`
- Static face crop images served from `data/face_crops/` for the frontend to render

## Testing Strategy

- `scanner.py`: pytest with small fixture images carrying known EXIF data — verify date/GPS extraction and correct skip-vs-reindex behavior when `size`/`mtime` do or don't match an existing `index.jsonl` entry
- `storage.py`: read/write round-trip tests for all three data files using `tmp_path` fixtures
- `face_pipeline.py`: matching-threshold and clustering logic unit-tested with hand-crafted embedding vectors (fast, deterministic, no real DeepFace calls); a small separate integration test with 2-3 real sample photos verifies DeepFace itself is wired correctly end-to-end
- Frontend: no automated tests in v1 — manual verification of the review flow is acceptable for a personal-use tool

## Open Items for Implementation Planning

- Exact DeepFace model/detector backend constants and their default distance thresholds
- DBSCAN `eps` starting value for clustering (tunable constant in `face_pipeline.py`)
- `requirements.txt` pinned versions (deepface, scikit-learn, pillow, flask)
- Vite project scaffolding details for `frontend/`

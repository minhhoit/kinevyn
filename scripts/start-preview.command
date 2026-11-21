#!/bin/bash
# Optional developer fallback; ordinary use goes through kinevyn_open_preview.
set -euo pipefail
kinevyn_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
kinevyn_installed="$(node "$kinevyn_root/scripts/resolve-installed.mjs" "$kinevyn_root")"
kinevyn_ffmpeg="${FFMPEG_PATH:-}"
if [ -z "$kinevyn_ffmpeg" ] && [ -x "$kinevyn_root/.tools/ffmpeg" ]; then kinevyn_ffmpeg="$kinevyn_root/.tools/ffmpeg"; fi
if [ -z "$kinevyn_ffmpeg" ]; then kinevyn_ffmpeg="$(command -v ffmpeg || true)"; fi
FFMPEG_PATH="$kinevyn_ffmpeg" node --experimental-strip-types "$kinevyn_installed/preview.ts"

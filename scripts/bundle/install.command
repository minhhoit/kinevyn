#!/bin/bash
set -euo pipefail
kinevyn_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
"$kinevyn_root/runtime/node/bin/node" "$kinevyn_root/scripts/configure-plugin.mjs"
codex plugin marketplace add "$kinevyn_root"
codex plugin add kinevyn@kinevyn-test
codex plugin list --marketplace kinevyn-test

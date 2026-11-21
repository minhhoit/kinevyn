#!/bin/sh
set -eu
kinevyn_root="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$kinevyn_root"
exec "$kinevyn_root/runtime/node/bin/node" --experimental-strip-types --import "$kinevyn_root/bootstrap.mjs" "$kinevyn_root/mcp.ts"

#!/bin/bash
# Run from a normal user terminal. Only registers Kinevyn; does not restart Codex.
set -euo pipefail

kinevyn_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
kinevyn_logs="$kinevyn_root/.artifacts/install"

command -v node >/dev/null || { echo '需要先安装 Node.js 22.18+'; exit 1; }
command -v npm >/dev/null || { echo '需要先安装 npm'; exit 1; }
command -v codex >/dev/null || { echo '未找到 codex CLI，请在能运行 codex 的终端执行此脚本。'; exit 1; }
node -e 'const [major,minor]=process.versions.node.split(".").map(Number);if(major<22||(major===22&&minor<18)){console.error("需要 Node.js 22.18+");process.exit(1)}'
codex plugin add --help >/dev/null || { echo '当前 Codex CLI 不支持插件安装，请升级后重试。'; exit 1; }

mkdir -p "$kinevyn_root/.agents/plugins" "$kinevyn_logs"
kinevyn_started=$SECONDS
kinevyn_run_id="$(date -u +%Y%m%dT%H%M%SZ)-$$"
if [[ "${KINEVYN_SOURCE_DOWNLOAD_SECONDS:-}" =~ ^[0-9]+$ ]]; then
  printf '{"runId":"%s","phase":"source-download","seconds":%s,"exitCode":0}\n' "$kinevyn_run_id" "$KINEVYN_SOURCE_DOWNLOAD_SECONDS" >> "$kinevyn_logs/timings.jsonl"
fi
kinevyn_stage() {
  local phase="$1" started=$SECONDS
  shift
  local stage_status=0
  "$@" || stage_status=$?
  local elapsed=$((SECONDS - started))
  printf '{"runId":"%s","phase":"%s","seconds":%s,"exitCode":%s}\n' "$kinevyn_run_id" "$phase" "$elapsed" "$stage_status" >> "$kinevyn_logs/timings.jsonl"
  printf '[Kinevyn] %s: %s seconds (exit %s)\n' "$phase" "$elapsed" "$stage_status"
  return "$stage_status"
}
kinevyn_catalog="$kinevyn_root/.agents/plugins/marketplace.json"
if [ -e "$kinevyn_catalog" ]; then
  node --input-type=module - "$kinevyn_catalog" <<'JS'
import fs from 'node:fs';
const catalog = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
if (catalog.name !== 'kinevyn-local' || !catalog.plugins?.some(p => p.name === 'kinevyn' && p.source?.source === 'local' && p.source.path === './')) {
  console.error('已有不同的 marketplace 配置，已停止，未覆盖该文件。'); process.exit(1);
}
JS
else
  cp "$kinevyn_root/marketplace.example.json" "$kinevyn_catalog"
fi

# Read only: detect an active/foreign source conflict before downloading dependencies.
kinevyn_stage source-preflight node "$kinevyn_root/scripts/source-marketplace.mjs" "$kinevyn_root" --check

# Source checkouts need matching inputs and output bytes; sealed ZIPs retain
# their prebuilt editor. A stale build never changes the selected checkout.
kinevyn_build_needed=false
if [ ! -f "$kinevyn_root/studio/build/index.html" ]; then
  kinevyn_build_needed=true
elif [ -e "$kinevyn_root/.git" ] && ! node "$kinevyn_root/scripts/source-build-state.mjs" --check; then
  kinevyn_build_needed=true
fi
if [ "$kinevyn_build_needed" = true ]; then
  echo '准备与当前源码匹配的编辑器。'
  (
    cd "$kinevyn_root"
    if ! node scripts/source-build-state.mjs --dependencies-current; then
      kinevyn_stage dependencies npm ci --include=dev
      node scripts/source-build-state.mjs --record-dependencies
    fi
    kinevyn_stage studio-build npm run build:studio
    node scripts/source-build-state.mjs --record
  )
fi

# Validate the contract before registration; prepare the live page only after success.
node --experimental-strip-types "$kinevyn_root/scripts/install-onboarding.mjs" "$kinevyn_root" --check-contract

echo '只注册 kinevyn-local 并安装 Kinevyn，不升级或移除其他插件。'
kinevyn_stage marketplace node "$kinevyn_root/scripts/source-marketplace.mjs" "$kinevyn_root"
kinevyn_stage plugin codex plugin add kinevyn@kinevyn-local
codex plugin list --marketplace kinevyn-local
kinevyn_stage mcp-preflight node "$kinevyn_root/scripts/check-installed-mcp.mjs"

# The primary Skill is a separate official Skills CLI installation. Failure must
# not invalidate the runtime/plugin or prevent the maintained onboarding.
kinevyn_skill_ref="$(git -C "$kinevyn_root" rev-parse HEAD 2>/dev/null || printf main)"
kinevyn_stage public-skill node --experimental-strip-types "$kinevyn_root/scripts/install-public-skill.ts" codex "$kinevyn_skill_ref" || true

kinevyn_stage onboarding node --experimental-strip-types "$kinevyn_root/scripts/install-onboarding.mjs" "$kinevyn_root" --summary
printf '[Kinevyn] local-install-total: %s seconds (source download: %s seconds)\n' "$((SECONDS - kinevyn_started))" "${KINEVYN_SOURCE_DOWNLOAD_SECONDS:-not-measured}"

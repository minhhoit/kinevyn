# Claude Code

Read and follow [AGENTS.md](AGENTS.md) before working in this repository. It is the shared source of instructions for all Agents.

Use `CLAUDE.md` as the Claude Code instruction entry. Record future repository-rule updates here and keep them aligned with `AGENTS.md`.

## Branch workflow

Branch new work from the latest `main` and target all pull requests at `main`. Merge reviewed changes directly into `main` when authorized; do not use `feature/motion` as an intermediate integration branch.

Follow [Repository PR review follow-up](AGENTS.md#repository-pr-review-follow-up) after opening or updating a repository PR: verify feedback, fix and validate, reply and resolve, then report the live review/CI/conflict state. Keep merge and publication authorization separate.

For ongoing follow-up, use `Monitor` when this session exposes it, following [Automatic waiting during PR follow-up](AGENTS.md#automatic-waiting-during-pr-follow-up); otherwise use the documented session wait and report its lifetime.

## Interface styling

Follow the mandatory [shared design system rules](AGENTS.md#shared-design-system--required-for-every-agent) for every style-related change. Read [packages/design-system/README.md](packages/design-system/README.md), reuse its tokens, styles and assets, and extend the package before adding a missing reusable visual role. Feature modules must reference this source rather than maintain independent palettes or copied styles. Apply the same rule when delegating or reviewing work; authored video and domain geometry retain their own styling boundary.
For CI scope and local validation, follow [Local validation](AGENTS.md#local-validation), including the presentation-document allowlist and the full product-content gate.

## Repository template contributions

For repository template edits, follow [Template production and reuse](AGENTS.md#template-production-and-reuse): commit source and refresh manifests/file identities; repository/hosted files need no old CMS URL or uploaded ZIP. Maintainers use **Prepare and merge PR** after review, and main synchronization publishes hosted source automatically. Website CMS publication requires a separate explicit request.

## Candidate and publication controls

New repository installations use the source bootstrap in docs/install.md by default. Published npm application installation is optional and requires an explicit user choice; follow docs/install.md for channel and host selection. Never silently substitute npm for source or mix installations. Preserve existing installations, projects, credentials and unrelated host settings. npm remains the source dependency/build tool.

Follow [the release workflow manual](docs/release-workflows.md): one manually dispatched Motion package and release entry with prepublish and publish modes, plus snapshot-only recovery. Select `main` for all entries; other execution refs are rejected for new release work. Select `test` (default, DEV templates) or `stable` (prod templates). Blank test versions use short workflow-counter `test.N` numbering; stable requires an explicit new `MAJOR.MINOR.PATCH`. Keep full run/source identities in the records. Use candidate-install.md for local testing and keep results private. Publishing requires the explicit publish mode. Reuse an existing candidate with its exact version and run ID, or build and validate within the publishing run. Public candidates must use an exact reviewed source SHA integrated into `main`. Scan tracked source plus the outer npm tgz and inner application; preserve the positive distribution list and licenses. Keep candidate, native registry installation, real Agent creation and human acceptance evidence separate.

Publication ordering reserves the historical 0.6.x namespace and starts the active series at 0.0.1. Use the shared publication comparator for npm channel protection, guide promotion, automatic test baselines and Notes history; retain standard SemVer comparison separately. Historical versions/snapshots remain immutable, and stale historical candidates must not replace active versions. Source 0.0.1 automatically builds 0.0.2-test.N when test version is empty. Existing range dependencies/lockfiles require explicit migration; no live tags or guides change until separately authorized publication. Start new publication/recovery dispatches from the latest main after cutover; do not rerun historical control snapshots that predate this ordering policy.

Stable release descriptions follow the [changelog authoring guide](https://github.com/rivyn-labs/kinevyn/blob/main/docs/CHANGELOG/README.md). Maintain English and Chinese Unreleased drafts, then archive the selected exact stable version before building. Candidate preparation reads only that frozen source SHA; missing copy warns and retains an automatic draft, while malformed supplied copy fails. Publication reuses sealed Notes and preserves published maintainer edits. Changelog sources stay outside application/npm/plugin distribution; never rewrite a retained candidate to add copy or infer publication from a draft.

Each publication uses its exact sealed candidate bytes. Require both macOS and Windows candidate installs and a prepared immutable template snapshot before publishing npm. Test uploads under `candidate` and stable under `stage`; both tags are public. Verify the public tarball hash before advancing `test` or `latest`, then finalize the guide, catalog and Release. The existing `motion-publish-test.yml` filename remains the npm Trusted Publisher identity for both channels. npm publication and release snapshot recovery require separate manual authorization. Main-branch template synchronization is explicitly authorized to run automatically using the existing R2 release-bucket credentials, scoped in the workflow to the final upload step; it does not publish npm, move tags or update installation guides. These are shared bucket credentials, not template-only credentials. Consumer jobs receive neither npm OIDC nor R2 credentials. Archive-only work must not publish npm, move tags or access default entries. The read-only Motion installation check can recheck an exact public test or stable version independently. Never overwrite published versions, put private template payloads/internal acceptance material into public artifacts, or infer merge/publication authorization from green CI. Real prod template, Agent and audiovisual acceptance remain release responsibilities; hosted installation checks do not establish them. Skills marketplace publication, main registration, npm trust, main cutover and repository rename remain separate operations.

## UI design system and interaction feedback

Follow the [ODUI apply Skill](.agents/skills/odui-apply/SKILL.md) when applying or migrating an existing shared control in Studio.

Use opaque, solid theme surfaces for product UI, including menus, Popovers, tooltips, dialogs and floating controls. Do not introduce frosted glass, translucent content backgrounds or background blur (`backdrop-filter`). Maintain this treatment in the shared design system, not feature-local overrides. Modal scrims may use a uniform tint without blur; authored video and imported artwork remain independent. The authoritative rule is in [AGENTS.md](AGENTS.md#ui-design-system-and-interaction-feedback).

Follow [the shared UI rules](AGENTS.md#ui-design-system-and-interaction-feedback) and [the design-system interaction contract](docs/design-system.md#interaction-and-feedback-contract). Transient operation results use `useToast` and `StudioToastViewport` on the floating feedback layer, including inside native dialogs; never insert success or failure notices into the content flow. Reuse semantic light/dark tokens, non-modal dropdowns (immediate quick filters; grouped draft selections with live counts and in-panel Apply), padded rounded hover states, one visible focus treatment, and shared loading/fallback geometry. Verify the actual opened states in the browser without shifting or blocking the working area.

## Product documentation

Follow the [README writing and acknowledgements rule](AGENTS.md#readme-writing-and-acknowledgements) for every README, alternative draft and translation. Keep the main narrative, headings and showcase copy focused on Kinevyn and what each example demonstrates. Put other-product comparisons, inspiration, source-product labels and upstream acknowledgements only in the final **Acknowledgements** section; do not use headings such as "From MotionGit". Preserve licenses and provenance, and keep required setup identifiers, supported agent/model names and explicitly requested example brand names accurate. Verify this placement before finishing README edits.

The design-system workbench is an independent package-owned editing surface. Keep it free of Studio and business-module imports; UI edits and Agent edits update the same design-system source. Run `npm run design:dev` to open it and `npm run design:test` for its save/conflict/independence checks.

## MCP onboarding

The MCP main page is the shared capability and usage handbook. Follow [MCP maintenance](AGENTS.md#mcp-onboarding-and-capability-maintenance) for every capability change and every scenario built from existing tools, even without a new tool. Update its entry points, examples, prerequisites, recovery and limitations in the same change; reuse shared instruction builders with feature UI and test both atomic tool coverage and scenario coverage. Platform export must remain aligned between Export and the handbook.

Follow [MCP onboarding and capability maintenance](AGENTS.md#mcp-onboarding-and-capability-maintenance). Changes to local MCP, media generation, Agent adapters, templates or optional presentation must keep the Studio connection page, capability descriptions, setup instructions and compatibility boundaries current in the same change.

## Core capabilities and shared APIs

Follow [Core capabilities and shared APIs](AGENTS.md#core-capabilities-and-shared-apis). Every new or extended core capability must support external MCP calls. Product controls and in-app Agents may compose these capabilities according to developer and user needs, using the same API or MCP operations and shared domain implementation. Preserve the same data, job, version, validation and conflict semantics across entry points; keep public discovery, applicable UI consumers, documentation and adapter verification aligned.

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (60-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk go test             # Go test failures only (90%)
rtk jest                # Jest failures only (99.5%)
rtk vitest              # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk pytest              # Python test failures only (90%)
rtk rake test           # Ruby test failures only (90%)
rtk rspec               # RSpec test failures only (60%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
rtk uv run <cmd>        # Compact uv project command output
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%). Format flags (-c, -l, -L, -o, -Z) run raw.
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->
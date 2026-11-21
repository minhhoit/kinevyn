# Auto-build a local catalog template from a YouTube URL when no template matches

Date: 2026-11-21

## Problem

Today, `skills/kinevyn/SKILL.md` routes a creation request purely on the user's
words: "turn a reference into a reusable template" picks `kinevyn-video-to-template`,
anything else that names a reference picks `kinevyn-recreate` (a one-off film,
never added to the catalog). There is no rule that reacts to a *catalog gap*:
if the user asks for a style with no match in `kinevyn_list_templates` and
supplies a YouTube URL, the system does not build a reusable template out of
it — it either recreates the one film and throws the rebuild away, or asks
the user to pick an existing template that doesn't fit.

`kinevyn-video-to-template` already does the real work (reads the whole
reference, rebuilds it as an editable HyperFrames project). The gap is
entirely in routing and in getting the result into the local catalog so it's
reusable afterward — there is no code today that adds a new id to
`library/templates/catalog/catalog.json` outside a manual, PR-reviewed
contribution.

(TubeLabHQ/youtube-research-skills was considered and rejected for this: it's
a YouTube channel-growth/marketing research toolkit behind a paid TubeLab MCP
account. Its only remotely relevant skill, `script-breakdown`, produces a
transcript-based text report — hook quote and beat table — with no visual or
motion output. It does not build a template and was not pursued further.)

## Goal

When a creation request has no catalog match and the user supplies a YouTube
URL: confirm once, build the template via the existing
`kinevyn-video-to-template` flow, register it into **this checkout's own
local** `library/templates/catalog/`, then continue to
`kinevyn-template-to-video` to produce the actual requested video. This is a
personal local addition, not a contribution to `rivyn-labs/kinevyn` — no PR,
no CI gate, no 11-locale requirement.

## Non-goals

- Publishing to the shared/public catalog (PR review, `templates:check`,
  `storage:check`, Git LFS budgets) — out of scope entirely.
- A new MCP tool for non-shell clients. This ships as Skill instructions that
  assume shell access (Claude Code, or any agent with a shell), matching how
  the user actually runs Kinevyn today. A dedicated `kinevyn_register_template`
  MCP tool is a possible future upgrade if a non-shell client ever needs this,
  not part of this change.
- Multi-locale content. Only the active locale (or English if unset) is
  populated in the new catalog entry's `locales` map.
- Any change to `kinevyn-video-to-template` itself — it is reused unmodified.

## Design

### 1. Trigger and confirmation

Add a row to `skills/kinevyn/SKILL.md`'s routing table: a request that names
a style/reference with no match in `kinevyn_list_templates` **and** includes
a YouTube URL does not fall through to `kinevyn-director` or `kinevyn-recreate`.
Instead, ask one confirmation — no catalog match, build a new template from
this link and use it, yes/no — before doing any work. "No" falls back to the
existing default (`kinevyn-recreate`, a one-off, nothing added to the
catalog). This question folds into the same single question batch
`kinevyn-recreate`/`kinevyn-video-to-template` already allow before starting
work; it does not add a second round-trip.

### 2. Build, register, produce

A new reference doc, `skills/kinevyn-video-to-template/references/register-local-catalog.md`,
linked from the new router row, walks the agent through:

1. Run `kinevyn-video-to-template` unchanged. It produces the native project
   (source/, assets, `TEMPLATE.md`) in its normal working location.
2. Pick a stable id: a slug derived from the video title plus a short hash,
   checked against the existing `templateIds` array for collisions (suffix
   and retry once on collision, then ask rather than looping).
3. Write `library/templates/catalog/<id>/template.json`: `entry.original.*`
   (title, summary, tags) derived from the video and the rebuild, `entry.files`/
   width/height from the built project, `entry.original.sourceUrl` set to the
   YouTube URL. Write `TEMPLATE.md` with the source link, rebuild notes, and
   a license caveat that only visual/motion structure was rebuilt — no
   footage or audio was copied verbatim. Copy the built `source/` tree in
   alongside.
4. Run the existing `npm run templates:manifest -- <id>` (`refreshManifest`
   in `scripts/template-library.ts`) to hash and size the local source files.
   No new script.
5. Append `<id>` to the local `catalog.json`'s `templateIds`, and populate
   only the active locale's slot in `localeContent` (English if the active
   locale is unset). Do not run `templates:check`/`storage:check` — those are
   CI gates for a PR against `main`, not required for a local personal
   addition, and would fail on the intentionally-incomplete locale coverage.
6. Re-read `kinevyn_list_templates` and confirm the new id appears before
   continuing — this is the self-check described below.
7. Hand off to `kinevyn-template-to-video` with the new id to produce the
   video the user actually asked for, applying their brief/brand as that
   skill already does for any existing template.

### 3. Error handling

- Reference unreachable or undecodable: report the specific blocker (same
  convention every other skill here uses), register nothing.
- Id collision after one retry: ask the user rather than looping.
- Any failure after step 2: write `template.json` only after `source/` and
  the manifest refresh both succeed, so a failed build never leaves a
  half-registered catalog entry. If `catalog.json` itself fails to parse or
  write, report it and leave the file untouched rather than guessing at a
  merge.

### 4. Self-check (no new code, so no unit tests)

Step 6 above is the test: the agent calls `kinevyn_list_templates` itself
and confirms the new id is actually listed before handing off to
`kinevyn-template-to-video`. This catches a malformed `catalog.json` or a
missed required field immediately, rather than silently producing a video
from a template nobody — including a later session — can find again.

## Open question for the implementation plan

`validateRecord()` in `scripts/template-library.ts` may require the
`locales` map to carry every locale key the catalog's declared locale list
expects. If so, the plan needs to decide whether to: populate a locale key
with content copied from the active locale (cheap, slightly redundant) or
skip calling `validateRecord` for this local-only path entirely (since
`templates:check`, the thing that normally calls it, is explicitly skipped
here already). This does not change the design above either way — it is a
one-line decision to confirm while writing the plan.

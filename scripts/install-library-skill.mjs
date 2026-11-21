import assert from 'node:assert/strict';
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, rename, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { validateMediaManifest } from '../shared/repository-media.ts';

const source = fileURLToPath(new URL('../library/skills/', import.meta.url));
// Frozen fingerprints identify only the retired, unmodified forwarding folders.
// Standalone installs have no ownership marker; never remove a folder by name alone.
const retired = {
  'kinevyn-brandkit': { name: 'brandkit', files: {
    'SKILL.md': 'baa4d65961044ca2270046e370612283d3506b8f4edd40d3389403f3b3f9b2d7',
    [path.join('agents', 'openai.yaml')]: '6e52c9f977f57f04230ed5d626813b089dee5bac66a415875c96b574ef849e66',
  } },
  'kinevyn-presenter-story': { name: 'presenter-story', files: {
    'SKILL.md': '0013c1a3b460aafc740313dcfa9fcb2655b5221ca951d482163de1ef623f9fdf',
    [path.join('agents', 'openai.yaml')]: '48c3e961a7d04c901bf8d8f00b2dd6fe36ee8ed24bbb6751d450d38e4cb9d292',
  } },
  'kinevyn-design-remix': { name: 'motion-design-remix', files: {
    'SKILL.md': 'cd3be67e615d05fa097166709ffabb932ab929cc685b852660c09f70da3f91ba',
    [path.join('agents', 'openai.yaml')]: '53ba8d5b90b65f9b163607acb68367c7f0355e7315175bb6ff2aad864c3cfe1e',
  } },
};
// Library Skills that never shipped a retired forwarding folder.
const current = ['kinevyn-ad-script', 'kinevyn-adaptive-layout', 'kinevyn-ai-assistant-tour', 'kinevyn-archive-collage', 'kinevyn-article-illustrations', 'kinevyn-aurora-gradient', 'kinevyn-before-after', 'kinevyn-bilingual-captions', 'kinevyn-bold-type-poster', 'kinevyn-bubble-field', 'kinevyn-caption-styling', 'kinevyn-card-carousel', 'kinevyn-cards-and-text', 'kinevyn-chalk-blueprint', 'kinevyn-cinematic-logo', 'kinevyn-clay-explainer', 'kinevyn-color-pop-poster', 'kinevyn-content-cover', 'kinevyn-coral-title-cards', 'kinevyn-corner-frames', 'kinevyn-dark-premium-poster', 'kinevyn-design-styles', 'kinevyn-doc-promo', 'kinevyn-echo-stack-type', 'kinevyn-edit-to-script', 'kinevyn-editorial-explainer', 'kinevyn-editorial-poster', 'kinevyn-editorial-webinar', 'kinevyn-electric-impact-type', 'kinevyn-felt-stop-motion', 'kinevyn-flat-beat', 'kinevyn-flat-card-explainer', 'kinevyn-flat-lay-product', 'kinevyn-folder-pop', 'kinevyn-footage-to-handpainted', 'kinevyn-giant-flip-type', 'kinevyn-glitch-logo-sting', 'kinevyn-growth-teardown', 'kinevyn-hand-drawn-explainer', 'kinevyn-hidden-feature-demo', 'kinevyn-highlighter-notes', 'kinevyn-in-hand-product', 'kinevyn-ink-ribbon', 'kinevyn-isometric-card-flight', 'kinevyn-juicy-splash-poster', 'kinevyn-light-shadow-product', 'kinevyn-liquid-blob', 'kinevyn-liquid-glass-logo', 'kinevyn-liquid-logo', 'kinevyn-livestream-clips', 'kinevyn-magnet-particles', 'kinevyn-manifesto-pop', 'kinevyn-monochrome-magazine', 'kinevyn-motion-graphic-placement', 'kinevyn-multi-clips-to-reels', 'kinevyn-multicam-edit', 'kinevyn-mystery-box-reveal', 'kinevyn-neon-outline-type', 'kinevyn-nova-intro', 'kinevyn-one-bit-dither', 'kinevyn-orange-unfiltered', 'kinevyn-paper-collage-explainer', 'kinevyn-paper-diorama', 'kinevyn-paper-map-journey', 'kinevyn-paper-stop-motion', 'kinevyn-pastel-flat-2d', 'kinevyn-pixel-art-explainer', 'kinevyn-pop-style', 'kinevyn-premium-halo', 'kinevyn-push-in-type', 'kinevyn-quantum-particles', 'kinevyn-red-pen-archive', 'kinevyn-relight-reveal', 'kinevyn-retro-flat-scene', 'kinevyn-retro-print-poster', 'kinevyn-ring-mask-reveal', 'kinevyn-runway-rebel', 'kinevyn-sale-carousel', 'kinevyn-sale-countdown', 'kinevyn-sale-promo', 'kinevyn-shortlist-shorts', 'kinevyn-shot-breakdown', 'kinevyn-shutter-bands', 'kinevyn-smooth-wipes', 'kinevyn-spec-sheet', 'kinevyn-splash-float-product', 'kinevyn-split-slot-type', 'kinevyn-step-by-step-tutorial', 'kinevyn-sticker-bounce', 'kinevyn-sticker-peel', 'kinevyn-storyboard-to-motion', 'kinevyn-storybook-myth', 'kinevyn-surreal-3d-poster', 'kinevyn-talking-head-recreation', 'kinevyn-time-freeze', 'kinevyn-translucent-glass', 'kinevyn-velocity-lines', 'kinevyn-website-launch', 'kinevyn-whiteboard-doodle', 'kinevyn-whiteboard-marker', 'kinevyn-wireframe-style'];
async function snapshot(directory, relative = '') {
  const files = {};
  for (const item of await readdir(path.join(directory, relative), { withFileTypes: true })) {
    const name = path.join(relative, item.name);
    assert(!item.isSymbolicLink(), 'Skill installation requires regular files: ' + name);
    if (item.isDirectory()) Object.assign(files, await snapshot(directory, name));
    else {
      assert(item.isFile(), 'Unsupported Skill entry: ' + name);
      const bytes = await readFile(path.join(directory, name));
      assert(!bytes.subarray(0, 128).toString().startsWith('version https://git-lfs.github.com/spec/v1'),
        'Skill media is not downloaded. Run git lfs pull --include="library/skills/**" --exclude="" before installing a Library Skill.');
      files[name] = createHash('sha256').update(bytes).digest('hex');
    }
  }
  return files;
}

// The destination is explicit; user-owned or different-version content is never overwritten.
export async function installLibrarySkill(name, destination) {
  assert(Object.hasOwn(retired, name) || current.includes(name), 'Unknown Library Skill: ' + name + '. Use an kinevyn-* Library Skill name.');
  const canonical = name;
  assert(destination, 'An explicit destination skills directory is required');
  const media = validateMediaManifest(JSON.parse(await readFile(new URL('../repository-media.json', import.meta.url), 'utf8')));
  for (const file of media.files.filter(file => file.path.startsWith('library/skills/' + canonical + '/'))) {
    const bytes = await readFile(new URL('../' + file.path, import.meta.url)).catch(() => {
      throw new Error('Optional Skill media is missing. Run npm run media:pull -- library/skills/' + canonical);
    });
    assert(bytes.length === file.bytes && createHash('sha256').update(bytes).digest('hex') === file.sha256, 'Optional Skill media does not match repository-media.json');
  }
  const directory = path.resolve(destination), names = [canonical];
  await mkdir(directory, { recursive: true });
  const missing = [];
  for (const skill of names) {
    const target = path.join(directory, skill), expected = await snapshot(path.join(source, skill));
    const present = await lstat(target).catch(error => { if (error.code !== 'ENOENT') throw error; });
    if (present) {
      assert(present.isDirectory() && !present.isSymbolicLink(), 'Skill destination must be a regular directory: ' + target);
      assert.deepEqual(await snapshot(target), expected, 'Existing Skill differs; preserve it and choose another destination: ' + target);
    } else missing.push(skill);
  }
  const legacy = retired[canonical] ?? null, legacyTarget = legacy && path.join(directory, legacy.name);
  const present = legacy && await lstat(legacyTarget).catch(error => { if (error.code !== 'ENOENT') throw error; });
  let removeLegacy = false;
  if (present?.isDirectory() && !present.isSymbolicLink()) {
    try { removeLegacy = isDeepStrictEqual(await snapshot(legacyTarget), legacy.files); }
    catch (error) { if (error.code !== 'ERR_ASSERTION') throw error; }
  }
  const staging = await mkdtemp(path.join(directory, '.kinevyn-install-'));
  const backup = path.join(staging, 'retired');
  let movedLegacy = false, preserveBackup = false;
  try {
    for (const skill of missing) await cp(path.join(source, skill), path.join(staging, skill), { recursive: true, force: false, errorOnExist: true });
    if (removeLegacy) { await rename(legacyTarget, backup); movedLegacy = true; }
    for (const skill of missing) await rename(path.join(staging, skill), path.join(directory, skill));
  } catch (error) {
    if (movedLegacy) {
      try { await rename(backup, legacyTarget); }
      catch (restoreError) {
        preserveBackup = true;
        throw new AggregateError([error, restoreError], 'Legacy Skill backup retained at ' + backup);
      }
    }
    throw error;
  } finally { if (!preserveBackup) await rm(staging, { recursive: true, force: true }); }
  return { canonical, entry: path.join(directory, canonical, 'SKILL.md'), installed: names,
    removedLegacy: removeLegacy ? [legacy.name] : [], preservedLegacy: present && !removeLegacy ? [legacy.name] : [] };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.equal(process.argv.length, 4, 'Usage: node scripts/install-library-skill.mjs <skill-name> <destination-skills-directory>');
  console.log(JSON.stringify(await installLibrarySkill(process.argv[2], process.argv[3])));
}

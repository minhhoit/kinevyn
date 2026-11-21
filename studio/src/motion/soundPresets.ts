import type { Model } from '../../../shared/gateway';
import { generationOptions } from '../../../shared/generation-options';
import { sceneExamples } from './sceneShowcase';

export interface SoundTag {
  id: string;
  label: string;
  /** Concise phrase appended to the prompt when selected. */
  phrase: string;
}

export interface SoundMusicRecipe {
  id: string;
  title: string;
  prompt: string;
  audio?: string;
  waveform?: readonly number[];
  durationSeconds?: number;
}

export interface SoundSfxStarter {
  id: string;
  title: string;
  prompt: string;
  durationSeconds: number;
  loop?: boolean;
}

export interface SoundSpeechScript {
  id: string;
  title: string;
  script: string;
}

export interface ParsedVoiceOption {
  value: string;
  name: string;
  detail: string;
  initials: string;
}

const welcomeExample = sceneExamples.music[0];

export const SOUND_MUSIC_TAGS: readonly SoundTag[] = [
  { id: 'soft-piano', label: 'Soft piano', phrase: 'soft piano' },
  { id: 'ambient', label: 'Ambient', phrase: 'cinematic ambient pads' },
  { id: 'minimal-synth', label: 'Minimal synth', phrase: 'minimal airy synths' },
  { id: 'upbeat', label: 'Upbeat', phrase: 'upbeat modern rhythm' },
  { id: 'acoustic', label: 'Acoustic', phrase: 'warm acoustic guitar' },
  { id: 'instrumental', label: 'Instrumental', phrase: 'instrumental, no vocals' },
];

export const SOUND_SFX_TAGS: readonly SoundTag[] = [
  { id: 'whoosh', label: 'Whoosh', phrase: 'smooth cinematic air whoosh' },
  { id: 'ui-click', label: 'UI click', phrase: 'crisp tactile glass UI click' },
  { id: 'impact', label: 'Impact', phrase: 'deep sub-bass logo impact' },
  { id: 'riser', label: 'Riser', phrase: 'building tension riser swell' },
  { id: 'foley', label: 'Foley', phrase: 'natural close-mic foley' },
  { id: 'ambience', label: 'Ambience', phrase: 'subtle stereo room ambience' },
];

export const SOUND_MUSIC_RECIPES: readonly SoundMusicRecipe[] = [
  {
    id: 'ambient-sunrise',
    title: 'Kinevyn welcome soundtrack',
    prompt: welcomeExample.prompt,
    audio: welcomeExample.audio,
    waveform: welcomeExample.waveform,
    durationSeconds: 37,
  },
  {
    id: 'product-launch',
    title: 'Product launch pulse',
    prompt: 'Sleek electronic track with pulsing analog bass, crisp percussion and a confident drop, instrumental.',
  },
  {
    id: 'cinematic-trailer',
    title: 'Cinematic trailer rise',
    prompt: 'Slow-building orchestral hybrid score with warm cello ostinatos, airy brass swells and a clean resolving chord.',
  },
  {
    id: 'podcast-intro',
    title: 'Minimal studio intro',
    prompt: 'Warm lo-fi electric piano chords with gentle brushed drums and relaxed pacing, instrumental.',
  },
];

export const SOUND_SFX_STARTERS: readonly SoundSfxStarter[] = [
  {
    id: 'ui-confirm',
    title: 'Glass UI confirm',
    prompt: 'Crisp glassy UI confirmation tap with a soft harmonic shimmer and clean decay.',
    durationSeconds: 2,
  },
  {
    id: 'cinema-whoosh',
    title: 'Cinema transition whoosh',
    prompt: 'Fast smooth stereo air whoosh for a motion-graphics scene transition, clean high end.',
    durationSeconds: 3,
  },
  {
    id: 'logo-impact',
    title: 'Logo sub-bass hit',
    prompt: 'Tight cinematic sub-bass impact with subtle metallic sheen for a brand logo reveal.',
    durationSeconds: 2,
  },
  {
    id: 'tension-riser',
    title: 'Tension riser',
    prompt: 'Gradual synth and percussive tension riser building smoothly to a sharp cut.',
    durationSeconds: 5,
  },
  {
    id: 'studio-rain',
    title: 'Rain on studio window',
    prompt: 'Soft steady rainfall against glass with warm distant room ambience, seamless background texture.',
    durationSeconds: 10,
    loop: true,
  },
];

export const SOUND_SPEECH_SCRIPTS: readonly SoundSpeechScript[] = [
  {
    id: 'launch-opener',
    title: 'Launch opener',
    script: sceneExamples.speech[0].prompt,
  },
  {
    id: 'product-walkthrough',
    title: 'Product demo',
    script: 'With one workspace, your script, motion design and soundtrack stay in sync from the very first draft to the final cut.',
  },
  {
    id: 'short-hook',
    title: 'Short hook',
    script: 'Here is how a simple screen recording turns into a studio-grade launch film in under two minutes.',
  },
];

export const DURATION_PRESETS = [15, 30, 60] as const;
export const SFX_DURATION_PRESETS = [2, 5, 10] as const;
export const SPEED_PRESETS = [0.8, 1, 1.2] as const;

/** Normalize a phrase for idempotent prompt-tag detection across locales. */
function normalizeSegment(value: string): string {
  return value.trim().toLowerCase();
}

export function hasPromptTag(prompt: string, tagText: string): boolean {
  const needle = normalizeSegment(tagText);
  if (!needle) return false;
  return prompt
    .split(/[,，、;\n]+/)
    .map(normalizeSegment)
    .some(segment => segment === needle || segment.includes(needle));
}

export function togglePromptTag(prompt: string, tagText: string, cjkSeparator = false): string {
  const cleanTag = tagText.trim();
  if (!cleanTag) return prompt;
  const trimmed = prompt.trim();
  if (!trimmed) return cleanTag;
  const needle = normalizeSegment(cleanTag);
  const parts = trimmed.split(/[,，、;]+/).map(part => part.trim()).filter(Boolean);
  const existingIndex = parts.findIndex(part => normalizeSegment(part) === needle);
  const joiner = cjkSeparator ? '，' : ', ';
  if (existingIndex >= 0) {
    parts.splice(existingIndex, 1);
    return parts.join(joiner);
  }
  const hasTrailingPunctuation = /[,.!?;，。！？；、]$/.test(trimmed);
  return hasTrailingPunctuation ? `${trimmed} ${cleanTag}` : `${trimmed}${joiner}${cleanTag}`;
}

/** Estimate natural narration length in seconds for mixed CJK and Latin scripts, adjusted for speech speed. */
export function estimateSpeechSeconds(text: string, speed = 1): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const cjkChars = (trimmed.match(/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/g) ?? []).length;
  const latinWords = trimmed
    .replace(/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  const effectiveSpeed = Number.isFinite(speed) && speed > 0 ? Math.max(0.25, Math.min(4, speed)) : 1;
  const seconds = (cjkChars / 4.2 + latinWords / 2.5) / effectiveSpeed;
  return Math.max(1, Math.round(seconds));
}

/** Parse gateway voice choices like "Rachel · Female" or "af_heart" into structured card data. */
export function parseVoiceChoice(choice: { value: string | number; label: string }): ParsedVoiceOption {
  const value = String(choice.value);
  const raw = choice.label.trim();
  if (raw.includes('·')) {
    const [namePart, ...rest] = raw.split('·');
    const name = namePart.trim();
    const detail = rest.join('·').trim();
    return { value, name, detail, initials: name.slice(0, 2).toUpperCase() };
  }
  const kokoro = raw.match(/^([ab])([fm])_(.+)$/i);
  if (kokoro) {
    const gender = kokoro[2].toLowerCase() === 'f' ? 'Female' : 'Male';
    const region = kokoro[1].toLowerCase() === 'b' ? 'British' : 'American';
    const name = kokoro[3].charAt(0).toUpperCase() + kokoro[3].slice(1);
    return { value, name, detail: `${region} · ${gender}`, initials: name.slice(0, 2).toUpperCase() };
  }
  return { value, name: raw || value, detail: '', initials: (raw || value).slice(0, 2).toUpperCase() };
}

/** Resolve a readable voice display name from a saved asset version's parameters and model catalogue. */
export function resolveSavedVoiceName(
  voiceValue: unknown,
  modelId: string | undefined,
  models: readonly Model[] | undefined,
  useModelDefault = false,
): string | undefined {
  const matched = modelId ? models?.find(model => model.id === modelId) : undefined;
  const fields = matched ? (matched.generationOptions ?? generationOptions(matched))?.fields ?? [] : [];
  const voiceField = fields.find(field => field.key === 'voice');
  const effectiveValue = typeof voiceValue === 'string' && voiceValue.trim()
    ? voiceValue
    : useModelDefault
      ? (matched?.defaults?.voice ?? voiceField?.default)
      : undefined;
  if (typeof effectiveValue !== 'string' || !effectiveValue.trim()) return undefined;
  const choice = voiceField?.choices?.find(item => String(item.value) === effectiveValue);
  if (choice) return parseVoiceChoice(choice).name;
  const kokoro = effectiveValue.match(/^([ab])([fm])_(.+)$/i);
  if (kokoro) return kokoro[3].charAt(0).toUpperCase() + kokoro[3].slice(1);
  return undefined;
}

/** Deterministic musical silhouette for saved audio assets without decoding every file upfront. */
export function deterministicWaveform(seed: string, barCount = 44): number[] {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const bars: number[] = [];
  for (let i = 0; i < barCount; i++) {
    hash ^= hash << 13;
    hash ^= hash >>> 17;
    hash ^= hash << 5;
    const norm = ((hash >>> 0) % 1000) / 1000;
    const pos = i / Math.max(1, barCount - 1);
    const edge = Math.sin(Math.PI * Math.min(1, Math.max(0.08, pos)));
    const swell = 0.65 + 0.35 * Math.sin(pos * Math.PI * 3.5 + (seed.charCodeAt(0) % 5));
    const height = Math.round(14 + (0.28 + norm * 0.72) * edge * swell * 82);
    bars.push(Math.max(12, Math.min(96, height)));
  }
  return bars;
}

/** Downsample or preserve a real RMS waveform to the requested bar count. */
export function resampleWaveform(waveform: readonly number[], targetBars: number): number[] {
  if (!waveform.length) return [];
  if (waveform.length <= targetBars) return [...waveform];
  const step = waveform.length / targetBars;
  const output: number[] = [];
  for (let i = 0; i < targetBars; i++) {
    const start = Math.floor(i * step);
    const end = Math.max(start + 1, Math.floor((i + 1) * step));
    let sum = 0;
    for (let j = start; j < end && j < waveform.length; j++) sum += waveform[j];
    output.push(Math.max(10, Math.round(sum / (end - start))));
  }
  return output;
}

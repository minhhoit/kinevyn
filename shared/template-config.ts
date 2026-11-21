import { existsSync, readFileSync } from 'node:fs';

const defaults = JSON.parse(readFileSync(new URL('./template-config.json', import.meta.url), 'utf8'));
export type TemplateSource = 'repository' | 'hosted' | 'cms';

export function packageTemplateConfig(environment = 'prod', source: TemplateSource = 'cms') {
  if (environment !== 'dev' && environment !== 'prod') throw new Error('Template environment must be dev or prod');
  return { ...defaults, environment, source } as { environment: 'dev' | 'prod'; resourceId: string; locale: string; source: TemplateSource };
}

/**
 * Base origin for the hosted/cms template catalog and the npm-published install guide.
 * Unset by default: this checkout's own "repository" source never calls it, and no
 * fork-owned replacement is configured yet. Set MOTION_RELEASES_ORIGIN once this
 * fork has its own release hosting, rather than defaulting to upstream infrastructure.
 */
export function releasesOrigin(): string | undefined {
  return process.env.MOTION_RELEASES_ORIGIN || undefined;
}

export function templateConfig(): ReturnType<typeof packageTemplateConfig> {
  const source = process.env.MOTION_TEMPLATE_SOURCE ?? (existsSync(new URL('../library/templates/catalog/catalog.json', import.meta.url)) ? 'repository' : (defaults.source ?? 'cms'));
  if (source !== 'repository' && source !== 'hosted' && source !== 'cms') throw new Error('MOTION_TEMPLATE_SOURCE must be repository, hosted or cms');
  return {
    ...packageTemplateConfig(process.env.MOTION_TEMPLATE_ENV ?? defaults.environment, source),
    resourceId: process.env.MOTION_TEMPLATE_RESOURCE_ID ?? defaults.resourceId,
    locale: process.env.MOTION_TEMPLATE_LOCALE ?? defaults.locale,
    source,
  };
}

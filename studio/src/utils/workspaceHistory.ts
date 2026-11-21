export const WORKSPACE_LOCATION_CHANGED = 'motion:workspace-location';
const entryKey = 'kinevynHistoryIndex';
const sessionKey = 'kinevynHistorySession';
const sourceKey = 'kinevynHistorySource';
const settingsSourceKey = 'kinevynSettingsSource';

export type WorkspaceSource = { href: string; index: number };

export function workspaceHistoryIndex(): number | null {
  const value = history.state?.[entryKey];
  return Number.isSafeInteger(value) && value >= 0 ? value : null;
}

export function workspaceHistorySession(): string | null {
  const value = history.state?.[sessionKey];
  return typeof value === 'string' && value ? value : null;
}

export function initializeWorkspaceHistory() {
  if (workspaceHistoryIndex() === null || workspaceHistorySession() === null) {
    const session = crypto.randomUUID();
    history.replaceState({ ...history.state, [entryKey]: 0, [sessionKey]: session, [sourceKey]: null, [settingsSourceKey]: null }, '', location.href);
  }
}

function readWorkspaceSource(key: string): WorkspaceSource | null {
  const source = history.state?.[key];
  const index = workspaceHistoryIndex();
  if (!source || index === null || !Number.isSafeInteger(source.index) || source.index < 0 || source.index >= index) return null;
  if (typeof source.href !== 'string' || !source.href.startsWith(location.origin + '/')) return null;
  return source;
}

export function workspaceHistorySource() { return readWorkspaceSource(sourceKey); }
export function workspaceSettingsSource() { return readWorkspaceSource(settingsSourceKey); }

export function restoreWorkspaceSource(source: WorkspaceSource): boolean {
  const index = workspaceHistoryIndex();
  if (index === null || index <= source.index) return false;
  history.go(source.index - index);
  return true;
}

/** Keep history identity when the editor updates its hash or the shell resolves a project. */
export function writeWorkspaceHistory(target: string | URL, replace = false, sources?: { page: WorkspaceSource | null; settings: WorkspaceSource | null }) {
  const url = new URL(target, location.href);
  if (url.origin !== location.origin) throw new Error('Workspace navigation must stay on this origin');
  initializeWorkspaceHistory();
  const index = workspaceHistoryIndex()!;
  const session = workspaceHistorySession()!;
  const sourceState = sources ? { [sourceKey]: sources.page, [settingsSourceKey]: sources.settings } : {};
  if (url.href === location.href || replace) {
    if (url.href !== location.href || Object.entries(sourceState).some(([key, value]) => history.state?.[key] !== value)) {
      history.replaceState({ ...history.state, ...sourceState }, '', url);
    }
  } else {
    history.pushState({ [entryKey]: index + 1, [sessionKey]: session, ...sourceState }, '', url);
  }
  window.dispatchEvent(new Event(WORKSPACE_LOCATION_CHANGED));
}

// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest';
import { initializeWorkspaceHistory, workspaceHistoryIndex, workspaceHistorySession, writeWorkspaceHistory } from './workspaceHistory';

afterEach(() => { vi.restoreAllMocks(); history.replaceState(null, '', '/'); });

it('retains history identity through editor hash writes and deduplicates the current destination', () => {
  history.replaceState({ integration: 'retained' }, '', '/?page=mcp&project=project#project/project');
  initializeWorkspaceHistory();
  const start = workspaceHistoryIndex();
  writeWorkspaceHistory('#project/project?v=1&t=8', true);
  expect(workspaceHistoryIndex()).toBe(start);
  expect(history.state.integration).toBe('retained');
  expect(location.search).toBe('?page=mcp&project=project');
  const push = vi.spyOn(history, 'pushState');
  writeWorkspaceHistory(location.href);
  expect(push).not.toHaveBeenCalled();
  writeWorkspaceHistory('/?page=settings&section=general&project=project#project/project?t=8');
  expect(workspaceHistoryIndex()).toBe(start! + 1);
  expect(push).toHaveBeenCalledOnce();
});

it('rejects cross-origin navigation before changing history', () => {
  const source = location.href;
  expect(() => writeWorkspaceHistory('https://example.com/')).toThrow('this origin');
  expect(location.href).toBe(source);
});

it('starts a copied or legacy URL with no product history', () => {
  history.replaceState({ kinevynHistoryIndex: 8, integration: true }, '', '/?page=settings&section=about');
  initializeWorkspaceHistory();
  expect(workspaceHistorySession()).toBeTruthy();
  expect(workspaceHistoryIndex()).toBe(0);
  expect(history.state.integration).toBe(true);
});

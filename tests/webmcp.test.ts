import test from 'node:test';
import assert from 'node:assert/strict';
import { phase1Tools } from '../shared/phase1-tools.ts';
import { buildKinevynWebMcpTools } from '../shared/webmcp-tools.ts';
import { fixture } from './fixtures.ts';
import { transport } from './http.ts';
import { pluginRoot } from '../hyperframes.ts';

const projectId = '11111111-1111-1111-1111-111111111111';
const revision = 'a'.repeat(64);
const inputs: Record<string, object> = {
  kinevyn_project_archive: { action: 'export', requestId: 'zip', projectIds: [projectId] },
  kinevyn_manage_project: { action: 'info', projectId },
  kinevyn_assets_use: { action: 'list' },
  kinevyn_assets: { action: 'list' },
  kinevyn_media_use: { action: 'inspect' },
  kinevyn_list_templates: {},
  kinevyn_get_template: { templateId: 'decision-tree' },
  kinevyn_list_skills: {},
  kinevyn_get_skill: { skillId: 'kinevyn-design-remix' },
  kinevyn_create_project: { requestId: 'create', projectType: 'natural_language', title: 'WebMCP', requirements: 'Silent test' },
  kinevyn_open_preview: { projectId },
  kinevyn_import_assets: { projectId, requestId: 'import', items: [{ itemId: 'one', sourcePath: '/tmp/asset.png' }] },
  kinevyn_get_project: { projectId },
  kinevyn_edit_project: { projectId, requestId: 'edit', expectedRevision: revision, expectedVersionId: 'v1', files: [] },
  kinevyn_export_request: { projectId, requestId: 'export', expectedRevision: revision, versionId: 'v1' },
  kinevyn_list_versions: { projectId },
  kinevyn_restore_version: { projectId, requestId: 'restore', versionId: 'v1', expectedRevision: revision, expectedVersionId: 'v2' },
  kinevyn_export_cancel: { projectId, requestId: 'cancel', jobId: 'job' },
  kinevyn_design_catalog: { action: 'list_scenarios' },
  kinevyn_design_project: { action: 'list' },
  kinevyn_design_edit: { action: 'list_versions', projectId },
  kinevyn_design_comments: { action: 'list', projectId },
};

test('all twenty-two registered domain names reuse public schemas and forward unchanged inputs and results', async () => {
  const calls: { url: string; init?: RequestInit }[] = [];
  const result = { projectId, previewHandoff: { state: 'pending' }, nested: { value: 42 } };
  const tools = buildKinevynWebMcpTools(async (url, init) => { calls.push({ url, init }); return Response.json(result); });
  assert.equal(tools.length, 22);
  assert.deepEqual(tools.map(tool => tool.name).sort(), Object.keys(inputs).sort());
  for (const [i, tool] of tools.entries()) {
    assert.equal(tool.inputSchema, phase1Tools[i].inputSchema);
    assert.equal(tool.title, phase1Tools[i].title);
    assert.ok(tool.description.startsWith(phase1Tools[i].description));
    assert.equal(tool.annotations.readOnlyHint, phase1Tools[i].annotations.readOnlyHint);
    const controller = new AbortController();
    assert.deepEqual(await tool.execute(inputs[tool.name], { signal: controller.signal }), result);
    assert.equal(calls[i].url, '/motion-api/phase1/call');
    assert.equal(calls[i].init?.method, 'POST');
    assert.equal(calls[i].init?.signal, controller.signal);
    assert.deepEqual(JSON.parse(String(calls[i].init?.body)), { name: tool.name, arguments: inputs[tool.name] });
    assert.equal(new Headers(calls[i].init?.headers).get('content-type'), 'application/json');
    assert.equal(new Headers(calls[i].init?.headers).has('authorization'), false);
  }
  // The existing browser polyfill invokes execute with no options object.
  assert.deepEqual(await tools[0].execute(inputs[tools[0].name]), result);
});

test('invalid inputs and pre-dispatch cancellation never reach the service', async () => {
  let calls = 0;
  const tools = buildKinevynWebMcpTools(async () => { calls++; return Response.json({}); });
  for (const tool of tools) {
    const result = await tool.execute({ unknown: true });
    assert.equal(result.error.code, 'INVALID_ARGUMENT');
    assert.equal(result.error.applied, false);
  }
  const controller = new AbortController(); controller.abort();
  const aborted = await tools[0].execute(inputs[tools[0].name], { signal: controller.signal });
  assert.equal(aborted.error.code, 'ABORTED');
  assert.equal(aborted.error.applied, false);
  assert.equal(calls, 0);
});

test('service refusals, lost replies and cancellation resolve with actionable errors without retries', async () => {
  for (const [request, code, applied] of [
    [async () => Response.json({ error: 'VERSION_CONFLICT: read the current version', applied: false }, { status: 400 }), 'VERSION_CONFLICT', false],
    [async () => Response.json({ error: 'REQUEST_STATE_UNKNOWN: read first', applied: 'unknown' }, { status: 400 }), 'REQUEST_STATE_UNKNOWN', 'unknown'],
    [async () => { throw new TypeError('Connection lost'); }, 'WEBMCP_TRANSPORT_ERROR', 'unknown'],
    [async () => new Response('not JSON', { status: 502 }), 'WEBMCP_TRANSPORT_ERROR', 'unknown'],
  ] as const) {
    let calls = 0;
    const tool = buildKinevynWebMcpTools(async () => { calls++; return request(); }).find(tool => tool.name === 'kinevyn_edit_project')!;
    const result = await tool.execute(inputs[tool.name]);
    assert.equal(result.isError, true); assert.equal(result.error.code, code); assert.equal(result.error.applied, applied);
    assert.equal(calls, 1);
  }
  const controller = new AbortController();
  const tool = buildKinevynWebMcpTools(async () => { controller.abort(); throw new DOMException('Cancelled', 'AbortError'); })[0];
  const result = await tool.execute(inputs[tool.name], { signal: controller.signal });
  assert.equal(result.error.code, 'ABORTED'); assert.equal(result.error.applied, 'unknown');
  const unavailable = buildKinevynWebMcpTools(async () => Response.json({ error: 'Prepare the runtime',
    code: 'NATIVE_RUNTIME_NOT_READY', applied: false, runtime: { components: ['ffmpeg'] } }, { status: 409 }))[0];
  const refused = await unavailable.execute(inputs[unavailable.name]);
  assert.equal(refused.error.code, 'NATIVE_RUNTIME_NOT_READY'); assert.equal(refused.error.applied, false);
  assert.deepEqual(refused.runtime, { components: ['ffmpeg'] });
});

test('WebMCP calls share HTTP project history, request deduplication and stale-write protection', () => fixture(async store => {
  const request = transport(store, { studio: null, runtimeRoot: pluginRoot });
  const tools = buildKinevynWebMcpTools(request);
  const call = async (name: string, args: object) => tools.find(tool => tool.name === name)!.execute(args);
  const created = await call('kinevyn_create_project', inputs.kinevyn_create_project);
  assert.equal(created.filmComplete, false);
  assert.equal((await call('kinevyn_create_project', inputs.kinevyn_create_project)).projectId, created.projectId);
  const ordinaryRead = await (await request('/motion-api/phase1/call', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
    name: 'kinevyn_get_project', arguments: { projectId: created.projectId },
  }) })).json();
  assert.equal(ordinaryRead.revision, created.revision);
  const args = { projectId: created.projectId, requestId: 'web-edit', expectedRevision: created.revision,
    expectedVersionId: created.version.versionId, files: [{ path: 'note.txt', content: 'Shared service' }] };
  const saved = await call('kinevyn_edit_project', args);
  assert.equal(saved.changed, true);
  assert.equal((await call('kinevyn_edit_project', args)).replayed, true);
  const stale = await call('kinevyn_edit_project', { ...args, requestId: 'stale', files: [{ path: 'note.txt', content: 'Lost update' }] });
  assert.equal(stale.isError, true); assert.equal(stale.error.code, 'VERSION_CONFLICT');
  const current = await call('kinevyn_get_project', { projectId: created.projectId, file: { path: 'note.txt' } });
  assert.equal(current.file.content, 'Shared service'); assert.equal(current.revision, saved.revision);
  const restored = await call('kinevyn_restore_version', { projectId: created.projectId, requestId: 'restore',
    versionId: created.version.versionId, expectedRevision: saved.revision, expectedVersionId: saved.version.versionId });
  assert.equal(restored.version.versionNumber, 3);
  const history = await call('kinevyn_list_versions', { projectId: created.projectId });
  assert.equal(history.versions.length, 3);
  assert.ok(history.versions.some((v: any) => v.versionId === saved.version.versionId));
}, false));

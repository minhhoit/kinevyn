# Retained nested-source fixture

Two nested source files intentionally author the same `id` and `data-hf-id` for their headline.
The fixture remains available for investigating source-safe element handles returned by
`kinevyn_studio_look` and checking that source edits preserve sibling compositions.

The active `studio/tests/e2e/webmcp-edit-loop.mjs` runner creates its own isolated
Kinevyn project and edits source through `kinevyn_get_project` and
`kinevyn_edit_project`; it no longer copies or symlinks this fixture.
Atomic Studio content-writing tools are not registered through WebMCP.

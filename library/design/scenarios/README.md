# Design Studio scenario guides

Each scenario guide adapts Open Design's task profiles to Kinevyn's MCP-driven workflow (where external coding Agents generate and revise HTML projects via `kinevyn_design_*` tools and Design Studio renders, annotates, versions and exports them).

## Open Design CLI → Kinevyn MCP mapping

| Open Design reference | Kinevyn MCP equivalent |
| --- | --- |
| `od list_projects` / `create_project` / `get_project` / `delete_project` | `kinevyn_design_project` (`list`, `create`, `get`, `rename`, `duplicate`, `trash`, `restore`, `delete`, `open`, `open_in`, `export`, `import`) |
| `od write_file` / `get_file` / file versions | `kinevyn_design_edit` (`read_file`, `write`, `list_versions`, `restore_version`) |
| `od comment list/create/update` | `kinevyn_design_comments` (`list`, `create`, `update`, `delete`) |
| `od list_skills` / design systems / templates / craft | `kinevyn_design_catalog` (`list_scenarios`, `list_templates`, `get_template`, `list_skills`, `get_skill`, `list_design_systems`, `get_design_system`, `get_craft`) |
| `od media generate` | `kinevyn_media_use` + `kinevyn_assets_use` |
| `$OD_PROJECT_DIR` | Design project files managed via `kinevyn_design_edit` |

## Scenarios

- [prototype.md](prototype.md) — interactive web and app prototypes
- [deck.md](deck.md) — 16:9 HTML slide decks with speaker notes and deck host protocol
- [document.md](document.md) — reports, resumes and print-ready documents
- [web-clone.md](web-clone.md) — responsive HTML rebuilds from references
- [live-artifact.md](live-artifact.md) — data-backed dashboards reading `data.json`
- [webgl.md](webgl.md) — WebGL2 / shader interactive experiences

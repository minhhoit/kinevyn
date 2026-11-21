# Design Systems, Skills and Craft Guides

Kinevyn bundles the Design Studio library under `library/design/` and exposes it through `kinevyn_design_catalog`.

- **Design systems:** call `kinevyn_design_catalog` (`action="list_design_systems"`, optional `q` or `category`), then `action="get_design_system"` with `id` to read `DESIGN.md` and `tokens.css`. Passing `designSystemId` to `kinevyn_design_project` (`action="create"`) automatically writes `DESIGN.md` and `tokens.css` into the new project.
- **Starter templates:** call `action="list_templates"` (optional `scenario`, `q`) and pass `templateId` to `kinevyn_design_project` (`action="create"`) to start from an existing HTML template.
- **Design Skills:** call `action="list_skills"` and `action="get_skill"` (`id`, optional `referencePath`) for specialized patterns (dashboards, editorial decks, typography, data visualization). When a library skill mentions legacy Open Design CLI commands (`od ...`), translate them to `kinevyn_design_catalog`, `kinevyn_design_project`, `kinevyn_design_edit`, `kinevyn_design_comments` or `kinevyn_assets_use`.
- **Craft rules:** call `action="get_craft"` (no `id` to list; with `id` to read) for accessibility, typography hierarchy, color, animation discipline, form validation, state coverage and RTL guidance.

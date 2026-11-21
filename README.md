<p align="center"><img src="docs/readme/kinevyn-logo.svg" width="420" alt="Kinevyn"></p>

<p align="center"><strong>The open-source Claude Motion &amp; CapCut alternative</strong></p>

<p align="center">
  <picture>
    <source type="image/webp" srcset="docs/readme/capcut-claude-motion-cover.webp">
    <source media="(max-width: 600px)" srcset="https://releases.open-design.ai/open-motion/media/sha256/730e1d6235820d39ba8adde42810d1165377992136a3b20290ad5d504abb527b.jpg">
    <img src="https://releases.open-design.ai/open-motion/media/sha256/730e1d6235820d39ba8adde42810d1165377992136a3b20290ad5d504abb527b.jpg" width="100%" alt="Kinevyn — the open-source Claude Motion and CapCut alternative. Dan Martell’s original and an Kinevyn remake with Riya appear beside each other above the editable Studio timeline.">
  </picture>
</p>

<p align="center">
  <a href="https://github.com/rivyn-labs/kinevyn"><img src="docs/readme/badges/stars.svg" alt="GitHub Stars · 9.5k (2026-11-09)"></a>
  <a href="package.json"><img src="docs/readme/badges/node.svg" alt="Node.js 22.18+"></a>
  <a href="LICENSE"><img src="docs/readme/badges/license.svg" alt="Apache 2.0 license"></a>
</p>

<p align="center">
  <a href="https://discord.com/invite/M7NnHS9gNa"><img src="docs/readme/badges/discord.svg" alt="Join the Kinevyn Discord" /></a>
  <a href="https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=b6cs46dc-acb2-48ed-941d-c45642ead841"><img src="docs/readme/badges/feishu.svg" alt="Join the Kinevyn Feishu group" /></a>
</p>

<p align="center"><a href="#quick-start">Install</a> · <a href="#agent-wall">Agents</a> · <a href="#showcase">Use cases &amp; remakes</a> · <a href="#features">Why Kinevyn</a> · <a href="#technical-guide">Setup & architecture</a> · <a href="#community">Community</a></p>

<div align="center">

**English** · [简体中文](docs/README.zh-CN.md) · [日本語](docs/README.ja.md)

</div>

# Kinevyn

Kinevyn is a **full-stack agentic video** studio and an **open-source alternative to Claude Motion and CapCut**. Upload a reference video or paste a social video link to **recreate it with your own brand kit and copy**.

- 🎬 **Full-stack video recreation.** Code video with HTML. Your agent breaks down the reference, rebuilds its shots and transitions, and generates missing assets. Edit the timing in Studio and render an MP4 from the same project.
- 🔑 **BYOA — Bring Your Own Agent. BYOK — Bring Your Own Keys.** Kinevyn is free and open source. Recreate videos in [your local agent](#agent-wall) with your own API keys. Supported agents include Claude Code, Codex, and WorkBuddy.
- 🧩 Kinevyn introduces **Motion.md**, a Markdown format for shot order, timing and transitions. Use it to share how a brand film works, shot by shot.
- 🎛️ **Images, video, music and voice.** Create artwork with GPT Image 2.6, add a shot with Seedance 2.5, score it with Suno and narrate it with Eleven v4. [Explore the models and providers](#model-wall).

<a id="快速开始"></a> <a id="quick-start"></a>

### Install from ChatGPT Marketplace

**One-click installation. No manual configuration required.** Once installed, create motion videos from scratch, recreate reference videos, or start from a template—all in your conversation.

**[Install Kinevyn in ChatGPT →](https://chatgpt.com/plugins/plugins_6a742d13e88481919b42002864b1bb26)**

<a id="start-in-codex"></a>

### Install in your agent

Install the main Skill with the [Skills CLI](https://github.com/vercel-labs/skills):

```sh
npx skills add rivyn-labs/kinevyn --skill kinevyn
```

Then ask your agent: **Use Kinevyn to install and connect the local Studio and MCP, then help me make a video.** The Skill completes the source setup below when needed and reuses an existing workspace. Installing the Skill alone copies instructions; it does not yet install Studio or connect MCP.

Copy this instruction into your local agent to set up Kinevyn from source:

```text
Read https://github.com/rivyn-labs/kinevyn/blob/main/docs/install.md and follow the instructions to install and connect Kinevyn in the current agent.
```

After setup, the agent opens the local template library and shows the welcome followed by three project-preview cards in a self-contained HTML document. Each installation samples three distinct entries from the curated pool of four. The complete silent previews and posters are bundled, so this display does not wait for native MCP reload or fetch remote reference films. Native original-reference playback remains available separately and requires internet access. The library opens once using the opening tool's result, with no extra page or playback audit. An opening failure is reported with a usable link and does not invalidate installation. Automatic current-chat MCP activation is assessed independently. Preview a card, choose **Recreate template**, then send your brief to start creating. [Source installation guide](docs/install.md) · [Onboarding selection](docs/install.md#maintained-recommendation-selection)

### Install the published npm app (optional)

Source setup above remains the default for repository installation. To explicitly choose the published application with prebuilt Studio and its configured online catalog, copy this instruction into your local agent:

```text
Read https://releases.open-design.ai/motion and follow the instructions to install and connect the published npm application in the current agent.
```

[Published application installation and channel selection](docs/install.md). Published versions can lag behind this checkout.

### Run the repository locally

Use Git, npm and Node.js 26.11.1:

```sh
git -c filter.lfs.process= -c filter.lfs.smudge= -c filter.lfs.required=false clone --depth 1 --single-branch --branch main https://github.com/rivyn-labs/kinevyn.git
cd kinevyn
npm ci
npm run build:studio
npm start
```

Open the actual `studioUrl` or `previewUrl` printed at startup, then choose **Template library**. Studio and MCP read the templates in this checkout. To connect your agent to this same copy, follow [source setup and MCP configuration](#agent-setup). [Clone size and optional media](docs/repository-storage.md)


### Start from an existing project

Import a **HyperFrames project ZIP** into Kinevyn to continue editing its composition and local assets. Compress the project folder, open **All projects → Import projects**, then select the imported copy to edit in Studio or with your Agent. Import creates an independent copy and requires a supported native project structure.

[Step-by-step import guide, required files and compatibility](docs/project-archives.md#import-from-hyperframes)

<a id="agent-wall"></a>

**22 local agents** · [Choose your agent](#choose-agent)

<p align="center"><a href="#choose-agent"><picture><source media="(max-width: 600px)" srcset="docs/readme/agents/local-agents.mobile.png"><img src="docs/readme/agents/local-agents.png" width="100%" alt="WorkBuddy, Codex CLI, Claude Code, OpenCode, Hermes, Antigravity, Gemini CLI, Grok Build, Kimi CLI, Cursor Agent, Qwen Code, Qoder CLI, GitHub Copilot, Pi, Kiro CLI, Kilo, Mistral Vibe, DeepSeek TUI, Reasonix, Aider, Devin, Trae CLI"></picture></a></p>

<a id="showcase"></a> <a id="brand-before-after"></a> <a id="what-can-you-make"></a>
<a id="use-cases-and-remake-examples"></a>

## 🎞️ Use cases and remake examples

Kinevyn recreates product demos, brand films, explainers, data stories and talking-head videos from a reference clip, in your own brand kit.

**[Browse the full template library →](https://open-design.ai/templates/)** — full videos, Motion.md and recreation instructions.

<a id="features"></a>
<a id="why-kinevyn"></a>

## ✨ Why Kinevyn

<a id="what-is-kinevyn"></a> <a id="kinevyn-是什么"></a> <a id="video-is-code"></a>

### 1. A full-stack agentic video studio

**Code video with HTML.** Kinevyn uses HTML, CSS and JavaScript to describe scenes, typography, layout, transitions and timing. Recorded footage, generated clips, images, music and voice-over become media inside the composition. The same project opens in Studio and renders to MP4.

![Your local agent, optional media-model accounts and creative resources feed a workflow of understanding the reference, coding scenes, generating missing media, editing and rendering MP4 with reusable source.](docs/readme/diagrams/creation-stack.svg)

**Write it. Watch it. Change it. Render it.** Ask your agent to replace the product, tighten the hook, add a presenter, change the captions or try another ending. It edits the project source; you review the result in the visual editor. Local MCP clients use the project tools, while agents with shell access can follow the Skills and pinned CLI workflow. [Agent setup](#agent-setup) · [Native composition guide](skills/kinevyn-production/references/native.md) · [Example HTML project](template-library/product-promo/index.html)

If historical media are unavailable, an Agent restore is refused before changing the project. The editor shows a dismissible error with the affected file paths and confirms that the current project is unchanged.

<a id="studio-in-use"></a>

<img src="docs/readme/live-product/editor.en.jpg" width="100%" alt="The sample project in Studio with its compositions, video preview, scene timeline and audio waveform.">

Review your video, arrange clips and export from the same Studio workspace.

#### What you can change in Studio

| In the Studio | What you can do today |
| --- | --- |
| **Story and timeline** | Import and arrange media; have the agent trim, reorder and revise against a script or confirmed timecodes |
| **Motion and captions** | Author animated type, transitions, callouts, charts and captions around your content |
| **Media and sound** | Import your material and generate images, video, music and TTS voice-over through the built-in model integrations |
| **Image revision** | Generate candidates with a reference-capable image model and adopt a replacement while preserving timing and animation |
| **Preview and versions** | Review in Studio, edit by hand or with your agent, and return to the project for the next revision |
| **Export and source** | Render a fixed version to MP4 and retain the HTML, CSS, JavaScript and media |

> “Keep the reveal we approved. Replace the middle scene with this screen recording, tighten the opening using these timecodes, and hold our final CTA for two more seconds.”

[Projects and versions](docs/project-workspace.md)

<a id="share-an-editable-remake"></a>

#### From a reference clip to an editable remake

1. **Break down the reference.** Pick a sequence. Record its shot order, transitions and sound cues in Motion.md, and mark what you want to replace.
2. **Rebuild the shots.** Your agent rebuilds the HTML scenes using your brand kit, copy and visuals, then arranges them on an editable timeline in Studio.
3. **Compare the cuts.** Watch the same moment in the original and the remake. Adjust the timing, movement and sound, then play the sequence through.
4. **Export and share.** Render the MP4 and keep the HTML source and media. To share a project others can adapt, include its Motion.md, a preview and assets you can redistribute. [Project contribution checklist](library/ENTRY_TEMPLATE.md)

<a id="bring-your-agent-and-keys"></a>

### 2. Free and open source. Use your local agent and bring your own keys.

<a id="choose-agent"></a>

**Choose your agent.** WorkBuddy, Codex, Claude Code and DeepSeek Harness have installation instructions. Other buttons open the shared MCP and CLI setup.

<p>
  <a href="#workbuddy-setup"><img src="docs/readme/agents/workbuddy-badge.svg" width="144" height="34" alt="WorkBuddy" /></a>
  <a href="#agent-setup"><img src="docs/readme/agents/codex-badge.svg" width="144" height="34" alt="Codex CLI" /></a>
  <a href="#claude-setup"><img src="docs/readme/agents/claude-code-badge.svg" width="144" height="34" alt="Claude Code" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/opencode-badge.svg" width="144" height="34" alt="OpenCode" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/hermes-badge.svg" width="144" height="34" alt="Hermes" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/antigravity-badge.svg" width="144" height="34" alt="Antigravity" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/gemini-badge.svg" width="144" height="34" alt="Gemini CLI" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/grok-build-badge.svg" width="144" height="34" alt="Grok Build" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/kimi-badge.svg" width="144" height="34" alt="Kimi CLI" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/cursor-badge.svg" width="144" height="34" alt="Cursor Agent" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/qwen-badge.svg" width="144" height="34" alt="Qwen Code" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/qoder-badge.svg" width="144" height="34" alt="Qoder CLI" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/copilot-badge.svg" width="144" height="34" alt="GitHub Copilot" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/pi-badge.svg" width="144" height="34" alt="Pi" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/kiro-badge.svg" width="144" height="34" alt="Kiro CLI" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/kilo-badge.svg" width="144" height="34" alt="Kilo" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/vibe-badge.svg" width="144" height="34" alt="Mistral Vibe" /></a>
  <a href="#deepseek-setup"><img src="docs/readme/agents/deepseek-badge.svg" width="144" height="34" alt="DeepSeek TUI / Harness" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/reasonix-badge.svg" width="144" height="34" alt="Reasonix" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/aider-badge.svg" width="144" height="34" alt="Aider" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/devin-badge.svg" width="144" height="34" alt="Devin" /></a>
  <a href="#local-agent-connection"><img src="docs/readme/agents/trae-badge.svg" width="144" height="34" alt="Trae CLI" /></a>
</p>

| Bring your own… | Make it work for your video |
| --- | --- |
| **🤖 Agent — BYOA** | Connect your existing local agent through Skills and MCP, with CLI access where supported. Keep your preferred client, account and working context. |
| **🔑 Keys — BYOK** | Connect supported media-provider API keys in Model Settings. Choose models for images, video, music and TTS; supported local media integrations can use your existing agent login. |
| **🎨 Brand and material** | Add your logo, fonts, screenshots, camera footage, script and music. Keep identity and approved assets in the Brand Kit section of Motion.md. |
| **🧩 Starting resources** | Browse references, motion components, templates and community Skills. Pick a direction, give the source or reference to your agent, and make it yours. |

**The Kinevyn creation pipeline is open source: Skills, project tools, model integrations, Studio and rendering.** Run it locally, inspect the implementation and extend the parts you need. Kinevyn charges no software subscription or per-render fee for this local workflow. You can also work with your own footage, images and audio without invoking media-generation APIs.

Provider credentials stay in your workspace, separate from the video project. Your agent and media providers bill any subscriptions or usage to your own accounts. [Agent setup and compatibility](docs/agent-adapters.md)

<a id="make-your-motion-language-reusable"></a> <a id="motion-design-community"></a>

### 3. 300+ Motion.md guides for video recreation

Kinevyn introduces **Motion.md**: a Markdown format for shot order, timing, transitions and the assets you can replace. The online library brings reference videos and their motion guides into the same detail page.

The Brand Kit section records your identity, voice and approved product facts; the Design section can reference an independent `DESIGN.md` for visual rules. Keep the reference’s motion and pacing while making the result recognizably yours.

To share an industry or brand system, use the [Motion Package v0.2 draft](docs/motion-package-spec.md) and [authoring toolkit](packages/motion-package/README.md). A package combines the design and motion documents with materials, declared dependencies and optional `SKILL.md`. The included recipe demonstrates two content presets; automatic Studio import and rendered fidelity remain separate from package validation.

![Motion.md and brand context](docs/readme/diagrams/creative-context.svg)

<a id="resources-to-start-from"></a> <a id="motion-gallery"></a>

#### Find a template, then make it yours

Browse by **reference brand, use case and video type**, or search for a specific idea. A template detail page brings together the preview, visual style, production notes and Motion.md download. Choose **Recreate template** in Studio to copy a prompt for your agent.

Reference-only entries start a reconstruction workflow. When editable source is available, your agent can adapt the project directly.

![Find a template, then make it yours](docs/readme/live-product/library.en.jpg)

[Browse the template library](https://open-design.ai/templates/)

<a id="all-in-one-studio"></a> <a id="full-video-creation-stack"></a>

<a id="model-wall"></a>

### 4. Multimodal generation: images, video, music and speech

**BYOK makes your multimodal accounts part of the video workflow.** Add your supported provider keys in **Model Settings**, choose your models, and generate images, video, music and speech through the Studio's **Model Gateway**. Preview candidates and adopt the results into the same project your agent and Studio edit. The supported local image path can reuse your existing agent login.

Connect fal.ai in **Model Settings** and refresh its catalog to find GPT Image 2.6, Nano Banana 2.1, FLUX.3, Seedance 2.5, Kling 4.0, Wan 3.0 and Eleven v4. The presets below also appear before you refresh.

<p><img src="docs/readme/models/codex.svg" width="133" alt="Codex Image">
<img src="docs/readme/models/nano-banana.svg" width="133" alt="Nano Banana 2">
<img src="docs/readme/models/flux.svg" width="133" alt="FLUX Schnell">
<img src="docs/readme/models/seedance.svg" width="133" alt="Seedance 2.0">
<img src="docs/readme/models/wan.svg" width="133" alt="Wan 2.2">
<img src="docs/readme/models/suno.svg" width="133" alt="Suno v4">
<img src="docs/readme/models/kokoro.svg" width="133" alt="Kokoro"></p>

| Make what the video needs | Built-in model catalog examples | Bring it into your film |
| --- | --- | --- |
| **🖼️ Images** | Codex Image; Nano Banana 2 via Atlas Cloud; FLUX Schnell via fal.ai | Brand visuals, scene artwork and supporting images; reference-based editing with Codex Image or an OpenDesign account image model that supports edits |
| **🎬 Video** | Seedance 2.0 via Atlas Cloud; Wan 2.2 via fal.ai | Generated shots and B-roll to combine with your footage and motion |
| **🎵 Music** | Suno v4 via Atlas Cloud | A soundtrack built around your mood and creative brief |
| **🎙️ TTS / voice-over** | Kokoro via fal.ai | Narration from your approved script, placed alongside the visuals and music |

> “Use the Brand Kit section of our Motion.md and our approved script. Generate artwork for the opening, a video insert, background music and TTS narration. Add the selected results to the recreated project, align the sound and visuals, then show me the full cut.”

[Model catalog](gateway/catalog.ts) · [Provider setup and endpoints](docs/model-gateway.md)

<a id="technical-guide"></a>
<a id="setup-and-technical-documentation"></a>

## 🛠️ Setup and technical documentation

When choosing or replacing media, creation workflows share a [material sourcing policy](skills/kinevyn-production/references/materials.md): reuse suitable supplied assets, prefer original sources for established subjects, and create original/supporting visuals as needed. Explicit user constraints and each workflow’s supported scope still apply.

### Install from source

For agent-led installation, use the [installation instruction above](#quick-start). To run from source, follow the steps below.

After a successful Agent-led installation, open the editor's template library in the current conversation, without creating a project. Browse and preview first; choose **Open and edit** to create an independent editable copy. Setup provides a direct library link even before the chat reloads MCP. See the [installation reply rules](docs/install.md#installation-success-reply).

During video creation and editing, the chat stays free of preview areas. Kinevyn presents the editable Studio when the final video is ready to preview, then shows [one final-video preview](docs/inline-video.md) after MP4 export and verification. Host-native playback takes priority; Codex embeds the video in the final reply. The optional MCP App player is used only when the host cannot preview the video, never alongside another preview of the same export. Native-host acceptance of an installed build remains separate.

If MCP tools are missing or fail to connect, use the installed [connection diagnosis and recovery guide](docs/npm-installation.md#missing-mcp-tools-or-a-failed-connection) to inspect the actual host configuration and verify the original workspace before continuing.

Use Git, npm and **Node.js 26.11.1**. Source-based preview and export also need Chrome/Chromium and FFmpeg/FFprobe. [Runtime setup](docs/usage.md)

```sh
git -c filter.lfs.process= -c filter.lfs.smudge= -c filter.lfs.required=false clone --depth 1 --single-branch --branch main https://github.com/rivyn-labs/kinevyn.git
cd kinevyn
npm ci
npm run build:studio
npm start
```

Full reference videos and optional template archives download through Git LFS only when requested. README images/GIFs and built-in templates remain available directly. See [clone size and optional media downloads](docs/repository-storage.md).

Open the `studioUrl` or `previewUrl` printed by `npm start`, then open **Template library**. Startup reuses a compatible service for the same workspace or selects an available local port. The service keeps running in the background after the launcher exits.

Select a template and choose **Recreate template** to copy the instruction for your agent. Keep projects and credentials outside the checkout; `MOTION_DATA_DIR` selects the workspace.

To run Kinevyn as a standing local service instead of a foreground `npm start`, use the [Docker deployment guide](deploy/README.md): it builds a container with Node.js, Chromium, FFmpeg/FFprobe and CJK fonts, publishes Studio on `127.0.0.1` only, and documents the `KINEVYN_PORT`, `KINEVYN_MEM_LIMIT` and `DO_NOT_TRACK` settings. Configure media-provider keys (fal.ai, Atlas Cloud, OpenDesign Cloud) in Studio's **Model Settings** either way; see [Model Gateway setup](docs/model-gateway.md).

Source checkouts load templates from `library/templates/catalog/`. The local Studio and MCP use the same files; `kinevyn_list_templates` returns a searchable local index, and `kinevyn_get_template` returns local guide content and absolute source paths. Imported large images and videos retain existing CMS links; new contribution media can use Git LFS. Local edits appear on the next catalog read.

The plugin root is this checkout: `.codex-plugin/plugin.json` loads its `skills/` and `.mcp.json`, which launches the root `mcp.ts`. Start stdio with `npm run mcp` or use an absolute path in [manual MCP configuration](#manual-mcp). [Local template workflow](docs/template-repository.md#run-from-a-local-clone).

<a id="agent-setup"></a>

#### Bring it into your agent

For Codex with plugin support, run from the checkout:

```sh
bash scripts/install-motion.command
```

<a id="workbuddy-setup"></a>

**WorkBuddy** · Import the Kinevyn connector in WorkBuddy or add its `mcp.json` as a custom MCP server. Ask WorkBuddy to list the available video templates. [WorkBuddy setup](docs/agent-adapters.md#workbuddy)

<a id="claude-setup"></a>

**Claude Code** · Connect this source checkout through the [manual MCP configuration](#manual-mcp), then run `/mcp` to check the connection.

<a id="deepseek-setup"></a>

**DeepSeek** · Work with the editable HTML project from the terminal in DeepSeek TUI. For DeepSeek Harness, connect the Kinevyn MCP tools with the Cordis configuration. [DeepSeek Harness setup](docs/agent-adapters.md#deepseek-harness)

The installer uses locally built packages. [Windows test packages](docs/test-packages.md)

Try an online template:

> Use Kinevyn to recreate the template at this detail-page URL with my brand kit and copy. Keep the motion and pacing, then open the editable result in Studio for review.

To start from a video instead, supply your reference and use the [recreation brief](#reverse-engineer-a-video). If your host cannot open Studio beside the conversation, use the returned local project link.

##### Skills, MCP and CLI

The main Skill, plugin and MCP server are named `kinevyn`; Tools, specialist Skills and resources use `kinevyn_*`, `kinevyn-*` and `kinevyn://`. Old Tool/resource names remain compatibility aliases; retired Skill entries are removed. Use `kinevyn` or `kinevyn-*` Skill names and refresh host discovery after upgrading. See [naming and installation compatibility](docs/npm-installation.md#public-names-and-compatibility).

Discover the main Skill and optional specialist workflows from GitHub with the [Skills CLI](https://github.com/vercel-labs/skills):

```sh
npx skills add rivyn-labs/kinevyn --list
npx skills add rivyn-labs/kinevyn --skill kinevyn-director kinevyn-production kinevyn-template-to-video kinevyn-recreate kinevyn-video-to-template
```

This copies instructions; it does not install the runtime or register MCP. Keep the shared documentation available and connect the app separately, or use the integrated local installer above.

| Skill | Use it for |
| --- | --- |
| [kinevyn](https://github.com/rivyn-labs/kinevyn/blob/main/skills/kinevyn/SKILL.md) | Setup, first use and selecting the right video workflow |
| [kinevyn-recreate](skills/kinevyn-recreate/SKILL.md) | Reconstructing a reference video and comparing the result |
| [kinevyn-template-to-video](skills/kinevyn-template-to-video/SKILL.md) | Adapting an existing editable template |
| [kinevyn-director](skills/kinevyn-director/SKILL.md) | Original films, narrative, movement, sound and creative review |
| [kinevyn-video-to-template](skills/kinevyn-video-to-template/SKILL.md) | Producing a portable reusable template |
| [kinevyn-production](skills/kinevyn-production/SKILL.md) | Scoped edits, preview, checks, troubleshooting and export |

<a id="local-agent-connection"></a>

**Connect a local agent** · Follow the installation guide for your client. Use the configuration below in clients with local stdio MCP support. In a shell-based agent, open the project directory and use the [local engine CLI](skills/kinevyn-production/references/native.md) to preview and render the HTML scenes. For the published npm application, run `kinevyn setup --host <agent-name>` (for example `opencode`); setup installs the app and Skills and returns the exact launcher entry to add. [Other local Agents](docs/npm-installation.md#other-local-agents)

<a id="manual-mcp"></a>

```json
{
  "mcpServers": {
    "kinevyn": {
      "command": "/absolute/path/to/node",
      "args": ["--experimental-strip-types", "/absolute/kinevyn/mcp.ts"],
      "env": { "MOTION_DATA_DIR": "/absolute/kinevyn-data" }
    }
  }
}
```

The **twenty-two public MCP names (including one asset compatibility alias and four Design Studio HTML tools)** cover template discovery and details, Skill discovery and reading, project creation and reading, editing, preview, media import and BYOK generation, reusable asset versions, project management and ZIP sharing, export, version restoration, cancellation, and Design Studio HTML projects, annotations and Open Design round-trip. Shared workflow and engine guides are available through MCP resources. [Tool contract](docs/mcp-phase1-tools.md)

Find a template with `kinevyn_list_templates`, inspect it with `kinevyn_get_template`, then create an editable copy with `kinevyn_create_project`. [Template catalog](docs/template-catalog.md)

Use `npm start` for the app and `npm run mcp` for stdio. Shell-capable agents can inspect and render with the pinned engine CLI returned by the runtime; managed edits retain project revision checks. [Native authoring](skills/kinevyn-production/references/native.md)

<a id="product-tour"></a> <a id="产品界面"></a> <a id="connect-your-agent"></a> <a id="use-from-your-agent"></a> <a id="从-agent-接入"></a> <a id="your-agent-your-studio"></a>

<a id="reverse-engineer-a-video"></a>

### From a reference to an editable project

| Study the reference | Rebuild for your story |
| --- | --- |
| **Hook and narrative** — what appears first, what follows, what earns the reveal | Your promise, product facts and call to action |
| **Shot structure** — framing, camera movement, layers and visual hierarchy | Your UI, footage, logo and supporting images |
| **Motion and pacing** — entrances, transitions, easing and reading holds | The same motion intent, adjusted to your content |
| **Typography and identity** — type hierarchy, color and composition | Your fonts, palette and words, recorded in Motion.md’s Brand Kit section |
| **Sound and rhythm** — speech timing, music cues and emphasis | Your voice, supplied music and sound direction |

Supply the clip and timecodes if your agent cannot open the social link. Start from the reference with the [recreation workflow](skills/kinevyn-recreate/SKILL.md), or use the [template workflow](skills/kinevyn-template-to-video/SKILL.md) when you already have editable source.

```text
Use Kinevyn to reverse-engineer the attached reference for our brand.

Study: the opening hook, shot order, typography, transitions and sound cues.
Keep: the product reveal and camera rhythm in the selected segment.
Replace: the logo, UI, claims, copy and end card with our supplied materials.
Generate: missing images, video, background music and TTS narration using
our configured models, following our brand and approved script.

Build an editable project. Open it in Studio and compare matching moments
with the reference. Explain any remaining differences. After review,
export an MP4 and retain the source for the next edit.
```

<a id="ai-video-editing"></a> <a id="keep-editing-after-the-remake"></a>

<a id="review-the-template-and-its-motionmd"></a>

#### Send the template to your agent

1. Watch the reference video. Expand **Visual style** or **Production notes** for details, or choose **Download motion.md** to save the guide.
2. Choose **Show instruction** to read the prompt, then **Recreate template** to copy it. Paste it into your agent with your brand kit and creative brief.
3. Open the project your agent creates in Studio to edit and export.

![Template preview beside the expanded instruction and Recreate template button, with a confirmation that the instruction was copied.](docs/readme/live-product/remix.en.jpg)

<a id="open-projects-reusable-knowledge"></a> <a id="developer-architecture"></a>

### System architecture

Editing the timeline in Studio and asking your agent to change a shot both update the same HTML project. The local TypeScript service manages media and revisions. A browser-based rendering engine exports the selected version to MP4.

#### How the modules work together

![The local agent connects through nine MCP project tools and Studio through local HTTP. The application manages revisions, assets and export jobs; the Model Gateway supplies media to the editable project, and the renderer exports and checks the selected project version.](https://releases.open-design.ai/open-motion/media/sha256/3e93e9896c3dbb930ab5492c12fdca48db226eddf881601b75400ca4011e01f0.png)

Edits made through the project tools include a revision check so an outdated request cannot overwrite newer work. Generated media enters the project when you select it. Each export uses the version saved when the job starts. The exporter checks the file specifications, and you can play the cut to review the picture, sound and timing.

<details>
<summary>Read the full architecture and roadmap as text</summary>

```text
CREATIVE INPUT
Reference video + brand kit + script + media
                            |
                            v
COMMUNITY KNOWLEDGE
Motion.md + BRANDKIT.md + Skills + templates + components
                            |
              +-------------+------------------+
              v                                v
BYOA: YOUR LOCAL AGENT                KINEVYN STUDIO
DeepSeek Harness / Codex /            React 19 + TypeScript + Vite
Claude Code / other local hosts       Tailwind CSS + Zustand
Skills + host analysis tools         CodeMirror + Dockview
              |                      media / preview / timeline
              | stdio MCP                      | local HTTP
              | 9 public project tools         |
              +------------------+-------------+
                                 v
LOCAL APPLICATION                 Node.js + TypeScript + node:http
Sessions / project files / assets / revisions / export jobs
              |                                  |
              v                                  v
BYOK: MODEL GATEWAY                   VIDEO AS CODE
Your keys / accounts / model routing  HTML scenes + media + Studio data
Discovery / generation jobs           HTML + CSS + JavaScript + GSAP
              |                                  ^
              v                                  |
MODEL ADAPTERS                                   |
Codex Image / Atlas Cloud / fal.ai               |
Images / Video / Music / TTS                     |
              |                                  |
              v                                  |
Generated candidates -> preview / select -> adopt into the project
                                                 |
                                                 v
RENDER AND VERIFY
Selected project version -> HTML render engine + Chromium -> FFmpeg / FFprobe
                                                 |
                                                 v
DELIVERY TODAY
MP4 + editable source + media + version and export evidence
                                                 |
                          .----------------------'
                          v
COMING: PUBLISH TO EVERY PLATFORM
Platform connectors -> release review -> scheduling -> performance feedback
                          |
                          v
COMING: KNOWLEDGE FEEDBACK
Version-linked outcomes -> team memory / RAG -> evaluated Skill improvements
```

</details>

BYOA connects your existing Agent client; the Assets workspace supports direct model generation and reusable media. BYOK connects your supported model accounts. Studio and the local service manage the editable work, while provider credentials remain outside project files. The public phase-one MCP surface contains **eighteen names: nine project tools, two template catalog tools, two Skill library tools, a project archive tool, a project management tool, one BYOK media-use tool and two names for the same workspace asset capability**. Configure provider keys in Studio, then use `kinevyn_media_use` for model discovery and media generation through the local Gateway service. Use `kinevyn_assets_use` (`kinevyn_assets` remains compatible) to upload, inspect or generate reusable assets, retain versions and import a chosen version into a film. [Asset library guide](docs/assets.md). Keys remain in the service; the public MCP contract does not include publishing.

#### Stack and source map

| Layer | Technology | Start reading |
| --- | --- | --- |
| **Studio and editor UI** | React 19, TypeScript 5.9, Vite 6, Tailwind CSS 4, Zustand, CodeMirror and Dockview | [Studio source](studio/src/) · [Motion app](studio/src/motion/MotionApp.tsx) · [Editor development](docs/editor-fork.md) |
| **Application runtime** | Node.js 26.11.1 in CI, native HTTP, TypeScript execution and local files/JSON | [server.ts](server.ts) · [workspace.ts](workspace.ts) · [Session architecture](docs/session-architecture.md) |
| **Agent integration** | Local stdio MCP, five core Skills and generated host adapters | [mcp.ts](mcp.ts) · [phase1.ts](phase1.ts) · [Adapter generation](scripts/export-adapters.ts) |
| **Multimodal generation** | Codex media adapter, Atlas Cloud predictions, fal.ai queue integration and persisted generation jobs | [Gateway service](gateway/service.ts) · [Provider adapters](gateway/providers.ts) · [Model catalog](gateway/catalog.ts) |
| **Composition and motion** | HTML/CSS/JS, GSAP, a pinned composition engine and native timeline/history | [Engine integration](hyperframes.ts) · [Template source](template-library/) · [Version adapter](phase1-versions.ts) |
| **Rendering and media** | Chromium, Puppeteer Core, FFmpeg and FFprobe | [Render service](server.ts) · [Export verifier](scripts/verify-export.ts) · [Native runtime lock](scripts/runtime-lock.json) |
| **Creative knowledge** | Markdown, source packages, presets and comparison evidence | [Motion.md](docs/motion-md.md) · [Core Skills](skills/) · [Community Library](library/README.md) |
| **Release history** | Stable version descriptions and published release records | [Changelog](https://github.com/rivyn-labs/kinevyn/blob/main/CHANGELOG.md) · [GitHub Releases](https://github.com/rivyn-labs/kinevyn/releases) |
| **Validation and packaging** | Node test runner, Vitest, Studio checks, npm lockfiles and explicit distribution lists | [Tests](tests/) · [Studio tests](studio/tests/) · [CI](.github/workflows/ci.yml) · [Distribution](scripts/distribution.ts) |
| **Publishing and learning — Coming** | Platform adapters, scheduling, version-linked feedback and retrieval; implementation still to be designed | [Studio vision](docs/product/studio-vision.md) |

Dependency pins live in [package.json](package.json), [package-lock.json](package-lock.json) and the [runtime lock](scripts/runtime-lock.json). Models and third-party libraries retain their own terms; the application is Apache-2.0.

#### Choose a layer and build with us

| If you work on… | A useful contribution | Entry point |
| --- | --- | --- |
| **Frontend and interaction** | Improve timeline editing, media generation controls, accessibility or preview behavior | [Studio](studio/src/) · [Media generator](studio/src/motion/MediaGenerator.tsx) |
| **AI and model infrastructure** | Add a provider adapter or model preset using the shared job and media flow | [Gateway design](docs/product/media-generation-design.md) · [Provider adapters](gateway/providers.ts) |
| **Agents and developer tools** | Improve a host adapter, Skill, resource guide or project-tool workflow | [Agent adapters](docs/agent-adapters.md) · [MCP contract](docs/mcp-phase1-tools.md) |
| **Motion and creative coding** | Share a component, native template or Motion.md package with an actual remix | [Components](library/components/README.md) · [Entry checklist](library/ENTRY_TEMPLATE.md) |
| **Video and rendering** | Improve export reliability, media handling or reproducible validation | [Engine notes](docs/hyperframes.md) · [Export verifier](scripts/verify-export.ts) |
| **Social publishing** | Help design the Coming connector layer: account access, release review, scheduling and version mapping | [Publishing direction](docs/product/studio-vision.md) · [Discuss a proposal](https://github.com/rivyn-labs/kinevyn/issues) |

Start with the [local setup](#quick-start), choose one layer, and follow [CONTRIBUTING.md](CONTRIBUTING.md) and [AGENTS.md](AGENTS.md). Keep user projects and credentials outside the checkout and preserve dependency pins and upstream licenses.

[Product architecture](docs/product/architecture.md) · [Studio development](studio/README.md) · [Model Gateway](docs/model-gateway.md) · [Contribution guide](CONTRIBUTING.md)

<a id="one-video-more-places-to-share"></a> <a id="publish-to-every-platform"></a>

<a id="super-motion-video-agent"></a> <a id="status--roadmap"></a> <a id="当前状态与路线图"></a> <a id="roadmap"></a>

### Platform versions and publishing

Make a separate composition for each aspect ratio, review the cut in Studio and export an MP4 for manual upload.

| Version to request | What to adapt |
| --- | --- |
| **Portrait short** — for destinations such as Reels, Shorts, TikTok or Xiaohongshu | Hook, large readable type, framing and the placement of captions |
| **Landscape film** — for a product page, launch or YouTube video | UI detail, wider compositions and time to explain |
| **Square feed cut** — for a social campaign | A compact composition, headline and clear closing message |

Channel connections, scheduled publishing and performance feedback are planned.

#### Studio roadmap and collaboration concept

| Area | Available today | Direction |
| --- | --- | --- |
| **Recreate and edit** | Agent-led reference reconstruction, template adaptation, editable projects and MP4 export | More evaluated recreation cases and repeatable comparisons |
| **Brand and knowledge** | Motion.md with its Brand Kit section, Skills and source packages | Personal/team memory, RAG and evaluated Skill improvements |
| **People and agents** | Handoffs on the same local project | Timeline comments, shared review and collaborative editing |
| **Multimodal creation** | Built-in image, video, music and TTS integrations; generation, candidate selection and timeline adoption | Integrated search across footage, images, voices, music and Avatar services |
| **Publish to every platform — Coming** | Authored aspect-ratio variants and MP4 handoff | Platform connectors, release review, scheduling, automatic reframing and social presets |
| **Feedback** | Human review and saved project versions | Version-linked performance data and recurring production tasks |

![Generated concept for people and agents reviewing a shared timeline; the collaboration experience is planned.](https://releases.open-design.ai/open-motion/media/sha256/a5efa5be51936f33ecc7ef4241ce2602ebf4e7efcc8ce30e0dac5a8bd2b34957.png)

*Concept preview of planned collaboration. No release date announced.* [Studio vision](docs/product/studio-vision.md) · [Knowledge and feedback](docs/product/studio-vision.md#knowledge-and-feedback)

<a id="社区共建"></a> <a id="community"></a>

## 🤝 Share the video. Share how you made it.

Share a remake, a reusable template or a Motion.md that captures the rhythm of a film. Include the reference and your editable project so another creator can try the same cut with their own footage.

| Contribution | What to include |
| --- | --- |
| **A recreation** | Reference and creator, your brief, editable project, preview, comparison and remaining differences |
| **A template or component** | Working source, editable choices, assets, preview and attribution |
| **A Skill or design system** | The method, keep/change rules and an example of what you actually ran |
| **Brand Kit content for Motion.md** | Identity, accurate product facts and approved assets within the creative specification |
| **Agent support or editor improvements** | A focused change with reproducible validation |

[Library entry checklist](library/ENTRY_TEMPLATE.md) · [Contribute](CONTRIBUTING.md) · [Report an issue](https://github.com/rivyn-labs/kinevyn/issues) · [Contributors](https://github.com/rivyn-labs/kinevyn/graphs/contributors) · [Media kit](docs/media-kit.md)

This repository was renamed from `rivyn-labs/html-anything` to [`rivyn-labs/kinevyn`](https://github.com/rivyn-labs/kinevyn).

[Discord](https://discord.com/invite/M7NnHS9gNa) · [Feishu](https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=b6cs46dc-acb2-48ed-941d-c45642ead841)

[**Star Kinevyn on GitHub**](https://github.com/rivyn-labs/kinevyn)

<a id="acknowledgements"></a>

### Acknowledgements

The template previews come from the current online catalog. Detail pages identify the reference brand; [preview sources and hashes](docs/readme/live-templates/manifest.json) record the assets used here. [Agent and model marks](docs/readme/models/README.md)

Kinevyn is licensed under [Apache-2.0](LICENSE). Third-party code, templates, media and fonts retain their own licenses and attribution.

| Source | Connection |
| --- | --- |
| [OpenDesign](https://github.com/rivyn-labs/open-design) | Develops Kinevyn and provides its UI foundations, resource structure, brand direction and Apache-2.0 HTML design templates, design systems, Skills, craft guides and scenario task profiles; [design system](docs/design-system.md), [design library notices](library/design/NOTICE.md) and [Motion showcase](https://open-design.ai/motion/) |
| [Hyperframes](https://github.com/heygen-com/hyperframes) | HTML-to-video composition, Studio and rendering foundations, pinned to 0.9.7; creator references, external adaptation demonstrations and component source; [engine notes](docs/hyperframes.md), [template notices](template-library/NOTICE.md) and [catalog provenance](docs/template-catalog.md) |
| [MotionGit](https://motiongit.com/) / adunext | Kinetic Tech source packaged as Presenter Tech; [license and attribution](library/templates/presenter-tech/NOTICE.md) |
| [GSAP](https://github.com/greensock/GSAP) / [FFmpeg](https://ffmpeg.org/) | Animation and media dependencies with versions retained in [package.json](package.json) and the [runtime lock](scripts/runtime-lock.json) |

[Asset sources](docs/readme/ASSETS.md) · [Skills page covers](docs/readme/ASSETS.md#skills-page-covers) · [Additional showcase sources](docs/readme/brand-showcase/README.md) · [Font notices](web/design-system/fonts/NOTICES.txt) · [Studio license](studio/LICENSE)

The former HTML Anything application is preserved on the [`legacy` branch](https://github.com/rivyn-labs/kinevyn/tree/legacy). See the [repository migration guide](docs/repository-migration.md) for the active branch and distribution boundaries.

## Star History

<a href="https://www.star-history.com/?repos=rivyn-labs%2Fkinevyn&amp;type=date">
  <picture>
    <source media="screen" srcset="https://raw.githubusercontent.com/rivyn-labs/kinevyn/readme-charts/star-history.svg">
    <img alt="Kinevyn’s GitHub star history, updated daily" src="docs/readme/star-history.svg">
  </picture>
</a>

[Offline snapshot](docs/readme/star-history.svg)

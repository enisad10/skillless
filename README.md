<div align="center">

<img src="./assets/logo.png" alt="skillless" width="600" />

**You don't need to know what skills are.**

A Claude Code plugin that automatically discovers and recommends capabilities — so you can focus on what you're building, not what tools exist.

[한국어](./README.ko.md) · [Getting Started](#getting-started) · [How It Works](#how-it-works)

</div>

---

## The Problem

Claude Code has **883+ skills** installed, with even more available on the marketplace and GitHub. But there's a catch: you have to *know* they exist to use them.

Most users never type `/skill` because they don't know that's a thing. They miss out on specialized capabilities for React, Kubernetes, Terraform, and hundreds of other tools — simply because nobody told them.

## The Solution

**skillless** removes the knowledge barrier entirely.

- **Automatic recommendations** — Working with Docker? A specialized Docker tool gets suggested automatically. No commands needed.
- **Explicit search** — Need something specific? `/discover kubernetes` searches across all sources at once.
- **Zero jargon** — The plugin never says "skill" or "plugin" to users. It talks about "tools", "capabilities", and "expertise" instead.

## Getting Started

### Installation

One command:

```bash
npx skillless
```

That's it. The plugin is installed to `~/.claude/plugins/skillless`.

<details>
<summary>Alternative: manual installation</summary>

```bash
git clone https://github.com/0oooooooo0/skillless.git
cc --plugin-dir /path/to/skillless
```

</details>

### Usage

#### Just work normally

The best part — you don't have to do anything. When you're working with a specific framework or tool and a relevant capability exists, **skillless** will suggest it naturally:

> By the way, I found a **specialized tool for Kubernetes** that can help with cluster setup, manifest generation, and troubleshooting.
> Would you like me to set it up?

#### Search explicitly

```
/discover react
/discover "ci/cd pipeline"
/discover terraform
```

This searches 3 sources and shows a unified result table:

```
| # | Name                 | Source    | Description                          | Installed |
|---|----------------------|----------|--------------------------------------|-----------|
| 1 | react-patterns       | local    | Advanced React patterns and hooks    | Yes       |
| 2 | vercel-labs/react    | skills.sh | React development patterns (12K+)   | No        |
| 3 | anthropics/react-pro | github   | React best practices collection      | No        |
```

Pick a number to install, or `cancel` to skip.

## How It Works

**skillless** searches three sources, prioritizing what's already on your machine:

```
┌───────────────────────────────────────────┐
│                /discover                   │
│             or auto-discovery              │
└───────────────────┬───────────────────────┘
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
  ┌─────────┐ ┌──────────┐ ┌────────┐
  │  Local   │ │skills.sh │ │ GitHub │
  │ ~/.claude│ │Directory │ │Search  │
  │ /skills/ │ │  (Web)   │ │(fallback)│
  └─────────┘ └──────────┘ └────────┘
       │            │            │
       └────────────┴────────────┘
                    │
                    ▼
             Unified Results
                    │
                    ▼
             skill-installer
        (confirm → install → verify)
```

1. **Local** — Scans `~/.claude/skills/*/SKILL.md` for already-installed skills
2. **[skills.sh](https://skills.sh)** — Searches the open skill directory (install via `npx skillsadd`)
3. **GitHub** — Falls back to web search when other sources return few results

### Installation flows

| Source | How it installs |
|--------|----------------|
| Already installed | Tells you it's ready to use |
| skills.sh | Runs `npx skillsadd <owner/repo>` |
| GitHub | Guides you to run `/plugin install <url>` or downloads SKILL.md directly |

Every installation requires **explicit user confirmation**. Nothing gets installed silently.

## Project Structure

```
skillless/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── bin/
│   └── cli.mjs                  # npx skillless CLI
├── skills/
│   ├── auto-discovery/
│   │   └── SKILL.md             # Background auto-recommendation
│   ├── skill-search/
│   │   └── SKILL.md             # Multi-source search engine
│   └── skill-installer/
│       └── SKILL.md             # Installation handler
└── commands/
    └── discover.md              # /discover user command
```

## Contributing

Issues and PRs welcome at [github.com/0oooooooo0/skillless](https://github.com/0oooooooo0/skillless).

## License

MIT

---

<div align="center">

Built by [@0oooooooo0](https://github.com/0oooooooo0)

*The best tools are the ones you don't have to look for.*

</div>

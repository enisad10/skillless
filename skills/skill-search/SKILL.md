# Skill: skill-search

Search for Claude Code skills across multiple sources.

user-invocable: false
description: Searches for relevant skills across local installation, skills.sh directory, and GitHub. Called by other skills or commands.
allowed-tools: [Read, Glob, Grep, Bash, WebSearch]

## Instructions

When called with a search query, search these 3 sources and return consolidated results.

### Source 1: Local Installed Skills
Search already-installed skills:
```
Glob: ~/.claude/skills/*/SKILL.md
Grep: search for the query keywords in matched files
```
Mark these as `installed: true`.

### Source 2: skills.sh Directory
Search the skills.sh open skill directory using the CLI:
```bash
npx skills find {query}
```
Parse the output to extract matching skills. Each line follows the format:
```
owner/repo@skill-name    <N> installs
└ https://skills.sh/owner/repo/skill-name
```
Extract from the output:
- Skill name and exact owner/repo@skill-name path
- Install count (popularity indicator)
- Install command: `npx skills add -y -g <owner/repo@skill-name>`

**IMPORTANT**: Always use the exact owner/repo path from the CLI output. Do NOT guess or modify the path.

### Source 3: GitHub (Fallback)
Only if Sources 1-2 return fewer than 3 results total:
```
WebSearch: site:github.com "SKILL.md" claude {query}
```
Parse results to extract skill repositories.

### Output Format

Return results as a markdown table:

| # | Name | Source | Description | Installed |
|---|------|--------|-------------|-----------|
| 1 | skill-name | local/skills.sh/github | Short description | Yes/No |

Sort order: local first, then skills.sh, github.

Also return a structured JSON block for programmatic use:
```json
{
  "results": [
    {
      "name": "skill-name",
      "source": "local|skills.sh|github",
      "description": "...",
      "installed": true,
      "install_info": {
        "type": "skills-add|github-plugin|skill-md|installed",
        "url_or_name": "..."
      }
    }
  ],
  "query": "original query",
  "total": 5
}
```

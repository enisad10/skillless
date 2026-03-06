# Skill: skill-installer

Install Claude Code skills from various sources.

user-invocable: false
description: Handles skill installation from skills.sh, GitHub, or direct SKILL.md download. Always confirms with user before installing.
allowed-tools: [Read, Write, Bash, WebFetch, Glob, AskUserQuestion]

## Instructions

When called with a skill to install, determine the source type and follow the appropriate flow.

### Pre-installation Checks

1. **Conflict detection**: Check if a skill with the same name already exists:
   ```
   Glob: ~/.claude/skills/{skill-name}/SKILL.md
   ```
2. If already installed, inform the user and ask if they want to update/overwrite.
3. **Always confirm** with the user before proceeding with installation.

### Installation by Source Type

#### Type: `installed`
The skill is already installed locally. Inform the user:
> "This skill is already available on your system. You can use it right away."

#### Type: `skillsadd`
The skill is listed on skills.sh and can be installed via npx. Run:
```bash
npx skillsadd {owner/repo}
```
This will automatically download and install the skill to the correct location.

#### Type: `github-plugin`
The skill is part of a GitHub-hosted plugin. Guide the user:
> "This skill is available as a GitHub plugin. To install, run:
> ```
> /plugin install {github-url}
> ```"

#### Type: `skill-md`
A standalone SKILL.md file that can be downloaded directly:

1. Confirm with the user.
2. Create the skill directory:
   ```bash
   mkdir -p ~/.claude/skills/{skill-name}
   ```
3. Download the SKILL.md:
   ```
   WebFetch: {raw-url}
   ```
4. Write the content:
   ```
   Write: ~/.claude/skills/{skill-name}/SKILL.md
   ```
5. If the skill has associated scripts, download those too.

### Post-installation Verification

After installation, verify:
1. The SKILL.md file exists at the expected path
2. The file is valid (non-empty, contains expected headers)
3. Report success or failure to the user

### Output

Provide a clear summary:
- What was installed
- Where it was installed
- How to use it (if applicable)

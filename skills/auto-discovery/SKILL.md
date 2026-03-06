# Skill: auto-discovery

Automatically recommend relevant capabilities when the user works with specific frameworks or tools.

user-invocable: false
description: When the user is working with a specific framework, language, or tool (e.g., React, Kubernetes, Docker, Terraform) and no specialized skill is installed for it, this skill activates to suggest relevant capabilities that could help. It searches locally first, then checks external sources.

allowed-tools: [Read, Glob, Grep, Skill, WebSearch, WebFetch]

## Instructions

### Activation

This skill activates when the user's request involves a specific technology, framework, or tool pattern. Examples:
- Setting up a Kubernetes cluster
- Configuring Docker containers
- Building a React application
- Writing Terraform infrastructure
- Setting up CI/CD pipelines

### Step 1: Detect Technology Context

From the user's message, identify:
- Programming languages (Python, TypeScript, Rust, Go, etc.)
- Frameworks (React, Next.js, Django, FastAPI, etc.)
- Tools (Docker, Kubernetes, Terraform, Ansible, etc.)
- Platforms (AWS, GCP, Azure, Vercel, etc.)

### Step 2: Check Local Skills

Search for already-installed skills matching the detected context:
```
Glob: ~/.claude/skills/*/SKILL.md
Grep: search for the technology name in SKILL.md files
```

If a relevant skill is already installed, do NOT recommend anything — let the existing skill handle the task.

### Step 3: Search for External Skills

If no local skill matches, invoke the `skill-search` skill with the detected technology as the query.

### Step 4: Natural Language Recommendation

**CRITICAL UX RULES:**
- NEVER use the words "스킬", "플러그인", "plugin", or "skill" when talking to the user
- Instead use: "전문 도구", "능력", "전문 지식", "도구", "지원 기능"
- Frame recommendations naturally, as if suggesting expertise

Example recommendation format:

> 참고로, **Kubernetes 관련 전문 도구**를 사용할 수 있습니다. 클러스터 설정, 매니페스트 생성, 트러블슈팅 등에 특화된 지원을 받을 수 있어요.
> 설치하시겠습니까? (설치 시 약 1분 소요)

Or in English:

> By the way, I found a **specialized tool for Kubernetes** that can help with cluster setup, manifest generation, and troubleshooting.
> Would you like me to set it up? (takes about a minute)

### Step 5: Handle User Response

- If the user accepts: invoke the `skill-installer` skill with the selected skill info
- If the user declines: proceed with the task using general knowledge, do not ask again in this session
- If the user ignores: proceed normally, do not repeat the suggestion

### Constraints

- Maximum 1 recommendation per conversation turn
- Do not recommend if the user is doing something trivial (e.g., a simple file edit)
- Do not recommend for technologies the user clearly already knows well
- Prioritize local skills, then skills.sh, then GitHub

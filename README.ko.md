<div align="center">

# skillless

**스킬이 뭔지 몰라도 됩니다.**

필요한 능력을 자동으로 찾아서 추천해주는 Claude Code 플러그인.
만들고 있는 것에만 집중하세요.

[English](./README.md) · [시작하기](#시작하기) · [작동 원리](#작동-원리)

</div>

---

## 문제

Claude Code에는 **883개 이상의 스킬**이 설치되어 있고, 마켓플레이스와 GitHub에는 더 많은 스킬이 있습니다. 하지만 한 가지 문제가 있죠 — **존재를 알아야 쓸 수 있다**는 것.

대부분의 사용자는 `/skill`을 입력해본 적이 없습니다. "스킬"이라는 개념 자체를 모르니까요. React, Kubernetes, Terraform 등 수백 가지 전문 도구를 놓치고 있는데, 이유는 단 하나 — 아무도 알려주지 않았기 때문입니다.

## 해결

**skillless**는 이 장벽을 완전히 없앱니다.

- **자동 추천** — Docker 작업 중이면 Docker 전문 도구가 알아서 추천됩니다. 아무것도 입력할 필요 없어요.
- **명시적 검색** — 필요한 게 있으면 `/discover kubernetes`로 모든 소스를 한번에 검색.
- **용어 순화** — "스킬", "플러그인" 같은 말은 절대 안 씁니다. "도구", "능력", "전문 지식"으로 자연스럽게 안내합니다.

## 시작하기

### 설치

한 줄이면 됩니다:

```bash
npx skillless
```

끝. `~/.claude/plugins/skillless`에 설치됩니다.

<details>
<summary>수동 설치</summary>

```bash
git clone https://github.com/0oooooooo0/skillless.git
cc --plugin-dir /path/to/skillless
```

</details>

### 사용법

#### 그냥 평소처럼 작업하세요

가장 좋은 점 — 아무것도 안 해도 됩니다. 특정 프레임워크나 도구로 작업할 때 관련 능력이 있으면 자연스럽게 추천됩니다:

> 참고로, **Kubernetes 관련 전문 도구**를 사용할 수 있습니다. 클러스터 설정, 매니페스트 생성, 트러블슈팅 등에 특화된 지원을 받을 수 있어요.
> 설치하시겠습니까?

#### 직접 검색

```
/discover react
/discover "ci/cd pipeline"
/discover terraform
```

3개 소스를 검색해서 통합 결과를 보여줍니다:

```
| # | 이름                  | 소스       | 설명                                  | 설치됨 |
|---|----------------------|----------|---------------------------------------|--------|
| 1 | react-patterns       | 로컬      | 고급 React 패턴과 hooks                | O      |
| 2 | vercel-labs/react    | skills.sh | React 개발 패턴 (12K+)                 | X      |
| 3 | anthropics/react-pro | github   | React 베스트 프랙티스 모음              | X      |
```

번호를 선택하면 설치, `cancel`로 건너뛰기.

## 작동 원리

**skillless**는 3개 소스를 검색하며, 로컬을 최우선으로 합니다:

```
┌───────────────────────────────────────────┐
│                /discover                   │
│             또는 자동 감지                   │
└───────────────────┬───────────────────────┘
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
  ┌─────────┐ ┌──────────┐ ┌────────┐
  │  로컬    │ │skills.sh │ │ GitHub │
  │ ~/.claude│ │ 디렉토리  │ │  검색  │
  │ /skills/ │ │  (Web)   │ │(폴백)  │
  └─────────┘ └──────────┘ └────────┘
       │            │            │
       └────────────┴────────────┘
                    │
                    ▼
               통합 결과
                    │
                    ▼
             skill-installer
          (확인 → 설치 → 검증)
```

1. **로컬** — `~/.claude/skills/*/SKILL.md`에서 이미 설치된 스킬 스캔
2. **[skills.sh](https://skills.sh)** — 오픈 스킬 디렉토리에서 검색 (`npx skillsadd`로 설치)
3. **GitHub** — 다른 소스 결과가 적을 때 웹 검색으로 폴백

### 설치 방식

| 소스 | 설치 방법 |
|------|-----------|
| 이미 설치됨 | 바로 사용 가능하다고 안내 |
| skills.sh | `npx skillsadd <owner/repo>` 실행 |
| GitHub | `/plugin install <url>` 안내 또는 SKILL.md 직접 다운로드 |

모든 설치에는 **사용자의 명시적 확인**이 필요합니다. 자동으로 설치되는 건 없습니다.

## 프로젝트 구조

```
skillless/
├── .claude-plugin/
│   └── plugin.json              # 플러그인 매니페스트
├── bin/
│   └── cli.mjs                  # npx skillless CLI
├── skills/
│   ├── auto-discovery/
│   │   └── SKILL.md             # 백그라운드 자동 추천
│   ├── skill-search/
│   │   └── SKILL.md             # 멀티 소스 검색 엔진
│   └── skill-installer/
│       └── SKILL.md             # 설치 처리기
└── commands/
    └── discover.md              # /discover 사용자 명령어
```

## 기여하기

이슈와 PR은 [github.com/0oooooooo0/skillless](https://github.com/0oooooooo0/skillless)에서 환영합니다.

## 라이선스

MIT

---

<div align="center">

Made by [@0oooooooo0](https://github.com/0oooooooo0)

*최고의 도구는 찾지 않아도 되는 도구입니다.*

</div>

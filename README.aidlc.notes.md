# AI-DLC Notes

## How AI-DLC works
Work moves through **stages** (requirements, design, code, test, deploy). After each stage the agent shows its output and waits for you to **approve** or **request changes**. A **plan** (scope) is the list of stages a piece of work runs through. Bigger plans add more upfront planning and review before code is written. Nothing changes in your code until the stages leading up to it are approved, and stages can be added or skipped later.

## Plan options

| Plan | Stages | What you get |
|---|---|---|
| express | 7 | Requirements → code → build/test → deploy. Scans existing code first. No design stage, no reviewers. |
| refactor | 7 | Scan code → requirements → design → code → test → deploy. Preserves existing behavior. |
| mvp | 20 | Requirements, user stories, design, units, code, test. No operations. |
| classic / feature / enterprise | 15 / 30 / 30 | Full lifecycle up to mockups, security, infra, monitoring. |
| poc | 5 | Quick throwaway spike. |
| bugfix / security-patch / infra | 6 / 7 / 10 | Specialized: bugs, CVEs, infrastructure. |
| workshop | 23 | Facilitated group session. |
| Tailor | varies | A planning agent proposes a custom stage list (e.g. express + Rough/Refined Mockups) for your approval. |

## Choice for UI modernization
Selected **refactor** (7 stages) to modernize the dated pastel UI while keeping existing behavior intact.

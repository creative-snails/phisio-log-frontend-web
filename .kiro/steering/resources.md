---
inclusion: manual
---

# Project Resources

## GitHub Organization

- Org: [creative-snails](https://github.com/creative-snails)

## Repositories

| Repo           | URL                                                        | Purpose                            |
| -------------- | ---------------------------------------------------------- | ---------------------------------- |
| Frontend (Web) | https://github.com/creative-snails/phisio-log-frontend-web | React 19 + Vite SPA                |
| Backend (TS)   | https://github.com/creative-snails/phisio-log-backend-ts   | Express + MongoDB + OpenAI backend |
| Backend (Go)   | https://github.com/creative-snails/phisio-log-backend-go   | Go/PostgreSQL learning variant     |

## Project Board

- [PhisioLog Project Board](https://github.com/orgs/creative-snails/projects/2/views/1)

## GitHub Integration (gh CLI)

**Primary tool for all GitHub operations.** No MCP needed.

The `gh` CLI is authenticated as `AladinJmila` with scopes: `gist`, `project`, `read:org`, `repo`, `workflow`.

### Common Operations

```bash
# Issues
gh issue list --repo creative-snails/phisio-log-frontend-web --state open
gh issue create --repo creative-snails/phisio-log-frontend-web --title "..." --body "..."
gh issue edit 42 --repo creative-snails/phisio-log-frontend-web --add-label "backlog"
gh issue close 42 --repo creative-snails/phisio-log-frontend-web --comment "reason"

# PRs
gh pr list --repo creative-snails/phisio-log-frontend-web
gh pr create --title "..." --body "..."
gh pr view 5 --repo creative-snails/phisio-log-frontend-web

# Project board
gh project item-list 2 --owner creative-snails --format json
```

### Repo Identifiers

- Owner: `creative-snails`
- Frontend: `phisio-log-frontend-web`
- Backend: `phisio-log-backend-ts`

## Internal Docs

| Document           | Location                                       | Purpose                                    |
| ------------------ | ---------------------------------------------- | ------------------------------------------ |
| Context (Frontend) | `.kiro/steering/context.md`                    | Project overview and conventions           |
| Context (Backend)  | `.kiro/steering/context.md` (backend repo)     | Backend overview and conventions           |
| Transition Plan    | `.kiro/docs/transition-plan.md` (backend repo) | Full 14-milestone backend learning roadmap |

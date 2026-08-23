# PhisioLog Frontend Context

## Project Overview

PhisioLog frontend is a React SPA for personal health journaling. Users create, view, edit, and manage health records. Includes a chat-based AI assistant that helps structure health data into records, body map visualization, health timelines, and report generation.

## Tech Stack

- Framework: React 19 (Vite)
- Language: TypeScript
- Routing: react-router-dom v7
- HTTP: Axios
- Validation: Zod
- Markdown: react-markdown + remark-gfm
- Icons: react-icons
- Select: react-select
- IDs: uuid
- Build: Vite
- Lint: ESLint + Prettier
- Git hooks: Husky + lint-staged

## Project Structure

```
src/
  main.tsx            # React entry point
  App.tsx             # Router + layout setup
  pages/             # Route-level components (Home, Reports)
  components/        # UI components
    chat/            # AI chat interface components
    forms/           # Health record form
    Layout.tsx       # App shell with side nav
    SideNavBar.tsx   # Navigation sidebar
    HealthTimeline.tsx
    BodyMapViewer.tsx
    HealthRecordsManager.tsx
    HeroSection.tsx
    ApiStatusBanner.tsx
  services/          # API client layer (axios calls)
  types/             # TypeScript type definitions
  utils/             # Shared utilities
  validation/        # Zod schemas
  theme.css          # Theme variables
  index.css          # Global styles
```

## Routes

| Path                      | Component        | Purpose                                         |
| ------------------------- | ---------------- | ----------------------------------------------- |
| `/`                       | Home             | Dashboard with health timeline, records manager |
| `/health-record`          | HealthRecordForm | Create new record                               |
| `/health-record/:id/edit` | HealthRecordForm | Edit existing record                            |
| `/reports`                | Reports          | View generated reports                          |

## Key Commands

| Command            | Purpose                                  |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Vite dev server (hot reload)             |
| `npm run build`    | TypeScript check + Vite production build |
| `npm run tsc`      | TypeScript compile check only            |
| `npm run lint`     | ESLint check                             |
| `npm run lint:fix` | ESLint auto-fix                          |
| `npm run format`   | Prettier format                          |
| `npm run preview`  | Preview production build locally         |

## Path Alias

`~/` maps to `src/` (configured in vite.config.ts and tsconfig). All imports use this alias.

## Backend Connection

Communicates with `phisio-log-backend-ts` via REST API (Axios). Backend URL configured in environment variables (`.env`).

## Features

- **Health Records:** CRUD for structured health records (symptoms, body areas, severity, treatments, notes)
- **AI Chat:** Conversational interface that helps users describe health events; AI extracts structured data
- **Body Map:** Visual body diagram showing affected areas
- **Health Timeline:** Chronological view of health events
- **Reports:** AI-generated health summaries/reports
- **API Status Banner:** Shows backend connectivity state

## Conventions

- Zod for runtime validation of API responses and form data
- Path alias `~/` for all imports (no relative `../../`)
- Components co-located with their CSS files when component-specific styling needed
- Services layer abstracts all HTTP calls
- Types separated from components

## Docker

Dockerfile and compose.yml available. Also a `Dockerfile.mock` for running with a mock backend (`db.json`).

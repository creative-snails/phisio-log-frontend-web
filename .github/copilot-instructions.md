# PhisioLog – AI Coding Agent Guide

Short version: React + Vite + TypeScript app that visualizes health records on an SVG body map, edits them via multi-step forms, and provides a context-aware chat widget. Mock API runs at http://localhost:4444; app at http://localhost:5173.

Build & run

- Preferred: docker compose up (compose.yml spins up web and mock-api). Clean rebuild: docker compose down --rmi all && docker compose build --no-cache && docker compose up
- Local alt (still need mock API): npm ci, then npm run dev (Vite on 0.0.0.0:5173)
- Lint/format: npm run lint, npm run lint:fix, npm run format
- Stop/Start: docker compose stop/start; restart for env changes; up --build after Dockerfile/deps changes

Package management

- Public npm registry enforced via .npmrc; run npm run verify-npm if registry/auth issues arise
- Always commit both package.json and package-lock.json when adding packages

Architecture (files to skim first)

- Routing in src/App.tsx (/, /health-record, /health-record/:id/edit, /reports). Layout wrapper in components/Layout.tsx.
- State: React local state only. Data types in src/types.ts.
- Alias ~ -> src (vite.config.ts). Example: import { HealthRecord } from "~/types".

Core data model (src/types.ts)

- HealthRecord: { description, symptoms, status, treatmentsTried, medicalConsultations, createdAt, updatedAt, id? }
- Symptom.affectedParts: { key: string; state: "1"|"2"|"3" }[] where key matches services/bodyParts.ts IDs.
- Status: { stage, severity, progression } with severity labels mild|moderate|severe (case-insensitive).

Body map mechanics

- SVG parts declared in services/bodyParts.ts as frontSide/backSide arrays (id matches Symptom.affectedParts.key).
- Component: components/BodyMapViewer.tsx props: records?: HealthRecord[]; readOnly?: boolean; colorSource?: "part"|"record".
- Coloring: utils/severityColors.ts (getSeverityColor, getSeverityLabelColor, getSeverityLabelState). Aggregates max part state; ignores records with status.stage === "resolved"|"closed". Flip control swaps front/back.

Forms & API

- Parent form components/forms/HealthRecordForm.tsx orchestrates: SymptomsForm, HealthStatusForm, TreatmentsTried, MedicalConsultationsForm.
- Fetch endpoints: http://localhost:4444/health-records and /:id (see HealthRecordForm and HealthRecordsManager).
- RecordFormData manages {data, loading, error}. Update nested state via setRecordFormData; keep SymptomUI.isOpen local.

Chat widget behavior

- components/chat/ChatWidget.tsx accepts { healthRecordId? }. Session key: chat-session-record-${id} or chat-session-general in localStorage.
- On first open, fetches the record and posts a contextual greeting. Messages are markdown-rendered (react-markdown + remark-gfm). Footer ChatForm is disabled until chatHistory exists.

Timeline patterns

- components/HealthTimeline.tsx groups records by month; simple category filter via symptom names.
- Severity color precedence: getSeverityLabelColor(record.status.severity) else max affected state (getTimelineSeverityColor).
- Edit navigates to /health-record/:id/edit; selecting a card updates BodyMapViewer on the right.

Conventions & gotchas

- Always use ~ alias for src imports; keep plain CSS files colocated (e.g., BodyMapViewer.css, HealthTimeline.css).
- Severity labels are textual; utils handle case-insensitivity. Missing/unknown -> pastel blue default on timeline.
- BodyMapViewer "record" colorSource paints only affected parts using the record-level label when a single record is shown.

Typical changes

- Add a body part: extend services/bodyParts.ts; ensure id is unique; BodyMapViewer picks it up automatically; use new id in symptoms.affectedParts.
- Extend HealthRecord: update src/types.ts, wire fields into form subcomponents, and adjust db.json for mock data.

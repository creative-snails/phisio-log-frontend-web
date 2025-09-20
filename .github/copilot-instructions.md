# PhisioLog AI Agent Instructions

## Project Overview

PhisioLog is a React-based health journaling web application for tracking physiological conditions, symptoms, treatments, and medical consultations. Users interact with an interactive body map, log health records, and chat with an AI assistant about their health data.

## Architecture & Key Patterns

### Core Data Model

- **HealthRecord**: Central entity containing symptoms, status, treatments, and consultations
- **Symptoms**: Include `affectedParts` array with body part keys and severity states (1-3)
- **Body Map Integration**: SVG-based interactive body viewer using `src/services/bodyParts.ts` definitions

### Component Structure

- **Layout**: Simple sidebar navigation with `Layout.tsx` wrapping page content
- **Forms**: Multi-step health record forms in `src/components/forms/`
- **Body Map**: `BodyMapViewer.tsx` is an omnipresent standalone component that renders SVG paths with color-coded health states - appears across multiple views for constant health visualization
- **Health Timeline**: `HealthTimeline.tsx` is a standalone component that displays health records chronologically
- **Chat Widget**: Context-aware AI assistant that can access specific health records

### State Management

- React built-in state management (no external state library)
- Form data managed through `RecordFormData` interface with loading/error states
- Chat sessions stored with `sessionKey` based on health record ID

## Development Workflow

### Docker-Based Development (Recommended)

```bash
# Initial setup
docker compose up        # First run builds images and starts services
                        # Frontend: http://localhost:5173
                        # Mock API: http://localhost:4444

# Day-to-day workflow
docker compose stop      # Stop services without removing
docker compose start     # Restart stopped services
docker compose restart   # Restart if issues occur

# When dependencies/Dockerfile changes
docker compose up --build

# Clean rebuild (nuclear option)
docker compose down --rmi all &&
docker compose build --no-cache &&
docker compose up
```

### Local Development (Alternative)

```bash
npm ci                   # Install dependencies locally for IDE support
npm run dev             # Start dev server (Vite) on 0.0.0.0:5173
# Note: Still need mock API via Docker or separate json-server
```

### Code Quality

- ESLint with TypeScript, React, and accessibility rules
- Prettier formatting with lint-staged hooks
- Import sorting with `simple-import-sort` plugin

### Path Aliases

- Use `~/` for imports from `src/` directory (configured in `vite.config.ts`)
- Example: `import { HealthRecord } from "~/types"`

### Setup Requirements

- Docker Desktop required for full development environment
- Install dependencies locally with `npm ci` (not `npm install`) for IDE support
- Initial Docker build takes longer; subsequent runs are faster

## Critical Patterns

### Body Map Integration

**Omnipresent Architecture**: BodyMapViewer is designed to be reusable across multiple views (Home, Health Record Editor, Reports) for consistent health visualization.

When working with body parts:

- Reference IDs from `frontSide` array in `bodyParts.ts` (e.g., "head-front", "shoulder-left-front")
- Severity states: 1 (mild/green), 2 (moderate/yellow), 3 (severe/red)
- Color mapping in `BodyMapViewer.tsx` `getPartFill()` function
- Component accepts `records` prop to display current health states across all active conditions

### Health Record Forms

- Multi-component forms: `SymptomsForm`, `HealthStatusForm`, `MedicalConsultationsForm`, `TreatmentsTried`
- Form state managed in parent `HealthRecordForm.tsx`
- API calls to `http://localhost:4444/health-records/`

### Chat Widget Context

- Chat widget accepts `healthRecordId` prop for record-specific conversations
- Session storage keyed by record ID: `chat-session-record-${healthRecordId}`
- Fetches health record data to provide context to AI assistant

### API Integration

- Mock JSON server on port 4444 using `db.json`
- Health records stored in `health-records` array
- Standard CRUD operations with fetch API

## File Organization

### Key Directories

- `src/pages/`: Route components (Home, HealthRecord, Reports)
- `src/components/forms/`: Multi-step form components
- `src/components/chat/`: AI chat functionality
- `src/components/`: Standalone reusable components (BodyMapViewer, HealthTimeline, etc.)
- `src/services/`: Body parts data and external service integrations

### Important Files

- `src/types.ts`: Core TypeScript interfaces
- `src/services/bodyParts.ts`: SVG path definitions for body map
- `db.json`: Mock database with sample health records
- `compose.yml`: Docker setup for development environment

## Common Tasks

### Adding New Body Parts

1. Add SVG path data to `bodyParts.ts` with unique ID
2. Update body map rendering logic in `BodyMapViewer.tsx`
3. Test color states and interaction handlers

### Extending Health Records

1. Update interfaces in `types.ts`
2. Modify form components in `src/components/forms/`
3. Update mock data in `db.json` for testing

### Chat Widget Features

1. Modify `ChatWidget.tsx` for UI changes
2. Update `mockChatService.ts` for response logic
3. Ensure proper health record context passing

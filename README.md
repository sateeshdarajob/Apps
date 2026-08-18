# TPM Control Tower

Enterprise Technical Program Management dashboard for TPMs, Engineering Managers, Product Managers, and executive stakeholders.

## Latest UI

![TPM Control Tower — latest UI](docs/screenshots/latest-ui.png)

> **Check-in convention:** Every GitHub commit that changes the UI must refresh `docs/screenshots/latest-ui.png` and keep this README image current.

## Stack

- React 19 + TypeScript
- Vite
- Material UI (MUI)
- React Router
- TanStack Query
- Recharts
- ESLint + Prettier

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Local Windows setup (`C:\TPM`)

```powershell
New-Item -ItemType Directory -Force -Path C:\TPM | Out-Null
cd C:\TPM
git clone https://github.com/sateeshdarajob/Apps.git
cd Apps
git checkout cursor/tpm-control-tower-foundation-0779
npm install
npm run dev
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Typecheck and production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | TypeScript project references check |

## Architecture

```
src/
  app/           # App root, providers, router
  components/    # Reusable UI (layout, kpi, charts, tables, status, common)
  data/mock/     # Centralized mock JSON/domain data
  hooks/         # Global filters + TanStack Query hooks
  pages/         # Route-level screens
  services/      # Async data access (mock today, API-ready later)
  theme/         # MUI theme
  types/         # Shared TypeScript domain types
  utils/         # Formatting and RAG helpers
```

Business data lives in `src/data/mock` and is accessed through `src/services`. UI components consume hooks — they do not hardcode portfolio data.

## Current scope

Foundation only:

- Collapsible left navigation
- Top header with global filters (org unit, program, date range)
- Theme + layout shell
- Routing skeleton
- Reusable KPI / chart / table / RAG primitives
- Control Tower page wired to mock data as a smoke test

Remaining routes render placeholders until the next increment.

# FleetPulse

A connected-vehicle fleet dashboard, built step by step as a learning project. It will show a vehicle list, vehicle details, live telemetry, a map and alerts.

**Status:** Phase 1 (front end with mock data) in progress.

## Tech stack (so far)
- React 19 + TypeScript, built with Vite
- React Router 7
- Jest + React Testing Library

**Planned:** React Query, React Hook Form + Zod, GitHub Actions, then a NestJS + PostgreSQL + Redis back end, live data (SSE/WebSockets), a map, and end-to-end tests.

## Run it locally
You need Node.js 20 or newer.

```bash
cd frontend
npm install
npm run dev      # start the dev server
npm test         # run the tests
npm run lint     # check the code style
npm run build    # production build
```

## Project structure
```
FleetPulse/
├── frontend/   React + TypeScript app
├── backend/    NestJS API (planned, Phase 2)
└── docs/       one short note per completed step
```

## Progress
Each step has a short note with the goal, key ideas, code and interview questions. See the [docs index](docs/README.md).

- [x] Step 1: Project structure and Vehicle types
- [x] Step 2: Routing and layout
- [x] Step 3: Mock data layer
- [ ] Step 4: GitHub Actions (lint and test)
- [ ] Step 5: Vehicle list
- [ ] Step 6: Search, filter and sort
- [ ] Step 7: Vehicle detail page
- [ ] Step 8: Login form
- [ ] Step 9: Auth state and protected routes
- [ ] Step 10: Loading, error and empty states
- [ ] Step 11: React Query
- [ ] Step 12: Baseline performance measurement

# AGENTS.md - F1 Race Strategist App

Fullstack Web Application built with React 19 / Next.js 16 (App Router), Tailwind CSS, PostgreSQL, and Sequelize ORM.
Language: English for codebase/API definitions, Spanish for UI text.

## Tech Stack & Environment
- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL + Sequelize ORM
- **HTTP Client:** Axios (for consuming external F1 API)
- **State Management:** Zustand 5.0.16 (for global i18n state with localStorage persistence)

## Memori
- When you start, read the `MEMORY.md` file first by know the current status of the project and decisions made.
- Small and focused changes on the core features. Don´t rewrite the code if it already works..
- When finish the tast, update the `MEMORY.md` file with the new status of the project and any decisions made.

## Reglas
- Read the `/docs/constitution.md` file and the spec (`spec/NNN~*/`) first by know the project rules and constraints and before any change in the code.

#### Commands
- `npm run dev` — Run local development server (http://localhost:3000)
- `npm run build` — Verify production build & TypeScript compilation
- `npx sequelize-cli db:migrate` — Execute database migrations

## Project Directory Structure
- `app/` — Next.js App Router
  - `app/api/` — Backend API Routes (e.g., `/api/races`, `/api/simulate`, `/api/strategies`)
  - `app/page.tsx` — Main Frontend application page
- `components/` — UI modular components (race selector, strategy builder, results view)
- `hooks/` — Custom React Hooks for data fetching and business logic
- `stores/` — Zustand stores (e.g., `languageStore.ts` for i18n)
- `locales/` — Translation files (es.json, en.json)
- `config/` — Sequelize DB connection settings
- `models/` — Sequelize ORM data models
- `migrations/` — Database migrations
- `services/` — External F1 API client and Race Simulation logic

## Verification
- After each change, verify with the MCP the Chrome DevTools: open the proyect, test the funcionality and review the console.
- Verify that all created texts are in English and Spanish.

## Core Business Rules & Constraints
1. **API Integration & Cold Start:** Consumes `https://tech-challenge101.onrender.com`. Timeout set to 60s to account for Render free-tier cold starts.
2. **Simulation Engine:** Simple, deterministic, and transparent lap-by-lap breakdown (tyre degradation, pit stop time loss, stint calculation).
3. **API Validation & Error Handling:** Validate user strategy input before executing simulations. Return clear JSON error messages for invalid strategies or external API failures.
4. **Database Usage:** Persist user-created race strategies and simulation results in PostgreSQL.
5. **Internationalization (i18n):** Use Zustand store (`stores/languageStore.ts`) for language state management. All UI text must be translatable using the `t(key)` function from the store. Translation keys are stored in `locales/es.json` and `locales/en.json`.
6. **Component Architecture:** Components should only handle UI/presentation. Data fetching and business logic must be encapsulated in custom hooks (`/hooks`).
7. **No Independent Decisions:** Subagents must present implementation plans and request user approval before modifying files.
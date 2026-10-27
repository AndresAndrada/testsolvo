# AGENTS.md - F1 Race Strategist App

Fullstack Web Application built with React 19 / Next.js 16 (App Router), Tailwind CSS, PostgreSQL, and Sequelize ORM.
Language: English for codebase/API definitions, Spanish for UI text.

## Tech Stack & Environment
- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL + Sequelize ORM
- **HTTP Client:** Axios (for consuming external F1 API)

## Commands
- `npm run dev` — Run local development server (http://localhost:3000)
- `npm run build` — Verify production build & TypeScript compilation
- `npx sequelize-cli db:migrate` — Execute database migrations

## Project Directory Structure
- `app/` — Next.js App Router
  - `app/api/` — Backend API Routes (e.g., `/api/races`, `/api/simulate`, `/api/strategies`)
  - `app/page.tsx` — Main Frontend application page
- `config/` — Sequelize DB connection settings
- `models/` — Sequelize ORM data models
- `migrations/` — Database migrations
- `services/` — External F1 API client and Race Simulation logic
- `components/` — UI modular components (race selector, strategy builder, results view)

## Core Business Rules & Constraints
1. **API Integration & Cold Start:** Consumes `https://tech-challenge101.onrender.com`. Timeout set to 60s to account for Render free-tier cold starts.
2. **Simulation Engine:** Simple, deterministic, and transparent lap-by-lap breakdown (tyre degradation, pit stop time loss, stint calculation).
3. **API Validation & Error Handling:** Validate user strategy input before executing simulations. Return clear JSON error messages for invalid strategies or external API failures.
4. **Database Usage:** Persist user-created race strategies and simulation results in PostgreSQL.
5. **No Independent Decisions:** Subagents must present implementation plans and request user approval before modifying files.
# F1 Race Strategist - Project Memory

## Current Status
- Database: PostgreSQL (`f1_race_strategist`) in Docker, verified via HeidiSQL and Sequelize CLI (`db:migrate` up to date).
- UI/UX: Navbar extracted; language toggle added; setup instructions ready for `components/ui/navigation-tabs.tsx`.
- Architecture Transition: Moving from inline `fetch` in `app/page.tsx` to modular Custom Hooks (`/app/hooks`).

## Key Decisions & Architecture
- **Two-Step Simulation Flow**:
  1. `POST /api/strategies`: Persists `name`, `raceId`, `driverId`, `stints` (`simulation_result: null`). Returns strategy `id`.
  2. `POST /api/simulate`: Accepts `{ strategyId }`, executes degradation/pit-stop calculation, and updates `simulation_result` in DB (`persisted: true`).
- **Separation of Concerns**: Components in `/components` act as pure UI layers, while API calls and state management are encapsulated in `/app/hooks`.

## Learnings & Pitfalls to Avoid
- **Docker Dependency**: Docker Desktop must be running before starting Next.js (`npm run dev`) or HeidiSQL to avoid `ECONNREFUSED`.
- **Valid IDs & Lap Coverage**: Strategy execution requires valid API IDs (e.g., `race-01`) and stints covering 100% of race laps to prevent `RACE_NOT_FOUND` or `STRATEGY_INVALID`.
- **UI Persistence Gap**: Inline simulation on `app/page.tsx` does NOT write to PostgreSQL until the two-step API flow is hooked to the UI.


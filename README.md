# F1 Race Strategist — Technical Challenge

A full-stack web application that allows users to select an F1 race, analyze circuit details, build custom tyre pit-stop strategies, and run lap-by-lap simulations powered by an internal backend engine that consumes external F1 data.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started (Clone & Run)](#getting-started-clone--run)
  - [1) Clone the Repository](#1-clone-the-repository)
  - [2) Install Dependencies](#2-install-dependencies)
  - [3) Set Up Environment Variables](#3-set-up-environment-variables)
  - [4) Start PostgreSQL (Docker)](#4-start-postgresql-docker)
  - [5) Run Database Migrations](#5-run-database-migrations)
  - [6) Start the Development Server](#6-start-the-development-server)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [How the App Works](#how-the-app-works)
- [Database Justification](#database-justification)
- [Simulation Assumptions](#simulation-assumptions)
- [Troubleshooting](#troubleshooting)
- [Improvements with More Time](#improvements-with-more-time)

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) | Full-stack monolith (UI + API routes) |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling (F1-inspired pit-wall UI) |
| [PostgreSQL](https://www.postgresql.org/) | Relational database for persisted strategies |
| [Sequelize ORM](https://sequelize.org/) | Models, migrations, and queries |
| [Axios](https://axios-http.com/) | External API client with 60s timeout for Render cold starts |
| [Zod](https://zod.dev/) | Server-side schema validation |

---

## Prerequisites

Before running this project, make sure you have the following installed:

- **[Node.js](https://nodejs.org/)** `v18+` (Recommended `v20+`)
- **[npm](https://www.npmjs.com/)** (comes with Node.js)
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (recommended to run PostgreSQL locally)
- **[Git](https://git-scm.com/)**

---

## Getting Started (Clone & Run)

Follow these steps to get the project running locally from scratch.

### 1) Clone the Repository

```bash
git clone https://github.com/AndresAndrada/testsolvo.git
cd testsolvo
```

### 2) Install Dependencies

```bash
npm install
```

### 3) Set Up Environment Variables

Create a `.env` file in the root of the project. You can use the provided example as a reference:

```bash
cp .env.example .env
```

Update `.env` with your local values. The project expects the following variables:

```env
# PostgreSQL connection
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=f1_race_strategist
DB_USER=postgres
DB_PASSWORD=postgres

# External F1 API
F1_API_BASE_URL=https://tech-challenge101.onrender.com
F1_API_TIMEOUT_MS=60000
```

> **Note:** The app uses `config/database.ts` and `config/config.ts` with these variables. If you prefer a single connection string, you can also set `DATABASE_URL`, but the above are required for local development.

### 4) Start PostgreSQL (Docker)

If you don't have PostgreSQL running locally, use Docker to spin up a container:

```bash
docker run --name f1-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=f1_race_strategist \
  -p 5432:5432 \
  -d postgres:alpine
```

To start/stop it later:

```bash
docker start f1-postgres
docker stop f1-postgres
```

### 5) Run Database Migrations

Apply all Sequelize migrations to create the required tables:

```bash
npx sequelize-cli db:migrate
```

To check migration status:

```bash
npx sequelize-cli db:migrate:status
```

### 6) Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to use the app.

---

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create an optimized production build (runs TypeScript checks) |
| `npm run start` | Start the production server after building |
| `npm run lint` | Run ESLint |

---

## Architecture

```
app/                # Next.js App Router (UI + integrated API routes)
  api/              # Backend endpoints
  dashboard/        # Alternative dashboard view
  layout.tsx        # Global layout
  page.tsx          # Main application page
components/         # Reusable UI components
  ui/               # Shared UI primitives (tabs, etc.)
config/             # Sequelize database configuration
models/             # Sequelize models
migrations/         # Database migrations
services/           # Business logic, external API client, simulation engine
```

- **Unified Monolith:** Both frontend and backend live in the same Next.js app. API routes are under `app/api/`.
- **External Data:** Races, circuits, drivers, teams, and tyres are fetched from the external F1 API.
- **Persistent Data:** Only user-created strategies and their simulation results are stored in PostgreSQL.

---

## API Endpoints

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check for the API and external service status |
| `GET` | `/api/races` | List all available races |
| `GET` | `/api/races/[id]` | Get detailed race info including circuit data |
| `GET` | `/api/tyres` | List available tyre compounds |
| `GET` | `/api/drivers` | List all drivers |
| `GET` | `/api/teams` | List all teams |
| `POST` | `/api/simulate` | Run a simulation. Supports `limit`/`offset` for lap pagination. Can use `strategyId` to persist results |
| `GET` | `/api/strategies` | List saved strategies (supports `limit`/`offset`) |
| `POST` | `/api/strategies` | Create a new saved strategy |
| `GET` | `/api/strategies/[id]` | Get a specific saved strategy |
| `PUT` | `/api/strategies/[id]` | Update a saved strategy |
| `DELETE` | `/api/strategies/[id]` | Delete a saved strategy |

---

## How the App Works

1. **Select Race & Driver** – Choose a Grand Prix and a driver from the selectors. Race data (laps, temperature, rain probability, circuit) is loaded from the external API.
2. **Build Strategy** – Add stints, pick tyre compounds, and define lap ranges. The builder ensures consecutive coverage across the full race distance.
3. **Save & Simulate** – Use "Save & Simulate" to create a strategy in PostgreSQL (`POST /api/strategies`) and then simulate it by ID (`POST /api/simulate` with `strategyId`). The result is saved to `simulation_result`.
4. **View Results** – See totals, stint breakdown, and a paginated lap-by-lap view with infinite scroll.
5. **History** – Switch to "Saved Simulations" to browse all persisted strategies with infinite scroll.

> **Note:** Using "Simulate without saving" runs an inline simulation and does **not** write to the database.

---

## Database Justification

Although a database wasn't strictly required, PostgreSQL + Sequelize were added to:

1. **Persist Strategies:** Save user-created strategies and their lap-by-lap simulation results.
2. **Demonstrate Data Modeling:** Show clean relational design with a `strategies` table storing `name`, `race_id`, `driver_id`, `stints` (JSONB), and `simulation_result` (JSONB) with timestamps.

---

## Simulation Assumptions

The simulation engine is deterministic and lap-by-lap:

- **Tyre Degradation:** Linear degradation per stint based on the selected compound.
- **Pit Stop Loss:** Circuit `pitStopLoss` is applied when transitioning between stints.
- **Weather:** Rain probability from the race data affects lap times based on compound wet performance.
- **Full Coverage:** The strategy must cover all laps from lap 1 to the final lap with no gaps.
- **Valid Compounds:** Only compounds returned by `/api/tyres` are allowed.
- **Data-Driven:** Circuit parameters come from the external API.

---

## Troubleshooting

| Issue | Solution |
| --- | --- |
| **Port 5432 already in use** | Stop any existing PostgreSQL instance or change the port in `.env` and Docker. |
| **Cannot connect to DB** | Ensure the container is running (`docker ps`), check `.env` credentials, and verify PostgreSQL is accepting connections. |
| **Migrations fail** | Run `npx sequelize-cli db:migrate:status` to see applied/pending migrations. Make sure the DB exists and credentials are correct. |
| **External API timeout / slow first load** | The external API on Render can have cold starts. The client uses a 60s timeout. Try again after a moment. |
| **Race/Pilot not found when simulating with strategyId** | Use valid external IDs (e.g. `race-01`, `race-02`, etc.). Fetch real IDs from `GET /api/races` and `GET /api/drivers`. |
| **Strategy invalid (gaps/missing laps)** | Ensure stints are consecutive and cover from lap 1 to the last lap of the selected race. |
| **Build errors** | Run `npx tsc --noEmit` to see TypeScript errors, then fix them before `npm run build`. |

---

## Improvements with More Time

1. **Automated Testing** – Add unit tests for the simulation engine and E2E tests for the main flows.
2. **Improved Validation UX** – Show real-time stint coverage and lap counts in the UI before simulating.
3. **Better Caching** – Add server-side caching (Redis or in-memory) for external API responses to reduce cold-start impact.


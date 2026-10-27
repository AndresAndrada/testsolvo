# 🏎️ F1 Race Strategist — Technical Challenge

A full-stack web application that allows users to pick an F1 race, analyze circuit details, construct custom tyre pit-stop strategies, and run lap-by-lap simulations powered by an internal backend engine consuming external F1 data.

---

## 🚀 How to Run It

### Prerequisites
- **Node.js**: `v18+` (Recommended `v20+`)
- **Docker Desktop** (optional for PostgreSQL database container)

### Quick Start (Local Setup)

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd f1-race-strategist
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/f1_strategist
   EXTERNAL_F1_API_URL=https://tech-challenge101.onrender.com
   ```

4. **Start PostgreSQL Database (Docker):**
   ```bash
   docker run --name f1-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=f1_strategist -p 5432:5432 -d postgres:alpine
   ```

5. **Run Database Migrations:**
   ```bash
   npx sequelize-cli db:migrate
   ```

6. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS v4
- **Database & ORM**: PostgreSQL + Sequelize ORM
- **HTTP Client**: Axios (with 60-second timeouts for Render cold-starts)
- **Architecture**: Unified Full-Stack monolith (`/app` for React UI and `/app/api` for serverless API endpoints).

### Database Justification
Although a database was optional for this challenge, PostgreSQL + Sequelize were included to:
1. **Persist Strategy Simulations**: Save user-generated strategies and race results for historical comparison.
2. **Demonstrate Data Modeling**: Showcase clean relational design linking races, user strategies, and stint breakdowns.

---

## 📊 Simulation Assumptions

The backend simulation model is deterministic, transparent, and lap-by-lap focused:

1. **Tyre Degradation**: Calculated linearly per stint. Each lap adds degradation based on compound-specific degradation rates.
2. **Pit Stop Loss**: A fixed time penalty (retrieved from circuit parameters) is added for each pit stop transitioning between stints.
3. **Weather Factors**: Applied as a multiplier/offset to base lap times depending on track conditions per stint segment.
4. **Validation Rules**: Total laps across all stints must strictly equal the race's total distance. Must use valid available tyre compounds.

---

## 💡 What I'd Improve with More Time

1. **Side-by-Side Strategy Comparison**: Allow saving 2–3 different strategy variants and plotting their lap-time deltas on a single line chart.
2. **Interactive Telemetry Charts**: Integrate Chart.js/Recharts for visual degradation curves per stint.
3. **Enhanced Fallback & Caching**: Implement Server-Side Redis/In-Memory Caching for external API responses to eliminate initial Render cold-start waiting times.
4. **Automated Testing**: Add end-to-end (Playwright) and unit tests (Jest/Vitest) for the simulation engine edge cases.
# Greedy Pig

A web-based version of the Greedy Pig dice game, built with React (Vite), Node/Express and Supabase.

##Group members

| Member | Matric number | Contribution |
|---|---|
| Ayomipo Oluwaseun Majekodunmi | 23120112027 | Tutorial, branch integration |
| Oluwatosin Akindele | 23120112007 | Leaderboard |
| Chidera Stephan Ezetendu | 22120713202 | Levels |

## Three Improvements

| # | Improvement | Description |
|---|---|---|
| 1 | Interactive Tutorial | Step-by-step walkthrough at `/live-game/tutorial` that teaches the rules, accessible from the navbar |
| 2 | Leaderboard | Ranks players by score using Supabase, shown at `/leaderboard` |
| 3 | Levels | Difficulty tiers with different targets and bust rules |

### Difficulty Levels

Players choose a level on the Setup screen. Each level sets the target score, the dice numbers that bust a turn, and whether a bust also wipes banked points.

| Level | Name | Target | Bust on | Bust wipes banked |
|---|---|---|---|---|
| 1 | Piglet | 50 | 1 | No |
| 2 | Farm Hand | 100 | 1 | No |
| 3 | Hog Boss | 100 | 1, 2 | No |
| 4 | Greedy | 150 | 1, 2 | No |
| 5 | Legend | 100 | 1, 2 | Yes |

## Tech Stack

- React + Vite, React Router, Tailwind CSS
- Node.js + Express
- Supabase (PostgreSQL)

## How to Run

### Prerequisites

- Node.js 18 or newer
- A Supabase project (URL and keys)

### 1. Clone and install

```bash
git clone https://github.com/<owner>/<repo>.git
cd <repo>
npm install
```

### 2. Configure environment variables

Copy the template and fill in your own values:

```bash
copy .env.example .env      # Windows
cp .env.example .env        # macOS / Linux
```

| Variable | Description |
|---|---|
| `SUPABASE_URL` | https://nekucygigykdzmqjwwfc.supabase.co |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side key (Classified) |
| `PORT` | API port (default `5000`) |
| `JWT_SECRET` | (Classified) |

Match the names to those in `.env.example`. Never commit `.env`.

### 3. Set up the database

Run the SQL schema in the Supabase SQL Editor: server/schema.sql.

### 4. Start the app

Use two terminals from the project root:

| Terminal | Command | Purpose |
|---|---|---|
| 1 | `npm run server:dev` | Starts the API (nodemon) |
| 2 | `npm run dev` | Starts the frontend |

Open the URL shown by Vite (usually `http://localhost:5173`).

### Health checks

- `http://localhost:5000/health` confirms the API is running
- `http://localhost:5000/health/database` confirms the Supabase connection

## Project Structure

```
src/        React frontend (components, pages, assets)
server/     Express API (routes, controllers, Supabase config)
```

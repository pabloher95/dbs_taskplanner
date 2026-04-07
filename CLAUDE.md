## Project 

Multi-page daily planner app

## Tech Stack
- Next.js 14 (App Router)
- JavaScript (no TypeScript)
- Tailwind CSS (raw utilities, no component library)
- date-fns for date handling
- React Context + useReducer for global state (tasks)

## Design

- Minimal/clean theme: neutral colors, lots of whitespace, simple typography
- Overdue tasks (past deadline, not completed) get a red highlight/badge
- Design experiment branches: `design/warm-minimal`, `design/soft-motion`, `design/glass-editorial`

## Pages

1. **Homepage** (`/`) — dashboard with today's date, summary cards (today/overdue/active), upcoming tasks sorted by date then priority
2. **Task form** (`/tasks/new`) — title, deadline, time (optional), category, priority level, notes. Accepts `?date=` query param to pre-fill deadline.
3. **Task edit** (`/tasks/[id]/edit`) — edit or delete existing task
4. **Daily overview** (`/day/[date]`) — dynamic route
   - prev/next day arrow buttons with a date picker
   - "+ Add Task" button that pre-fills the date
   - priority/time sort toggle
5. **Week overview** (`/week`) — 7-day column view with priority/time sort toggle
6. **Board** (`/board`) — kanban board grouped by category with priority/time sort toggle (time sort is date-aware)

## Task Details

- Priority levels: High, Medium, Low
- Categories: job prep, workout, reading, general tasks (fixed set)

## Architecture

Feature-based folder structure:
- /app — Next.js App Router pages and layouts
- /features/tasks — task context, reducer, components
- /features/calendar — calendar/navigation components
- /components — shared UI components (BentoView, KanbanView, etc.)

## Coding Rules
- Use functional React components
- Use Tailwind utilities instead of custom CSS
- No testing for now
- `useSearchParams()` must be wrapped in a `<Suspense>` boundary (Vercel requirement)
- Use `noValidate` on forms with optional time inputs (Safari compatibility)
- Use `router.replace()` instead of `router.push()` after form submissions (Safari/WebKit compatibility)

## Commands

- npm run dev
- npm run build

## Data Model

Client-side state only: data lives in memory via useReducer, lost on page refresh. No database or localStorage.


## Project 

Multi-page daily planner app

## Tech Stack
- Next.js 14 (App Router)
- JavaScript (no TypeScript)
- Tailwind CSS (raw utilities, no component library)
- date-fns for date handling
- React Context + useReducer for global state (tasks, habits)

## Design

- Minimal/clean theme: neutral colors, lots of whitespace, simple typography
- Overdue tasks (past deadline, not completed) get a red highlight/badge

## Pages

1. **Homepage** (`/`) — dashboard with today's date and summary cards (today's tasks, all tasks)
2. **Task form** (`/tasks/new`) — title, deadline, category, priority level, notes section
3. **Daily overview** (`/day/[date]`) — dynamic route
   - prev/next day arrow buttons with a date picker
   - mini calendar widget in the sidebar for jumping to any date
4. **Week overview** (`/week`) — weekly summary view

Pages should have a shared layout with navigation.

## Task Details

- Priority levels: High, Medium, Low
- Categories: job prep, workout, reading, general tasks (fixed set)

## Architecture

Feature-based folder structure:
- /app — Next.js App Router pages and layouts
- /features/tasks — task-related components, hooks, context
- /features/habits — habit tracker components, hooks, context
- /features/calendar — calendar/navigation components
- /components — shared UI components (buttons, layout, etc.)

## Coding Rules
- Use functional React components
- Use Tailwind utilities instead of custom CSS
- No testing for now

## Commands

- npm run dev
- npm run build

## Data Model

Client-side state: data lives in memory


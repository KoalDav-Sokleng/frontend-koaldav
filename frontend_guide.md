# Frontend Guide - Project Goal

## Overview

A personal goal-tracking SPA called **KAOL DAV - Peak Performance**. Users manage goals, trips, savings, finances, and daily habits. Built with React 19 + Vite 8 + Tailwind CSS v4.

---

## Tech Stack

- **React 19** (JSX, no TypeScript)
- **Vite 8** with `@vitejs/plugin-react`
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed)
- **React Router v7** (`react-router-dom`)
- **Axios** — HTTP client behind the `apiFetch()` wrapper
- **Lucide React** + **React Icons** for icons
- **Oxlint** for linting (run with `npm run lint`)
- No state management library — state lives in React Context + custom hooks

---

## Project Structure

```
src/
  main.jsx                    # Entry point — BrowserRouter + AuthProvider wrap App
  App.jsx                     # Route definitions
  App.css                     # (minimal)
  index.css                   # Tailwind import + utility classes (no-scrollbar)

  api/
    client.js                 # Central fetch wrapper — apiFetch()

  context/
    AuthContext.jsx            # Global auth state (user, login, register, logout)

  components/
    Layout.jsx                # Sidebar + TopMenu shell, renders <Outlet />
    SideBar.jsx               # Left nav (Dashboard, Goal, Finance, Habit)
    TopMenu.jsx               # Top bar with search, Goal sub-nav tabs

  routes/
    PrivateRoute.jsx          # Auth guard — redirects to /login if not authenticated

  utils/
    formatters.js             # formatCurrency(), formatDate()

  features/
    auth/
      api/authApi.js          # login(), register(), logout(), getCurrentUser()
      hooks/useAuth.js        # Convenience hook wrapping AuthContext
      components/LoginForm.jsx
      components/RegisterForm.jsx
      LoginPage.jsx
      RegisterPage.jsx
      AuthLayout.jsx

    dashboard/
      api/dashboardApi.js     # getDashboardSummary()
      hooks/useDashboard.js   # Fetches summary on mount
      components/DashboardSummary.jsx  # 4-card grid (goals, trips, saved, streak)
      DashboardPage.jsx

    goal/
      api/goalApi.js          # Project goals + milestones + focus sessions
      hooks/useProjectGoals.js  # Goal state + CRUD (create, addMilestone, completeMilestone, logFocusSession)
      hooks/useAmbientSound.js  # Web Audio focus sounds (rain / brown noise / hum) — synthesized, no audio files
      utils/goalHelpers.js      # Progress derivation: milestoneProgress(), goalProgress(), milestoneLoggedMinutes()
      GoalPage.jsx            # Nested routes: Project | Trip | Saving tabs
      components/ProjectGoalTab.jsx
      components/MilestoneRow.jsx  # Single milestone row — complete toggle + focus session logging
      components/TripTab.jsx
      components/SavingTab.jsx

    finance/
      api/financeApi.js
      hooks/useFinanceOverview.js
      components/FinanceSummaryCard.jsx
      FinancePage.jsx

    habit/
      api/habitApi.js
      hooks/useHabits.js
      components/HabitListItem.jsx
      HabitPage.jsx
```

---

## Routing

```
/login          → LoginPage (no layout)
/register       → RegisterPage (no layout)
/               → Layout shell
  /             → DashboardPage
  /goal         → GoalPage → ProjectGoalTab (index)
  /goal/trip    → GoalPage → TripTab
  /goal/saving  → GoalPage → SavingTab
  /finance      → FinancePage
  /habit        → HabitPage
```

Auth guards via `PrivateRoute` are currently **disabled** in `App.jsx` for development.

---

## API Layer

All backend calls go through `src/api/client.js`:

```js
import { apiFetch } from "../api/client";

// GET with auth (default)
const data = await apiFetch("/dashboard/summary");

// POST with body
const data = await apiFetch("/goals", { method: "POST", body: { title: "Run 5k" } });

// Public route (no token sent)
const data = await apiFetch("/auth/login", { method: "POST", body: creds, auth: false });
```

- Base URL: `VITE_API_URL` env var, defaults to `http://localhost:8081/api` (Spring Boot backend)
- Built on **Axios** — request interceptor attaches the JWT, response interceptor normalizes errors
- Auth token stored in `localStorage` as `accessToken`
- On 401 response, token is removed automatically
- Errors are thrown as a single `Error` whose message comes from `error.response?.data?.message`

### Goal API endpoints

```
GET    /goals/projects                                  → list project goals (with milestones)
POST   /goals/projects                                  → create goal { title, deadline }
POST   /goals/projects/:goalId/milestones               → add milestone { title }
PATCH  /goals/projects/:goalId/milestones/:id/complete   → mark milestone complete
POST   /milestones/:milestoneId/sessions                 → log focus time { durationMinutes }
```

---

## Auth Flow

- `AuthProvider` wraps the app in `main.jsx`
- On mount, if a token exists, it calls `getCurrentUser()` to restore the session
- `useAuth()` hook gives: `{ user, loading, isAuthenticated, login, register, logout }`
- Login/register store the JWT in `localStorage`

---

## Project Goals & Focus Sessions

The goal feature is the most developed area. Domain rules:

- Milestones have only two statuses on the backend: `IN_PROGRESS` / `COMPLETED` — there is no stored percentage
- UI progress is **derived** in `utils/goalHelpers.js`: a milestone hits 100% when marked complete, otherwise it shows logged focus minutes out of **60** (the 60-minute focus rule), capped at 99%
- Goal progress = average of its milestones' derived progress
- Focus sessions are logged via `useProjectGoals().logFocusSession(goalId, milestoneId, { durationMinutes })`, which appends the returned session to local state optimistically-free (server response is source of truth)
- `MilestoneRow.jsx` renders one milestone: complete checkbox, derived %, and a focus-timer entry point
- `useAmbientSound.js` synthesizes focus ambience (rain, brown noise, low hum) with the Web Audio API — no audio assets shipped

---

## Styling Conventions

- **Tailwind utility classes only** — no CSS modules, no styled-components
- **Color palette**: primary purple `#6C63FF`, backgrounds `#F4F2FF`, grays via Tailwind defaults
- **Responsive**: mobile-first with `lg:` breakpoint for sidebar visibility
- **Components use Tailwind `className` directly** — no `cn()` helper or `clsx` in use
- Custom utility: `.no-scrollbar` (defined in `index.css`)

---

## Feature Pattern

Every feature follows the same structure:

```
features/<name>/
  api/<name>Api.js        — API functions using apiFetch
  hooks/use<Name>.js      — Custom hook for data fetching
  utils/*.js              — (optional) pure helpers, e.g. progress calculations
  components/*.jsx        — Presentational components
  <Name>Page.jsx          — Page-level component
```

When adding a new feature:
1. Create `api/<name>Api.js` with functions calling `apiFetch`
2. Create `hooks/use<Name>.js` for stateful data fetching
3. Create `components/` for presentational pieces
4. Create `<Name>Page.jsx` as the route entry
5. Add route in `App.jsx` inside the `<Layout />` parent route

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8081/api` | Backend base URL (Spring Boot) |
| `VITE_MOCK_AUTH` | `true` | Mock auth bypass (dev only) |

---

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run oxlint
npm run preview  # Preview production build
```

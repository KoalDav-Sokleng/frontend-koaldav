# Frontend Guide - Project Goal
## Overview

A personal goal-tracking SPA called **KAOL DAV - Peak Performance**. Users manage goals, trips, savings, finances, and daily habits. Built with React 19 + Vite 8 + Tailwind CSS v4, talking to a **Spring Boot backend** (`http://localhost:8081/api`).

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
  App.jsx                     # Just renders <AppRoutes /> — no routes here anymore
  index.css                   # Tailwind import + utility classes (no-scrollbar)

  api/
    client.js                 # THE bridge to the backend — apiFetch() + Axios instance

  context/
    AuthContext.jsx           # Global auth state; calls authApi on login/register/logout

  components/
    Layout.jsx                # Sidebar + TopMenu shell, renders <Outlet />
    SideBar.jsx               # Left nav (Dashboard, Goal, Finance, Habit)
    TopMenu.jsx               # Top bar with search, Goal sub-nav tabs

  routes/
    AppRoutes.jsx             # ALL route definitions live here now
    PrivateRoute.jsx          # Auth guard — exists but NOT used in AppRoutes (dev mode)

  utils/
    formatters.js             # formatCurrency(), formatDate()

  features/
    auth/
      api/authApi.js          # login(), register(), logout(), getCurrentUser()
      hooks/useAuth.js        # Thin wrapper around AuthContext's useAuthContext
      components/LoginForm.jsx
      components/RegisterForm.jsx
      LoginPage.jsx
      RegisterPage.jsx
      AuthLayout.jsx

    dashboard/
      api/dashboardApi.js     # getDashboardSummary() → GET /dashboard/summary
      hooks/useDashboard.js   # Fetches summary on mount
      components/DashboardSummary.jsx  # 4-card grid (goals, trips, saved, streak)
      DashboardPage.jsx

    goal/
      api/goalApi.js          # Full CRUD: goals, milestones, focus sessions ← LIVE
      hooks/useProjectGoals.js  # Goal state + CRUD (refresh, create/update/delete goal,
                                # add/update/delete milestone, complete, logFocusSession) ← LIVE
      hooks/useAmbientSound.js  # Web Audio focus sounds — synthesized, no audio files
      utils/goalHelpers.js      # Derived progress: goalProgress(), goalStatusLabel(),
                                # milestoneLoggedMinutes() (60-min focus rule)
      GoalPage.jsx            # Nested routes: Project | Trip | Saving tabs
      components/ProjectGoalTab.jsx    # List → detail → focus pages, modals, search ← LIVE
      components/MilestoneRow.jsx      # Complete toggle, focus timer, edit/delete ← LIVE
      components/TripTab.jsx
      components/SavingTab.jsx

    finance/
      api/financeApi.js       # getFinanceOverview() → GET /finance/overview
      hooks/useFinanceOverview.js
      components/FinanceSummaryCard.jsx
      FinancePage.jsx

    habit/
      api/habitApi.js         # getHabits(), createHabit(), toggleHabitDone()
      hooks/useHabits.js
      components/HabitListItem.jsx
      HabitPage.jsx
```

> Empty folders `src/app/`, `src/service/`, `src/hooks/` exist but are unused — everything lives under `features/`.

---

## Routing

All routes are defined in `src/routes/AppRoutes.jsx` (moved out of `App.jsx`):

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

`PrivateRoute` still exists but is **not wrapped around routes** in `AppRoutes.jsx` yet — add `<Route element={<PrivateRoute />}>` inside the Layout route to enable guarding.

---

## How the Frontend Talks to the Backend

Every backend call follows the same chain. There are exactly **3 layers**, and only layer 3 ever touches HTTP:

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. COMPONENT                    (UI — no fetching logic)            │
│     ProjectGoalTab.jsx / MilestoneRow.jsx                            │
│       │  calls createGoal(), completeMilestone(), etc.               │
│       ▼                                                              │
│  2. CUSTOM HOOK                   (state + orchestration)            │
│     useProjectGoals.js                                               │
│       │  calls functions from features/goal/api/goalApi.js           │
│       ▼                                                              │
│  3. FEATURE API MODULE            (endpoint definitions)             │
│     goalApi.js — one function per endpoint                           │
│       │  all of them call apiFetch(path, options)                    │
│       ▼                                                              │
│  4. src/api/client.js             (the ONLY place that knows Axios)  │
│     apiFetch() → Axios instance → http://localhost:8081/api/...      │
└─────────────────────────────────────────────────────────────────────┘
```

### The single entry point: `src/api/client.js`

This is **the file responsible for talking to the backend**. Everything else goes through its `apiFetch()`:

```js
import { apiFetch } from "../api/client";

const data = await apiFetch("/goals/projects");                       // GET (default)
await apiFetch("/goals/projects", { method: "POST", body: payload }); // POST
await apiFetch("/auth/login", { method: "POST", body: creds, auth: false }); // public
```

What it does internally:

1. Creates one shared **Axios instance** with `baseURL = VITE_API_URL` (falls back to `http://localhost:8081/api`)
2. **Request interceptor**: reads `accessToken` from `localStorage` and attaches `Authorization: Bearer <token>` — unless the call passed `auth: false`
3. **Response interceptor**:
   - On **401** → removes the token from `localStorage` (session expired)
   - On any error → throws a single normalized `Error` whose message comes from `error.response?.data?.message`
4. Returns `res.data` directly, so callers get clean JSON — never an Axios response object

### Which files talk to the backend (per feature)

| Feature | API file (endpoints) | Hook (fetch + state) | Component using it | Status |
|---|---|---|---|---|
| **Goals / Milestones / Focus sessions** | `features/goal/api/goalApi.js` | `hooks/useProjectGoals.js` | `ProjectGoalTab.jsx`, `MilestoneRow.jsx` | ✅ Live (full CRUD + focus timer) |
| **Auth** | `features/auth/api/authApi.js` | `context/AuthContext.jsx` + `hooks/useAuth.js` | `LoginForm`, `RegisterForm` | ✅ Live (mock flag currently off) |
| Dashboard | `features/dashboard/api/dashboardApi.js` | `hooks/useDashboard.js` | `DashboardSummary.jsx` | Endpoint coded; needs `/dashboard/summary` on backend |
| Finance | `features/finance/api/financeApi.js` | `hooks/useFinanceOverview.js` | `FinanceSummaryCard.jsx` | Endpoint coded; needs `/finance/overview` on backend |
| Habits | `features/habit/api/habitApi.js` | `hooks/useHabits.js` | `HabitListItem.jsx` | Endpoints coded; needs `/habits/*` on backend |

### Request lifecycle example — logging a focus session

1. User clicks **Start Focus** on a milestone in `MilestoneRow.jsx`, picks a duration (or custom minutes) in `FocusDurationModal`
2. `ProjectGoalTab` navigates to `FocusPage` — a full-screen timer (SVG countdown ring) with pause/resume and ambient background sounds via `useAmbientSound`
3. On exit, it calls `logFocusSession(goalId, milestoneId, { durationMinutes })` from `useProjectGoals()`
4. The hook delegates to `goalApi.logFocusSession()` → `apiFetch("/milestones/:milestoneId/sessions", { method: "POST", body: { durationMinutes } })`
5. `client.js` attaches the JWT and POSTs to `http://localhost:8081/api/milestones/:milestoneId/sessions`
6. On success, the hook appends the returned session into the milestone's `focusSessions` in local state — **the server response is the source of truth** — the goal re-renders with the newly logged minutes reflected
7. Progress % is never fetched — it is derived locally in `utils/goalHelpers.js`

### Data refresh pattern

Hooks fetch on mount (`useEffect`) and expose a `refresh()` (or re-fetch on next mount). Mutations update local state from the **server's response** instead of refetching the whole list:

```js
// useProjectGoals.js — optimistic-free: wait for server, then append
const createGoal = async (payload) => {
  const goal = await goalApi.createProjectGoal(payload); // POST first
  setGoals((prev) => [{ ...goal, milestones: [] }, ...prev]); // then update state
};
```

---

## API Layer — Endpoint Reference

Base URL: `VITE_API_URL`, currently `http://localhost:8081/api`.

### Goal endpoints (implemented, live)

```
GET    /goals/projects                                    → list of project goals (with milestones + focusSessions)
GET    /goals/projects/:goalId                            → single project goal
POST   /goals/projects                                    → create goal { title, deadline }
PUT    /goals/projects/:goalId                            → update goal { title, deadline }
DELETE /goals/projects/:goalId                            → delete goal
POST   /goals/projects/:goalId/milestones                 → add milestone { title }
PUT    /goals/projects/:goalId/milestones/:id             → update milestone { title }
DELETE /goals/projects/:goalId/milestones/:id             → delete milestone
PATCH  /goals/projects/:goalId/milestones/:id/complete     → mark milestone complete
POST   /milestones/:milestoneId/sessions                  → log focus time { durationMinutes }
```

Mapped in `goalApi.js`: `getProjectGoals()`, `getProjectGoal()`, `createProjectGoal()`, `updateProjectGoal()`, `deleteProjectGoal()`, `addMilestone()`, `updateMilestone()`, `deleteMilestone()`, `completeMilestone()`, `logFocusSession()`.

### Auth endpoints

```
POST   /auth/login     { email, password }        → { token, user }   (auth: false)
POST   /auth/register  { name, email, password }  → { token, user }   (auth: false)
GET    /auth/me                                   → current user
POST   /auth/logout
```

### Other feature endpoints (defined frontend-side)

```
GET    /dashboard/summary
GET    /finance/overview
GET    /habits          POST /habits        POST /habits/:id/toggle { date }
```

---

## Auth Flow

- `AuthProvider` wraps the app in `main.jsx`
- On mount, if a token exists in `localStorage`, it calls `getCurrentUser()` (`GET /auth/me`) to restore the session; failure clears the token
- `useAuth()` (from `features/auth/hooks/useAuth.js`) gives: `{ user, loading, isAuthenticated, login, register, logout }`
- Login/register store the JWT as `accessToken` in `localStorage`; every later request picks it up automatically via the interceptor in `client.js`

---

## Project Goals & Focus Sessions

The goal feature is the most developed area. Domain rules:

- Milestones have only two statuses on the backend: `IN_PROGRESS` / `COMPLETED` — there is no stored percentage
- UI progress is **derived** in `utils/goalHelpers.js` (`milestoneLoggedMinutes()`): a milestone's focus time is summed from its `focusSessions` out of the **60-minute focus rule**, capped at 99% unless explicitly marked complete
- Goal progress = average of its milestones' derived progress (`goalProgress()`); `goalStatusLabel()` drives the badges
- The **focus timer** is a full in-app flow: `ProjectGoalTab` opens `FocusDurationModal` → `FocusPage` (countdown ring, pause/resume, ambient sound) → `logFocusSession()` → `POST /milestones/:id/sessions`; the returned session is appended into local state
- `MilestoneRow.jsx` renders one milestone: complete checkbox, logged minutes, remaining-time hint, and Start Focus / edit / delete controls
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
  api/<name>Api.js        — endpoint functions calling apiFetch (ONLY place naming URLs)
  hooks/use<Name>.js      — custom hook: fetch on mount + mutation helpers
  utils/*.js              — (optional) pure helpers, e.g. progress calculations
  components/*.jsx        — presentational components (call the hook, render data)
  <Name>Page.jsx          — page-level component
```

When adding a new feature:
1. Create `api/<name>Api.js` with one function per endpoint, each calling `apiFetch`
2. Create `hooks/use<Name>.js` for stateful data fetching (follow `useProjectGoals.js` as the reference implementation)
3. Create `components/` for presentational pieces
4. Create `<Name>Page.jsx` as the route entry
5. Add the route in `src/routes/AppRoutes.jsx` inside the `<Layout />` parent route

**Rule of thumb:** components never import `axios` or `client.js` directly — they always go through the feature's `api/` + `hooks/` layers.

---

## Environment Variables

Current `.env`:

| Variable | Current value | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8081/api` | Backend base URL (Spring Boot) |
| `VITE_MOCK_AUTH` | commented out (= false) | Mock login bypass — real `/auth/*` is now live |
| `VITE_MOCK_GOALS` | `false` | Legacy mock-goals flag |

---

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run oxlint
npm run preview  # Preview production build
```

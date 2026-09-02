# Habit — Backend Connection Guide

This document explains how the **Habit** feature is wired up in this project and
exactly what is needed to connect it to the backend (Spring Boot on `8081`).

## Full project structure

```
project-goal/
├── .env                        # Runtime env vars (VITE_API_URL, VITE_MOCK_AUTH)
├── .env.example                # Template for .env
├── .gitignore
├── .oxlintrc.json              # Linter config (react hooks rules)
├── index.html                  # Vite SPA entry point
├── package.json                # React 19, Vite 8, Tailwind 4, Axios, etc.
├── vite.config.js              # Vite plugins + dev server (port 5173)
├── Habit.md                    # <- you are here
├── README.md
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── backend/                    # Stub — only node_modules, no source files
│
└── src/
    ├── main.jsx                # Entry: StrictMode > BrowserRouter > AuthProvider > App
    ├── App.jsx                 # Root component: renders <AppRoutes />
    ├── App.css                 # Legacy/global CSS
    ├── index.css               # Tailwind import + no-scrollbar utility
    │
    ├── api/
    │   └── client.js           # Axios HTTP client (baseURL, JWT interceptor, 401 handling)
    │
    ├── assets/
    │   ├── hero.png
    │   ├── koaldav.png
    │   ├── koaldav-remove.png
    │   ├── Koaldavpic.png
    │   ├── logo.png
    │   ├── react.svg
    │   └── vite.svg
    │
    ├── components/             # Shared UI shell
    │   ├── Layout.jsx          # App shell: SideBar + TopMenu + <Outlet />
    │   ├── SideBar.jsx         # Left nav: Dashboard, Goal, Finance, Habit + logout
    │   └── TopMenu.jsx         # Top bar: search, notifications, Goal sub-nav tabs
    │
    ├── context/
    │   └── AuthContext.jsx     # Global auth: user, login(), register(), logout(), JWT persistence
    │
    ├── routes/
    │   ├── AppRoutes.jsx       # All routes: public + protected (Layout shell)
    │   └── PrivateRoute.jsx    # Auth guard (redirects to /login)
    │
    ├── utils/
    │   └── formatters.js       # formatCurrency (USD) + formatDate (en-US)
    │
    └── features/
        │
        ├── auth/               # Authentication
        │   ├── AuthLayout.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── api/
        │   │   └── authApi.js          # login, register, getCurrentUser, logout + mock mode
        │   ├── components/
        │   │   ├── LoginForm.jsx
        │   │   └── RegisterForm.jsx
        │   └── hooks/
        │       ├── useAuth.js          # Thin re-export of AuthContext
        │       └── useLogin.js         # Login form state machine
        │
        ├── dashboard/          # Placeholder
        │   └── DashboardPage.jsx
        │
        ├── finance/            # Finance overview (wired to backend)
        │   ├── FinancePage.jsx
        │   ├── api/
        │   │   └── financeApi.js       # GET /finance/overview
        │   ├── components/
        │   │   └── FinanceSummaryCard.jsx
        │   └── hooks/
        │       └── useFinanceOverview.js
        │
        ├── goal/               # Placeholder
        │   └── GoalPage.jsx
        │
        └── habit/              # *** HABIT FEATURE (this doc) ***
            ├── api/
            │   └── habitApi.js         # getHabits, createHabit, toggleHabitDone
            ├── hooks/
            │   └── useHabits.js        # Fetch on mount, returns { habits, loading, error }
            └── components/
                └── HabitPage.jsx       # Full UI (615 lines): list, modals, confetti, progress
```

## How the frontend talks to the backend

All requests go through the shared HTTP client: `src/api/client.js`.

- Base URL: `VITE_API_URL` from `.env` (default `http://localhost:8081/api`).
- Uses `axios` under the hood with request/response interceptors.
- A JWT is attached automatically via the `Authorization: Bearer <token>`
  header when the user is logged in (token read from `localStorage`).
- On `401` the token is removed from `localStorage` automatically.
- Use the `apiFetch(path, { method, body, auth })` helper.

```js
import { apiFetch } from "../../../api/client";
```

## Current API layer (`src/features/habit/api/habitApi.js`)

```js
export const getHabits = () => apiFetch("/habits");
export const createHabit = (payload) => apiFetch("/habits", { method: "POST", body: payload });
export const toggleHabitDone = (id, date) => apiFetch(`/habits/${id}/toggle`, { method: "POST", body: { date } });
```

> **Note:** `HabitPage.jsx` currently uses **hard-coded in-memory state** and does
> NOT call these functions yet. The functions above are the "ready to connect"
> contract that the page should be migrated onto. No `updateHabit` (PUT) or
> `deleteHabit` (DELETE) functions exist yet.

## Current data-loading hook (`src/features/habit/hooks/useHabits.js`)

```js
export const useHabits = () => { habits, loading, error }
```

- Fetches habits from the backend on mount via `getHabits()`.
- Returns `{ habits, loading, error }`.
- Read-only — no mutation helpers (create, edit, delete, toggle).

## Internal components inside `HabitPage.jsx`

The page component includes these internal (non-exported) sub-components:

| Component | Purpose |
|---|---|
| `ProgressBar` | Shows today's completion percentage and habit count |
| `HabitCelebrationModal` | Full-screen modal celebrating 100% daily completion with confetti |
| `CustomTimeSelect` | Custom dropdown for selecting reminder times |
| `HabitModal` | Modal form for creating or editing a habit (title, category, target, reminder, start date) |

Constants: `HABIT_TYPES` (5 categories: water, workout, read, study, other) and `TIME_OPTIONS` (11 reminder time slots).

## Suggested backend REST contract

Design the Spring Boot controller to match these routes under `/api`:

| Method | Path               | Body / Params                              | Purpose                        |
| ------ | ------------------ | ------------------------------------------ | ------------------------------ |
| GET    | `/api/habits`      | —                                          | List the user's habits         |
| POST   | `/api/habits`      | habit payload (Table below)                | Create a habit                 |
| PUT    | `/api/habits/{id}` | habit payload                              | Edit a habit                   |
| DELETE | `/api/habits/{id}` | —                                          | Delete a habit                 |
| POST   | `/api/habits/{id}/toggle` | `{ "date": "YYYY-MM-DD" }`           | Mark habit done for a date     |

### Suggested data model (backend entity ↔ frontend field)

The frontend currently renders these fields from the in-memory objects:

```js
{
  id: 1,                 // Long
  title: "Drink Water",  // String  (habit name)
  target: "Daily goal: 8 glasses", // String (description / target text)
  type: "water",         // Enum/String: water | workout | read | study | other
  streak: 12,            // Integer (calculated on backend)
  completed: false,      // Boolean (done for the current date)
  reminder: "09:00 AM",  // String (optional reminder time)
  // startDate is collected by the modal but not yet persisted
}
```

## What "ready to connect" means (checklist)

- [ ] `HabitPage.jsx` replaces its in-memory `useState` array with the
      `useHabits()` hook (`src/features/habit/hooks/useHabits.js`).
- [ ] Create / Edit / Delete / toggle handlers call `habitApi` and refresh the list.
- [ ] Add `updateHabit` (PUT) and `deleteHabit` (DELETE) to `habitApi.js`
      once the backend exposes those endpoints.

## Existing conventions to follow

- Reuse the shared client and auth — never hand-roll `fetch`/axios per feature.
- API functions live in `<feature>/api/<feature>Api.js`.
- Data-loading logic lives in `<feature>/hooks/`.
- UI-only rendering lives in `<feature>/components/`.
- Follow the same error/loading pattern used in
  `src/features/finance/hooks/useFinanceOverview.js`.

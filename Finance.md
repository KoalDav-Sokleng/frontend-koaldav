# Finance Feature — Backend Integration Guide

## Overview

The Finance module is part of **KAOL DAV**, a personal productivity app (React 19 + Vite frontend, Express backend). It lets authenticated users track expenses, view monthly spending trends, and analyze spending by category. The frontend currently runs on seed/mock data and is ready to connect to a REST API.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 4, Recharts, React Router 7 |
| HTTP Client | Axios (`src/api/client.js`) — base URL `VITE_API_URL` (default `http://localhost:8081/api`) |
| Auth | JWT stored in `localStorage` as `accessToken`, auto-attached via Axios request interceptor |
| Backend | Express (in `backend/` directory) |
| Env Flags | `VITE_API_URL`, `VITE_MOCK_AUTH` (`"true"` to bypass backend) |

---

## API Endpoints Expected by Frontend

The frontend API layer is defined in `src/features/finance/api/financeApi.js`. All endpoints are prefixed with the base URL.

### 1. `GET /finance/overview`

Returns aggregated finance data for the dashboard charts.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `year` | number | Filter by year (e.g. `2026`) |

**Response (`200 OK`):**
```json
{
  "monthlyData": [
    { "month": "Jan", "amount": 320 },
    { "month": "Feb", "amount": 410 }
  ],
  "categoryData": [
    { "name": "Food", "value": 180, "color": "#6C63FF", "icon": "🍔" }
  ]
}
```

---

### 2. `GET /finance/expenses`

Returns a paginated/filtered list of the user's expenses.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `category` | string | No | Filter by category name (e.g. `"Food"`) |
| `year` | number | No | Filter by year |
| `month` | number | No | Filter by month (1-12) |
| `page` | number | No | Page number (default `1`) |
| `limit` | number | No | Items per page (default `20`) |

**Response (`200 OK`):**
```json
{
  "expenses": [
    {
      "id": 1,
      "icon": "🍔",
      "title": "Lunch",
      "category": "Food",
      "note": "Lunch with friends",
      "date": "2026-08-25",
      "amount": 5.0
    }
  ],
  "total": 4,
  "page": 1,
  "limit": 20
}
```

---

### 3. `POST /finance/expenses`

Creates a new expense record for the authenticated user.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Lunch",
  "amount": 5.0,
  "category": "Food",
  "date": "2026-08-25",
  "note": "Lunch with friends"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | string | Yes | Non-empty |
| `amount` | number | Yes | `> 0`, max 2 decimal places |
| `category` | string | Yes | Must be one of the allowed categories (see below) |
| `date` | string | Yes | ISO date string `YYYY-MM-DD` |
| `note` | string | No | Free-text, max 500 chars |

**Response (`201 Created`):**
```json
{
  "id": 5,
  "icon": "🍔",
  "title": "Lunch",
  "category": "Food",
  "note": "Lunch with friends",
  "date": "2026-08-25",
  "amount": 5.0
}
```

---

### 4. `DELETE /finance/expenses/:id`

Deletes an expense by ID (must belong to the authenticated user).

**Headers:** `Authorization: Bearer <token>`

**Response (`200 OK`):**
```json
{ "success": true }
```

**Error (`404 Not Found`):**
```json
{ "message": "Expense not found" }
```

---

## Allowed Categories

These are the categories defined in the frontend. The backend should enforce this list.

| Category | Icon | Color (for charts) |
|----------|------|---------------------|
| Food | `🍔` | `#6C63FF` |
| Shopping | `🛍️` | `#9C8FFF` |
| Transportation | `🚗` | `#C4BEFF` |
| Entertainment | `🎬` | `#DDD9FF` |
| Bills | `💡` | `#7C6FFF` |
| Education | `📚` | `#A89FFF` |
| Health | `💊` | `#B5AEFF` |
| Other | `📦` | `#EDE9FE` |

---

## Data Model

### `Expense` Entity

```
id            : Long (auto-generated, primary key)
userId        : Long (foreign key → User, required)
title         : String (not null, max 100)
amount        : Decimal(10,2) (not null, min 0.01)
category      : String (not null, enum from allowed list)
date          : Date (not null)
note          : String (nullable, max 500)
createdAt     : Timestamp (auto-generated)
updatedAt     : Timestamp (auto-generated)
```

### `User` Entity (reference)

```
id            : Long (auto-generated, primary key)
name          : String (not null)
email         : String (not null, unique)
passwordHash  : String (not null)
createdAt     : Timestamp
```

---

## Monthly Data Logic

The `monthlyData` array returned by `/finance/overview` should represent **total expenses per month** for a given year. The response always includes all 12 months (Jan–Dec), with `0` for months that have no expenses.

```
month   → abbreviated month name ("Jan", "Feb", …, "Dec")
amount  → SUM of all expense amounts for that month in the given year
```

---

## Category Data Logic

The `categoryData` array represents **total spending per category** for the selected time period. The response should include only categories the user has spent in (non-zero totals).

```
name   → category name (matches the enum)
value  → SUM of amounts for that category
color  → hex color from the table above
icon   → emoji from the table above
```

---

## Frontend File Map

```
src/
├── api/client.js                              # Axios instance, JWT interceptor, apiFetch()
├── features/finance/
│   ├── FinancePage.jsx                        # Main page: charts, expense list, year selector
│   ├── api/financeApi.js                      # API functions (getFinanceOverview, getExpenses, createExpense, deleteExpense)
│   ├── hooks/useFinanceOverview.js            # Currently mock — to be replaced with real API calls
│   └── components/
│       ├── AddExpenseModal.jsx                 # Modal form: title, amount, category, date, description
│       └── FinanceSummaryCard.jsx              # Reusable summary card (label + value)
├── context/AuthContext.jsx                     # Auth state, provides user object with { id, name, email }
├── utils/formatters.js                         # formatCurrency(), formatDate()
└── routes/AppRoutes.jsx                        # /finance route → <FinancePage />
```

---

## Auth Flow

1. User logs in via `POST /auth/login` → receives `{ token, user }`.
2. Token is stored in `localStorage` as `accessToken`.
3. Every finance API request includes `Authorization: Bearer <token>` via Axios interceptor.
4. On `401` response, the interceptor clears the token. The frontend redirects to `/login`.

---

## Environment Variables

```
# .env
VITE_API_URL=http://localhost:8081/api
VITE_MOCK_AUTH=true          # "true" = skip real backend auth
```

---

## Backend Implementation Checklist

- [ ] Set up Express server with CORS, JSON body parser
- [ ] Create `Expense` model/migration (with foreign key to `User`)
- [ ] Implement JWT middleware to protect `/finance/*` routes
- [ ] `GET  /finance/overview` — aggregate monthly totals + category totals for the authenticated user
- [ ] `GET  /finance/expenses` — list expenses with filtering (category, year, month) and pagination
- [ ] `POST /finance/expenses` — validate input, auto-set `icon` from category, return created expense
- [ ] `DELETE /finance/expenses/:id` — verify ownership before deleting
- [ ] Seed endpoint or migration for dev data (optional)

---

## Notes

- The `icon` field on expenses is derived from the category on the backend. The frontend sends category + raw fields; the backend should attach the correct emoji icon in the response (or the frontend can derive it — see `CATEGORY_ICONS` map in `FinancePage.jsx:36`).
- Dates are stored and transmitted as ISO `YYYY-MM-DD` strings, but displayed as `"Aug 25, 2026"` in the UI via `formatDate()`.
- Amounts are always in USD with 2 decimal precision.
- The `financeApi.js` functions use `body` as the key for request data in `apiFetch()`, which maps to Axios's `data` — this is already wired correctly.

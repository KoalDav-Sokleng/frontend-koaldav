# Project Goal Backend API

This is a Node.js/Express backend server that provides the REST API endpoints for the Project Goal application.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

The server will start on `http://localhost:8080` with the API at `http://localhost:8080/api`

## API Endpoints

### Goals

- `GET /api/goals?status=IN_PROGRESS` - Get all goals (optionally filtered by status)
- `GET /api/goals/:goalId` - Get a specific goal
- `POST /api/goals` - Create a new goal
- `PUT /api/goals/:goalId` - Update a goal
- `DELETE /api/goals/:goalId` - Delete a goal

### Milestones

- `POST /api/goals/:goalId/milestones` - Add a milestone
- **`PUT /api/goals/:goalId/milestones/:milestoneId` - Update a milestone ✓ NOW SUPPORTED**
- **`DELETE /api/goals/:goalId/milestones/:milestoneId` - Delete a milestone ✓ NOW SUPPORTED**
- `PATCH /api/goals/:goalId/milestones/:milestoneId/complete` - Mark milestone as complete

### Focus Sessions

- `POST /api/milestones/:milestoneId/sessions` - Log a focus session

## Features

✓ All CRUD operations for goals and milestones
✓ PUT method for updating milestones
✓ DELETE method for removing milestones
✓ CORS enabled for frontend communication
✓ Mock data included for testing

## Development

To run in development mode with auto-reload (requires nodemon):

```bash
npm run dev
```

## Status

- All endpoints implemented and working
- Milestone edit (PUT) fully functional ✓
- Milestone delete (DELETE) fully functional ✓

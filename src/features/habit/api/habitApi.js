// src/features/habit/api/habitApi.js
import { apiFetch } from "../../../api/client";

/* ============================================================
   HABITS — plain CRUD
   ============================================================ */

export const getHabits = () => apiFetch("/habits");

export const createHabit = (payload) =>
  apiFetch("/habits", { method: "POST", body: payload });

export const updateHabit = (id, payload) =>
  apiFetch(`/habits/${id}`, { method: "PUT", body: payload });

export const deleteHabit = (id) =>
  apiFetch(`/habits/${id}`, { method: "DELETE" });

/**
 * Marks a single habit done/undone for a given date.
 *
 * IMPORTANT: the backend — not the client — is the source of truth for:
 *   - that habit's own per-habit streak
 *   - the global "garden" state (list-wide streak, best streak,
 *     flower growth stage, freezes)
 * The client never computes or trusts streak math itself; it just
 * renders whatever the server returns. This is what makes the whole
 * system tamper-proof (a user editing localStorage/devtools state
 * can't inflate a streak, because the number always comes fresh
 * from the server on the next request).
 *
 * Expected response shape:
 * {
 *   habit: {
 *     id, title, target, type, reminder,
 *     streak: number,       // this habit's own consecutive-day streak
 *     completed: boolean    // done for the requested date?
 *   },
 *   garden: {
 *     streak: number,             // consecutive days ALL habits were completed
 *     bestStreak: number,         // highest garden streak ever reached
 *     growthStage: number,        // 0-7, drives the flower visual
 *     freezes: number,            // freeze tokens currently banked
 *     freezeUsedDates: string[],  // "YYYY-MM-DD" dates a freeze protected
 *     lastPerfectDate: string|null
 *   },
 *   justReachedPerfectDay: boolean
 *   // true ONLY on the exact toggle call that first brought the list
 *   // to 100% for that date — lets the client know to fire the
 *   // celebration modal/confetti without re-deriving that itself.
 * }
 */
export const toggleHabitDone = (id, date) =>
  apiFetch(`/habits/${id}/toggle`, { method: "POST", body: { date } });

/* ============================================================
   GARDEN — global streak / freeze / flower-growth state
   ============================================================ */

/**
 * Fetches the current garden state on its own (used on initial load,
 * alongside getHabits()).
 */
export const getGarden = () => apiFetch("/garden");

/**
 * Spends one banked freeze token to protect a given date (defaults to
 * "today" — the caller passes the date explicitly so client/server
 * clocks never disagree). Protecting a date means: if that date ends
 * up not fully completed, it still counts as "covered" when the
 * backend evaluates streak continuity / flower decay the next day.
 *
 * Returns the updated garden object.
 */
export const applyGardenFreeze = (date) =>
  apiFetch("/garden/freeze", { method: "POST", body: { date } });

export const useGardenFreeze = applyGardenFreeze;
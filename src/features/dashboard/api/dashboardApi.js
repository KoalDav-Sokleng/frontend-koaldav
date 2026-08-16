import { apiFetch } from "../../../api/client";

export const getDashboardSummary = () => apiFetch("/dashboard/summary");

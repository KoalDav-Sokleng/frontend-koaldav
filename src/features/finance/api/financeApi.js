import { apiFetch } from "../../../api/client";

export const getFinanceOverview = () => apiFetch("/finance/overview");

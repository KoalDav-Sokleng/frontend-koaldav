// src/features/auth/hooks/useAuth.js
import { useAuthContext } from "../../../context/AuthContext";

// Thin re-export so components only import from `features/auth`,
// never reach into `context/` directly.
export function useAuth() {
  return useAuthContext();
}

export default useAuth;

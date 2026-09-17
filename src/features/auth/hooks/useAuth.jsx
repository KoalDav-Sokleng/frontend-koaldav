// All auth consumers must use the provider mounted in src/main.jsx.
// A second context here was never mounted, so login and registration failed.
import { useAuthContext } from "../../../context/AuthContext";

export function useAuth() {
  return useAuthContext();
}

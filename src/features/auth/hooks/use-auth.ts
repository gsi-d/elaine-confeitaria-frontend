import { useAuthContext } from "@/features/auth/context/auth-context";

export function useAuth() {
  return useAuthContext();
}


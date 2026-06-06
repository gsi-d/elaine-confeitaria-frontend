"use client";

import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/api/auth-service";
import { LoginFormValues } from "@/features/auth/schemas/login-schema";
import { resolveIsAdminFromToken } from "@/lib/auth/session";
import { tokenStorage } from "@/lib/auth/token-storage";

type AuthContextValue = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (values: LoginFormValues) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const initialToken = typeof window !== "undefined" ? tokenStorage.get() : undefined;
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(initialToken),
  );
  const [isAdmin, setIsAdmin] = useState(() => resolveIsAdminFromToken(initialToken));
  const isLoading = false;

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isAdmin,
      isLoading,
      async login(values) {
        const response = await authService.login(values);
        tokenStorage.set(response.token);
        setIsAuthenticated(true);
        setIsAdmin(resolveIsAdminFromToken(response.token));
        router.replace("/home");
      },
      logout() {
        tokenStorage.clear();
        setIsAuthenticated(false);
        setIsAdmin(false);
        router.replace("/login");
      },
    }),
    [isAdmin, isAuthenticated, isLoading, router],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext deve ser usado dentro de AuthProvider.");
  }

  return context;
}

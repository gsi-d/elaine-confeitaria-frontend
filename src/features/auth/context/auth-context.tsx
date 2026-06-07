"use client";

import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/api/auth-service";
import { LoginFormValues } from "@/features/auth/schemas/login-schema";
import { authSessionStorage } from "@/lib/auth/auth-session-storage";
import { AuthUser, resolveIsAdminFromToken, resolveUserFromToken } from "@/lib/auth/session";
import { tokenStorage } from "@/lib/auth/token-storage";

type AuthContextValue = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  login: (values: LoginFormValues) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const initialToken = typeof window !== "undefined" ? tokenStorage.get() : undefined;
  const initialSession = typeof window !== "undefined" ? authSessionStorage.get() : null;
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(initialToken),
  );
  const [isAdmin, setIsAdmin] = useState(
    () => initialSession?.isAdmin ?? resolveIsAdminFromToken(initialToken),
  );
  const [user, setUser] = useState<AuthUser | null>(
    () => initialSession?.user ?? resolveUserFromToken(initialToken),
  );
  const isLoading = false;

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isAdmin,
      user,
      isLoading,
      async login(values) {
        const response = await authService.login(values);
        const responseUser = response.user ?? response.usuario;
        const resolvedUser = responseUser ?? resolveUserFromToken(response.token);
        const resolvedIsAdmin =
          response.isAdmin ??
          response.user?.isAdmin ??
          response.usuario?.isAdmin ??
          resolveIsAdminFromToken(response.token);

        tokenStorage.set(response.token);
        authSessionStorage.set({
          isAdmin: resolvedIsAdmin,
          user: resolvedUser,
        });
        setIsAuthenticated(true);
        setIsAdmin(resolvedIsAdmin);
        setUser(resolvedUser);
        router.replace("/home");
      },
      logout() {
        tokenStorage.clear();
        authSessionStorage.clear();
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);
        router.replace("/login");
      },
    }),
    [isAdmin, isAuthenticated, isLoading, router, user],
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

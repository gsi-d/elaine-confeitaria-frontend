import { AUTH_SESSION_KEY } from "@/lib/auth/constants";
import { AuthUser } from "@/lib/auth/session";

export type StoredAuthSession = {
  isAdmin: boolean;
  user: AuthUser | null;
};

export const authSessionStorage = {
  get(): StoredAuthSession | null {
    if (typeof window === "undefined") {
      return null;
    }

    const raw = window.localStorage.getItem(AUTH_SESSION_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as StoredAuthSession;
    } catch {
      return null;
    }
  },

  set(value: StoredAuthSession) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(value));
  },

  clear() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(AUTH_SESSION_KEY);
  },
};

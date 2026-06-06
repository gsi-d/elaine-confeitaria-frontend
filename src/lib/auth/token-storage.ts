import Cookies from "js-cookie";
import { AUTH_TOKEN_KEY } from "@/lib/auth/constants";

export const tokenStorage = {
  get() {
    return Cookies.get(AUTH_TOKEN_KEY);
  },
  set(token: string) {
    Cookies.set(AUTH_TOKEN_KEY, token, {
      expires: 1,
      sameSite: "lax",
    });
  },
  clear() {
    Cookies.remove(AUTH_TOKEN_KEY);
  },
  key: AUTH_TOKEN_KEY,
};

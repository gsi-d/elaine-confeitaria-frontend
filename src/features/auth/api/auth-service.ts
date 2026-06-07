import { httpClient } from "@/lib/http/http-client";
import { LoginFormValues } from "@/features/auth/schemas/login-schema";
import { SignupFormValues } from "@/features/auth/schemas/signup-schema";

type LoginResponse = {
  token: string;
};

export const authService = {
  async login(payload: LoginFormValues) {
    const { data } = await httpClient.post<LoginResponse>("/auth/login", payload);
    return data;
  },
  async register(payload: SignupFormValues) {
    const { data } = await httpClient.post("/usuarios", payload);
    return data;
  },
};

import { httpClient } from "@/lib/http/http-client";
import { LoginFormValues } from "@/features/auth/schemas/login-schema";

type LoginResponse = {
  token: string;
};

export const authService = {
  async login(payload: LoginFormValues) {
    const { data } = await httpClient.post<LoginResponse>("/auth/login", payload);
    return data;
  },
};


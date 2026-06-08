import { render, screen, waitFor } from "@testing-library/react";
import Cookies from "js-cookie";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/features/auth/context/auth-context";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { AUTH_SESSION_KEY } from "@/lib/auth/constants";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

function AuthProbe() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="email">{user?.email ?? ""}</span>
    </>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it("renders a loading state on the server before restoring the session on the client", async () => {
    vi.mocked(Cookies.get).mockReturnValue("header.payload.signature");
    window.localStorage.setItem(
      AUTH_SESSION_KEY,
      JSON.stringify({
        isAdmin: false,
        user: { email: "cliente@elaine.com" },
      }),
    );

    const serverMarkup = renderToString(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    expect(serverMarkup).toContain("true");
    expect(serverMarkup).toContain("false");

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    expect(screen.getByTestId("authenticated").textContent).toBe("true");
    expect(screen.getByTestId("email").textContent).toBe("cliente@elaine.com");
  });
});

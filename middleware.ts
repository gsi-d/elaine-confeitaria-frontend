import { NextRequest, NextResponse } from "next/server";
import { AUTH_TOKEN_KEY } from "@/lib/auth/constants";

const protectedRoutes = ["/home", "/pedidos", "/carrinho"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/home/:path*", "/pedidos/:path*", "/carrinho/:path*"],
};

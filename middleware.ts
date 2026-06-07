import { NextRequest, NextResponse } from "next/server";
import { AUTH_TOKEN_KEY } from "@/lib/auth/constants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;

  if (token && (pathname === "/login" || pathname === "/cadastro")) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/cadastro",
    "/home/:path*",
    "/catalogo/:path*",
    "/pedidos/:path*",
    "/meus-pedidos/:path*",
    "/carrinho/:path*",
  ],
};

import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-brand",
});

export const metadata: Metadata = {
  title: "Elaine Confeitaria",
  description: "Painel administrativo da Elaine Confeitaria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={nunito.variable}>
        <AppRouterCacheProvider>
          <AppProviders>{children}</AppProviders>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

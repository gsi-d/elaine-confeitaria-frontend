import type { Metadata } from "next";
import { Nunito } from "next/font/google";
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
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

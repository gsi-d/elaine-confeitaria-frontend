"use client";

import { PropsWithChildren } from "react";
import { Box, CircularProgress } from "@mui/material";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/features/auth/hooks/use-auth";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return <DashboardShell>{children}</DashboardShell>;
}


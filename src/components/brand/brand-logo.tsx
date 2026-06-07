"use client";

import { Box, Stack, Typography } from "@mui/material";

type BrandLogoProps = {
  iconSize?: number;
  showWordmark?: boolean;
  stacked?: boolean;
};

export function BrandLogo({
  iconSize = 48,
  showWordmark = true,
  stacked = false,
}: BrandLogoProps) {
  return (
    <Stack
      direction={stacked ? "column" : "row"}
      spacing={stacked ? 1 : 1.25}
      sx={{
        alignItems: "center",
        justifyContent: stacked ? "center" : "flex-start",
      }}
    >
      <Box
        sx={{
          width: iconSize,
          height: iconSize,
          borderRadius: "18px",
          background: "linear-gradient(145deg, #fff5f7 0%, #ffe9f0 100%)",
          boxShadow: "0 10px 24px rgba(216,111,157,0.18)",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          overflow: "visible",
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 64 64"
          aria-hidden="true"
          sx={{ width: iconSize * 0.72, height: iconSize * 0.72, display: "block" }}
        >
          <defs>
            <linearGradient id="brandLogoIcing" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#f29fc0" />
              <stop offset="100%" stopColor="#d86f9d" />
            </linearGradient>
            <linearGradient id="brandLogoBase" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#f6dcb6" />
              <stop offset="100%" stopColor="#e9b97b" />
            </linearGradient>
          </defs>
          <path
            d="M17 27c0-8.8 6.7-16 15-16s15 7.2 15 16c3.1.9 5.2 3.6 5.2 6.8 0 4-3.2 7.2-7.2 7.2H18.9c-4 0-7.2-3.2-7.2-7.2 0-3.2 2.1-5.9 5.3-6.8Z"
            fill="url(#brandLogoIcing)"
          />
          <path
            d="M23 38h18l-2.8 13.7a4 4 0 0 1-3.9 3.2h-4.6a4 4 0 0 1-3.9-3.2L23 38Z"
            fill="url(#brandLogoBase)"
          />
          <path
            d="M28 25.5c.7-2.8 3-4.8 5.7-4.8 3.1 0 5.7 2.6 5.7 5.7 0 .8-.2 1.6-.5 2.3"
            fill="none"
            stroke="#fff8fb"
            strokeLinecap="round"
            strokeWidth="2.6"
          />
          <path
            d="M26.5 46.5h11.8"
            fill="none"
            stroke="#c7803f"
            strokeLinecap="round"
            strokeWidth="2.4"
            opacity=".8"
          />
          <circle cx="24.5" cy="30" r="2.1" fill="#fff6fa" opacity=".95" />
          <circle cx="42.5" cy="31" r="2.1" fill="#fff6fa" opacity=".95" />
        </Box>
      </Box>

      {showWordmark ? (
        <Box sx={{ textAlign: stacked ? "center" : "left" }}>
          <Typography
            variant="h6"
            sx={{
              color: "#d86f9d",
              lineHeight: 1,
              fontWeight: 800,
              whiteSpace: "nowrap",
            }}
          >
            Elaine Confeitaria
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sistema de pedidos
          </Typography>
        </Box>
      ) : null}
    </Stack>
  );
}

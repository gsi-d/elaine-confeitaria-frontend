import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#d86f9d",
      light: "#f4a6c1",
      dark: "#b85482",
    },
    secondary: {
      main: "#b79be6",
      light: "#d6c2f2",
      dark: "#9274cc",
    },
    success: {
      main: "#5f9f73",
    },
    background: {
      default: "#fff8f5",
      paper: "#fffdfb",
    },
    text: {
      primary: "#3d2a39",
      secondary: "#7b6776",
    },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: "var(--font-brand), sans-serif",
    h4: {
      fontWeight: 800,
    },
    h5: {
      fontWeight: 800,
    },
    h6: {
      fontWeight: 800,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#fff8f5",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(216, 111, 157, 0.12)",
          boxShadow: "0 18px 45px rgba(187, 123, 147, 0.12)",
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(18px)",
          backgroundColor: "rgba(255, 248, 245, 0.82)",
        },
      },
    },
  },
});

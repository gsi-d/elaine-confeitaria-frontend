import { Box } from "@mui/material";
import { SignupForm } from "@/features/auth/components/signup-form";

export default function SignupPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #fff3e0 0%, #faf7f4 100%)",
        p: 2,
      }}
    >
      <SignupForm />
    </Box>
  );
}

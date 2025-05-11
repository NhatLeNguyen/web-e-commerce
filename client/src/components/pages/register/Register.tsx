import React, { useState } from "react";
import { useAppDispatch } from "../../../redux/stores";
import { register } from "../../../redux/auth/authThunks";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../../themes/auth-themes/AuthTheme";
import ColorModeSelect from "../../themes/auth-themes/ColorModeSelect";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  borderRadius: "16px",
  background: "rgba(255, 255, 255, 0.95)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "420px", // Tăng kích thước form lên để hài hòa hơn
  },
  ...theme.applyStyles("dark", {
    background: "rgba(30, 30, 30, 0.95)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  }),
}));

const AuthContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "row",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(4),
  backgroundImage: "url('/images/auth_bg.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: theme.palette.common.white,
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.4)",
    zIndex: 1,
  },
  "& > *": {
    position: "relative",
    zIndex: 2,
  },
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
    minHeight: "30vh",
  },
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(4),
  background: "linear-gradient(135deg, #f5f7fa 0%, #e5e7eb 100%)",
  position: "relative",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
    minHeight: "70vh",
  },
  ...theme.applyStyles("dark", {
    background: "linear-gradient(135deg, #2b2b2b 0%, #1a1a1a 100%)",
  }),
}));

const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: "50px",
  padding: theme.spacing(1.5),
  background: "linear-gradient(90deg, #4B6A88 0%, #3B536E 100%)",
  color: theme.palette.common.white,
  fontWeight: "bold",
  textTransform: "none",
  boxShadow: "0 4px 15px rgba(75, 106, 136, 0.3)",
  "&:hover": {
    background: "linear-gradient(90deg, #3B536E 0%, #4B6A88 100%)",
    boxShadow: "0 6px 20px rgba(75, 106, 136, 0.4)",
  },
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    background: theme.palette.background.paper,
    "& fieldset": {
      borderColor: theme.palette.grey[300],
    },
    "&:hover fieldset": {
      borderColor: theme.palette.grey[500],
    },
    "&.Mui-focused fieldset": {
      borderColor: "#4B6A88",
    },
  },
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5),
  },
  "& .MuiFormLabel-root": {
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
}));

const registerSchema = z
  .object({
    fullName: z.string().nonempty("Please enter your full name."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResult = registerSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
    });
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((error) => {
        if (error.path.length > 0) {
          fieldErrors[error.path[0] as string] = error.message;
          toast.error(error.message);
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    try {
      const resultAction = await dispatch(
        register({ fullName, email, password })
      );
      if (register.fulfilled.match(resultAction)) {
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        toast.error("Registration failed");
        console.error("Registration failed:", resultAction.payload);
      }
    } catch (error) {
      toast.error("Error during registration");
      console.error("Error during registration:", error);
    }
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AuthContainer direction="row">
        <LeftPanel>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Join Lee Badminton
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              textAlign: "center",
              fontSize: { xs: "1rem", md: "1.2rem" },
              opacity: 0.9,
            }}
          >
            Sign up to discover premium badminton gear and elevate your game
            with Lee Badminton!
          </Typography>
          <Button
            href="/login"
            variant="outlined"
            sx={{
              borderRadius: "50px",
              borderColor: "white",
              color: "white",
              textTransform: "none",
              px: 4,
              py: 1,
              "&:hover": {
                borderColor: "white",
                background: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Sign In
          </Button>
        </LeftPanel>

        <RightPanel>
          <Box sx={{ position: "fixed", top: "1rem", right: "1rem" }}>
            <ColorModeSelect />
          </Box>
          <Card variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{
                width: "100%",
                fontSize: "clamp(2rem, 10vw, 2.15rem)",
                fontWeight: "bold",
                textAlign: "center",
                color: "#4B6A88",
              }}
            >
              Sign Up
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel htmlFor="fullName">Full Name</FormLabel>
                <CustomTextField
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={errors.fullName ? "error" : "primary"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <CustomTextField
                  error={!!errors.email}
                  helperText={errors.email}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  fullWidth
                  variant="outlined"
                  color={errors.email ? "error" : "primary"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <CustomTextField
                  error={!!errors.password}
                  helperText={errors.password}
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  required
                  fullWidth
                  variant="outlined"
                  color={errors.password ? "error" : "primary"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <CustomTextField
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  required
                  fullWidth
                  variant="outlined"
                  color={errors.confirmPassword ? "error" : "primary"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormControl>
              <CustomButton type="submit" fullWidth variant="contained">
                Sign Up
              </CustomButton>
              <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
                Already have an account?{" "}
                <Link
                  href="/login"
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    color: "#4B6A88",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Card>
        </RightPanel>
      </AuthContainer>
      <ToastContainer position="top-right" autoClose={3000} />
    </AppTheme>
  );
};

export default RegisterPage;

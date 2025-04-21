import React, { useState } from "react";
import { useAppDispatch } from "../../../redux/stores";
import { login } from "../../../redux/auth/authThunks";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./ForgotPassword";
import AppTheme from "../../themes/auth-themes/AuthTheme";
import ColorModeSelect from "../../themes/auth-themes/ColorModeSelect";
import { z } from "zod";
import GoogleLoginComponent from "./GoogleLogin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) return;
    try {
      const resultAction = await dispatch(login({ email, password }));
      if (login.fulfilled.match(resultAction)) {
        const user = resultAction.payload?.user;
        if (user) {
          toast.success("Login successful!");
          if (user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        } else {
          setEmailError(true);
          setEmailErrorMessage("Login failed: User data is missing");
          toast.error("Login failed: User data is missing");
        }
      } else {
        const errorMessage =
          (resultAction.payload as { message?: string })?.message ||
          "Login failed";
        if (errorMessage.includes("User not found")) {
          setEmailError(true);
          setEmailErrorMessage("User not found");
          toast.error("User not found");
        } else if (errorMessage.includes("Invalid credentials")) {
          setPasswordError(true);
          setPasswordErrorMessage("Wrong password");
          toast.error("Wrong password");
        } else {
          setEmailError(true);
          setEmailErrorMessage(errorMessage);
          toast.error(errorMessage);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setEmailError(true);
      setEmailErrorMessage("Error during login");
      toast.error("Error during login");
    }
  };

  const validateInputs = () => {
    try {
      loginSchema.parse({ email, password });
      setEmailError(false);
      setEmailErrorMessage("");
      setPasswordError(false);
      setPasswordErrorMessage("");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path.includes("email")) {
            setEmailError(true);
            setEmailErrorMessage(err.message);
          }
          if (err.path.includes("password")) {
            setPasswordError(true);
            setPasswordErrorMessage(err.message);
          }
        });
      }
      return false;
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
            Welcome Back to Lee Badminton
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
            Log in to explore the best badminton gear and elevate your game with
            Lee Badminton!
          </Typography>
          <Button
            href="/register"
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
            Sign Up
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
              Sign In
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
                <FormLabel htmlFor="email">Email</FormLabel>
                <CustomTextField
                  error={emailError}
                  helperText={emailErrorMessage}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={emailError ? "error" : "primary"}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(false);
                    setEmailErrorMessage("");
                  }}
                />
              </FormControl>
              <FormControl>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                </Box>
                <CustomTextField
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={passwordError ? "error" : "primary"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                    setPasswordErrorMessage("");
                  }}
                />
              </FormControl>

              <ForgotPassword open={open} handleClose={handleClose} />
              <CustomButton
                type="submit"
                fullWidth
                variant="contained"
                onClick={validateInputs}
              >
                Sign In
              </CustomButton>
              <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
                Don’t have an account?{" "}
                <Link
                  href="/register"
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
                  Sign Up
                </Link>
              </Typography>
            </Box>
            <Divider sx={{ my: 2, color: "text.secondary" }}>or</Divider>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <GoogleLoginComponent />
            </Box>
          </Card>
        </RightPanel>
      </AuthContainer>
      <ToastContainer position="top-right" autoClose={3000} />
    </AppTheme>
  );
};

export default LoginPage;

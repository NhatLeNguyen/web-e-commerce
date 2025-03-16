import React, { useState } from "react";
import { useAppDispatch } from "../../../redux/stores";
import { resetPassword } from "../../../redux/auth/authThunks";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.grey[800],
  },
}));

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Thêm confirm password
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams<{ token: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setPasswordError(true);
      setPasswordErrorMessage("Invalid or missing token");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError(true);
      setPasswordErrorMessage("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await dispatch(resetPassword({ token, password })).unwrap();
      alert("Password reset successful! Please log in with your new password.");
      navigate("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setPasswordError(true);
      setPasswordErrorMessage(error?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography component="h1" variant="h5" gutterBottom>
        Reset Password
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="New Password"
          type="password"
          id="password"
          autoComplete="new-password"
          error={passwordError}
          helperText={passwordErrorMessage}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(false);
            setPasswordErrorMessage("");
          }}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setPasswordError(false);
            setPasswordErrorMessage("");
          }}
          disabled={loading}
        />
        <CustomButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Reset Password"}
        </CustomButton>
      </Box>
    </Box>
  );
};

export default ResetPassword;

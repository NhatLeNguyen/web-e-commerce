import React, { useState } from "react";
import { useAppDispatch } from "../../../redux/stores";
import { resetPassword } from "../../../redux/auth/authThunks";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
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
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
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
    try {
      await dispatch(resetPassword({ token, password }));
      alert("Password reset successful!");
      navigate("/login");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setPasswordError(true);
      setPasswordErrorMessage("Failed to reset password");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography component="h1" variant="h5">
        Reset Password
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="New Password"
        type="password"
        id="password"
        autoComplete="current-password"
        error={passwordError}
        helperText={passwordErrorMessage}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError(false);
          setPasswordErrorMessage("");
        }}
      />
      <CustomButton type="submit" fullWidth variant="contained">
        Reset Password
      </CustomButton>
    </Box>
  );
};

export default ResetPassword;

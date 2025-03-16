import React, { useState } from "react";
import { useAppDispatch } from "../../../redux/stores";
import { sendResetPasswordEmail } from "../../../redux/auth/authThunks";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.grey[800],
  },
}));

export default function ForgotPassword({
  open,
  handleClose,
}: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await dispatch(sendResetPasswordEmail({ email })).unwrap();
      alert("Reset password email sent! Please check your inbox.");
      setEmail("");
      handleClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setEmailError(true);
      setEmailErrorMessage(
        error?.message || "Failed to send reset password email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <DialogContentText>
          Please enter your email address. We will send you an email to reset
          your password.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          margin="dense"
          id="email"
          type="email"
          fullWidth
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(false);
            setEmailErrorMessage("");
          }}
          error={emailError}
          disabled={loading}
        />
        {emailError && (
          <DialogContentText color="error">
            {emailErrorMessage}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <CustomButton type="submit" disabled={loading}>
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Send Email"
          )}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}

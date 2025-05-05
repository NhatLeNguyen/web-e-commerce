import * as React from "react";
import { useSelector, useDispatch as useReduxDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../redux/stores";
import {
  fetchUser,
  updateUserInfo,
  uploadAvatar,
  changePassword,
} from "../../../../redux/users/userThunks";
import { UserProfile } from "../../../../redux/users/userSlice";
import "./userSetting.scss";
import {
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

const useDispatch = () => useReduxDispatch<AppDispatch>();

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function UserSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status } = useSelector((state: RootState) => state.user);
  const [userData, setUserData] = React.useState<Partial<UserProfile>>({});
  const [, setAvatarFile] = React.useState<File | null>(null);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error"
  >("success");
  const [openChangePasswordDialog, setOpenChangePasswordDialog] =
    React.useState(false);
  const [passwordData, setPasswordData] = React.useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordError, setPasswordError] = React.useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = React.useState(false);

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (accessToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      dispatch(fetchUser(parsedUser._id));
    }
  }, [dispatch]);

  React.useEffect(() => {
    if (user) {
      setUserData({
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      });
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  if (status === "loading") {
    return <div>Loading...</div>; // Show loading state while fetching user data
  }

  if (!user) {
    return <div>Please log in to view settings.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      const formData = new FormData();
      formData.append("avatar", e.target.files[0]);
      dispatch(uploadAvatar({ userId: user._id, formData }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(updateUserInfo({ userId: user._id, userData }));
    setSnackbarMessage("Thông tin đã được cập nhật thành công!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
  };

  const handleOpenChangePasswordDialog = () => {
    setOpenChangePasswordDialog(true);
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setPasswordError("");
  };

  const handleCloseChangePasswordDialog = () => {
    setOpenChangePasswordDialog(false);
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setPasswordError("");
  };

  const handleSubmitPasswordChange = async () => {
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmNewPassword
    ) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    setIsSubmittingPassword(true);
    try {
      await dispatch(
        changePassword({
          userId: user._id,
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        })
      ).unwrap();

      handleCloseChangePasswordDialog();
      setSnackbarMessage("Password changed successfully! Please log in again.");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setPasswordError(
        typeof error === "string" ? error : "Failed to change password"
      );
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
      </div>
      <div className="settings-content">
        <form onSubmit={handleSubmit}>
          <div className="profile-section">
            <div className="avatar-container">
              <img
                src={
                  userData.avatar
                    ? userData.avatar.startsWith("data:image")
                      ? userData.avatar
                      : userData.avatar.startsWith("http")
                      ? userData.avatar
                      : `data:image/jpeg;base64,${userData.avatar}`
                    : "https://bootdey.com/img/Content/avatar/avatar6.png"
                }
                alt="User Avatar"
                className="avatar-img"
              />
              <div className="avatar-overlay">
                <label htmlFor="avatar-upload" className="avatar-upload-label">
                  <i className="camera-icon">📷</i>
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  className="avatar-upload-input"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
            <div className="user-info">
              <h4 className="user-name">{userData.fullName}</h4>
            </div>
          </div>
          <hr className="divider" />
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-control"
              value={userData.fullName || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={userData.email || ""}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn-save">
            Save Changes
          </button>
          <hr className="divider" />

          <Box>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenChangePasswordDialog}
            >
              Change Password
            </Button>
          </Box>
        </form>
      </div>

      <Dialog
        open={openChangePasswordDialog}
        onClose={handleCloseChangePasswordDialog}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="oldPassword"
            label="Old Password"
            type="password"
            fullWidth
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
          />
          <TextField
            margin="dense"
            name="newPassword"
            label="New Password"
            type="password"
            fullWidth
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
          <TextField
            margin="dense"
            name="confirmNewPassword"
            label="Confirm New Password"
            type="password"
            fullWidth
            value={passwordData.confirmNewPassword}
            onChange={handlePasswordChange}
          />
          {passwordError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {passwordError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChangePasswordDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitPasswordChange}
            disabled={isSubmittingPassword}
          >
            {isSubmittingPassword ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

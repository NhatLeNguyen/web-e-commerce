import React from "react";
import { useDispatch } from "react-redux";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../../../redux/auth/authThunks";
import GoogleIcon from "@mui/icons-material/Google";
import { AppDispatch } from "../../../redux/stores";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        const result = await dispatch(
          googleLogin({ access_token: credentialResponse.access_token })
        ).unwrap();

        const user = result?.user;
        if (user) {
          toast.success("Đăng nhập Google thành công!");
          if (user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        } else {
          toast.error("Đăng nhập Google thất bại: Dữ liệu người dùng bị thiếu");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Google login error:", error);
        const errorMessage =
          error.message ||
          error ||
          "Đăng nhập Google thất bại. Vui lòng thử lại.";
        toast.error(errorMessage);
      }
    },
    onError: () => {
      console.error("Google login failed");
      toast.error("Đăng nhập Google thất bại. Vui lòng thử lại!");
    },
  });

  const StyledGoogleLoginButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
    borderColor: theme.palette.grey[500],
    color: theme.palette.grey[500],
    "&:hover": {
      borderColor: theme.palette.grey[700],
      color: theme.palette.grey[700],
      backgroundColor: theme.palette.grey[100],
    },
  }));

  return (
    <StyledGoogleLoginButton
      onClick={() => login()}
      startIcon={<GoogleIcon />}
      fullWidth
      variant="outlined"
    >
      Sign in with Google
    </StyledGoogleLoginButton>
  );
};

const GoogleLoginComponent: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId="22770967789-d4llnsqjdr19f3lsle3f4n9nneto0n48.apps.googleusercontent.com">
      <GoogleLoginButton />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;

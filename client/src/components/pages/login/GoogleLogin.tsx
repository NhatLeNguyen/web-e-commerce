import React from "react";
import { useDispatch } from "react-redux";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../../../redux/auth/authThunks";
import GoogleIcon from "@mui/icons-material/Google";
import { AppDispatch } from "../../../redux/stores";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const GoogleLoginButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        await dispatch(
          googleLogin({ tokenId: credentialResponse.access_token })
        );
      } catch (error) {
        console.error("Google login error:", error);
      }
    },
    onError: () => {
      console.error("Google login failed");
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
    },
  }));

  return (
    <StyledGoogleLoginButton onClick={() => login()} startIcon={<GoogleIcon />}>
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

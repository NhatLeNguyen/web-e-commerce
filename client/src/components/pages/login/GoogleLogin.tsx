import React from "react";
import { useDispatch } from "react-redux";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../../../redux/auth/authThunks";
import GoogleIcon from "@mui/icons-material/Google";
import { AppDispatch } from "../../../redux/stores";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const GoogleLoginComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGoogleSuccess = async (credentialResponse: any) => {
    const { credential } = credentialResponse;
    try {
      await dispatch(googleLogin({ tokenId: credential }));
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGoogleFailure = (error: any) => {
    console.error("Google login failed:", error);
  };

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
    <GoogleOAuthProvider clientId="22770967789-d4llnsqjdr19f3lsle3f4n9nneto0n48.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleFailure}
        render={(renderProps: { onClick: () => void; disabled: boolean }) => (
          <StyledGoogleLoginButton
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </StyledGoogleLoginButton>
        )}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;

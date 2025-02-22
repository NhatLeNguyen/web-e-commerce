import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertTitle,
  Button,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { CheckCircle, XCircle } from "lucide-react";

const VNPayReturn: React.FC = () => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      window.location.href = "/";
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, []);

  const handleRedirectHome = () => {
    window.location.href = "/";
  };

  const urlParams = new URLSearchParams(window.location.search);
  const responseCode = urlParams.get("vnp_ResponseCode");
  const orderInfo = urlParams.get("vnp_OrderInfo");
  const transactionNo = urlParams.get("vnp_TransactionNo");

  const isSuccess = responseCode === "00";

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          mt: 8,
        }}
      >
        <Alert
          severity={isSuccess ? "success" : "error"}
          icon={isSuccess ? <CheckCircle /> : <XCircle />}
          sx={{ width: "100%" }}
        >
          <AlertTitle>
            {isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại"}
          </AlertTitle>
          {isSuccess ? (
            <>
              <Typography variant="body1" gutterBottom>
                Mã giao dịch: {transactionNo}
              </Typography>
              <Typography variant="body1">
                Thông tin đơn hàng: {orderInfo}
              </Typography>
            </>
          ) : (
            <Typography variant="body1">
              Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.
            </Typography>
          )}
        </Alert>

        <Typography variant="body1" color="text.secondary">
          Tự động chuyển về trang chủ sau {countdown} giây
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleRedirectHome}
          sx={{ mt: 2 }}
        >
          Về trang chủ ngay
        </Button>
      </Box>
    </Container>
  );
};

export default VNPayReturn;

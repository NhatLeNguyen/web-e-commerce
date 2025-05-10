import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  CardMedia,
  Box,
  Divider,
  CssBaseline,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../../../axios/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../redux/stores";
import { styled } from "@mui/material/styles";
import AppTheme from "../../../themes/auth-themes/AuthTheme";
import ColorModeSelect from "../../../themes/auth-themes/ColorModeSelect";
import { createVNPayPayment } from "../../../../redux/orders/paymentThunk";
import { toast, ToastContainer } from "react-toastify";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  size?: string;
  imageUrl: string;
}

const CustomSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[800],
  }),
}));

const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.grey[800],
  },
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
    "&:hover": {
      backgroundColor: theme.palette.grey[600],
    },
  }),
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
    "& fieldset": {
      borderColor: theme.palette.grey[400],
    },
    "&:hover fieldset": {
      borderColor: theme.palette.grey[600],
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.grey[600],
    },
  },
  ...theme.applyStyles("dark", {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: theme.palette.grey[700],
      },
      "&:hover fieldset": {
        borderColor: theme.palette.grey[500],
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.grey[500],
      },
    },
  }),
}));

const PaymentOption = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 1.5),
  margin: theme.spacing(0.5, 0),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
  },
  "&.selected": {
    backgroundColor: theme.palette.grey[100],
    border: `1px solid ${theme.palette.grey[600]}`,
  },
  ...theme.applyStyles("dark", {
    "&:hover": {
      backgroundColor: theme.palette.grey[800],
    },
    "&.selected": {
      backgroundColor: theme.palette.grey[800],
      border: `1px solid ${theme.palette.grey[500]}`,
    },
  }),
}));

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const OrderPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch: AppDispatch = useDispatch();
  const selectedProducts =
    (location.state?.selectedProducts as CartItem[]) || [];

  useEffect(() => {
    if (user) {
      setName(user.fullName);
      setEmail(user.email);
    }
  }, [user]);

  const handleOrder = async () => {
    if (!user) {
      toast.error("User not logged in");
      return;
    }

    try {
      const totalAmount = calculateTotal();
      const orderTime = new Date().toISOString();

      const orderData = {
        userId: user._id,
        name,
        email,
        phone,
        address,
        note,
        paymentMethod: paymentMethod === "online" ? "vnpay" : "cod",
        products: selectedProducts.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          size: item.size,
          imageUrl: item.imageUrl,
        })),
        totalAmount,
        orderTime,
        status: paymentMethod === "online" ? -1 : 0,
      };

      const orderResponse = await axiosInstance.post("/orders", orderData);
      const orderId = (orderResponse.data as { _id: string })._id;

      if (paymentMethod === "cod") {
        toast.success("Order placed successfully!");
        navigate("/orders-info");
      } else {
        const vnpayResponse = await dispatch(
          createVNPayPayment({
            orderId,
            amount: totalAmount,
            bankCode: "",
            orderInfo: `Thanh_toan_don_hang_${orderId}`,
          })
        ).unwrap();

        if (vnpayResponse?.paymentUrl) {
          toast.info("Redirecting to VNPay...");
          window.location.href = vnpayResponse.paymentUrl;
        } else {
          await axiosInstance.delete(`/orders/${orderId}`);
          toast.error("Invalid payment URL");
          throw new Error("Invalid payment URL");
        }
      }
    } catch (error) {
      console.error("Error handling order:", error);
      toast.error("Failed to place order");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => total + item.price, 0);
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ position: "fixed", top: "1rem", right: "1rem" }}>
        <ColorModeSelect />
      </Box>
      <Container sx={{ pt: 11, pb: 4, maxWidth: "lg" }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Place Your Order
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {/* Shipping Information */}
            <Box>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontSize: "1.5rem", fontWeight: 700 }}
              >
                Shipping Information
              </Typography>
              <CustomTextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
              />
              <CustomTextField
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
              />
              <CustomTextField
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
              />
              <CustomTextField
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
              />
              <CustomTextField
                label="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
              />
            </Box>

            <Box mt={3}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontSize: "1.5rem", fontWeight: 700 }}
              >
                Payment Method
              </Typography>
              <PaymentOption
                className={paymentMethod === "cod" ? "selected" : ""}
                onClick={() => setPaymentMethod("cod")}
              >
                <Typography variant="body2" fontWeight="medium">
                  Cash on Delivery
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Pay when you receive your order
                </Typography>
              </PaymentOption>
              <PaymentOption
                className={paymentMethod === "online" ? "selected" : ""}
                onClick={() => setPaymentMethod("online")}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Online Payment
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Payment will be processed via VNPay gateway
                  </Typography>
                </Box>
                <Box
                  component="img"
                  src="https://vnpay.vn/assets/images/logo-icon/logo-primary.svg"
                  alt="VNPay Logo"
                  sx={{ width: 40, height: 40 }}
                />
              </PaymentOption>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomSection sx={{ maxHeight: "400px", overflowY: "auto" }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontSize: "1.5rem", fontWeight: 700 }}
              >
                Your Cart
              </Typography>
              {selectedProducts.map((item, index) => (
                <Box key={index} display="flex" alignItems="center" mb={2}>
                  <CardMedia
                    component="img"
                    image={item.imageUrl}
                    alt={item.name}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Box flexGrow={1}>
                    <Typography variant="body2">{item.name}</Typography>
                    {item.size && (
                      <Typography variant="caption" color="textSecondary">
                        Size: {item.size}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(item.price)}
                  </Typography>
                </Box>
              ))}
              <Divider />
              <Box mt={2} display="flex" justifyContent="space-between">
                <Typography variant="body1" fontWeight="medium">
                  Total:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatCurrency(calculateTotal())}
                </Typography>
              </Box>
            </CustomSection>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button
                variant="text"
                onClick={handleCancel}
                sx={{
                  px: 4,
                  textTransform: "none",
                  color: "text.secondary",
                  backgroundColor: "#f5f5f5",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                Cancel
              </Button>
              <CustomButton
                variant="contained"
                onClick={handleOrder}
                sx={{ px: 4 }}
              >
                Place Order
              </CustomButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <ToastContainer position="top-right" autoClose={3000} />
    </AppTheme>
  );
};

export default OrderPage;

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Grid,
  CardContent,
  CardMedia,
  Box,
  Divider,
  CssBaseline,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../../../axios/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/stores";
import { styled } from "@mui/material/styles";
import AppTheme from "../../../themes/auth- themes/AuthTheme";
import ColorModeSelect from "../../../themes/auth- themes/ColorModeSelect";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  size?: string;
  imageUrl: string;
}

const CustomCard = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "1000px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  backgroundColor: theme.palette.background.paper,
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.background.default,
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
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
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(0),
    "& fieldset": {
      borderColor: theme.palette.grey[400],
    },
    "&:hover fieldset": {
      borderColor: theme.palette.grey[600],
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
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
        borderColor: theme.palette.primary.light,
      },
    },
  }),
}));

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
      alert("User not logged in");
      return;
    }

    const totalAmount = calculateTotal();
    const orderTime = new Date().toISOString();
    const status = 0;

    const orderData = {
      userId: user._id,
      name,
      email,
      phone,
      address,
      note,
      paymentMethod,
      products: selectedProducts.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        size: item.size,
        imageUrl: item.imageUrl,
      })),
      totalAmount,
      orderTime,
      status,
    };

    try {
      await axiosInstance.post("/orders", orderData);
      alert("Order placed successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Error placing order:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`Failed to place order: ${error.response.data.message}`);
      } else {
        alert("Failed to place order.");
      }
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
      <Container>
        <Typography variant="h4" gutterBottom align="center">
          Place Your Order
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <CustomCard>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>
              {selectedProducts.map((item, index) => (
                <Box
                  key={index}
                  mb={2}
                  p={1}
                  display="flex"
                  alignItems="center"
                >
                  <CardMedia
                    component="img"
                    image={item.imageUrl}
                    alt={item.name}
                    style={{ width: 80, height: 80, marginRight: 16 }}
                  />
                  <Box>
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant="body2">
                      Price: ${item.price}
                    </Typography>
                    {item.size && (
                      <Typography variant="body2">Size: {item.size}</Typography>
                    )}
                  </Box>
                </Box>
              ))}
              <Divider />
              <Box mt={2} display="flex" justifyContent="space-between">
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">${calculateTotal()}</Typography>
              </Box>
            </CustomCard>
          </Grid>
          <Grid item xs={12} md={8}>
            <CustomCard>
              <Typography variant="h5" gutterBottom>
                User Information
              </Typography>
              <CustomTextField
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <CustomTextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
              />
              <CustomTextField
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                margin="normal"
              />
              <CustomTextField
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                margin="normal"
              />
              <CustomTextField
                label="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
                margin="normal"
              />
            </CustomCard>
          </Grid>
          <Grid item xs={12} md={8}>
            <CustomCard>
              <Typography variant="h5" gutterBottom>
                Payment Method
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="cod"
                    control={<Radio />}
                    label="Cash on Delivery"
                  />
                  <FormControlLabel
                    value="online"
                    control={<Radio />}
                    label="Online Payment"
                  />
                </RadioGroup>
              </FormControl>
            </CustomCard>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <CustomButton variant="contained" onClick={handleOrder}>
                Place Order
              </CustomButton>
              <CustomButton variant="outlined" onClick={handleCancel}>
                Cancel
              </CustomButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </AppTheme>
  );
};

export default OrderPage;

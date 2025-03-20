import * as React from "react";
import { useSelector, useDispatch as useReduxDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../../redux/stores";
import {
  Box,
  Typography,
  Button,
  Modal,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { removeItem, setUserId } from "../../../../../redux/cart/cartSlice";
import { formatPrice } from "../../../../utils/formatPrice";
import {
  fetchCart,
  removeItemFromCart,
} from "../../../../../redux/cart/cartThunks";
import "./cartModal.scss";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  imageUrl: string;
}

const useDispatch = () => useReduxDispatch<AppDispatch>();

interface CartModalProps {
  open: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const cartItems = useSelector(
    (state: RootState) => state.cart.items as CartItem[]
  );
  const [selectedItems, setSelectedItems] = React.useState<number[]>([]);

  useEffect(() => {
    if (userId) {
      dispatch(setUserId(userId));
      const token = localStorage.getItem("accessToken");
      if (token) {
        dispatch(fetchCart({ userId }));
      }
    }
  }, [userId, dispatch]);

  const handleSelectItem = (index: number) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  const calculateTotal = () => {
    return selectedItems.reduce(
      (total, index) =>
        total + cartItems[index].price * cartItems[index].quantity,
      0
    );
  };

  const handleCheckout = () => {
    const selectedProducts = selectedItems.map((index) => cartItems[index]);
    navigate("/place-orders", { state: { selectedProducts } });
    onClose();
  };

  const handleDeleteSelected = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      selectedItems.forEach((index) => {
        dispatch(
          removeItemFromCart({
            userId: userId!,
            productId: cartItems[index].productId,
            size: cartItems[index].size,
          })
        );
        dispatch(
          removeItem({
            productId: cartItems[index].productId,
            size: cartItems[index].size,
          })
        );
      });
      setSelectedItems([]);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="cart-modal">
        <Button className="close-button" onClick={onClose}>
          ✕
        </Button>
        <Typography variant="h6">Your Cart</Typography>
        <Box className="cart-content">
          {cartItems.length === 0 ? (
            <Typography>Your cart is empty</Typography>
          ) : (
            cartItems.map((item: CartItem, index: number) => (
              <Box key={index} className="cart-item">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedItems.includes(index)}
                      onChange={() => handleSelectItem(index)}
                    />
                  }
                  label={
                    <div className="item-details">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="item-image"
                      />
                      <div>
                        <Typography className="item-name">
                          {item.name}
                        </Typography>
                        <Typography className="item-quantity">
                          Quantity: {item.quantity}
                        </Typography>
                        {item.size && (
                          <Typography className="item-size">
                            Size: {item.size}
                          </Typography>
                        )}
                        <Typography className="item-price">
                          Price: {formatPrice(item.price)}
                        </Typography>
                      </div>
                    </div>
                  }
                />
                <Typography className="item-total">
                  {formatPrice(item.price * item.quantity)}
                </Typography>
              </Box>
            ))
          )}
        </Box>
        <Box className="cart-total">
          <Typography>Total:</Typography>
          <Typography>{formatPrice(calculateTotal())}</Typography>
        </Box>
        <Box className="cart-actions">
          <Button
            onClick={handleCheckout}
            disabled={selectedItems.length === 0}
          >
            Pay
          </Button>
          <Button
            onClick={handleDeleteSelected}
            disabled={selectedItems.length === 0}
            color="secondary"
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CartModal;

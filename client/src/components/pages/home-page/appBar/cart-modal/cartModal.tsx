import * as React from "react";
import { useSelector, useDispatch as useReduxDispatch } from "react-redux";
import { RootState } from "../../../../../redux/stores";
import {
  Box,
  Typography,
  Button,
  Modal,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { AppDispatch } from "../../../../../redux/stores";
import { removeItem } from "../../../../../redux/cart/cartSlice";
import "./CartModal.scss";

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
  const cartItems = useSelector(
    (state: RootState) => state.cart.items as unknown as CartItem[]
  );
  const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
  const dispatch = useDispatch();

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
    // Handle checkout logic here
    console.log("Checked out items:", selectedItems);
    onClose();
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach((index) => {
      dispatch(
        removeItem({
          productId: cartItems[index].productId,
          size: cartItems[index].size,
        })
      );
    });
    setSelectedItems([]);
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
                          Price: ${item.price}
                        </Typography>
                      </div>
                    </div>
                  }
                />
                <Typography className="item-total">
                  ${item.price * item.quantity}
                </Typography>
              </Box>
            ))
          )}
        </Box>
        <Box className="cart-total">
          <Typography>Total:</Typography>
          <Typography>${calculateTotal()}</Typography>
        </Box>
        <Box className="cart-actions">
          <Button
            onClick={handleCheckout}
            disabled={selectedItems.length === 0}
          >
            Thanh toán
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

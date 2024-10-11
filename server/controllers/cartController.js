import Cart from "../models/Cart.js";

export const addItemToCart = async (req, res) => {
  const { userId } = req.params;
  const { productId, name, price, quantity, size, imageUrl } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId && item.size === size
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, quantity, size, imageUrl });
    }

    await cart.save();
    res.status(200).json(cart.items);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart.items);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const removeItemFromCart = async (req, res) => {
  const { userId, productId } = req.params;
  const { size } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId !== productId || item.size !== size
    );

    await cart.save();
    res.status(200).json(cart.items);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

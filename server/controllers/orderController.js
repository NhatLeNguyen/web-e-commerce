import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      phone,
      address,
      note,
      paymentMethod,
      products,
      totalAmount,
      orderTime,
      status,
    } = req.body;

    const order = new Order({
      userId,
      name,
      email,
      phone,
      address,
      note,
      paymentMethod,
      products,
      totalAmount,
      orderTime,
      status,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

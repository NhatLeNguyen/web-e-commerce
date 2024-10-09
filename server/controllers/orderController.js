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

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const { role, _id: userId } = req.user;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (role === "admin") {
      if (status === 1 || status === 2) {
        order.status = status;
      } else {
        return res.status(400).json({ message: "Invalid status for admin" });
      }
    }

    if (role === "guest") {
      if (status === 3) {
        order.status = status;
      } else {
        return res.status(403).json({ message: "Unauthorized action 1" });
      }
    } else {
      return res.status(403).json({ message: "Unauthorized action 2" });
    }

    await order.save();
    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: error.message });
  }
};

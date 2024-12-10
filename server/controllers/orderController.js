import Order from "../models/Order.js";
import crypto from "crypto";
import querystring from "querystring";

export const createVNPayPayment = async (req, res) => {
  try {
    const { orderId, amount, bankCode } = req.body;

    const tmnCode = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_SECRET_KEY;
    const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

    const returnUrl = "http://localhost:5173/vnpay_return";

    const createDate = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/-/g, "")
      .replace(/T/g, "");
    const orderInfo = `Thanh toan don hang ${orderId}`;
    const orderType = "billpayment";
    const locale = "vn";
    const currCode = "VND";

    let vnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: orderType,
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: req.ip,
      vnp_CreateDate: createDate,
      vnp_BankCode: bankCode,
    };

    vnpParams = sortObject(vnpParams);

    const signData = querystring.stringify(vnpParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnpParams["vnp_SecureHash"] = signed;

    const paymentUrl = `${vnpUrl}?${querystring.stringify(vnpParams, {
      encode: false,
    })}`;
    res.status(200).json({ paymentUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sortObject = (obj) => {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
};

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

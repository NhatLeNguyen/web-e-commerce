import Order from "../models/Order.js";
import crypto from "crypto";
import querystring from "querystring";

// export const createVNPayPayment = async (req, res) => {
//   try {
//     const { orderId, amount } = req.body;
//     // Validate input
//     if (!orderId || !amount) {
//       return res.status(400).json({ message: "Missing required parameters" });
//     }

//     const tmnCode = process.env.VNPAY_TMN_CODE;
//     const secretKey = process.env.VNPAY_SECRET_KEY;
//     const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
//     const returnUrl = "https://web-e-commerce-client.vercel.app/vnpay_return";

//     const createDate = new Date()
//       .toISOString()
//       .replace(/[^0-9]/g, "")
//       .slice(0, 14);

//     const txnRef = orderId;

//     let vnpParams = {
//       vnp_Version: "2.1.0",
//       vnp_Command: "pay",
//       vnp_TmnCode: tmnCode,
//       vnp_Locale: "vn",
//       vnp_CurrCode: "VND",
//       vnp_TxnRef: txnRef,
//       vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
//       vnp_OrderType: "other",
//       vnp_Amount: amount * 100,
//       vnp_ReturnUrl: returnUrl,
//       vnp_IpAddr: req.ip || "127.0.0.1",
//       vnp_CreateDate: createDate,
//     };
//     const expireDate = new Date(Date.now() + 15 * 60000) // 15 phút
//       .toISOString()
//       .replace(/[^0-9]/g, "")
//       .slice(0, 14);

//     vnpParams.vnp_ExpireDate = expireDate;

//     // Sort params
//     const sortedKeys = Object.keys(vnpParams).sort();
//     const sortedParams = {};
//     sortedKeys.forEach((key) => {
//       sortedParams[key] = vnpParams[key];
//     });

//     // Create query string
//     const queryString = Object.entries(sortedParams)
//       .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
//       .join("&");

//     // Create signature
//     const hmac = crypto.createHmac("sha512", secretKey);
//     const signed = hmac.update(queryString, "utf-8").digest("hex");

//     // Add signature to params
//     const paymentUrl = `${vnpUrl}?${queryString}&vnp_SecureHash=${signed}`;

//     // Log for debugging
//     console.log("Sign Data:", signData);
//     console.log("Secret Key length:", secretKey.length);
//     console.log("Secure Hash:", signed);
//     console.log("Payment URL:", paymentUrl);

//     return res.status(200).json({ paymentUrl });
//   } catch (error) {
//     console.error("VNPay payment error:", error);
//     return res.status(500).json({
//       message: "Error creating payment URL",
//       error: error.message,
//     });
//   }
// };
export const createVNPayPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    if (!orderId || !amount) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const tmnCode = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_SECRET_KEY;
    const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const returnUrl = "https://web-e-commerce-client.vercel.app/vnpay_return";

    const date = new Date();
    // Format createDate thành YYYYMMDDHHmmss
    const createDate =
      date.getFullYear().toString() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    // Format txnRef
    const txnRef = createDate + "_" + Math.random().toString(36).slice(-6);

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
      vnp_OrderType: "billpayment", // Sửa orderType thành billpayment
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: req.ip || "127.0.0.1",
      vnp_CreateDate: createDate,
    };

    // Sắp xếp field và tạo chuỗi để ký
    const sortedKeys = Object.keys(vnp_Params).sort();
    const signData = sortedKeys
      .map((key) => `${key}=${vnp_Params[key]}`)
      .join("&");

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // Thêm chữ ký vào params
    vnp_Params.vnp_SecureHash = signed;

    // Tạo URL với tất cả params đã được ký
    const paymentUrl =
      `${vnpUrl}?` +
      Object.keys(vnp_Params)
        .map((key) => `${key}=${encodeURIComponent(vnp_Params[key])}`)
        .join("&");

    // Debug logs
    console.log("Sign Data:", signData);
    console.log("Secret Key length:", secretKey.length);
    console.log("Secure Hash:", signed);
    console.log("Final Payment URL:", paymentUrl);

    return res.status(200).json({ paymentUrl });
  } catch (error) {
    console.error("VNPay payment error:", error);
    return res.status(500).json({
      message: "Error creating payment URL",
      error: error.message,
    });
  }
};
export const handleVNPayIPN = async (req, res) => {
  try {
    const vnpParams = req.query;
    const secureHash = vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHashType"];

    vnpParams = sortObject(vnpParams);
    const secretKey = process.env.VNPAY_SECRET_KEY;
    const signData = querystring.stringify(vnpParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      const orderId = vnpParams["vnp_TxnRef"];
      const rspCode = vnpParams["vnp_ResponseCode"];
      const transactionStatus = vnpParams["vnp_TransactionStatus"];

      if (rspCode === "00") {
        await Order.findByIdAndUpdate(orderId, { status: "paid" });
        res.status(200).json({ RspCode: "00", Message: "Success" });
      } else {
        res.status(200).json({ RspCode: "01", Message: "Transaction failed" });
      }
    } else {
      res.status(200).json({ RspCode: "97", Message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ RspCode: "99", Message: error.message });
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

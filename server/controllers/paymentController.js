import Order from "../models/Order.js";
import crypto from "crypto";
import querystring from "querystring";
import { v4 as uuidv4 } from "uuid";

const paymentSessions = new Map();

export const createPaymentSession = async (req, res) => {
  try {
    const sessionId = uuidv4();
    paymentSessions.set(sessionId, {
      orderData: req.body,
      createdAt: new Date(),
    });

    setTimeout(() => {
      paymentSessions.delete(sessionId);
    }, 30 * 60 * 1000);

    res.json({ sessionId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createVNPayPayment = async (req, res) => {
  try {
    const { amount, sessionId } = req.body;
    if (!amount || !sessionId) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const txnRef = crypto.randomBytes(4).toString("hex");
    const tmnCode = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_SECRET_KEY;
    const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const returnUrl = "https://web-e-commerce-client.vercel.app/vnpay-return";

    const date = new Date();
    const createDate =
      date.getFullYear().toString() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: sessionId,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: req.ip || "127.0.0.1",
      vnp_CreateDate: createDate,
    };

    const sortedKeys = Object.keys(vnp_Params).sort();
    const sortedParams = {};
    sortedKeys.forEach((key) => {
      sortedParams[key] = vnp_Params[key];
    });

    const signData = sortedKeys
      .map((key) => `${key}=${encodeURIComponent(sortedParams[key])}`)
      .join("&");

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // Tạo URL với cùng thứ tự params như signData
    const paymentUrl = `${vnpUrl}?${signData}&vnp_SecureHash=${signed}`;

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
        await Order.findByIdAndUpdate(orderId, { status: 0 });
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

// export const handleVNPayReturn = async (req, res) => {
//   try {
//     const vnpParams = req.query;
//     const orderId = vnpParams.vnp_TxnRef;

//     const responseCode = vnpParams.vnp_ResponseCode;

//     if (responseCode === "00") {
//       await Order.findByIdAndUpdate(orderId, { status: 0 });
//     } else {
//       // Payment failed
//       await Order.findByIdAndDelete(orderId);
//     }

//     res.redirect(`https://web-e-commerce-client.vercel.app/vnpay-return`);
//   } catch (error) {
//     console.error("Error processing VNPay return:", error);
//     res.redirect(`https://web-e-commerce-client.vercel.app/vnpay-return`);
//   }
// };

export const handleVNPayReturn = async (req, res) => {
  try {
    const vnpParams = req.query;
    const responseCode = vnpParams.vnp_ResponseCode;
    const sessionId = vnpParams.vnp_OrderInfo;

    if (responseCode === "00") {
      // Lấy thông tin đơn hàng từ session
      const session = paymentSessions.get(sessionId);
      if (!session) {
        throw new Error("Payment session expired");
      }

      const orderData = {
        ...session.orderData,
        paymentMethod: "vnpay",
        orderTime: new Date().toISOString(),
        status: 0,
      };

      await Order.create(orderData);

      paymentSessions.delete(sessionId);
    }

    res.redirect(
      `https://web-e-commerce-client.vercel.app/vnpay-return?payment_status=${
        responseCode === "00" ? "success" : "failed"
      }`
    );
  } catch (error) {
    console.error("Error processing VNPay return:", error);
    res.redirect(
      `https://web-e-commerce-client.vercel.app/vnpay-return?payment_status=error`
    );
  }
};

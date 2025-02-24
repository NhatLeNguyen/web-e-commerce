import Order from "../models/Order.js";
import crypto from "crypto";
import querystring from "querystring";

export const createVNPayPayment = async (req, res) => {
  try {
    const { orderId, amount, bankCode, orderInfo } = req.body;

    if (!orderId || !amount || !orderInfo) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const txnRef = orderId;
    order.txnRef = txnRef;
    await order.save();

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
      vnp_OrderInfo: orderInfo,
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

    const sortedParams = sortObject(vnpParams);
    const secretKey = process.env.VNPAY_SECRET_KEY;
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash !== signed) {
      return res
        .status(200)
        .json({ RspCode: "97", Message: "Invalid signature" });
    }

    const txnRef = vnpParams["vnp_TxnRef"];
    const rspCode = vnpParams["vnp_ResponseCode"];

    console.log("Received IPN:", { txnRef, rspCode });

    const order = await Order.findOne({ txnRef });
    if (!order) {
      return res
        .status(200)
        .json({ RspCode: "01", Message: "Order not found" });
    }

    if (rspCode === "00") {
      order.status = 0;
      order.paymentMethod = "vnpay";
      await order.save();
      console.log("Order updated to status 0:", order);
      return res.status(200).json({ RspCode: "00", Message: "Success" });
    } else {
      order.status = -2;
      await order.save();
      return res
        .status(200)
        .json({ RspCode: "01", Message: "Transaction failed" });
    }
  } catch (error) {
    console.error("VNPay IPN error:", error);
    return res.status(200).json({ RspCode: "99", Message: error.message });
  }
};

export const handleVNPayReturn = async (req, res) => {
  try {
    const vnpParams = req.query;
    const responseCode = vnpParams.vnp_ResponseCode;
    const txnRef = vnpParams.vnp_TxnRef;

    console.log("Processing VNPay return:", { responseCode, txnRef });

    const order = await Order.findOne({ txnRef });
    if (!order) {
      return res.redirect(
        `/vnpay-return?payment_status=error&message=Order not found`
      );
    }

    if (responseCode === "00") {
      res.redirect(`/vnpay-return?payment_status=success`);
    } else {
      res.redirect(`/vnpay-return?payment_status=failed`);
    }
  } catch (error) {
    console.error("VNPay return error:", error);
    res.redirect(`/vnpay-return?payment_status=error&message=${error.message}`);
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

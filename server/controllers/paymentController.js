import Order from "../models/Order.js";
import crypto from "crypto";
import querystring from "querystring";

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
    const createDate =
      date.getFullYear().toString() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const txnRef = orderId;

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh_toan_don_hang_-0${orderId}`,
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

export const handleVNPayReturn = async (req, res) => {
  try {
    const vnpParams = req.query;
    const orderId = vnpParams.vnp_TxnRef;
    const responseCode = vnpParams.vnp_ResponseCode;

    if (responseCode === "00") {
      console.log("Payment successful, updating order status...");

      const order = await Order.findById(orderId);
      console.log("Found order:", order);

      if (!order) {
        console.error("Order not found");
        return res.redirect("/?error=order-not-found");
      }

      // Cập nhật status thành 0 khi thanh toán thành công
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: 0 },
        { new: true }
      );
      console.log("Updated order:", updatedOrder);
    } else {
      console.log("Payment failed, deleting order...");
      // Xóa đơn hàng nếu thanh toán thất bại
      await Order.findByIdAndDelete(orderId);
    }

    // Redirect về client với kết quả
    const redirectUrl = `/?vnp_ResponseCode=${responseCode}&vnp_TxnRef=${orderId}`;
    console.log("Redirecting to:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error processing VNPay return:", error);
    res.redirect("/?error=payment-processing-failed");
  }
};

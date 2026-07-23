const Payment = require("../../Models/Payment");
const Order = require("../../Models/Order");
const sendResponse = require("../../Utils/sendResponse");

// ================= CREATE PAYMENT =================

const createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return sendResponse(res, 404, false, "Order not found");
    }

    const payment = await Payment.create({
      user: req.user._id,
      order: order._id,
      amount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      transactionId: "TXN" + Date.now(),
      status: "Pending",
    });

    return sendResponse(
      res,
      201,
      true,
      "Payment created successfully",
      payment
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// ================= VERIFY PAYMENT =================

const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return sendResponse(res, 404, false, "Payment not found");
    }

    payment.status = "Success";
    await payment.save();

    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: "Paid",
      orderStatus: "Processing",
    });

    return sendResponse(
      res,
      200,
      true,
      "Payment verified successfully"
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

module.exports = {
  createPayment,
  verifyPayment,
};
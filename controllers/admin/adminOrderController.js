const Order = require("../../models/Order");
const sendResponse = require("../../utils/sendResponse");
const User = require("../../models/User");
const { sendPushNotification } = require("../../services/pushNotificationService");
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 });

    return sendResponse(
      res,
      200,
      true,
      "Orders fetched successfully",
      orders
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      error.message
    );
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.product");

    if (!order) {
      return sendResponse(
        res,
        404,
        false,
        "Order not found"
      );
    }

    return sendResponse(
      res,
      200,
      true,
      "Order fetched successfully",
      order
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      error.message
    );
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const allowedStatus = [
      "Placed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatus.includes(orderStatus)) {
      return sendResponse(
        res,
        400,
        false,
        "Invalid order status"
      );
    }

    const order = await Order.findById(id);

    if (!order) {
      return sendResponse(
        res,
        404,
        false,
        "Order not found"
      );
    }

    // Prevent unnecessary updates
    if (order.orderStatus === orderStatus) {
      return sendResponse(
        res,
        400,
        false,
        "Order already has this status"
      );
    }

    order.orderStatus = orderStatus;
    await order.save();

    // Send Push Notification
    try {
      const user = await User.findById(order.user);

      if (user?.fcmToken) {
        let title = "";
        let body = "";

        switch (orderStatus) {
          case "Processing":
            title = "📦 Order Processing";
            body =
              "Your order is now being processed.";
            break;

          case "Shipped":
            title = "🚚 Order Shipped";
            body =
              "Your order has been shipped.";
            break;

          case "Delivered":
            title = "✅ Order Delivered";
            body =
              "Your order has been delivered successfully.";
            break;

          case "Cancelled":
            title = "❌ Order Cancelled";
            body =
              "Your order has been cancelled.";
            break;

          default:
            title = "📦 Order Updated";
            body = `Your order status has been updated to ${orderStatus}.`;
        }

        await sendPushNotification({
          token: user.fcmToken,
          title,
          body,
        });
      }
    } catch (notificationError) {
      console.error(
        "Push Notification Error:",
        notificationError
      );
    }

    return sendResponse(
      res,
      200,
      true,
      "Order status updated successfully",
      order
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      error.message
    );
  }
};
module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
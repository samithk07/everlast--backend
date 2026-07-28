const Cart = require("../../Models/Cart");
const Order = require("../../Models/Order");
const Product = require("../../Models/Product");
const sendResponse = require("../../Utils/sendResponse");

// ================= CREATE ORDER =================

const createOrder = async (req, res) => {
  
  try {
    const userId = req.user._id;

    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      paymentMethod,
    } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    console.log("Cart:", cart);


    if (!cart || cart.items.length === 0) {
      return sendResponse(res, 400, false, "Cart is empty");
    }
console.log("Items:", cart.items);
    let totalAmount = 0;

    const orderItems = cart.items.map((item) => {
      totalAmount += item.product.price * item.quantity;

      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    const order = await Order.create({
      user: userId,

      items: orderItems,

      shippingAddress: {
        fullName,
        phone,
        address,
        city,
        state,
        pincode,
      },

      totalAmount,

      paymentMethod: paymentMethod || "COD",

      paymentStatus:
        paymentMethod === "ONLINE" ? "Pending" : "Pending",

      orderStatus: "Placed",
    });

    // Clear Cart after Order Creation
    cart.items = [];
    await cart.save();

    return sendResponse(
      res,
      201,
      true,
      "Order placed successfully",
      {
        orderId: order._id,
        totalAmount: order.totalAmount
    }
      
    );
  } catch (error) {
    
    return sendResponse(res, 500, false, error.message);
  }
};

// ================= GET USER ORDERS =================

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return sendResponse(
      res,
      200,
      true,
      "Orders fetched successfully",
      orders
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// ================= GET SINGLE ORDER =================

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("items.product");

    if (!order) {
      return sendResponse(res, 404, false, "Order not found");
    }

    return sendResponse(
      res,
      200,
      true,
      "Order fetched successfully",
      order
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// ================= CANCEL ORDER =================

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return sendResponse(res, 404, false, "Order not found");
    }

    if (order.orderStatus === "Delivered") {
      return sendResponse(
        res,
        400,
        false,
        "Delivered orders cannot be cancelled"
      );
    }

    order.orderStatus = "Cancelled";

    await order.save();

    return sendResponse(
      res,
      200,
      true,
      "Order cancelled successfully",
      order
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};
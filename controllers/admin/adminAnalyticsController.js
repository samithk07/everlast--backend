const Order = require("../../Models/Order");
const Product = require("../../Models/Product");
const User = require("../../Models/User");
const sendResponse = require("../../Utils/sendResponse");

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({
      role: "user",
    });

    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      orderStatus: "Placed",
    });

    const processingOrders = await Order.countDocuments({
      orderStatus: "Processing",
    });

    const shippedOrders = await Order.countDocuments({
      orderStatus: "Shipped",
    });

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "Delivered",
    });

    const cancelledOrders = await Order.countDocuments({
      orderStatus: "Cancelled",
    });

    const revenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenue.length > 0 ? revenue[0].totalRevenue : 0;

    const lowStockProducts = await Product.countDocuments({
      stock: { $lt: 10 },
    });

    return sendResponse(
      res,
      200,
      true,
      "Analytics fetched successfully",
      {
        totalUsers,
        totalProducts,
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        lowStockProducts,
        totalRevenue,
      }
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};
const getMonthlySales = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    return sendResponse(
      res,
      200,
      true,
      "Monthly sales fetched successfully",
      sales
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const getTopSellingProducts = async (req, res) => {
  try {
    const products = await Order.aggregate([
      { $unwind: "$items" },

      {
        $group: {
          _id: "$items.product",
          totalSold: {
            $sum: "$items.quantity",
          },
        },
      },

      {
        $sort: {
          totalSold: -1,
        },
      },

      {
        $limit: 5,
      },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },

      {
        $unwind: "$product",
      },
    ]);

    return sendResponse(
      res,
      200,
      true,
      "Top selling products fetched successfully",
      products
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};
module.exports = {
  getAnalytics,
  getMonthlySales,
  getTopSellingProducts,
};
const User = require("../../models/User");
const Product = require("../../models/Product");
const Order = require("../../models/Order");
const sendResponse = require("../../utils/sendResponse");

const getDashboard = async (req, res) => {
  try {
    // Total Users
    const totalUsers = await User.countDocuments({
      role: "user",
    });

    // Total Products
    const totalProducts = await Product.countDocuments();

    // Total Orders
    const totalOrders = await Order.countDocuments();

    // Total Revenue
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

    // Recent Orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    return sendResponse(
      res,
      200,
      true,
      "Dashboard fetched successfully",
      {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
      }
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

module.exports = {
  getDashboard,
};
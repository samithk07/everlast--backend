const express = require("express");
const router = express.Router();

const protect = require("../../middleware/authMiddleware");
const isAdmin = require("../../middleware/adminMiddleware");

const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,

} = require("../../controllers/admin/adminOrderController");

router.get(
  "/",
  protect,
  isAdmin,
  getAllOrders
);

router.get(
  "/:id",
  protect,
  isAdmin,
  getOrderById
);
router.put(
  "/:id/status",
  protect,
  isAdmin,
  updateOrderStatus
);
module.exports = router;
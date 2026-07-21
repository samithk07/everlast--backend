const express = require("express");
const router = express.Router();

const protect = require("../../middleware/authMiddleware");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require("../../controllers/user/orderController");

router.post("/", protect, createOrder);

router.get("/", protect, getMyOrders);

router.get("/:id", protect, getOrderById);

router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;
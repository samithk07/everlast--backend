const express = require("express");
const router = express.Router();

const protect = require("../../middleware/authMiddleware");

const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeCartItem,
  clearCart,
} = require("../../controllers/user/cartController");

router.get("/", protect, getCart);
router.post("/:productId", protect, addToCart);
router.put("/:productId", protect, updateCartQuantity);
router.delete("/:productId", protect, removeCartItem);
router.delete("/", protect, clearCart);

module.exports = router;
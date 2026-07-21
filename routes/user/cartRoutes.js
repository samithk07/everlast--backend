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

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/:productId", protect, updateCartQuantity);
router.delete("/:productId", protect, removeCartItem);
router.delete("/", protect, clearCart);

module.exports = router;
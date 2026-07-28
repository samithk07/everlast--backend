const express = require("express");

const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
} = require("../../controllers/user/productController");

router
  .route("/")
  .get(getAllProducts);

// Specific routes FIRST
router.get("/search", searchProducts);
router.get("/category/:category", getProductsByCategory);

// Dynamic route LAST
router.get("/:id", getProductById);

module.exports = router;
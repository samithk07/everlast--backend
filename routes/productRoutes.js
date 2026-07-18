const express = require("express");

const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
} = require("../controllers/productController");

router
  .route("/")
  .get(getAllProducts)
  .post(createProduct);
router.get("/:id", getProductById);
module.exports = router;
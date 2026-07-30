const express = require("express");
const router = express.Router();

const protect = require("../../middleware/authMiddleware");
const isAdmin = require("../../middleware/adminMiddleware");
const upload = require("../../middleware/uploadMiddleware");

const {
  addProduct,
  getAllProducts,
  getProductById,
   updateProduct,
   deleteProduct,
   changeProductStatus
} = require("../../controllers/admin/adminProductController");

router.get("/", protect, isAdmin, getAllProducts);

router.get("/:id", protect, isAdmin, getProductById);

router.post(
  "/",
  protect,
  isAdmin,
  upload.single("image"),
  addProduct,
  );
router.delete(
  "/:id",
  protect,
  isAdmin,
  deleteProduct
);
router.put(
  "/:id",
  protect,
  isAdmin,
  upload.single("image"),
  updateProduct
);

router.patch(
  "/:id/status",
  protect,
  isAdmin,
  changeProductStatus
);

module.exports = router;
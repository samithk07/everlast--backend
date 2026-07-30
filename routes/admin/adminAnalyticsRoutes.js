const express = require("express");
const router = express.Router();

const protect = require("../../middleware/authMiddleware");
const isAdmin = require("../../middleware/adminMiddleware");

const {
  getAnalytics,
  getMonthlySales,
  getTopSellingProducts
} = require("../../controllers/admin/adminAnalyticsController");

router.get("/", protect, isAdmin, getAnalytics);
router.get("/monthly-sales", protect, isAdmin, getMonthlySales);
router.get("/top-products",protect,isAdmin,getTopSellingProducts);
module.exports = router;
const express = require("express");
const router = express.Router();

const protect = require("../../middleware/authMiddleware");
const isAdmin = require("../../middleware/adminMiddleware");

const {
  getDashboard,
} = require("../../controllers/admin/dashboardController");

router.get(
  "/",
  protect,
  isAdmin,
  getDashboard
);

module.exports = router;
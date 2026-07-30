const express = require("express");
const router = express.Router();

const protect = require("../../middleware/authMiddleware");
const isAdmin = require("../../middleware/adminMiddleware");

const {
  getAllServices,
  getServiceById,
  updateServiceStatus,

} = require("../../controllers/admin/adminServiceController");

router.get("/", protect, isAdmin, getAllServices);

router.get("/:id", protect, isAdmin, getServiceById);

router.put("/:id/status", protect, isAdmin, updateServiceStatus);


module.exports = router;
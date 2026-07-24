const express = require("express");

const router = express.Router();

const protect = require("../../Middleware/authMiddleware");

const {
  createServiceRequest,
  getMyServices,
  getSingleService,
  cancelService,
} = require("../../Controllers/user/serviceController");

// Create Service Request
router.post("/", protect, createServiceRequest);

// Get All Service Requests of Logged-in User
router.get("/", protect, getMyServices);

// Get Single Service Request
router.get("/:id", protect, getSingleService);

// Cancel Service Request
router.put("/:id/cancel", protect, cancelService);

module.exports = router;
const express = require("express");
const router = express.Router();
const validatorMiddleware=require("../../middleware/validatorMiddlewar");
const serviceValidator=require("../../validator/serviceValidator")
const protect = require("../../middleware/authMiddleware");

const {
  createServiceRequest,
  getMyServices,
  getSingleService,
  cancelService,
} = require("../../controllers/user/serviceController");

router.post(
  "/",
  protect,
  validatorMiddleware(serviceValidator),
  createServiceRequest
  
);

router.get("/", protect, getMyServices);

router.get("/:id", protect, getSingleService);

router.patch("/:id/cancel", protect, cancelService);

module.exports = router;
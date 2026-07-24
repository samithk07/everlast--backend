const express = require("express");
const router = express.Router();
const registerValidator=require("../../validator/registerValidator")
const validatorMiddleware=require("../../middleware/validatorMiddlewar")
const loginValidator=require("../../validator/loginValidator")
const { authLimiter}=require("../../middleware/rateLimiter")

const {
  register,
  login,
  getProfile
} = require("../../controllers/user/authController");

const protect = require("../../middleware/authMiddleware");
const loginValidate = require("../../validator/loginValidator");

router.post("/register",authLimiter,validatorMiddleware(registerValidator), register);
router.post("/login",validatorMiddleware(loginValidate), login);
router.get("/profile", protect, getProfile);

module.exports = router;
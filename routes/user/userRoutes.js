const express = require("express");
const router = express.Router();

const protect = require("../../Middleware/authMiddleware");
const { getProfile } = require("../../Controllers/user/userController");

router.get("/profile", protect, getProfile);

module.exports = router;
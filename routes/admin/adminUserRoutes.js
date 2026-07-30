const express = require("express");
const router = express.Router();

const protect = require("../../middleware/authMiddleware")
const isAdmin = require("../../middleware/adminMiddleware")

const {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser
} = require("../../controllers/admin/adminUserController")
router.get("/", protect, isAdmin, getAllUsers)
router.get("/:id", protect, isAdmin, getUserById)
router.put("/:id/block", protect, isAdmin, blockUser)
router.put("/:id/unblock", protect, isAdmin, unblockUser)
module.exports = router;
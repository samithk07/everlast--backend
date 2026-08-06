const User = require("../../models/User");
const sendResponse = require("../../utils/sendResponse");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return sendResponse(
      res,
      200,
      true,
      "Users fetched successfully",
      users
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      error.message
    );
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return sendResponse(
        res,
        404,
        false,
        "User not found"
      );
    }

    return sendResponse(
      res,
      200,
      true,
      "User fetched successfully",
      user
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      error.message
    );
  }
};

const blockUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from blocking themselves
    if (req.user._id.toString() === id) {
      return sendResponse(
        res,
        400,
        false,
        "You cannot block your own account"
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return sendResponse(
        res,
        404,
        false,
        "User not found"
      );
    }

    if (user.role === "admin") {
      return sendResponse(
        res,
        403,
        false,
        "Cannot block another admin"
      );
    }

    user.isBlocked = true;

    await user.save();

    return sendResponse(
      res,
      200,
      true,
      "User blocked successfully",
      user
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      error.message
    );
  }
};
const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return sendResponse(
        res,
        404,
        false,
        "User not found"
      );
    }

    user.isBlocked = false;

    await user.save();

    return sendResponse(
      res,
      200,
      true,
      "User unblocked successfully",
      user
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      error.message
    );
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,

};
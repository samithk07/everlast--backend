const bcrypt = require("bcryptjs");
const userModel = require("../../Models/User");
const generateToken = require("../../Utils/generateToken");
const sendResponse = require("../../Utils/sendResponse");

// ================= REGISTER =================

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return sendResponse(res, 400, false, "Please fill all required fields");
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return sendResponse(res, 409, false, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    const { AccessToken, RefreshToken } = generateToken(
      user.email,
      user._id,
      user.role
    );

    res
      .cookie("AccessToken", AccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("RefreshToken", RefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

    return sendResponse(res, 201, true, "User registered successfully", {
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// ================= LOGIN =================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, false, "Email and password are required");
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendResponse(res, 401, false, "Invalid credentials");
    }

    const { AccessToken, RefreshToken } = generateToken(
      user.email,
      user._id,
      user.role
    );

    res
      .cookie("AccessToken", AccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("RefreshToken", RefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

    return sendResponse(res, 200, true, "Login successful", {
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// ================= PROFILE =================

const getProfile = async (req, res) => {
  try {
    return sendResponse(
      res,
      200,
      true,
      "Profile fetched successfully",
      {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
      }
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};
//========================logout============================

const logout = async (req, res) => {
  try {
    res
      .clearCookie("Access_Token", {
        sameSite: "lax",
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .clearCookie("Refresh_Token", {
        sameSite: "lax",
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({ Message: "Logout successful" });
  } catch (e) {
    res.status(500).json({ Message: "Logout error" });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  logout,

};
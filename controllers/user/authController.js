const bcrypt = require("bcryptjs");
const userModel = require("../../models/User");
const generateToken = require("../../utils/generateToken");
const sendResponse = require("../../utils/sendResponse");

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
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 15 * 60 * 1000,
  })
  .cookie("RefreshToken", RefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
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
  console.log("========== LOGIN API ==========");
  console.log(req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, false, "Email and password are required");
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    if (user.isBlocked) {
      return sendResponse(
        res,
        403,
        false,
        "Your account has been blocked. Please contact the administrator."
      );
    }
 console.log("User Found:", user.email);
    console.log("Sending Cookies...");
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
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 15 * 60 * 1000,
  })
  .cookie("RefreshToken", RefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
 console.log("Cookies Sent");
    return sendResponse(res, 200, true, "Login successful", {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// ================= PROFILE =================

const getProfile = async (req, res) => {
  try {
    console.log("REQ USER:", req.user);

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
    res.clearCookie("AccessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.clearCookie("RefreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return sendResponse(res, 200, true, "Logout successful");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};
module.exports = {
  register,
  login,
  getProfile,
  logout,

};
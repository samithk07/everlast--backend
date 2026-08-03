const jwt = require("jsonwebtoken");
const userModel = require("../models/User");

const protect = async (req, res, next) => {
    console.log("Cookies:", req.cookies);

  try {
    // Get Access Token from cookies
    const token = req.cookies.AccessToken;
  console.log("AccessToken:", token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    // Verify Access Token
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_KEY
    );

    // Find User
    const user = await userModel.findById(decoded.Id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isBlocked) {
  return res.status(403).json({
    success: false,
    message: "Your account has been blocked by the administrator.",
  });
}

    req.user = user;

    next();
  } catch (error) {
    console.log("JWT Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};

module.exports = protect;
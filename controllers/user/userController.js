const sendResponse = require("../../Utils/sendResponse");

const getProfile = async (req, res) => {
  try {
    sendResponse(
      res,
      200,
      true,
      "Profile fetched successfully",
      req.user
    );
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

module.exports = {
  getProfile,
};
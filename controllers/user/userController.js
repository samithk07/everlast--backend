const User = require("../../Models/User");
const sendResponse = require("../../Utils/sendResponse");

const updateFcmToken = async (req, res) => {
  try {
    

    const { fcmToken } = req.body;

    if (!fcmToken) {
      return sendResponse(
        res,
        400,
        false,
        "FCM token is required"
      );
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        fcmToken,
      },
      {
        new: true,
      }
    );

   

    return sendResponse(
      res,
      200,
      true,
      "FCM token updated successfully",
      user
    );

  } catch (error) {
    console.error("FCM ERROR:", error);

    return sendResponse(
      res,
      500,
      false,
      error.message
    );
  }
};

module.exports = {
  updateFcmToken,
};
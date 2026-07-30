const User = require("../../models/User");
const { sendPushNotification } = require("../../services/pushNotificationService");

const Service = require("../../models/Service");
const sendResponse = require("../../Utils/sendResponse");

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return sendResponse(
      res,
      200,
      true,
      "Services fetched successfully",
      services
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
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("user", "name email phone");

    if (!service) {
      return sendResponse(
        res,
        404,
        false,
        "Service not found"
      );
    }

    return sendResponse(
      res,
      200,
      true,
      "Service fetched successfully",
      service
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
const updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "Pending",
      "Assigned",
      "On The Way",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return sendResponse(
        res,
        400,
        false,
        "Invalid status"
      );
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      return sendResponse(
        res,
        404,
        false,
        "Service not found"
      );
    }

    // Prevent duplicate updates
    if (service.status === status) {
      return sendResponse(
        res,
        400,
        false,
        "Service already has this status"
      );
    }

    service.status = status;

    await service.save();

    // Send Push Notification
    try {
      const user = await User.findById(service.user);

      if (user?.fcmToken) {
        let title = "";
        let body = "";

        switch (status) {
          case "Pending":
            title = "📝 Service Request Received";
            body =
              "Your service request has been received successfully.";
            break;

          case "Assigned":
            title = "👨‍🔧 Technician Assigned";
            body =
              "A technician has been assigned to your service request.";
            break;

          case "On The Way":
            title = "🔧 Service On The Way";
            body =
              "Our technician is currently working on your service request.";
            break;

          case "Completed":
            title = "✅ Service Completed";
            body =
              "Your service request has been completed successfully.";
            break;

          case "Cancelled":
            title = "❌ Service Cancelled";
            body =
              "Your service request has been cancelled.";
            break;

          default:
            title = "🔔 Service Updated";
            body = `Your service status has been updated to ${status}.`;
        }

        await sendPushNotification({
          token: user.fcmToken,
          title,
          body,
        });
      }
    } catch (notificationError) {
      console.error(
        "Push Notification Error:",
        notificationError
      );
    }

    return sendResponse(
      res,
      200,
      true,
      "Service updated successfully",
      service
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
  getAllServices,
  getServiceById,
  updateServiceStatus,
};
const Service = require("../../Models/Service");
const sendResponse = require("../../Utils/sendResponse");

// Create Service Request
const createServiceRequest = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      fullName,
      phone,
      email,
      address,
      serviceType,
      preferredDate,
      description,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !email ||
      !address ||
      !serviceType
    ) {
      return sendResponse(
        res,
        400,
        false,
        "All required fields must be filled"
      );
    }

    const service = await Service.create({
      user: userId,
      fullName,
      phone,
      email,
      address,
      serviceType,
      preferredDate,
      description,
    });

    return sendResponse(
      res,
      201,
      true,
      "Service request created successfully",
      service
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// Get My Service Requests
const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return sendResponse(
      res,
      200,
      true,
      "Service requests fetched successfully",
      services
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// Get Single Service Request
const getSingleService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!service) {
      return sendResponse(
        res,
        404,
        false,
        "Service request not found"
      );
    }

    return sendResponse(
      res,
      200,
      true,
      "Service request fetched successfully",
      service
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// Cancel Service Request
const cancelService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!service) {
      return sendResponse(
        res,
        404,
        false,
        "Service request not found"
      );
    }

    if (service.status !== "Pending") {
      return sendResponse(
        res,
        400,
        false,
        "Only pending service requests can be cancelled"
      );
    }

    service.status = "Cancelled";

    await service.save();

    return sendResponse(
      res,
      200,
      true,
      "Service request cancelled successfully",
      service
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

module.exports = {
  createServiceRequest,
  getMyServices,
  getSingleService,
  cancelService,
};
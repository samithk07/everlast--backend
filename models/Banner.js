const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    mediaUrl: {
      type: String,
      required: true,
    },

    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Banner ||
  mongoose.model("Banner", bannerSchema);
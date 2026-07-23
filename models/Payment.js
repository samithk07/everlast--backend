const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "ONLINE",
    },

    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
const mongoose = require("mongoose");

// Define your Order schema
const paymentSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    orderId: {
      type: String,
      ref: "Order",
      required: true,
    },

    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentDate: {
      type: String,
    },
    paymentAmount: {
      type: String,
    },
    courierName: {
      type: String,
      default: "JAPAN POST",
    },
    trackId: {
      type: String,
    },
    paymentType: {
      type: String,
      default: "Cash On Delivery",
    },

    comment: {
      type: String,
    },
    paymentStatus: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payments", paymentSchema);
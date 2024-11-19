const mongoose = require("mongoose");

// Define your Order schema
const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    itemsDetails: {
      type: String,
    },
    deliveryDate: {
      type: String,
    },
    timeSlot: {
      type: String,
    },
    totalAmount: {
      type: String,
    },
    orderType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);

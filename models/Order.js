const mongoose = require("mongoose");

// Define your Order schema
const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
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

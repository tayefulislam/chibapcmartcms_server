const mongoose = require("mongoose");
const moment = require("moment-timezone");

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
      type: Array,
    },
    deliveryDate: {
      type: String,
    },
    timeSlot: {
      type: String,
    },
    totalAmount: {
      type: Number,
    },
    orderType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

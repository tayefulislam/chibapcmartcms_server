const mongoose = require("mongoose");

// Define your Order schema
const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    paymentObjId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payments",
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
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
      type: String,
    },
    orderType: {
      type: String,
    },
    deliveryCost: {
      type: String,
    },
    deliveryStatus: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({
  "customerId.customerName": "text",
  orderId: "text",
  paymentId: "text",
  "itemsDetails.itemName": "text",
});

module.exports = mongoose.model("Order", orderSchema);

const mongoose = require("mongoose");

// Define your Order schema
const stockOrderSchema = new mongoose.Schema(
  {
    stockOrderId: {
      type: String,
      required: true,
    },
    pId: {
      type: String,
      required: true,
    },
    sId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    supplierId: {
      type: String,
      required: true,
    },

    stocks: {
      type: Array,
      required: true,
    },

    details: {
      type: String,
    },
    comment: {
      type: String,
    },
    totalPurchasePrice: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StockOrder", stockOrderSchema);

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
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Items",
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Supplier",
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

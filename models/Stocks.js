const mongoose = require("mongoose");

// Define your Order schema
const StocksSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Items",
      required: true,
    },
    stockOrderId: {
      type: String,
      required: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Supplier",
    },
    searchKeyWord: {
      type: String,
      required: true,
    },

    ram: {
      type: String,
    },

    color: {
      type: String,
    },
    storage2: {
      type: String,
    },
    storage: {
      type: String,
    },

    description: {
      type: String,
    },
    comments: {
      type: Array,
    },
    purchasePrice: {
      type: String,
    },
    sellingPrice: {
      type: String,
    },
    stockStatus: {
      type: String,
      default: "NOT READY",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Stocks", StocksSchema);

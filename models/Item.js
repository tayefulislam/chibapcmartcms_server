const mongoose = require("mongoose");

// Define your Order schema
const itemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
    },

    details: {
      type: String,
    },
    comment: {
      type: String,
    },

    sellingPrice: {
      type: String,
    },
    purchasePrice: {
      type: String,
    },
    itemType: {
      type: String,
    },
    model: {
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
    ram: {
      type: String,
    },

    itemStatus: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Items", itemSchema);

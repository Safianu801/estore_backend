const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    itemID: {
      type: String,
    },
    owner: {
      type: String,
      required: true,
    },
    product: {
      id: {
        type: Number,
      },
      title: {
        type: String,
      },
      price: {
        type: Number,
      },
      category: {
        type: String,
      },
      description: {
        type: String,
      },
      image: {
        type: String,
      },
    },
    totalQuantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("carts", cartSchema);

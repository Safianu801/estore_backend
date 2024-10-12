const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
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
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

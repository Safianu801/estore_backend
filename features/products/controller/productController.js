const Product = require("../model/productModel");
const User = require("../../auth/model/userModel");
const axios = require("axios");

const populateDB = async (req, res) => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products");
    const products = response.data;

    if (!Array.isArray(products)) {
      throw new Error("Unexpected response format");
    }
    await Product.deleteMany({});
    const insertedProducts = await Product.insertMany(
      products.map((prod) => ({
        id: prod.id,
        title: prod.title,
        price: prod.price,
        category: prod.category,
        description: prod.description,
        image: prod.image,
      }))
    );
  } catch (error) {
    console.error("Error fetching or populating data:", error);
  }
};

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      products: products,
    });
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${e}`,
    });
  }
};

// New function for searching products
const searchProducts = async (req, res) => {
  try {
    let query = {};

    // Check for search parameters in query string
    if (req.query.name) {
      query.title = { $regex: new RegExp(req.query.name, "i") }; // Case-insensitive search for product name
    }
    if (req.query.description) {
      query.description = { $regex: new RegExp(req.query.description, "i") }; // Case-insensitive search for description
    }
    if (req.query.category) {
      query.category = { $regex: new RegExp(req.query.category, "i") }; // Case-insensitive search for category
    }

    const products = await Product.find(query);
    res.status(200).json({
      products: products,
    });
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${e}`,
    });
  }
};

module.exports = {
  populateDB,
  getAllProduct,
  searchProducts,
};

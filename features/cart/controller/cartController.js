const User = require("../../auth/model/userModel");
const Product = require("../../products/model/productModel");
const Cart = require("../model/cartModel");
const { v4 } = require("uuid");
const notification = require("../../notification/model/notificationModel");

//add regular product to cart
const addToCart = async (req, res) => {
  try {
    const { productId, totalQuantity } = req.body;
    const user = await User.findOne({ userID: req.user.userID });
    const product = await Product.findOne({ id: productId });

    if (!user) {
      res.status(400).json({
        title: "Login Required",
        message: "You have to log in to access this feature",
      });
    } else {
      if (!product) {
        res.status(404).json({
          title: "Product Not Found",
          message: "No product found associated with this information",
        });
      } else {
        const cartItem = new Cart({
          owner: user.userID,
          itemID: v4(),
          product: {
            id: product.id,
            title: product.title,
            price: product.price,
            category: product.category,
            description: product.description,
            image: product.image,
          },
          totalQuantity: totalQuantity,
        });

        const saveCart = await cartItem.save();
        if (saveCart) {
          const newNotification = new notification({
            nID: v4(),
            title: "Product Added To Cart",
            message: `You have successfully added ${product.name} to your cart`,
            image: `${product.image}`,
            recipient: user.userID,
          });
          await newNotification.save();
          res.status(200).json({
            title: "Product Added To Cart",
            message: `You have successfully added ${product.name} to your cart and ready for checkout`,
          });
        } else {
          const newNotification = new notification({
            nID: v4(),
            title: "Failed To Add Product To Cart",
            message: `You have successfully added ${product.name} to your cart`,
            image: `${product.image}`,
            recipient: user.userID,
          });
          await newNotification.save();
          res.status(200).json({
            title: "Unable To Added Product To Cart",
            message: `Sorry, we were unable to add ${product.name} to your cart`,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." + error });
  }
};

const getAllCartItems = async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(404).json({
        title: "Login Required",
        message: "you have to login to access this feature ",
      });
    } else {
      const cartItem = await Cart.find({ owner: user.userID });
      res.status(200).json({
        totalCartItem: cartItem.length,
        cart: cartItem,
      });
    }
  } catch (error) {
    res.status(500).json({
      title: "Server Error",
      message: "Internal server error",
    });
  }
};

let getSingleCartItemById = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const user = await User.findOne({ userID: req.user.userID });
    const cart = await Cart.findOne({ itemID: cartItemId });
    if (!user) {
      res.status(400).json({
        title: "Not Allowed",
        message:
          "This feature is allowed for logged in users, please login to continue this action",
      });
    } else {
      if (!cart) {
        res.status(404).json({
          title: "Item Not Found",
          message: "The cart item you are looking for does not exist",
        });
      } else {
        res.status(200).json({
          data: cart,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${err}`,
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { cartId } = req.body;
    const item = await Cart.findOne({ itemID: cartId });
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(200).json({
        title: "Login Required",
        message: "You are expected to login before attempting this feature",
      });
    } else {
      if (!item) {
        res.status(404).json({
          title: "Cart Item Not Found",
          message: "The cart item you are trying to delete does not exist",
        });
      } else {
        const deleteItem = await Cart.findOneAndDelete({ itemID: cartId });
        if (deleteItem) {
          const newNotification = new notification({
            nID: v4(),
            title: "Cart Item Deleted",
            message: `The cart item has been deleted successfully`,
            image: "",
            recipient: user.userID,
          });
          await newNotification.save();
          res.status(200).json({
            title: "Cart Item Deleted",
            message: "The cart item has been deleted successfully",
          });
        } else {
          const newNotification = new notification({
            nID: v4(),
            title: "Unable To Delete Item",
            message: `The cart item (${item.product.name}) you are trying to delete was unable to be deleted, please try again later, Thank You.`,
            image: `${item.product.image}`,
            recipient: user.userID,
          });
          await newNotification.save();
          res.status(400).json({
            title: "Unable To Delete Item",
            message:
              "The cart item you are trying to delete was unable to be deleted, please try again later, Thank You.",
          });
        }
      }
    }
  } catch (err) {
    res.status(500).json({
      title: "Server Error",
      message: `Server error: ${err.message}`,
    });
  }
};

module.exports = {
  addToCart,
  getAllCartItems,
  getSingleCartItemById,
  deleteCartItem,
};

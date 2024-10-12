const route = require("express").Router();
const cartController = require("../controller/cartController");
const tokenHandler = require("../../../middleware/accessTokenValidator");

route.post("/add", tokenHandler, cartController.addToCart);
route.get("/cart-items", tokenHandler, cartController.getAllCartItems);
route.delete("/remove-from-cart", tokenHandler, cartController.deleteCartItem);

module.exports = route;

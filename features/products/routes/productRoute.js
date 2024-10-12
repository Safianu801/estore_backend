const router = require("express").Router();
const productController = require("../controller/productController");

router.get("/p-product", productController.populateDB);
router.get("/get-all-product", productController.getAllProduct);

module.exports = router;

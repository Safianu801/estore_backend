const userController = require("../controller/userController");
const router = require("express").Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.userLogin);
router.post("/reset-password", userController.resetUserPassword);

module.exports = router;

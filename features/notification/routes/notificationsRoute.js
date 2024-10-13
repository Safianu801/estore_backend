const route = require("express").Router();
const notificationController = require("../controller/notificationController");
const accessTokenHandler = require("../../../middleware/accessTokenValidator");

route.get(
  "/all-notifications",
  accessTokenHandler,
  notificationController.getAllNotifications
);

module.exports = route;

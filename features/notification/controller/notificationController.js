const notificationModel = require("../model/notificationModel");
const User = require("../../auth/model/userModel");

const getAllNotifications = async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(400).json({
        title: "Login Required",
        message: "You are expected to login before you can access this feature",
      });
    } else {
      const notifications = await notificationModel.find({
        recipient: user.userID,
      });
      res.status(200).json({
        total: notifications.length,
        data: notifications,
      });
    }
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${e}`,
    });
  }
};

module.exports = { getAllNotifications };

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    nID: {
      type: String,
    },
    title: {
      type: String,
    },
    message: {
      type: String,
    },
    image: {
      type: String,
    },
    recipient: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("notifications", notificationSchema);

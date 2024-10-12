const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB_URL);
    if (connect) {
      console.log("Databse Connected");
    } else {
      console.log("Unable To Connect DB");
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = connectDatabase;

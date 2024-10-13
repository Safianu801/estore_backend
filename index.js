const express = require("express");
const userRouter = require("./features/auth/routes/userRoute");
const productRouter = require("./features/products/routes/productRoute");
const cartRouter = require("./features/cart/routes/cartRouter");
const notificationRouter = require("./features/notification/routes/notificationsRoute");
const connectDatabase = require("./config/connectDB");
require("dotenv").config();

const PORT = process.env.PORT || 3333;
const app = express();
app.use(express.json());
app.use("/api/v1/e-stores/users", userRouter);
app.use("/api/v1/e-stores/products", productRouter);
app.use("/api/v1/e-stores/carts", cartRouter);
app.use("/api/v1/e-stores/notifications", notificationRouter);

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is now live on PORT: ${PORT}`);
    });
  })
  .catch((E) => {
    console.log(E);
  });

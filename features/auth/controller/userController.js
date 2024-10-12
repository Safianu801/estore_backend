const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const bcrypt = require("bcryptjs");

//register user
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(400).json({
        title: "User Alrady Exists",
        message:
          "The email you are trying to use is already in use by another user",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        userID: v4(),
        firstName,
        lastName,
        email,
        password: encryptedPassword,
      });
      const saveUser = await newUser.save();
      if (saveUser) {
        res.status(201).json({
          title: "User Registered Successfully",
          message: "You have successfully registered to our store",
        });
      } else {
        res.status(400).json({
          title: "Registration Failed",
          message:
            "We were unable to register you at the moment, please check the details and try again",
        });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${e}`,
    });
  }
};

//user login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).json({
        title: "Email Does Not Exist",
        message: "The email you are trying to login with does not exits",
      });
    } else {
      const isPassword = await bcrypt.compare(password, user.password);
      if (!isPassword) {
        res.status(400).json({
          title: "Wrong Password",
          message: "The password you provided is incorrect",
        });
      } else {
        const token = jwt.sign(
          {
            user: {
              userID: user.userID,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            },
          },
          process.env.KEY,
          { expiresIn: "5d" }
        );
        res.status(200).json({
          title: "Success",
          user: { token, ...user._doc },
        });
      }
    }
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${e}`,
    });
  }
};

//reset password
const resetUserPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(200).json({
        title: "Email",
        message: "Email exists",
      });
    } else {
      if (!email || !newPassword) {
        res.status(400).json({
          title: "Missing Fields",
          message: "Please make sure to provide all required fields",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(newPassword, salt);
        const resetPassword = new User.findOneAndUpdate(
          { email: email },
          { password: encryptedPassword }
        );
        if (resetPassword) {
          res.status(200).json({
            title: "Password Reset Successful",
            message:
              "You have successfully reset your password, you can now proceed to login with the new password",
          });
        } else {
          res.status(400).json({
            title: "Unable To Reset Password",
            message:
              "We are unable to reset your password, please try again later, Thank You.",
          });
        }
      }
    }
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `Sever Error`,
    });
  }
};

module.exports = {
  registerUser,
  userLogin,
  resetUserPassword,
};

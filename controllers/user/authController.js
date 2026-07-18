const bcrypt = require("bcryptjs");

const userModel = require("../../Models/User");

const generateToken = require("../../Utils/generateToken");
const sendResponse = require("../../Utils/sendResponse");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
   console.log("requested :",req.body);
   
    if (!name || !email || !password) {
      return sendResponse(
        res,
        400,
        false,
        "Please fill all required fields"
      );
    }

    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return sendResponse(
        res,
        409,
        false,
        "User already exists"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });
 console.log("created useer:",user);
 
    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendResponse(
      res,
      201,
      true,
      "User registered successfully",
      {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    );
  } catch (error) {
    sendResponse(res, 500, false, error.message);
    console.log(error);
    
  }
};

module.exports = {
  registerUser,
};
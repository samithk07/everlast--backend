const express=require("express");
const route=express.Router();
const validatorMiddleware=require("../../middleware/validatorMiddlewar");
const loginValidate=require("../../validator/loginValidator");
const registervalidate=require("../../validator/registerValidator");
const {register,login,getProfile,logout}=require("../../controllers/user/authController");
const protect=require("../../middleware/authMiddleware")
const generateToken=require("../../utils/generateToken");

const { authLimiter}=require("../../middleware/rateLimiter")




route.post("/register",authLimiter,validatorMiddleware(registervalidate),register);


route.post("/login",authLimiter,validatorMiddleware(loginValidate),login);
route.post("/logout",protect,logout);
route.post("/refresh",generateToken);
route.get("/getProfile",getProfile);




module.exports=route;
const express=require("express");
const {addProduct}=require("../../controllers/admin/adminProductController")
const upload=require("../../config/multerProduct");
const validatorMiddlewar=require("../../middleware/validatorMiddlewar")
const productValidate=require("../../validator/productValidator")


const route=express.Router();



route.post("/",upload.single("image"),validatorMiddlewar(productValidate),addProduct);


module.exports=route;
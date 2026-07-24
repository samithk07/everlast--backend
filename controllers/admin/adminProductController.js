const productModel=require("../../models/Product");

const cloudinary=require("../../config/cloudinary");
const { login } = require("../user/authController");






const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      brand,
      price,
      originalPrice,
      discount,
      stock,
      rating,
      reviews,
      warranty,
      features,
      status,
    } = req.body;
    console.log(req.body);
    

    const existing = await productModel.findOne({ name });

    if (existing) {
      return res.status(400).json({
        message: "Product already exists",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const product = await productModel.create({
      name,
      category,
      description,
      brand,
      price,
      originalPrice,
      discount,
      stock,
      rating,
      reviews,
      warranty,
      features,
      status,

      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    return res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
     console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};






module.exports={addProduct};
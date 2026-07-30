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

const Product = require("../../Models/Product");
const sendResponse = require("../../Utils/sendResponse");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return sendResponse(
      res,
      200,
      true,
      "Products fetched successfully",
      products
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return sendResponse(
        res,
        404,
        false,
        "Product not found"
      );
    }

    // Update image if uploaded
    if (req.file) {
      // Delete old image
      if (product.image?.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }

      product.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    // Update fields
    product.name = req.body.name || product.name;
    product.category = req.body.category || product.category;
    product.description = req.body.description || product.description;
    product.brand = req.body.brand || product.brand;
    product.price = req.body.price || product.price;
    product.originalPrice =
      req.body.originalPrice || product.originalPrice;
    product.discount = req.body.discount || product.discount;
    product.stock = req.body.stock || product.stock;
    product.rating = req.body.rating || product.rating;
    product.reviews = req.body.reviews || product.reviews;
    product.warranty = req.body.warranty || product.warranty;
    product.features = req.body.features || product.features;
    product.status = req.body.status || product.status;

    await product.save();

    return sendResponse(
      res,
      200,
      true,
      "Product updated successfully",
      product
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      error.message
    );
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return sendResponse(
        res,
        404,
        false,
        "Product not found"
      );
    }

    // Delete image from Cloudinary
    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    // Delete product
    await productModel.findByIdAndDelete(id);

    return sendResponse(
      res,
      200,
      true,
      "Product deleted successfully"
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      error.message
    );
  }
};

const changeProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return sendResponse(
        res,
        400,
        false,
        "Invalid status"
      );
    }

    const product = await productModel.findById(id);

    if (!product) {
      return sendResponse(
        res,
        404,
        false,
        "Product not found"
      );
    }

    product.status = status;

    await product.save();

    return sendResponse(
      res,
      200,
      true,
      "Product status updated successfully",
      product
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      error.message
    );
  }
};
module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  changeProductStatus,

};




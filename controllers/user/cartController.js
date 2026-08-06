const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const sendResponse = require("../../utils/sendResponse");

// ================= ADD TO CART =================

const addToCart = async (req, res) => {

  try {
    const userId = req.user._id;
    const {productId}=req.params;
    const quantity = 1;

    if (!productId) {
      return sendResponse(res, 400, false, "Product ID is required");
    }

    const product = await Product.findById(productId);

    if (!product) {
      return sendResponse(res, 404, false, "Product not found");
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [
          {
            product: productId,
            quantity,
          },
        ],
      });
console.log("Cart Before Save:", cart)
      await cart.save();
      console.log("Cart Saved");

      return sendResponse(res, 201, true, "Product added to cart", cart);
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    return sendResponse(res, 200, true, "Product added to cart", cart);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// ================= GET CART =================

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product"
    );

    if (!cart) {
      return sendResponse(res, 200, true, "Cart is empty", {
        items: [],
      });
    }

    return sendResponse(res, 200, true, "Cart fetched successfully", cart);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// ================= UPDATE QUANTITY =================

const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return sendResponse(
        res,
        400,
        false,
        "Quantity must be greater than 0"
      );
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return sendResponse(res, 404, false, "Cart not found");
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return sendResponse(res, 404, false, "Product not found in cart");
    }

    item.quantity = quantity;

    await cart.save();

    return sendResponse(res, 200, true, "Cart updated successfully", cart);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// ================= REMOVE ITEM =================

const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return sendResponse(res, 404, false, "Cart not found");
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    return sendResponse(res, 200, true, "Item removed successfully", cart);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// ================= CLEAR CART =================

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return sendResponse(res, 404, false, "Cart not found");
    }

    cart.items = [];

    await cart.save();

    return sendResponse(res, 200, true, "Cart cleared successfully");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeCartItem,
  clearCart,
};
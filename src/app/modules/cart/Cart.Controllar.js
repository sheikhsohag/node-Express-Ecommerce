import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import Product from '../Product/product.models.js';
import Cart from './Cart.Models.js';



const addToCart = catchAsync(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.userId;
  
 
    const product = await Product.findById(productId);
    if (!product) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: 'Product not found!',
      });
    }
  
    if (quantity > product.availableNumberOfProduct) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Insufficient stock available!',
      });
    }
  
   
    let cart = await Cart.findOne({ user: userId });
  
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity, price: product.price }],
      });
    } else {
      const existingItem = cart.items.find(item => item.product.toString() === productId);
  
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price: product.price });
      }
    }
  
   
    await cart.save();
  
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Product added to cart successfully!',
      data: cart,
    });
  });
  
  

const getAllCarts = catchAsync(async (req, res) => {
  const carts = await Cart.find().populate('items.product', '-__v -createdAt -updatedAt');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart items retrieved successfully!',
    data: carts,
  });
});


const getUserCart = catchAsync(async (req, res) => {
  const userId = req.userId; 
  const cartItems = await Cart.find({ user: userId }).populate('items.product', '-__v -createdAt -updatedAt');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart items retrieved successfully!',
    data: cartItems,
  });
});


const updateCartItem = catchAsync(async (req, res) => {
  const { quantity } = req.body;
  const userId = req.userId;
  const { cartItemId } = req.params;

  const cartItem = await Cart.findOne({ _id: cartItemId, user: userId });

  if (!cartItem) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Cart item not found!',
    });
  }

  // Check if quantity is valid
  const product = await Product.findById(cartItem.items[0].product);

  if (quantity > product.availableNumberOfProduct) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Insufficient stock available!',
    });
  }

  cartItem.items[0].quantity = quantity;
  await cartItem.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart item updated successfully!',
    data: cartItem,
  });
});

// ✅ Remove an item from the cart
const removeCartItem = catchAsync(async (req, res) => {
  const userId = req.userId;
  const { cartItemId } = req.params;

  const cartItem = await Cart.findOneAndDelete({ _id: cartItemId, user: userId });

  if (!cartItem) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Cart item not found!',
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart item removed successfully!',
  });
});

// ✅ Clear the entire cart for a user
const clearCart = catchAsync(async (req, res) => {
  const userId = req.userId;

  await Cart.deleteMany({ user: userId });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart cleared successfully!',
  });
});

export const CartController = {
  addToCart,
  getAllCarts,
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};

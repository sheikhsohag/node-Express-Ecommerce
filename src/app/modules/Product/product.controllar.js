import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import fs from 'fs';
import path from 'path';
import Product from './product.models.js';


const createProduct = catchAsync(async (req, res) => {
  try {
    let { name, category, price, availableNumberOfProduct, rating, review } = req.body;
    const images = req.files && req.files.length > 0 ? req.files.map(file => file.path) : [];

    // Convert price and availableNumberOfProduct to numbers
    price = parseFloat(price);
    availableNumberOfProduct = parseInt(availableNumberOfProduct, 10);

    // Convert rating and review from string to array if provided
    if (rating) {
      try {
        rating = JSON.parse(rating);
      } catch (error) {
        return sendResponse(res, {
          statusCode: httpStatus.BAD_REQUEST,
          success: false,
          message: 'Invalid rating format. Expected an array of numbers.'
        });
      }
    } else {
      rating = [];
    }

    if (review) {
      try {
        review = JSON.parse(review);
      } catch (error) {
        return sendResponse(res, {
          statusCode: httpStatus.BAD_REQUEST,
          success: false,
          message: 'Invalid review format. Expected an array of strings.'
        });
      }
    } else {
      review = [];
    }

    // Assuming `req.userId` is set from the `verifyToken` middleware
    const createdBy = req.userId;  // This will be passed by the `verifyToken` middleware

    const product = await Product.create({
      name,
      category,
      price,
      availableNumberOfProduct,
      images,
      rating,
      review,
      createdBy  
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Product created successfully!',
      data: product
    });
  } catch (error) {
    if (req.files) {
      req.files.forEach(file => fs.unlinkSync(file.path));
    }
    throw error;
  }
});



// ✅ Get All Products
const getProducts = catchAsync(async (req, res) => {
  const products = await Product.find().select('-__v -createdAt -updatedAt');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully!',
    data: products
  });
});

// ✅ Get Product by ID
const getProductById = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id).select('-__v -createdAt -updatedAt');

  if (!product) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Product not found!',
      data: null
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully!',
    data: product
  });
});

// ✅ Update Product (Replacing Old Images)

const updateProduct = catchAsync(async (req, res) => {
  try {
    const { name, category, price, availableNumberOfProduct, rating, review } = req.body;
    const newImages = req.files && req.files.length > 0 ? req.files.map(file => file.path) : [];

    // Find product by ID
    const product = await Product.findById(req.params.id);
    if (!product) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: 'Product not found!',
        data: null
      });
    }

    // Convert numeric fields if they are provided
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (category) updatedFields.category = category;
    if (price) updatedFields.price = parseFloat(price);
    if (availableNumberOfProduct) updatedFields.availableNumberOfProduct = parseInt(availableNumberOfProduct, 10);
    
    // Convert rating from string to array and push to existing list
    if (rating) {
      try {
        const parsedRating = JSON.parse(rating);
        if (!Array.isArray(parsedRating) || !parsedRating.every(num => typeof num === 'number')) {
          throw new Error();
        }
        product.rating.push(...parsedRating);
      } catch (error) {
        return sendResponse(res, {
          statusCode: httpStatus.BAD_REQUEST,
          success: false,
          message: 'Invalid rating format. Expected an array of numbers.'
        });
      }
    }

    // Convert review from string to array and push to existing list
    if (review) {
      try {
        const parsedReview = JSON.parse(review);
        if (!Array.isArray(parsedReview) || !parsedReview.every(str => typeof str === 'string')) {
          throw new Error();
        }
        product.review.push(...parsedReview);
      } catch (error) {
        return sendResponse(res, {
          statusCode: httpStatus.BAD_REQUEST,
          success: false,
          message: 'Invalid review format. Expected an array of strings.'
        });
      }
    }

    // Handle images - Replace only if new images are uploaded
    if (newImages.length > 0) {
      // Delete old images if they exist
      product.images.forEach(imagePath => {
        const filePath = path.resolve(imagePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      updatedFields.images = newImages;
    }

    // Update product with new fields
    Object.assign(product, updatedFields);
    await product.save();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product updated successfully!',
      data: product
    });
  } catch (error) {
    if (req.files) {
      req.files.forEach(file => fs.unlinkSync(file.path));
    }
    throw error;
  }
});



const deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Product not found!',
      data: null
    });
  }

  // ❌ Delete associated images from the file system
  product.images.forEach(imagePath => fs.unlinkSync(imagePath));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully!',
    data: null
  });
});

export const ProductController = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};

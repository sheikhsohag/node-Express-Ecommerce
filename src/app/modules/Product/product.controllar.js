import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import fs from 'fs';
import path from 'path';
import Product from './product.models.js';


const createProduct = catchAsync(async (req, res) => {
  try {
    const { name, category, price, availableNumberOfProduct } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const product = await Product.create({ name, category, price, availableNumberOfProduct, images });

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
  const { name, category, price, availableNumberOfProduct } = req.body;
  const newImages = req.files ? req.files.map(file => file.path) : [];

  const product = await Product.findById(req.params.id);
  if (!product) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Product not found!',
      data: null
    });
  }

  // ❌ Delete old images if new images are uploaded
  if (newImages.length > 0) {
    // Delete old images only if they exist
    product.images.forEach(imagePath => {
      const filePath = path.resolve(imagePath); // Resolving the full file path
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file if it exists
      }
    });
  }

  product.name = name || product.name;
  product.category = category || product.category;
  product.price = price || product.price;
  product.availableNumberOfProduct = availableNumberOfProduct || product.availableNumberOfProduct;
  product.images = newImages.length > 0 ? newImages : product.images;

  await product.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully!',
    data: product
  });
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

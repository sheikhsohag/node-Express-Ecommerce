import httpStatus from 'http-status';
import Product from '../Product/product.models';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';



const createProduct = catchAsync(async (req, res) => {
  const { name, category, price, availableNumberOfProduct, rating, review } = req.body;
  const images = req.files ? req.files.map(file => file.path) : [];

  const product = await Product.create({ name, category, price, availableNumberOfProduct, rating, review, images });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product created successfully!',
    data: product
  });
});

const getProducts = catchAsync(async (req, res) => {
  const products = await Product.find().select('-__v -createdAt -updatedAt');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully!',
    data: products
  });
});


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


const updateProduct = catchAsync(async (req, res) => {
  const { name, category, price, availableNumberOfProduct, rating, review } = req.body;
  const images = req.files ? req.files.map(file => file.path) : [];

  const product = await Product.findByIdAndUpdate(req.params.id, 
    { name, category, price, availableNumberOfProduct, rating, review, $push: { images: images } },
    { new: true }
  );

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

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully!',
    data: null
  });
});


export default product = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};

import Product from "../../modules/Product/product.models.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js"; // Import sendResponse
import httpStatus from "http-status"; // Import httpStatus

const checkProductOwnership = catchAsync(async (req, res, next) => {
  const user = req.user;  // Ensure `user` is set from token or session

  console.log("user", user);
  const productId = req.params.id;


    const product = await Product.findById(productId);
    if (!product) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: 'Product not found!',
        data: null
      });
    }

    // console.log("user", user, user.role);
    if (!product.createdBy.equals(user._id)) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED, 
        success: false,
        message: 'Unauthorized: You do not have permission to modify this product.',
        data: null
      });
    }

    next();  
});

export default checkProductOwnership;

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    availableNumberOfProduct: { type: Number, required: true },
    rating: { type: [Number], default: [] },
    review: { type: [String], default: [] },
    images: { type: [String], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema);

export default Product;

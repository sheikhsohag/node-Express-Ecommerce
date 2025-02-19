import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    availableNumberOfProduct: { type: Number, required: true },
    rating: { type: [Number], default: [] },
    review: { type: [String], default: [] },
    images: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

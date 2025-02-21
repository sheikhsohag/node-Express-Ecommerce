import mongoose from "mongoose";
const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['active', 'ordered'], default: 'active' }
});


CartSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce((total, item) => total + item.quantity * item.price, 0);
  next();
});

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;

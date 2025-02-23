import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'restaurant', 'user'], default: 'user' }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isNew) { 
    const User = mongoose.model('User');
    const count = await User.estimatedDocumentCount();

    if (count === 0) {
      this.role = 'admin';
    }
  }
  next();
});


const User = mongoose.model('User', userSchema);

export default User;

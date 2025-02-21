import jwt from 'jsonwebtoken';
import User from '../modules/Peoples/people.models.js';

const verifyToken = (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1];

    // If no token is provided, return 401 Unauthorized
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user =  User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user;
    // Attach the decoded user data (usually the userId) to the request object
    req.userId = decoded.userId; 
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token. Authentication failed.' });
    } else {
      // General error message
      console.error(error);  // Log the error for debugging
      return res.status(401).json({ error: 'Authentication failed.' });
    }
  }
};

export default verifyToken;

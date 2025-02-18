import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  try {
   
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

   
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId; 

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token. Authentication failed.' });
    } else {
      return res.status(401).json({ error: 'Authentication failed.' });
    }
  }
};

export default verifyToken;

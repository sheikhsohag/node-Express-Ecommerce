import catchAsync from "../utils/catchAsync";
import jwt from jsonwebtoken;

const verifyToken = catchAsync((req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
})

export default verifyToken;
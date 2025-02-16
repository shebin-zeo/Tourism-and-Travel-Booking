import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyGuide = (req, res, next) => {
  // Retrieve token from cookies or Authorization header
  const token = req.cookies?.access_token || 
                (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  
  if (!token) {
    return next(errorHandler(401, "Access Denied. No token provided."));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Check if the token indicates that the user is a guide
    if (decoded.role !== "guide") {
      return next(errorHandler(403, "Access denied. Not a guide."));
    }
    req.user = decoded;
    next();
  } catch (err) {
    return next(errorHandler(401, "Token is not valid"));
  }
};

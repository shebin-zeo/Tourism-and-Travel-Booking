import { verifyToken } from './verifyUser.js';
import { errorHandler } from './error.js';

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err); // Handle token verification errors

    // Check if user exists and has an admin role
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      next(errorHandler(403, 'Access denied. Admins only.'));
    }
  });
};

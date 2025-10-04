import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Middleware to check if user is authenticated
export const isAuthenticated = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user object to the request, excluding the password
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if user has the 'leader' role
export const isLeader = (req, res, next) => {
  if (req.user && req.user.role === 'leader') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a leader' });
  }
};
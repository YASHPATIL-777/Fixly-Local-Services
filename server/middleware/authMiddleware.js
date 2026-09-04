import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Technician from '../models/Technician.js';

// Protect middleware to authenticate requests
export const protect = async (req, res, next) => {
  let token;

  // 1. Read token from Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Read token from HTTP-Only cookie
  else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, missing access token'
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'fixnear_default_jwt_secret_key_2026';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists'
      });
    }

    if (user.accountStatus === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Account is suspended. Please contact Fixly support.'
      });
    }

    req.user = user;

    // Attach technician profile if technician
    if (user.role === 'technician') {
      const techProfile = await Technician.findOne({ userId: user._id });
      req.technicianProfile = techProfile;
    }

    next();
  } catch (error) {
    console.error('JWT Verification error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid or expired'
    });
  }
};

// Role-based access control middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: Role '${req.user?.role}' is not authorized to access this resource`
      });
    }
    next();
  };
};

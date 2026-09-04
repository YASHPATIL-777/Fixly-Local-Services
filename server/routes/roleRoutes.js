import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customer protected route
router.get('/customer/profile', protect, authorizeRoles('customer'), (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Customer Profile API',
    user: req.user
  });
});

// Technician protected route
router.get('/technician/profile', protect, authorizeRoles('technician'), (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Technician Profile API',
    user: req.user,
    technicianProfile: req.technicianProfile
  });
});

// Admin protected route
router.get('/admin/dashboard', protect, authorizeRoles('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Admin Dashboard API',
    user: req.user
  });
});

export default router;

import express from 'express';
import { 
  getAdminStats, 
  getAdminUsers, 
  updateUserStatus, 
  getAdminTechnicians, 
  verifyTechnicianAdmin, 
  getAdminRequestsList, 
  getAdminReviewsList, 
  deleteAdminReview, 
  getAdminAnalytics 
} from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication AND 'admin' role
router.use(protect, authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.patch('/users/:id/status', updateUserStatus);

router.get('/technicians', getAdminTechnicians);
router.patch('/technicians/:id/verify', verifyTechnicianAdmin);

router.get('/requests', getAdminRequestsList);

router.get('/reviews', getAdminReviewsList);
router.delete('/reviews/:id', deleteAdminReview);

router.get('/analytics', getAdminAnalytics);

export default router;

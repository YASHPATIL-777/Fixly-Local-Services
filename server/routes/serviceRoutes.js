import express from 'express';
import { 
  getServices, 
  getServiceBySlug, 
  createService, 
  updateService, 
  deleteService 
} from '../controllers/serviceController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/:slug', getServiceBySlug);

// Admin-only management routes
router.post('/', protect, authorizeRoles('admin'), createService);
router.put('/:id', protect, authorizeRoles('admin'), updateService);
router.delete('/:id', protect, authorizeRoles('admin'), deleteService);

export default router;

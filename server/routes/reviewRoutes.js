import express from 'express';
import { 
  createReview, 
  getTechnicianReviews, 
  getMyReviews 
} from '../controllers/reviewController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public review lookup for technician profile
router.get('/technician/:technicianId', getTechnicianReviews);

// Protected customer review routes
router.use(protect);
router.post('/', authorizeRoles('customer', 'technician'), createReview);
router.get('/my', authorizeRoles('customer', 'technician'), getMyReviews);

export default router;

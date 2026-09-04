import express from 'express';
import { 
  getPublicTechnicians, 
  getTechnicianById, 
  getMyTechnicianProfile, 
  updateMyTechnicianProfile 
} from '../controllers/technicianController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public discovery routes
router.get('/', getPublicTechnicians);

// Protected technician routes (must precede /:id)
router.get('/me', protect, authorizeRoles('technician'), getMyTechnicianProfile);
router.put('/me', protect, authorizeRoles('technician'), updateMyTechnicianProfile);

// Public technician detail route
router.get('/:id', getTechnicianById);

export default router;

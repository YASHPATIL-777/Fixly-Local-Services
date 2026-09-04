import express from 'express';
import { 
  createRequest, 
  getMyCustomerRequests, 
  getTechnicianRequests, 
  getRequestById, 
  acceptRequest, 
  rejectRequest, 
  startRequest,
  completeRequest,
  cancelRequest 
} from '../controllers/requestController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { uploadProblemImages } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All request routes require authentication
router.use(protect);

router.post('/', authorizeRoles('customer', 'technician'), uploadProblemImages, createRequest);
router.get('/my', authorizeRoles('customer', 'technician'), getMyCustomerRequests);
router.get('/technician', authorizeRoles('technician'), getTechnicianRequests);

router.patch('/:id/accept', authorizeRoles('technician'), acceptRequest);
router.patch('/:id/reject', authorizeRoles('technician'), rejectRequest);
router.patch('/:id/start', authorizeRoles('technician'), startRequest);
router.patch('/:id/complete', authorizeRoles('technician'), completeRequest);
router.patch('/:id/cancel', authorizeRoles('customer', 'technician'), cancelRequest);

router.get('/:id', getRequestById);

export default router;

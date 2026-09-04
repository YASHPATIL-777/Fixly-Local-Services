import ServiceRequest from '../models/ServiceRequest.js';
import Technician from '../models/Technician.js';
import Service from '../models/Service.js';
import Notification from '../models/Notification.js';
import mongoose from 'mongoose';
import { uploadImagesToCloudinary, deleteCloudinaryImages } from '../utils/uploadStorage.js';

// Utility helper to generate booking reference if missing
const generateBookingRef = () => {
  const year = new Date().getFullYear();
  const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `FX-${year}-${randomCode}`;
};

// @desc    Create new service request
// @route   POST /api/requests
// @access  Private (Customer/Technician)
export const createRequest = async (req, res) => {
  const uploadedFiles = req.files || [];
  let problemImages = [];

  try {
    const customerId = req.user._id;
    const {
      technicianId,
      serviceId,
      problemTitle,
      problemDescription,
      serviceDate,
      serviceTime,
      address,
      city,
      postalCode
    } = req.body;

    // 1. Basic validation
    if (!technicianId || !serviceId || !problemTitle || !problemDescription || !serviceDate || !serviceTime || !address || !city || !postalCode) {
      return res.status(400).json({ success: false, message: 'All request fields are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(technicianId) || !mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ success: false, message: 'Invalid technician or service ID' });
    }

    // 2. Validate Technician exists, is approved, and is available
    const technician = await Technician.findById(technicianId).populate('userId', 'name email');
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Selected technician not found' });
    }

    if (technician.verificationStatus !== 'approved') {
      return res.status(400).json({ success: false, message: 'Selected technician is currently pending verification' });
    }

    if (technician.availability === false) {
      return res.status(400).json({ success: false, message: 'Selected technician is currently unavailable for work' });
    }

    // 3. Validate Service exists and technician offers this service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Selected service category not found' });
    }

    const offersService = technician.serviceIds.some(sId => sId.toString() === serviceId.toString()) ||
                          technician.serviceCategory?.toLowerCase() === service.slug.toLowerCase();

    if (!offersService) {
      return res.status(400).json({ success: false, message: `Technician does not offer ${service.name} services` });
    }

    // 4. Validate Service Date is not in past
    const inputDate = new Date(serviceDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (inputDate < today) {
      return res.status(400).json({ success: false, message: 'Service date cannot be in the past' });
    }

    // 5. Check for duplicate pending request
    const existingPending = await ServiceRequest.findOne({
      customerId,
      technicianId,
      serviceId,
      status: 'PENDING'
    });

    if (existingPending) {
      return res.status(400).json({ success: false, message: 'You already have a pending service request with this technician' });
    }

    // 6. Upload problem images to Cloudinary (folder: fixnear/problem-images)
    if (uploadedFiles.length > 0) {
      problemImages = await uploadImagesToCloudinary(uploadedFiles);
    }

    // 7. Create Service Request Record in MongoDB
    let newRequest;
    try {
      newRequest = await ServiceRequest.create({
        bookingReference: generateBookingRef(),
        customerId,
        technicianId,
        serviceId,
        problemTitle: problemTitle.trim(),
        problemDescription: problemDescription.trim(),
        serviceDate: inputDate,
        serviceTime,
        address: address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        estimatedPrice: technician.hourlyRate || '₹800 – ₹1,200',
        problemImages,
        status: 'PENDING'
      });

      // Trigger Notification for Technician User
      await Notification.create({
        userId: technician.userId._id,
        type: 'REQUEST_CREATED',
        title: '🔧 New Service Request',
        message: `${req.user.name} requested ${service.name} service: "${problemTitle.trim()}"`,
        relatedRequestId: newRequest._id
      });
    } catch (dbError) {
      // If DB creation fails after Cloudinary upload, clean up uploaded Cloudinary assets
      if (problemImages.length > 0) {
        await deleteCloudinaryImages(problemImages);
      }
      throw dbError;
    }

    const populatedRequest = await ServiceRequest.findById(newRequest._id)
      .populate('customerId', 'name email phone')
      .populate({
        path: 'technicianId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate('serviceId', 'name slug icon');

    res.status(201).json({
      success: true,
      message: 'Service request submitted successfully',
      data: populatedRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get customer's own service requests & bookings
// @route   GET /api/requests/my
// @access  Private (Customer)
export const getMyCustomerRequests = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { customerId: req.user._id };

    if (status && status !== 'ALL') {
      if (status === 'UPCOMING') {
        query.status = 'ACCEPTED';
      } else if (status === 'ACTIVE') {
        query.status = 'IN_PROGRESS';
      } else {
        query.status = status.toUpperCase();
      }
    }

    const requests = await ServiceRequest.find(query)
      .populate({
        path: 'technicianId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate('serviceId', 'name slug icon')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get technician's assigned service requests & active jobs
// @route   GET /api/requests/technician
// @access  Private (Technician)
export const getTechnicianRequests = async (req, res) => {
  try {
    const technician = await Technician.findOne({ userId: req.user._id });
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician profile record not found' });
    }

    const { status } = req.query;
    let query = { technicianId: technician._id };

    if (status && status !== 'ALL') {
      query.status = status.toUpperCase();
    }

    const requests = await ServiceRequest.find(query)
      .populate('customerId', 'name email phone')
      .populate('serviceId', 'name slug icon')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single request details with strict authorization
// @route   GET /api/requests/:id
// @access  Private
export const getRequestById = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate({
        path: 'technicianId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate('serviceId', 'name slug icon description');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    // Ensure bookingReference is populated for legacy records
    if (!request.bookingReference) {
      request.bookingReference = generateBookingRef();
      await request.save();
    }

    const userIdStr = req.user._id.toString();
    const isCustomerOwner = request.customerId._id.toString() === userIdStr;
    const isAssignedTechnician = request.technicianId.userId._id.toString() === userIdStr;
    const isAdmin = req.user.role === 'admin';

    if (!isCustomerOwner && !isAssignedTechnician && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this service request' });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept service request (PENDING -> ACCEPTED)
// @route   PATCH /api/requests/:id/accept
// @access  Private (Technician)
export const acceptRequest = async (req, res) => {
  try {
    const technician = await Technician.findOne({ userId: req.user._id }).populate('userId');
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician profile not found' });
    }

    const request = await ServiceRequest.findById(req.params.id).populate('serviceId');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    // Ownership check
    if (request.technicianId.toString() !== technician._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: Request is not assigned to you' });
    }

    // Status transition check
    if (request.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: `Cannot accept request with status ${request.status}` });
    }

    request.status = 'ACCEPTED';
    await request.save();

    // Trigger Notification for Customer User
    await Notification.create({
      userId: request.customerId,
      type: 'REQUEST_ACCEPTED',
      title: '✓ Request Accepted',
      message: `${technician.userId?.name || 'Technician'} accepted your ${request.serviceId?.name || 'service'} request.`,
      relatedRequestId: request._id
    });

    res.json({
      success: true,
      message: 'Service request accepted successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject service request (PENDING -> REJECTED)
// @route   PATCH /api/requests/:id/reject
// @access  Private (Technician)
export const rejectRequest = async (req, res) => {
  try {
    const technician = await Technician.findOne({ userId: req.user._id }).populate('userId');
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician profile not found' });
    }

    const request = await ServiceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    // Ownership check
    if (request.technicianId.toString() !== technician._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: Request is not assigned to you' });
    }

    // Status transition check
    if (request.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: `Cannot reject request with status ${request.status}` });
    }

    const { note } = req.body;
    request.status = 'REJECTED';
    request.technicianResponseNote = note || 'Not available at requested schedule / location.';
    await request.save();

    // Trigger Notification for Customer User
    await Notification.create({
      userId: request.customerId,
      type: 'REQUEST_REJECTED',
      title: 'Request Declined',
      message: `${technician.userId?.name || 'Technician'} declined your request: "${request.technicianResponseNote}"`,
      relatedRequestId: request._id
    });

    res.json({
      success: true,
      message: 'Service request declined',
      data: request
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Start service (ACCEPTED -> IN_PROGRESS)
// @route   PATCH /api/requests/:id/start
// @access  Private (Technician Only)
export const startRequest = async (req, res) => {
  try {
    const technician = await Technician.findOne({ userId: req.user._id }).populate('userId');
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician profile record not found' });
    }

    const request = await ServiceRequest.findById(req.params.id).populate('serviceId');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    // Ownership check
    if (request.technicianId.toString() !== technician._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: Request is not assigned to you' });
    }

    // State transition verification
    if (request.status === 'PENDING') {
      return res.status(400).json({ success: false, message: 'Only accepted services can be started.' });
    }
    if (request.status === 'IN_PROGRESS') {
      return res.status(400).json({ success: false, message: 'Service is already in progress.' });
    }
    if (request.status === 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'Service is already completed.' });
    }
    if (request.status !== 'ACCEPTED') {
      return res.status(400).json({ success: false, message: `Cannot start service with current status ${request.status}` });
    }

    request.status = 'IN_PROGRESS';
    request.serviceStartedAt = new Date();
    await request.save();

    // Trigger Notification for Customer User
    await Notification.create({
      userId: request.customerId,
      type: 'SERVICE_STARTED',
      title: '🔧 Service Started',
      message: `${technician.userId?.name || 'Technician'} has started working on your ${request.serviceId?.name || 'service'} request.`,
      relatedRequestId: request._id
    });

    res.json({
      success: true,
      message: 'Service started successfully.',
      data: request
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete service (IN_PROGRESS -> COMPLETED)
// @route   PATCH /api/requests/:id/complete
// @access  Private (Technician Only)
export const completeRequest = async (req, res) => {
  try {
    const technician = await Technician.findOne({ userId: req.user._id }).populate('userId');
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician profile record not found' });
    }

    const request = await ServiceRequest.findById(req.params.id).populate('serviceId');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    // Ownership check
    if (request.technicianId.toString() !== technician._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: Request is not assigned to you' });
    }

    // State transition verification
    if (request.status !== 'IN_PROGRESS') {
      return res.status(400).json({ success: false, message: 'Service must be in progress before completion.' });
    }

    request.status = 'COMPLETED';
    request.completedAt = new Date();
    await request.save();

    // Trigger Notification for Customer User
    await Notification.create({
      userId: request.customerId,
      type: 'SERVICE_COMPLETED',
      title: '✓ Service Completed',
      message: `Your ${request.serviceId?.name || 'service'} has been completed by ${technician.userId?.name || 'technician'}. Tap to rate your experience.`,
      relatedRequestId: request._id
    });

    res.json({
      success: true,
      message: 'Service marked as completed successfully.',
      data: request
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel service request (Customer: PENDING or ACCEPTED -> CANCELLED)
// @route   PATCH /api/requests/:id/cancel
// @access  Private (Customer)
export const cancelRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id).populate('technicianId');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    // Customer ownership check
    if (request.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: Request does not belong to you' });
    }

    // Transition check: Cannot cancel if in progress or completed
    if (request.status === 'IN_PROGRESS' || request.status === 'COMPLETED') {
      return res.status(400).json({ success: false, message: `Cannot cancel a service that is ${request.status.toLowerCase()}` });
    }

    if (request.status === 'CANCELLED' || request.status === 'REJECTED') {
      return res.status(400).json({ success: false, message: `Request is already ${request.status.toLowerCase()}` });
    }

    request.status = 'CANCELLED';
    await request.save();

    // Trigger Notification for Technician User if request was assigned
    if (request.technicianId && request.technicianId.userId) {
      await Notification.create({
        userId: request.technicianId.userId,
        type: 'REQUEST_CANCELLED',
        title: 'Request Cancelled',
        message: `${req.user.name} cancelled their service booking (${request.bookingReference || 'request'}).`,
        relatedRequestId: request._id
      });
    }

    res.json({
      success: true,
      message: 'Service request cancelled successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all platform requests for Admin Overview
// @route   GET /api/admin/requests
// @access  Admin
export const getAllAdminRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate('customerId', 'name email phone')
      .populate({
        path: 'technicianId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate('serviceId', 'name slug icon')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

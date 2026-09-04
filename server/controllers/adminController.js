import User from '../models/User.js';
import Technician from '../models/Technician.js';
import ServiceRequest from '../models/ServiceRequest.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import Service from '../models/Service.js';

// @desc    Get Admin Overview Platform KPI Stats & Analytics
// @route   GET /api/admin/stats
// @access  Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTechnicians = await Technician.countDocuments();
    const pendingVerifications = await Technician.countDocuments({ verificationStatus: 'pending' });
    const activeBookings = await ServiceRequest.countDocuments({ status: { $in: ['ACCEPTED', 'IN_PROGRESS'] } });
    const completedServices = await ServiceRequest.countDocuments({ status: 'COMPLETED' });
    const totalReviews = await Review.countDocuments();
    const totalRequests = await ServiceRequest.countDocuments();

    // Calculate Status Distribution
    const statusCounts = {
      PENDING: await ServiceRequest.countDocuments({ status: 'PENDING' }),
      ACCEPTED: await ServiceRequest.countDocuments({ status: 'ACCEPTED' }),
      IN_PROGRESS: await ServiceRequest.countDocuments({ status: 'IN_PROGRESS' }),
      COMPLETED: completedServices,
      REJECTED: await ServiceRequest.countDocuments({ status: 'REJECTED' }),
      CANCELLED: await ServiceRequest.countDocuments({ status: 'CANCELLED' })
    };

    // Calculate Completion Rate
    const completionRateVal = totalRequests > 0 ? (completedServices / totalRequests) * 100 : 0;
    const completionRate = `${Math.round(completionRateVal * 10) / 10}%`;

    // Fetch Recent Activity Feeds
    const recentRequests = await ServiceRequest.find()
      .populate('customerId', 'name email')
      .populate({
        path: 'technicianId',
        populate: { path: 'userId', select: 'name' }
      })
      .populate('serviceId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTechnicians = await Technician.find()
      .populate('userId', 'name email createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentReviews = await Review.find()
      .populate('customerId', 'name')
      .populate({
        path: 'technicianId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .limit(5);

    // Category Demand Counts
    const services = await Service.find().select('name slug');
    const categoryDemand = await Promise.all(
      services.map(async (s) => {
        const count = await ServiceRequest.countDocuments({ serviceId: s._id });
        return { name: s.name, slug: s.slug, count };
      })
    );

    res.json({
      success: true,
      data: {
        totalUsers,
        totalTechnicians,
        pendingVerifications,
        activeBookings,
        completedServices,
        totalReviews,
        totalRequests,
        completionRate,
        statusDistribution: statusCounts,
        categoryDemand,
        recentRequests,
        recentTechnicians,
        recentReviews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get paginated users list with role filter and search
// @route   GET /api/admin/users
// @access  Admin
export const getAdminUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (role && role !== 'all') {
      query.role = role.toLowerCase();
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        page,
        pages: Math.ceil(totalUsers / limit),
        totalUsers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Suspend / Activate User Account
// @route   PATCH /api/admin/users/:id/status
// @access  Admin
export const updateUserStatus = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const { accountStatus } = req.body;

    // Self-admin suspension guard
    if (targetUserId.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot suspend your own admin account.' });
    }

    if (!['ACTIVE', 'SUSPENDED'].includes(accountStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be ACTIVE or SUSPENDED' });
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User record not found' });
    }

    user.accountStatus = accountStatus;
    await user.save();

    res.json({
      success: true,
      message: `User account status updated to ${accountStatus}`,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get paginated technicians with verification filter
// @route   GET /api/admin/technicians
// @access  Admin
export const getAdminTechnicians = async (req, res) => {
  try {
    const { status, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (status && status !== 'all') {
      query.verificationStatus = status.toLowerCase();
    }

    const technicians = await Technician.find(query)
      .populate('userId', 'name email phone accountStatus createdAt')
      .populate('serviceIds', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTechnicians = await Technician.countDocuments(query);

    res.json({
      success: true,
      data: {
        technicians,
        page,
        pages: Math.ceil(totalTechnicians / limit),
        totalTechnicians
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve / Reject Technician Profile with Notification
// @route   PATCH /api/admin/technicians/:id/verify
// @access  Admin
export const verifyTechnicianAdmin = async (req, res) => {
  try {
    const { verificationStatus, reasonNote } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(verificationStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status' });
    }

    if (verificationStatus === 'rejected' && (!reasonNote || reasonNote.trim() === '')) {
      return res.status(400).json({ success: false, message: 'Please provide a reason for rejection.' });
    }

    const technician = await Technician.findById(req.params.id).populate('userId');
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician profile record not found' });
    }

    technician.verificationStatus = verificationStatus;
    technician.verificationNote = reasonNote ? reasonNote.trim() : (verificationStatus === 'approved' ? 'Verified by FixNear administrator.' : '');
    await technician.save();

    // Trigger Notification for Technician User
    if (technician.userId) {
      const isApproved = verificationStatus === 'approved';
      await Notification.create({
        userId: technician.userId._id,
        type: isApproved ? 'REQUEST_ACCEPTED' : 'REQUEST_REJECTED',
        title: isApproved ? '✓ Profile Approved' : 'Profile Verification Update',
        message: isApproved 
          ? 'Your FixNear professional profile has been approved! You are now visible in local professional discovery.'
          : `Your FixNear professional profile needs changes: "${technician.verificationNote}"`
      });
    }

    res.json({
      success: true,
      message: `Technician verification status updated to ${verificationStatus}`,
      data: technician
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get paginated platform service requests for admin monitoring
// @route   GET /api/admin/requests
// @access  Admin
export const getAdminRequestsList = async (req, res) => {
  try {
    const { status, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (status && status !== 'all') {
      query.status = status.toUpperCase();
    }

    if (search) {
      query.$or = [
        { bookingReference: { $regex: search, $options: 'i' } },
        { problemTitle: { $regex: search, $options: 'i' } }
      ];
    }

    const requests = await ServiceRequest.find(query)
      .populate('customerId', 'name email phone')
      .populate({
        path: 'technicianId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate('serviceId', 'name slug icon')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalRequests = await ServiceRequest.countDocuments(query);

    res.json({
      success: true,
      data: {
        requests,
        page,
        pages: Math.ceil(totalRequests / limit),
        totalRequests
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get paginated platform reviews for moderation
// @route   GET /api/admin/reviews
// @access  Admin
export const getAdminReviewsList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find()
      .populate('customerId', 'name email')
      .populate({
        path: 'technicianId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate({
        path: 'serviceRequestId',
        populate: { path: 'serviceId', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments();

    res.json({
      success: true,
      data: {
        reviews,
        page,
        pages: Math.ceil(totalReviews / limit),
        totalReviews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete/Moderate review & recalculate technician rating
// @route   DELETE /api/admin/reviews/:id
// @access  Admin
export const deleteAdminReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review record not found' });
    }

    const techId = review.technicianId;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate Technician Rating Statistics
    const remainingReviews = await Review.find({ technicianId: techId });
    const totalReviews = remainingReviews.length;
    const ratingSum = remainingReviews.reduce((sum, r) => sum + r.rating, 0);
    const roundedAverage = totalReviews > 0 ? Math.round((ratingSum / totalReviews) * 10) / 10 : 5.0;

    await Technician.findByIdAndUpdate(techId, {
      rating: roundedAverage,
      totalReviews: totalReviews
    });

    res.json({
      success: true,
      message: 'Review moderated and deleted successfully. Technician rating recalculated.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get complete platform analytics
// @route   GET /api/admin/analytics
// @access  Admin
export const getAdminAnalytics = async (req, res) => {
  try {
    const totalRequests = await ServiceRequest.countDocuments();
    const completedRequests = await ServiceRequest.countDocuments({ status: 'COMPLETED' });
    const acceptedRequests = await ServiceRequest.countDocuments({ status: 'ACCEPTED' });
    const cancelledRequests = await ServiceRequest.countDocuments({ status: 'CANCELLED' });

    const completionRate = totalRequests > 0 ? `${Math.round((completedRequests / totalRequests) * 1000) / 10}%` : '0%';
    const acceptanceRate = totalRequests > 0 ? `${Math.round((acceptedRequests / totalRequests) * 1000) / 10}%` : '0%';
    const cancellationRate = totalRequests > 0 ? `${Math.round((cancelledRequests / totalRequests) * 1000) / 10}%` : '0%';

    const activeTechs = await Technician.countDocuments({ availability: true, verificationStatus: 'approved' });
    const verifiedTechs = await Technician.countDocuments({ verificationStatus: 'approved' });
    const pendingTechs = await Technician.countDocuments({ verificationStatus: 'pending' });

    // Top Technicians
    const topTechnicians = await Technician.find({ verificationStatus: 'approved' })
      .populate('userId', 'name email')
      .sort({ rating: -1, totalReviews: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalRequests,
        completedRequests,
        completionRate,
        acceptanceRate,
        cancellationRate,
        activeTechs,
        verifiedTechs,
        pendingTechs,
        topTechnicians
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

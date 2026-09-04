import Review from '../models/Review.js';
import ServiceRequest from '../models/ServiceRequest.js';
import Technician from '../models/Technician.js';
import Notification from '../models/Notification.js';

// @desc    Create review for completed service request
// @route   POST /api/reviews
// @access  Private (Customer)
export const createReview = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { serviceRequestId, rating, reviewText } = req.body;

    // 1. Basic validation
    if (!serviceRequestId || !rating) {
      return res.status(400).json({ success: false, message: 'Service request ID and rating are required' });
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5' });
    }

    if (reviewText && reviewText.length > 500) {
      return res.status(400).json({ success: false, message: 'Review text cannot exceed 500 characters' });
    }

    // 2. Fetch ServiceRequest & Ownership Check
    const request = await ServiceRequest.findById(serviceRequestId).populate('technicianId');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    if (request.customerId.toString() !== customerId.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only review your own service requests' });
    }

    // 3. Status Check: Must be COMPLETED
    if (request.status !== 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'Only completed services can be reviewed.' });
    }

    // 4. One Review Per Service Check
    const existingReview = await Review.findOne({ serviceRequestId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this service.' });
    }

    const technician = request.technicianId;
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Assigned technician record not found' });
    }

    // 5. Create Review
    const newReview = await Review.create({
      customerId,
      technicianId: technician._id,
      serviceRequestId,
      rating: ratingNum,
      reviewText: reviewText ? reviewText.trim() : ''
    });

    // 6. Recalculate Technician Rating Statistics
    const allTechReviews = await Review.find({ technicianId: technician._id });
    const totalReviews = allTechReviews.length;
    const ratingSum = allTechReviews.reduce((sum, r) => sum + r.rating, 0);
    const rawAverage = ratingSum / totalReviews;
    const roundedAverage = Math.round(rawAverage * 10) / 10;

    technician.rating = roundedAverage;
    technician.totalReviews = totalReviews;
    await technician.save();

    // 7. Trigger Notification for Technician
    await Notification.create({
      userId: technician.userId,
      type: 'REVIEW_RECEIVED',
      title: '★ New Review Received',
      message: `${req.user.name} rated your service ${ratingNum} stars: "${reviewText ? reviewText.trim().substring(0, 45) + '...' : 'Great service!'}"`,
      relatedRequestId: request._id
    });

    const populatedReview = await Review.findById(newReview._id)
      .populate('customerId', 'name')
      .populate('serviceRequestId', 'problemTitle bookingReference');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: populatedReview
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for a technician with distribution stats
// @route   GET /api/reviews/technician/:technicianId
// @access  Public
export const getTechnicianReviews = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ technicianId })
      .populate('customerId', 'name')
      .populate({
        path: 'serviceRequestId',
        populate: { path: 'serviceId', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ technicianId });
    const allReviews = await Review.find({ technicianId }).select('rating');

    // Calculate Rating Distribution
    const distributionCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let ratingSum = 0;

    allReviews.forEach((r) => {
      ratingSum += r.rating;
      if (distributionCounts[r.rating] !== undefined) {
        distributionCounts[r.rating] += 1;
      }
    });

    const averageRating = totalReviews > 0 ? Math.round((ratingSum / totalReviews) * 10) / 10 : 5.0;

    const ratingDistribution = {
      5: totalReviews > 0 ? Math.round((distributionCounts[5] / totalReviews) * 100) : 0,
      4: totalReviews > 0 ? Math.round((distributionCounts[4] / totalReviews) * 100) : 0,
      3: totalReviews > 0 ? Math.round((distributionCounts[3] / totalReviews) * 100) : 0,
      2: totalReviews > 0 ? Math.round((distributionCounts[2] / totalReviews) * 100) : 0,
      1: totalReviews > 0 ? Math.round((distributionCounts[1] / totalReviews) * 100) : 0,
      counts: distributionCounts
    };

    res.json({
      success: true,
      data: {
        reviews,
        averageRating,
        totalReviews,
        ratingDistribution,
        page,
        pages: Math.ceil(totalReviews / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get customer's own submitted reviews
// @route   GET /api/reviews/my
// @access  Private (Customer)
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ customerId: req.user._id })
      .populate({
        path: 'technicianId',
        populate: { path: 'userId', select: 'name' }
      })
      .populate('serviceRequestId', 'problemTitle bookingReference')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

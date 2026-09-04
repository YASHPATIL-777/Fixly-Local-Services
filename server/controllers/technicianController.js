import Technician from '../models/Technician.js';
import Service from '../models/Service.js';
import mongoose from 'mongoose';

// @desc    Get public verified technicians with filtering, sorting, & pagination
// @route   GET /api/technicians
// @access  Public
export const getPublicTechnicians = async (req, res) => {
  try {
    const { service, location, search, availability, sort, page = 1, limit = 12 } = req.query;

    // Base query: MUST be approved for public customers
    let query = { verificationStatus: 'approved' };

    // 1. Service Filter (by slug or ObjectId)
    if (service && service !== 'all') {
      let targetServiceId = service;
      if (!mongoose.Types.ObjectId.isValid(service)) {
        const foundService = await Service.findOne({ slug: service.toLowerCase() });
        if (foundService) {
          targetServiceId = foundService._id;
        }
      }
      if (mongoose.Types.ObjectId.isValid(targetServiceId)) {
        query.serviceIds = targetServiceId;
      } else {
        query.serviceCategory = new RegExp(service, 'i');
      }
    }

    // 2. Location Filter
    if (location && location !== 'all') {
      query.$or = [
        { location: new RegExp(location, 'i') },
        { serviceArea: new RegExp(location, 'i') }
      ];
    }

    // 3. Search Query Filter (matches skills, bio, serviceCategory)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { bio: searchRegex },
        { serviceCategory: searchRegex },
        { skills: searchRegex },
        { location: searchRegex }
      ];
    }

    // 4. Availability Filter
    if (availability === 'true') {
      query.availability = true;
    }

    // 5. Whitelisted Sorting Options
    let sortOptions = { rating: -1 }; // Default top rated
    if (sort === 'experience') {
      sortOptions = { experienceYears: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    }

    // 6. Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Technician.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum) || 1;

    const technicians = await Technician.find(query)
      .populate('userId', 'name email phone')
      .populate('serviceIds', 'name slug icon category')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: technicians,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get technician by ID (Public Detail)
// @route   GET /api/technicians/:id
// @access  Public
export const getTechnicianById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid technician ID' });
    }

    const technician = await Technician.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('serviceIds', 'name slug icon description category');

    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician profile not found' });
    }

    res.json({
      success: true,
      data: technician
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get authenticated technician's own profile
// @route   GET /api/technicians/me
// @access  Private (Technician)
export const getMyTechnicianProfile = async (req, res) => {
  try {
    let technician = await Technician.findOne({ userId: req.user._id })
      .populate('userId', 'name email phone')
      .populate('serviceIds', 'name slug icon category');

    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician profile record not found' });
    }

    res.json({
      success: true,
      data: technician
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update authenticated technician's profile
// @route   PUT /api/technicians/me
// @access  Private (Technician)
export const updateMyTechnicianProfile = async (req, res) => {
  try {
    let technician = await Technician.findOne({ userId: req.user._id });

    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician profile record not found' });
    }

    const {
      serviceCategory,
      serviceIds,
      bio,
      experienceYears,
      skills,
      location,
      serviceArea,
      hourlyRate,
      availability,
      profileImage
    } = req.body;

    if (serviceCategory !== undefined) technician.serviceCategory = serviceCategory;
    if (serviceIds !== undefined && Array.isArray(serviceIds)) technician.serviceIds = serviceIds;
    if (bio !== undefined) technician.bio = bio;
    if (experienceYears !== undefined) technician.experienceYears = Number(experienceYears);
    if (skills !== undefined && Array.isArray(skills)) technician.skills = skills;
    if (location !== undefined) technician.location = location;
    if (serviceArea !== undefined && Array.isArray(serviceArea)) technician.serviceArea = serviceArea;
    if (hourlyRate !== undefined) technician.hourlyRate = hourlyRate;
    if (typeof availability === 'boolean') technician.availability = availability;
    if (profileImage !== undefined) technician.profileImage = profileImage;

    await technician.save();

    const updatedProfile = await Technician.findById(technician._id)
      .populate('userId', 'name email phone')
      .populate('serviceIds', 'name slug icon category');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

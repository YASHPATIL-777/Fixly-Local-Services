import User from '../models/User.js';
import Technician from '../models/Technician.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register new customer or technician
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, phone, password, role, serviceCategory, experienceYears, experience, location } = req.body;

  // 1. Strict security check: Prevent admin self-registration
  if (role === 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin accounts cannot be self-registered. Contact platform administrator.'
    });
  }

  // 2. Validate public role
  const targetRole = role === 'technician' ? 'technician' : 'customer';

  // 3. Basic validation
  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields (name, email, phone, password)'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  // 4. Check if email already exists
  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email already exists'
    });
  }

  // 5. If Technician role, validate technician specific fields
  const expVal = Number(experienceYears || experience || 1);
  if (targetRole === 'technician') {
    if (!serviceCategory || !location) {
      return res.status(400).json({
        success: false,
        message: 'Technician registration requires serviceCategory, experience, and location'
      });
    }
  }

  // 6. Create User
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    password,
    role: targetRole
  });

  let technicianProfile = null;

  // 7. Create Technician details if role is technician
  if (targetRole === 'technician') {
    technicianProfile = await Technician.create({
      userId: user._id,
      serviceCategory: serviceCategory.trim(),
      experienceYears: isNaN(expVal) ? 1 : expVal,
      location: location.trim(),
      availability: true,
      verificationStatus: 'pending'
    });
  }

  // 8. Generate JWT & set HTTP-only cookie
  const token = generateToken(res, user._id, user.role);

  res.status(201).json({
    success: true,
    message: `${targetRole.charAt(0).toUpperCase() + targetRole.slice(1)} account created successfully`,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      technicianProfile: technicianProfile
    }
  });
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // 1. Find user by email
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Account not found with this email'
    });
  }

  // 2. Compare password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // 3. Optional role verification check if role specified from frontend toggle
  if (role && role !== user.role) {
    return res.status(401).json({
      success: false,
      message: `Role mismatch: This account is registered as '${user.role}'. Please select '${user.role}' to login.`
    });
  }

  // 4. Fetch technician profile if applicable
  let technicianProfile = null;
  if (user.role === 'technician') {
    technicianProfile = await Technician.findOne({ userId: user._id });
  }

  // 5. Generate JWT & set HTTP-only cookie
  const token = generateToken(res, user._id, user.role);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      technicianProfile
    }
  });
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  let technicianProfile = null;
  if (user.role === 'technician') {
    technicianProfile = await Technician.findOne({ userId: user._id });
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      technicianProfile
    }
  });
};

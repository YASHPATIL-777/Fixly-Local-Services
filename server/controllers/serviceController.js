import Service from '../models/Service.js';

import mongoose from 'mongoose';

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ name: 1 });
    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get service by slug or ID
// @route   GET /api/services/:slug
// @access  Public
export const getServiceBySlug = async (req, res) => {
  try {
    const rawParam = req.params.slug ? req.params.slug.trim() : '';
    const slugParam = rawParam.toLowerCase();

    let service;

    // 1. Check if rawParam is valid ObjectId
    if (mongoose.Types.ObjectId.isValid(rawParam)) {
      service = await Service.findById(rawParam);
    }

    // 2. Search by slug, normalized slug, or case-insensitive name/category
    if (!service) {
      service = await Service.findOne({
        $or: [
          { slug: slugParam },
          { slug: slugParam.replace(/-/g, '') },
          { name: new RegExp(`^${slugParam.replace(/-/g, ' ')}$`, 'i') },
          { category: new RegExp(`^${slugParam.replace(/-/g, ' ')}$`, 'i') }
        ]
      });
    }

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service category not found' });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Admin
export const createService = async (req, res) => {
  try {
    const { name, slug, description, icon, category } = req.body;

    if (!name || !description) {
      return res.status(400).json({ success: false, message: 'Name and description are required' });
    }

    const generatedSlug = slug ? slug.toLowerCase().trim() : name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    const existingService = await Service.findOne({
      $or: [{ name: name.trim() }, { slug: generatedSlug }]
    });

    if (existingService) {
      return res.status(400).json({ success: false, message: 'Service name or slug already exists' });
    }

    const service = await Service.create({
      name: name.trim(),
      slug: generatedSlug,
      description: description.trim(),
      icon: icon || 'Wrench',
      category: category || 'General',
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Admin
export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (req.body.name) service.name = req.body.name.trim();
    if (req.body.slug) service.slug = req.body.slug.toLowerCase().trim();
    if (req.body.description) service.description = req.body.description.trim();
    if (req.body.icon) service.icon = req.body.icon;
    if (req.body.category) service.category = req.body.category;
    if (typeof req.body.isActive === 'boolean') service.isActive = req.body.isActive;

    await service.save();

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete / deactivate service
// @route   DELETE /api/services/:id
// @access  Admin
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    service.isActive = false;
    await service.save();

    res.json({
      success: true,
      message: 'Service deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

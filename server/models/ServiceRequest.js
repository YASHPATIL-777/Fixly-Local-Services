import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      index: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Technician',
      required: true,
      index: true
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    problemTitle: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true
    },
    problemDescription: {
      type: String,
      required: [true, 'Problem description is required'],
      trim: true
    },
    serviceDate: {
      type: Date,
      required: [true, 'Service date is required']
    },
    serviceTime: {
      type: String,
      required: [true, 'Service time is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Service address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      default: 'Thane',
      trim: true
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true
    },
    estimatedPrice: {
      type: String,
      default: '₹800 – ₹1,200'
    },
    problemImages: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, default: '' }
        }
      ],
      default: []
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'IN_PROGRESS', 'COMPLETED'],
      default: 'PENDING',
      index: true
    },
    technicianResponseNote: {
      type: String,
      default: '',
      trim: true
    },
    serviceStartedAt: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to generate unique bookingReference if not present
serviceRequestSchema.pre('save', function () {
  if (!this.bookingReference) {
    const year = new Date().getFullYear();
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.bookingReference = `FX-${year}-${randomCode}`;
  }
});

// Compound index to prevent duplicate pending requests
serviceRequestSchema.index({ customerId: 1, technicianId: 1, status: 1 });

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
export default ServiceRequest;

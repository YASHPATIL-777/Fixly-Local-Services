import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    serviceCategory: {
      type: String,
      trim: true
    },
    serviceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
      }
    ],
    bio: {
      type: String,
      default: ''
    },
    experienceYears: {
      type: Number,
      default: 1,
      min: 0
    },
    skills: {
      type: [String],
      default: []
    },
    location: {
      type: String,
      default: 'Thane',
      trim: true
    },
    serviceArea: {
      type: [String],
      default: ['Thane']
    },
    hourlyRate: {
      type: String,
      default: '₹800 – ₹1,200'
    },
    availability: {
      type: Boolean,
      default: true
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250'
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    verificationNote: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 4.8
    },
    totalReviews: {
      type: Number,
      default: 12
    }
  },
  {
    timestamps: true
  }
);

const Technician = mongoose.model('Technician', technicianSchema);
export default Technician;

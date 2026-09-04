import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
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
    serviceRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceRequest',
      required: true,
      unique: true,
      index: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer'
      }
    },
    reviewText: {
      type: String,
      default: '',
      trim: true,
      maxLength: [500, 'Review text cannot exceed 500 characters']
    }
  },
  {
    timestamps: true
  }
);

// Compound index for querying reviews by technician and date
reviewSchema.index({ technicianId: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;

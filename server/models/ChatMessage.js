import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    serviceRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceRequest',
      required: true,
      index: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    message: {
      type: String,
      required: [true, 'Message text is required'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
      trim: true
    },
    messageType: {
      type: String,
      enum: ['TEXT', 'IMAGE'],
      default: 'TEXT'
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for efficient message retrieval and unread counters
chatMessageSchema.index({ serviceRequestId: 1, createdAt: 1 });
chatMessageSchema.index({ receiverId: 1, isRead: 1 });
chatMessageSchema.index({ serviceRequestId: 1, receiverId: 1, isRead: 1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;

import ChatMessage from '../models/ChatMessage.js';
import ServiceRequest from '../models/ServiceRequest.js';
import Technician from '../models/Technician.js';
import User from '../models/User.js';

// Helper function to check if user is a participant of service request
export const getParticipantDetails = async (requestId, userId) => {
  const serviceRequest = await ServiceRequest.findById(requestId)
    .populate('customerId', 'name email phone role')
    .populate('serviceId', 'name category slug icon')
    .populate({
      path: 'technicianId',
      populate: { path: 'userId', select: 'name email phone role' }
    });

  if (!serviceRequest) {
    return { authorized: false, errorStatus: 404, errorMessage: 'Service request not found' };
  }

  const customerUserId = serviceRequest.customerId?._id?.toString() || serviceRequest.customerId?.toString();
  const techUserId = serviceRequest.technicianId?.userId?._id?.toString() || serviceRequest.technicianId?.userId?.toString();
  const currentUserId = userId.toString();

  const isCustomer = customerUserId === currentUserId;
  const isTechnician = techUserId === currentUserId;

  if (!isCustomer && !isTechnician) {
    return { authorized: false, errorStatus: 403, errorMessage: 'Access denied: You are not a participant in this service request conversation.' };
  }

  const allowedStatuses = ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'];
  if (!allowedStatuses.includes(serviceRequest.status)) {
    return { 
      authorized: false, 
      errorStatus: 403, 
      errorMessage: `Chat is unavailable for service request in '${serviceRequest.status}' status.` 
    };
  }

  const receiverId = isCustomer ? techUserId : customerUserId;

  return {
    authorized: true,
    serviceRequest,
    isCustomer,
    isTechnician,
    currentUserId,
    receiverId,
    customerUser: serviceRequest.customerId,
    technicianUser: serviceRequest.technicianId?.userId,
    otherUser: isCustomer ? serviceRequest.technicianId?.userId : serviceRequest.customerId
  };
};

// @desc    Get chat message history for a service request
// @route   GET /api/chat/:requestId/messages
// @access  Private (Participant only)
export const getMessages = async (req, res) => {
  try {
    const { requestId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const check = await getParticipantDetails(requestId, req.user._id);
    if (!check.authorized) {
      return res.status(check.errorStatus).json({ success: false, message: check.errorMessage });
    }

    // Auto mark messages as read for this user
    await ChatMessage.updateMany(
      { serviceRequestId: requestId, receiverId: req.user._id, isRead: false },
      { isRead: true }
    );

    const messages = await ChatMessage.find({ serviceRequestId: requestId })
      .sort({ createdAt: 1 })
      .limit(limit)
      .populate('senderId', 'name role')
      .populate('receiverId', 'name role');

    res.status(200).json({
      success: true,
      requestDetails: {
        id: check.serviceRequest._id,
        bookingReference: check.serviceRequest.bookingReference,
        status: check.serviceRequest.status,
        serviceName: check.serviceRequest.serviceId?.name || 'Service Request',
        problemTitle: check.serviceRequest.problemTitle,
        serviceDate: check.serviceRequest.serviceDate,
        serviceTime: check.serviceRequest.serviceTime,
        otherUser: check.otherUser ? {
          id: check.otherUser._id,
          name: check.otherUser.name,
          role: check.otherUser.role,
          phone: check.otherUser.phone
        } : null
      },
      messages
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ success: false, message: 'Server error fetching chat messages' });
  }
};

// @desc    Get active chat conversations list for authenticated user
// @route   GET /api/chat/conversations
// @access  Private
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find technician profile if user is technician
    let technicianProfileId = null;
    if (req.user.role === 'technician') {
      const tech = await Technician.findOne({ userId });
      if (tech) technicianProfileId = tech._id;
    }

    // Query active service requests (ACCEPTED, IN_PROGRESS, COMPLETED)
    const filter = {
      status: { $in: ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'] },
      $or: [{ customerId: userId }]
    };

    if (technicianProfileId) {
      filter.$or.push({ technicianId: technicianProfileId });
    }

    const requests = await ServiceRequest.find(filter)
      .populate('customerId', 'name email role phone')
      .populate('serviceId', 'name category slug icon')
      .populate({
        path: 'technicianId',
        populate: { path: 'userId', select: 'name email role phone' }
      })
      .sort({ updatedAt: -1 });

    const conversations = await Promise.all(
      requests.map(async (sr) => {
        const isCustomer = sr.customerId?._id?.toString() === userId.toString();
        const otherUser = isCustomer ? sr.technicianId?.userId : sr.customerId;

        // Get latest message
        const lastMessage = await ChatMessage.findOne({ serviceRequestId: sr._id })
          .sort({ createdAt: -1 })
          .populate('senderId', 'name');

        // Get unread count
        const unreadCount = await ChatMessage.countDocuments({
          serviceRequestId: sr._id,
          receiverId: userId,
          isRead: false
        });

        return {
          serviceRequestId: sr._id,
          bookingReference: sr.bookingReference,
          status: sr.status,
          serviceName: sr.serviceId?.name || sr.problemTitle,
          serviceDate: sr.serviceDate,
          serviceTime: sr.serviceTime,
          otherUser: otherUser ? {
            id: otherUser._id,
            name: otherUser.name,
            role: otherUser.role,
            phone: otherUser.phone
          } : null,
          lastMessage: lastMessage ? {
            id: lastMessage._id,
            senderId: lastMessage.senderId?._id || lastMessage.senderId,
            senderName: lastMessage.senderId?.name || 'User',
            message: lastMessage.message,
            isRead: lastMessage.isRead,
            createdAt: lastMessage.createdAt
          } : null,
          unreadCount,
          updatedAt: lastMessage ? lastMessage.createdAt : sr.updatedAt
        };
      })
    );

    // Sort by latest message / activity date
    conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.status(200).json({
      success: true,
      conversations
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ success: false, message: 'Server error fetching chat conversations' });
  }
};

// @desc    Mark all messages in a conversation as read
// @route   PATCH /api/chat/:requestId/read
// @access  Private (Participant only)
export const markMessagesAsRead = async (req, res) => {
  try {
    const { requestId } = req.params;
    const check = await getParticipantDetails(requestId, req.user._id);

    if (!check.authorized) {
      return res.status(check.errorStatus).json({ success: false, message: check.errorMessage });
    }

    const result = await ChatMessage.updateMany(
      { serviceRequestId: requestId, receiverId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'Messages marked as read',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ success: false, message: 'Server error updating read status' });
  }
};

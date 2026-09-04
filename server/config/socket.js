import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import User from '../models/User.js';
import ChatMessage from '../models/ChatMessage.js';
import Notification from '../models/Notification.js';
import { getParticipantDetails } from '../controllers/chatController.js';

let io = null;
const userSocketsMap = new Map(); // userId -> Set(socketId)
const userLastMessageTimeMap = new Map(); // socketId -> timestamp

export const initSocket = (httpServer) => {
  const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(url => url.trim())
    : ['http://localhost:5173', 'http://127.0.0.1:5173'];

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true
    },
    pingInterval: 25000,
    pingTimeout: 60000
  });

  // Socket Authentication Middleware
  io.use(async (socket, next) => {
    try {
      let token = socket.handshake.auth?.token;

      // Check cookie if token not explicitly in auth object
      if (!token && socket.handshake.headers?.cookie) {
        const parsedCookies = cookie.parse(socket.handshake.headers.cookie);
        token = parsedCookies.jwt;
      }

      if (!token) {
        return next(new Error('Authentication error: Missing access token'));
      }

      const secret = process.env.JWT_SECRET || 'fixnear_default_jwt_secret_key_2026';
      const decoded = jwt.verify(token, secret);

      const user = await User.findById(decoded.id).select('-password');
      if (!user || user.accountStatus === 'SUSPENDED') {
        return next(new Error('Authentication error: User not authorized or suspended'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      socket.role = user.role;

      next();
    } catch (err) {
      console.error('[Socket.IO Auth Error]:', err.message);
      return next(new Error('Authentication error: Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    console.log(`[Socket.IO] User connected: ${socket.user.name} (${userId}) [Socket ID: ${socket.id}]`);

    // Track active connection for user
    if (!userSocketsMap.has(userId)) {
      userSocketsMap.set(userId, new Set());
    }
    userSocketsMap.get(userId).add(socket.id);

    // Join personal user room for direct push notifications
    socket.join(`user:${userId}`);

    // Broadcast online status to any rooms user is currently part of
    io.emit('user:online_status', { userId, online: true });

    // Helper: Check if target user is currently online
    socket.on('user:check_online', ({ targetUserId }, callback) => {
      const isOnline = userSocketsMap.has(targetUserId) && userSocketsMap.get(targetUserId).size > 0;
      if (typeof callback === 'function') {
        callback({ targetUserId, isOnline });
      }
    });

    // Event 1: Join Chat Room for specific Service Request
    socket.on('chat:join', async ({ requestId }, callback) => {
      try {
        if (!requestId) return;

        const check = await getParticipantDetails(requestId, userId);
        if (!check.authorized) {
          socket.emit('chat:error', { message: check.errorMessage });
          if (typeof callback === 'function') callback({ success: false, message: check.errorMessage });
          return;
        }

        const room = `service-request:${requestId}`;
        socket.join(room);
        console.log(`[Socket.IO] ${socket.user.name} joined room ${room}`);

        // Notify room that user is active in chat
        io.to(room).emit('user:online', { userId, name: socket.user.name, requestId });

        // Check if other participant is online
        const targetUserId = check.receiverId;
        const targetIsOnline = userSocketsMap.has(targetUserId) && userSocketsMap.get(targetUserId).size > 0;

        if (typeof callback === 'function') {
          callback({
            success: true,
            requestId,
            room,
            status: check.serviceRequest.status,
            otherUserOnline: targetIsOnline
          });
        }
      } catch (error) {
        console.error('[Socket.IO] Error in chat:join:', error);
        socket.emit('chat:error', { message: 'Failed to join chat room' });
      }
    });

    // Event 2: Leave Chat Room
    socket.on('chat:leave', ({ requestId }) => {
      if (!requestId) return;
      const room = `service-request:${requestId}`;
      socket.leave(room);
      console.log(`[Socket.IO] ${socket.user.name} left room ${room}`);
    });

    // Event 3: Send Message
    socket.on('message:send', async ({ requestId, message }, callback) => {
      try {
        if (!requestId || !message) {
          if (typeof callback === 'function') callback({ success: false, message: 'Invalid payload' });
          return;
        }

        const trimmedMessage = message.trim();
        if (trimmedMessage.length === 0) {
          socket.emit('chat:error', { message: 'Cannot send empty message' });
          if (typeof callback === 'function') callback({ success: false, message: 'Message is empty' });
          return;
        }

        if (trimmedMessage.length > 1000) {
          socket.emit('chat:error', { message: 'Message exceeds 1000 characters limit' });
          if (typeof callback === 'function') callback({ success: false, message: 'Message too long' });
          return;
        }

        // Rate limiting check: 250ms window
        const now = Date.now();
        const lastMsgTime = userLastMessageTimeMap.get(socket.id) || 0;
        if (now - lastMsgTime < 250) {
          socket.emit('chat:error', { message: 'Sending messages too fast. Please slow down.' });
          if (typeof callback === 'function') callback({ success: false, message: 'Rate limit exceeded' });
          return;
        }
        userLastMessageTimeMap.set(socket.id, now);

        // Check authorization & status
        const check = await getParticipantDetails(requestId, userId);
        if (!check.authorized) {
          socket.emit('chat:error', { message: check.errorMessage });
          if (typeof callback === 'function') callback({ success: false, message: check.errorMessage });
          return;
        }

        if (['COMPLETED', 'CANCELLED', 'REJECTED'].includes(check.serviceRequest.status)) {
          const statusErr = `Service request is ${check.serviceRequest.status.toLowerCase()}. Chat is read-only.`;
          socket.emit('chat:error', { message: statusErr });
          if (typeof callback === 'function') callback({ success: false, message: statusErr });
          return;
        }

        // Save Message to DB (Sender MUST be authenticated socket user)
        const newMessage = await ChatMessage.create({
          serviceRequestId: requestId,
          senderId: userId,
          receiverId: check.receiverId,
          message: trimmedMessage,
          messageType: 'TEXT',
          isRead: false
        });

        const populatedMsg = await ChatMessage.findById(newMessage._id)
          .populate('senderId', 'name role')
          .populate('receiverId', 'name role');

        const room = `service-request:${requestId}`;

        // Emit message to room immediately
        io.to(room).emit('message:receive', populatedMsg);

        // Notification logic: Check room sockets
        const roomSockets = await io.in(room).fetchSockets();
        const receiverInRoom = roomSockets.some(s => s.userId === check.receiverId);

        // Create persistent notification if receiver not actively inside room
        if (!receiverInRoom) {
          const notifMsg = `${socket.user.name}: "${trimmedMessage.length > 50 ? trimmedMessage.substring(0, 50) + '...' : trimmedMessage}"`;
          
          await Notification.create({
            userId: check.receiverId,
            type: 'NEW_CHAT_MESSAGE',
            title: '💬 New Message',
            message: notifMsg,
            relatedRequestId: requestId
          });

          // Push real-time notification to receiver's user channel
          io.to(`user:${check.receiverId}`).emit('notification:new', {
            title: '💬 New Message',
            message: notifMsg,
            requestId
          });
        }

        if (typeof callback === 'function') {
          callback({ success: true, message: populatedMsg });
        }
      } catch (error) {
        console.error('[Socket.IO] Error in message:send:', error);
        socket.emit('chat:error', { message: 'Server error sending message' });
        if (typeof callback === 'function') callback({ success: false, message: 'Server error' });
      }
    });

    // Event 4: Typing Indicators
    socket.on('typing:start', ({ requestId }) => {
      if (!requestId) return;
      const room = `service-request:${requestId}`;
      socket.to(room).emit('typing:start', { userId, name: socket.user.name, requestId });
    });

    socket.on('typing:stop', ({ requestId }) => {
      if (!requestId) return;
      const room = `service-request:${requestId}`;
      socket.to(room).emit('typing:stop', { userId, requestId });
    });

    // Event 5: Read Receipts
    socket.on('message:read', async ({ requestId }) => {
      if (!requestId) return;
      try {
        await ChatMessage.updateMany(
          { serviceRequestId: requestId, receiverId: userId, isRead: false },
          { isRead: true }
        );

        const room = `service-request:${requestId}`;
        io.to(room).emit('message:read', { requestId, readerId: userId });
      } catch (err) {
        console.error('[Socket.IO] Error in message:read:', err);
      }
    });

    // Disconnect Handler
    socket.on('disconnect', () => {
      console.log(`[Socket.IO] User disconnected: ${socket.user.name} (${userId})`);
      userLastMessageTimeMap.delete(socket.id);

      if (userSocketsMap.has(userId)) {
        const userSockets = userSocketsMap.get(userId);
        userSockets.delete(socket.id);

        // If no more active sockets for user, mark offline
        if (userSockets.size === 0) {
          userSocketsMap.delete(userId);
          io.emit('user:online_status', { userId, online: false });
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
};

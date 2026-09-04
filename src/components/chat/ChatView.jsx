import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  ArrowLeft, 
  Check, 
  CheckCheck, 
  Clock, 
  Calendar, 
  Wrench, 
  ShieldCheck, 
  WifiOff, 
  AlertCircle,
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { getMessages, markMessagesAsRead } from '../../services/chatService';

export default function ChatView({ requestId, onBack }) {
  const { user } = useAuth();
  const { socket, isConnected, isReconnecting } = useSocket();

  const [requestDetails, setRequestDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [otherUserOnline, setOtherUserOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendError, setSendError] = useState(null);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // 1. Initial REST fetch for message history
  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMessages(requestId);
      if (data.success) {
        setRequestDetails(data.requestDetails);
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Chat history fetch error:', err);
      setError(err.message || 'Failed to load conversation history');
    } finally {
      setLoading(false);
      setTimeout(() => scrollToBottom('auto'), 100);
    }
  };

  useEffect(() => {
    if (requestId) {
      fetchHistory();
    }
  }, [requestId]);

  // 2. Socket setup & event listeners
  useEffect(() => {
    if (!socket || !isConnected || !requestId) return;

    // Join Socket Room
    socket.emit('chat:join', { requestId }, (response) => {
      if (response?.success) {
        if (response.otherUserOnline !== undefined) {
          setOtherUserOnline(response.otherUserOnline);
        }
      } else if (response?.message) {
        setError(response.message);
      }
    });

    // Check online status of target user
    if (requestDetails?.otherUser?.id) {
      socket.emit('user:check_online', { targetUserId: requestDetails.otherUser.id }, (res) => {
        if (res?.isOnline !== undefined) setOtherUserOnline(res.isOnline);
      });
    }

    // Listen for incoming live messages
    const handleMessageReceive = (newMessage) => {
      if (newMessage.serviceRequestId === requestId) {
        setMessages((prev) => {
          // Avoid duplicate messages
          if (prev.some((m) => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
        setOtherUserTyping(false);
        setTimeout(() => scrollToBottom('smooth'), 100);

        // Mark as read if received from other user
        const currentUserId = user?.id || user?._id;
        if (newMessage.receiverId?._id === currentUserId || newMessage.receiverId === currentUserId) {
          socket.emit('message:read', { requestId });
          markMessagesAsRead(requestId).catch(() => {});
        }
      }
    };

    // Listen for typing events
    const handleTypingStart = (data) => {
      const currentUserId = user?.id || user?._id;
      if (data.requestId === requestId && data.userId !== currentUserId) {
        setOtherUserTyping(true);
        setTimeout(() => scrollToBottom('smooth'), 100);
      }
    };

    const handleTypingStop = (data) => {
      const currentUserId = user?.id || user?._id;
      if (data.requestId === requestId && data.userId !== currentUserId) {
        setOtherUserTyping(false);
      }
    };

    // Listen for read receipts
    const handleMessageRead = (data) => {
      if (data.requestId === requestId) {
        setMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            isRead: true
          }))
        );
      }
    };

    // Listen for online status updates
    const handleUserOnlineStatus = (data) => {
      if (requestDetails?.otherUser?.id && data.userId === requestDetails.otherUser.id) {
        setOtherUserOnline(data.online);
      }
    };

    const handleChatError = (errData) => {
      setSendError(errData.message || 'Chat error occurred');
      setTimeout(() => setSendError(null), 4000);
    };

    socket.on('message:receive', handleMessageReceive);
    socket.on('typing:start', handleTypingStart);
    socket.on('typing:stop', handleTypingStop);
    socket.on('message:read', handleMessageRead);
    socket.on('user:online_status', handleUserOnlineStatus);
    socket.on('chat:error', handleChatError);

    return () => {
      socket.emit('chat:leave', { requestId });
      socket.off('message:receive', handleMessageReceive);
      socket.off('typing:start', handleTypingStart);
      socket.off('typing:stop', handleTypingStop);
      socket.off('message:read', handleMessageRead);
      socket.off('user:online_status', handleUserOnlineStatus);
      socket.off('chat:error', handleChatError);
    };
  }, [socket, isConnected, requestId, requestDetails?.otherUser?.id, user]);

  // Handle Typing indicator emission with debounce
  const handleInputChange = (e) => {
    const text = e.target.value;
    if (text.length > 1000) return;
    setInputText(text);
    setSendError(null);

    if (!socket || !isConnected) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing:start', { requestId });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing:stop', { requestId });
    }, 1500);
  };

  // Handle sending message
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || !socket || !isConnected) return;

    const isReadOnly = ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(requestDetails?.status);
    if (isReadOnly) {
      setSendError(`Service request is ${requestDetails?.status.toLowerCase()}. Chat is read-only.`);
      return;
    }

    if (isTyping) {
      setIsTyping(false);
      socket.emit('typing:stop', { requestId });
    }

    setSendError(null);

    socket.emit('message:send', { requestId, message: trimmed }, (ack) => {
      if (ack && ack.success) {
        setInputText('');
      } else if (ack && ack.message) {
        setSendError(ack.message);
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isReadOnly = ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(requestDetails?.status);
  const currentUserId = user?.id || user?._id;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto bg-slate-50 border border-slate-200/80 rounded-3xl shadow-xl overflow-hidden my-4">
      
      {/* 1. CHAT HEADER */}
      <div className="bg-white px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center space-x-3.5">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              title="Back to bookings"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-between justify-center font-bold text-blue-600 text-base shadow-xs">
              {requestDetails?.otherUser?.name ? requestDetails.otherUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                otherUserOnline ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-slate-300'
              }`}
              title={otherUserOnline ? 'Online' : 'Offline'}
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-slate-900 text-base tracking-tight leading-tight">
                {requestDetails?.otherUser?.name || 'Fixly Participant'}
              </h2>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {requestDetails?.otherUser?.role === 'technician' ? 'Professional' : 'Customer'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-xs mt-0.5">
              <span className={`inline-flex items-center font-semibold ${otherUserOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${otherUserOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                {otherUserOnline ? 'Online' : 'Offline'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-medium truncate max-w-[200px]">
                {requestDetails?.serviceName}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        {requestDetails?.status && (
          <div className="hidden sm:flex items-center">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              requestDetails.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              requestDetails.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              requestDetails.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700 border-slate-200' :
              'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              ● {requestDetails.status.replace('_', ' ')}
            </span>
          </div>
        )}
      </div>

      {/* 2. RECONNECTION BANNER */}
      {(!isConnected || isReconnecting) && (
        <div className="bg-amber-500 text-white text-xs font-semibold px-4 py-2 flex items-center justify-center space-x-2 shadow-inner shrink-0">
          <WifiOff className="w-4 h-4 animate-bounce" />
          <span>Connection lost. Reconnecting to Fixly live messaging...</span>
        </div>
      )}

      {/* 3. BOOKING CONTEXT COMPACT BAR */}
      {requestDetails && (
        <div className="bg-slate-100/90 px-5 py-2.5 border-b border-slate-200/70 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center font-medium">
              <Wrench className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              {requestDetails.serviceName}
            </span>
            <span className="hidden md:inline-flex items-center text-slate-500">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              {new Date(requestDetails.serviceDate).toLocaleDateString()} at {requestDetails.serviceTime}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-mono text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              Ref: {requestDetails.bookingReference}
            </span>
          </div>
        </div>
      )}

      {/* 4. MESSAGES LIST CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium">Loading conversation...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white/80 rounded-2xl border border-red-200 my-auto max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
            <p className="font-bold text-slate-800 text-sm">{error}</p>
            <button
              onClick={fetchHistory}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full text-center p-8 max-w-md mx-auto"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Start the conversation 👋</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Introduce yourself or share important details about the service location and timing.
            </p>
            <div className="bg-white p-3 rounded-2xl border border-slate-200 text-slate-600 text-xs font-medium space-y-1 shadow-xs">
              <p className="text-blue-600 font-bold">Suggested openers:</p>
              <p>• "Hi! Are you available at the scheduled time?"</p>
              <p>• "Hello, please let me know if you need specific directions."</p>
            </div>
          </motion.div>
        ) : (
          messages.map((msg, index) => {
            const senderUserId = msg.senderId?._id || msg.senderId;
            const isMe = senderUserId?.toString() === currentUserId?.toString();

            const messageTime = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

            return (
              <motion.div
                key={msg._id || index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[82%] sm:max-w-[70%] group`}>
                  
                  {/* Bubble Container */}
                  <div
                    className={`p-3.5 shadow-xs text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-2xl rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-2xl rounded-tl-xs'
                    }`}
                  >
                    {msg.message}
                  </div>

                  {/* Time & Read Status Indicator */}
                  <div className={`flex items-center space-x-1 mt-1 text-[10px] font-semibold text-slate-400 ${isMe ? 'justify-end' : 'justify-start px-1'}`}>
                    <span>{messageTime}</span>
                    {isMe && (
                      <span className="ml-1 text-slate-400">
                        {msg.isRead ? (
                          <CheckCheck className="w-3.5 h-3.5 text-blue-500 inline" title="Read" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-slate-400 inline" title="Sent" />
                        )}
                      </span>
                    )}
                  </div>

                </div>
              </motion.div>
            );
          })
        )}

        {/* Other User Typing Indicator */}
        {otherUserTyping && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-xs text-slate-500 bg-white border border-slate-200/80 px-3.5 py-2 rounded-2xl w-fit shadow-xs"
          >
            <div className="flex space-x-1">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
            </div>
            <span className="font-semibold text-slate-700">
              {requestDetails?.otherUser?.name || 'Partner'} is typing...
            </span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 5. ERROR ALERT */}
      {sendError && (
        <div className="bg-red-50 text-red-600 text-xs font-semibold px-4 py-2 border-t border-red-200 flex items-center justify-between shrink-0">
          <span>{sendError}</span>
          <button onClick={() => setSendError(null)} className="font-bold text-red-800 ml-2">✕</button>
        </div>
      )}

      {/* 6. CHAT INPUT FOOTER */}
      <div className="bg-white border-t border-slate-200/80 p-3 sm:p-4 shrink-0">
        {isReadOnly ? (
          <div className="bg-slate-100 p-3 rounded-2xl text-center text-xs font-semibold text-slate-500 border border-slate-200 flex items-center justify-center space-x-2">
            <Info className="w-4 h-4 text-slate-400" />
            <span>This service request is {requestDetails?.status.toLowerCase()}. Conversation is now read-only.</span>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="space-y-2">
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all">
              <textarea
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message... (Shift+Enter for newline)"
                rows={1}
                disabled={!isConnected}
                className="w-full bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none max-h-28"
              />
              
              <div className="pr-3 pl-2 flex items-center space-x-2 shrink-0">
                <span className="text-[11px] font-mono text-slate-400 select-none">
                  {inputText.length} / 1000
                </span>
                
                <button
                  type="submit"
                  disabled={!inputText.trim() || !isConnected}
                  className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition-all focus:outline-none active:scale-95"
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}

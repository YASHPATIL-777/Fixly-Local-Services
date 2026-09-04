import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  Clock, 
  Check, 
  CheckCheck, 
  Wrench, 
  User, 
  ChevronRight,
  Sparkles,
  Inbox
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ChatView from '../components/chat/ChatView';
import { getUserConversations } from '../services/chatService';
import { useAuth } from '../context/AuthContext';

export default function MessagesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeRequestId = searchParams.get('request');

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserConversations();
      if (data.success) {
        setConversations(data.conversations || []);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const filteredConversations = conversations.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.otherUser?.name?.toLowerCase().includes(term) ||
      c.serviceName?.toLowerCase().includes(term) ||
      c.bookingReference?.toLowerCase().includes(term)
    );
  });

  const selectConversation = (reqId) => {
    setSearchParams({ request: reqId });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="container max-w-7xl mx-auto px-4 py-6 flex-1">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
              <MessageSquare className="w-7 h-7 mr-3 text-blue-600" />
              Messages & Conversations
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Direct real-time messaging tied to your active and accepted service bookings.
            </p>
          </div>
        </div>

        {/* RESPONSIVE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px] max-h-[750px]">
          
          {/* CONVERSATION LIST PANEL */}
          <div className={`lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-md flex flex-col overflow-hidden ${activeRequestId ? 'hidden lg:flex' : 'flex'}`}>
            
            {/* Search Input */}
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, service or ref..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {loading ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading conversations...
                </div>
              ) : error ? (
                <div className="p-6 text-center text-red-500 text-xs font-semibold">
                  {error}
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-700 text-xs">No active conversations</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Conversations become available once a service request is accepted.
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = activeRequestId === conv.serviceRequestId;

                  return (
                    <button
                      key={conv.serviceRequestId}
                      onClick={() => selectConversation(conv.serviceRequestId)}
                      className={`w-full text-left p-4 transition-colors flex items-start space-x-3.5 hover:bg-slate-50 ${
                        isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : ''
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm border border-blue-200">
                          {conv.otherUser?.name ? conv.otherUser.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="font-bold text-slate-900 text-xs truncate">
                            {conv.otherUser?.name || 'User'}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0 font-medium ml-1">
                            {conv.updatedAt ? new Date(conv.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                          </span>
                        </div>

                        <p className="text-[11px] font-semibold text-blue-600 truncate flex items-center mb-1">
                          <Wrench className="w-3 h-3 mr-1 shrink-0" />
                          {conv.serviceName}
                        </p>

                        <p className="text-xs text-slate-500 truncate font-normal">
                          {conv.lastMessage ? (
                            <>
                              <span className="font-semibold text-slate-700">
                                {conv.lastMessage.senderName}:
                              </span>{' '}
                              {conv.lastMessage.message}
                            </>
                          ) : (
                            <span className="italic text-slate-400">No messages yet</span>
                          )}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

          </div>

          {/* CHAT VIEW PANEL */}
          <div className={`lg:col-span-8 ${!activeRequestId ? 'hidden lg:flex' : 'flex'}`}>
            {activeRequestId ? (
              <div className="w-full h-full">
                <ChatView
                  requestId={activeRequestId}
                  onBack={() => setSearchParams({})}
                />
              </div>
            ) : (
              <div className="w-full h-full bg-white rounded-3xl border border-slate-200/80 shadow-md flex flex-col items-center justify-center text-center p-12 my-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-4 border border-blue-100 shadow-xs">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1">Select a conversation</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Choose a service booking from the list on the left to start live messaging with your assigned professional or customer.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

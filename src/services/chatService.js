import { apiFetch } from '../utils/api';

export const getMessages = async (requestId, limit = 50) => {
  const res = await apiFetch(`/api/chat/${requestId}/messages?limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch chat messages');
  return data;
};

export const getUserConversations = async () => {
  const res = await apiFetch('/api/chat/conversations');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch chat conversations');
  return data;
};

export const markMessagesAsRead = async (requestId) => {
  const res = await apiFetch(`/api/chat/${requestId}/read`, {
    method: 'PATCH'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to mark messages as read');
  return data;
};

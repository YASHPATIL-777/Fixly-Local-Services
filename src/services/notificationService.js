import { apiFetch } from '../utils/api';

export const getNotifications = async () => {
  const res = await apiFetch('/api/notifications');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch notifications');
  return data;
};

export const markNotificationRead = async (id) => {
  const res = await apiFetch(`/api/notifications/${id}/read`, {
    method: 'PATCH'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to mark notification as read');
  return data;
};

export const markAllNotificationsRead = async () => {
  const res = await apiFetch('/api/notifications/read-all', {
    method: 'PATCH'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to mark all notifications as read');
  return data;
};

import { apiFetch } from '../utils/api';

export const getAdminStats = async () => {
  const res = await apiFetch('/api/admin/stats');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch admin stats');
  return data;
};

export const getAdminUsers = async (role = 'all', search = '', page = 1, limit = 10) => {
  const res = await apiFetch(`/api/admin/users?role=${role}&search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch platform users');
  return data;
};

export const updateUserStatus = async (id, accountStatus) => {
  const res = await apiFetch(`/api/admin/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ accountStatus })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update user account status');
  return data;
};

export const getAdminTechnicians = async (status = 'all', search = '', page = 1, limit = 10) => {
  const res = await apiFetch(`/api/admin/technicians?status=${status}&search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch platform technicians');
  return data;
};

export const verifyTechnicianAdmin = async (id, verificationStatus, reasonNote = '') => {
  const res = await apiFetch(`/api/admin/technicians/${id}/verify`, {
    method: 'PATCH',
    body: JSON.stringify({ verificationStatus, reasonNote })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update technician verification');
  return data;
};

export const getAdminRequestsList = async (status = 'all', search = '', page = 1, limit = 10) => {
  const res = await apiFetch(`/api/admin/requests?status=${status}&search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch platform service requests');
  return data;
};

export const getAdminReviewsList = async (page = 1, limit = 10) => {
  const res = await apiFetch(`/api/admin/reviews?page=${page}&limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch platform reviews');
  return data;
};

export const deleteAdminReview = async (id) => {
  const res = await apiFetch(`/api/admin/reviews/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to moderate review');
  return data;
};

export const getAdminAnalytics = async () => {
  const res = await apiFetch('/api/admin/analytics');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch platform analytics');
  return data;
};

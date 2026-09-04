import { apiFetch } from '../utils/api';

export const createServiceRequest = async (requestData) => {
  const isFormData = requestData instanceof FormData;
  const res = await apiFetch('/api/requests', {
    method: 'POST',
    body: isFormData ? requestData : JSON.stringify(requestData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit service request');
  return data;
};

export const getMyCustomerRequests = async (status = 'ALL') => {
  const res = await apiFetch(`/api/requests/my?status=${status}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch your service requests');
  return data;
};

export const getTechnicianRequests = async (status = 'ALL') => {
  const res = await apiFetch(`/api/requests/technician?status=${status}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch assigned service requests');
  return data;
};

export const getRequestById = async (id) => {
  const res = await apiFetch(`/api/requests/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch request details');
  return data;
};

export const acceptServiceRequest = async (id) => {
  const res = await apiFetch(`/api/requests/${id}/accept`, {
    method: 'PATCH'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to accept service request');
  return data;
};

export const rejectServiceRequest = async (id, note) => {
  const res = await apiFetch(`/api/requests/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ note })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to decline service request');
  return data;
};

export const startServiceRequest = async (id) => {
  const res = await apiFetch(`/api/requests/${id}/start`, {
    method: 'PATCH'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to start service');
  return data;
};

export const completeServiceRequest = async (id) => {
  const res = await apiFetch(`/api/requests/${id}/complete`, {
    method: 'PATCH'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to complete service');
  return data;
};

export const cancelServiceRequest = async (id) => {
  const res = await apiFetch(`/api/requests/${id}/cancel`, {
    method: 'PATCH'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to cancel service request');
  return data;
};

export const getAllAdminRequests = async () => {
  const res = await apiFetch('/api/admin/requests');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch platform service requests');
  return data;
};

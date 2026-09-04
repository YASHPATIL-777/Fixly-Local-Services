import { apiFetch } from '../utils/api';

export const getTechnicians = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.service) query.append('service', params.service);
  if (params.location) query.append('location', params.location);
  if (params.search) query.append('search', params.search);
  if (params.availability) query.append('availability', params.availability);
  if (params.sort) query.append('sort', params.sort);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit || 12);

  const res = await apiFetch(`/api/technicians?${query.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch technicians');
  return data;
};

export const getTechnicianById = async (id) => {
  const res = await apiFetch(`/api/technicians/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch technician details');
  return data;
};

export const getMyTechnicianProfile = async () => {
  const res = await apiFetch('/api/technicians/me');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch technician profile');
  return data;
};

export const updateMyTechnicianProfile = async (profileData) => {
  const res = await apiFetch('/api/technicians/me', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update technician profile');
  return data;
};

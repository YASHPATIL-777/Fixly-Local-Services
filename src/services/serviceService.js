import { apiFetch } from '../utils/api';

export const getServices = async () => {
  const res = await apiFetch('/api/services');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch services');
  return data;
};

export const getAllServices = getServices;

export const getServiceBySlug = async (slug) => {
  const res = await apiFetch(`/api/services/${slug}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch service details');
  return data;
};

export const createService = async (serviceData) => {
  const res = await apiFetch('/api/services', {
    method: 'POST',
    body: JSON.stringify(serviceData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create service');
  return data;
};

export const updateService = async (id, serviceData) => {
  const res = await apiFetch(`/api/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(serviceData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update service');
  return data;
};

export const deleteService = async (id) => {
  const res = await apiFetch(`/api/services/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete service');
  return data;
};

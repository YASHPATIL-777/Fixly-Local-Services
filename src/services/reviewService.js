import { apiFetch } from '../utils/api';

export const createReview = async (reviewData) => {
  const res = await apiFetch('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit review');
  return data;
};

export const getTechnicianReviews = async (technicianId, page = 1, limit = 10) => {
  const res = await apiFetch(`/api/reviews/technician/${technicianId}?page=${page}&limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch technician reviews');
  return data;
};

export const getMyCustomerReviews = async () => {
  const res = await apiFetch('/api/reviews/my');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch your reviews');
  return data;
};

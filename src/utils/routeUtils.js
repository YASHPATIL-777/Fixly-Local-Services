/**
 * Utility helper to normalize route paths and prevent accidental double slashes (e.g. //services/plumbing).
 */

export const getServiceRoutePath = (slugOrPath) => {
  if (!slugOrPath) return '/services';
  const cleanSlug = String(slugOrPath)
    .trim()
    .replace(/^\/+/, '')
    .replace(/^services\//, '');
  return `/services/${cleanSlug}`;
};

export const getTechnicianRoutePath = (idOrPath) => {
  if (!idOrPath) return '/technicians';
  const cleanId = String(idOrPath)
    .trim()
    .replace(/^\/+/, '')
    .replace(/^technicians\//, '');
  return `/technicians/${cleanId}`;
};

export const getRequestRoutePath = (role, idOrPath) => {
  if (!idOrPath) return `/${role}/requests`;
  const cleanId = String(idOrPath)
    .trim()
    .replace(/^\/+/, '')
    .replace(/^(customer|technician|admin)\/requests\//, '');
  const cleanRole = String(role || 'customer').trim().replace(/^\/+/, '');
  return `/${cleanRole}/requests/${cleanId}`;
};

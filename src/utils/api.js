export const getAuthToken = () => {
  return localStorage.getItem('fixnear_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('fixnear_token', token);
  } else {
    localStorage.removeItem('fixnear_token');
  }
};

export const clearAuthState = () => {
  localStorage.removeItem('fixnear_token');
  localStorage.removeItem('fixnear_user');
};

export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  // Safe development fallback only
  if (import.meta.env.DEV) {
    return '';
  }
  return '';
};

export const apiFetch = async (url, options = {}) => {
  const token = getAuthToken();

  const headers = { ...(options.headers || {}) };

  // Only set application/json if body is NOT FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const apiBase = getApiBaseUrl();
  const formattedUrl = url.startsWith('/') ? url : `/${url}`;
  const fullUrl = apiBase ? `${apiBase}${formattedUrl}` : formattedUrl;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
    credentials: 'include'
  });

  return response;
};

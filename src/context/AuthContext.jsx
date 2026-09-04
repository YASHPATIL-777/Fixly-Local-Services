import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, setAuthToken, clearAuthState, getAuthToken } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('fixnear_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAuthToken());
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check auth status on app initialization
  const checkAuth = async () => {
    const currentToken = getAuthToken();
    if (!currentToken) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch('/api/auth/me');
      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('fixnear_user', JSON.stringify(data.user));
      } else {
        clearAuthState();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.warn('[AuthContext] Error checking auth status:', err.message);
      // Keep cached state if network offline, or reset if unauthorized
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Login handler
  const login = async (email, password, role) => {
    setAuthError(null);
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.message || 'Login failed. Please check credentials.';
        setAuthError(errorMsg);
        return { success: false, message: errorMsg };
      }

      // Save new token and user in localStorage & session
      setAuthToken(data.token);
      localStorage.setItem('fixnear_user', JSON.stringify(data.user));

      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, user: data.user };
    } catch (err) {
      const errorMsg = 'Network error. Unable to connect to server.';
      setAuthError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Register handler
  const register = async (formData) => {
    setAuthError(null);
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.message || 'Registration failed. Please check inputs.';
        setAuthError(errorMsg);
        return { success: false, message: errorMsg };
      }

      setAuthToken(data.token);
      localStorage.setItem('fixnear_user', JSON.stringify(data.user));

      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, user: data.user };
    } catch (err) {
      const errorMsg = 'Network error. Unable to connect to server.';
      setAuthError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout', { 
        method: 'POST'
      });
    } catch (err) {
      console.error('Logout request error:', err);
    } finally {
      clearAuthState();
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        authError,
        setAuthError,
        login,
        register,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

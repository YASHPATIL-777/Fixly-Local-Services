import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getAuthToken } from '../utils/api';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [socketError, setSocketError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = getAuthToken();

    const rawSocketUrl = import.meta.env.VITE_SOCKET_URL || (import.meta.env.DEV ? window.location.origin : '');
    const socketUrl = rawSocketUrl.endsWith('/') ? rawSocketUrl.slice(0, -1) : rawSocketUrl;

    // Initialize Socket.IO connection passing token in auth payload & cookies
    const newSocket = io(socketUrl, {
      auth: { token },
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('[SocketContext] Connected to Socket.IO server. Socket ID:', newSocket.id);
      setIsConnected(true);
      setIsReconnecting(false);
      setSocketError(null);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('[SocketContext] Disconnected from Socket.IO server:', reason);
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        newSocket.connect();
      } else {
        setIsReconnecting(true);
      }
    });

    newSocket.on('connect_error', (err) => {
      console.warn('[SocketContext] Socket connection error:', err.message);
      setSocketError(err.message);
      setIsConnected(false);
    });

    newSocket.on('chat:error', (data) => {
      console.warn('[SocketContext] Chat error:', data?.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user?.id, user?._id, user?.role]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        isReconnecting,
        socketError
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const RENDER_HOST = 'https://swifty-circle.onrender.com';
    const envWs = import.meta.env.VITE_WS_URL;
    const socketUrl = envWs || (typeof window !== 'undefined' && window.navigator && window.navigator.onLine ? RENDER_HOST : 'http://localhost:5000');
    const socketInstance = io(socketUrl, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    console.log('[client] attempting socket connect to', socketUrl);

    socketInstance.on('connect', () => {
      console.log('[client] socket connected', socketInstance.id);
      setConnected(true);
      setError(null);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('[client] socket connect_error', err);
      setError(`Connection Loss: ${err.message}`);
      setConnected(false);
    });

    socketInstance.on('disconnect', (reason) => {
      console.warn('[client] socket disconnected', reason);
      setConnected(false);
    });

    setSocket(socketInstance);
    console.log('[client] socket instance created', socketInstance.id || '(pending)');

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, error }}>
      {children}
    </SocketContext.Provider>
  );
};
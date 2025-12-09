import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth.context';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Define backend URL (Make sure this matches your backend port)
const SOCKET_ENDPOINT = process.env.REACT_APP_CAMPUS_JAM_API_URL; 

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let newSocket: Socket | null = null;

    if (user) {
      newSocket = io(SOCKET_ENDPOINT);

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket?.id);
        setIsConnected(true);
        // Join the user's personal room immediately upon connection
        // Ensure we use the correct ID property (id or _id)
        const userId = user._id || (user as any).id;
        newSocket?.emit('join_chat', userId);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      setSocket(newSocket);
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [user]); 

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
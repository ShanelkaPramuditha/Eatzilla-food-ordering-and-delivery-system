import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNotifyStore } from '@/store/notify.store';
import { AlertObject } from '@/types/notification';
import { useGetUser } from '@/services/tanstack-hooks/auth.hook';

export const useAlerts = () => {
  const [alert, setAlert] = useState<AlertObject | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const addNotification = useNotifyStore((state) => state.addNotification);
  const { data: user } = useGetUser();
  const userId = user?.id;

  useEffect(() => {
    // Connect to the WebSocket server
    const newSocket = io(import.meta.env.PUBLIC_WEBSOCKET_URL);

    newSocket.on('alert', (object: AlertObject) => {
      setAlert(object);
      // Add notification to the store with the correct duration
      addNotification(object);
      // Auto-clear alert after 5 seconds
      setTimeout(() => setAlert(null), 5000);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [addNotification]);

  // Effect to handle user-specific room joining when userId changes
  useEffect(() => {
    if (socket && userId) {
      // Join user-specific room
      socket.emit('joinRoom', { userId });

      return () => {
        // Leave the room when component unmounts or userId changes
        socket.emit('leaveRoom', { userId });
      };
    }
  }, [socket, userId]);

  return { alert, socket };
};

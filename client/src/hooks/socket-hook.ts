import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { AlertObject } from '@/types/notification';
import { useGetUser } from '@/services/tanstack-hooks/auth.hook';
import { useQueryClient } from '@tanstack/react-query';
import { alertKeys } from '@/services/tanstack-hooks/alert.hook';

export const useAlerts = () => {
  const [alert, setAlert] = useState<AlertObject | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { data: user } = useGetUser();
  const userId = user?.id;
  const queryClient = useQueryClient();

  useEffect(() => {
    // Connect to the WebSocket server
    const newSocket = io(import.meta.env.PUBLIC_WEBSOCKET_URL);

    newSocket.on('alert', (object: AlertObject) => {
      setAlert(object);
      // Auto-clear alert after 5 seconds
      setTimeout(() => setAlert(null), 5000);
    });

    // Listen for refetch events to refresh alerts data
    newSocket.on('refetch', () => {
      console.log('Received refetch event, refreshing alerts data');
      // Invalidate alerts query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: alertKeys.list() });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [queryClient]);

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

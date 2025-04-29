import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AlertObject } from '../types/notification';

export interface NotificationItem extends AlertObject {
  timestamp: number;
  duration: number;
  read?: boolean;
  response: {
    level: 'info' | 'error' | 'warning';
    message: string;
  };
}

export const isValidNotification = (notification: NotificationItem) => {
  return (
    notification &&
    notification.response &&
    typeof notification.response === 'object' &&
    'level' in notification.response &&
    'message' in notification.response
  );
};

interface NotifyStore {
  notifications: NotificationItem[];
  addNotification: (alert: AlertObject, duration?: number) => void;
  readNotification: (id: string) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  markAllAsRead: () => void;
  setNotifications: (notifications: NotificationItem[] | undefined) => void;
}

export const useNotifyStore = create<NotifyStore>()(
  persist(
    (set) => ({
      notifications: [],
      addNotification: (alert: AlertObject, duration = 3000) => {
        const timestamp = Date.now();
        set((state) => {
          // Generate a unique ID if one isn't provided
          const id = alert.id || `notif-${timestamp}-${Math.random().toString(36).substr(2, 9)}`;

          // Check if notification with the same ID already exists
          const exists = state.notifications.some((notification) => notification.id === id);
          if (exists) {
            return { notifications: state.notifications };
          }

          // Otherwise, add the new notification with the guaranteed unique ID
          return {
            notifications: [
              ...state.notifications,
              {
                ...alert,
                id, // Use the generated or existing ID
                timestamp,
                duration,
                response: {
                  level: alert.level,
                  message: alert.message,
                },
              },
            ],
          };
        });
      },
      readNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, isRead: true, read: true } : notification,
          ),
        }));
      },
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((notification) => notification.id !== id),
        }));
      },
      clearNotifications: () => {
        set({ notifications: [] });
      },
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            isRead: true,
            read: true,
          })),
        }));
      },
      setNotifications: (notifications) => {
        if (!notifications) {
          return;
        }
        set({ notifications });
      },
    }),
    {
      name: 'notify-storage',
    },
  ),
);

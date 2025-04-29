import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AlertObject } from '../types/notification';

interface NotificationItem extends AlertObject {
  id: number;
  timestamp: number;
  duration: number;
  read?: boolean;
}

interface NotifyStore {
  notifications: NotificationItem[];
  addNotification: (alert: AlertObject, duration?: number) => void;
  readNotification: (id: number) => void;
  removeNotification: (id: number) => void;
  clearNotifications: () => void;
  markAllAsRead: () => void;
}

export const useNotifyStore = create<NotifyStore>()(
  persist(
    (set) => ({
      notifications: [],
      addNotification: (alert: AlertObject, duration = 3000) => {
        const id = Date.now();
        const timestamp = Date.now();
        set((state) => ({
          notifications: [...state.notifications, { ...alert, id, timestamp, duration }],
        }));
      },
      readNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification,
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
            read: true,
          })),
        }));
      },
    }),
    {
      name: 'notify-storage',
    },
  ),
);

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
  addNotifications: (alerts: AlertObject[], duration?: number) => void;
  readNotification: (id: number) => void;
  removeNotification: (id: number) => void;
  clearNotifications: () => void;
  markAllAsRead: () => void;
}

// Helper function to validate alert object
const isValidAlert = (alert: AlertObject): boolean => {
  return (
    alert !== null &&
    alert !== undefined &&
    typeof alert === 'object' &&
    alert.response !== undefined &&
    alert.response !== null &&
    typeof alert.response === 'object' &&
    'level' in alert.response &&
    'message' in alert.response
  );
};

export const useNotifyStore = create<NotifyStore>()(
  persist(
    (set) => ({
      notifications: [],
      addNotification: (alert: AlertObject, duration = 3000) => {
        // Validate alert object before adding
        if (!isValidAlert(alert)) {
          console.error('Invalid alert object:', alert);
          return;
        }

        const id = Date.now();
        const timestamp = Date.now();
        set((state) => ({
          notifications: [...state.notifications, { ...alert, id, timestamp, duration }],
        }));
      },
      addNotifications: (alerts: AlertObject[], duration = 3000) => {
        // Validate each alert object before adding
        alerts.forEach((alert) => {
          if (!isValidAlert(alert)) {
            console.error('Invalid alert object:', alert);
            return;
          }
        });

        const newNotifications = alerts.map((alert) => ({
          ...alert,
          id: Date.now(),
          timestamp: Date.now(),
          duration,
        }));

        set((state) => ({
          notifications: [...state.notifications, ...newNotifications],
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

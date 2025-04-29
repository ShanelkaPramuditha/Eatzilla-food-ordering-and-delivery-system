import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AlertService from '@/services/alert.service';
import { AlertObject } from '@/types/notification';
import { useNotifyStore } from '@/store/notify.store';

export const alertKeys = {
  all: ['alerts'] as const,
  list: () => [...alertKeys.all, 'list'] as const,
  detail: (id: string) => [...alertKeys.all, 'detail', id] as const,
};

export const useGetAlerts = () => {
  return useQuery<AlertObject[]>({
    queryKey: alertKeys.list(),
    queryFn: async () => {
      const alerts = await AlertService.getAlerts();
      return alerts;
    },
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useMarkAlertAsRead = () => {
  const queryClient = useQueryClient();
  const { readNotification } = useNotifyStore();

  return useMutation<void, Error, string>({
    mutationFn: (alertId) => AlertService.markAsRead(alertId),
    onSuccess: (_, alertId) => {
      // Update the notification store
      readNotification(alertId);
      // Invalidate alerts query
      queryClient.invalidateQueries({ queryKey: alertKeys.list() });
    },
  });
};

export const useMarkAllAlertsAsRead = () => {
  const queryClient = useQueryClient();
  const { notifications, markAllAsRead } = useNotifyStore();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      if (!notifications) return;

      // Filter for unread notifications
      const unreadNotifications = notifications.filter(
        (notification) => !notification.read && !notification.isRead,
      );

      // Create an array of promises for each unread notification
      const markAsReadPromises = unreadNotifications.map((notification) =>
        AlertService.markAsRead(notification.id),
      );

      // Wait for all promises to resolve
      await Promise.all(markAsReadPromises);
    },
    onSuccess: () => {
      // Update the notification store after all API calls succeed
      markAllAsRead();
      // Invalidate alerts query to refresh the data
      queryClient.invalidateQueries({ queryKey: alertKeys.list() });
    },
  });
};

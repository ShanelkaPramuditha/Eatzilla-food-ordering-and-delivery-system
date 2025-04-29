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
  const { addNotification } = useNotifyStore();

  return useQuery<AlertObject[]>({
    queryKey: alertKeys.list(),
    queryFn: async () => {
      const alerts = await AlertService.getAlerts();
      // Add received alerts to the notification store
      alerts.forEach((alert) => {
        addNotification(alert);
      });
      return alerts;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMarkAlertAsRead = () => {
  const queryClient = useQueryClient();
  const { readNotification } = useNotifyStore();

  return useMutation<void, Error, string>({
    mutationFn: (alertId) => AlertService.markAsRead(alertId),
    onSuccess: (_, alertId) => {
      // Update the notification store
      readNotification(Number(alertId));
      // Invalidate alerts query
      queryClient.invalidateQueries({ queryKey: alertKeys.list() });
    },
  });
};

import { useGetAlerts } from '@/services/tanstack-hooks/alert.hook';
import { useNotifyStore } from '@/store/notify.store';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAlerts } from '@/hooks/socket-hook';

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated && !context.auth.isLoading) {
      // Redirect to login if not authenticated
      return redirect({
        to: '/login',
        search: { from: location.pathname },
      });
    }
    return null;
  },
  component: AuthLayout,
});

function AuthLayout() {
  const { data: alerts } = useGetAlerts();
  const setNotifications = useNotifyStore((state) => state.setNotifications);

  // Initialize the socket for the authenticated user
  useAlerts();

  // Use useEffect to set notifications from useGetAlerts
  useEffect(() => {
    if (alerts && alerts.length > 0) {
      const notificationList = alerts.map((alert) => ({
        ...alert,
        timestamp: new Date(alert.createdAt).getTime(),
        duration: 5000,
        // Add response property expected by notification components
        response: {
          level: alert.level,
          message: alert.message,
        },
      }));

      setNotifications(notificationList);
    }
  }, [alerts, setNotifications]);

  return <Outlet />;
}

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

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
  component: () => <Outlet />,
});

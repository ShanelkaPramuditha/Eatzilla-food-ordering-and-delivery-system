import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated && !context.auth.isLoading) {
      throw redirect({
        to: '/',
        search: {
          redirect: window.location.href,
        },
      });
    }
    return null;
  },
  component: () => <Outlet />,
});

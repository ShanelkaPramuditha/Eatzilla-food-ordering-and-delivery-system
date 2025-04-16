import { Outlet } from '@tanstack/react-router';

import { UserRole } from '@/constants/user';
import { useAuth } from '@/contexts/auth-context';

// Layouts
import { AdminLayout } from './admin';
import { CustomerLayout } from './customer';

export function Layout() {
  const { role } = useAuth();

  // Select the layout based on the role
  switch (role) {
    case UserRole.ADMIN:
      return <AdminLayout />;
    case UserRole.CUSTOMER:
      return <CustomerLayout />;
    case UserRole.GUEST:
      return <CustomerLayout />;
    default:
      return <Outlet />;
  }
}

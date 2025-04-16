import { Outlet } from '@tanstack/react-router';

import { UserRole } from '@/constants/user';
import { Header } from '@/components/partials/header';

export function CustomerLayout() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header role={UserRole.CUSTOMER} />
      <main className='container mx-auto flex-1 px-4 py-8'>
        <Outlet />
      </main>
    </div>
  );
}

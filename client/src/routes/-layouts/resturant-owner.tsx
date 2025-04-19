import { Outlet } from '@tanstack/react-router';

import { UserRole } from '@/constants/user';
import { Header } from '@/components/partials/header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/partials/sidebar';

export function ResturantOwnerLayout() {
  return (
    <>
      <div className={`fixed top-0 right-0 left-0 z-50 h-[52px] border-b`}>
        <Header role={UserRole.RESTAURANT_OWNER} />
      </div>
      <SidebarProvider
        style={
          {
            '--sidebar-width': '12rem',
          } as React.CSSProperties
        }
      >
        <div className='fixed top-[52px] left-0 h-[calc(100vh-52px)] border-r'>
          <AppSidebar />
        </div>
        <div className='mt-[52px] ml-[12rem] flex min-h-[calc(100vh-52px)] w-full flex-col p-4'>
          <Outlet />
        </div>
      </SidebarProvider>
    </>
  );
}

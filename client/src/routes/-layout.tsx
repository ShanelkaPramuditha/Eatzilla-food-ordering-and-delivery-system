import { cn } from '@/lib/utils';
import { Outlet } from '@tanstack/react-router';
import { useAuth } from '@/contexts/auth-context';
import { Header } from '@/components/partials/header';
import { Footer } from '@/components/partials/footer';
import { AppSidebar } from '@/components/partials/sidebar';
import { getLayoutConfigByRole } from '@/configs/layout-configs';

export function Layout() {
  const { role } = useAuth();
  const { showHeader, showSidebar, showFooter } = getLayoutConfigByRole(role);

  return (
    <div className='bg-background min-h-screen max-w-screen'>
      {/* Header */}
      {showHeader && (
        <div className='fixed inset-x-0 top-0 z-40 h-[52px] border-b'>
          <Header role={role} className='h-[52px]' />
        </div>
      )}

      {/* Sidebar */}
      {showSidebar && (
        <div className='fixed top-[52px] bottom-0 left-0 z-30 w-[12rem] border-r'>
          <AppSidebar role={role} className='h-[calc(100vh-52px)]' />
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn('min-h-[calc(100vh-52px)] pt-[52px] pl-[12rem]', {
          'pl-[0]': !showSidebar,
          'pt-[0]': !showHeader,
        })}
      >
        <div className='h-full p-4'>
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      {showFooter && (
        <div className='inset-x-0 bottom-0 z-40 h-[52px] border-t'>
          <Footer />
        </div>
      )}
    </div>
  );
}

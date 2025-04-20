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
    <div className='bg-background flex min-h-screen flex-col overflow-hidden'>
      {/* Header */}
      {showHeader && (
        <div className='fixed inset-x-0 top-0 z-40 h-[52px] border-b'>
          <Header className='h-[52px]' />
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
        className={cn('relative flex h-[calc(100vh-52px)] flex-1', {
          'pl-[12rem]': showSidebar,
          'pt-[52px]': showHeader,
        })}
      >
        <div
          className={cn('mx-auto flex h-full w-full p-4', {
            'min-h-[calc(100vh-104px)]': showFooter,
            'min-h-[calc(100vh-52px)]': !showFooter,
          })}
        >
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      {showFooter && (
        <div className='mt-auto'>
          <Footer className='h-[52px]' />
        </div>
      )}
    </div>
  );
}

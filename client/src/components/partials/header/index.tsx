import { cn } from '@/lib/utils';
import { UserRole } from '@/constants/user';
import { Link } from '@tanstack/react-router';
import { useAuth } from '@/contexts/auth-context';
import { headerConfig } from '@/configs/header-config';

import { UserAvatar } from './avatar';
import NotificationPopover from './notification';
import { CartDrawer } from '@/components/partials/header/cart';

export const Header = ({ className }: { className?: string }) => {
  const { isAuthenticated, role } = useAuth();
  const config = headerConfig[role || UserRole.GUEST];
  const { navItems, icons } = config;

  return (
    <header className={cn('bg-sidebar fixed top-0 h-14 bg-background w-full border-b shadow-sm', className)}>
      <div className='container mx-auto h-full px-4'>
        <div className='flex h-full items-center justify-between'>
          <div className='flex h-full items-center gap-10'>
            <Link to='/' className='text-xl font-bold'>
              Eatzilla
            </Link>
            <nav className='flex h-full items-center gap-6'>
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className='flex h-full items-center'>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className='flex h-full items-center gap-4'>
            {role !== UserRole.RESTAURANT_OWNER && <CartDrawer />}
            {isAuthenticated && <>{icons.showNotifications && <NotificationPopover />}</>}
            <UserAvatar />
          </div>
        </div>
      </div>
    </header>
  );
};

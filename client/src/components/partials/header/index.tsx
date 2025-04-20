import { cn } from '@/lib/utils';
import { UserRole } from '@/constants/user';
import { Link } from '@tanstack/react-router';
import { useAuth } from '@/contexts/auth-context';
import { headerConfig } from '@/configs/header-config';

import Cart from './cart';
import { UserAvatar } from './avatar';
import NotificationPopover from './notification';

export const Header = ({ className }: { className?: string }) => {
  const { isAuthenticated, role } = useAuth();
  const config = headerConfig[role || UserRole.GUEST];
  const { navItems, icons } = config;

  return (
    <header className={cn('bg-sidebar fixed top-0 h-14 w-full border-b shadow-sm', className)}>
      <div className='container mx-auto h-full px-4'>
        <div className='flex h-full items-center justify-between'>
          <div className='flex h-full items-center gap-8'>
            <Link to='/' className='text-xl font-bold'>
              Eatzilla
            </Link>
            <nav className='flex h-full items-center gap-4'>
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className='flex h-full items-center'>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className='flex h-full items-center gap-4'>
            {isAuthenticated && (
              <>
                {icons.showCart && <Cart />}
                {icons.showNotifications && <NotificationPopover />}
              </>
            )}
            <UserAvatar />
          </div>
        </div>
      </div>
    </header>
  );
};

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/contexts/auth-context';
import { IconUserCircle } from '@tabler/icons-react';

export function UserAvatar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  return (
    <DropdownMenu>
      {/* Dropdown menu trigger */}
      <DropdownMenuTrigger asChild>
        <Avatar className='border-radius-full bg-background h-9 w-9 cursor-pointer rounded-full border'>
          <AvatarImage
            src={
              isAuthenticated && user
                ? user?.picture ||
                  `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'user')}`
                : 'https://api.dicebear.com/9.x/avataaars/svg'
            }
            alt={(isAuthenticated && user?.name) || '@user'}
          />
          <AvatarFallback>
            {isAuthenticated && user ? (
              user?.name?.charAt(0) || 'CN'
            ) : (
              <IconUserCircle className='h-full w-full' />
            )}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      {/* Dropdown menu content */}
      <DropdownMenuContent className='w-56'>
        {isAuthenticated && user && (
          <>
            <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup>
          {isAuthenticated && user ? (
            <DropdownMenuItem className='cursor-pointer' onClick={() => navigate({ to: '/' })}>
              Profile
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className='cursor-pointer' onClick={() => navigate({ to: '/login' })}>
              Log in
            </DropdownMenuItem>
          )}

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className='cursor-pointer'>
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme('light')}>
                  <Sun className='mr-2 h-4 w-4' />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme('dark')}>
                  <Moon className='mr-2 h-4 w-4' />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme('system')}>
                  <Monitor className='mr-2 h-4 w-4' />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator hidden={!isAuthenticated} />
        <DropdownMenuItem
          hidden={!isAuthenticated}
          className='cursor-pointer'
          onClick={handleLogout}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

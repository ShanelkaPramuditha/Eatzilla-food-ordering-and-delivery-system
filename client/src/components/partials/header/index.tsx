import { Link } from '@tanstack/react-router';
import { USER } from '@/constants';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export const Header = ({ role, className }: { role?: USER.UserRole; className?: string }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className={cn('bg-sidebar fixed top-0 h-14 w-full border-b shadow-sm', className)}>
      <div className='container mx-auto h-full px-4'>
        <div className='flex h-full items-center justify-between'>
          <div className='flex h-full items-center gap-8'>
            <Link to='/' className='text-xl font-bold'>
              Eatzilla
            </Link>
            <nav className='flex h-full items-center gap-4'>
              {role === USER.UserRole.ADMIN ? (
                <>
                  <Link to='/' className='flex h-full items-center'>
                    Dashboard
                  </Link>
                  <Link to='/about' className='flex h-full items-center'>
                    About
                  </Link>
                </>
              ) : (
                <>
                  <Link to='/' className='flex h-full items-center'>
                    Home
                  </Link>
                  <Link to='/about' className='flex h-full items-center'>
                    About
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className='flex h-full items-center gap-4'>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={user?.picture} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end' forceMount>
                  <DropdownMenuItem className='flex flex-col items-start'>
                    <div className='text-sm font-medium'>{user?.name}</div>
                    <div className='text-muted-foreground text-xs'>{user?.email}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to='/login'>
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

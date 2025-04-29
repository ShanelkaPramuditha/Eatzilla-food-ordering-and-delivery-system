import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useAlerts } from '@/hooks/socket-hook';
import { useEffect, useState } from 'react';
import { isValidNotification, useNotifyStore } from '@/store/notify.store';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from '@tanstack/react-router';
import { useMarkAlertAsRead, useMarkAllAlertsAsRead } from '@/services/tanstack-hooks/alert.hook';

export default function NotificationPopover() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const { alert } = useAlerts();
  const { notifications, removeNotification, readNotification } = useNotifyStore();
  const markAllAlertsAsReadMutation = useMarkAllAlertsAsRead();
  const markAlertAsReadMutation = useMarkAlertAsRead();

  // Safely handle potential undefined notifications array
  const notificationsArray = notifications || [];

  // Filter out invalid notifications and count unread ones
  const validNotifications = notificationsArray.filter(isValidNotification);
  const unreadCount = validNotifications.filter(
    (notification) => !notification.read && !notification.isRead,
  ).length;

  useEffect(() => {
    if (alert) {
      setCount((prevCount) => prevCount + 1);
    }
  }, [alert]);

  useEffect(() => {
    setCount(unreadCount);
  }, [unreadCount]);

  const handleMarkAllAsRead = () => {
    // Call the API to mark all alerts as read
    markAllAlertsAsReadMutation.mutate();
    setCount(0);
  };

  const handleRemoveNotification = (id: string) => {
    removeNotification(id);
    setCount((prevCount) => Math.max(0, prevCount - 1));
  };

  const handleMarkAsRead = (id: string) => {
    // Call the API to mark the notification as read
    markAlertAsReadMutation
      .mutateAsync(id.toString(), {
        onSuccess: () => {
          // Update local state after successful API call
          readNotification(id);
        },
      })
      .then(() => {
        navigate({
          to: '/my-orders',
        });
      });
  };

  // Show only the latest 5 valid notifications in the popover
  const recentNotifications = validNotifications.slice(0, 5);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='icon' className='relative rounded-full'>
          <BellIcon className='h-4 w-4' />
          {count > 0 && (
            <span className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
              {count > 99 ? '99+' : count}
            </span>
          )}
          <span className='sr-only'>Toggle notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='max-h-[calc(100vh-12rem)] w-80 overflow-auto p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-medium'>Notifications</h3>
          <Button variant='ghost' size='sm' onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        </div>
        <div className='space-y-4'>
          {recentNotifications.length === 0 ? (
            <p className='text-muted-foreground text-center text-sm'>No notifications</p>
          ) : (
            recentNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() =>
                  !(notification.read || notification.isRead) &&
                  handleMarkAsRead(notification.id) &&
                  navigate({ to: '/my-orders' })
                }
                className={`flex items-start gap-3 rounded-md p-2 ${
                  notification.read || notification.isRead
                    ? 'bg-muted/50 dark:bg-muted/20 opacity-70'
                    : 'bg-card dark:bg-card'
                }`}
              >
                <div className='flex-shrink-0'>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      notification.response.level === 'info'
                        ? 'bg-blue-500 dark:bg-blue-600'
                        : notification.response.level === 'warning'
                          ? 'bg-yellow-500 dark:bg-yellow-600'
                          : 'bg-red-500 dark:bg-red-600'
                    } ${notification.read || notification.isRead ? 'opacity-50' : ''} text-white`}
                  >
                    {notification.response.level === 'info' ? (
                      <BellIcon className='h-4 w-4' />
                    ) : notification.response.level === 'warning' ? (
                      <BellIcon className='h-4 w-4' />
                    ) : (
                      <XIcon className='h-4 w-4' />
                    )}
                  </div>
                </div>
                <div className='flex-1'>
                  <p
                    className={`text-sm font-medium ${
                      notification.read || notification.isRead
                        ? 'text-muted-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    {notification.response.message}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {formatDistanceToNow(notification.timestamp || Date.now(), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-6 w-6'
                  onClick={() => handleRemoveNotification(notification.id)}
                >
                  <XIcon className='h-3 w-3' />
                  <span className='sr-only'>Dismiss</span>
                </Button>
              </div>
            ))
          )}
        </div>

        {validNotifications.length > 5 && (
          <div className='mt-4 border-t pt-4 text-center'>
            <p className='text-muted-foreground mb-2 text-sm'>
              {validNotifications.length - 5} more notification
              {validNotifications.length - 5 > 1 ? 's' : ''}
            </p>
          </div>
        )}

        <div className='mt-4 border-t pt-4'>
          <Button asChild variant='outline' className='w-full'>
            <Link to='/notifications'>View All Notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' />
      <path d='M10.3 21a1.94 1.94 0 0 0 3.4 0' />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='18' y1='6' x2='6' y2='18' />
      <line x1='6' y1='6' x2='18' y2='18' />
    </svg>
  );
}

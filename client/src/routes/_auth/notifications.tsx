import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/notifications')({
  component: NotificationsPage,
});

function NotificationsPage() {
  return <NotificationsView />;
}

import { useNotifyStore } from '@/store/notify.store';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

function NotificationsView() {
  const { notifications, markAllAsRead, removeNotification } = useNotifyStore();
  const [filter, setFilter] = useState<'all' | 'info' | 'error' | 'warning'>('all');

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter((notification) => notification.response.level === filter);

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>All Notifications</h1>
        <Button variant='outline' onClick={handleMarkAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      <div className='mb-6 flex gap-2'>
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
          All
        </Button>
        <Button
          variant={filter === 'info' ? 'default' : 'outline'}
          className={filter === 'info' ? 'bg-blue-500 hover:bg-blue-600' : ''}
          onClick={() => setFilter('info')}
        >
          Info
        </Button>
        <Button
          variant={filter === 'warning' ? 'default' : 'outline'}
          className={filter === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
          onClick={() => setFilter('warning')}
        >
          Warning
        </Button>
        <Button
          variant={filter === 'error' ? 'default' : 'outline'}
          className={filter === 'error' ? 'bg-red-500 hover:bg-red-600' : ''}
          onClick={() => setFilter('error')}
        >
          Error
        </Button>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className='rounded-lg bg-gray-50 py-12 text-center'>
          <p className='text-gray-500'>No notifications found</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-4 rounded-lg border p-4 hover:bg-gray-50 ${
                notification.read ? 'bg-gray-50 opacity-75' : 'bg-white'
              }`}
            >
              <div className='flex-shrink-0'>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    notification.response.level === 'info'
                      ? 'bg-blue-500'
                      : notification.response.level === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  } ${notification.read ? 'opacity-50' : ''} text-white`}
                >
                  {notification.response.level === 'info' ? (
                    <BellIcon className='h-5 w-5' />
                  ) : notification.response.level === 'warning' ? (
                    <BellIcon className='h-5 w-5' />
                  ) : (
                    <XIcon className='h-5 w-5' />
                  )}
                </div>
              </div>
              <div className='flex-1'>
                <div className='flex items-center'>
                  <p className={`font-medium ${notification.read ? 'text-gray-500' : ''}`}>
                    {notification.response.message}
                  </p>
                  {!notification.read && (
                    <span className='ml-2 h-2 w-2 rounded-full bg-blue-500'></span>
                  )}
                </div>
                <p className='text-sm text-gray-500'>
                  {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                </p>
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => removeNotification(notification.id)}
              >
                <XIcon className='h-4 w-4' />
                <span className='sr-only'>Dismiss</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
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

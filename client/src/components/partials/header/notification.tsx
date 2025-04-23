import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export default function NotificationPopover() {
  const handleMarkAllAsRead = () => {};

  const notifications = [
    {
      id: 1,
      message: 'You have a new message',
      time: '2 minutes ago',
      image: 'https://github.com/shadcn.png',
    },
    {
      id: 2,
      message: 'Your profile was updated',
      time: '5 minutes ago',
      icon: <BellIcon className='h-4 w-4' />,
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='icon' className='rounded-full'>
          <BellIcon className='h-4 w-4' />
          <span className='sr-only'>Toggle notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80 p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-medium'>Notifications</h3>
          <Button variant='ghost' size='sm' onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        </div>
        <div className='space-y-4'>
          {notifications.map((notification, index) => (
            <div key={index} className='flex items-start gap-3'>
              <div className='flex-shrink-0'>
                <div className='bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full'>
                  {notification.image ? (
                    <img
                      src={notification.image}
                      alt='Notification'
                      className='h-8 w-8 rounded-full'
                    />
                  ) : (
                    notification.icon
                  )}
                </div>
              </div>
              <div className='flex-1'>
                <p className='text-sm font-medium'>{notification.message}</p>
                <p className='text-muted-foreground text-sm'>{notification.time}</p>
              </div>
            </div>
          ))}
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

import { OrderStatus } from '@/constants/order';
import { cn } from '@/lib/utils';
import { getStatusColor } from './-order-card';

interface OrderProgressBarProps {
  status: OrderStatus;
  className?: string;
}

export function OrderProgressBar({ status, className }: OrderProgressBarProps) {
  const steps = [
    { key: OrderStatus.CREATED, label: 'Created' },
    { key: OrderStatus.CONFIRMED, label: 'Confirmed' },
    { key: OrderStatus.PREPARING, label: 'Preparing' },
    { key: OrderStatus.READY_FOR_PICKUP, label: 'Ready for Pickup' },
    { key: OrderStatus.OUT_FOR_DELIVERY, label: 'Out for Delivery' },
    { key: OrderStatus.DELIVERED, label: 'Delivered' },
    { key: OrderStatus.CANCELLED, label: 'Cancelled' },
  ];

  // If cancelled, show a different UI
  if (status === OrderStatus.CANCELLED) {
    return (
      <div className={cn('w-full', className)}>
        <div className='mb-1 flex items-center justify-between'>
          <span className='text-xs font-medium text-slate-700 dark:text-slate-300'>
            Order Cancelled
          </span>
        </div>
        <div className='h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700'>
          <div className='h-full w-full bg-rose-500 dark:bg-rose-400'></div>
        </div>
      </div>
    );
  }

  // Find the current step index
  const currentStepIndex = steps.findIndex((step) => step.key === status);

  // Calculate progress percentage
  const progressPercentage =
    currentStepIndex >= 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  return (
    <div className={cn('w-full', className)}>
      <div className='mb-1 flex items-center justify-between'>
        <span className='text-xs font-medium text-slate-700 dark:text-slate-300'>
          Order Progress
        </span>
        <span className='text-xs text-slate-500 dark:text-slate-400'>
          {Math.round(progressPercentage)}%
        </span>
      </div>
      <div className='h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700'>
        <div
          className={`h-full ${getStatusColor(status)}`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className='mt-1 flex justify-between text-[10px] text-slate-500 dark:text-slate-400'>
        <span>Created</span>
        <span>Processing</span>
        <span>Delivered</span>
      </div>
    </div>
  );
}

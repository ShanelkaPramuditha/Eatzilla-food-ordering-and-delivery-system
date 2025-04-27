import { cn } from '@/lib/utils';

type OrderStatus =
  | 'created'
  | 'processing'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

interface OrderProgressBarProps {
  status: OrderStatus;
  className?: string;
}

export function OrderProgressBar({ status, className }: OrderProgressBarProps) {
  const steps = [
    { key: 'created', label: 'Created' },
    { key: 'processing', label: 'Processing' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
  ];

  // Get status color for the progress bar
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'created':
        return 'bg-indigo-500 dark:bg-indigo-400';
      case 'processing':
        return 'bg-amber-500 dark:bg-amber-400';
      case 'preparing':
        return 'bg-orange-500 dark:bg-orange-400';
      case 'ready':
        return 'bg-teal-500 dark:bg-teal-400';
      case 'out_for_delivery':
        return 'bg-sky-500 dark:bg-sky-400';
      case 'delivered':
        return 'bg-emerald-500 dark:bg-emerald-400';
      case 'cancelled':
        return 'bg-rose-500 dark:bg-rose-400';
      default:
        return 'bg-slate-500 dark:bg-slate-400';
    }
  };

  // If cancelled, show a different UI
  if (status === 'cancelled') {
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

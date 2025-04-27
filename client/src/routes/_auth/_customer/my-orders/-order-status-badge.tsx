import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/constants/order';
import { cn } from '@/lib/utils';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CREATED:
        return {
          label: 'Created',
          variant: 'default' as const,
          className:
            'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 dark:border-indigo-800/30',
        };
      case OrderStatus.CONFIRMED:
        return {
          label: 'Confirmed',
          variant: 'secondary' as const,
          className:
            'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50 dark:border-amber-800/30',
        };
      case OrderStatus.PREPARING:
        return {
          label: 'Preparing',
          variant: 'warning' as const,
          className:
            'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50 dark:border-orange-800/30',
        };
      case OrderStatus.READY_FOR_PICKUP:
        return {
          label: 'Ready for Pickup',
          variant: 'success' as const,
          className:
            'bg-teal-100 text-teal-700 hover:bg-teal-200 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:hover:bg-teal-900/50 dark:border-teal-800/30',
        };
      case OrderStatus.OUT_FOR_DELIVERY:
        return {
          label: 'Out for Delivery',
          variant: 'info' as const,
          className:
            'bg-sky-100 text-sky-700 hover:bg-sky-200 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:hover:bg-sky-900/50 dark:border-sky-800/30',
        };
      case OrderStatus.DELIVERED:
        return {
          label: 'Delivered',
          variant: 'success' as const,
          className:
            'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 dark:border-emerald-800/30',
        };
      case OrderStatus.CANCELLED:
        return {
          label: 'Cancelled',
          variant: 'destructive' as const,
          className:
            'bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50 dark:border-rose-800/30',
        };
      default:
        return {
          label: status,
          variant: 'outline' as const,
          className: 'dark:text-slate-300',
        };
    }
  };

  const { label, variant, className: statusClassName } = getStatusConfig(status);

  return (
    <Badge
      variant={variant}
      className={cn('px-2.5 py-0.5 font-medium capitalize', statusClassName, className)}
    >
      {label}
    </Badge>
  );
}

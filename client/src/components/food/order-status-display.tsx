import { OrderStatus } from '@/constants/order';
import { Order } from '@/types/order';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';
import { OrderNotificationService } from '@/services/order-notification.service';

interface OrderStatusDisplayProps {
  order: Order;
  previousStatus?: OrderStatus;
}

export function OrderStatusDisplay({ order, previousStatus }: OrderStatusDisplayProps) {
  const statusColors: Record<OrderStatus, { color: string; bgColor: string }> = {
    [OrderStatus.CREATED]: { color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50' },
    [OrderStatus.CONFIRMED]: { color: 'bg-purple-100 text-purple-800', bgColor: 'bg-purple-50' },
    [OrderStatus.PREPARING]: { color: 'bg-amber-100 text-amber-800', bgColor: 'bg-amber-50' },
    [OrderStatus.READY_FOR_PICKUP]: { color: 'bg-cyan-100 text-cyan-800', bgColor: 'bg-cyan-50' },
    [OrderStatus.OUT_FOR_DELIVERY]: {
      color: 'bg-indigo-100 text-indigo-800',
      bgColor: 'bg-indigo-50',
    },
    [OrderStatus.DELIVERED]: { color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' },
    [OrderStatus.CANCELLED]: { color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' },
  };

  // Send notification when order status changes
  useEffect(() => {
    if (previousStatus && previousStatus !== order.status) {
      OrderNotificationService.notifyOrderStatusChange(order._id, order.status);
    }
  }, [order.status, order._id, previousStatus]);

  const getStatusLabel = (status: OrderStatus) => {
    const statusLabels: Record<OrderStatus, string> = {
      [OrderStatus.CREATED]: 'Order Placed',
      [OrderStatus.CONFIRMED]: 'Confirmed',
      [OrderStatus.PREPARING]: 'Preparing',
      [OrderStatus.READY_FOR_PICKUP]: 'Ready for Pickup',
      [OrderStatus.OUT_FOR_DELIVERY]: 'Out for Delivery',
      [OrderStatus.DELIVERED]: 'Delivered',
      [OrderStatus.CANCELLED]: 'Cancelled',
    };
    return statusLabels[status] || status;
  };

  return (
    <div className={`rounded-md p-4 ${statusColors[order.status]?.bgColor || 'bg-gray-50'}`}>
      <div className='flex items-center justify-between'>
        <div>
          <Badge className={`${statusColors[order.status]?.color || 'bg-gray-100 text-gray-800'}`}>
            {getStatusLabel(order.status)}
          </Badge>
          <p className='mt-2 text-sm'>
            {order.status === OrderStatus.DELIVERED &&
              'Your order has been delivered. Enjoy your meal!'}
            {order.status === OrderStatus.OUT_FOR_DELIVERY && 'Your order is on its way to you!'}
            {order.status === OrderStatus.PREPARING && 'The restaurant is preparing your order.'}
            {order.status === OrderStatus.CONFIRMED && 'Your order has been palced successfully.'}
            {order.status === OrderStatus.CREATED &&
              'Your order has been received and is being processed.'}
            {order.status === OrderStatus.READY_FOR_PICKUP &&
              'Your order is ready for pickup by the delivery driver.'}
            {order.status === OrderStatus.CANCELLED && 'Your order has been cancelled.'}
          </p>
        </div>

        {order.estimatedDeliveryTime && (
          <div className='text-right'>
            <p className='text-sm font-medium'>Estimated Delivery</p>
            <p className='text-sm'>
              {new Date(order.estimatedDeliveryTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

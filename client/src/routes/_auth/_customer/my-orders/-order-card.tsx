'use client';

import { formatCurrency } from '@/utils/common-utils';
import type { Order } from '@/types/order';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, ExternalLink, MapPin, Package, ShoppingBag } from 'lucide-react';
import { OrderStatusBadge } from './-order-status-badge';
import { OrderProgressBar } from './-order-progress-bar';
import { OrderStatus } from '@/constants/order';

interface OrderCardProps {
  order: Order;
  onViewDetails: () => void;
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case OrderStatus.CREATED:
      return 'border-l-indigo-500';
    case OrderStatus.CONFIRMED:
      return 'border-l-amber-500';
    case OrderStatus.PREPARING:
      return 'border-l-orange-500';
    case OrderStatus.READY_FOR_PICKUP:
      return 'border-l-teal-500';
    case OrderStatus.OUT_FOR_DELIVERY:
      return 'border-l-sky-500';
    case OrderStatus.DELIVERED:
      return 'border-l-emerald-500';
    case OrderStatus.CANCELLED:
      return 'border-l-rose-500';
    default:
      return 'border-l-slate-300';
  }
};

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const date = new Date(order.createdAt);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);

  // Count total items across all suborders
  const totalItems = order.suborders.reduce((acc, suborder) => {
    return acc + suborder.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0);
  }, 0);

  // Count number of restaurants
  const restaurantCount = order.suborders.length;

  return (
    <Card
      className={`group overflow-hidden border-0 border-l-4 shadow-md transition-all duration-300 hover:shadow-lg ${getStatusColor(
        order.status,
      )} bg-white dark:bg-slate-800`}
    >
      <div className='relative'>
        <div className='p-5'>
          <div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
            <div className='space-y-1'>
              <div className='flex items-center gap-3'>
                <h3 className='text-lg font-bold text-slate-800 dark:text-slate-100'>
                  #{order._id.slice(-6)}
                </h3>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className='flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400'>
                <Clock className='h-3.5 w-3.5' />
                {formattedDate}
              </p>
            </div>

            <div className='flex flex-wrap gap-2 md:gap-3'>
              <div className='flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300'>
                <ShoppingBag className='h-3.5 w-3.5' />
                <span>
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className='flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300'>
                <Package className='h-3.5 w-3.5' />
                <span>
                  {restaurantCount} {restaurantCount === 1 ? 'restaurant' : 'restaurants'}
                </span>
              </div>

              <Badge
                variant={order.isPaid ? 'success' : 'destructive'}
                className={`text-xs ${
                  order.isPaid
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50'
                    : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'
                }`}
              >
                {order.isPaid ? 'Paid' : 'Unpaid'}
              </Badge>
            </div>
          </div>

          <div className='mt-4'>
            <OrderProgressBar status={order.status} />
          </div>

          <div className='mt-4 grid grid-cols-2 gap-3'>
            <div className='col-span-2 flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 md:col-span-1 dark:border-slate-700 dark:bg-slate-700/50'>
              <MapPin className='mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500 dark:text-slate-400' />
              <div className='overflow-hidden'>
                <p className='truncate text-xs text-slate-600 dark:text-slate-300'>
                  {order.deliveryAddress.street}, {order.deliveryAddress.city}
                </p>
              </div>
            </div>

            <div className='col-span-2 flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3 md:col-span-1 dark:border-slate-700 dark:bg-slate-700/50'>
              <div className='text-xs font-medium text-slate-700 dark:text-slate-300'>Total</div>
              <div className='text-base font-bold text-slate-800 dark:text-white'>
                {formatCurrency(order.total, order.currency)}
              </div>
            </div>
          </div>
        </div>

        <div className='relative'>
          <div className='flex items-center justify-between border-t border-slate-100 bg-white px-5 py-3 dark:border-slate-700 dark:bg-slate-800/80'>
            {order.specialInstructions ? (
              <div className='flex max-w-[70%] items-start gap-1.5'>
                <span className='flex-shrink-0 rounded-full bg-amber-100 p-1 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='14'
                    height='14'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'></path>
                    <line x1='12' y1='9' x2='12' y2='13'></line>
                    <line x1='12' y1='17' x2='12.01' y2='17'></line>
                  </svg>
                </span>
                <p className='truncate text-xs text-slate-600 dark:text-slate-300'>
                  {order.specialInstructions}
                </p>
              </div>
            ) : (
              <div></div>
            )}
            <Button
              onClick={onViewDetails}
              className='gap-1.5 bg-indigo-600 text-white transition-all duration-200 group-hover:shadow-md hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800'
              size='sm'
            >
              <span>Details</span>
              <ExternalLink className='h-3.5 w-3.5' />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

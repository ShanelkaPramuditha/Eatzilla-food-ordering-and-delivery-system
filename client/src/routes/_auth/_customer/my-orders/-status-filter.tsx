'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Filter, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Order } from '@/types/order';
import { OrderStatus } from '@/constants/order';

interface StatusFilterProps {
  selectedStatus: OrderStatus | 'all';
  onStatusChange: (status: OrderStatus | 'all') => void;
  orders: Order[];
}

export function StatusFilter({ selectedStatus, onStatusChange, orders }: StatusFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Count orders by status
  const getStatusCount = (status: OrderStatus | 'all') => {
    if (status === 'all') return orders.length;
    return orders.filter((order) => order.status === status).length;
  };

  // Get status color and label
  const getStatusConfig = (status: OrderStatus | 'all') => {
    switch (status) {
      case 'all':
        return {
          label: 'All Orders',
          bgClass: 'bg-slate-100 dark:bg-slate-700',
          textClass: 'text-slate-700 dark:text-slate-300',
        };
      case OrderStatus.CREATED:
        return {
          label: 'Created',
          bgClass: 'bg-indigo-100 dark:bg-indigo-900/30',
          textClass: 'text-indigo-700 dark:text-indigo-300',
        };
      case OrderStatus.CONFIRMED:
        return {
          label: 'Confirmed',
          bgClass: 'bg-blue-100 dark:bg-blue-900/30',
          textClass: 'text-blue-700 dark:text-blue-300',
        };
      case OrderStatus.PREPARING:
        return {
          label: 'Preparing',
          bgClass: 'bg-orange-100 dark:bg-orange-900/30',
          textClass: 'text-orange-700 dark:text-orange-300',
        };
      case OrderStatus.READY_FOR_PICKUP:
        return {
          label: 'Ready for Pickup',
          bgClass: 'bg-teal-100 dark:bg-teal-900/30',
          textClass: 'text-teal-700 dark:text-teal-300',
        };
      case OrderStatus.OUT_FOR_DELIVERY:
        return {
          label: 'Out for Delivery',
          bgClass: 'bg-sky-100 dark:bg-sky-900/30',
          textClass: 'text-sky-700 dark:text-sky-300',
        };
      case OrderStatus.DELIVERED:
        return {
          label: 'Delivered',
          bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
          textClass: 'text-emerald-700 dark:text-emerald-300',
        };
      case OrderStatus.CANCELLED:
        return {
          label: 'Cancelled',
          bgClass: 'bg-rose-100 dark:bg-rose-900/30',
          textClass: 'text-rose-700 dark:text-rose-300',
        };
      default:
        return {
          label: status,
          bgClass: 'bg-slate-100 dark:bg-slate-700',
          textClass: 'text-slate-700 dark:text-slate-300',
        };
    }
  };

  const { label: selectedLabel, bgClass, textClass } = getStatusConfig(selectedStatus);

  return (
    <div className='flex max-w-lg flex-col justify-center gap-3 sm:flex-row sm:items-center'>
      <div className='flex items-center gap-2'>
        <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>
          Filter by status:
        </span>

        {selectedStatus !== 'all' && (
          <Button
            variant='ghost'
            size='sm'
            className='h-7 px-2 text-slate-500 dark:text-slate-400'
            onClick={() => onStatusChange('all')}
          >
            <X className='mr-1 h-3.5 w-3.5' />
            <span>Clear</span>
          </Button>
        )}
      </div>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            className={`justify-between ${bgClass} ${textClass} hover:bg-opacity-80 dark:hover:bg-opacity-80 border-0`}
          >
            <div className='flex items-center gap-2'>
              <Filter className='h-4 w-4' />
              <span>{selectedLabel}</span>
              {selectedStatus !== 'all' && (
                <Badge className='ml-1 bg-white/30 text-xs'>{getStatusCount(selectedStatus)}</Badge>
              )}
            </div>
            <ChevronDown className='ml-2 h-4 w-4 opacity-70' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end'>
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className='flex cursor-pointer items-center justify-between'
              onClick={() => {
                onStatusChange('all');
                setIsOpen(false);
              }}
            >
              <span>All Orders</span>
              <div className='flex items-center gap-2'>
                <Badge variant='outline' className='text-xs'>
                  {getStatusCount('all')}
                </Badge>
                {selectedStatus === 'all' && (
                  <Check className='h-4 w-4 text-indigo-600 dark:text-indigo-400' />
                )}
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {(
              [
                OrderStatus.CREATED,
                OrderStatus.CONFIRMED,
                OrderStatus.PREPARING,
                OrderStatus.READY_FOR_PICKUP,
                OrderStatus.OUT_FOR_DELIVERY,
                OrderStatus.DELIVERED,
                OrderStatus.CANCELLED,
              ] as const
            ).map((status) => {
              const { label, textClass } = getStatusConfig(status);
              const count = getStatusCount(status);

              return (
                <DropdownMenuItem
                  key={status}
                  className='flex cursor-pointer items-center justify-between'
                  disabled={count === 0}
                  onClick={() => {
                    onStatusChange(status);
                    setIsOpen(false);
                  }}
                >
                  <span className={count > 0 ? textClass : ''}>{label}</span>
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline' className='text-xs'>
                      {count}
                    </Badge>
                    {selectedStatus === status && (
                      <Check className='h-4 w-4 text-indigo-600 dark:text-indigo-400' />
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

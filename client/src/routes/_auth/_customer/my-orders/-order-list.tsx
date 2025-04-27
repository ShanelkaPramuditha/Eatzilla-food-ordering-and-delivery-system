'use client';

import { useEffect, useState } from 'react';
import { OrderCard } from './-order-card';
import { OrderDetailsDialog } from './-order-details-dialog';
import type { Order } from '@/types/order';
import { mockOrders } from '@/data/order-items';
import { Clock, MapPin, Package2, Search, ShoppingBag } from 'lucide-react';
import OrderService from '@/services/order.service';
import { OrderStatus } from '@/types/cart';
import { StatusFilter } from './-status-filter';
import { Input } from '@/components/ui/input';

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };
  useEffect(() => {
    // Fetch orders from the server
    const fetchOrders = async () => {
      try {
        const response = await OrderService.getCustomerOrders();
        setOrders(response);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);
  // Apply filters when statusFilter changes
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === statusFilter));
    }
  }, [statusFilter, orders]);

  return (
    <div className='space-y-6'>
      <div className='mb-8 rounded-xl border border-slate-100 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800'>
        <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
          <StatusFilter
            selectedStatus={statusFilter}
            onStatusChange={setStatusFilter}
            orders={orders}
          />

          <div className='flex gap-2'>
            <div className='relative'>
              <Search className='absolute top-2.5 left-2.5 h-4 w-4 text-slate-400' />
              <Input
                className='w-[200px] bg-white pl-9 dark:bg-slate-700'
                placeholder='Search orders...'
              />
            </div>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className='rounded-xl border border-slate-100 bg-slate-50 py-16 text-center dark:border-slate-700 dark:bg-slate-800/50'>
          <div className='bg- mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full dark:bg-indigo-900/30'>
            <Package2 className='h-8 w-8 text-indigo-600 dark:text-indigo-400' />
          </div>
          <h3 className='mb-2 text-xl font-semibold text-slate-800 dark:text-slate-200'>
            No Orders Found
          </h3>
          <p className='mx-auto max-w-md text-slate-500 dark:text-slate-400'>
            {statusFilter === 'all'
              ? "You don't have any orders yet. When you place an order, it will appear here."
              : `You don't have any orders with status "${statusFilter}". Try selecting a different filter.`}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onViewDetails={() => handleViewDetails(order)}
            />
          ))}
        </div>
      )}

      <OrderDetailsDialog
        order={selectedOrder}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
}

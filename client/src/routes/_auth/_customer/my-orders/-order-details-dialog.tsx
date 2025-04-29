'use client';

import { formatCurrency } from '@/utils/common-utils';
import type { Order } from '@/types/order';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderStatusBadge } from './-order-status-badge';
import { OrderProgressBar } from './-order-progress-bar';
import { Clock, CreditCard, MapPin, MessageSquare } from 'lucide-react';
import { getStatusColor } from './-order-card';
import { OrderStatus } from '@/constants/order';
import { useNavigate } from '@tanstack/react-router';
import OrderService from '@/services/order.service';
import { toast } from 'sonner';
import { useState } from 'react';

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetchOrders: () => void;
}

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
  refetchOrders,
}: OrderDetailsDialogProps) {
  const navigate = useNavigate();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  if (!order) return null;

  const date = new Date(order.createdAt);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);

  const handleCancelOrder = async (orderId: string) => {
    // Handle cancel order logic here
    try {
      await OrderService.cancelOrder(orderId);
      toast.success('Order canceled successfully');
      refetchOrders();
      onOpenChange(false);
    } catch (error) {
      console.error('Error canceling order:', error);
      toast.error('Failed to cancel order. Please try again.');
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={`max-h-[90vh] overflow-auto border-l-4 md:max-w-3xl ${getStatusColor(order.status)} dark:bg-slate-800`}
        >
          <DialogHeader className='-mx-6 -mt-6 border-b bg-gradient-to-r from-slate-50 to-white px-6 pt-6 pb-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800'>
            <div className='flex flex-col justify-between gap-2 sm:flex-row sm:items-center'>
              <DialogTitle className='text-xl text-slate-800 dark:text-white'>
                Order #{order._id.slice(-6)}
              </DialogTitle>
              <OrderStatusBadge status={order.status} />
            </div>
            <DialogDescription className='flex items-center gap-1.5 text-slate-500 dark:text-slate-400'>
              <Clock className='h-3.5 w-3.5' />
              {formattedDate}
            </DialogDescription>

            <div className='mt-4'>
              <OrderProgressBar status={order.status} />
            </div>
          </DialogHeader>

          <Tabs defaultValue='items'>
            <TabsList className='mb-4 grid grid-cols-2 bg-slate-100 p-1 dark:bg-slate-700'>
              <TabsTrigger
                value='items'
                className='data-[state=active]:bg-white data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-white'
              >
                Order Items
              </TabsTrigger>
              <TabsTrigger
                value='delivery'
                className='data-[state=active]:bg-white data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-white'
              >
                Delivery Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value='items' className='space-y-6'>
              {order.suborders.map((suborder, index) => (
                <div key={suborder.restaurantId} className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <h3 className='font-medium dark:text-white'>Restaurant #{index + 1}</h3>
                    <OrderStatusBadge status={suborder.status} />
                  </div>

                  <div className='rounded-md border dark:border-slate-700'>
                    <table className='w-full'>
                      <thead>
                        <tr className='border-b bg-slate-50 dark:border-slate-600 dark:bg-slate-700'>
                          <th className='px-4 py-3 text-left text-sm font-medium dark:text-slate-300'>
                            Item
                          </th>
                          <th className='px-4 py-3 text-center text-sm font-medium dark:text-slate-300'>
                            Qty
                          </th>
                          <th className='px-4 py-3 text-right text-sm font-medium dark:text-slate-300'>
                            Price
                          </th>
                          <th className='px-4 py-3 text-right text-sm font-medium dark:text-slate-300'>
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {suborder.items.map((item) => (
                          <tr
                            key={item.menuItemId}
                            className='border-b last:border-0 dark:border-slate-700 dark:text-slate-300'
                          >
                            <td className='px-4 py-3 text-sm'>{item.name}</td>
                            <td className='px-4 py-3 text-center text-sm'>{item.quantity}</td>
                            <td className='px-4 py-3 text-right text-sm'>
                              {formatCurrency(item.price, order.currency)}
                            </td>
                            <td className='px-4 py-3 text-right text-sm font-medium'>
                              {formatCurrency(item.price * item.quantity, order.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className='bg-slate-50 dark:bg-slate-700'>
                          <td
                            colSpan={3}
                            className='px-4 py-2 text-right text-sm font-medium dark:text-slate-300'
                          >
                            Subtotal
                          </td>
                          <td className='px-4 py-2 text-right text-sm font-medium dark:text-white'>
                            {formatCurrency(suborder.subtotal, order.currency)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              ))}

              <Separator className='dark:bg-slate-700' />

              <div className='space-y-2 dark:text-slate-300'>
                <div className='flex justify-between'>
                  <span className='text-sm'>Subtotal</span>
                  <span className='text-sm font-medium'>
                    {formatCurrency(order.subtotal, order.currency)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm'>Delivery Fee</span>
                  <span className='text-sm font-medium'>
                    {formatCurrency(order.deliveryFee, order.currency)}
                  </span>
                </div>
                {/* <div className='flex justify-between'>
                  <span className='text-sm'>Delivery Fee</span>
                  <span className='text-sm font-medium'>
                    {formatCurrency(order.deliveryFee, order.currency)}
                  </span>
                </div> */}
                <div className='flex justify-between'>
                  <span className='text-sm'>Tax</span>
                  <span className='text-sm font-medium'>
                    {formatCurrency(order.tax, order.currency)}
                  </span>
                </div>
                <Separator className='dark:bg-slate-700' />
                <div className='flex justify-between'>
                  <span className='font-medium'>Total</span>
                  <span className='font-medium dark:text-white'>
                    {formatCurrency(order.total, order.currency)}
                  </span>
                </div>
              </div>

              {order.specialInstructions && (
                <div className='mt-4 rounded-md border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/20'>
                  <div className='mb-2 flex items-center gap-2'>
                    <MessageSquare className='h-4 w-4 text-amber-500 dark:text-amber-400' />
                    <h4 className='text-sm font-medium dark:text-amber-300'>
                      Special Instructions
                    </h4>
                  </div>
                  <p className='text-sm text-amber-700 dark:text-amber-300'>
                    {order.specialInstructions}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value='delivery' className='space-y-4'>
              <div className='rounded-md border bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/50'>
                <div className='mb-2 flex items-center gap-2'>
                  <MapPin className='h-4 w-4 text-slate-500 dark:text-slate-400' />
                  <h4 className='font-medium dark:text-white'>Delivery Address</h4>
                </div>
                <div className='space-y-1 text-sm dark:text-slate-300'>
                  <p>{order.deliveryAddress.street}</p>
                  <p>
                    {order.deliveryAddress.city}, {order.deliveryAddress.state}{' '}
                    {order.deliveryAddress.postalCode}
                  </p>
                  {order.deliveryAddress.instructions && (
                    <div className='mt-2'>
                      <p className='font-medium dark:text-white'>Instructions:</p>
                      <p className='text-slate-700 dark:text-slate-300'>
                        {order.deliveryAddress.instructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className='rounded-md border bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/50'>
                <div className='mb-2 flex items-center gap-2'>
                  <CreditCard className='h-4 w-4 text-slate-500 dark:text-slate-400' />
                  <h4 className='font-medium dark:text-white'>Payment Details</h4>
                </div>
                <div className='space-y-2 dark:text-slate-300'>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Method</span>
                    <span className='text-sm font-medium'>{order.paymentMethod}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Status</span>
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
                  <div className='flex justify-between'>
                    <span className='text-sm'>Total Amount</span>
                    <span className='text-sm font-bold dark:text-white'>
                      {formatCurrency(order.total, order.currency)}
                    </span>
                  </div>
                </div>
              </div>

              <div className='rounded-md border bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/50'>
                <h4 className='mb-2 font-medium dark:text-white'>Delivery Status</h4>
                <div className='flex items-center gap-2'>
                  <OrderStatusBadge status={order.status} />
                  <span className='text-sm text-slate-500 dark:text-slate-400'>
                    Last updated: {new Date(order.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className='mt-4 flex justify-end gap-2'>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='dark:border-slate-600 dark:text-slate-300'
            >
              Close
            </Button>
            {order.status === 'created' && (
              <Button
                variant='destructive'
                className='bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
                onClick={() => setCancelDialogOpen(true)}
              >
                Cancel Order
              </Button>
            )}

            {order.status === OrderStatus.CREATED ? (
              <Button
                variant='destructive'
                className='bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800'
                onClick={() => {
                  navigate({ to: '/checkout/pay', search: { orderId: order._id } });
                }}
              >
                Proceed with Payment
              </Button>
            ) : order.status !== OrderStatus.CANCELLED ? (
              <Button className='bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800'>
                Track Order
              </Button>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className='dark:border-slate-700 dark:bg-slate-800'>
          <AlertDialogHeader>
            <AlertDialogTitle className='dark:text-white'>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription className='dark:text-slate-300'>
              Are you sure you want to cancel this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='dark:border-slate-600 dark:text-slate-300'>
              No, keep order
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => order && handleCancelOrder(order._id)}
              className='bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
            >
              Yes, cancel order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

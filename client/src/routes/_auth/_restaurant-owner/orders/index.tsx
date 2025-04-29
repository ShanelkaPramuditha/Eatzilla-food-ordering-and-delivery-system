import { createFileRoute } from '@tanstack/react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Check, ChevronRight, Clock, Coffee, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import OrderService from '@/services/order.service';
import { useAuth } from '@/contexts/auth-context';
import { OrderStatus } from '@/constants/order';
import { Order } from '@/types/order';
import { OrderItem } from '@/types/cart';
import { DialogClose } from '@radix-ui/react-dialog';

export const Route = createFileRoute('/_auth/_restaurant-owner/orders/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      if (user?.id) {
        const orders = await OrderService.getRestaurantOrders('662b8afcc6d3f2f5938b1d01');
        setOrders(orders);
        console.log(orders[0].suborders[0].status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='grow rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <div className='flex flex-col items-start justify-between sm:flex-row'>
        <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
          Order Management
        </h3>
      </div>

      <div>
        <Tabs defaultValue='pending' className='w-full'>
          <TabsList>
            <TabsTrigger className='px-5' value='pending'>
              Confirmed (
              {
                orders.filter((order: Order) => order.suborders[0].status === OrderStatus.CONFIRMED)
                  .length
              }
              )
            </TabsTrigger>
            <TabsTrigger className='px-5' value='preparing'>
              Preparing (
              {
                orders.filter((order: Order) => order.suborders[0].status === OrderStatus.PREPARING)
                  .length
              }
              )
            </TabsTrigger>
            <TabsTrigger className='px-5' value='ready_for_pickup'>
              Ready (
              {
                orders.filter(
                  (order: Order) => order.suborders[0].status === OrderStatus.READY_FOR_PICKUP,
                ).length
              }
              )
            </TabsTrigger>
            <TabsTrigger className='px-5' value='completed'>
              Completed (
              {
                orders.filter(
                  (order: Order) => order.suborders[0].status === OrderStatus.OUT_FOR_DELIVERY,
                ).length
              }
              )
            </TabsTrigger>
            <TabsTrigger className='px-5' value='cancelled'>
              Cancelled (
              {
                orders.filter((order: Order) => order.suborders[0].status === OrderStatus.CANCELLED)
                  .length
              }
              )
            </TabsTrigger>
            <TabsTrigger className='px-5' value='allorders'>
              All Orders
            </TabsTrigger>
          </TabsList>
          <TabsContent value='pending'>
            <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              {orders.map(
                (order) =>
                  order.suborders[0].status === OrderStatus.CONFIRMED && (
                    <OrderCard key={order._id} order={order} refetch={fetchOrders} />
                  ),
              )}
            </div>
          </TabsContent>
          <TabsContent value='preparing'>
            <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              {orders.map(
                (order) =>
                  order.suborders[0].status === OrderStatus.PREPARING && (
                    <OrderCard key={order._id} order={order} refetch={fetchOrders} />
                  ),
              )}
            </div>
          </TabsContent>
          <TabsContent value='ready_for_pickup'>
            <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              {orders.map(
                (order) =>
                  order.suborders[0].status === OrderStatus.READY_FOR_PICKUP && (
                    <OrderCard key={order._id} order={order} refetch={fetchOrders} />
                  ),
              )}
            </div>
          </TabsContent>
          <TabsContent value='completed'>
            <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              {orders.map(
                (order) =>
                  order.suborders[0].status === OrderStatus.OUT_FOR_DELIVERY && (
                    <OrderCard key={order._id} order={order} refetch={fetchOrders} />
                  ),
              )}
            </div>
          </TabsContent>
          <TabsContent value='cancelled'>
            <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              {orders.map(
                (order) =>
                  order.suborders[0].status === OrderStatus.CANCELLED && (
                    <OrderCard key={order._id} order={order} refetch={fetchOrders} />
                  ),
              )}
            </div>
          </TabsContent>
          <TabsContent value='allorders'>
            <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} refetch={fetchOrders} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  refetch: () => void;
}

const OrderCard = ({ order, refetch }: OrderCardProps) => {
  const getStatusClasses = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CONFIRMED:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.PREPARING:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.READY_FOR_PICKUP:
        return 'bg-orange-100 text-orange-800';
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CONFIRMED:
        return {
          label: 'Confirmed',
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className='mr-1 h-5 w-5' />,
          nextAction: OrderStatus.PREPARING,
          nextLabel: 'Start Preparing',
          cancelable: true,
        };
      case OrderStatus.PREPARING:
        return {
          label: 'Preparing',
          color: 'bg-blue-100 text-blue-800',
          icon: <Coffee className='mr-1 h-5 w-5' />,
          nextAction: OrderStatus.READY_FOR_PICKUP,
          nextLabel: 'Mark as Ready',
          cancelable: true,
        };
      case OrderStatus.READY_FOR_PICKUP:
        return {
          label: 'Ready',
          color: 'bg-orange-100 text-orange-800',
          icon: <Check className='mr-1 h-5 w-5' />,
          nextAction: OrderStatus.OUT_FOR_DELIVERY,
          nextLabel: 'Complete Order',
          cancelable: true,
        };
      case OrderStatus.OUT_FOR_DELIVERY:
        return {
          label: 'Completed',
          color: 'bg-green-100 text-green-800',
          icon: <Check className='mr-1 h-5 w-5' />,
          nextAction: null,
          nextLabel: null,
          cancelable: false,
        };
      case OrderStatus.CANCELLED:
        return {
          label: 'Cancelled',
          color: 'bg-red-100 text-red-800',
          icon: <XCircle className='mr-1 h-5 w-5' />,
          nextAction: null,
          nextLabel: null,
          cancelable: false,
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
          icon: null,
          nextAction: null,
          nextLabel: null,
          cancelable: false,
        };
    }
  };

  const statusInfo = getStatusInfo(order.suborders[0].status);

  const handleUpdateStatus = async (status: OrderStatus) => {
    try {
      await OrderService.updateSuborderStatus(order._id, order.suborders[0]._id, status);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='cursor-pointer overflow-hidden rounded-lg border bg-indigo-50 shadow transition-shadow hover:shadow-md'>
          <div className='p-4'>
            <div className='mb-2 flex items-center justify-between'>
              <div className='flex items-center'>
                <span className='mr-3 text-lg font-semibold text-gray-900'>
                  Order #{order._id.slice(-4)}
                </span>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${getStatusClasses(order.suborders[0].status)}`}
                >
                  {order.suborders[0].status.charAt(0).toLocaleUpperCase() +
                    order.suborders[0].status.slice(1)}
                </span>
              </div>
              <span className='text-sm text-gray-500'>
                {format(order.createdAt, 'MMM d, h:mm a')}
              </span>
            </div>

            <div className='mt-2'>
              <h3 className='text-sm font-medium text-gray-900'>{order.customerName}</h3>
              <p className='text-sm text-gray-500'>{order.phoneNumber}</p>
            </div>

            <div className='mt-3 border-t border-gray-200 pt-3'>
              <div className='flex justify-between text-sm'>
                <span className='font-semibold text-gray-900'>{order.suborders.length} items</span>
                <span className='font-medium text-gray-900'>${order.suborders[0].subtotal}</span>
              </div>

              <div className='mt-2'>
                <ul className='text-xs font-semibold text-gray-500'>
                  {order.suborders[0].items.slice(0, 2).map((item: OrderItem, index) => (
                    <li key={index} className='truncate'>
                      {item.quantity}x {item.name}
                    </li>
                  ))}
                  {order.suborders[0].items.length > 2 && (
                    <li>+{order.suborders.length - 2} more items</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className='flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3'>
            <span className='text-xs font-medium text-gray-500'>
              {order.specialInstructions ? 'Has special instructions' : 'No special instructions'}
            </span>
            <ChevronRight className='h-4 w-4 text-gray-400' />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex justify-between'>
            <p>Order#{order._id}</p>
            <div
              className={`mr-5 flex items-center rounded-full px-2 py-1 text-xs leading-5 font-semibold ${statusInfo.color}`}
            >
              {statusInfo.icon}
              {statusInfo.label}
            </div>
          </DialogTitle>
          <DialogDescription>
            Placed on{' '}
            {format(new Date(order.createdAt), 'MMMM d, yyyy') +
              ' at ' +
              format(new Date(order.createdAt), 'h:mm a')}
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className='mb-6'>
            <h4 className='mb-2 text-sm font-medium text-gray-900'>Customer Information</h4>
            <div className='rounded-md bg-gray-50 p-3'>
              <p className='text-sm font-medium text-gray-700'>{order.customerName}</p>
              <p className='text-sm text-gray-500'>{order.phoneNumber}</p>
            </div>
          </div>

          <div className='mb-6'>
            <h4 className='mb-2 text-sm font-medium text-gray-900'>Order Items</h4>
            <div className='rounded-md bg-gray-50 p-3'>
              <ul className='divide-y divide-gray-200'>
                {order.suborders[0].items.map((item: OrderItem, index) => (
                  <li key={index} className='flex justify-between py-2'>
                    <div>
                      <span className='text-sm font-medium text-gray-900'>{item.quantity}x </span>
                      <span className='text-sm text-gray-700'>{item.name}</span>
                    </div>
                    <span className='text-sm text-gray-700'>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className='mt-3 border-t border-gray-200 pt-3'>
                <div className='flex justify-between font-medium'>
                  <span className='text-sm text-gray-900'>Total</span>
                  <span className='text-sm text-gray-900'>${order.suborders[0].subtotal}</span>
                </div>
              </div>
            </div>
          </div>

          {order.specialInstructions && (
            <div className='mb-6'>
              <h4 className='mb-2 text-sm font-medium text-gray-900'>Special Instructions</h4>
              <div className='rounded-md bg-gray-50 p-3'>
                <p className='text-sm text-gray-700'>{order.specialInstructions}</p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className='mt-5 space-y-3 sm:mt-6'>
            {statusInfo.nextAction && (
              <DialogClose asChild>
                <button
                  type='button'
                  onClick={() => handleUpdateStatus(statusInfo.nextAction as OrderStatus)}
                  className={`flex w-full items-center justify-center rounded-sm py-1.5 font-semibold ${statusInfo.color}`}
                >
                  {statusInfo.nextLabel}
                  <ChevronRight className='ml-1 h-4 w-4' />
                </button>
              </DialogClose>
            )}

            {statusInfo.cancelable && (
              <DialogClose asChild>
                <button
                  type='button'
                  onClick={() => handleUpdateStatus(OrderStatus.CANCELLED)}
                  className='w-full rounded-sm bg-red-100 py-1.5 font-semibold text-red-500'
                >
                  Cancel Order
                </button>
              </DialogClose>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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

export const Route = createFileRoute('/_auth/_restaurant-owner/orders/')({
  component: RouteComponent,
});

const orders: Order[] = [
  {
    id: '1',
    items: [
      {
        menuItemId: '1',
        name: 'Crispy Calamari',
        price: 12.99,
        quantity: 2,
      },
    ],
    status: 'Pending',
    customerName: 'Customer name',
    customerPhone: `555-012812`,
    specialInstructions: 'Please make it extra spicy',
    totalAmount: 12.99 * 2,
    date: new Date(),
  },
  {
    id: '2',
    items: [
      {
        menuItemId: '1',
        name: 'Crispy Calamari',
        price: 12.99,
        quantity: 3,
      },
    ],
    status: 'Pending',
    customerName: 'Customer name',
    customerPhone: `555-012812`,
    specialInstructions: 'Please make it extra spicy',
    totalAmount: 12.99 * 3,
    date: new Date(),
  },
  {
    id: '2',
    items: [
      {
        menuItemId: '1',
        name: 'Crispy Calamari',
        price: 12.99,
        quantity: 3,
      },
    ],
    status: 'Preparing',
    customerName: 'Customer name',
    customerPhone: `555-012812`,
    specialInstructions: 'Please make it extra spicy',
    totalAmount: 12.99 * 3,
    date: new Date(),
  },
  {
    id: '2',
    items: [
      {
        menuItemId: '1',
        name: 'Crispy Calamari',
        price: 12.99,
        quantity: 3,
      },
    ],
    status: 'Ready',
    customerName: 'Customer name',
    customerPhone: `555-012812`,
    specialInstructions: 'Please make it extra spicy',
    totalAmount: 12.99 * 3,
    date: new Date(),
  },
  {
    id: '2',
    items: [
      {
        menuItemId: '1',
        name: 'Crispy Calamari',
        price: 12.99,
        quantity: 3,
      },
    ],
    status: 'Completed',
    customerName: 'Customer name',
    customerPhone: `555-012812`,
    specialInstructions: 'Please make it extra spicy',
    totalAmount: 12.99 * 3,
    date: new Date(),
  },
  {
    id: '2',
    items: [
      {
        menuItemId: '1',
        name: 'Crispy Calamari',
        price: 12.99,
        quantity: 3,
      },
    ],
    status: 'Cancelled',
    customerName: 'Customer name',
    customerPhone: `555-012812`,
    specialInstructions: 'Please make it extra spicy',
    totalAmount: 12.99 * 3,
    date: new Date(),
  },
];

function RouteComponent() {
  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <div className='flex flex-col items-start justify-between sm:flex-row'>
        <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
          Order Management
        </h3>
      </div>

      <div>
        <Tabs defaultValue='pending' className='w-full'>
          <TabsList>
            <TabsTrigger className='px-5' value='pending'>
              Pending ({orders.filter((order) => order.status === 'Pending').length})
            </TabsTrigger>
            <TabsTrigger className='px-5' value='preparing'>
              Preparing ({orders.filter((order) => order.status === 'Preparing').length})
            </TabsTrigger>
            <TabsTrigger className='px-5' value='ready'>
              Ready ({orders.filter((order) => order.status === 'Ready').length})
            </TabsTrigger>
            <TabsTrigger className='px-5' value='completed'>
              Completed ({orders.filter((order) => order.status === 'Completed').length})
            </TabsTrigger>
            <TabsTrigger className='px-5' value='cancelled'>
              Cancelled ({orders.filter((order) => order.status === 'Cancelled').length})
            </TabsTrigger>
            <TabsTrigger className='px-5' value='allorders'>
              All Orders
            </TabsTrigger>
          </TabsList>
          <TabsContent value='pending'>
            <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              {orders.map(
                (order) => order.status === 'Pending' && <OrderCard key={order.id} order={order} />,
              )}
            </div>
          </TabsContent>
          <TabsContent value='preparing'>
            <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              {orders.map(
                (order) =>
                  order.status === 'Preparing' && <OrderCard key={order.id} order={order} />,
              )}
            </div>
          </TabsContent>
          <TabsContent value='ready'>
            <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              {orders.map(
                (order) => order.status === 'Ready' && <OrderCard key={order.id} order={order} />,
              )}
            </div>
          </TabsContent>
          <TabsContent value='completed'>
            <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              {orders.map(
                (order) =>
                  order.status === 'Completed' && <OrderCard key={order.id} order={order} />,
              )}
            </div>
          </TabsContent>
          <TabsContent value='cancelled'>
            <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              {orders.map(
                (order) =>
                  order.status === 'Cancelled' && <OrderCard key={order.id} order={order} />,
              )}
            </div>
          </TabsContent>
          <TabsContent value='allorders'>
            <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

type OrderItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

type Order = {
  id: string;
  items: OrderItem[];
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  specialInstructions: string;
  totalAmount: number;
  date: Date;
};

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Preparing':
        return 'bg-blue-100 text-blue-800';
      case 'Ready':
        return 'bg-orange-100 text-orange-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return {
          label: 'Pending',
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className='mr-1 h-5 w-5' />,
          nextAction: 'preparing',
          nextLabel: 'Start Preparing',
          cancelable: true,
        };
      case 'Preparing':
        return {
          label: 'Preparing',
          color: 'bg-blue-100 text-blue-800',
          icon: <Coffee className='mr-1 h-5 w-5' />,
          nextAction: 'ready',
          nextLabel: 'Mark as Ready',
          cancelable: true,
        };
      case 'Ready':
        return {
          label: 'Ready',
          color: 'bg-orange-100 text-orange-800',
          icon: <Check className='mr-1 h-5 w-5' />,
          nextAction: 'completed',
          nextLabel: 'Complete Order',
          cancelable: true,
        };
      case 'Completed':
        return {
          label: 'Completed',
          color: 'bg-green-100 text-green-800',
          icon: <Check className='mr-1 h-5 w-5' />,
          nextAction: null,
          nextLabel: null,
          cancelable: false,
        };
      case 'Cancelled':
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

  const statusInfo = getStatusInfo(order.status);

  const handleUpdateStatus = (status: OrderStatus) => {
    console.log(status);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='cursor-pointer overflow-hidden rounded-lg border bg-indigo-50 shadow transition-shadow hover:shadow-md'>
          <div className='p-4'>
            <div className='mb-2 flex items-center justify-between'>
              <div className='flex items-center'>
                <span className='mr-3 text-lg font-semibold text-gray-900'>
                  Order #{order.id.slice(-4)}
                </span>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${getStatusClasses(order.status)}`}
                >
                  {order.status}
                </span>
              </div>
              <span className='text-sm text-gray-500'>{format(order.date, 'MMM d, h:mm a')}</span>
            </div>

            <div className='mt-2'>
              <h3 className='text-sm font-medium text-gray-900'>{order.customerName}</h3>
              <p className='text-sm text-gray-500'>{order.customerPhone}</p>
            </div>

            <div className='mt-3 border-t border-gray-200 pt-3'>
              <div className='flex justify-between text-sm'>
                <span className='font-semibold text-gray-900'>{order.items.length} items</span>
                <span className='font-medium text-gray-900'>${order.totalAmount.toFixed(2)}</span>
              </div>

              <div className='mt-2'>
                <ul className='text-xs font-semibold text-gray-500'>
                  {order.items.slice(0, 2).map((item, index) => (
                    <li key={index} className='truncate'>
                      {item.quantity}x {item.name}
                    </li>
                  ))}
                  {order.items.length > 2 && <li>+{order.items.length - 2} more items</li>}
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
            <p>Order#{order.id}</p>
            <div
              className={`mr-5 flex items-center rounded-full px-2 py-1 text-xs leading-5 font-semibold ${statusInfo.color}`}
            >
              {statusInfo.icon}
              {statusInfo.label}
            </div>
          </DialogTitle>
          <DialogDescription>
            Placed on{' '}
            {format(new Date(order.date), 'MMMM d, yyyy') +
              ' at ' +
              format(new Date(order.date), 'h:mm a')}
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className='mb-6'>
            <h4 className='mb-2 text-sm font-medium text-gray-900'>Customer Information</h4>
            <div className='rounded-md bg-gray-50 p-3'>
              <p className='text-sm font-medium text-gray-700'>{order.customerName}</p>
              <p className='text-sm text-gray-500'>{order.customerPhone}</p>
            </div>
          </div>

          <div className='mb-6'>
            <h4 className='mb-2 text-sm font-medium text-gray-900'>Order Items</h4>
            <div className='rounded-md bg-gray-50 p-3'>
              <ul className='divide-y divide-gray-200'>
                {order.items.map((item, index) => (
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
                  <span className='text-sm text-gray-900'>${order.totalAmount.toFixed(2)}</span>
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
              <button
                type='button'
                onClick={() => handleUpdateStatus(statusInfo.nextAction as OrderStatus)}
                className={`flex w-full items-center justify-center rounded-sm py-1.5 font-semibold ${statusInfo.color}`}
              >
                {statusInfo.nextLabel}
                <ChevronRight className='ml-1 h-4 w-4' />
              </button>
            )}

            {statusInfo.cancelable && (
              <button
                type='button'
                onClick={() => handleUpdateStatus('Cancelled')}
                className='w-full rounded-sm bg-red-100 py-1.5 font-semibold text-red-500'
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

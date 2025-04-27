import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { getPendingDeliveries } from '@/data/delivery-data';
import { DeliveryOrder, DeliveryStatus } from '@/types/delivery';
import { OrderStatus } from '@/types/cart';

// Mock current driver ID - in a real app this would come from authentication
const CURRENT_DRIVER_ID = 'driver-001';

export default function DeliveryList() {
  const [availableDeliveries, setAvailableDeliveries] = useState<DeliveryOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Only get pending deliveries that are paid - these are available for acceptance
    const pendingPaidDeliveries = getPendingDeliveries().filter((delivery) => delivery.isPaid);
    setAvailableDeliveries(pendingPaidDeliveries);
  }, []);

  const handleAcceptDelivery = (delivery: DeliveryOrder) => {
    // In a real app, this would make an API call
    // For now, we'll just update the local state
    setAvailableDeliveries((prev) =>
      prev.map((d) =>
        d.id === delivery.id
          ? {
              ...d,
              status: DeliveryStatus.ACCEPTED,
              acceptedAt: new Date(),
              deliveryPersonId: CURRENT_DRIVER_ID,
            }
          : d,
      ),
    );
  };

  const handleStartDelivery = (delivery: DeliveryOrder) => {
    // In a real app, this would make an API call
    setAvailableDeliveries((prev) =>
      prev.map((d) =>
        d.id === delivery.id
          ? { ...d, status: DeliveryStatus.IN_TRANSIT, orderStatus: OrderStatus.OUT_FOR_DELIVERY }
          : d,
      ),
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case DeliveryStatus.PENDING:
        return (
          <Badge variant='outline' className='bg-yellow-100 text-yellow-800'>
            Pending to Deliver
          </Badge>
        );
      case DeliveryStatus.ACCEPTED:
        return (
          <Badge variant='outline' className='bg-blue-100 text-blue-800'>
           Delivery Accepted
          </Badge>
        );
      case DeliveryStatus.IN_TRANSIT:
        return (
          <Badge variant='outline' className='bg-purple-100 text-purple-800'>
            Delivery In Transit
          </Badge>
        );
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  const handleViewDetails = (delivery: DeliveryOrder) => {
    setSelectedOrder(delivery);
    setDetailsOpen(true);
  };

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>Available Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          {availableDeliveries.length === 0 ? (
            <p className='text-muted-foreground py-6 text-center'>No deliveries available</p>
          ) : (
            <div className='space-y-4'>
              {availableDeliveries.map((delivery) => (
                <Card key={delivery.id} className='p-4 transition-shadow hover:shadow-md'>
                  <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
                    <div>
                      <div className='mb-2 flex items-center gap-2'>
                        <h3 className='font-semibold'>{delivery.restaurant.name}</h3>
                        {getStatusBadge(delivery.status)}
                      </div>
                      <p className='text-muted-foreground mb-1 text-sm'>
                        Order #{delivery.orderId}
                      </p>
                      <p className='mb-1 text-sm'>
                        <span className='font-medium'>Drop-off:</span>{' '}
                        {delivery.dropLocation.address}
                      </p>
                      <p className='text-sm'>
                        <span className='font-medium'>Items:</span>{' '}
                        {delivery.orderItems
                          .map((item) => `${item.quantity}x ${item.name}`)
                          .join(', ')}
                      </p>
                      <div className='mt-2'>
                        <p className='text-sm'>
                          <span className='font-medium'>Total:</span>{' '}
                          {formatCurrency(delivery.total)}
                        </p>
                      </div>
                    </div>

                    <div className='flex flex-row gap-2 md:flex-col'>
                      {delivery.status === DeliveryStatus.PENDING && (
                        <Button
                          onClick={() => handleAcceptDelivery(delivery)}
                          className='bg-green-600 text-white hover:bg-green-700'
                        >
                          Accept
                        </Button>
                      )}

                      {delivery.status === DeliveryStatus.ACCEPTED &&
                        delivery.deliveryPersonId === CURRENT_DRIVER_ID && (
                          <Button
                            onClick={() => handleStartDelivery(delivery)}
                            className='bg-blue-600 text-white hover:bg-blue-700'
                          >
                            Start Delivery
                          </Button>
                        )}

                      <Button variant='outline' onClick={() => handleViewDetails(delivery)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>{selectedOrder.restaurant.name}</h3>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div className='space-y-2'>
                <p className='text-sm'>
                  <span className='font-medium'>Order ID:</span> #{selectedOrder.orderId}
                </p>
                <p className='text-sm'>
                  <span className='font-medium'>Created:</span>{' '}
                  {formatDate(selectedOrder.createdAt)}
                </p>
                {selectedOrder.acceptedAt && (
                  <p className='text-sm'>
                    <span className='font-medium'>Accepted:</span>{' '}
                    {formatDate(selectedOrder.acceptedAt)}
                  </p>
                )}
                <p className='text-sm'>
                  <span className='font-medium'>Customer:</span> {selectedOrder.customer.name}
                </p>
                <p className='text-sm'>
                  <span className='font-medium'>Phone:</span> {selectedOrder.customer.phone}
                </p>
                <p className='text-sm'>
                  <span className='font-medium'>Pickup:</span> {selectedOrder.restaurant.address}
                </p>
                <p className='text-sm'>
                  <span className='font-medium'>Delivery:</span>{' '}
                  {selectedOrder.dropLocation.address}
                </p>
                <p className='text-sm'>
                  <span className='font-medium'>Payment Method:</span>{' '}
                  {selectedOrder.paymentMethod?.replace('_', ' ')}
                </p>
                <div className='pt-2'>
                  <h4 className='font-medium'>Order Items:</h4>
                  <ul className='space-y-1 pt-1'>
                    {selectedOrder.orderItems.map((item) => (
                      <li key={item.itemId} className='text-sm'>
                        {item.quantity}x {item.name} ({formatCurrency(item.price)})
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='flex justify-between pt-2'>
                  <p className='text-sm'>
                    <span className='font-medium'>Delivery Fee:</span>{' '}
                    {formatCurrency(selectedOrder.deliveryFee)}
                  </p>
                  <p className='text-lg font-bold'>Total: {formatCurrency(selectedOrder.total)}</p>
                </div>
              </div>
              <div className='flex justify-end pt-2'>
                <DialogClose asChild>
                  <Button variant='outline'>Close</Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

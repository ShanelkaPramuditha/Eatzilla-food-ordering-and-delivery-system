import { useCartStore } from '@/store/cart.store';
import { useOrderStore } from '@/store/order.store';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, ArrowRight, Home, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const Route = createFileRoute('/_auth/_customer/checkout/pay/return')({
  component: RouteComponent,
});

function RouteComponent() {
  const orderData = useOrderStore((state) => state);
  const [status, setStatus] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const { resetOrder } = useOrderStore();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      fetch(`/session-status?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
          setCustomerEmail(data.customer_email || 'your email address');
          setIsLoading(false);

          if (data.status === 'complete') {
            clearCart();
            resetOrder();
          }
        })
        .catch(() => {
          // For demo purposes, set to complete if API fails
          setStatus('complete');
          setCustomerEmail('your email address');
          setIsLoading(false);
          clearCart();
          resetOrder();
        });
    } else {
      // Redirect to checkout if no session id
      navigate({ to: '/checkout', replace: true });
    }
  }, [navigate, clearCart, resetOrder]);

  if (isLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <div className='mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-green-600'></div>
        <p className='ml-3 text-lg'>Verifying payment status...</p>
      </div>
    );
  }

  if (status === 'open') {
    navigate({ to: '/checkout', replace: true });
    return null;
  }

  if (status === 'complete') {
    const orderNumber = Math.floor(100000 + Math.random() * 900000); // Generate a random order number for demo

    return (
      <div className='mx-auto w-full max-w-4xl'>
        <Card className='overflow-hidden shadow-md'>
          <div className='bg-green-600 p-6 text-center text-white'>
            <CheckCircle className='mx-auto mb-4 h-16 w-16' />
            <h1 className='text-3xl font-bold'>Order Confirmed!</h1>
            <p className='mt-2 text-lg opacity-90'>Your order has been successfully placed</p>
          </div>

          <CardContent className='p-6 md:p-8'>
            <div className='mb-6 flex items-start rounded-lg border border-green-200 bg-green-50 p-4'>
              <div className='mt-1 mr-3'>
                <Clock className='h-5 w-5 text-green-600' />
              </div>
              <div>
                <p className='font-medium'>Estimated delivery time: 30-45 minutes</p>
                <p className='mt-1 text-sm text-gray-600'>
                  You&apos;ll receive updates about your order status via email and notifications
                </p>
              </div>
            </div>

            <div className='mb-6'>
              <h2 className='mb-4 text-xl font-bold'>Order Details</h2>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p className='text-gray-600'>Order Number</p>
                  <p className='font-medium'>#{orderNumber}</p>
                </div>
                <div>
                  <p className='text-gray-600'>Date</p>
                  <p className='font-medium'>{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className='text-gray-600'>Email</p>
                  <p className='font-medium'>{customerEmail}</p>
                </div>
                <div>
                  <p className='text-gray-600'>Payment Method</p>
                  <p className='font-medium'>Credit Card</p>
                </div>
              </div>
            </div>

            <div className='mb-6 border-t border-gray-200 pt-6'>
              <h2 className='mb-4 text-xl font-bold'>Delivery Information</h2>
              <p className='font-medium'>
                {orderData.deliveryAddress?.street || '123 Main Street'},{' '}
                {orderData.deliveryAddress?.city || 'City'},{' '}
                {orderData.deliveryAddress?.state || 'State'}{' '}
                {orderData.deliveryAddress?.postalCode || '12345'}
              </p>
              {orderData.deliveryAddress?.instructions && (
                <div className='mt-2'>
                  <p className='text-sm text-gray-600'>Delivery Instructions:</p>
                  <p className='text-sm'>{orderData.deliveryAddress.instructions}</p>
                </div>
              )}
            </div>

            {orderData.specialInstructions && (
              <div className='mb-6 border-t border-gray-200 pt-6'>
                <h2 className='mb-4 text-xl font-bold'>Special Instructions</h2>
                <p>{orderData.specialInstructions}</p>
              </div>
            )}

            <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
              <Button
                className='flex-1 gap-2'
                onClick={() => navigate({ to: '/orders', replace: true })}
              >
                Track Your Order <ArrowRight className='h-4 w-4' />
              </Button>

              <Button
                variant='outline'
                className='flex-1 gap-2'
                onClick={() => navigate({ to: '/', replace: true })}
              >
                <Home className='h-4 w-4' /> Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error or unknown status
  return (
    <div className='mx-auto w-full max-w-2xl'>
      <Card className='overflow-hidden shadow-md'>
        <div className='bg-red-600 p-6 text-center text-white'>
          <AlertCircle className='mx-auto mb-4 h-16 w-16' />
          <h1 className='text-2xl font-bold'>Payment Issue</h1>
          <p className='mt-2'>We encountered a problem with your payment</p>
        </div>

        <CardContent className='p-6'>
          <p className='mb-6'>
            There seems to be an issue with your payment. Your order has not been confirmed. Please
            try again or contact customer support for assistance.
          </p>

          <div className='flex flex-col gap-4 sm:flex-row'>
            <Button onClick={() => navigate({ to: '/checkout', replace: true })} className='flex-1'>
              Try Again
            </Button>

            <Button
              variant='outline'
              onClick={() => navigate({ to: '/', replace: true })}
              className='flex-1'
            >
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useCallback, useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart.store';
import { formatCurrency } from '@/utils/common-utils';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const Route = createFileRoute('/_auth/_customer/checkout/pay/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { cart, cartTotal } = useCartStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const deliveryFee = 3.99;
  const taxRate = 0.08;
  const tax = cartTotal * taxRate;
  const total = cartTotal + deliveryFee + tax;

  useEffect(() => {
    // Simulate loading of payment form
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Fetch client secret from the server
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch('http://localhost:3000/api/payment/checkout', {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  return (
    <div className='flex w-full flex-col'>
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            className='flex items-center gap-2'
            onClick={() => navigate({ to: '/checkout' })}
          >
            <ArrowLeft className='h-4 w-4' />
            Back to checkout
          </Button>
        </div>
        <div className='flex items-center gap-2'>
          <ShoppingBag className='h-5 w-5 text-green-600' />
          <span className='text-lg font-bold'>Complete Payment</span>
        </div>
      </div>

      <div className='flex w-full flex-col gap-8 lg:flex-row'>
        {/* Order summary section */}
        <div className='order-2 w-full lg:order-1 lg:w-1/3'>
          <Card className='shadow-md'>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='mb-4 max-h-[300px] overflow-y-auto'>
                {cart.map((item, index) => (
                  <div key={index} className='flex gap-3 border-b py-3'>
                    <div className='flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 font-medium'>
                      {item.quantity}
                    </div>
                    <div className='flex-1'>
                      <p className='font-medium'>{item.name}</p>
                      <p className='text-sm text-gray-500'>
                        {item.customizations && Object.values(item.customizations).join(', ')}
                      </p>
                    </div>
                    <div className='font-medium'>{formatCurrency(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className='space-y-2 pt-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Delivery Fee</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className='mt-2 border-t pt-2'></div>
                <div className='flex justify-between font-bold'>
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment form section */}
        <div className='order-1 w-full lg:order-2 lg:w-2/3'>
          <Card className='shadow-md'>
            <CardHeader>
              <CardTitle>Complete your payment</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className='flex h-96 items-center justify-center'>
                  <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-green-600'></div>
                </div>
              ) : (
                <div id='checkout' className='min-h-[500px]'>
                  {/* Stripe checkout - styles are applied through the server */}
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{
                      fetchClientSecret,
                    }}
                  >
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                </div>
              )}

              <div className='mt-6 text-sm text-gray-500'>
                <p>
                  Your payment is securely processed by Stripe. We do not store your card details.
                </p>
                <p className='mt-2'>
                  By completing this payment, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

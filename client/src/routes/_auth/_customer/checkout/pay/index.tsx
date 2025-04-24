import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart.store';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetStripeClientSecret } from '@/services/tanstack-hooks/payment';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const Route = createFileRoute('/_auth/_customer/checkout/pay/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { cartTotal } = useCartStore();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const { mutateAsync: getStripeClientSecret, isPending: isLoading } = useGetStripeClientSecret();

  // Fetch client secret once when component mounts
  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const response = await getStripeClientSecret({
          currency: 'lkr',
          unit_amount: cartTotal || 1,
        });
        const secret = (response as { client_secret: string }).client_secret;
        setClientSecret(secret);
      } catch (error) {
        console.error('Failed to fetch client secret:', error);
      }
    };

    fetchSecret();
  }, [getStripeClientSecret, cartTotal]);

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
        {/* Payment form section */}
        <div className='order-1 w-full lg:order-2'>
          <Card className='border-0 shadow-none'>
            <CardContent>
              {isLoading || !clientSecret ? (
                <div className='flex h-96 items-center justify-center'>
                  <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-green-600'></div>
                </div>
              ) : (
                <div id='checkout' className='min-h-[500px]'>
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                    }}
                  >
                    <EmbeddedCheckout className='w-full' />
                  </EmbeddedCheckoutProvider>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart.store';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetStripeClientSecret } from '@/services/tanstack-hooks/payment';
import { CheckoutPayload } from '@/types/payment';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const Route = createFileRoute('/_auth/_customer/checkout/pay/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { cart, cartTotal } = useCartStore();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const { mutateAsync: getStripeClientSecret, isPending: isLoading } = useGetStripeClientSecret();

  // Prepare checkout data from cart
  // TODO: Need to handle with order data
  const prepareCheckoutData = (): CheckoutPayload[] => {
    // Safely check if cart exists and has items
    if (!cart || cart.length === 0) {
      console.log('Cart is empty, will redirect to cart page');
      return [];
    }

    console.log('Preparing checkout data with cart items:', cart);

    // Map each cart item to a CheckoutPayload
    return cart.map((item) => ({
      paymentType: 'card',
      currencyType: 'lkr',
      unit_amount: Math.round(item.price * 10000), // Convert to cents for Stripe
      quantity: item.quantity,
      orderId: `order_${Date.now()}_${item.menuItemId}`,
      customerId: 'customer_id', // Should come from auth context
      customerEmail: 'customer@example.com', // Should come from auth context
      customerName: 'Customer Name', // Should come from auth context
      productId: item.menuItemId,
      productName: item.name,
      productDescription: `${item.name} x ${item.quantity}${item.customizations ? ' (with customizations)' : ''}`,
      productImages: item.image ? [item.image] : [],
      metadata: {
        restaurantId: item.restaurantId,
        customizations: item.customizations ? JSON.stringify(item.customizations) : undefined,
      },
    }));
  };

  // Redirect to cart if empty
  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate({ to: '/' });
    }
  }, [cart, navigate]);

  // Fetch client secret once when component mounts
  useEffect(() => {
    const fetchSecret = async () => {
      try {
        // Check if cart has items before proceeding
        if (!cart || cart.length === 0) {
          return; // Don't try to fetch if cart is empty
        }

        const checkoutData = prepareCheckoutData();
        if (checkoutData.length === 0) {
          console.log('No checkout data prepared, skipping API call');
          return;
        }

        console.log('Sending checkout data to API:', checkoutData);
        const response = await getStripeClientSecret(checkoutData);
        console.log('API response:', response);

        if (response && typeof response === 'object' && 'client_secret' in response) {
          const secret = response.client_secret as string;
          setClientSecret(secret);
        } else {
          console.error('Invalid response format from API:', response);
        }
      } catch (error) {
        console.error('Failed to fetch client secret:', error);
      }
    };

    fetchSecret();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getStripeClientSecret, cart, cartTotal]);

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

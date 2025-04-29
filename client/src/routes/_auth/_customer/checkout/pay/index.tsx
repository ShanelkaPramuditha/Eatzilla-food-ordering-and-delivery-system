import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutProvider } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetStripeClientSecret } from '@/services/tanstack-hooks/payment';
import { CheckoutPayload } from '@/types/payment';
import { useGetOrderById } from '@/services/tanstack-hooks/order';
import CheckoutForm from './-checkout-form';
import { useTheme } from 'next-themes';
import { SummaryList } from './-summary-list';
import { Order } from '@/types/order';
import { IconHome } from '@tabler/icons-react';
import { useGetUser } from '@/services/tanstack-hooks/auth.hook';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const Route = createFileRoute('/_auth/_customer/checkout/pay/')({
  validateSearch: (search) => {
    return {
      orderId: search.orderId || null,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const themeObj = useTheme();
  const [theme, setTheme] = useState(themeObj.theme);

  const { data: user } = useGetUser();

  const { orderId } = Route.useSearch();
  const navigate = useNavigate();

  // Redirect to home if orderId is not present
  useEffect(() => {
    if (!orderId) {
      navigate({ to: '/' });
    }
  }, [orderId, navigate]);

  const { data: orderData, status } = useGetOrderById(orderId as string);

  // Redirect to home if order data is not found or status is not pending
  useEffect(() => {
    if (status === 'success') {
      if (!orderData) {
        navigate({ to: '/' });
        return;
      }
    }
  }, [orderData, status, navigate]);

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const { mutateAsync: getStripeClientSecret, isPending: isLoading } = useGetStripeClientSecret();

  // Prepare checkout data from order data
  const prepareCheckoutData = (): CheckoutPayload => {
    if (!orderData) {
      return null as unknown as CheckoutPayload;
    }

    const products = orderData.suborders.flatMap((restaurant) =>
      restaurant.items.map((item) => ({
        productId: item.menuItemId,
        productName: item.name,
        unit_amount: Math.round(item.price * 100), // Convert to cents for Stripe
        quantity: item.quantity,
        productDescription: `${item.name} x ${item.quantity}${item.customizations ? ' (with customizations)' : ''}`,
        productImages: [],
      })),
    );

    const data: CheckoutPayload = {
      customerId: user?.id as string,
      orderId: orderId as string,
      paymentType: 'card',
      currencyType: orderData.currency || 'lkr',
      customerEmail: user?.email as string,
      customerName: user?.name as string,
      deliveryFee: orderData.deliveryFee ? Math.round(orderData.deliveryFee * 100) : 10000,
      products: products,
    };

    return data;
  };

  // Fetch client secret once when component mounts
  useEffect(() => {
    const fetchSecret = async () => {
      try {
        // Check if order data exists before proceeding
        if (!orderData) {
          return;
        }

        const checkoutData = prepareCheckoutData();
        if (!checkoutData) {
          return;
        }

        const response = await getStripeClientSecret(checkoutData);

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
  }, [getStripeClientSecret, orderData]);

  // Convert fetchClientSecret to return a Promise<string> as required by Stripe
  const fetchClientSecret = async () => {
    if (!clientSecret) {
      throw new Error('Client secret not available');
    }
    return clientSecret;
  };

  useEffect(() => {
    if (themeObj.theme === 'dark') {
      setTheme('dark');
    }
    if (themeObj.theme === 'light') {
      setTheme('light');
    }
    if (themeObj.theme === 'system') {
      setTheme(themeObj.systemTheme);
    }
  }, [themeObj.theme, themeObj.systemTheme]);

  if (isLoading || !clientSecret || status === 'pending') {
    return (
      <div className='flex h-screen w-screen items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-green-600'></div>
      </div>
    );
  }

  return (
    <div className='mx-auto flex w-full max-w-7xl flex-col p-4'>
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
            onClick={() => navigate({ to: '/' })}
          >
            <IconHome className='h-4 w-4' />
            Pay Later
          </Button>
        </div>
        <div className='flex items-center gap-2'>
          <ShoppingBag className='h-5 w-5 text-green-600' />
          <span className='text-lg font-bold'>Complete Payment</span>
        </div>
      </div>

      <div className='flex w-full flex-col gap-8 lg:flex-row'>
        {/* Order summary section */}
        <div className='order-2 w-full lg:order-1'>
          <SummaryList orderData={orderData as Order} />
        </div>

        {/* Payment form section */}
        <div className='order-1 w-full lg:order-1'>
          <Card className='border-0 shadow-none'>
            <CardContent>
              {isLoading || !clientSecret ? (
                <div className='flex h-96 items-center justify-center'>
                  <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-green-600'></div>
                </div>
              ) : (
                <div id='checkout' className='mx-auto min-h-[500px] max-w-lg'>
                  <CheckoutProvider
                    stripe={stripePromise}
                    options={{
                      fetchClientSecret,
                      elementsOptions: {
                        appearance: {
                          theme: 'stripe',
                          variables: {
                            colorPrimary: theme === 'dark' ? '#fff' : '#000',
                            colorBackground: theme === 'dark' ? '#000' : '#fff',
                            colorText: theme === 'dark' ? '#fff' : '#000',
                            colorDanger: '#df1b41',
                            fontFamily: 'Ideal Sans, system-ui, sans-serif',
                            spacingUnit: '6px',
                            borderRadius: '10px',
                            fontSizeBase: '16px',
                            fontSmooth: 'antialiased',
                          },
                        },
                      },
                    }}
                  >
                    <CheckoutForm />
                  </CheckoutProvider>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

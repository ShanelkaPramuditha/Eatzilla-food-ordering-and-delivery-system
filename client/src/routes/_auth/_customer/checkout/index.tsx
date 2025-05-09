'use client';

import { createFileRoute, useRouter } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useCartStore } from '@/store/cart.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/utils/common-utils';
import { toast } from 'sonner';
import {
  AlertCircle,
  MapPin,
  CreditCard,
  DollarSign,
  Phone,
  Home,
  Info,
  ShoppingBag,
  Truck,
  Clock,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { checkoutFormSchema, type CheckoutFormValues } from '@/schemas/checkout.schema';
import OrderService from '@/services/order.service';
import { OrderSummary } from '@/routes/_auth/_customer/checkout/-order-summary';
import { MapLocationPicker } from './-map-location-picker';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const Route = createFileRoute('/_auth/_customer/checkout/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { cart, cartTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [showMap, setShowMap] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        instructions: '',
        longitude: undefined,
        latitude: undefined,
      },
      phoneNumber: '',
      payment: 'card',
      specialInstructions: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    try {
      await OrderService.createOrder(
        cart,
        data.address,
        data.payment,
        data.specialInstructions,
        data.phoneNumber,
      )
        .then((res) => {
          router.navigate({
            to: `/checkout/pay`,
            search: { orderId: res._id },
          });
        })
        .finally(() => {
          clearCart();
          setIsSubmitting(false);
        });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    // Parse address components
    const addressParts = location.address.split(',');

    // Extract street, city, state, and postal code from the address
    const street = addressParts[0]?.trim() || '';
    const city = addressParts[1]?.trim() || '';
    const stateAndZip = addressParts[2]?.trim() || '';

    // Parse state and zip
    let state = '';
    let postalCode = '';

    if (stateAndZip) {
      const stateZipParts = stateAndZip.split(' ');
      state = stateZipParts[0] || '';
      postalCode = stateZipParts[1] || '';
    }

    // Update form values
    form.setValue('address.street', street);
    form.setValue('address.city', city);
    form.setValue('address.state', state);
    form.setValue('address.postalCode', postalCode);
    form.setValue('address.latitude', location.lat.toString());
    form.setValue('address.longitude', location.lng.toString());

    // Hide map after selection
    setShowMap(false);
  };

  const deliveryFee = 100;
  const taxRate = 0.08;
  const tax = taxRate * cartTotal;
  const total = cartTotal + deliveryFee;
  const estimatedDeliveryTime = '30-45 min';

  if (cart.length === 0) {
    return (
      <div className='container mx-auto flex min-h-[60vh] items-center justify-center bg-slate-50 py-8 dark:bg-slate-900'>
        <Card className='w-full max-w-md border-blue-200 shadow-lg dark:border-blue-800'>
          <CardHeader className='rounded-t-lg bg-gradient-to-r from-blue-50 to-blue-100 text-center dark:from-blue-900/30 dark:to-blue-800/30'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-blue-800 dark:text-blue-300'>Your Cart is Empty</CardTitle>
            </div>
          </CardHeader>
          <CardContent className='flex flex-col items-center pt-8 pb-6'>
            <div className='mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40'>
              <ShoppingBag className='h-10 w-10 text-blue-500 dark:text-blue-400' />
            </div>
            <p className='mb-6 text-center text-slate-600 dark:text-slate-400'>
              You haven&apos;t added any items to your cart yet.
            </p>
            <Button
              onClick={() => router.navigate({ to: '/menu' })}
              className='bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
            >
              Browse Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full bg-slate-50 px-10 py-8 dark:bg-slate-900'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Checkout</h1>
          <p className='mt-1 text-slate-600 dark:text-slate-400'>
            Complete your order details below
          </p>
        </div>
      </div>

      <FormProvider {...form}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.error('Form validation errors:', errors);
              toast.error('Please fix the form errors before submitting');

              if (Object.keys(errors).length > 0) {
                const firstErrorField = Object.keys(errors)[0];
                const firstErrorMessage = (
                  errors[firstErrorField as keyof typeof errors] as { message?: string }
                )?.message;

                if (firstErrorMessage) {
                  toast.error(`${firstErrorMessage}`);
                }
              }
            })}
            className='grid grid-cols-1 gap-8 lg:grid-cols-3'
          >
            {/* Order Details */}
            <div className='lg:col-span-2'>
              {/* Delivery Address */}
              <Card className='mb-8 overflow-hidden border-blue-200 shadow-md dark:border-blue-800'>
                <CardHeader className='border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 dark:border-blue-800/50 dark:from-blue-900/30 dark:to-blue-800/30'>
                  <CardTitle className='flex items-center text-blue-800 dark:text-blue-300'>
                    <MapPin className='mr-2 h-5 w-5 text-blue-600 dark:text-blue-400' />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-6 pb-4'>
                  <div className='grid gap-5'>
                    <div className='flex items-center justify-between'>
                      <Button
                        type='button'
                        onClick={() => setShowMap(!showMap)}
                        className='mb-2 flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                      >
                        <MapPin className='h-4 w-4' />
                        {showMap ? 'Hide Map' : 'Select Location on Map'}
                      </Button>

                      {/* Hidden fields for latitude and longitude */}
                      <input type='hidden' {...form.register('address.latitude')} />
                      <input type='hidden' {...form.register('address.longitude')} />

                      {form.getValues('address.latitude') &&
                        form.getValues('address.longitude') && (
                          <Badge
                            variant='outline'
                            className='border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/50 dark:bg-blue-900/40 dark:text-blue-300'
                          >
                            Location Selected
                            <CheckCircle2 className='ml-1 h-3 w-3' />
                          </Badge>
                        )}
                    </div>

                    {showMap && (
                      <div className='mb-2 overflow-hidden rounded-lg border-2 border-blue-200 shadow-sm dark:border-blue-800/50'>
                        <MapLocationPicker
                          onLocationSelect={handleLocationSelect}
                          defaultLocation={
                            form.getValues('address.latitude') &&
                            form.getValues('address.longitude')
                              ? {
                                  lat: Number.parseFloat(
                                    form.getValues('address.latitude') as string,
                                  ),
                                  lng: Number.parseFloat(
                                    form.getValues('address.longitude') as string,
                                  ),
                                }
                              : undefined
                          }
                        />
                      </div>
                    )}

                    <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name='address.street'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center text-blue-700 dark:text-blue-400'>
                              <Home className='mr-1 h-4 w-4' />
                              Street Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='123 Main St'
                                {...field}
                                className='border-blue-200 focus:border-blue-400 dark:border-blue-800/50 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-600'
                              />
                            </FormControl>
                            <FormMessage className='text-red-500' />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='phoneNumber'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center text-blue-700 dark:text-blue-400'>
                              <Phone className='mr-1 h-4 w-4' />
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='(123) 456-7890'
                                {...field}
                                className='border-blue-200 focus:border-blue-400 dark:border-blue-800/50 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-600'
                              />
                            </FormControl>
                            <FormMessage className='text-red-500' />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-3 gap-5'>
                      <FormField
                        control={form.control}
                        name='address.city'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-blue-700 dark:text-blue-400'>City</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='New York'
                                {...field}
                                className='border-blue-200 focus:border-blue-400 dark:border-blue-800/50 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-600'
                              />
                            </FormControl>
                            <FormMessage className='text-red-500' />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='address.state'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-blue-700 dark:text-blue-400'>
                              State
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='NY'
                                {...field}
                                className='border-blue-200 focus:border-blue-400 dark:border-blue-800/50 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-600'
                              />
                            </FormControl>
                            <FormMessage className='text-red-500' />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='address.postalCode'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-blue-700 dark:text-blue-400'>
                              Postal Code
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='10001'
                                {...field}
                                className='border-blue-200 focus:border-blue-400 dark:border-blue-800/50 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-600'
                              />
                            </FormControl>
                            <FormMessage className='text-red-500' />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name='address.instructions'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center text-blue-700 dark:text-blue-400'>
                            <Info className='mr-1 h-4 w-4' />
                            Delivery Instructions (Optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Gate code, building instructions, etc.'
                              {...field}
                              className='min-h-[80px] border-blue-200 focus:border-blue-400 dark:border-blue-800/50 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-600'
                            />
                          </FormControl>
                          <FormMessage className='text-red-500' />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Special Instructions */}
              <Card className='mb-8 overflow-hidden border-blue-200 shadow-md dark:border-blue-800'>
                <CardHeader className='border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 dark:border-blue-800/50 dark:from-blue-900/30 dark:to-blue-800/30'>
                  <CardTitle className='flex items-center text-blue-800 dark:text-blue-300'>
                    <Info className='mr-2 h-5 w-5 text-blue-600 dark:text-blue-400' />
                    Special Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-6'>
                  <FormField
                    control={form.control}
                    name='specialInstructions'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder='Any special requests for your order?'
                            className='min-h-[100px] border-blue-200 focus:border-blue-400 dark:border-blue-800/50 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-600'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-red-500' />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className='sticky top-20 overflow-hidden border-blue-200 shadow-lg dark:border-blue-800'>
                <CardHeader className='border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 dark:border-blue-800/50 dark:from-blue-900/30 dark:to-blue-800/30'>
                  <CardTitle className='flex items-center text-blue-800 dark:text-blue-300'>
                    <ShoppingBag className='mr-2 h-5 w-5 text-blue-600 dark:text-blue-400' />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-6'>
                  <div className='mb-4 flex items-center justify-between'>
                    <Badge
                      variant='outline'
                      className='flex items-center border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/50 dark:bg-blue-900/40 dark:text-blue-300'
                    >
                      <Clock className='mr-1 h-3 w-3' />
                      Estimated Delivery: {estimatedDeliveryTime}
                    </Badge>
                    <Badge
                      variant='outline'
                      className='border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/50 dark:bg-blue-900/40 dark:text-blue-300'
                    >
                      {cart.length} {cart.length === 1 ? 'item' : 'items'}
                    </Badge>
                  </div>

                  <div className='max-h-[300px] space-y-4 overflow-y-auto pr-1'>
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className='flex gap-4 rounded-lg border border-blue-100 bg-white p-3 shadow-sm dark:border-blue-900/50 dark:bg-slate-800'
                      >
                        <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md'>
                          <img
                            src={item.image || '/placeholder.svg'}
                            alt={item.name}
                            className='h-full w-full object-cover'
                          />
                          {item.quantity > 1 && (
                            <div className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white'>
                              {item.quantity}
                            </div>
                          )}
                        </div>
                        <div className='flex flex-1 flex-col'>
                          <div className='flex items-start justify-between'>
                            <h4 className='font-medium text-slate-800 dark:text-slate-100'>
                              {item.name}
                            </h4>
                            <span className='ml-2 text-sm font-medium whitespace-nowrap text-blue-700 dark:text-blue-400'>
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                          <p className='text-sm text-slate-500 dark:text-slate-400'>
                            {formatCurrency(item.price)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className='my-5 bg-blue-200 dark:bg-blue-800/50' />

                  <div className='space-y-3'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-slate-600 dark:text-slate-400'>Subtotal</span>
                      <span className='font-medium text-slate-800 dark:text-slate-200'>
                        {formatCurrency(cartTotal)}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-slate-600 dark:text-slate-400'>Delivery Fee</span>
                      <span className='font-medium text-slate-800 dark:text-slate-200'>
                        {formatCurrency(deliveryFee)}
                      </span>
                    </div>
                    {/* <div className='flex justify-between text-sm'>
                      <span className='text-slate-600 dark:text-slate-400'>
                        Tax ({(taxRate * 100).toFixed(0)}%)
                      </span>
                      <span className='font-medium text-slate-800 dark:text-slate-200'>
                        {formatCurrency(tax)}
                      </span>
                    </div> */}
                    <Separator className='my-2 bg-blue-200 dark:bg-blue-800/50' />
                    <div className='flex justify-between'>
                      <span className='font-semibold text-blue-800 dark:text-blue-300'>Total</span>
                      <span className='text-lg font-bold text-blue-800 dark:text-blue-300'>
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='flex flex-col gap-4 border-t border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 pt-4 dark:border-blue-800/50 dark:from-blue-900/20 dark:to-blue-800/20'>
                  <Button
                    className='h-12 w-full bg-blue-600 text-base font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                    size='lg'
                    type='submit'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Processing...
                      </>
                    ) : (
                      <>Place Order</>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}

import { createFileRoute, useRouter } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useCartStore } from '@/store/cart.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/utils/common-utils';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { checkoutFormSchema, type CheckoutFormValues } from '@/schemas/checkout.schema';
import { useOrderStore } from '@/store/order.store';
import OrderService from '@/services/order.service';

export const Route = createFileRoute('/_auth/_customer/checkout/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { cart, cartTotal } = useCartStore();
  const router = useRouter();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        instructions: '',
      },
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

    try {
      //  run the order placement logic here
      const response = await OrderService.createOrder(
        cart,
        data.address,
        data.payment,
        data.specialInstructions
      )

      if (!response) {
        toast.error('Failed to place order. Please try again.');
        return;
      }
      
      console.log('Order placed successfully:', response);

      router.navigate({ to: `/checkout/pay` });
    } catch (error) { 
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  // Calculate order totals (these will be calculated by the backend)
  const deliveryFee = 3.99; // This will come from the backend response
  const taxRate = 0.08; // This will come from the backend response
  const tax = cartTotal * taxRate;
  const total = cartTotal + deliveryFee + tax;

  if (cart.length === 0) {
    return (
      <div className='container mx-auto flex min-h-[60vh] items-center justify-center py-8'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <CardTitle>Your Cart is Empty</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col items-center'>
            <p className='text-muted-foreground mb-6 text-center'>
              You haven&apos;t added any items to your cart yet.
            </p>
            <Button onClick={() => router.navigate({ to: '/menu' })}>Browse Menu</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-8'>
      <h1 className='mb-8 text-3xl font-bold'>Checkout</h1>

      <FormProvider {...form}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.error('Form validation errors:', errors);
              toast.error('Please fix the form errors before submitting');

              // Optional: You can show more specific error messages
              if (Object.keys(errors).length > 0) {
                // Get the first error message to display
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
              <Card className='mb-8'>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-4'>
                    <FormField
                      control={form.control}
                      name='address.street'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder='123 Main St' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className='grid grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='address.city'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder='New York' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='address.state'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder='NY' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name='address.postalCode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder='10001' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='address.instructions'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Instructions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Gate code, building instructions, etc.'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className='mb-8 hidden'>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name='payment'
                    render={({ field }) => (
                      <FormItem className='space-y-4'>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className='grid gap-4'
                          >
                            <div className='flex items-center space-x-2 rounded-md border p-4'>
                              <RadioGroupItem value='cash' id='cash' />
                              <Label htmlFor='cash' className='flex-1 cursor-pointer'>
                                Cash on Delivery
                              </Label>
                            </div>
                            <div className='flex items-center space-x-2 rounded-md border p-4'>
                              <RadioGroupItem value='card' id='card' />
                              <Label htmlFor='card' className='flex-1 cursor-pointer'>
                                Credit/Debit Card
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Special Instructions */}
              <Card className='mb-8'>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name='specialInstructions'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder='Any special requests for your order?'
                            className='min-h-[100px]'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className='sticky top-20'>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='max-h-[300px] space-y-4 overflow-y-auto'>
                    {cart.map((item, index) => (
                      <div key={index} className='flex gap-4'>
                        <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md'>
                          <img
                            src={item.image}
                            alt={item.name}
                            className='h-full w-full object-cover'
                          />
                        </div>
                        <div className='flex flex-1 flex-col'>
                          <div className='flex items-start justify-between'>
                            <h4 className='font-medium'>{item.name}</h4>
                            <span className='ml-2 text-sm font-medium whitespace-nowrap'>
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                          <p className='text-muted-foreground text-sm'>
                            {formatCurrency(item.price)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className='my-4' />

                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Subtotal</span>
                      <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Delivery Fee</span>
                      <span>{formatCurrency(deliveryFee)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Tax</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>

                    <Separator className='my-2' />

                    <div className='flex justify-between font-bold'>
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <Button className='mt-6 w-full' size='lg' type='submit'>
                    Place Order
                  </Button>

                  <div className='bg-muted mt-4 flex items-start gap-2 rounded-md p-3 text-sm'>
                    <AlertCircle className='text-muted-foreground h-5 w-5 flex-shrink-0' />
                    <p className='text-muted-foreground'>
                      By placing your order, you agree to our terms and conditions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { PaymentElement, useCheckout } from '@stripe/react-stripe-js';
import { useGetUser } from '@/services/tanstack-hooks/auth.hook';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const validateEmail = async (email: string, checkout: ReturnType<typeof useCheckout>) => {
  const updateResult = await checkout.updateEmail(email);
  const isValid = updateResult.type !== 'error';

  return { isValid, message: !isValid ? updateResult.error.message : null };
};

const CheckoutForm = () => {
  const { data: user } = useGetUser();
  const checkout = useCheckout();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(true);

  useEffect(() => {
    // Add a 5-second delay for the payment button section
    const timer = setTimeout(() => {
      setIsButtonLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.email) {
      setMessage('Email is required');
      return;
    }

    setIsLoading(true);

    // Validate email
    const { isValid, message } = await validateEmail(user.email, checkout);
    if (!isValid) {
      setMessage(message);
      setIsLoading(false);
      return;
    }

    // Confirm payment
    const result = await checkout.confirm();
    console.log('Payment result:', result);

    // Handle the result
    if (result.type === 'error') {
      setMessage(result.error.message);
    } else {
      setMessage('Payment processing...');
    }

    setIsLoading(false);
  };

  return (
    <form id='payment-form' onSubmit={handleSubmit}>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Payment Details</h2>
        <Button
          variant='outline'
          onClick={() => window.history.back()}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='h-4 w-4' />
          Back
        </Button>
      </div>
      <PaymentElement id='payment-element' className='bg-transparent' />

      {isButtonLoading ? (
        <div className='mt-4'>
          <Skeleton className='h-10 w-full' />
        </div>
      ) : (
        <div className='mt-4 flex w-full items-center justify-between'>
          <Button
            disabled={isLoading || !user?.email}
            id='submit'
            type='submit'
            className='payment-button w-full'
          >
            <span id='button-text'>
              {isLoading ? (
                <div className='spinner' id='spinner'>
                  Processing...
                </div>
              ) : (
                `Pay ${checkout.total?.total?.amount || '0.00'} now`
              )}
            </span>
          </Button>
        </div>
      )}

      {message && (
        <div id='payment-message' className='payment-message'>
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;

import { createFileRoute } from '@tanstack/react-router';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useCallback } from 'react';

const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const Route = createFileRoute('/_auth/_customer/checkout/pay/')({
  component: RouteComponent,
});

function RouteComponent() {
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch('http://localhost:3000/api/payment/checkout', {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = { fetchClientSecret };

  return (
    <div id='checkout'>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

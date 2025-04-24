import { useCartStore } from '@/store/cart.store';
import { useOrderStore } from '@/store/order.store';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_auth/_customer/checkout/pay/return')({
  component: RouteComponent,
});

function RouteComponent() {
  const orderData = useOrderStore((state) => state);
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const { resetOrder } = useOrderStore();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    fetch(`/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === 'open') {
    navigate({ to: '/checkout', replace: true });
  }

  if (status === 'complete') {
    clearCart();
    resetOrder();
    console.log('Order data:', orderData);
    // OrderService.createOrder();

    return (
      <section id='success'>
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}. If you
          have any questions, please email{' '}
          <a href='mailto:orders@example.com'>orders@example.com</a>.
        </p>
      </section>
    );
  }

  return null;
}

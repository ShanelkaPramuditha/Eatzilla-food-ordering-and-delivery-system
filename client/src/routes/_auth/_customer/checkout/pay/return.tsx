import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, ArrowRight, Home, Clock, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  useCreateTransaction,
  useGetReceiptUrl,
  useGetSessionStatus,
} from '@/services/tanstack-hooks/payment';
import { toast } from 'sonner';
import { useNotifyStore } from '@/store/notify.store';
import { OrderNotificationService } from '@/services/order-notification.service';
import { OrderStatus } from '@/constants/order';

export const Route = createFileRoute('/_auth/_customer/checkout/pay/return')({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      session_id: typeof search.session_id === 'string' ? search.session_id : null,
    };
  },
});

function RouteComponent() {
  const { session_id: sessionId } = Route.useSearch();
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addNotification } = useNotifyStore();

  useEffect(() => {
    if (!sessionId) {
      navigate({ to: '/' });
    }
  }, [sessionId, navigate]);

  // Fetch receipt URL
  const { data: receiptData, isPending: isReceiptLoading } = useGetReceiptUrl(sessionId);
  const { data: sessionStatusData, isPending: isSessionLoading } = useGetSessionStatus(sessionId);
  const { mutateAsync: createTransaction } = useCreateTransaction();

  useEffect(() => {
    setStatus(sessionStatusData?.status);
  }, [sessionStatusData]);

  useEffect(() => {
    if (status === 'complete' && receiptData && sessionStatusData && sessionId) {
      // Create transaction after payment is confirmed
      createTransaction({
        orderId: sessionStatusData?.metadata?.orderId,
        customerId: sessionStatusData?.metadata.customerId,
        paymentIntentId: receiptData?.paymentIntent,
        chargeId: receiptData?.charge,
        sessionId: sessionId,
        amount: receiptData?.amount / 100 || 0,
        currency: receiptData?.currency,
        paymentStatus: sessionStatusData?.paymentStatus,
        paymentMethod: 'card',
        receiptUrl: receiptData?.receiptUrl,
        metadata: sessionStatusData?.metadata,
      });

      // Send order confirmation notification
      if (sessionStatusData?.metadata?.orderId) {
        OrderNotificationService.notifyOrderConfirmed(sessionStatusData.metadata.orderId);
      }
    }
  }, [status, sessionId, sessionStatusData, receiptData, createTransaction]);

  const handleDownloadReceipt = () => {
    if (receiptData?.receiptUrl) {
      // Open the receipt URL in a new tab
      window.open(receiptData.receiptUrl, '_blank');
    } else {
      toast.error('Receipt is not available yet. Please try again later.');
    }
  };

  if (isReceiptLoading || isSessionLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
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
    return (
      <div className='mx-auto w-full max-w-4xl p-4'>
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
                  <p className='font-medium'>#{sessionStatusData?.metadata?.orderId}</p>
                </div>
                <div>
                  <p className='text-gray-600'>Date</p>
                  <p className='font-medium'>{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className='text-gray-600'>Email</p>
                  <p className='font-medium'>{sessionStatusData?.customerDetails.email}</p>
                </div>
                <div>
                  <p className='text-gray-600'>Payment Method</p>
                  <p className='font-medium'>Credit Card</p>
                </div>
              </div>

              <div className='mt-4 flex justify-end'>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-2'
                  onClick={handleDownloadReceipt}
                  disabled={isReceiptLoading || !receiptData?.receiptUrl}
                >
                  {isReceiptLoading ? (
                    <>
                      <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-green-600'></div>
                      Loading Receipt...
                    </>
                  ) : (
                    <>
                      <FileText className='h-4 w-4' />
                      Download Receipt
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className='mb-6 border-t border-gray-200 pt-6'>
              <h2 className='mb-4 text-xl font-bold'>Delivery Information</h2>
              <p className='font-medium'>{sessionStatusData?.customerDetails.address.country}</p>
            </div>

            <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
              <Button
                className='flex-1 gap-2'
                onClick={() => navigate({ to: '/my-orders', replace: true })}
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
  if (status === 'expired' || status === 'cancelled') {
    // Send order cancellation notification if orderId exists
    if (sessionStatusData?.metadata?.orderId) {
      OrderNotificationService.notifyOrderCancelled(
        sessionStatusData.metadata.orderId,
        'Payment session expired or was cancelled',
      );
    }
  }

  return (
    <div className='mx-auto flex w-full max-w-2xl items-center justify-center p-4'>
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

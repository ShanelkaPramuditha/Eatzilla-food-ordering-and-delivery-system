import { OrderSummary } from '../-order-summary';
import { Card, CardContent } from '@/components/ui/card';
import { Order } from '@/types/order';
import { formatCurrency } from '@/utils/common-utils';

export function SummaryList({ orderData }: { orderData: Order }) {
  return (
    <Card className='w-full border-0 shadow-none'>
      <CardContent>
        <div className='flex flex-col gap-4'>
          <h3 className='text-lg font-semibold'>Order Summary</h3>
          {status === 'pending' ? (
            <div className='flex h-64 items-center justify-center'>
              <div className='h-10 w-10 animate-spin rounded-full border-b-2 border-green-600'></div>
            </div>
          ) : (
            orderData && (
              <>
                <div className='mb-4 flex max-h-[300px] flex-col gap-3 overflow-y-auto px-4'>
                  {orderData.suborders.map((restaurant, rIndex) => (
                    <div key={rIndex} className='border-b pb-3'>
                      <h4 className='mb-2 font-medium'>Restaurant #{restaurant.restaurantId}</h4>
                      {restaurant.items.map((item, iIndex) => (
                        <div key={iIndex} className='flex justify-between py-1'>
                          <span className='flex items-start gap-2'>
                            <span className='text-sm'>{item.quantity}x</span>
                            <span>{item.name}</span>
                          </span>
                          <span>
                            {formatCurrency(item.price * item.quantity, orderData.currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className='mb-4 flex max-h-[300px] flex-col gap-3 px-4'>
                  <OrderSummary
                    subtotal={orderData.subtotal}
                    deliveryFee={orderData.deliveryFee}
                    tax={0}
                    total={orderData.total - orderData.tax}
                    currency={orderData.currency}
                    showTitle={false}
                  />
                </div>
              </>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}

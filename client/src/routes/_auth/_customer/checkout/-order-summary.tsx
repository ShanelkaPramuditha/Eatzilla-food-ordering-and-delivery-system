import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/common-utils';
import { ShoppingBag, Truck, Receipt } from 'lucide-react';

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  tax?: number;
  discount?: number;
  total: number;
  currency?: string;
  className?: string;
  showTitle?: boolean;
}

export function OrderSummary({
  subtotal,
  deliveryFee,
  tax = 0,
  discount = 0,
  total,
  currency = 'LKR',
  className = '',
  showTitle = true,
}: OrderSummaryProps) {
  return (
    <Card className={`shadow-sm ${className}`}>
      {showTitle && (
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center gap-2 text-xl'>
            <Receipt className='h-5 w-5' />
            Order Summary
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className='pt-2'>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <div className='text-muted-foreground flex items-center gap-2'>
              <ShoppingBag className='h-4 w-4' />
              <span>Subtotal</span>
            </div>
            <span>{formatCurrency(subtotal, currency)}</span>
          </div>

          <div className='flex items-center justify-between'>
            <div className='text-muted-foreground flex items-center gap-2'>
              <Truck className='h-4 w-4' />
              <span>Delivery Fee</span>
            </div>
            <span className='font-medium'>{formatCurrency(deliveryFee, currency)}</span>
          </div>

          {tax > 0 && (
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground'>Tax</span>
              <span>{formatCurrency(tax, currency)}</span>
            </div>
          )}

          {discount > 0 && (
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground'>Discount</span>
              <span className='text-green-600'>-{formatCurrency(discount, currency)}</span>
            </div>
          )}

          <Separator className='my-2' />

          <div className='flex items-center justify-between'>
            <span className='text-base font-semibold'>Total</span>
            <span className='text-base font-bold'>{formatCurrency(total, currency)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

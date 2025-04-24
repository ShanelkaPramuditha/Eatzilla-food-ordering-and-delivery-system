import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CardDetailsFormValues } from '@/schemas/checkout.schema';
import { CreditCard, Calendar, User, Lock } from 'lucide-react';
import { useState } from 'react';

interface CardDetailsFormProps {
  isSubmitting?: boolean;
}

export function CardDetailsForm({ isSubmitting }: CardDetailsFormProps) {
  const { control } = useFormContext<CardDetailsFormValues>();
  const [cardFocus, setCardFocus] = useState<string | null>(null);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    if (!value) return value;
    // Remove any non-digit characters
    const v = value.replace(/\D/g, '');
    // Add a space after every 4 digits
    const formatted = v.replace(/(\d{4})(?=\d)/g, '$1 ');
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.substring(0, 19);
  };

  // Format expiry date to MM/YY
  const formatExpiryDate = (value: string) => {
    if (!value) return value;
    // Remove any non-digit characters
    const v = value.replace(/\D/g, '');
    // Add a slash after first 2 digits if there are more than 2
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  return (
    <Card
      className={`border-2 transition-all ${cardFocus ? 'border-primary' : 'border-transparent'}`}
    >
      <CardHeader className='border-b bg-gradient-to-r from-green-50 to-blue-50'>
        <CardTitle className='flex items-center gap-2'>
          <CreditCard className='text-primary h-5 w-5' />
          Card Information
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4 pt-6'>
        <FormField
          control={control}
          name='cardholderName'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex items-center gap-1'>
                <User className='h-3.5 w-3.5' />
                Cardholder Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='John Doe'
                  {...field}
                  disabled={isSubmitting}
                  className='focus:ring-primary/20 focus:ring-2'
                  onFocus={() => setCardFocus('name')}
                  onBlur={() => setCardFocus(null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='cardNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex items-center gap-1'>
                <CreditCard className='h-3.5 w-3.5' />
                Card Number
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='4242 4242 4242 4242'
                  {...field}
                  value={formatCardNumber(field.value)}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={isSubmitting}
                  className='focus:ring-primary/20 focus:ring-2'
                  maxLength={19}
                  onFocus={() => setCardFocus('number')}
                  onBlur={() => setCardFocus(null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='expiryDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center gap-1'>
                  <Calendar className='h-3.5 w-3.5' />
                  Expiry Date
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='MM/YY'
                    {...field}
                    value={formatExpiryDate(field.value)}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={isSubmitting}
                    className='focus:ring-primary/20 focus:ring-2'
                    maxLength={5}
                    onFocus={() => setCardFocus('expiry')}
                    onBlur={() => setCardFocus(null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='cvv'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center gap-1'>
                  <Lock className='h-3.5 w-3.5' />
                  CVV
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='123'
                    type='password'
                    {...field}
                    disabled={isSubmitting}
                    className='focus:ring-primary/20 focus:ring-2'
                    maxLength={4}
                    pattern='\d*'
                    inputMode='numeric'
                    onFocus={() => setCardFocus('cvv')}
                    onBlur={() => setCardFocus(null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='text-muted-foreground mt-2 flex items-start gap-2 pt-2 text-sm'>
          <Lock className='mt-0.5 h-3.5 w-3.5 flex-shrink-0' />
          <p>Your card information is encrypted and processed securely</p>
        </div>
      </CardContent>
    </Card>
  );
}

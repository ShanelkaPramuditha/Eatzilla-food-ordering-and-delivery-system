import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from '@tanstack/react-router';

export function CartDrawer() {
  const { cart, cartTotal, removeItem, updateQuantity, itemCount, isCartOpen, setIsCartOpen } =
    useCart();
  const router = useRouter();

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.navigate({ to: '/checkout' });
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button variant='outline' size='icon' className='relative'>
          <ShoppingCart className='h-5 w-5' />
          {itemCount > 0 && (
            <span className='bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs'>
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className='flex w-full flex-col sm:max-w-md p-5'>
        <SheetHeader className='px-1'>
          <div className='flex items-center justify-between'>
            <SheetTitle className='flex items-center gap-2'>
              <ShoppingCart className='h-5 w-5' />
              Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </SheetTitle>
          </div>
        </SheetHeader>

        <Separator className='my-4' />

        {cart.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center'>
            <div className='bg-muted mb-4 rounded-full p-6'>
              <ShoppingCart className='text-muted-foreground h-10 w-10' />
            </div>
            <h3 className='mb-1 text-xl font-medium'>Your cart is empty</h3>
            <p className='text-muted-foreground mb-6 text-center text-sm'>
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Button onClick={() => setIsCartOpen(false)}>Browse Menu</Button>
          </div>
        ) : (
          <>
            <div className='flex-1 overflow-y-auto py-2'>
              {cart.map((item, index) => (
                <div key={`${item.menuItemId}-${index}`} className='mb-4 flex gap-4'>
                  <div className='relative h-20 w-20 overflow-hidden rounded-md'>
                    <img src={item.image} alt={item.name} className='h-full w-full object-cover' />
                  </div>
                  <div className='flex flex-1 flex-col'>
                    <div className='flex items-start justify-between'>
                      <h4 className='font-medium'>{item.name}</h4>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-7 w-7'
                        onClick={() => removeItem(item.menuItemId, item.customizations)}
                      >
                        <Trash2 className='text-muted-foreground h-4 w-4' />
                      </Button>
                    </div>
                    <p className='text-muted-foreground text-sm'>
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                    <div className='mt-2 flex items-center'>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-7 w-7'
                        onClick={() =>
                          updateQuantity(item.menuItemId, item.quantity - 1, item.customizations)
                        }
                      >
                        <Minus className='h-3 w-3' />
                      </Button>
                      <span className='mx-2 w-8 text-center text-sm'>{item.quantity}</span>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-7 w-7'
                        onClick={() =>
                          updateQuantity(item.menuItemId, item.quantity + 1, item.customizations)
                        }
                      >
                        <Plus className='h-3 w-3' />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-auto'>
              <Separator className='my-4' />
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span className='font-medium'>{formatCurrency(cartTotal)}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Delivery Fee</span>
                  <span className='font-medium'>{formatCurrency(3.99)}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-lg font-semibold'>Total</span>
                  <span className='text-lg font-semibold'>{formatCurrency(cartTotal + 3.99)}</span>
                </div>
                <Button className='w-full' size='lg' onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

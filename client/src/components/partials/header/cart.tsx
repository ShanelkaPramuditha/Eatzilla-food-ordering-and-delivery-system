import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCartStore } from '@/store/cart.store';
import { formatCurrency } from '@/utils/common-utils';
import { useRouter } from '@tanstack/react-router';

export function CartDrawer() {
  const { cart, cartTotal, removeItem, updateQuantity, itemCount, isCartOpen, setIsCartOpen } =
    useCartStore();
  const router = useRouter();

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.navigate({ to: '/checkout' });
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='relative h-10 w-10 rounded-full border-gray-200 transition-colors hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-blue-900/20'
        >
          <ShoppingCart className='h-5 w-5 text-gray-700 dark:text-gray-300' />
          {itemCount > 0 && (
            <span className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white shadow-md'>
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className='flex w-full flex-col border-l border-gray-200 bg-white p-6 sm:max-w-md dark:border-gray-700 dark:bg-gray-900'>
        <SheetHeader className='px-1'>
          <div className='flex items-center justify-between'>
            <SheetTitle className='flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-white'>
              <ShoppingCart className='h-6 w-6 text-blue-500' />
              Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </SheetTitle>
          </div>
        </SheetHeader>

        <Separator className='my-6 bg-gray-200 dark:bg-gray-700' />

        {cart.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center py-12'>
            <div className='mb-6 rounded-full bg-blue-50 p-6 dark:bg-blue-900/20'>
              <ShoppingCart className='h-12 w-12 text-blue-500' />
            </div>
            <h3 className='mb-2 text-xl font-semibold text-gray-900 dark:text-white'>
              Your cart is empty
            </h3>
            <p className='mb-8 text-center text-sm text-gray-600 dark:text-gray-400'>
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Button
              onClick={() => setIsCartOpen(false)}
              className='bg-blue-500 px-6 text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            <div className='flex-1 overflow-y-auto py-2'>
              {cart.map((item, index) => (
                <div
                  key={`${item.menuItemId}-${index}`}
                  className='group mb-6 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800'
                >
                  <div className='flex gap-4'>
                    <div className='relative h-24 w-24 overflow-hidden rounded-lg'>
                      <img
                        src={item.image}
                        alt={item.name}
                        className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                      />
                    </div>
                    <div className='flex flex-1 flex-col'>
                      <div className='flex items-start justify-between'>
                        <h4 className='font-medium text-gray-900 dark:text-white'>{item.name}</h4>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-gray-500 hover:text-red-500 dark:text-gray-400'
                          onClick={() => removeItem(item.menuItemId, item.customizations)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                      <div className='mt-3 flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='icon'
                          className='h-7 w-7 border-gray-200 dark:border-gray-700'
                          onClick={() =>
                            updateQuantity(item.menuItemId, item.quantity - 1, item.customizations)
                          }
                        >
                          <Minus className='h-3 w-3' />
                        </Button>
                        <span className='w-8 text-center text-sm font-medium'>{item.quantity}</span>
                        <Button
                          variant='outline'
                          size='icon'
                          className='h-7 w-7 border-gray-200 dark:border-gray-700'
                          onClick={() =>
                            updateQuantity(item.menuItemId, item.quantity + 1, item.customizations)
                          }
                        >
                          <Plus className='h-3 w-3' />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-auto'>
              <Separator className='mt-4 mb-6 bg-gray-200 dark:bg-gray-700' />
              <div className='space-y-4'>
                <div className='flex items-center justify-between text-gray-600 dark:text-gray-400'>
                  <span>Subtotal</span>
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
               
                <Separator className='my-4 bg-gray-200 dark:bg-gray-700' />
                <div className='flex items-center justify-between'>
                  <span className='text-lg font-semibold text-gray-900 dark:text-white'>Total</span>
                  <span className='text-lg font-semibold text-blue-500'>
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
                <Button
                  className='mt-4 w-full bg-blue-500 py-6 text-base font-semibold text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                  size='lg'
                  onClick={handleCheckout}
                >
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

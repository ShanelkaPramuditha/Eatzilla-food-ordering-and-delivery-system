import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PlusIcon, MinusIcon, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { MenuItem } from '../../types/cart';
import { formatCurrency } from '@/utils/common-utils';
import { Link } from '@tanstack/react-router';

interface FoodCardProps {
  item: MenuItem;
}

export function FoodCard({ item }: FoodCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(item, quantity);
    setQuantity(1); // Reset quantity after adding to cart
  };

  return (
    <Card className='overflow-hidden transition-all duration-300 hover:shadow-lg'>
      <Link to={`/`}>
        <div className='relative h-[200px] w-full overflow-hidden'>
          <img
            src={item.image}
            alt={item.name}
            className='object-cover transition-transform duration-300 hover:scale-105'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
          {item.popular && (
            <div className='absolute top-2 right-2 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white'>
              Popular
            </div>
          )}
        </div>
      </Link>
      <CardContent className='p-4'>
        <Link to={`/`} className='hover:underline'>
          <h3 className='mb-1 text-lg font-semibold'>{item.name}</h3>
        </Link>
        <p className='text-muted-foreground mb-2 line-clamp-2 text-sm'>{item.description}</p>
        <div className='mt-2 flex items-center justify-between'>
          <span className='text-lg font-semibold'>{formatCurrency(item.price)}</span>
          <div className='flex items-center'>
            <span className='text-muted-foreground mr-2 text-sm'>Category: {item.category}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex justify-between gap-2 border-t p-4'>
        <div className='flex items-center'>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            onClick={decrementQuantity}
            disabled={quantity <= 1}
          >
            <MinusIcon className='h-4 w-4' />
          </Button>
          <span className='mx-2 w-8 text-center'>{quantity}</span>
          <Button variant='outline' size='icon' className='h-8 w-8' onClick={incrementQuantity}>
            <PlusIcon className='h-4 w-4' />
          </Button>
        </div>
        <Button onClick={handleAddToCart} className='gap-2'>
          <ShoppingCart className='h-4 w-4' />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

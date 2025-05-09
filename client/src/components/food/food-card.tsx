import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PlusIcon, MinusIcon, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { formatCurrency } from '@/utils/common-utils';
import { Link } from '@tanstack/react-router';

interface FoodCardProps {
  item: any;
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
    <Card className='group relative overflow-hidden rounded-xl border-0 p-0 gap-0 bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-800/95'>
      <Link to={`/`}>
        <div className='relative h-[220px] w-full overflow-hidden'>
          <img
            src={item.image}
            alt={item.name}
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60'></div>
          {item.popular && (
            <div className='absolute top-3 right-3 rounded-full bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg'>
              Popular
            </div>
          )}
        </div>
      </Link>
      <CardContent className='p-5'>
        <Link to={`/`} className='group-hover:text-blue-500'>
          <h3 className='mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white'>
            {item.name}
          </h3>
        </Link>
        <p className='mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300'>
          {item.description}
        </p>
        <div className='flex items-center justify-between'>
          <span className='text-xl font-bold text-gray-900 dark:text-white'>
            {formatCurrency(item.price)}
          </span>
          <span className='rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'>
            {item.category}
          </span>
        </div>
      </CardContent>
      <CardFooter className='flex justify-between gap-3 border-t border-gray-100 bg-gray-50/50 p-4 dark:border-gray-700/50 dark:bg-gray-800/50'>
        <div className='flex items-center gap-1'>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8 border-gray-200 dark:border-gray-700'
            onClick={decrementQuantity}
            disabled={quantity <= 1}
          >
            <MinusIcon className='h-4 w-4' />
          </Button>
          <span className='mx-2 w-8 text-center font-medium'>{quantity}</span>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8 border-gray-200 dark:border-gray-700'
            onClick={incrementQuantity}
          >
            <PlusIcon className='h-4 w-4' />
          </Button>
        </div>
        <Button
          onClick={handleAddToCart}
          className='bg-blue-500 px-4 text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
        >
          <ShoppingCart className='mr-2 h-4 w-4' />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

export default FoodCard;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PlusIcon, MinusIcon, ShoppingCart } from 'lucide-react';
import {
  formatCurrency,
  getAvailabilityColor,
  getAvailabilityText,
} from '../../utils/common-utils';
import { useCartStore } from '@/store/cart.store';

interface FoodCardProps {
  item: any;
}

export function FoodCard({ item }: FoodCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    // This would connect to your actual cart store
    addToCart(item, quantity);
    console.log(`Added ${quantity} of ${item.name} to cart`);
    setQuantity(1); // Reset quantity after adding to cart
    
  };

  return (
    <Card
      className='group relative gap-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-0 shadow-md transition-all duration-300 hover:border-blue-100 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/95 dark:hover:border-blue-800/50'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='relative h-[220px] w-full overflow-hidden'>
        <img
          src={item.image}
          alt={item.name}
          className={`h-full w-full object-cover transition-all duration-500 ${isHovered ? 'scale-105 brightness-[0.95]' : 'scale-100'}`}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80'></div>

        {/* Availability badge */}
        <div className='absolute top-3 right-3'>
          <div
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm ${getAvailabilityColor(item.available)}`}
          >
            {getAvailabilityText(item.available)}
          </div>
        </div>
      </div>

      <CardContent className='p-5'>
        <div className='mb-2 flex items-start justify-between'>
          <h3 className='text-lg font-semibold tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
            {item.name}
          </h3>
          <span className='text-xl font-bold text-gray-900 dark:text-white'>
            {formatCurrency(item.price)}
          </span>
        </div>

        <p className='mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300'>
          {item.description}
        </p>

        <div className='flex items-center gap-2'>
          <span className='rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 dark:border-blue-800/50 dark:bg-blue-900/30 dark:text-blue-400'>
            {item.category}
          </span>
          <span className='text-sm text-gray-500 dark:text-gray-400'>{item.restaurantName}</span>
        </div>
      </CardContent>

      <CardFooter className='flex justify-between gap-3 border-t border-gray-100 bg-gray-50/50 p-4 dark:border-gray-700/50 dark:bg-gray-800/50'>
        {item.available ? (
          <>
            <div className='flex items-center gap-1'>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 border-gray-200 transition-all duration-200 hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-blue-900/20'
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <MinusIcon className='h-4 w-4' />
              </Button>
              <span className='mx-2 w-8 text-center font-medium'>{quantity}</span>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 border-gray-200 transition-all duration-200 hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-blue-900/20'
                onClick={incrementQuantity}
              >
                <PlusIcon className='h-4 w-4' />
              </Button>
            </div>
            <Button
              onClick={handleAddToCart}
              className='bg-blue-500 px-4 text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-md dark:bg-blue-600 dark:hover:bg-blue-700'
            >
              <ShoppingCart className='mr-2 h-4 w-4' />
              Add to Cart
            </Button>
          </>
        ) : (
          <Button
            disabled
            className='w-full cursor-not-allowed bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          >
            Out of Stock
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default FoodCard;

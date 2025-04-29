'use client';

import { useState, useEffect } from 'react';
import { FoodCard } from '@/components/food/food-card';
import { categories } from '@/data/menu-items';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader, SearchIcon } from 'lucide-react';
import restaurnatService from '@/services/restaurnat.service';
import { useQuery } from '@tanstack/react-query';

export default function FoodMenu() {
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: foodItems = [],
    isLoading,
    isError,
    refetch: refetchFoods,
  } = useQuery<any[]>({
    queryKey: ['orders'],
    queryFn: () => restaurnatService.getAllMenuItems(),
  });

  useEffect(() => {
    if (foodItems && foodItems.length > 0) {
      setFilteredItems(foodItems);
    }
  }, [foodItems]);

  useEffect(() => {
    if (!foodItems) return;

    const filtered = foodItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false;
      return matchesCategory && matchesSearch;
    });
    setFilteredItems(filtered);
  }, [activeCategory, searchQuery, foodItems]);

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-8'>
        <div className='mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <h2 className='text-3xl font-bold'>Our Menu</h2>
          <div className='relative flex w-full max-w-sm items-center'>
            <SearchIcon className='text-muted-foreground absolute left-3 h-5 w-5' />
            <Input
              placeholder='Search for food...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>

        <div className='no-scrollbar mb-6 flex w-full gap-2 overflow-x-auto pb-2'>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              className='whitespace-nowrap'
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <div className='bg-muted my-12 rounded-lg p-8 text-center'>
            <h3 className='text-xl font-medium'>No items found</h3>
            <p className='text-muted-foreground mt-2'>Try a different search term or category</p>
            <Button
              variant='outline'
              className='mt-4'
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { FoodCard } from '@/components/food/food-card';
import { categories } from '@/data/menu-items';
import { ChevronRightIcon, Loader, SearchIcon } from 'lucide-react';
import restaurnatService from '@/services/restaurnat.service';
import { useQuery } from '@tanstack/react-query';
import HeroSection from '@/routes/_home/-hero';

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

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };

  return (
    <div className='min-h-screen'>
      {/* Main Content */}
      <div className='relative z-10 container mx-auto w-full py-8'>
        {/* Search Bar */}
        <div className='mx-auto mb-8 max-w-3xl'>
          <div className='relative overflow-hidden rounded-full border border-gray-200 bg-white shadow-lg backdrop-blur-lg dark:border-gray-700 dark:bg-gray-800'>
            <SearchIcon className='absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
            <input
              type='text'
              placeholder='Search for your favorite food...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full bg-transparent py-4 pr-4 pl-12 text-gray-800 focus:outline-none dark:text-gray-200'
            />
          </div>
        </div>

        {/* Categories */}
        <div className='mb-10'>
          <h2 className='mb-4 flex items-center text-xl font-semibold text-gray-800 dark:text-white'>
            <span className='mr-2 h-6 w-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600'></span>
            Categories
          </h2>
          <div className='no-scrollbar flex gap-3 overflow-x-auto pb-2'>
            {[{ id: 'all', name: 'All Menu' }, ...categories].map((category) => (
              <button
                key={category.id}
                className={`rounded-full px-4 py-2 whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-blue-500 font-medium text-white shadow-md'
                    : 'border border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items */}
        {isLoading ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <Loader className='mb-4 h-10 w-10 text-indigo-600' />
            <p className='text-gray-600 dark:text-gray-400'>Loading menu items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className='mx-auto max-w-md rounded-xl bg-white p-8 text-center shadow-lg dark:bg-gray-800'>
            <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700'>
              <SearchIcon className='h-8 w-8 text-gray-400' />
            </div>
            <h3 className='mb-2 text-xl font-medium text-gray-800 dark:text-white'>
              No items found
            </h3>
            <p className='mb-6 text-gray-600 dark:text-gray-400'>
              We couldn't find any menu items matching your current filters.
            </p>
            <button
              onClick={clearFilters}
              className='rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 font-medium text-white'
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div>
            {/* Popular Items Section */}
            {activeCategory === 'all' &&
              !searchQuery &&
              filteredItems.some((item) => item.popular) && (
                <div className='mb-12'>
                  <div className='mb-6 flex items-center justify-between'>
                    <h2 className='flex items-center text-2xl font-bold text-gray-800 dark:text-white'>
                      <span className='mr-2 h-6 w-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600'></span>
                      Popular Choices
                    </h2>
                    <button className='flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400'>
                      View all <ChevronRightIcon className='ml-1 h-4 w-4' />
                    </button>
                  </div>
                  <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                    {filteredItems
                      .filter((item) => item.popular)
                      .slice(0, 4)
                      .map((item) => (
                        <div key={item.id}>
                          <FoodCard item={item} />
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {/* All Menu Items */}
            <div>
              <div className='mb-6 flex items-center justify-between'>
                <h2 className='flex items-center text-2xl font-bold text-gray-800 dark:text-white'>
                  <span className='mr-2 h-6 w-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600'></span>
                  {activeCategory === 'all'
                    ? 'All Menu'
                    : categories.find((c) => c.id === activeCategory)?.name || 'Menu'}
                </h2>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {filteredItems.length} items
                </p>
              </div>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {filteredItems.map((item) => (
                  <div key={item.id}>
                    <FoodCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

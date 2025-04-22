import { useState, useEffect } from 'react';
import { FoodCard } from '@/components/food/food-card';
import { menuItems, categories } from '@/data/menu-items';
import { MenuItem } from '../../types/cart';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';

export default function FoodMenu() {
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuItems);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Apply filters when category or search query changes
  useEffect(() => {
    let items = menuItems;
    
    // Filter by category
    if (activeCategory !== 'all') {
      items = items.filter(item => item.category === activeCategory);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item: MenuItem) => 
          item.name.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredItems(items);
  }, [activeCategory, searchQuery]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-bold">Our Menu</h2>
          <div className="relative flex w-full max-w-sm items-center">
            <SearchIcon className="absolute left-3 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search for food..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="no-scrollbar mb-6 flex w-full gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className="whitespace-nowrap"
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
        
        {filteredItems.length === 0 ? (
          <div className="my-12 rounded-lg bg-muted p-8 text-center">
            <h3 className="text-xl font-medium">No items found</h3>
            <p className="mt-2 text-muted-foreground">
              Try a different search term or category
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
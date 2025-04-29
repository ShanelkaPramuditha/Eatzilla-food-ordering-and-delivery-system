import FoodMenu from '@/components/food/food-menu';

export function HomePage() {
  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <FoodMenu />
    </div>
  );
}

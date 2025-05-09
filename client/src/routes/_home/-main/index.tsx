import FoodMenu from '@/components/food/food-menu';
import HeroSection from '../-hero';

export function HomePage() {
  return (
    <div className='w-full'>
      <HeroSection />
      <FoodMenu />
    </div>
  );
}

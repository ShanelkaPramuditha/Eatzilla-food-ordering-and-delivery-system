import FoodMenu from '@/components/food/food-menu';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/menu/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <FoodMenu />
    </div>
  );
}

import FoodMenu from '@/components/food/food-menu'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/menu-items/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='w-full'>
    <FoodMenu/>
  </div>
}

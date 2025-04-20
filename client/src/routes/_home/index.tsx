import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/contexts/auth-context';
import { UserRole } from '@/constants/user';

// Dashboards
import { DeliveryPersonHome } from './-dashboards/delivery-person';
import { RestaurantOwnerHome } from './-dashboards/restaurant-owner';

// Guests and Customers
import { HomePage } from './-food';

export const Route = createFileRoute('/_home/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { role } = useAuth();

  switch (role) {
    case UserRole.RESTAURANT_OWNER:
      return <RestaurantOwnerHome />;
    case UserRole.DELIVERY_PERSON:
      return <DeliveryPersonHome />;
    case UserRole.CUSTOMER:
    case UserRole.GUEST:
    default:
      return <HomePage />;
  }
}

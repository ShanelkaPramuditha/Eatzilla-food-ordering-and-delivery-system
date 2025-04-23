import {
  IconBurger,
  IconLayoutDashboardFilled,
  IconTruckDelivery,
  IconSettings,
} from '@tabler/icons-react';

export const RestaurantOwnerSidebarItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: IconLayoutDashboardFilled,
  },
  {
    title: 'Menu',
    url: '/menu',
    icon: IconBurger,
  },
  {
    title: 'Orders',
    url: '/orders',
    icon: IconTruckDelivery,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: IconSettings,
  },
];

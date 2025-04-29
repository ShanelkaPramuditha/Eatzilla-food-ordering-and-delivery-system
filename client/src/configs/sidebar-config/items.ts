import {
  IconBurger,
  IconLayoutDashboardFilled,
  IconTruckDelivery,
  IconSettings,
  IconMessageDots,
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
    title: 'Reviews',
    url: '/reviews',
    icon: IconMessageDots,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: IconSettings,
  },
  {
    title: 'Transactions',
    url: '/transactions',
    icon: IconSettings,
  },
];

export const DeliveryPersonSidebarItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: IconLayoutDashboardFilled,
  },
  {
    title: 'Orders',
    url: '/orders',
    icon: IconTruckDelivery,
  },
  {
    title: 'Delivery',
    url: '/delivery',
    icon: IconTruckDelivery,
  },
];

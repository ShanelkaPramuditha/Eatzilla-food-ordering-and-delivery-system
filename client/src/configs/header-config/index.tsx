import { UserRole } from '@/constants/user';

export interface HeaderNavItem {
  label: string;
  path: string;
}

interface HeaderIconConfig {
  showCart: boolean;
  showNotifications: boolean;
}

interface HeaderConfig {
  [key: string]: {
    navItems: HeaderNavItem[];
    icons: HeaderIconConfig;
  };
}

export const headerConfig: HeaderConfig = {
  [UserRole.ADMIN]: {
    navItems: [
      {
        label: 'Dashboard',
        path: '/',
      },
      {
        label: 'About',
        path: '/about',
      },
    ],
    icons: {
      showCart: false,
      showNotifications: true,
    },
  },
  [UserRole.CUSTOMER]: {
    navItems: [
      {
        label: 'Home',
        path: '/',
      },
      {
        label: 'About',
        path: '/about',
      },
      {
        label: 'Menu',
        path: '/menu',
      },
      {
        label: 'My Orders',
        path: '/my-orders',
      },
    ],
    icons: {
      showCart: true,
      showNotifications: true,
    },
  },
  [UserRole.RESTAURANT_OWNER]: {
    navItems: [],
    icons: {
      showCart: false,
      showNotifications: true,
    },
  },
  [UserRole.DELIVERY_PERSON]: {
    navItems: [
      {
        label: 'Dashboard',
        path: '/',
      },
      {
        label: 'About',
        path: '/about',
      },
    ],
    icons: {
      showCart: false,
      showNotifications: true,
    },
  },
  [UserRole.GUEST]: {
    navItems: [
      {
        label: 'Home',
        path: '/',
      },
      {
        label: 'About',
        path: '/about',
      },
      {
        label: 'Menu',
        path: '/menu',
      },
    ],
    icons: {
      showCart: false,
      showNotifications: false,
    },
  },
};

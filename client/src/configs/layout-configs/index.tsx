import { UserRole } from '@/constants/user';

export interface LayoutConfig {
  showHeader?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
}

// Configuration for role-based layout visibility
export const LAYOUT_CONFIG: Partial<Record<UserRole, LayoutConfig>> = {
  [UserRole.RESTAURANT_OWNER]: {
    showHeader: true,
    showSidebar: true,
  },
  [UserRole.DELIVERY_PERSON]: {
    showHeader: true,
    showFooter: true,
    showSidebar: true,
  },
  [UserRole.ADMIN]: {
    showHeader: true,
    showSidebar: true,
  },
  [UserRole.CUSTOMER]: {
    showHeader: true,
    showFooter: true,
  },
  [UserRole.GUEST]: {
    showHeader: true,
    showFooter: true,
  },
};

export function getLayoutConfigByRole(role: UserRole): LayoutConfig {
  return (
    LAYOUT_CONFIG[role] ?? {
      showHeader: false,
      showSidebar: false,
      showFooter: false,
    }
  );
}

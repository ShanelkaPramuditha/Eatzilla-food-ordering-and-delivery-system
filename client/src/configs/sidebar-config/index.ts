import { ResturantOwnerSidebarItems } from './items';
import { USER } from '@/constants';

export type SidebarItemType = {
  title: string;
  url: string;
  icon: React.ComponentType;
};

export function getSidebarItemsByRole(role: string): SidebarItemType[] {
  switch (role) {
    case USER.UserRole.RESTAURANT_OWNER:
      return ResturantOwnerSidebarItems;
    default:
      return [];
  }
}

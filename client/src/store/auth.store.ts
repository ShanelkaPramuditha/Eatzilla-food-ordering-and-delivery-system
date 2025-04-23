import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  hasToken: boolean;
  setHasToken: (hasToken: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      hasToken: false,
      setHasToken: (hasToken) => set({ hasToken }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);

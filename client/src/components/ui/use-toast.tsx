// src/components/ui/use-toast.ts

import { createContext, useContext } from 'react';

type ToastProps = {
  title: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'destructive';
};

type ToastContextType = {
  toast: (props: ToastProps) => void;
};

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
});

export const useToast = () => {
  return useContext(ToastContext);
};

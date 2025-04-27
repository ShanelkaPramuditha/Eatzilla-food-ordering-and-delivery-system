import { useQuery } from '@tanstack/react-query';
import OrderService from '@/services/order.service';
import { Order } from '@/types/order';

export const useGetOrderById = (orderId: string) => {
  return useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: () => OrderService.getOrder(orderId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => {
      return data;
    },
  });
};

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeliveryList from './delivery-list';
import DeliveryMap from './delivery-map';
import DeliveryStats from './delivery-stats';
import { calculateDeliveryMetrics } from '@/data/delivery-data';
import { DeliveryMetrics } from '@/types/delivery';

export function DeliveryDashboard() {
  const [deliveryMetrics, setDeliveryMetrics] = useState<DeliveryMetrics | null>(null);

  useEffect(() => {
    // Get delivery metrics for the current driver
    // In a real app, you would use the authenticated user's ID
    const driverMetrics = calculateDeliveryMetrics('driver-001');
    setDeliveryMetrics(driverMetrics);
  }, []);

  return (
    <Tabs defaultValue='list' className='w-full'>
      <TabsList className='grid w-full grid-cols-3'>
        <TabsTrigger value='list'>Active Deliveries</TabsTrigger>
        <TabsTrigger value='map'>Delivery Map</TabsTrigger>
        <TabsTrigger value='stats'>Statistics</TabsTrigger>
      </TabsList>

      <TabsContent value='list'>
        <DeliveryList />
      </TabsContent>

      <TabsContent value='map'>
        <DeliveryMap />
      </TabsContent>

      <TabsContent value='stats'>
        <DeliveryStats metrics={deliveryMetrics} />
      </TabsContent>
    </Tabs>
  );
}

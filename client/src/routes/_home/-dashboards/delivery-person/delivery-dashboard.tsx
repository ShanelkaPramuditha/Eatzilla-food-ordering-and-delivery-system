import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeliveryList from './delivery-list';
import DeliveryMap from './delivery-map';
import DeliveryStats from './delivery-stats';

export function DeliveryDashboard() {
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
        <DeliveryStats />
      </TabsContent>
    </Tabs>
  );
}

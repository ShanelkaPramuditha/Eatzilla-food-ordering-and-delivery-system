import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  restaurantName: string;
  status: 'pending' | 'accepted' | 'picked' | 'delivered';
  address: string;
  estimatedTime: string;
}

export default function DeliveryList() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch deliveries from API
    const mockDeliveries: Delivery[] = [
      {
        id: '1',
        orderId: 'ORD-001',
        customerName: 'John Doe',
        restaurantName: 'Pizza Hut',
        status: 'pending',
        address: '123 Main St, Colombo',
        estimatedTime: '30 mins',
      },
      {
        id: '1',
        orderId: 'ORD-002',
        customerName: 'John Doe',
        restaurantName: 'Pizza Hut',
        status: 'pending',
        address: '123 Main St, Colombo',
        estimatedTime: '30 mins',
      },
      // Add more mock data as needed
    ];
    
    setDeliveries(mockDeliveries);
    setLoading(false);
  }, []);

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'accepted':
        return 'bg-blue-500';
      case 'picked':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div>Loading deliveries...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {deliveries.map((delivery) => (
        <Card key={delivery.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Order #{delivery.orderId}</span>
              <Badge className={getStatusColor(delivery.status)}>
                {delivery.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Customer:</strong> {delivery.customerName}</p>
              <p><strong>Restaurant:</strong> {delivery.restaurantName}</p>
              <p><strong>Address:</strong> {delivery.address}</p>
              <p><strong>Estimated Time:</strong> {delivery.estimatedTime}</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">View Details</Button>
                <Button size="sm">Accept Delivery</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';

interface DeliveryLocation {
  id: string;
  orderId: string;
  lat: number;
  lng: number;
  status: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 6.9271,
  lng: 79.8612,
};

export default function DeliveryMap() {
  const [selectedDelivery, setSelectedDelivery] = useState<string>('');
  const [deliveries, setDeliveries] = useState<DeliveryLocation[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    // TODO: Fetch deliveries from API
    const mockDeliveries: DeliveryLocation[] = [
      {
        id: '1',
        orderId: 'ORD-001',
        lat: 6.9271,
        lng: 79.8612,
        status: 'in-progress',
      },
    ];
    setDeliveries(mockDeliveries);

    // Simulate driver location updates
    const interval = setInterval(() => {
      setDriverLocation({
        lat: 6.9271 + (Math.random() - 0.5) * 0.01,
        lng: 79.8612 + (Math.random() - 0.5) * 0.01,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>Delivery Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <Select value={selectedDelivery} onValueChange={setSelectedDelivery}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select delivery' />
                </SelectTrigger>
                <SelectContent>
                  {deliveries.map((delivery) => (
                    <SelectItem key={delivery.id} value={delivery.id}>
                      Order #{delivery.orderId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='overflow-hidden rounded-lg'>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={13}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                {deliveries.map((delivery) => (
                  <Marker
                    key={delivery.id}
                    position={{ lat: delivery.lat, lng: delivery.lng }}
                    label='R'
                  />
                ))}
                {driverLocation && (
                  <Marker
                    position={driverLocation}
                    icon={{
                      url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    }}
                    label='D'
                  />
                )}
                {selectedDelivery && driverLocation && (
                  <Polyline
                    path={[
                      driverLocation,
                      deliveries.find((d) => d.id === selectedDelivery) || center,
                    ]}
                    options={{
                      strokeColor: '#FF0000',
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                    }}
                  />
                )}
              </GoogleMap>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-sm'>Delivery Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <p>
                      <strong>Status:</strong> In Progress
                    </p>
                    <p>
                      <strong>Estimated Arrival:</strong> 15 minutes
                    </p>
                    <p>
                      <strong>Distance:</strong> 2.5 km
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-sm'>Driver Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <p>
                      <strong>Name:</strong> John Smith
                    </p>
                    <p>
                      <strong>Vehicle:</strong> Motorcycle
                    </p>
                    <p>
                      <strong>Rating:</strong> 4.8/5
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DeliveryOrder, DeliveryStatus } from '@/types/delivery';
import { getPendingDeliveries, getDeliveriesByDriver, getDeliveryById } from '@/data/delivery-data';
import { Map, MapPin, Clock } from 'lucide-react';

// Mock current driver ID - in a real app this would come from authentication
const CURRENT_DRIVER_ID = 'driver-001';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  border: 'none',
};

// Google Maps API key - Use environment variable
const GOOGLE_MAPS_API_KEY = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY;

export default function DeliveryMap() {
  const [availableDeliveries, setAvailableDeliveries] = useState<DeliveryOrder[]>([]);
  const [myDeliveries, setMyDeliveries] = useState<DeliveryOrder[]>([]);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>('');
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOrder | null>(null);
  const [mapUrl, setMapUrl] = useState<string>('');
  const [showingDeliveryType, setShowingDeliveryType] = useState<'available' | 'my'>('my');
  const [mapDistance, setMapDistance] = useState<string>('');
  const [mapDuration, setMapDuration] = useState<string>('');
  const [fetchingDirections, setFetchingDirections] = useState<boolean>(false);
  const googleMapsLoaded = useRef(false);
  const directionsService = useRef<google.maps.DirectionsService | null>(null);

  // Load Google Maps API script
  useEffect(() => {
    if (!googleMapsLoaded.current) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        googleMapsLoaded.current = true;
        directionsService.current = new google.maps.DirectionsService();
      };
      document.head.appendChild(script);
    }
    return () => {
      // Cleanup if needed
    };
  }, []);

  // Get accurate directions using Google Maps Directions Service
  const getGoogleMapsDirections = useCallback(
    (origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) => {
      if (!googleMapsLoaded.current || !directionsService.current) {
        fallbackDistanceCalculation(origin, destination);
        return;
      }

      const request = {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.current.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const route = result.routes[0].legs[0];
          setMapDistance(route.distance?.text || 'Unknown');
          setMapDuration(route.duration?.text || 'Unknown');
        } else {
          console.error('Directions request failed:', status);
          fallbackDistanceCalculation(origin, destination);
        }
        setFetchingDirections(false);
      });
    },
    [],
  );

  // Fallback calculation using Haversine formula
  const fallbackDistanceCalculation = useCallback(
    (origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) => {
      try {
        // Calculate distance using the Haversine formula
        const R = 6371; // Radius of the Earth in km
        const dLat = degToRad(destination.lat - origin.lat);
        const dLng = degToRad(destination.lng - origin.lng);

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(degToRad(origin.lat)) *
            Math.cos(degToRad(destination.lat)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = R * c; // Distance in km

        // Round to 1 decimal place
        const roundedDistance = Math.round(distanceKm * 10) / 10;
        setMapDistance(`${roundedDistance.toFixed(1)} km`);

        // Estimate time based on average driving speed (30 km/h)
        const avgSpeedKmPerHour = 30;
        const timeInHours = distanceKm / avgSpeedKmPerHour;
        const timeInMinutes = Math.ceil(timeInHours * 60);

        const hours = Math.floor(timeInMinutes / 60);
        const minutes = timeInMinutes % 60;

        let estimatedTime = '';
        if (hours > 0) {
          estimatedTime = `${hours} hr ${minutes} mins`;
        } else {
          estimatedTime = `${minutes} mins`;
        }

        setMapDuration(estimatedTime);
        setFetchingDirections(false);
      } catch (error) {
        console.error('Error calculating distance and time:', error);
        setMapDistance('Could not calculate');
        setMapDuration('Could not calculate');
        setFetchingDirections(false);
      }
    },
    [],
  );

  const degToRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  useEffect(() => {
    // Only get pending deliveries that are paid - these are available for acceptance
    const pendingPaidDeliveries = getPendingDeliveries().filter((delivery) => delivery.isPaid);
    setAvailableDeliveries(pendingPaidDeliveries);

    // Get deliveries assigned to the current driver
    const currentDriverDeliveries = getDeliveriesByDriver(CURRENT_DRIVER_ID);
    setMyDeliveries(currentDriverDeliveries);

    // Default to showing the current driver's deliveries first (if any)
    if (currentDriverDeliveries.length > 0) {
      setShowingDeliveryType('my');
    } else {
      setShowingDeliveryType('available');
    }
  }, []);

  // This effect runs when a delivery is selected
  useEffect(() => {
    if (selectedDeliveryId) {
      const delivery = getDeliveryById(selectedDeliveryId);
      if (delivery) {
        setSelectedDelivery(delivery);
        setFetchingDirections(true);

        // Set the origin and destination for the map
        const origin = delivery.restaurant.location;
        const destination = delivery.dropLocation.location;

        // Create Google Maps Embed URL for directions with driving mode
        // Note: Can't use markers in directions mode (API limitation)
        const directionsMapUrl = `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_API_KEY}&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=driving`;
        setMapUrl(directionsMapUrl);

        // Get actual directions data from Google Maps API
        if (googleMapsLoaded.current) {
          getGoogleMapsDirections(origin, destination);
        } else {
          // Fallback to Haversine calculation if Maps API isn't loaded
          fallbackDistanceCalculation(origin, destination);
        }
      }
    } else {
      // Default map of a suitable location when no delivery is selected
      setMapUrl(
        `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=Colombo,Sri+Lanka&zoom=12`,
      );
      setMapDistance('');
      setMapDuration('');
    }
  }, [selectedDeliveryId, getGoogleMapsDirections, fallbackDistanceCalculation]);

  const handleSelectDelivery = (deliveryId: string) => {
    setSelectedDeliveryId(deliveryId);
  };

  const toggleDeliveryType = (type: 'available' | 'my') => {
    setShowingDeliveryType(type);
    setSelectedDeliveryId(''); // Reset selection when switching views
  };

  const getCurrentDeliveries = () => {
    return showingDeliveryType === 'my' ? myDeliveries : availableDeliveries;
  };

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>Delivery Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='mb-4'>
            <div className='mb-3 flex items-center justify-between'>
              <div className='flex space-x-2'>
                <Button
                  variant={showingDeliveryType === 'my' ? 'default' : 'outline'}
                  onClick={() => toggleDeliveryType('my')}
                  size='sm'
                >
                  My Deliveries
                </Button>
                <Button
                  variant={showingDeliveryType === 'available' ? 'default' : 'outline'}
                  onClick={() => toggleDeliveryType('available')}
                  size='sm'
                >
                  Available Deliveries
                </Button>
              </div>
            </div>

            <label className='mb-1 block text-sm font-medium'>Select Delivery</label>
            <Select value={selectedDeliveryId} onValueChange={handleSelectDelivery}>
              <SelectTrigger>
                <SelectValue
                  placeholder={`Select ${showingDeliveryType === 'my' ? 'your' : 'an available'} delivery`}
                />
              </SelectTrigger>
              <SelectContent>
                {getCurrentDeliveries().map((delivery) => (
                  <SelectItem key={delivery.id} value={delivery.id}>
                    {delivery.restaurant.name} - Order #{delivery.orderId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDelivery && (
            <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Card className='p-4'>
                <h3 className='font-semibold'>Pickup Location</h3>
                <p className='text-sm'>{selectedDelivery.restaurant.name}</p>
                <p className='text-muted-foreground text-sm'>
                  {selectedDelivery.restaurant.address}
                </p>
              </Card>
              <Card className='p-4'>
                <h3 className='font-semibold'>Drop Location</h3>
                <p className='text-sm'>{selectedDelivery.customer.name}</p>
                <p className='text-muted-foreground text-sm'>
                  {selectedDelivery.dropLocation.address}
                </p>
              </Card>
            </div>
          )}

          <div className='overflow-hidden rounded-md border'>
            {mapUrl ? (
              <iframe
                src={mapUrl}
                style={mapContainerStyle}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                title='Delivery Map'
                id='google-map-iframe'
              ></iframe>
            ) : (
              <div className='flex h-[400px] flex-col items-center justify-center p-6 text-center'>
                <Map className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                <p className='text-muted-foreground text-sm'>Select a delivery to view the route</p>
              </div>
            )}
          </div>

          {selectedDelivery && (
            <div className='mt-4 flex items-center justify-between'>
              <div className='flex items-center gap-6'>
                <div className='flex items-center gap-2'>
                  <MapPin className='h-5 w-5 text-red-500' />
                  <div>
                    <p className='text-sm font-semibold'>Distance</p>
                    <p className='text-sm'>{fetchingDirections ? 'Calculating...' : mapDistance}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Clock className='h-5 w-5 text-blue-500' />
                  <div>
                    <p className='text-sm font-semibold'>Estimated Time</p>
                    <p className='text-sm'>{fetchingDirections ? 'Calculating...' : mapDuration}</p>
                  </div>
                </div>
              </div>
              {selectedDelivery.status === DeliveryStatus.ACCEPTED &&
                selectedDelivery.deliveryPersonId === CURRENT_DRIVER_ID && (
                  <Button className='bg-blue-600 text-white hover:bg-blue-700'>
                    Start Navigation
                  </Button>
                )}
              {selectedDelivery.status === DeliveryStatus.PENDING &&
                showingDeliveryType === 'available' && (
                  <Button className='bg-green-600 text-white hover:bg-green-700'>
                    Accept Order
                  </Button>
                )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

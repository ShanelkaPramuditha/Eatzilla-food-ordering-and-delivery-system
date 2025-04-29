import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeliveryList from './delivery-list';
import DeliveryMap from './delivery-map';
import DeliveryStats from './delivery-stats';
import { calculateDeliveryMetrics } from '@/data/delivery-data';
import { DeliveryMetrics, Location } from '@/types/delivery';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import DeliveryService from '@/services/delivery.service';
import { useAuth } from '@/contexts/auth-context';

export function DeliveryDashboard() {
  const { user } = useAuth(); // Get the authenticated user from the auth context
  const [deliveryMetrics, setDeliveryMetrics] = useState<DeliveryMetrics | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();

  // Ensure we have a user ID, or fall back to a default for development
  const driverId = user?.id || 'driver-001';

  // Fetch initial driver data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Log the user ID we're using for clarity
        console.log('Using driver ID for availability status:', driverId);

        // Get delivery metrics for the current driver
        const driverMetrics = calculateDeliveryMetrics(driverId);
        setDeliveryMetrics(driverMetrics);

        // Get current driver status from backend
        const driverStatus = await DeliveryService.getDriverStatus(driverId);
        console.log('Initial driver status:', driverStatus);

        if (driverStatus) {
          setIsAvailable(driverStatus.isAvailable || false);
          if (driverStatus.currentLocation) {
            setCurrentLocation(driverStatus.currentLocation);
          }
        }
      } catch (error) {
        console.error('Error fetching initial driver data:', error);
        // Continue with the mock data for now
        const driverMetrics = calculateDeliveryMetrics(driverId);
        setDeliveryMetrics(driverMetrics);
      }
    };

    if (user) {
      fetchInitialData();
    }
  }, [user, driverId]);

  const getCurrentLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location received:', position.coords);
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(location);
        setIsLocating(false);

        // If the driver was toggling availability and we have the location, update their status
        updateDriverAvailability(true, location);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError(
          error.code === 1
            ? 'Location permission denied. Please enable location services.'
            : 'Unable to retrieve your location. Please try again.',
        );
        setIsLocating(false);
        setIsAvailable(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const updateDriverAvailability = async (status: boolean, location?: Location) => {
    setIsUpdating(true);

    try {
      console.log('Updating driver availability with service:', {
        status,
        location,
        driverId,
      });

      const result = await DeliveryService.updateAvailabilityStatus(driverId, status, location);

      console.log('Driver availability updated:', result);

      // Update local state
      setIsAvailable(status);

      toast({
        title: status ? 'You are now available for deliveries' : 'You are now offline',
        description: status
          ? 'You will be notified when new delivery requests are available'
          : 'You will not receive any new delivery requests',
        duration: 5000,
      });
    } catch (error) {
      console.error('Error updating driver availability:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to update availability',
        description: 'Please try again later',
        duration: 5000,
      });
      setIsAvailable(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvailabilityToggle = (checked: boolean) => {
    if (checked) {
      // When turning on availability, get current location first
      getCurrentLocation();
    } else {
      // When turning off availability, just update the status
      updateDriverAvailability(false);
    }
  };

  const handleLocationUpdate = () => {
    getCurrentLocation();

    toast({
      title: 'Updating location',
      description: 'Getting your current location...',
      duration: 3000,
    });
  };

  return (
    <div className='w-full max-w-full px-4 py-6'>
      <Card className='mb-6 w-full bg-white dark:bg-slate-950'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-xl font-bold'>Driver Availability</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Availability toggle section */}
          <div className='mb-4 flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center space-x-4'>
              <Switch
                id='available-mode'
                checked={isAvailable}
                disabled={isLocating || isUpdating}
                onCheckedChange={handleAvailabilityToggle}
                className='scale-110'
              />
              <Label htmlFor='available-mode' className='text-lg font-medium'>
                {isAvailable ? 'Available for Deliveries' : 'Offline'}
              </Label>
            </div>

            {(isLocating || isUpdating) && (
              <div className='text-muted-foreground flex items-center'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                <span>{isLocating ? 'Getting location...' : 'Updating status...'}</span>
              </div>
            )}
          </div>

          {/* Location display section */}
          {currentLocation && (
            <div className='bg-muted/30 flex flex-wrap items-center justify-between gap-3 rounded-md border p-4 text-base'>
              <div className='flex items-center'>
                <MapPin className='mr-2 h-5 w-5 text-green-500' />
                <span className='mr-2 font-medium'>Location:</span>
                <span className='font-mono'>
                  {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                </span>
              </div>

              <Button
                variant='outline'
                size='default'
                onClick={handleLocationUpdate}
                disabled={isLocating || isUpdating}
              >
                {isLocating ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Updating...
                  </>
                ) : (
                  'Update Location'
                )}
              </Button>
            </div>
          )}

          {/* Error display */}
          {locationError && (
            <Alert variant='destructive' className='mt-4'>
              <AlertTriangle className='h-4 w-4' />
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue='list' className='w-full'>
        <TabsList className='mb-5 grid h-12 w-full grid-cols-3'>
          <TabsTrigger value='list' className='px-3 h-full text-base data-[state=active]:font-medium'>
            Active Deliveries
          </TabsTrigger>
          <TabsTrigger value='map' className='px-3 h-full text-base data-[state=active]:font-medium'>
            Delivery Map
          </TabsTrigger>
          <TabsTrigger value='stats' className='px-3 h-full text-base data-[state=active]:font-medium'>
            Statistics
          </TabsTrigger>
        </TabsList>

        <div className='mt-2 w-full'>
          <TabsContent value='list' className='w-full'>
            <DeliveryList />
          </TabsContent>

          <TabsContent value='map' className='w-full'>
            <DeliveryMap />
          </TabsContent>

          <TabsContent value='stats' className='w-full'>
            <DeliveryStats metrics={deliveryMetrics} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

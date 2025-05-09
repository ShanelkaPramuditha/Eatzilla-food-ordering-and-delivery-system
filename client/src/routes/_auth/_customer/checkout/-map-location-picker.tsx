import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, Loader2, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Update the interface to match the Address interface
interface MapLocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  defaultLocation?: { lat: number; lng: number };
}

// Type for Leaflet icon prototype
interface ExtendedIconDefaultPrototype extends L.Icon.Default {
  _getIconUrl?: string;
}

// Update the DEFAULT_LOCATION constant
const DEFAULT_LOCATION = { lat: 40.7128, lng: -74.006 };

// MarkerComponent to handle marker position
function MarkerComponent({
  position,
  setPosition,
}: {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setPosition([position.lat, position.lng]);
        },
      }}
    />
  );
}

// Component to search for locations
function SearchControl({
  onSearch,
  isLoading,
}: {
  onSearch: (query: string) => void;
  isLoading: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className='flex space-x-2'>
      <Input
        placeholder='Search for a location...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch(searchQuery)}
        className='flex-1 border-blue-200 focus:border-blue-400 dark:border-blue-800/50 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-600'
      />
      <Button
        onClick={() => onSearch(searchQuery)}
        variant='outline'
        disabled={isLoading}
        className='border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800/50 dark:text-blue-400 dark:hover:bg-blue-900/20'
      >
        {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Search className='h-4 w-4' />}
      </Button>
    </div>
  );
}

// Component to update map view when position changes
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export function MapLocationPicker({
  onLocationSelect,
  defaultLocation = DEFAULT_LOCATION,
}: MapLocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>([
    defaultLocation.lat,
    defaultLocation.lng,
  ]);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const { theme } = useTheme();

  // Fix Leaflet default icon issue
  useEffect(() => {
    // Fix Leaflet marker icon paths
    delete (L.Icon.Default.prototype as ExtendedIconDefaultPrototype)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  // Update position and get address
  const updatePositionAndAddress = useCallback(async (newPos: [number, number]) => {
    setPosition(newPos);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos[0]}&lon=${newPos[1]}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'Eatzilla Food Delivery App',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        const formattedAddress = data.display_name || '';
        setAddress(formattedAddress);

        // Store location data instead of immediately selecting it
        setLocationData({
          lat: newPos[0],
          lng: newPos[1],
          address: formattedAddress,
        });
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  }, []);

  // Handle position changes
  const handlePositionChange = useCallback(
    (newPos: [number, number]) => {
      updatePositionAndAddress(newPos);
    },
    [updatePositionAndAddress],
  );

  // Handle confirming the selection
  const handleConfirmLocation = () => {
    if (locationData) {
      onLocationSelect(locationData);
    }
  };

  // Effect to get initial address
  useEffect(() => {
    updatePositionAndAddress(position);
  }, [position, updatePositionAndAddress]);

  // Search for a location
  const searchLocation = async (query: string) => {
    if (!query) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'Eatzilla Food Delivery App',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const newPosition: [number, number] = [parseFloat(lat), parseFloat(lon)];
          handlePositionChange(newPosition);
        }
      }
    } catch (error) {
      console.error('Error searching for location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full border-blue-200 shadow-md dark:border-blue-800'>
      <CardHeader className='border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 pb-2 dark:border-blue-800/50 dark:from-blue-900/30 dark:to-blue-800/30'>
        <CardTitle className='flex items-center text-blue-800 dark:text-blue-300'>
          <MapPin className='mr-2 h-5 w-5 text-blue-600 dark:text-blue-400' />
          Select Your Location
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4 pt-4'>
        <SearchControl onSearch={searchLocation} isLoading={isLoading} />

        <div className='h-[300px] w-full overflow-hidden rounded-md border-2 border-blue-200 dark:border-blue-800/50'>
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={
                theme === 'dark'
                  ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                  : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              }
            />
            <ChangeView center={position} />
            <MarkerComponent position={position} setPosition={handlePositionChange} />
          </MapContainer>
        </div>

        <div className='rounded-md bg-blue-50 p-3 text-sm text-slate-600 dark:bg-blue-900/20 dark:text-slate-300'>
          <p className='font-medium text-blue-700 dark:text-blue-400'>Selected Address:</p>
          <p className='mt-1'>{address || 'No address selected'}</p>
        </div>

        <Button
          onClick={handleConfirmLocation}
          className='w-full bg-blue-600 text-white hover:bg-blue-700'
          disabled={!locationData}
        >
          <Check className='mr-2 h-4 w-4' /> Confirm Location
        </Button>
      </CardContent>
      <CardFooter className='border-t border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 text-xs text-slate-500 dark:border-blue-800/50 dark:from-blue-900/20 dark:to-blue-800/20 dark:text-slate-400'>
        Drag the marker or click on the map to select your exact location
      </CardFooter>
    </Card>
  );
}

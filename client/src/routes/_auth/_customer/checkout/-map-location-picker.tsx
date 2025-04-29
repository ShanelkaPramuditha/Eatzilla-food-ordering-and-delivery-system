'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';

// Update the interface to match the Address interface
interface MapLocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  defaultLocation?: { lat: number; lng: number };
}

// Update the DEFAULT_LOCATION constant
const DEFAULT_LOCATION = { lat: 40.7128, lng: -74.006 };

// Declare google as a global variable
declare global {
  interface Window {
    google: any;
  }
}

export function MapLocationPicker({
  onLocationSelect,
  defaultLocation = DEFAULT_LOCATION,
}: MapLocationPickerProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  }>({
    lat: defaultLocation.lat,
    lng: defaultLocation.lng,
    address: '',
  });
  const mapRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Initialize the map
  useEffect(() => {
    // Check if the Google Maps API is loaded
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    } else {
      initializeMap();
    }
  }, []);

  // Initialize the map
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google) return;

    // Map styles for dark mode
    const darkMapStyle = [
      { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }],
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }],
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }],
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }],
      },
    ];

    const mapOptions: google.maps.MapOptions = {
      center: defaultLocation,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: theme === 'dark' ? darkMapStyle : [],
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    // Create a marker at the default location
    const newMarker = new window.google.maps.Marker({
      position: defaultLocation,
      map: newMap,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });
    setMarker(newMarker);

    // Get address from coordinates
    reverseGeocode(defaultLocation.lat, defaultLocation.lng);

    // Add event listener for marker drag end
    newMarker.addListener('dragend', () => {
      const position = newMarker.getPosition();
      if (position) {
        const lat = position.lat();
        const lng = position.lng();
        reverseGeocode(lat, lng);
      }
    });

    // Add click event listener to the map
    newMap.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        newMarker.setPosition(event.latLng);
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        reverseGeocode(lat, lng);
      }
    });
  }, [defaultLocation, theme]);

  // Update map styles when theme changes
  useEffect(() => {
    if (map && theme) {
      const darkMapStyle = [
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }],
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }],
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{ color: '#263c3f' }],
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#6b9a76' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#38414e' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#212a37' }],
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#9ca5b3' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: '#746855' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#1f2835' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#f3d19c' }],
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{ color: '#2f3948' }],
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#17263c' }],
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#515c6d' }],
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#17263c' }],
        },
      ];

      map.setOptions({
        styles: theme === 'dark' ? darkMapStyle : [],
      });
    }
  }, [map, theme]);

  // Reverse geocode to get address from coordinates
  const reverseGeocode = (lat: number, lng: number) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat, lng } },
      (
        results: google.maps.GeocoderResult[] | null,
        status: google.maps.GeocoderStatus
      ) => {
        if (status === 'OK' && results && results[0]) {
          const address = results[0].formatted_address;
          setSelectedLocation({ lat, lng, address });
          onLocationSelect({ lat, lng, address });
        }
      }
    );
  };

  // Search for a location
  const searchLocation = () => {
    if (!searchQuery || !window.google || !map || !marker) return;

    setIsLoading(true);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { address: searchQuery },
      (
        results: google.maps.GeocoderResult[] | null,
        status: google.maps.GeocoderStatus
      ) => {
        setIsLoading(false);
        if (
          status === 'OK' &&
          results &&
          results[0] &&
          results[0].geometry &&
          results[0].geometry.location
        ) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();

          // Update marker position
          marker.setPosition(location);

          // Center map on the new location
          map.setCenter(location);

          // Update selected location
          const address = results[0].formatted_address;
          setSelectedLocation({ lat, lng, address });
          onLocationSelect({ lat, lng, address });
        }
      }
    );
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
        <div className='flex space-x-2'>
          <Input
            placeholder='Search for a location...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchLocation()}
            className='flex-1 border-blue-200 focus:border-blue-400 dark:border-blue-800/50 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-600'
          />
          <Button
            onClick={searchLocation}
            variant='outline'
            disabled={isLoading}
            className='border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800/50 dark:text-blue-400 dark:hover:bg-blue-900/20'
          >
            {isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Search className='h-4 w-4' />
            )}
          </Button>
        </div>

        <div
          ref={mapRef}
          className='h-[300px] w-full rounded-md border-2 border-blue-200 dark:border-blue-800/50'
        />

        <div className='rounded-md bg-blue-50 p-3 text-sm text-slate-600 dark:bg-blue-900/20 dark:text-slate-300'>
          <p className='font-medium text-blue-700 dark:text-blue-400'>Selected Address:</p>
          <p className='mt-1'>{selectedLocation.address || 'No address selected'}</p>
        </div>
      </CardContent>
      <CardFooter className='border-t border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 text-xs text-slate-500 dark:border-blue-800/50 dark:from-blue-900/20 dark:to-blue-800/20 dark:text-slate-400'>
        Drag the marker or click on the map to select your exact location
      </CardFooter>
    </Card>
  );
}

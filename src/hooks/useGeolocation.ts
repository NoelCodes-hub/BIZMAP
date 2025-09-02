import { useState, useCallback } from 'react';
import { Coordinates } from '@/types/business';

export const useGeolocation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserLocation = useCallback((): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      setIsLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          console.log('Location accuracy:', position.coords.accuracy, 'meters');
          console.log('Coordinates:', coordinates);
          
          setIsLoading(false);
          resolve(coordinates);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLoading(false);
          setError('Could not get your location. Please check your browser settings.');
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    });
  }, []);

  return { getUserLocation, isLoading, error };
};
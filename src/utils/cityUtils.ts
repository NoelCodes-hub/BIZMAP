import { Coordinates, CityCoordinates } from '@/types/business';

export const CITY_COORDINATES: CityCoordinates = {
  'Bulawayo': { lat: -20.1486, lng: 28.5806 },
  'Harare': { lat: -17.8292, lng: 31.0522 },
  'Gweru': { lat: -19.4500, lng: 29.8167 },
  'Mutare': { lat: -18.9667, lng: 32.6167 },
  'Chitungwiza': { lat: -18.0000, lng: 31.1000 },
  'Epworth': { lat: -17.8833, lng: 31.1500 },
  'Kwekwe': { lat: -18.9167, lng: 29.8167 },
  'Kadoma': { lat: -18.3333, lng: 29.9167 },
  'Masvingo': { lat: -20.0667, lng: 30.8333 },
  'Chinhoyi': { lat: -17.3500, lng: 30.2000 }
};

export const getCityCoordinates = (cityName: string): Coordinates | null => {
  return CITY_COORDINATES[cityName] || null;
};

export const extractCityName = (data: any, coordinates: Coordinates): string => {
  const address = data.address;
  
  console.log('Full address data:', address);
  
  let cityName = address?.city ||
    address?.town ||
    address?.village ||
    address?.county ||
    address?.state ||
    'Unknown City';

  // For Zimbabwe, check for specific cities
  if (address?.country === 'Zimbabwe') {
    // Check if we're in Bulawayo area (approximate coordinates)
    if (coordinates.lat >= -20.2 && coordinates.lat <= -20.1 &&
        coordinates.lng >= 28.5 && coordinates.lng <= 28.7) {
      cityName = 'Bulawayo';
    }
    // Check if we're in Harare area (approximate coordinates)
    else if (coordinates.lat >= -17.9 && coordinates.lat <= -17.7 &&
            coordinates.lng >= 31.0 && coordinates.lng <= 31.2) {
      cityName = 'Harare';
    }
  }

  console.log('Extracted city name:', cityName);
  return cityName;
};

export const getCityFromCoordinates = async (coordinates: Coordinates): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}&zoom=10&addressdetails=1`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch city name');
    }

    const data = await response.json();
    return extractCityName(data, coordinates);
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return 'Unknown City';
  }
};
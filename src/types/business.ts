export interface Business {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  type: 'restaurant' | 'fast_food' | 'tourism' | 'banking' | 'telecom' | 'government' | 'education' | 'retail' | 'healthcare' | 'automotive' | 'hotel' | 'entertainment' | 'pharmacy' | 'beauty' | 'business_services' | 'ngo' | 'mall';
  city: string;
  address: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CityCoordinates {
  [key: string]: Coordinates;
}
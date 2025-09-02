export interface Business {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  type: 'restaurant' | 'fast_food' | 'tourism';
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
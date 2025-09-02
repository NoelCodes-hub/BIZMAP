import { Business, Coordinates } from '@/types/business';

export const createSampleData = (coordinates: Coordinates, currentCity: string): Business[] => {
  return [
    {
      id: 1,
      name: "Burger Palace",
      latitude: coordinates.lat + 0.01,
      longitude: coordinates.lng + 0.01,
      type: "fast_food",
      city: currentCity,
      address: "123 Main Street"
    },
    {
      id: 2,
      name: "Fine Dining Restaurant",
      latitude: coordinates.lat - 0.01,
      longitude: coordinates.lng - 0.01,
      type: "restaurant",
      city: currentCity,
      address: "456 Oak Avenue"
    },
    {
      id: 3,
      name: "City Museum",
      latitude: coordinates.lat + 0.005,
      longitude: coordinates.lng - 0.005,
      type: "tourism",
      city: currentCity,
      address: "789 Cultural District"
    },
    {
      id: 4,
      name: "Pizza Express",
      latitude: coordinates.lat - 0.005,
      longitude: coordinates.lng + 0.005,
      type: "fast_food",
      city: currentCity,
      address: "321 Food Court"
    },
    {
      id: 5,
      name: "Gourmet Bistro",
      latitude: coordinates.lat + 0.008,
      longitude: coordinates.lng - 0.008,
      type: "restaurant",
      city: currentCity,
      address: "654 Gourmet Lane"
    }
  ];
};

export const getMarkerColor = (type: string): string => {
  const colors = {
    'restaurant': '#28a745',
    'fast_food': '#ffc107',
    'tourism': '#dc3545'
  };
  return colors[type as keyof typeof colors] || '#007bff';
};
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Business, Coordinates } from '@/types/business';
import { getMarkerColor } from '@/utils/businessUtils';

interface MapViewProps {
  coordinates: Coordinates;
  businesses: Business[];
  onBusinessSelect: (business: Business) => void;
}

const MapView = ({ coordinates, businesses, onBusinessSelect }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current).setView([coordinates.lat, coordinates.lng], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(mapRef.current);

    // Add user location marker
    const userMarker = L.marker([coordinates.lat, coordinates.lng], {
      icon: L.divIcon({
        className: 'custom-marker user-location',
        html: '<div style="background: hsl(var(--primary)); width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
    }).addTo(mapRef.current);

    userMarker.bindPopup('<strong>Your Location</strong><br>This is where you are located.');

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [coordinates]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add business markers with validation
    businesses.forEach(business => {
      // Validate coordinates exist and are numbers
      if (!business.latitude || !business.longitude || 
          typeof business.latitude !== 'number' || typeof business.longitude !== 'number' ||
          isNaN(business.latitude) || isNaN(business.longitude)) {
        console.warn('Skipping business with invalid coordinates:', business.name);
        return;
      }

      try {
        const marker = L.marker([business.latitude, business.longitude], {
          icon: L.divIcon({
            className: `custom-marker ${business.type}`,
            html: `<div style="background: ${getMarkerColor(business.type)}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })
        });

        if (mapRef.current) {
          marker.addTo(mapRef.current);
        }

        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h4 style="margin: 0 0 8px 0; color: #333;">${business.name}</h4>
            <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: capitalize;">${business.type.replace('_', ' ')}</p>
            <p style="margin: 0; color: #888; font-size: 11px;">${business.address}</p>
          </div>
        `);

        marker.on('click', () => {
          onBusinessSelect(business);
        });

        markersRef.current.push(marker);
      } catch (error) {
        console.error('Error creating marker for business:', business.name, error);
      }
    });
  }, [businesses, onBusinessSelect]);

  const centerOnCoordinates = (coords: Coordinates, zoom = 16) => {
    if (mapRef.current) {
      mapRef.current.setView([coords.lat, coords.lng], zoom);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="absolute inset-0 rounded-lg shadow-lg" />
    </div>
  );
};

export default MapView;
export { MapView };
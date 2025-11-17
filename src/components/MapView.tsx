import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { Coordinates } from '@/types/business';

interface MapViewProps {
  coordinates: Coordinates;
  targetCoordinates?: Coordinates | null;
  onLandMarkerAdd?: (coordinates: Coordinates) => void;
}

const MapView = ({ coordinates, targetCoordinates, onLandMarkerAdd }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const landMarkersRef = useRef<L.Marker[]>([]);
  const routingControlRef = useRef<any>(null);

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

    // Add double right-click event for land markers
    const handleDoubleRightClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      // Create land marker
      const landMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'custom-marker land-marker',
          html: '<div style="background: hsl(var(--destructive)); width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      }).addTo(mapRef.current!);

      landMarker.bindPopup(`
        <div style="min-width: 150px;">
          <h4 style="margin: 0 0 8px 0; color: #333;">Land Marker</h4>
          <p style="margin: 0; color: #666; font-size: 11px;">Lat: ${lat.toFixed(6)}</p>
          <p style="margin: 0; color: #666; font-size: 11px;">Lng: ${lng.toFixed(6)}</p>
          <button onclick="this.closest('.leaflet-popup').remove(); document.querySelector('.leaflet-marker-pane').lastChild.remove();" style="margin-top: 8px; padding: 4px 8px; background: hsl(var(--destructive)); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">Remove</button>
        </div>
      `);

      landMarkersRef.current.push(landMarker);
      
      // Call callback if provided
      if (onLandMarkerAdd) {
        onLandMarkerAdd({ lat, lng });
      }
    };

    let rightClickCount = 0;
    let rightClickTimer: NodeJS.Timeout;

    mapRef.current.on('contextmenu', (e: L.LeafletMouseEvent) => {
      rightClickCount++;
      
      if (rightClickCount === 1) {
        rightClickTimer = setTimeout(() => {
          rightClickCount = 0;
        }, 300);
      } else if (rightClickCount === 2) {
        clearTimeout(rightClickTimer);
        rightClickCount = 0;
        handleDoubleRightClick(e);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.off('contextmenu');
      }
      if (rightClickTimer) {
        clearTimeout(rightClickTimer);
      }
    };
  }, [onLandMarkerAdd]);

  // Handle routing
  useEffect(() => {
    if (!mapRef.current || !targetCoordinates) {
      // Remove existing route if no target
      if (routingControlRef.current) {
        mapRef.current?.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      return;
    }

    // Remove existing route
    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
    }

    // Create new routing control
    routingControlRef.current = (L as any).Routing.control({
      waypoints: [
        L.latLng(coordinates.lat, coordinates.lng),
        L.latLng(targetCoordinates.lat, targetCoordinates.lng)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: 'hsl(217, 91%, 60%)', opacity: 0.8, weight: 6 }]
      },
      createMarker: () => null, // Don't create default markers
    }).addTo(mapRef.current);

    return () => {
      if (routingControlRef.current && mapRef.current) {
        mapRef.current.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [coordinates, targetCoordinates]);

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
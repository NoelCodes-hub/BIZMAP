import { useEffect, useRef, useCallback, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import 'leaflet.markercluster';
import { Business, Coordinates } from '@/types/business';
import { getMarkerColor } from '@/utils/businessUtils';
import FogOfWarOverlay from '@/components/smart/FogOfWarOverlay';
import VibeCheck from '@/components/smart/VibeCheck';

interface ClusteredMapViewProps {
  coordinates: Coordinates;
  businesses: Business[];
  highlightedBusinesses?: Business[];
  targetCoordinates?: Coordinates | null;
  showHeatmap?: boolean;
  showFogOfWar?: boolean;
  onBusinessSelect?: (business: Business) => void;
  onLandMarkerAdd?: (coordinates: Coordinates) => void;
}

const ClusteredMapView = ({ 
  coordinates, 
  businesses,
  highlightedBusinesses,
  targetCoordinates,
  showHeatmap = false,
  showFogOfWar = false,
  onBusinessSelect,
  onLandMarkerAdd
}: ClusteredMapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const heatLayerRef = useRef<any>(null);
  const routingControlRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current).setView([coordinates.lat, coordinates.lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(mapRef.current);

    // User location marker
    L.marker([coordinates.lat, coordinates.lng], {
      icon: L.divIcon({
        className: 'user-marker',
        html: `<div style="
          width: 24px; height: 24px; 
          background: hsl(217, 91%, 60%); 
          border: 3px solid white; 
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    }).addTo(mapRef.current)
      .bindPopup('<strong>Your Location</strong>');

    // Initialize cluster group
    clusterGroupRef.current = (L as any).markerClusterGroup({
      chunkedLoading: true,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 60,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        let size = 'small';
        let sizeClass = 40;
        
        if (count >= 50) {
          size = 'large';
          sizeClass = 60;
        } else if (count >= 20) {
          size = 'medium';
          sizeClass = 50;
        }

        return L.divIcon({
          html: `<div class="cluster-icon ${size}" style="
            width: ${sizeClass}px;
            height: ${sizeClass}px;
            background: linear-gradient(135deg, hsl(217, 91%, 60%), hsl(280, 70%, 60%));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${count >= 50 ? '16px' : '14px'};
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          ">${count}</div>`,
          className: 'marker-cluster',
          iconSize: L.point(sizeClass, sizeClass)
        });
      }
    });
    
    mapRef.current.addLayer(clusterGroupRef.current);
    setMapReady(true);

    // Double right-click for land markers
    let rightClickCount = 0;
    let rightClickTimer: NodeJS.Timeout;

    mapRef.current.on('contextmenu', (e: L.LeafletMouseEvent) => {
      rightClickCount++;
      if (rightClickCount === 1) {
        rightClickTimer = setTimeout(() => { rightClickCount = 0; }, 300);
      } else if (rightClickCount === 2) {
        clearTimeout(rightClickTimer);
        rightClickCount = 0;
        onLandMarkerAdd?.({ lat: e.latlng.lat, lng: e.latlng.lng });
        
        L.marker([e.latlng.lat, e.latlng.lng], {
          icon: L.divIcon({
            html: `<div style="
              width: 24px; height: 24px;
              background: hsl(280, 70%, 60%);
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            "></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
        }).addTo(mapRef.current!)
          .bindPopup(`<strong>Marker</strong><br>Lat: ${e.latlng.lat.toFixed(5)}<br>Lng: ${e.latlng.lng.toFixed(5)}`);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update center when coordinates change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([coordinates.lat, coordinates.lng], mapRef.current.getZoom());
    }
  }, [coordinates]);

  // Add business markers to cluster
  useEffect(() => {
    if (!clusterGroupRef.current || !mapReady) return;

    clusterGroupRef.current.clearLayers();

    const displayBusinesses = highlightedBusinesses?.length ? highlightedBusinesses : businesses;

    displayBusinesses.forEach((business) => {
      const color = getMarkerColor(business.type);
      const isHighlighted = highlightedBusinesses?.some(b => b.id === business.id);
      
      const marker = L.marker([business.latitude, business.longitude], {
        icon: L.divIcon({
          html: `<div style="
            width: ${isHighlighted ? '32px' : '24px'}; 
            height: ${isHighlighted ? '32px' : '24px'};
            background: ${color};
            border: 3px solid ${isHighlighted ? 'hsl(280, 70%, 60%)' : 'white'};
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ${isHighlighted ? 'animation: pulse 2s infinite;' : ''}
          "></div>`,
          iconSize: isHighlighted ? [32, 32] : [24, 24],
          iconAnchor: isHighlighted ? [16, 16] : [12, 12]
        })
      });

      marker.bindPopup(`
        <div style="min-width: 180px;">
          <h3 style="margin: 0 0 4px; font-weight: bold;">${business.name}</h3>
          <p style="margin: 0; color: #666; font-size: 12px;">${business.type.replace('_', ' ')}</p>
          <p style="margin: 4px 0 0; font-size: 11px;">${business.address || ''}</p>
        </div>
      `);

      marker.on('click', () => onBusinessSelect?.(business));
      clusterGroupRef.current!.addLayer(marker);
    });
  }, [businesses, highlightedBusinesses, mapReady, onBusinessSelect]);

  // Handle heatmap
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (showHeatmap && businesses.length > 0) {
      const heatData = businesses.map(b => [b.latitude, b.longitude, 0.5]);
      
      // Dynamic import for leaflet.heat
      import('leaflet.heat').then(() => {
        if (mapRef.current) {
          heatLayerRef.current = (L as any).heatLayer(heatData, {
            radius: 25,
            blur: 15,
            maxZoom: 16,
            gradient: {
              0.2: 'hsl(217, 91%, 60%)',
              0.4: 'hsl(190, 95%, 50%)',
              0.6: 'hsl(142, 71%, 45%)',
              0.8: 'hsl(47, 96%, 53%)',
              1.0: 'hsl(0, 72%, 51%)'
            }
          }).addTo(mapRef.current);
        }
      });
    }
  }, [showHeatmap, businesses, mapReady]);

  // Handle routing
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    if (targetCoordinates) {
      routingControlRef.current = (L as any).Routing.control({
        waypoints: [
          L.latLng(coordinates.lat, coordinates.lng),
          L.latLng(targetCoordinates.lat, targetCoordinates.lng)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: true,
        lineOptions: {
          styles: [{ color: 'hsl(217, 91%, 60%)', opacity: 0.8, weight: 6 }]
        },
        createMarker: () => null
      }).addTo(mapRef.current);
    }
  }, [coordinates, targetCoordinates, mapReady]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="absolute inset-0 rounded-lg shadow-lg" />
      {showFogOfWar && <FogOfWarOverlay map={mapRef.current} enabled={showFogOfWar} />}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default ClusteredMapView;

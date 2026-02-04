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
  enableLiveTracking?: boolean;
  onBusinessSelect?: (business: Business) => void;
  onLandMarkerAdd?: (coordinates: Coordinates) => void;
}

// Marker colors that cycle on double-click
const MARKER_COLORS = [
  'hsl(280, 70%, 60%)',  // Purple
  'hsl(340, 82%, 52%)',  // Pink
  'hsl(25, 95%, 53%)',   // Orange
  'hsl(142, 71%, 45%)',  // Green
  'hsl(190, 95%, 50%)',  // Cyan
  'hsl(47, 96%, 53%)',   // Yellow
];

const ClusteredMapView = ({ 
  coordinates, 
  businesses,
  highlightedBusinesses,
  targetCoordinates,
  showHeatmap = false,
  showFogOfWar = false,
  enableLiveTracking = false,
  onBusinessSelect,
  onLandMarkerAdd
}: ClusteredMapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const heatLayerRef = useRef<any>(null);
  const routingControlRef = useRef<any>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const landMarkersRef = useRef<L.Marker[]>([]);
  const colorIndexRef = useRef(0);
  const [mapReady, setMapReady] = useState(false);

  // Create pulsing user marker icon
  const createUserMarkerIcon = () => {
    return L.divIcon({
      className: 'user-marker-pulsing',
      html: `
        <div class="user-location-container">
          <div class="user-pulse-ring"></div>
          <div class="user-pulse-ring delay"></div>
          <div class="user-dot"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current).setView([coordinates.lat, coordinates.lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(mapRef.current);

    // User location marker with pulsing effect
    userMarkerRef.current = L.marker([coordinates.lat, coordinates.lng], {
      icon: createUserMarkerIcon()
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

    // Helper to create marker popup with actions
    const createMarkerPopup = (marker: L.Marker, markerIndex: number, currentColor: string, currentLabel: string) => {
      const colorButtons = MARKER_COLORS.map((c, i) => 
        `<button class="land-marker-color-btn" data-color="${c}" data-index="${i}" style="
          width: 20px; height: 20px;
          background: ${c};
          border: 2px solid ${c === currentColor ? 'hsl(217, 91%, 60%)' : 'white'};
          border-radius: 50%;
          cursor: pointer;
          margin: 2px;
        "></button>`
      ).join('');

      return `
        <div class="land-marker-popup" data-marker-index="${markerIndex}">
          <input type="text" class="land-marker-label-input" value="${currentLabel}" placeholder="Enter label..." style="
            width: 100%;
            padding: 8px;
            border: 1px solid hsl(217, 91%, 60%);
            border-radius: 4px;
            margin-bottom: 8px;
            font-size: 14px;
            outline: none;
          " />
          <div style="margin: 8px 0; display: flex; flex-wrap: wrap; gap: 2px;">
            ${colorButtons}
          </div>
          <button class="land-marker-delete-btn" style="
            width: 100%;
            padding: 6px 12px;
            background: hsl(0, 72%, 51%);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
          ">Delete Marker</button>
        </div>
      `;
    };

    // Helper to update marker icon with color and label
    const updateMarkerIcon = (marker: L.Marker, color: string, label: string) => {
      const hasLabel = label.trim().length > 0;
      marker.setIcon(L.divIcon({
        html: `<div style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        ">
          <div style="
            width: 24px; height: 24px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            transition: transform 0.2s;
          "></div>
          ${hasLabel ? `<div style="
            position: absolute;
            top: 28px;
            background: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            color: ${color};
            white-space: nowrap;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
          ">${label}</div>` : ''}
        </div>`,
        iconSize: [24, hasLabel ? 50 : 24],
        iconAnchor: [12, 12]
      }));
    };

    // Double right-click for land markers with color cycling
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
        
        // Get next color in cycle
        const color = MARKER_COLORS[colorIndexRef.current % MARKER_COLORS.length];
        colorIndexRef.current++;
        const markerIndex = landMarkersRef.current.length;
        
        const marker = L.marker([e.latlng.lat, e.latlng.lng], {
          icon: L.divIcon({
            html: `<div style="
              width: 24px; height: 24px;
              background: ${color};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
              transition: transform 0.2s;
            "></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
        }).addTo(mapRef.current!);

        // Store current color and label on marker
        (marker as any)._currentColor = color;
        (marker as any)._currentLabel = '';
        
        marker.bindPopup(createMarkerPopup(marker, markerIndex, color, ''));
        
        // Handle popup open to attach event listeners
        marker.on('popupopen', () => {
          const popup = marker.getPopup();
          if (!popup) return;
          
          const container = popup.getElement();
          if (!container) return;

          // Label input
          const labelInput = container.querySelector('.land-marker-label-input') as HTMLInputElement;
          labelInput?.addEventListener('change', (e) => {
            const newLabel = (e.target as HTMLInputElement).value;
            (marker as any)._currentLabel = newLabel;
            updateMarkerIcon(marker, (marker as any)._currentColor, newLabel);
          });
          labelInput?.addEventListener('keypress', (e) => {
            if ((e as KeyboardEvent).key === 'Enter') {
              const newLabel = (e.target as HTMLInputElement).value;
              (marker as any)._currentLabel = newLabel;
              updateMarkerIcon(marker, (marker as any)._currentColor, newLabel);
              marker.closePopup();
            }
          });

          // Color change buttons
          container.querySelectorAll('.land-marker-color-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
              const newColor = (e.target as HTMLElement).dataset.color;
              if (newColor) {
                (marker as any)._currentColor = newColor;
                const currentLabel = (marker as any)._currentLabel || '';
                updateMarkerIcon(marker, newColor, currentLabel);
                marker.setPopupContent(createMarkerPopup(marker, markerIndex, newColor, currentLabel));
              }
            });
          });

          // Delete button
          container.querySelector('.land-marker-delete-btn')?.addEventListener('click', () => {
            marker.closePopup();
            mapRef.current?.removeLayer(marker);
            const idx = landMarkersRef.current.indexOf(marker);
            if (idx > -1) {
              landMarkersRef.current.splice(idx, 1);
            }
          });
        });
        
        landMarkersRef.current.push(marker);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update center and user marker when coordinates change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([coordinates.lat, coordinates.lng], mapRef.current.getZoom());
      
      // Update user marker position for live tracking
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([coordinates.lat, coordinates.lng]);
      }
    }
  }, [coordinates]);

  // Live GPS tracking effect
  useEffect(() => {
    if (!enableLiveTracking || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (userMarkerRef.current && mapRef.current) {
          userMarkerRef.current.setLatLng([latitude, longitude]);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enableLiveTracking]);

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
        
        .user-location-container {
          position: relative;
          width: 40px;
          height: 40px;
        }
        
        .user-pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 40px;
          height: 40px;
          margin: -20px 0 0 -20px;
          border-radius: 50%;
          background: hsl(217, 91%, 60%);
          opacity: 0;
          animation: userPulse 2s ease-out infinite;
        }
        
        .user-pulse-ring.delay {
          animation-delay: 1s;
        }
        
        .user-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 16px;
          height: 16px;
          margin: -8px 0 0 -8px;
          background: hsl(217, 91%, 60%);
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        @keyframes userPulse {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ClusteredMapView;

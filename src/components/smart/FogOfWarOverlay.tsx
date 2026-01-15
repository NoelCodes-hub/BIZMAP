import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useFogOfWar } from '@/hooks/useFogOfWar';
import { Award, Map } from 'lucide-react';

interface FogOfWarOverlayProps {
  map: L.Map | null;
  enabled?: boolean;
  onCellExplored?: () => void;
}

const FogOfWarOverlay = ({ map, enabled = true, onCellExplored }: FogOfWarOverlayProps) => {
  const { 
    exploredCells, 
    totalExplored, 
    exploreLocation, 
    getExploredCellBounds,
    CELL_SIZE 
  } = useFogOfWar();
  
  const fogLayerRef = useRef<L.LayerGroup | null>(null);
  const exploredLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!map || !enabled) return;

    // Create layer groups
    fogLayerRef.current = L.layerGroup().addTo(map);
    exploredLayerRef.current = L.layerGroup().addTo(map);

    // Track map movement to check for new exploration
    const handleMoveEnd = async () => {
      const center = map.getCenter();
      const isNew = await exploreLocation(center.lat, center.lng);
      if (isNew && onCellExplored) {
        onCellExplored();
      }
    };

    map.on('moveend', handleMoveEnd);
    handleMoveEnd(); // Check initial position

    return () => {
      map.off('moveend', handleMoveEnd);
      if (fogLayerRef.current) {
        map.removeLayer(fogLayerRef.current);
      }
      if (exploredLayerRef.current) {
        map.removeLayer(exploredLayerRef.current);
      }
    };
  }, [map, enabled, exploreLocation, onCellExplored]);

  // Update visualization when explored cells change
  useEffect(() => {
    if (!map || !exploredLayerRef.current || !enabled) return;

    exploredLayerRef.current.clearLayers();
    
    const bounds = getExploredCellBounds();
    bounds.forEach(cell => {
      const rectangle = L.rectangle(
        [[cell.south, cell.west], [cell.north, cell.east]],
        {
          color: 'hsl(217, 91%, 60%)',
          weight: 1,
          fillOpacity: 0.1,
          fillColor: 'hsl(217, 91%, 60%)',
          interactive: false
        }
      );
      exploredLayerRef.current?.addLayer(rectangle);
    });
  }, [map, exploredCells, getExploredCellBounds, enabled]);

  if (!enabled) return null;

  return (
    <div className="absolute top-20 left-4 z-[1000] glass-morphism rounded-lg p-3 space-y-1">
      <div className="flex items-center gap-2">
        <Map className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Explored</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-2xl font-bold text-primary">{totalExplored}</div>
        <span className="text-xs text-muted-foreground">cells</span>
      </div>
      {totalExplored >= 10 && (
        <div className="flex items-center gap-1 text-xs text-primary">
          <Award className="h-3 w-3" />
          Explorer!
        </div>
      )}
    </div>
  );
};

export default FogOfWarOverlay;

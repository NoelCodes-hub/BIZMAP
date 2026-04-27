import { useState, useRef, useEffect } from 'react';
import { Navigation, Compass, Search, Route, X, GripVertical } from 'lucide-react';
import { Button } from './ui/button';

interface MapControlsProps {
  onNavigateToUser: () => void;
  onRecenterMap: () => void;
  onGoToProducts: () => void;
  onRouteToggle: () => void;
  onClearRoute: () => void;
  isRoutingActive: boolean;
  isGettingLocation?: boolean;
  hasTargetMarker?: boolean;
}

const STORAGE_KEY = 'mapcontrols-position';

const MapControls = ({
  onNavigateToUser,
  onRecenterMap,
  onGoToProducts,
  onRouteToggle,
  onClearRoute,
  isRoutingActive,
  isGettingLocation = false,
  hasTargetMarker = false,
}: MapControlsProps) => {
  // Default position: top-right area, dropped below header
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { x: window.innerWidth - 80, y: 80 };
  });

  const dragRef = useRef<{ offsetX: number; offsetY: number; dragging: boolean }>({
    offsetX: 0,
    offsetY: 0,
    dragging: false,
  });
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
    } catch {}
  }, [position]);

  const clamp = (x: number, y: number) => {
    const el = panelRef.current;
    const w = el?.offsetWidth ?? 56;
    const h = el?.offsetHeight ?? 300;
    return {
      x: Math.max(8, Math.min(window.innerWidth - w - 8, x)),
      y: Math.max(8, Math.min(window.innerHeight - h - 8, y)),
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      dragging: true,
    };
    (e.target as Element).setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return;
    const next = clamp(e.clientX - dragRef.current.offsetX, e.clientY - dragRef.current.offsetY);
    setPosition(next);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragRef.current.dragging = false;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      ref={panelRef}
      className="fixed z-[1000] flex flex-col gap-3"
      style={{ left: position.x, top: position.y, touchAction: 'none' }}
    >
      {/* Drag handle */}
      <button
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="map-overlay-button w-12 h-6 p-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
        title="Drag to reposition"
        aria-label="Drag controls"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Navigate to My GPS Location */}
      <Button
        onClick={onNavigateToUser}
        disabled={isGettingLocation}
        className="map-overlay-button w-12 h-12 p-0"
        title="Navigate to my GPS location"
      >
        <Compass className={`h-5 w-5 ${isGettingLocation ? 'animate-spin' : ''}`} />
      </Button>

      {/* Go to Products Page */}
      <Button
        onClick={onGoToProducts}
        className="map-overlay-button w-12 h-12 p-0"
        title="Find products"
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Route Toggle */}
      <Button
        onClick={onRouteToggle}
        className={`map-overlay-button w-12 h-12 p-0 ${
          isRoutingActive ? 'bg-primary text-primary-foreground' : ''
        }`}
        title={isRoutingActive ? 'Deactivate route' : 'Activate route to marker'}
      >
        <Route className="h-5 w-5" />
      </Button>

      {/* Clear Route */}
      {(hasTargetMarker || isRoutingActive) && (
        <Button
          onClick={onClearRoute}
          variant="destructive"
          className="w-12 h-12 p-0"
          title="Clear route and markers"
        >
          <X className="h-5 w-5" />
        </Button>
      )}

      {/* Recenter Map */}
      <Button
        onClick={onRecenterMap}
        className="map-overlay-button w-12 h-12 p-0"
        title="Recenter map to my location"
      >
        <Navigation className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MapControls;

import { Navigation, Compass, Search, Route } from 'lucide-react';
import { Button } from './ui/button';

interface MapControlsProps {
  onNavigateToUser: () => void;
  onRecenterMap: () => void;
  onGoToProducts: () => void;
  onRouteToggle: () => void;
  onClearRoute: () => void;
  isRoutingActive: boolean;
  isGettingLocation?: boolean;
}

const MapControls = ({ 
  onNavigateToUser, 
  onRecenterMap,
  onGoToProducts, 
  onRouteToggle,
  onClearRoute,
  isRoutingActive,
  isGettingLocation = false
}: MapControlsProps) => {

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
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
        title={isRoutingActive ? "Deactivate route" : "Activate route to marker"}
      >
        <Route className="h-5 w-5" />
      </Button>

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

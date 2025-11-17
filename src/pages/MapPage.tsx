import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/useGeolocation';
import MapView from '@/components/MapView';
import MapControls from '@/components/MapControls';
import FavoritesPanel from '@/components/FavoritesPanel';
import { Coordinates } from '@/types/business';
import { getCityCoordinates } from '@/utils/cityUtils';
import { useFavorites } from '@/hooks/useFavorites';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MapPage = () => {
  const [currentCoordinates, setCurrentCoordinates] = useState<Coordinates>(
    getCityCoordinates('Bulawayo')!
  );
  const [targetMarker, setTargetMarker] = useState<Coordinates | null>(null);
  const [isRoutingActive, setIsRoutingActive] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  
  const { toast } = useToast();
  const { getUserLocation } = useGeolocation();
  const { addFavorite } = useFavorites();

  const handleNavigateToUser = async () => {
    try {
      const coords = await getUserLocation();
      setCurrentCoordinates(coords);
      toast({
        title: "Location updated",
        description: "Map centered on your location",
      });
    } catch (error) {
      toast({
        title: "Location error",
        description: "Could not get your location",
        variant: "destructive",
      });
    }
  };

  const handleProductSearch = (query: string) => {
    toast({
      title: "Searching...",
      description: `Looking for businesses offering "${query}"`,
    });
    // Implement product search logic here
  };

  const handleRouteRequest = useCallback(() => {
    if (targetMarker) {
      setIsRoutingActive(!isRoutingActive);
      toast({
        title: isRoutingActive ? "Route cleared" : "Route activated",
        description: isRoutingActive 
          ? "Navigation route removed" 
          : "Showing route to marker",
      });
    } else {
      toast({
        title: "No destination",
        description: "Double right-click to place a marker first",
        variant: "destructive",
      });
    }
  }, [targetMarker, isRoutingActive, toast]);

  const handleLandMarkerAdd = useCallback((coords: Coordinates) => {
    setTargetMarker(coords);
    setIsRoutingActive(false);
    toast({
      title: "Marker placed",
      description: "Click the route button to navigate here",
    });
  }, [toast]);

  const handleSaveLocation = useCallback(() => {
    if (targetMarker) {
      const name = `Location ${new Date().toLocaleTimeString()}`;
      addFavorite('location', name, { coordinates: targetMarker });
    } else {
      toast({
        title: "No location selected",
        description: "Please place a marker first",
        variant: "destructive",
      });
    }
  }, [targetMarker, addFavorite, toast]);

  const handleSelectFavoriteLocation = useCallback((coords: Coordinates) => {
    setCurrentCoordinates(coords);
    toast({
      title: "Location loaded",
      description: "Map centered on saved location",
    });
  }, [toast]);

  return (
    <div className="relative h-screen">
      <MapView
        coordinates={currentCoordinates}
        targetCoordinates={isRoutingActive ? targetMarker : undefined}
        onLandMarkerAdd={handleLandMarkerAdd}
      />
      
      <MapControls
        onNavigateToUser={handleNavigateToUser}
        onProductSearch={handleProductSearch}
        onRouteRequest={handleRouteRequest}
        isRoutingActive={isRoutingActive}
      />

      {/* Favorites and Save buttons */}
      <div className="absolute top-4 left-4 z-[1000] flex gap-2">
        <Button
          onClick={() => setShowFavorites(!showFavorites)}
          variant="secondary"
          size="sm"
          className="shadow-lg"
        >
          <Star className="h-4 w-4 mr-2" />
          Favorites
        </Button>
        {targetMarker && (
          <Button
            onClick={handleSaveLocation}
            variant="secondary"
            size="sm"
            className="shadow-lg"
          >
            <Star className="h-4 w-4 mr-2 fill-primary" />
            Save Location
          </Button>
        )}
      </div>

      {showFavorites && (
        <FavoritesPanel
          onSelectLocation={handleSelectFavoriteLocation}
          onClose={() => setShowFavorites(false)}
        />
      )}
    </div>
  );
};

export default MapPage;

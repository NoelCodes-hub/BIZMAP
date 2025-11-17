import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/useGeolocation';
import MapView from '@/components/MapView';
import MapControls from '@/components/MapControls';
import { Coordinates } from '@/types/business';
import { getCityCoordinates } from '@/utils/cityUtils';

const MapPage = () => {
  const [currentCoordinates, setCurrentCoordinates] = useState<Coordinates>(
    getCityCoordinates('Bulawayo')!
  );
  const [targetMarker, setTargetMarker] = useState<Coordinates | null>(null);
  const [isRoutingActive, setIsRoutingActive] = useState(false);
  
  const { toast } = useToast();
  const { getUserLocation } = useGeolocation();

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
    </div>
  );
};

export default MapPage;

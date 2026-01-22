import { useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/useGeolocation';
import ClusteredMapView from '@/components/ClusteredMapView';
import MapControls from '@/components/MapControls';
import FavoritesPanel from '@/components/FavoritesPanel';
import ConversationalSearch from '@/components/smart/ConversationalSearch';
import { Coordinates, Business } from '@/types/business';
import { getCityCoordinates } from '@/utils/cityUtils';
import { createSampleData } from '@/utils/businessUtils';
import { useFavorites } from '@/hooks/useFavorites';
import { Star, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MapPage = () => {
  const [currentCoordinates, setCurrentCoordinates] = useState<Coordinates>(
    getCityCoordinates('Bulawayo')!
  );
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [targetMarker, setTargetMarker] = useState<Coordinates | null>(null);
  const [isRoutingActive, setIsRoutingActive] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const mapRef = useRef<{ centerOnUser: () => void } | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getUserLocation, isLoading: isGettingLocation } = useGeolocation();
  const { addFavorite } = useFavorites();
  
  // Get all businesses for current location
  const allBusinesses = useMemo(() => 
    createSampleData(currentCoordinates, 'Bulawayo'), 
    [currentCoordinates]
  );
  
  // Use filtered businesses if search is active, otherwise all
  const displayedBusinesses = filteredBusinesses.length > 0 || showSearch 
    ? filteredBusinesses 
    : allBusinesses;

  const handleSearchResults = useCallback((businesses: Business[]) => {
    setFilteredBusinesses(businesses);
  }, []);

  const handleBusinessSelect = useCallback((business: Business) => {
    setCurrentCoordinates({ lat: business.latitude, lng: business.longitude });
    toast({
      title: business.name,
      description: business.address,
    });
  }, [toast]);

  const handleNavigateToUser = async () => {
    try {
      const coords = await getUserLocation();
      setUserLocation(coords);
      setCurrentCoordinates(coords);
      toast({
        title: "Location updated",
        description: `Located at ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`,
      });
    } catch (error) {
      toast({
        title: "Location error",
        description: "Could not get your location. Please enable location services.",
        variant: "destructive",
      });
    }
  };

  const handleRecenterMap = useCallback(() => {
    if (userLocation) {
      setCurrentCoordinates(userLocation);
      toast({
        title: "Map recentered",
        description: "Returned to your location",
      });
    } else {
      // If no user location yet, get it first
      handleNavigateToUser();
    }
  }, [userLocation, toast]);

  const handleGoToProducts = () => {
    navigate('/products');
  };

  const handleRouteToggle = useCallback(() => {
    if (!targetMarker) {
      toast({
        title: "No destination set",
        description: "Double right-click on the map to place a destination marker first",
        variant: "destructive",
      });
      return;
    }

    const newRoutingState = !isRoutingActive;
    setIsRoutingActive(newRoutingState);
    
    toast({
      title: newRoutingState ? "Route activated" : "Route deactivated",
      description: newRoutingState 
        ? "Showing road route to destination" 
        : "Route cleared from map",
    });
  }, [targetMarker, isRoutingActive, toast]);

  const handleClearRoute = useCallback(() => {
    setIsRoutingActive(false);
    setTargetMarker(null);
    toast({
      title: "Route cleared",
      description: "Destination marker and route removed",
    });
  }, [toast]);

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
      <ClusteredMapView
        coordinates={currentCoordinates}
        businesses={displayedBusinesses}
        targetCoordinates={isRoutingActive ? targetMarker : undefined}
        onLandMarkerAdd={handleLandMarkerAdd}
        onBusinessSelect={handleBusinessSelect}
        showHeatmap={false}
      />
      
      <MapControls
        onNavigateToUser={handleNavigateToUser}
        onRecenterMap={handleRecenterMap}
        onGoToProducts={handleGoToProducts}
        onRouteToggle={handleRouteToggle}
        onClearRoute={handleClearRoute}
        isRoutingActive={isRoutingActive}
        isGettingLocation={isGettingLocation}
      />

      {/* AI Search Panel */}
      {showSearch && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-lg px-4">
          <div className="bg-card border border-border rounded-lg shadow-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Search
              </h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                setShowSearch(false);
                setFilteredBusinesses([]);
              }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ConversationalSearch
              businesses={allBusinesses}
              onResultsFound={handleSearchResults}
              onBusinessSelect={handleBusinessSelect}
            />
          </div>
        </div>
      )}

      {/* Favorites, Save, and Search buttons */}
      <div className="absolute top-4 left-20 z-[1000] flex gap-2">
        <Button
          onClick={() => setShowSearch(!showSearch)}
          variant="secondary"
          size="sm"
          className="shadow-lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI Search
        </Button>
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

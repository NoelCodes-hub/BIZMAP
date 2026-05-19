import { useState, useCallback, useMemo } from 'react';
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
import { Star, Sparkles, X, Crosshair, Copy, Check, Search, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  const [coordinatePickerMode, setCoordinatePickerMode] = useState(false);
  const [pickedCoords, setPickedCoords] = useState<Coordinates | null>(null);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [addressQuery, setAddressQuery] = useState('');
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getUserLocation, isLoading: isGettingLocation } = useGeolocation();
  const { addFavorite, favorites } = useFavorites();
  const favoritesCount = favorites.length;
  
  const allBusinesses = useMemo(() => 
    createSampleData(currentCoordinates, 'Bulawayo'), 
    [currentCoordinates]
  );
  
  const displayedBusinesses = filteredBusinesses.length > 0 || showSearch 
    ? filteredBusinesses 
    : allBusinesses;

  const handleSearchResults = useCallback((businesses: Business[]) => {
    setFilteredBusinesses(businesses);
  }, []);

  const handleBusinessSelect = useCallback((business: Business) => {
    setCurrentCoordinates({ lat: business.latitude, lng: business.longitude });
    toast({ title: business.name, description: business.address });
  }, [toast]);

  const handleNavigateToUser = async () => {
    try {
      const coords = await getUserLocation();
      setUserLocation(coords);
      setCurrentCoordinates(coords);
      toast({ title: "Location updated", description: `Located at ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` });
    } catch {
      toast({ title: "Location error", description: "Could not get your location. Please enable location services.", variant: "destructive" });
    }
  };

  const handleRecenterMap = useCallback(() => {
    if (userLocation) {
      setCurrentCoordinates(userLocation);
      toast({ title: "Map recentered", description: "Returned to your location" });
    } else {
      handleNavigateToUser();
    }
  }, [userLocation, toast]);

  const handleGoToProducts = () => navigate('/products');

  const handleRouteToggle = useCallback(() => {
    if (!targetMarker) {
      toast({ title: "No destination set", description: "Double right-click on the map to place a destination marker first", variant: "destructive" });
      return;
    }
    const newState = !isRoutingActive;
    setIsRoutingActive(newState);
    toast({ title: newState ? "Route activated" : "Route deactivated", description: newState ? "Showing road route to destination" : "Route cleared from map" });
  }, [targetMarker, isRoutingActive, toast]);

  const handleClearRoute = useCallback(() => {
    setIsRoutingActive(false);
    setTargetMarker(null);
    toast({ title: "Route cleared", description: "Destination marker and route removed" });
  }, [toast]);

  const handleLandMarkerAdd = useCallback((coords: Coordinates) => {
    setTargetMarker(coords);
    setIsRoutingActive(false);
    toast({ title: "Marker placed", description: "Click the route button to navigate here" });
  }, [toast]);

  const handleSaveFavorite = useCallback((name: string, coords: Coordinates, type: 'location' | 'business') => {
    addFavorite(type, name, { coordinates: coords });
  }, [addFavorite]);

  const handleSelectFavoriteLocation = useCallback((coords: Coordinates) => {
    // Nudge coords slightly to force re-trigger even if same favorite is reselected
    setCurrentCoordinates({ lat: coords.lat + (Math.random() - 0.5) * 1e-9, lng: coords.lng });
    setTargetMarker(coords);
    toast({ title: "Location loaded", description: "Map centered on saved favorite" });
  }, [toast]);

  const handleCoordinatePicked = useCallback((coords: Coordinates) => {
    setPickedCoords(coords);
    toast({ title: "Coordinates picked", description: `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}` });
  }, [toast]);

  const copyPickedCoords = () => {
    if (pickedCoords) {
      navigator.clipboard.writeText(`${pickedCoords.lat.toFixed(6)}, ${pickedCoords.lng.toFixed(6)}`);
      setCopiedCoords(true);
      toast({ title: "Copied!", description: "Coordinates copied to clipboard" });
      setTimeout(() => setCopiedCoords(false), 2000);
    }
  };

  const handleAddressSearch = async () => {
    if (!addressQuery.trim()) return;
    setIsSearchingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const coords = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setCurrentCoordinates(coords);
        toast({ title: "Location found", description: display_name.substring(0, 80) });
      } else {
        toast({ title: "Not found", description: "No results for that address", variant: "destructive" });
      }
    } catch {
      toast({ title: "Search error", description: "Could not search for that address", variant: "destructive" });
    } finally {
      setIsSearchingAddress(false);
    }
  };

  return (
    <div className="relative h-screen">
      {/* City Title Bar */}
      <div className="absolute top-0 left-0 right-0 z-[1001] bg-card/90 backdrop-blur-md border-b border-border px-4 py-2 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <span className="font-semibold text-sm text-foreground">Bulawayo, Zimbabwe</span>
      </div>

      <ClusteredMapView
        coordinates={currentCoordinates}
        businesses={displayedBusinesses}
        targetCoordinates={isRoutingActive ? targetMarker : undefined}
        onLandMarkerAdd={handleLandMarkerAdd}
        onBusinessSelect={handleBusinessSelect}
        onSaveFavorite={handleSaveFavorite}
        coordinatePickerMode={coordinatePickerMode}
        onCoordinatePicked={handleCoordinatePicked}
        showHeatmap={false}
        enableLiveTracking={!!userLocation}
      />
      
      <MapControls
        onNavigateToUser={handleNavigateToUser}
        onRecenterMap={handleRecenterMap}
        onGoToProducts={handleGoToProducts}
        onRouteToggle={handleRouteToggle}
        onClearRoute={handleClearRoute}
        isRoutingActive={isRoutingActive}
        isGettingLocation={isGettingLocation}
        hasTargetMarker={!!targetMarker}
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
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setShowSearch(false); setFilteredBusinesses([]); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ConversationalSearch businesses={allBusinesses} onResultsFound={handleSearchResults} onBusinessSelect={handleBusinessSelect} />
          </div>
        </div>
      )}

      {/* Address Search Bar */}
      {showAddressSearch && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] w-full max-w-md px-4">
          <div className="bg-card/95 backdrop-blur border border-border rounded-lg shadow-xl p-3 flex gap-2">
            <Input
              value={addressQuery}
              onChange={(e) => setAddressQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch()}
              placeholder="Search address or place..."
              className="flex-1"
            />
            <Button size="icon" onClick={handleAddressSearch} disabled={isSearchingAddress}>
              {isSearchingAddress ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setShowAddressSearch(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Compact top toolbar */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[1000] flex gap-1.5 bg-card/90 backdrop-blur-md border border-border rounded-full shadow-lg px-2 py-1.5">
        <Button onClick={() => setShowAddressSearch(!showAddressSearch)} variant="ghost" size="sm" className="h-8 rounded-full" title="Search address">
          <Search className="h-4 w-4" />
        </Button>
        <Button onClick={() => setShowSearch(!showSearch)} variant="ghost" size="sm" className="h-8 rounded-full" title="AI Search">
          <Sparkles className="h-4 w-4" />
        </Button>
        <Button onClick={() => setShowFavorites(!showFavorites)} variant="ghost" size="sm" className="h-8 rounded-full relative" title="Favorites">
          <Star className={`h-4 w-4 ${showFavorites ? 'fill-primary text-primary' : ''}`} />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-semibold">
              {favoritesCount}
            </span>
          )}
        </Button>
        <Button
          onClick={() => { setCoordinatePickerMode(!coordinatePickerMode); if (coordinatePickerMode) setPickedCoords(null); }}
          variant="ghost"
          size="sm"
          className={`h-8 rounded-full ${coordinatePickerMode ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
          title="Pick coordinates"
        >
          <Crosshair className="h-4 w-4" />
        </Button>
        {targetMarker && (
          <Button onClick={() => handleSaveFavorite(`Location ${new Date().toLocaleTimeString()}`, targetMarker, 'location')} variant="ghost" size="sm" className="h-8 rounded-full" title="Save target as favorite">
            <Star className="h-4 w-4 fill-primary text-primary" />
          </Button>
        )}
      </div>

      {/* Picked coordinates panel */}
      {pickedCoords && coordinatePickerMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-card/95 backdrop-blur border border-border rounded-lg shadow-xl p-4 min-w-[300px]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-sm text-foreground">Picked Coordinates</span>
            <Button variant="ghost" size="sm" onClick={copyPickedCoords} className="h-7">
              {copiedCoords ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <p className="font-mono text-sm text-muted-foreground mb-3">{pickedCoords.lat.toFixed(6)}, {pickedCoords.lng.toFixed(6)}</p>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate('/tools/distance', { state: { lat: pickedCoords.lat, lng: pickedCoords.lng } })}>
              Distance Calc
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate('/tools/area', { state: { lat: pickedCoords.lat, lng: pickedCoords.lng } })}>
              Area Measure
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate('/tools/route-optimizer', { state: { lat: pickedCoords.lat, lng: pickedCoords.lng } })}>
              Route Optimizer
            </Button>
            <Button size="sm" variant="outline" onClick={() => { handleSaveFavorite(`Picked ${pickedCoords.lat.toFixed(4)}, ${pickedCoords.lng.toFixed(4)}`, pickedCoords, 'location'); }}>
              ★ Save Favorite
            </Button>
          </div>
        </div>
      )}

      {showFavorites && (
        <FavoritesPanel onSelectLocation={handleSelectFavoriteLocation} onClose={() => setShowFavorites(false)} />
      )}
    </div>
  );
};

export default MapPage;

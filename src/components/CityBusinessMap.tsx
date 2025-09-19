import { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, List, Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAuth } from '@/hooks/useAuth';
import MapView from './MapView';
import BusinessPanel from './BusinessPanel';
import { Business, Coordinates } from '@/types/business';
import { getCityCoordinates, getCityFromCoordinates } from '@/utils/cityUtils';
import { createSampleData } from '@/utils/businessUtils';

const CityBusinessMap = () => {
  const { user, signOut } = useAuth();
  const [currentCity, setCurrentCity] = useState('Bulawayo');
  const [currentCoordinates, setCurrentCoordinates] = useState<Coordinates>(
    getCityCoordinates('Bulawayo')!
  );
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [businessType, setBusinessType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [manualCity, setManualCity] = useState('');
  
  const { toast } = useToast();
  const { getUserLocation, isLoading: locationLoading, error: locationError } = useGeolocation();

  // Load businesses for current city
  const loadBusinesses = useCallback(async (type = '') => {
    setIsLoading(true);
    try {
      // For demo purposes, create sample data
      // In a real app, you would fetch from an API
      const sampleBusinesses = createSampleData(currentCoordinates, currentCity);
      
      // Filter by type if specified
      const filteredBusinesses = type 
        ? sampleBusinesses.filter(business => business.type === type)
        : sampleBusinesses;
      
      setBusinesses(filteredBusinesses);
    } catch (error) {
      console.error('Error loading businesses:', error);
      toast({
        title: "Error",
        description: "Failed to load businesses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentCoordinates, currentCity, toast]);

  // Initialize with Bulawayo data
  useEffect(() => {
    loadBusinesses(businessType);
  }, [loadBusinesses, businessType]);

  // Handle business type filter change
  const handleBusinessTypeChange = (type: string) => {
    setBusinessType(type);
  };

  // Handle business selection
  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business);
    setCurrentCoordinates({ lat: business.latitude, lng: business.longitude });
  };

  // Get user's actual location
  const handleGetUserLocation = async () => {
    try {
      const coords = await getUserLocation();
      setCurrentCoordinates(coords);
      
      // Get city name from coordinates
      const cityName = await getCityFromCoordinates(coords);
      setCurrentCity(cityName);
      
      toast({
        title: "Location updated",
        description: `Found your location in ${cityName}`,
      });
      
      // Load businesses for the detected city
      loadBusinesses(businessType);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  // Set manual city
  const handleSetManualCity = async () => {
    if (!manualCity.trim()) return;
    
    setIsLoading(true);
    const cityName = manualCity.trim();
    const cityCoords = getCityCoordinates(cityName);
    
    if (cityCoords) {
      setCurrentCity(cityName);
      setCurrentCoordinates(cityCoords);
      setManualCity('');
      
      toast({
        title: "City changed",
        description: `Switched to ${cityName}`,
      });
    } else {
      toast({
        title: "City not found",
        description: `Could not find coordinates for ${cityName}`,
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  // Handle Enter key for manual city input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSetManualCity();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">City Business Map</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{currentCity}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <Button 
                onClick={signOut}
                variant="outline"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Manual City Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Bulawayo"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-32"
                />
                <Button onClick={handleSetManualCity} size="sm" disabled={isLoading}>
                  Set City
                </Button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleGetUserLocation}
                  variant="outline"
                  size="sm"
                  disabled={locationLoading}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  {locationLoading ? 'Locating...' : 'My Location'}
                </Button>
                
                <Button
                  onClick={() => setIsPanelOpen(true)}
                  size="sm"
                >
                  <List className="h-4 w-4 mr-2" />
                  Businesses ({businesses.length})
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative h-[calc(100vh-100px)]">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="flex items-center gap-2 text-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading...</span>
            </div>
          </div>
        )}

        {/* Map */}
        <MapView
          coordinates={currentCoordinates}
          onLandMarkerAdd={(coords) => {
            toast({
              title: "Land marker added",
              description: `Marker placed at ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
            });
          }}
        />

        {/* Business Panel */}
        <BusinessPanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          businesses={businesses}
          currentCity={currentCity}
          businessType={businessType}
          onBusinessTypeChange={handleBusinessTypeChange}
          onBusinessSelect={handleBusinessSelect}
          selectedBusiness={selectedBusiness}
        />
      </main>
    </div>
  );
};

export default CityBusinessMap;
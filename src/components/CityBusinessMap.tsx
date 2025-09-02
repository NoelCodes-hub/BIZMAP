import { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, Navigation, List, Loader2, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/useGeolocation';
import MapView from './MapView';
import BusinessPanel from './BusinessPanel';
import { Business, Coordinates } from '@/types/business';
import { getCityCoordinates, getCityFromCoordinates } from '@/utils/cityUtils';
import { createSampleData } from '@/utils/businessUtils';

const CityBusinessMap = () => {
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
  const [searchQuery, setSearchQuery] = useState('');
  
  const { toast } = useToast();
  const { getUserLocation, isLoading: locationLoading } = useGeolocation();

  // Filter businesses based on search query
  const filteredBusinesses = useMemo(() => {
    if (!searchQuery.trim()) return businesses;
    
    const query = searchQuery.toLowerCase();
    return businesses.filter(business =>
      business.name.toLowerCase().includes(query) ||
      business.type.toLowerCase().includes(query) ||
      business.address.toLowerCase().includes(query)
    );
  }, [businesses, searchQuery]);

  // Load businesses for current city
  const loadBusinesses = useCallback(async (type = '') => {
    setIsLoading(true);
    try {
      // Simulate API delay for better UX demonstration
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, create sample data
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
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border shadow-elegant backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground bg-gradient-primary bg-clip-text text-transparent">
                  City Business Map
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">{currentCity}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48 bg-background/50 border-border/50 focus:bg-background transition-colors"
                />
              </div>
              
              {/* Manual City Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Bulawayo"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-32 bg-background/50 border-border/50 focus:bg-background transition-colors"
                />
                <Button onClick={handleSetManualCity} size="sm" disabled={isLoading} variant="secondary">
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
                  className="shadow-sm hover:shadow-md transition-shadow"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  {locationLoading ? 'Locating...' : 'My Location'}
                </Button>
                
                <Button
                  onClick={() => setIsPanelOpen(true)}
                  variant="outline"
                  size="sm"
                  className="shadow-sm hover:shadow-md transition-shadow"
                >
                  <List className="h-4 w-4 mr-2" />
                  Businesses ({filteredBusinesses.length})
                </Button>
                
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative h-[calc(100vh-120px)]">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="flex items-center gap-3 text-foreground bg-card px-6 py-4 rounded-lg shadow-elegant animate-fade-in">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="font-medium">Loading businesses...</span>
            </div>
          </div>
        )}

        {/* Map */}
        <MapView
          coordinates={currentCoordinates}
          businesses={filteredBusinesses}
          onBusinessSelect={handleBusinessSelect}
        />

        {/* Business Panel */}
        <BusinessPanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          businesses={filteredBusinesses}
          currentCity={currentCity}
          businessType={businessType}
          onBusinessTypeChange={handleBusinessTypeChange}
          onBusinessSelect={handleBusinessSelect}
          selectedBusiness={selectedBusiness}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </main>
    </div>
  );
};

export default CityBusinessMap;
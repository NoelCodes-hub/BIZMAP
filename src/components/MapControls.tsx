import { Navigation, Compass, Search, Route } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface MapControlsProps {
  onNavigateToUser: () => void;
  onProductSearch: (query: string) => void;
  onRouteRequest: () => void;
  isRoutingActive: boolean;
}

const MapControls = ({ 
  onNavigateToUser, 
  onProductSearch, 
  onRouteRequest,
  isRoutingActive 
}: MapControlsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onProductSearch(searchQuery);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      {/* Compass/Navigate to User */}
      <Button
        onClick={onNavigateToUser}
        className="map-overlay-button w-12 h-12 p-0"
        title="Navigate to my location"
      >
        <Compass className="h-5 w-5" />
      </Button>

      {/* Product Search */}
      <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <PopoverTrigger asChild>
          <Button
            className="map-overlay-button w-12 h-12 p-0"
            title="Search by product"
          >
            <Search className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 glass-morphism">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Search Businesses by Product</h4>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., coffee, electronics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} size="sm">
                Search
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Route Navigation */}
      <Button
        onClick={onRouteRequest}
        className={`map-overlay-button w-12 h-12 p-0 ${
          isRoutingActive ? 'cosmic-gradient text-white' : ''
        }`}
        title="Show route to marker"
      >
        <Route className="h-5 w-5" />
      </Button>

      {/* Direction Indicator */}
      <Button
        onClick={onNavigateToUser}
        className="map-overlay-button w-12 h-12 p-0"
        title="Recenter map"
      >
        <Navigation className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MapControls;

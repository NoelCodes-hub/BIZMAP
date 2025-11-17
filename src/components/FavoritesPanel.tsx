import { Star, Trash2, MapPin, Search, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFavorites, Favorite } from '@/hooks/useFavorites';
import { Coordinates } from '@/types/business';

interface FavoritesPanelProps {
  onSelectLocation: (coords: Coordinates) => void;
  onClose: () => void;
}

const FavoritesPanel = ({ onSelectLocation, onClose }: FavoritesPanelProps) => {
  const { favorites, isLoading, removeFavorite } = useFavorites();

  const handleSelectFavorite = (favorite: Favorite) => {
    if (favorite.latitude && favorite.longitude) {
      onSelectLocation({ lat: favorite.latitude, lng: favorite.longitude });
      onClose();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'location':
        return <MapPin className="h-4 w-4" />;
      case 'business':
        return <Building className="h-4 w-4" />;
      case 'search':
        return <Search className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  return (
    <Card className="absolute top-4 right-4 w-80 max-h-[600px] z-[1000] bg-background/95 backdrop-blur shadow-lg border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-primary text-primary" />
            Favorites
          </span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading favorites...</p>
          ) : favorites.length === 0 ? (
            <p className="text-sm text-muted-foreground">No favorites saved yet</p>
          ) : (
            <div className="space-y-2">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="p-3 rounded-lg bg-card hover:bg-accent/50 transition-colors border border-border/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleSelectFavorite(favorite)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {getIcon(favorite.type)}
                        <span className="font-medium text-sm">{favorite.name}</span>
                      </div>
                      {favorite.latitude && favorite.longitude && (
                        <p className="text-xs text-muted-foreground">
                          {favorite.latitude.toFixed(4)}, {favorite.longitude.toFixed(4)}
                        </p>
                      )}
                      {favorite.search_query && (
                        <p className="text-xs text-muted-foreground">
                          Query: {favorite.search_query}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFavorite(favorite.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FavoritesPanel;

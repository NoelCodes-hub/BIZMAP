import { useMemo, useState } from 'react';
import { Star, Trash2, MapPin, Search, Building, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useFavorites, Favorite } from '@/hooks/useFavorites';
import { Coordinates } from '@/types/business';
import { suggestedPlaces, SuggestedPlace } from '@/data/suggestedPlaces';

interface FavoritesPanelProps {
  onSelectLocation: (coords: Coordinates) => void;
  onClose: () => void;
}

const FavoritesPanel = ({ onSelectLocation, onClose }: FavoritesPanelProps) => {
  const { favorites, isLoading, removeFavorite, addFavorite } = useFavorites();
  const [filter, setFilter] = useState('');

  const handleSelectFavorite = (favorite: Favorite) => {
    if (favorite.latitude && favorite.longitude) {
      onSelectLocation({ lat: favorite.latitude, lng: favorite.longitude });
      onClose();
    }
  };

  const handleAddSuggested = (place: SuggestedPlace) => {
    addFavorite('location', place.name, {
      coordinates: { lat: place.latitude, lng: place.longitude },
      metadata: { category: place.category, suggested: true },
    });
  };

  const handlePreviewSuggested = (place: SuggestedPlace) => {
    onSelectLocation({ lat: place.latitude, lng: place.longitude });
  };

  const savedKeys = useMemo(
    () => new Set(favorites.map(f => `${f.latitude?.toFixed(4)},${f.longitude?.toFixed(4)}`)),
    [favorites]
  );

  const filteredSuggestions = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return suggestedPlaces;
    return suggestedPlaces.filter(
      p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [filter]);

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
    <Card className="absolute top-4 right-4 w-96 max-h-[640px] z-[1000] bg-background/95 backdrop-blur shadow-lg border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-primary text-primary" />
            Saved & Favorites
          </span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="saved">
          <TabsList className="grid grid-cols-2 w-full mb-3">
            <TabsTrigger value="saved">
              Saved ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="suggested">
              <Sparkles className="h-3 w-3 mr-1" />
              Suggested
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="mt-0">
            <ScrollArea className="h-[480px] pr-4">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading favorites...</p>
              ) : favorites.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No favorites saved yet. Try the Suggested tab to quickly add popular places.
                </p>
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
          </TabsContent>

          <TabsContent value="suggested" className="mt-0">
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by name or category…"
              className="mb-3 h-8 text-sm"
            />
            <ScrollArea className="h-[440px] pr-4">
              <div className="space-y-2">
                {filteredSuggestions.map((place) => {
                  const key = `${place.latitude.toFixed(4)},${place.longitude.toFixed(4)}`;
                  const alreadySaved = savedKeys.has(key);
                  return (
                    <div
                      key={`${place.name}-${key}`}
                      className="p-3 rounded-lg bg-card hover:bg-accent/50 transition-colors border border-border/50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handlePreviewSuggested(place)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">{place.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                              {place.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant={alreadySaved ? 'ghost' : 'default'}
                          size="sm"
                          disabled={alreadySaved}
                          onClick={() => handleAddSuggested(place)}
                          className="h-8 px-2"
                          title={alreadySaved ? 'Already saved' : 'Add to favorites'}
                        >
                          {alreadySaved ? (
                            <Star className="h-4 w-4 fill-primary text-primary" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FavoritesPanel;

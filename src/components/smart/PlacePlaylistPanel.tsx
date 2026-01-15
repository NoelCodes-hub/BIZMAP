import { useState, useEffect } from 'react';
import { Plus, Share2, Globe, Lock, Trash2, MapPin, Play, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePlaylists, Playlist, PlaylistItem } from '@/hooks/usePlaylists';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PlacePlaylistPanelProps {
  onPlaylistSelect?: (items: PlaylistItem[]) => void;
}

const PlacePlaylistPanel = ({ onPlaylistSelect }: PlacePlaylistPanelProps) => {
  const { 
    playlists, 
    isLoading, 
    createPlaylist, 
    togglePublic, 
    deletePlaylist,
    fetchPlaylistItems 
  } = usePlaylists();
  const { toast } = useToast();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    if (selectedPlaylist) {
      setLoadingItems(true);
      fetchPlaylistItems(selectedPlaylist.id)
        .then(items => setPlaylistItems(items))
        .finally(() => setLoadingItems(false));
    }
  }, [selectedPlaylist, fetchPlaylistItems]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const playlist = await createPlaylist(newName.trim(), newDescription.trim() || undefined);
    if (playlist) {
      setIsCreating(false);
      setNewName('');
      setNewDescription('');
    }
  };

  const handleShare = (playlist: Playlist) => {
    const shareUrl = `${window.location.origin}/playlist/${playlist.share_code}`;
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link copied!", description: "Share this link with friends" });
  };

  const handlePlayRoute = () => {
    if (playlistItems.length > 0 && onPlaylistSelect) {
      onPlaylistSelect(playlistItems);
    }
  };

  if (selectedPlaylist) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setSelectedPlaylist(null)}>
              <X className="h-4 w-4 mr-1" /> Back
            </Button>
            <div className="flex gap-2">
              {selectedPlaylist.is_public && (
                <Button size="sm" variant="outline" onClick={() => handleShare(selectedPlaylist)}>
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
              <Button 
                size="sm" 
                className="cosmic-gradient text-white"
                onClick={handlePlayRoute}
                disabled={playlistItems.length === 0}
              >
                <Play className="h-4 w-4 mr-1" /> Play Route
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-border bg-muted/30">
          <h2 className="font-bold text-lg">{selectedPlaylist.name}</h2>
          {selectedPlaylist.description && (
            <p className="text-sm text-muted-foreground mt-1">{selectedPlaylist.description}</p>
          )}
          <div className="flex items-center gap-4 mt-3">
            <span className="text-sm text-muted-foreground">
              {playlistItems.length} places
            </span>
            <div className="flex items-center gap-2">
              <Switch
                checked={selectedPlaylist.is_public}
                onCheckedChange={(checked) => togglePublic(selectedPlaylist.id, checked)}
              />
              <span className="text-sm">
                {selectedPlaylist.is_public ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </span>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {loadingItems ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : playlistItems.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No places added yet</p>
              <p className="text-sm mt-1">Add businesses from the map to this playlist</p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {playlistItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full cosmic-gradient flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.business_name}</p>
                    {item.note && (
                      <p className="text-xs text-muted-foreground truncate">{item.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">Place Playlists</h2>
          <Button 
            size="sm" 
            onClick={() => setIsCreating(true)}
            className="cosmic-gradient text-white"
          >
            <Plus className="h-4 w-4 mr-1" /> New
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Create curated collections of your favorite spots
        </p>
      </div>

      {isCreating && (
        <div className="p-4 border-b border-border bg-muted/30 space-y-3">
          <Input
            placeholder="Playlist name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Textarea
            placeholder="Description (optional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={2}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreate} disabled={!newName.trim()}>
              Create
            </Button>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : playlists.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No playlists yet</p>
            <p className="text-sm mt-1">Create your first playlist to get started</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className={cn(
                  "p-4 rounded-xl border border-border bg-card hover:border-primary/50",
                  "transition-all cursor-pointer group"
                )}
                onClick={() => setSelectedPlaylist(playlist)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{playlist.name}</h3>
                      {playlist.is_public ? (
                        <Globe className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                    {playlist.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {playlist.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePlaylist(playlist.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default PlacePlaylistPanel;

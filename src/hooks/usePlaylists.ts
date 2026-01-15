import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PlaylistItem {
  id: string;
  business_id: string;
  business_name: string;
  latitude: number;
  longitude: number;
  note: string | null;
  order_index: number;
}

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  is_public: boolean;
  share_code: string | null;
  created_at: string;
  updated_at: string;
  items?: PlaylistItem[];
}

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPlaylists = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPlaylists([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('place_playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setPlaylists(data || []);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPlaylistItems = useCallback(async (playlistId: string): Promise<PlaylistItem[]> => {
    const { data, error } = await supabase
      .from('playlist_items')
      .select('*')
      .eq('playlist_id', playlistId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  }, []);

  const createPlaylist = useCallback(async (name: string, description?: string): Promise<Playlist | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Please log in", variant: "destructive" });
        return null;
      }

      const shareCode = Math.random().toString(36).substring(2, 10);
      
      const { data, error } = await supabase
        .from('place_playlists')
        .insert({
          user_id: user.id,
          name,
          description,
          share_code: shareCode
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({ title: "Playlist created!" });
      await fetchPlaylists();
      return data;
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast({ title: "Failed to create playlist", variant: "destructive" });
      return null;
    }
  }, [fetchPlaylists, toast]);

  const addToPlaylist = useCallback(async (
    playlistId: string,
    business: { id: string; name: string; latitude: number; longitude: number },
    note?: string
  ) => {
    try {
      const { data: existingItems } = await supabase
        .from('playlist_items')
        .select('order_index')
        .eq('playlist_id', playlistId)
        .order('order_index', { ascending: false })
        .limit(1);

      const nextIndex = (existingItems?.[0]?.order_index ?? -1) + 1;

      const { error } = await supabase
        .from('playlist_items')
        .insert({
          playlist_id: playlistId,
          business_id: business.id,
          business_name: business.name,
          latitude: business.latitude,
          longitude: business.longitude,
          note,
          order_index: nextIndex
        });

      if (error) throw error;
      toast({ title: `Added to playlist` });
    } catch (error) {
      console.error('Error adding to playlist:', error);
      toast({ title: "Failed to add to playlist", variant: "destructive" });
    }
  }, [toast]);

  const removeFromPlaylist = useCallback(async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('playlist_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      toast({ title: "Removed from playlist" });
    } catch (error) {
      console.error('Error removing from playlist:', error);
      toast({ title: "Failed to remove", variant: "destructive" });
    }
  }, [toast]);

  const togglePublic = useCallback(async (playlistId: string, isPublic: boolean) => {
    try {
      const { error } = await supabase
        .from('place_playlists')
        .update({ is_public: isPublic, updated_at: new Date().toISOString() })
        .eq('id', playlistId);

      if (error) throw error;
      toast({ title: isPublic ? "Playlist is now public!" : "Playlist is now private" });
      await fetchPlaylists();
    } catch (error) {
      console.error('Error updating playlist:', error);
      toast({ title: "Failed to update", variant: "destructive" });
    }
  }, [fetchPlaylists, toast]);

  const deletePlaylist = useCallback(async (playlistId: string) => {
    try {
      const { error } = await supabase
        .from('place_playlists')
        .delete()
        .eq('id', playlistId);

      if (error) throw error;
      toast({ title: "Playlist deleted" });
      await fetchPlaylists();
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  }, [fetchPlaylists, toast]);

  const getPublicPlaylist = useCallback(async (shareCode: string): Promise<Playlist | null> => {
    try {
      const { data, error } = await supabase
        .from('place_playlists')
        .select('*')
        .eq('share_code', shareCode)
        .eq('is_public', true)
        .single();

      if (error) throw error;
      return data;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  return {
    playlists,
    isLoading,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    togglePublic,
    deletePlaylist,
    fetchPlaylistItems,
    getPublicPlaylist,
    refreshPlaylists: fetchPlaylists
  };
};

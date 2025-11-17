import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Coordinates } from '@/types/business';

export interface Favorite {
  id: string;
  type: 'location' | 'business' | 'search';
  name: string;
  latitude?: number;
  longitude?: number;
  business_id?: number;
  search_query?: string;
  metadata?: any;
  created_at: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setFavorites([]);
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites((data || []) as Favorite[]);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error loading favorites",
        description: "Could not load your saved locations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async (
    type: 'location' | 'business' | 'search',
    name: string,
    data: {
      coordinates?: Coordinates;
      business_id?: number;
      search_query?: string;
      metadata?: any;
    }
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save favorites",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from('favorites').insert({
        user_id: user.id,
        type,
        name,
        latitude: data.coordinates?.lat,
        longitude: data.coordinates?.lng,
        business_id: data.business_id,
        search_query: data.search_query,
        metadata: data.metadata,
      });

      if (error) throw error;

      toast({
        title: "Saved!",
        description: `${name} added to favorites`,
      });

      fetchFavorites();
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast({
        title: "Error saving favorite",
        description: "Could not save this location",
        variant: "destructive",
      });
    }
  };

  const removeFavorite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Removed",
        description: "Favorite removed successfully",
      });

      fetchFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error removing favorite",
        description: "Could not remove this favorite",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    refreshFavorites: fetchFavorites,
  };
};

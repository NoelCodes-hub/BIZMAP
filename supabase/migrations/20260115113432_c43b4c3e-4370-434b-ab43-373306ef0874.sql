-- Place Playlists table for social curation
CREATE TABLE public.place_playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  share_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Playlist items (businesses in a playlist)
CREATE TABLE public.playlist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.place_playlists(id) ON DELETE CASCADE,
  business_id TEXT NOT NULL,
  business_name TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  note TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fog of War - track explored map cells
CREATE TABLE public.explored_cells (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cell_x INTEGER NOT NULL,
  cell_y INTEGER NOT NULL,
  explored_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, cell_x, cell_y)
);

-- Enhanced badges for gamification
INSERT INTO public.badges (name, description, icon, requirement_type, requirement_value, requirement_category) VALUES
  ('First Steps', 'Explore your first 10 map cells', 'compass', 'cells_explored', 10, NULL),
  ('City Explorer', 'Explore 50 map cells', 'map-pin', 'cells_explored', 50, NULL),
  ('Cartographer', 'Explore 200 map cells', 'navigation', 'cells_explored', 200, NULL),
  ('Coffee Connoisseur', 'Visit 5 different cafes', 'utensils', 'category_visits', 5, 'cafe'),
  ('Night Owl', 'Visit 5 places after 8 PM', 'navigation', 'night_visits', 5, NULL),
  ('Playlist Master', 'Create 3 place playlists', 'heart', 'playlists_created', 3, NULL),
  ('Social Butterfly', 'Share a playlist with friends', 'heart', 'playlists_shared', 1, NULL);

-- Enable RLS
ALTER TABLE public.place_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explored_cells ENABLE ROW LEVEL SECURITY;

-- Playlist policies
CREATE POLICY "Users can view their own playlists" 
ON public.place_playlists FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view public playlists" 
ON public.place_playlists FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can create playlists" 
ON public.place_playlists FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their playlists" 
ON public.place_playlists FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their playlists" 
ON public.place_playlists FOR DELETE 
USING (auth.uid() = user_id);

-- Playlist items policies
CREATE POLICY "Users can view their playlist items" 
ON public.playlist_items FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.place_playlists 
  WHERE id = playlist_id AND (user_id = auth.uid() OR is_public = true)
));

CREATE POLICY "Users can manage their playlist items" 
ON public.playlist_items FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.place_playlists 
  WHERE id = playlist_id AND user_id = auth.uid()
));

CREATE POLICY "Users can update their playlist items" 
ON public.playlist_items FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.place_playlists 
  WHERE id = playlist_id AND user_id = auth.uid()
));

CREATE POLICY "Users can delete their playlist items" 
ON public.playlist_items FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.place_playlists 
  WHERE id = playlist_id AND user_id = auth.uid()
));

-- Explored cells policies
CREATE POLICY "Users can view their explored cells" 
ON public.explored_cells FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add explored cells" 
ON public.explored_cells FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add realtime for live metrics
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_business_metrics;
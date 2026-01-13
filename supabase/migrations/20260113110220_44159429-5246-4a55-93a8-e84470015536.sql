-- Create badges table for gamification
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement_type TEXT NOT NULL, -- 'visit_count', 'category_visits', 'streak'
  requirement_value INTEGER NOT NULL,
  requirement_category TEXT, -- optional: for category-specific badges
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_badges junction table
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create business_stories for Story Pins
CREATE TABLE public.business_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id TEXT NOT NULL,
  business_name TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  story_type TEXT NOT NULL DEFAULT 'promotion', -- 'promotion', 'event', 'flash_sale', 'new_product'
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  view_count INTEGER NOT NULL DEFAULT 0
);

-- Create micro_reviews for quick contextual tags
CREATE TABLE public.micro_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  business_id TEXT NOT NULL,
  business_name TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_visits for tracking personal insights
CREATE TABLE public.user_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  business_id TEXT,
  location_name TEXT,
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  category TEXT,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create location_reminders for proactive notifications
CREATE TABLE public.location_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  business_id TEXT,
  business_name TEXT,
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  reminder_text TEXT NOT NULL,
  trigger_radius_meters INTEGER NOT NULL DEFAULT 500,
  is_active BOOLEAN NOT NULL DEFAULT true,
  triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create live_business_metrics for IoT-like data
CREATE TABLE public.live_business_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id TEXT NOT NULL,
  business_name TEXT NOT NULL,
  current_capacity INTEGER,
  max_capacity INTEGER,
  wait_time_minutes INTEGER,
  parking_spots_available INTEGER,
  is_open BOOLEAN NOT NULL DEFAULT true,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages for AI conversation history
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  conversation_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micro_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for badges (public read)
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);

-- RLS Policies for user_badges
CREATE POLICY "Users can view their own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can earn badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for business_stories (public read, for now anyone can create for demo)
CREATE POLICY "Anyone can view active stories" ON public.business_stories FOR SELECT USING (expires_at > now());
CREATE POLICY "Anyone can create stories" ON public.business_stories FOR INSERT WITH CHECK (true);

-- RLS Policies for micro_reviews
CREATE POLICY "Anyone can view reviews" ON public.micro_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.micro_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their reviews" ON public.micro_reviews FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_visits
CREATE POLICY "Users can view their own visits" ON public.user_visits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can log their visits" ON public.user_visits FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for location_reminders
CREATE POLICY "Users can view their reminders" ON public.location_reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create reminders" ON public.location_reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their reminders" ON public.location_reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their reminders" ON public.location_reminders FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for live_business_metrics (public read)
CREATE POLICY "Anyone can view metrics" ON public.live_business_metrics FOR SELECT USING (true);
CREATE POLICY "Anyone can update metrics" ON public.live_business_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can modify metrics" ON public.live_business_metrics FOR UPDATE USING (true);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view their messages" ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample badges
INSERT INTO public.badges (name, description, icon, requirement_type, requirement_value, requirement_category) VALUES
('Explorer', 'Visit 5 different businesses', 'compass', 'visit_count', 5, NULL),
('Foodie', 'Visit 10 restaurants or fast food places', 'utensils', 'category_visits', 10, 'restaurant'),
('Power Shopper', 'Visit 15 retail stores', 'shopping-bag', 'category_visits', 15, 'retail'),
('Local Expert', 'Visit 25 businesses in your city', 'map-pin', 'visit_count', 25, NULL),
('Navigator Pro', 'Complete 50 routes', 'navigation', 'visit_count', 50, NULL),
('Healthcare Hero', 'Visit 5 pharmacies or healthcare facilities', 'heart', 'category_visits', 5, 'healthcare'),
('Business Networker', 'Visit 10 business services', 'briefcase', 'category_visits', 10, 'business_services'),
('Culture Vulture', 'Visit 10 tourism or entertainment spots', 'camera', 'category_visits', 10, 'tourism');

-- Insert sample live metrics
INSERT INTO public.live_business_metrics (business_id, business_name, current_capacity, max_capacity, wait_time_minutes, parking_spots_available, is_open) VALUES
('biz_1', 'Downtown Cafe', 45, 80, 12, 5, true),
('biz_2', 'City Mall', 234, 500, 0, 45, true),
('biz_3', 'Central Bank', 23, 50, 25, 10, true),
('biz_4', 'Tech Hub', 67, 100, 5, 15, true);

-- Insert sample business stories
INSERT INTO public.business_stories (business_id, business_name, title, content, story_type, expires_at) VALUES
('biz_1', 'Downtown Cafe', '☕ Happy Hour Special!', 'Get 50% off all espresso drinks from 2-4 PM today!', 'flash_sale', now() + interval '24 hours'),
('biz_2', 'City Mall', '🎉 Weekend Festival', 'Join us this weekend for live music, food trucks, and amazing deals!', 'event', now() + interval '3 days'),
('biz_3', 'Central Bank', '📱 New Mobile App', 'Download our new app and get instant account access!', 'new_product', now() + interval '7 days');

-- Create indexes for performance
CREATE INDEX idx_user_badges_user ON public.user_badges(user_id);
CREATE INDEX idx_micro_reviews_business ON public.micro_reviews(business_id);
CREATE INDEX idx_user_visits_user ON public.user_visits(user_id);
CREATE INDEX idx_location_reminders_user ON public.location_reminders(user_id);
CREATE INDEX idx_chat_messages_conversation ON public.chat_messages(conversation_id);
CREATE INDEX idx_business_stories_expires ON public.business_stories(expires_at);
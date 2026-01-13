import { useEffect, useState } from 'react';
import { X, Clock, Tag, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface Story {
  id: string;
  business_id: string;
  business_name: string;
  title: string;
  content: string;
  image_url: string | null;
  story_type: string;
  expires_at: string;
  created_at: string;
  view_count: number;
}

interface BusinessStoriesProps {
  onClose?: () => void;
}

const storyTypeStyles: Record<string, { bg: string; icon: string }> = {
  flash_sale: { bg: 'from-red-500 to-orange-500', icon: '⚡' },
  event: { bg: 'from-purple-500 to-pink-500', icon: '🎉' },
  promotion: { bg: 'from-blue-500 to-cyan-500', icon: '🎁' },
  new_product: { bg: 'from-green-500 to-teal-500', icon: '✨' },
};

const BusinessStories = ({ onClose }: BusinessStoriesProps) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase
        .from('business_stories')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setStories(data);
      }
      setLoading(false);
    };

    fetchStories();
  }, []);

  useEffect(() => {
    if (stories.length === 0) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(i => i + 1);
            return 0;
          }
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentIndex, stories.length]);

  const goNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(i => i + 1);
      setProgress(0);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
        <div className="text-center text-white">
          <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No active stories right now</p>
          <Button variant="outline" onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </div>
    );
  }

  const story = stories[currentIndex];
  const typeStyle = storyTypeStyles[story.story_type] || storyTypeStyles.promotion;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        {stories.map((_, i) => (
          <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{ 
                width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%' 
              }}
            />
          </div>
        ))}
      </div>

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-8 right-4 z-10 text-white hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Navigation */}
      <button 
        onClick={goPrev}
        className="absolute left-0 top-0 bottom-0 w-1/4 z-10"
        disabled={currentIndex === 0}
      />
      <button 
        onClick={goNext}
        className="absolute right-0 top-0 bottom-0 w-1/4 z-10"
        disabled={currentIndex === stories.length - 1}
      />

      {/* Story content */}
      <div className="w-full max-w-md mx-4">
        <div className={cn(
          "relative rounded-2xl overflow-hidden bg-gradient-to-br p-6",
          typeStyle.bg
        )}>
          {/* Story type badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full">
            <span>{typeStyle.icon}</span>
            <span className="text-sm font-medium text-white capitalize">
              {story.story_type.replace('_', ' ')}
            </span>
          </div>

          {/* Content */}
          <div className="mt-16 mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{story.title}</h2>
            <p className="text-white/90 text-lg mb-4">{story.content}</p>
            
            <div className="flex items-center gap-4 text-white/70 text-sm">
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span>{story.business_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Expires {formatDistanceToNow(new Date(story.expires_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="text-white hover:bg-white/20 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goNext}
              disabled={currentIndex === stories.length - 1}
              className="text-white hover:bg-white/20 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-4 text-white/70 text-sm">
            {currentIndex + 1} / {stories.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessStories;

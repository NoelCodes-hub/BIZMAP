import { useState } from 'react';
import { Hash, Plus, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MicroReviewsProps {
  businessId: string;
  businessName: string;
  existingTags?: string[];
  onTagsSubmit?: (tags: string[]) => void;
}

const popularTags = [
  { tag: 'GreatForWorking', color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
  { tag: 'QuietAmbiance', color: 'bg-purple-500/20 text-purple-500 border-purple-500/30' },
  { tag: 'FastService', color: 'bg-green-500/20 text-green-500 border-green-500/30' },
  { tag: 'FriendlyStaff', color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' },
  { tag: 'GreatValue', color: 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30' },
  { tag: 'Spacious', color: 'bg-indigo-500/20 text-indigo-500 border-indigo-500/30' },
  { tag: 'NightOwl', color: 'bg-pink-500/20 text-pink-500 border-pink-500/30' },
  { tag: 'KidFriendly', color: 'bg-orange-500/20 text-orange-500 border-orange-500/30' },
  { tag: 'ParkingNightmare', color: 'bg-red-500/20 text-red-500 border-red-500/30' },
  { tag: 'HiddenGem', color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' },
  { tag: 'InstagramWorthy', color: 'bg-fuchsia-500/20 text-fuchsia-500 border-fuchsia-500/30' },
  { tag: 'LocalFavorite', color: 'bg-amber-500/20 text-amber-500 border-amber-500/30' },
];

const MicroReviews = ({ businessId, businessName, existingTags = [], onTagsSubmit }: MicroReviewsProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(existingTags);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (selectedTags.length === 0) {
      toast({
        title: "No tags selected",
        description: "Please select at least one tag",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onTagsSubmit?.(selectedTags);
    
    toast({
      title: "Tags saved!",
      description: `Added ${selectedTags.length} tags to ${businessName}`,
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Hash className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Quick Tags</span>
        <span className="text-xs text-muted-foreground">
          ({selectedTags.length} selected)
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {popularTags.map(({ tag, color }) => {
          const isSelected = selectedTags.includes(tag);
          
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                isSelected 
                  ? `${color} scale-105` 
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
              )}
            >
              <span className="flex items-center gap-1">
                {isSelected ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
                #{tag}
              </span>
            </button>
          );
        })}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="sm"
            className="cosmic-gradient text-white"
          >
            {isSubmitting ? "Saving..." : "Save Tags"}
          </Button>
          <Button
            onClick={() => setSelectedTags([])}
            variant="outline"
            size="sm"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};

export default MicroReviews;

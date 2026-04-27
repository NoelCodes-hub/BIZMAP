import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Loader2, MapPin, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Business } from '@/types/business';
import { supabase } from '@/integrations/supabase/client';

interface ConversationalSearchProps {
  businesses: Business[];
  onResultsFound: (businesses: Business[]) => void;
  onBusinessSelect?: (business: Business) => void;
}

const SEARCH_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bizmap-search`;

const exampleQueries = [
  "Find a quiet place for a date night with Italian food",
  "Where can I get coffee and work on my laptop?",
  "Best place for a business lunch near banks",
  "Family-friendly restaurant with parking",
];

const ConversationalSearch = ({ 
  businesses, 
  onResultsFound,
  onBusinessSelect 
}: ConversationalSearchProps) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Business[]>([]);
  const [aiExplanation, setAiExplanation] = useState('');
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim() || isSearching) return;
    
    setIsSearching(true);
    setShowResults(true);
    setAiExplanation('');
    setResults([]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast({ title: "Not authenticated", description: "Please sign in to use AI search.", variant: "destructive" });
        setIsSearching(false);
        return;
      }

      const resp = await fetch(SEARCH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          query: query.trim(),
          businesses: businesses.map(b => ({
            id: b.id,
            name: b.name,
            type: b.type,
            address: b.address
          }))
        })
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast({ title: "Rate limited", description: "Please wait a moment", variant: "destructive" });
          return;
        }
        throw new Error('Search failed');
      }

      const data = await resp.json();
      
      // Match returned IDs to full business objects
      const matchedBusinesses = (data.results || [])
        .map((r: { id: number }) => businesses.find(b => b.id === r.id))
        .filter(Boolean) as Business[];

      setResults(matchedBusinesses);
      setAiExplanation(data.explanation || '');
      onResultsFound(matchedBusinesses);
      
    } catch (error) {
      console.error('Search error:', error);
      
      // Fallback: simple keyword matching
      const keywords = query.toLowerCase().split(/\s+/);
      const filtered = businesses.filter(b => 
        keywords.some(k => 
          b.name.toLowerCase().includes(k) ||
          b.type.toLowerCase().includes(k) ||
          b.address?.toLowerCase().includes(k)
        )
      );
      setResults(filtered);
      setAiExplanation("I searched through available businesses for you.");
      onResultsFound(filtered);
    } finally {
      setIsSearching(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setAiExplanation('');
    onResultsFound(businesses); // Reset to show all
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {isSearching ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5 text-primary" />
          )}
        </div>
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Ask me anything... e.g., 'quiet cafe for working'"
          className="pl-11 pr-20 h-12 text-base"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          {query && (
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleClear}>
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button 
            size="sm" 
            onClick={handleSearch} 
            disabled={!query.trim() || isSearching}
            className="cosmic-gradient text-white h-8"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Example queries */}
      {!showResults && (
        <div className="mt-3 flex flex-wrap gap-2">
          {exampleQueries.map((example, i) => (
            <button
              key={i}
              onClick={() => handleExampleClick(example)}
              className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors text-muted-foreground hover:text-foreground"
            >
              "{example.substring(0, 30)}..."
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div className="mt-4 space-y-4">
          {aiExplanation && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">{aiExplanation}</p>
              </div>
            </div>
          )}

          <ScrollArea className="max-h-64">
            <div className="space-y-2">
              {results.length === 0 && !isSearching ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No matches found. Try a different search.
                </p>
              ) : (
                results.map((business) => (
                  <button
                    key={business.id}
                    onClick={() => onBusinessSelect?.(business)}
                    className={cn(
                      "w-full p-3 rounded-lg border border-border bg-card",
                      "hover:border-primary/50 hover:bg-card/80 transition-all",
                      "text-left flex items-center gap-3"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full cosmic-gradient flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{business.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {business.type.replace('_', ' ')} • {business.address}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ConversationalSearch;

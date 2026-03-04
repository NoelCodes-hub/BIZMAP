import { useState } from 'react';
import { Search, Book, MapPin, TrendingUp, Settings, Sparkles, Wrench, Building2, Bot, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const articles = [
  {
    icon: <MapPin className="h-6 w-6" />,
    title: 'Getting Started with Geolocation',
    description: 'Learn how to use GPS features and find businesses near you',
    category: 'Basics',
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=200&fit=crop',
    details: [
      { heading: 'Enabling Location Services', body: 'BizMap uses your device\'s GPS to pinpoint your location. When prompted, allow location access so we can show businesses near you in real time. You can revoke this permission at any time from your browser or device settings.' },
      { heading: 'Finding Nearby Businesses', body: 'Once your location is active, the map automatically centers on your position and highlights businesses within your vicinity. Use the zoom controls to expand or narrow your search radius.' },
      { heading: 'Understanding Map Markers', body: 'Each marker on the map represents a business. Tap or click a marker to view its name, category, distance from you, and a quick summary. Colored markers indicate different business categories for easy identification.' },
      { heading: 'Saving Locations', body: 'Found a place you love? Tap the heart icon on any business card to save it to your Favorites. Access your saved locations anytime from the Favorites panel in the sidebar.' },
    ],
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Product Search Best Practices',
    description: 'Tips for finding exactly what you need using our search tools',
    category: 'Features',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
    details: [
      { heading: 'Using Keywords Effectively', body: 'Type specific product names, brands, or categories into the search bar. BizMap supports partial matching—so searching "lap" will surface laptops, laptop bags, and more.' },
      { heading: 'Filtering Results', body: 'Narrow your search using category filters. Combine filters like price range, distance, and rating to zero in on exactly what you need without scrolling through irrelevant results.' },
      { heading: 'Comparing Products', body: 'Open multiple product cards side by side to compare prices, descriptions, and availability across different businesses. This helps you make informed purchasing decisions quickly.' },
      { heading: 'AI-Assisted Search', body: 'Use the "Talk to BizMap" feature to describe what you\'re looking for in natural language. For example, "affordable laptops near me" will return curated results tailored to your query and location.' },
    ],
  },
  {
    icon: <Settings className="h-6 w-6" />,
    title: 'Navigation & Routing',
    description: 'Master route planning and turn-by-turn navigation',
    category: 'Advanced',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop',
    details: [
      { heading: 'Planning a Route', body: 'Select a destination business on the map and tap "Get Directions." BizMap calculates the fastest route from your current location, factoring in real-time road conditions when available.' },
      { heading: 'Multi-Stop Routes', body: 'Need to visit several places? Use the Route Optimizer tool to add multiple stops. BizMap will reorder them for the most efficient path, saving you time and fuel.' },
      { heading: 'Transport Modes', body: 'Switch between driving, walking, and cycling modes to get route estimates tailored to your preferred method of travel. Each mode shows estimated time and distance.' },
      { heading: 'Turn-by-Turn Guidance', body: 'Once navigation starts, follow on-screen prompts for each turn. The map updates in real time as you move, ensuring you never miss an exit or intersection.' },
    ],
  },
  {
    icon: <Book className="h-6 w-6" />,
    title: 'Understanding Business Categories',
    description: 'Explore different business types and their classifications',
    category: 'Reference',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop',
    details: [
      { heading: 'Category Overview', body: 'BizMap organizes businesses into categories such as Retail, Food & Beverage, Services, Healthcare, Education, and Technology. Each category has a unique color code on the map for instant recognition.' },
      { heading: 'Sub-Categories', body: 'Within each main category, sub-categories provide finer granularity. For example, "Food & Beverage" includes Restaurants, Cafés, Fast Food, and Bakeries—helping you find exactly the type of establishment you need.' },
      { heading: 'Verified Listings', body: 'Businesses with a verified badge have been confirmed for accuracy of location, operating hours, and contact information. Look for the blue checkmark when browsing.' },
      { heading: 'Suggesting Edits', body: 'If you notice incorrect information on a business listing, you can suggest edits. Community contributions help keep BizMap accurate and up to date for everyone.' },
    ],
  },
  {
    icon: <Wrench className="h-6 w-6" />,
    title: 'Using Geospatial Tools',
    description: 'Master distance calculators, area measurements, and route optimization',
    category: 'Tools',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=200&fit=crop',
    details: [
      { heading: 'Distance Calculator', body: 'Measure the straight-line or road distance between any two points on the map. Simply tap two locations and BizMap instantly displays the distance in kilometers or miles.' },
      { heading: 'Area Measurement', body: 'Draw a polygon on the map to calculate the enclosed area. This is useful for property assessments, delivery zone planning, or understanding the coverage of a service area.' },
      { heading: 'Batch Geocoding', body: 'Have a list of addresses? Use the Batch Geocoding tool to convert them all into map coordinates at once. Upload a CSV or enter addresses manually for quick plotting on the map.' },
      { heading: 'Route Optimization', body: 'Input multiple destinations and let BizMap calculate the optimal visiting order. The algorithm minimizes total travel distance, making it perfect for delivery runs or multi-errand days.' },
    ],
  },
  {
    icon: <Bot className="h-6 w-6" />,
    title: 'AI-Powered Search & Chat',
    description: 'Leverage AI assistance for smarter business discovery and insights',
    category: 'AI Features',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
    details: [
      { heading: 'Conversational Search', body: 'Ask BizMap questions in plain language like "Where can I get affordable printing services?" or "Best coffee shops open right now." The AI understands context and returns relevant, ranked results.' },
      { heading: 'Multi-Language Support', body: 'BizMap\'s AI can respond in multiple languages including English, Shona, Ndebele, French, Portuguese, and Spanish. Select your preferred language from the chat settings to get responses in your native tongue.' },
      { heading: 'Smart Recommendations', body: 'Based on your search history and saved favorites, BizMap proactively suggests businesses and products you might enjoy. The more you use it, the smarter recommendations become.' },
      { heading: 'Business Insights', body: 'Ask the AI for insights like peak visiting hours, popular products at a location, or comparisons between similar businesses. It synthesizes data to give you actionable information at a glance.' },
    ],
  },
];

const highlights = [
  {
    icon: Building2,
    title: '50+ Businesses',
    subtitle: 'Mapped & Verified',
    color: 'text-primary',
    details: [
      { heading: 'Verified Listings', body: 'Every business on BizMap has been verified for location accuracy, contact details, and operating hours. Our verification process ensures you always find what you\'re looking for.' },
      { heading: 'Diverse Categories', body: 'From restaurants and retail stores to healthcare providers and tech companies—BizMap covers over 15 business categories across multiple cities.' },
      { heading: 'Real-Time Updates', body: 'Business information is continuously updated. If a business changes its hours, moves locations, or adds new services, BizMap reflects those changes promptly.' },
      { heading: 'Community Contributions', body: 'Users can suggest edits and new listings, helping keep the platform accurate and comprehensive for everyone.' },
    ],
  },
  {
    icon: Wrench,
    title: 'Pro Tools',
    subtitle: 'Distance & Routing',
    color: 'text-accent',
    details: [
      { heading: 'Distance Calculator', body: 'Measure straight-line or road distance between any two points. Great for estimating travel time or comparing how far different businesses are from your location.' },
      { heading: 'Route Optimizer', body: 'Plan multi-stop trips with automatic route optimization. The algorithm finds the shortest path through all your destinations, saving time and fuel.' },
      { heading: 'Area Measurement', body: 'Draw polygons on the map to calculate enclosed areas. Useful for delivery zone planning, property assessments, or understanding service coverage.' },
      { heading: 'Batch Geocoding', body: 'Convert lists of addresses into map coordinates instantly. Upload a CSV or enter addresses manually to plot multiple locations at once.' },
    ],
  },
  {
    icon: Bot,
    title: 'AI Powered',
    subtitle: 'Smart Search',
    color: 'text-primary',
    details: [
      { heading: 'Natural Language Queries', body: 'Ask BizMap questions like "Where can I find affordable printing?" or "Best lunch spots open now." The AI understands context and returns relevant, ranked results.' },
      { heading: 'Multi-Language Support', body: 'Get AI responses in English, Shona, Ndebele, French, Portuguese, and Spanish. Switch languages anytime from the chat settings.' },
      { heading: 'Smart Recommendations', body: 'Based on your search history and favorites, BizMap suggests businesses and products you might enjoy. The more you use it, the smarter it gets.' },
      { heading: 'Business Insights', body: 'Ask for peak hours, popular products, or comparisons between similar businesses. The AI synthesizes data to give you actionable information instantly.' },
    ],
  },
];

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);
  const [selectedHighlight, setSelectedHighlight] = useState<typeof highlights[0] | null>(null);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Detail view for highlights
  if (selectedHighlight) {
    const HighlightIcon = selectedHighlight.icon;
    return (
      <div className="min-h-screen bg-background">
        <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <HighlightIcon className="h-20 w-20 sm:h-28 sm:w-28 text-primary/20" />
          </div>
          <div className="absolute top-4 left-4">
            <Button variant="outline" size="sm" onClick={() => setSelectedHighlight(null)} className="gap-1 bg-background/80 backdrop-blur-sm">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{selectedHighlight.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{selectedHighlight.subtitle}</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
          {selectedHighlight.details.map((section, i) => (
            <div key={i} className="flex gap-3 sm:gap-4">
              <div className="mt-1 shrink-0">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg text-foreground">{section.heading}</h3>
                <p className="text-sm sm:text-base text-muted-foreground mt-1 leading-relaxed">{section.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute top-4 left-4">
            <Button variant="outline" size="sm" onClick={() => setSelectedArticle(null)} className="gap-1 bg-background/80 backdrop-blur-sm">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-block px-2 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium mb-2">
              {selectedArticle.category}
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{selectedArticle.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{selectedArticle.description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
          {selectedArticle.details.map((section, i) => (
            <div key={i} className="flex gap-3 sm:gap-4">
              <div className="mt-1 shrink-0">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg text-foreground">{section.heading}</h3>
                <p className="text-sm sm:text-base text-muted-foreground mt-1 leading-relaxed">{section.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
      </div>

      <div className="relative z-10 p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-primary animate-pulse" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Knowledge Base
              </h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-lg">
              Everything you need to know about using BizMap Pro
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {highlights.map((hl, i) => {
              const Icon = hl.icon;
              return (
                <div
                  key={i}
                  onClick={() => setSelectedHighlight(hl)}
                  className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all"
                >
                  <Icon className={`h-7 w-7 sm:h-8 sm:w-8 ${hl.color} shrink-0`} />
                  <div>
                    <p className="font-semibold text-sm">{hl.title}</p>
                    <p className="text-xs text-muted-foreground">{hl.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative mb-6 sm:mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/80 backdrop-blur-sm"
            />
          </div>

          {/* Articles Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredArticles.map((article, index) => (
              <Card
                key={index}
                className="group glass-morphism hover:shadow-xl transition-all cursor-pointer overflow-hidden border-border/50"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="relative h-28 sm:h-32 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                    {article.category}
                  </div>
                </div>
                <CardHeader className="pb-2 p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                      {article.icon}
                    </div>
                    <CardTitle className="text-base sm:text-lg leading-tight">{article.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <CardDescription className="text-xs sm:text-sm">{article.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;

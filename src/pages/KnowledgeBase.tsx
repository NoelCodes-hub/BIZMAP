import { useState } from 'react';
import { Search, Book, MapPin, TrendingUp, Settings, Sparkles, Wrench, Building2, Bot } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const articles = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Getting Started with Geolocation',
      description: 'Learn how to use GPS features and find businesses near you',
      category: 'Basics',
      image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=200&fit=crop',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Product Search Best Practices',
      description: 'Tips for finding exactly what you need using our search tools',
      category: 'Features',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: 'Navigation & Routing',
      description: 'Master route planning and turn-by-turn navigation',
      category: 'Advanced',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop',
    },
    {
      icon: <Book className="h-6 w-6" />,
      title: 'Understanding Business Categories',
      description: 'Explore different business types and their classifications',
      category: 'Reference',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop',
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      title: 'Using Geospatial Tools',
      description: 'Master distance calculators, area measurements, and route optimization',
      category: 'Tools',
      image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=200&fit=crop',
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: 'AI-Powered Search & Chat',
      description: 'Leverage AI assistance for smarter business discovery and insights',
      category: 'AI Features',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
    },
  ];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with business imagery */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-1/3 left-1/4 w-1/4 h-1/4 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop" 
            alt="" 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with decorative elements */}
          <div className="mb-8 relative">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute top-0 right-0 w-16 h-16 bg-accent/20 rounded-full blur-xl" />
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Knowledge Base
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about using BizMap Pro
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold text-sm">50+ Businesses</p>
                <p className="text-xs text-muted-foreground">Mapped & Verified</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
              <Wrench className="h-8 w-8 text-accent" />
              <div>
                <p className="font-semibold text-sm">Pro Tools</p>
                <p className="text-xs text-muted-foreground">Distance & Routing</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
              <Bot className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold text-sm">AI Powered</p>
                <p className="text-xs text-muted-foreground">Smart Search</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/80 backdrop-blur-sm"
            />
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <Card key={index} className="group glass-morphism hover:shadow-xl transition-all cursor-pointer overflow-hidden border-border/50">
                {/* Article image */}
                <div className="relative h-32 overflow-hidden">
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
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {article.icon}
                    </div>
                    <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{article.description}</CardDescription>
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

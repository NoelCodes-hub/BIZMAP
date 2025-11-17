import { useState } from 'react';
import { Search, Book, MapPin, TrendingUp, Settings } from 'lucide-react';
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
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Product Search Best Practices',
      description: 'Tips for finding exactly what you need using our search tools',
      category: 'Features',
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: 'Navigation & Routing',
      description: 'Master route planning and turn-by-turn navigation',
      category: 'Advanced',
    },
    {
      icon: <Book className="h-6 w-6" />,
      title: 'Understanding Business Categories',
      description: 'Explore different business types and their classifications',
      category: 'Reference',
    },
  ];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Knowledge Base</h1>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about using GeoIntel Pro
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredArticles.map((article, index) => (
            <Card key={index} className="glass-morphism hover:shadow-lg transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    {article.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-primary mb-1">{article.category}</div>
                    <CardTitle className="text-xl">{article.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{article.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;

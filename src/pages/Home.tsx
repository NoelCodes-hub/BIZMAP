import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Map, TrendingUp, Globe, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 cosmic-gradient bg-clip-text text-transparent">
            GeoIntel Pro
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto">
            Advanced Geospatial Intelligence Platform for Business Discovery & Navigation
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/map">
              <Button size="lg" className="cosmic-gradient text-white text-lg px-8">
                <Map className="mr-2 h-5 w-5" />
                Explore Map
              </Button>
            </Link>
            <Link to="/chat">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Talk to AI Assistant
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Map className="h-10 w-10" />}
              title="Interactive Mapping"
              description="Real-time navigation and route planning with precise geolocation"
            />
            <FeatureCard
              icon={<TrendingUp className="h-10 w-10" />}
              title="Business Intelligence"
              description="Search and discover businesses by products and services"
            />
            <FeatureCard
              icon={<Globe className="h-10 w-10" />}
              title="Global Coverage"
              description="Access comprehensive business data across multiple cities"
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10" />}
              title="AI-Powered"
              description="Get instant insights and recommendations from our AI assistant"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => (
  <div className="glass-morphism p-6 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Home;

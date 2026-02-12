import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Map, TrendingUp, Globe, Zap, ShoppingBag, Calculator, Ruler, MapPin, Compass } from 'lucide-react';
import homeHero from '@/assets/home-hero.jpg';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={homeHero} 
            alt="Futuristic city with digital map overlays" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/60 to-primary/20" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="inline-block mb-4 px-4 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
            Geospatial Intelligence Platform
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-foreground tracking-tight">
            Biz<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Map</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover businesses, navigate cities, and unlock powerful geospatial tools — all in one platform.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/map">
              <Button size="lg" className="cosmic-gradient text-primary-foreground text-lg px-8 shadow-lg hover:shadow-xl transition-all">
                <Map className="mr-2 h-5 w-5" />
                Explore Map
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="secondary" className="text-lg px-8 shadow-lg">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Find Products
              </Button>
            </Link>
            <Link to="/chat">
              <Button size="lg" variant="outline" className="text-lg px-8 backdrop-blur-sm">
                Talk to AI Assistant
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Powerful Features</h2>
          <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">Everything you need for business discovery and spatial analysis</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<Map className="h-10 w-10" />} title="Interactive Mapping" description="Real-time navigation and route planning with precise geolocation" />
            <FeatureCard icon={<TrendingUp className="h-10 w-10" />} title="Business Intelligence" description="Search and discover businesses by products and services" />
            <FeatureCard icon={<Globe className="h-10 w-10" />} title="Global Coverage" description="Access comprehensive business data across multiple cities" />
            <FeatureCard icon={<Zap className="h-10 w-10" />} title="AI-Powered" description="Get instant insights and recommendations from our AI assistant" />
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Geospatial Tools</h2>
          <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">Professional-grade tools for spatial analysis and calculation</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ToolCard icon={<Calculator className="h-6 w-6" />} title="Distance Calculator" path="/tools/distance" />
            <ToolCard icon={<Ruler className="h-6 w-6" />} title="Area Measurement" path="/tools/area" />
            <ToolCard icon={<MapPin className="h-6 w-6" />} title="Batch Geocoding" path="/tools/geocoding" />
            <ToolCard icon={<Compass className="h-6 w-6" />} title="Route Optimizer" path="/tools/route-optimizer" />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="glass-morphism p-6 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const ToolCard = ({ icon, title, path }: { icon: React.ReactNode; title: string; path: string }) => (
  <Link to={path}>
    <div className="glass-morphism p-5 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group text-center">
      <div className="w-12 h-12 rounded-lg cosmic-gradient flex items-center justify-center text-primary-foreground mx-auto mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{title}</h3>
    </div>
  </Link>
);

export default Home;

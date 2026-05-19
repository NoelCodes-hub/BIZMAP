import { Link } from 'react-router-dom';
import { Calculator, Ruler, MapPin, Compass, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toolsBg from '@/assets/tools-bg.jpg';

const Tools = () => {
  const tools = [
    {
      icon: <Calculator className="h-8 w-8" />,
      title: 'Distance Calculator',
      description: 'Calculate distances between multiple points on the map using the Haversine formula',
      path: '/tools/distance',
    },
    {
      icon: <Ruler className="h-8 w-8" />,
      title: 'Area Measurement',
      description: 'Measure areas and perimeters of custom polygon regions',
      path: '/tools/area',
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Batch Geocoding',
      description: 'Convert multiple addresses to coordinates at once with CSV export',
      path: '/tools/geocoding',
    },
    {
      icon: <Compass className="h-8 w-8" />,
      title: 'Route Optimizer',
      description: 'Optimize routes for multiple destinations using nearest-neighbor algorithm',
      path: '/tools/route-optimizer',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <img src={toolsBg} alt="" width={1920} height={1080} loading="lazy" className="w-full h-full object-cover saturate-150 contrast-125" />
        <div className="absolute inset-0 bg-background/10" />
        <div className="absolute top-0 left-1/4 w-[32rem] h-[32rem] rounded-full bg-primary/30 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] rounded-full bg-accent/30 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full bg-cyan-400/25 blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />

      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Compass className="h-4 w-4" /> Professional Suite
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Geospatial Tools
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Professional tools for spatial analysis, distance calculations, and route optimization
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tools.map((tool, index) => (
              <Link key={index} to={tool.path}>
                <Card className="glass-morphism hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group h-full border-border/50 hover:border-primary/30">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-4 rounded-xl cosmic-gradient text-primary-foreground shadow-lg group-hover:shadow-primary/25 transition-shadow">
                        {tool.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">{tool.title}</CardTitle>
                        <CardDescription className="text-base">{tool.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full cosmic-gradient text-primary-foreground group-hover:shadow-lg transition-all">
                      Launch Tool <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;

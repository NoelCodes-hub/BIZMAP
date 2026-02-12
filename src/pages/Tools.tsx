import { Link } from 'react-router-dom';
import { Calculator, Ruler, MapPin, Compass, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Geospatial Tools</h1>
          <p className="text-muted-foreground text-lg">
            Professional tools for spatial analysis and calculations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <Link key={index} to={tool.path}>
              <Card className="glass-morphism hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group h-full">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-4 rounded-lg cosmic-gradient text-primary-foreground">
                      {tool.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{tool.title}</CardTitle>
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
  );
};

export default Tools;

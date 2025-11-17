import { Calculator, Ruler, MapPin, Compass } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Tools = () => {
  const tools = [
    {
      icon: <Calculator className="h-8 w-8" />,
      title: 'Distance Calculator',
      description: 'Calculate distances between multiple points on the map',
      action: 'Launch Tool',
    },
    {
      icon: <Ruler className="h-8 w-8" />,
      title: 'Area Measurement',
      description: 'Measure areas and perimeters of custom regions',
      action: 'Launch Tool',
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Batch Geocoding',
      description: 'Convert multiple addresses to coordinates at once',
      action: 'Launch Tool',
    },
    {
      icon: <Compass className="h-8 w-8" />,
      title: 'Route Optimizer',
      description: 'Optimize routes for multiple destinations',
      action: 'Launch Tool',
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
            <Card key={index} className="glass-morphism hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-4 rounded-lg cosmic-gradient text-white">
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{tool.title}</CardTitle>
                    <CardDescription className="text-base">{tool.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full cosmic-gradient text-white">
                  {tool.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tools;

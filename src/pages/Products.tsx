import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, DollarSign, Filter, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  currency: string;
  business: string;
  location: string;
  inStock: boolean;
}

const sampleProducts: Product[] = [
  // Food & Groceries
  { id: 1, name: "Mealie Meal (10kg)", category: "Groceries", price: 8.50, currency: "USD", business: "OK Zimbabwe", location: "Jason Moyo St", inStock: true },
  { id: 2, name: "Cooking Oil (2L)", category: "Groceries", price: 4.20, currency: "USD", business: "TM Pick n Pay", location: "Fort St", inStock: true },
  { id: 3, name: "Sugar (2kg)", category: "Groceries", price: 2.80, currency: "USD", business: "Greens Supermarket", location: "9th Ave & Fort St", inStock: true },
  { id: 4, name: "Rice (5kg)", category: "Groceries", price: 6.50, currency: "USD", business: "OK Zimbabwe", location: "Jason Moyo St", inStock: true },
  { id: 5, name: "Bread (White Loaf)", category: "Groceries", price: 1.20, currency: "USD", business: "TM Pick n Pay", location: "Fort St", inStock: true },
  
  // Fast Food
  { id: 6, name: "2-Piece Chicken Meal", category: "Fast Food", price: 5.50, currency: "USD", business: "Chicken Inn", location: "8th Ave & Fort St", inStock: true },
  { id: 7, name: "Large Pizza", category: "Fast Food", price: 12.00, currency: "USD", business: "Pizza Inn", location: "8th Ave & Fort St", inStock: true },
  { id: 8, name: "Quarter Chicken", category: "Fast Food", price: 8.00, currency: "USD", business: "Nando's", location: "8th Ave & Jason Moyo St", inStock: true },
  { id: 9, name: "Zinger Burger Meal", category: "Fast Food", price: 7.50, currency: "USD", business: "KFC", location: "8th Ave & Fort St", inStock: true },
  
  // Clothing & Fashion
  { id: 10, name: "Men's Formal Shirt", category: "Clothing", price: 25.00, currency: "USD", business: "Edgars Stores", location: "8th Ave & Jason Moyo St", inStock: true },
  { id: 11, name: "Ladies Dress", category: "Clothing", price: 35.00, currency: "USD", business: "Truworths", location: "8th Ave & Fort St", inStock: true },
  { id: 12, name: "Denim Jeans", category: "Clothing", price: 28.00, currency: "USD", business: "Jet Stores", location: "8th Ave & Jason Moyo St", inStock: true },
  { id: 13, name: "School Shoes", category: "Footwear", price: 22.00, currency: "USD", business: "Bata Shoe Company", location: "8th Ave & Fort St", inStock: true },
  { id: 14, name: "Running Sneakers", category: "Footwear", price: 45.00, currency: "USD", business: "Edgars Stores", location: "8th Ave & Jason Moyo St", inStock: false },
  
  // Healthcare & Pharmacy
  { id: 15, name: "Panadol (24 tablets)", category: "Pharmacy", price: 3.50, currency: "USD", business: "Emergency Pharmacy", location: "88 Robert Mugabe Way", inStock: true },
  { id: 16, name: "Vitamin C (60 tablets)", category: "Pharmacy", price: 8.00, currency: "USD", business: "Medirite Pharmacy", location: "Fort St", inStock: true },
  { id: 17, name: "First Aid Kit", category: "Pharmacy", price: 15.00, currency: "USD", business: "Emergency Pharmacy", location: "88 Robert Mugabe Way", inStock: true },
  
  // Beauty & Personal Care
  { id: 18, name: "Moisturizing Lotion", category: "Beauty", price: 12.00, currency: "USD", business: "Avroy Shlain Beauty", location: "Fort St", inStock: true },
  { id: 19, name: "Perfume (50ml)", category: "Beauty", price: 25.00, currency: "USD", business: "Inuka Fragrances", location: "Fort St", inStock: true },
  { id: 20, name: "Hair Treatment", category: "Beauty", price: 18.00, currency: "USD", business: "Rough Cuts Hair & Beauty", location: "Fort St", inStock: true },
  { id: 21, name: "Makeup Kit", category: "Beauty", price: 35.00, currency: "USD", business: "Beauty4Ashes Cosmetics", location: "Old Mutual Centre", inStock: true },
  
  // Automotive
  { id: 22, name: "Petrol (per litre)", category: "Fuel", price: 1.45, currency: "USD", business: "Total Service Station", location: "Fife St & 13th Ave", inStock: true },
  { id: 23, name: "Diesel (per litre)", category: "Fuel", price: 1.52, currency: "USD", business: "Puma Service Station", location: "Fort St", inStock: true },
  { id: 24, name: "Engine Oil (5L)", category: "Automotive", price: 28.00, currency: "USD", business: "Zuva Petroleum", location: "8th Ave & Fort St", inStock: true },
  
  // Electronics & Telecom
  { id: 25, name: "SIM Card (Starter Pack)", category: "Telecom", price: 2.00, currency: "USD", business: "Econet Wireless", location: "9th Ave & Fort St", inStock: true },
  { id: 26, name: "Airtime ($5 bundle)", category: "Telecom", price: 5.00, currency: "USD", business: "NetOne", location: "8th Ave & Fort St", inStock: true },
  { id: 27, name: "WiFi Router", category: "Telecom", price: 85.00, currency: "USD", business: "TelOne", location: "10th Ave & Fife St", inStock: true },
  { id: 28, name: "Data Bundle (30GB)", category: "Telecom", price: 25.00, currency: "USD", business: "Liquid Telecom", location: "9th Ave & Fife St", inStock: true },
];

const categories = [...new Set(sampleProducts.map(p => p.category))];

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const filteredProducts = useMemo(() => {
    let filtered = sampleProducts;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(query) ||
             p.business.toLowerCase().includes(query) ||
             p.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Product Catalogue</h1>
            <p className="text-muted-foreground">Find products and where to buy them in Bulawayo</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products, stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredProducts.length} products
        </p>

        {/* Product Grid */}
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                    <Badge variant={product.inStock ? "default" : "secondary"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="w-fit">{product.category}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-2xl font-bold text-primary">
                    <DollarSign className="h-5 w-5" />
                    {product.price.toFixed(2)}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {product.currency}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{product.business}</p>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {product.location}
                    </div>
                  </div>
                  <Link to="/map">
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      View on Map
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Products;

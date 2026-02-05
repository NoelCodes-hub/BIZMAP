 import { useState } from 'react';
 import { Link } from 'react-router-dom';
 import { MapPin, Star, Percent, Sparkles, ShoppingCart, Check } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Card, CardContent } from '@/components/ui/card';
 import { AspectRatio } from '@/components/ui/aspect-ratio';
 import { Product } from '@/data/products';
 import { useCartContext } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
   const { addItem, items } = useCartContext();
   const [justAdded, setJustAdded] = useState(false);
 
  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : null;
 
   const isInCart = items.some(item => item.product.id === product.id);
 
   const handleAddToCart = (e: React.MouseEvent) => {
     e.preventDefault();
     e.stopPropagation();
     addItem(product);
     setJustAdded(true);
     setTimeout(() => setJustAdded(false), 1500);
   };

  return (
    <Card className="group overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <AspectRatio ratio={4/3}>
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </AspectRatio>
        
        {/* Overlay Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-accent text-accent-foreground text-xs font-semibold">
              <Sparkles className="w-3 h-3 mr-1" />
              NEW
            </Badge>
          )}
          {product.discount && (
            <Badge className="bg-destructive text-destructive-foreground text-xs font-semibold">
              <Percent className="w-3 h-3 mr-1" />
              {product.discount}% OFF
            </Badge>
          )}
        </div>
        
        {/* Stock Badge */}
        <div className="absolute top-2 right-2">
          <Badge 
            variant={product.inStock ? "default" : "secondary"}
            className={product.inStock 
              ? "bg-green-500/90 text-white" 
              : "bg-muted text-muted-foreground"
            }
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="p-4 space-y-3">
        {/* Category & Subcategory */}
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20">
            {product.category}
          </Badge>
          <Badge variant="outline" className="text-xs bg-secondary/50">
            {product.subcategory}
          </Badge>
        </div>
        
        {/* Product Name */}
        <h3 className="font-semibold text-base line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviews} reviews)
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-baseline gap-2">
          {discountedPrice ? (
            <>
              <span className="text-2xl font-bold text-primary">
                ${discountedPrice.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
          )}
          <span className="text-xs text-muted-foreground">{product.currency}</span>
        </div>
        
        {/* Business & Location */}
        <div className="pt-2 border-t border-border/50 space-y-1">
          <p className="text-sm font-medium truncate">{product.business}</p>
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{product.location}</span>
          </div>
        </div>
        
         {/* Action Buttons */}
         <div className="flex gap-2 pt-2">
           <Button 
             variant={justAdded || isInCart ? "secondary" : "default"}
             size="sm" 
             className="flex-1"
             onClick={handleAddToCart}
             disabled={justAdded || !product.inStock}
           >
             {justAdded ? (
               <>
                 <Check className="w-4 h-4 mr-1" />
                 Added!
               </>
             ) : isInCart ? (
               <>
                 <ShoppingCart className="w-4 h-4 mr-1" />
                 Add More
               </>
             ) : (
               <>
                 <ShoppingCart className="w-4 h-4 mr-1" />
                 Add to Cart
               </>
             )}
           </Button>
           <Link to="/map">
             <Button variant="outline" size="sm" className="px-3">
               <MapPin className="w-4 h-4" />
             </Button>
           </Link>
         </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

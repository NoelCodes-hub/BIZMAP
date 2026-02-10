import { MapPin, Star, Percent, Sparkles, ShoppingCart, Check, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/data/products';
import { useCartContext } from '@/contexts/CartContext';

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductDetailDialog = ({ product, open, onOpenChange }: ProductDetailDialogProps) => {
  const { addItem, items } = useCartContext();
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : null;

  const isInCart = items.some(item => item.product.id === product.id);

  const handleAddToCart = () => {
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>Product details for {product.name}</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 md:h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNew && (
                <Badge className="bg-accent text-accent-foreground text-xs font-semibold">
                  <Sparkles className="w-3 h-3 mr-1" /> NEW
                </Badge>
              )}
              {product.discount && (
                <Badge className="bg-destructive text-destructive-foreground text-xs font-semibold">
                  <Percent className="w-3 h-3 mr-1" /> {product.discount}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                {product.category}
              </Badge>
              <Badge variant="outline" className="bg-secondary/10 border-secondary/30">
                {product.subcategory}
              </Badge>
              <Badge
                variant={product.inStock ? "default" : "secondary"}
                className={product.inStock ? "bg-green-500/90 text-white" : ""}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            <h2 className="text-2xl font-bold">{product.name}</h2>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <Separator />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {discountedPrice ? (
                <>
                  <span className="text-3xl font-bold text-primary">${discountedPrice.toFixed(2)}</span>
                  <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                  <Badge className="bg-destructive/10 text-destructive border-destructive/20" variant="outline">
                    Save ${(product.price - discountedPrice).toFixed(2)}
                  </Badge>
                </>
              ) : (
                <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
              )}
              <span className="text-sm text-muted-foreground">{product.currency}</span>
            </div>

            <Separator />

            {/* Business info */}
            <div className="space-y-2">
              <p className="font-semibold text-base">{product.business}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1.5 text-primary" />
                {product.location}
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex gap-3 mt-auto pt-2">
              <Button
                variant={justAdded || isInCart ? "secondary" : "default"}
                className="flex-1"
                onClick={handleAddToCart}
                disabled={justAdded || !product.inStock}
                size="lg"
              >
                {justAdded ? (
                  <><Check className="w-5 h-5 mr-2" /> Added!</>
                ) : isInCart ? (
                  <><ShoppingCart className="w-5 h-5 mr-2" /> Add More</>
                ) : (
                  <><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;

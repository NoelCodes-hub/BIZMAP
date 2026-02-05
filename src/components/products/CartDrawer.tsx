 import { useState } from 'react';
 import { ShoppingCart, X, Plus, Minus, Trash2, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { ScrollArea } from '@/components/ui/scroll-area';
 import { Separator } from '@/components/ui/separator';
 import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
   SheetFooter,
 } from '@/components/ui/sheet';
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
 } from '@/components/ui/dialog';
 import { useCartContext } from '@/contexts/CartContext';
 
 const CartDrawer = () => {
   const { items, removeItem, updateQuantity, clearCart, totalItems, subtotal } = useCartContext();
   const [isOpen, setIsOpen] = useState(false);
   const [showCheckout, setShowCheckout] = useState(false);
   const [isProcessing, setIsProcessing] = useState(false);
   const [orderComplete, setOrderComplete] = useState(false);
 
   const handleCheckout = async () => {
     setIsProcessing(true);
     await new Promise(resolve => setTimeout(resolve, 2000));
     setIsProcessing(false);
     setOrderComplete(true);
     clearCart();
   };
 
   const closeCheckout = () => {
     setShowCheckout(false);
     setOrderComplete(false);
     if (orderComplete) {
       setIsOpen(false);
     }
   };
 
   return (
     <>
       <Sheet open={isOpen} onOpenChange={setIsOpen}>
         <SheetTrigger asChild>
           <Button
             variant="outline"
             size="icon"
             className="relative bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card"
           >
             <ShoppingCart className="h-5 w-5" />
             {totalItems > 0 && (
               <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                 {totalItems > 99 ? '99+' : totalItems}
               </Badge>
             )}
           </Button>
         </SheetTrigger>
         <SheetContent className="w-full sm:max-w-lg flex flex-col">
           <SheetHeader>
             <SheetTitle className="flex items-center gap-2">
               <ShoppingCart className="h-5 w-5" />
               Shopping Cart
             </SheetTitle>
             <SheetDescription>
               {totalItems === 0
                 ? 'Your cart is empty'
                 : `${totalItems} item${totalItems > 1 ? 's' : ''} in your cart`}
             </SheetDescription>
           </SheetHeader>
 
           {items.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
               <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mb-4" />
               <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
               <p className="text-sm text-muted-foreground mb-4">
                 Add some products to get started
               </p>
               <Button variant="outline" onClick={() => setIsOpen(false)}>
                 Continue Shopping
               </Button>
             </div>
           ) : (
             <>
               <ScrollArea className="flex-1 -mx-6 px-6">
                 <div className="space-y-4 py-4">
                   {items.map(({ product, quantity }) => {
                     const discountedPrice = product.discount
                       ? product.price * (1 - product.discount / 100)
                       : product.price;
 
                     return (
                       <div
                         key={product.id}
                         className="flex gap-4 p-3 rounded-lg bg-muted/30 border border-border/50"
                       >
                         <img
                           src={product.image}
                           alt={product.name}
                           className="w-20 h-20 object-cover rounded-md"
                         />
                         <div className="flex-1 min-w-0">
                           <h4 className="font-medium text-sm line-clamp-2 mb-1">
                             {product.name}
                           </h4>
                           <p className="text-xs text-muted-foreground mb-2">
                             {product.business}
                           </p>
                           <div className="flex items-center gap-2">
                             <span className="font-semibold text-primary">
                               ${discountedPrice.toFixed(2)}
                             </span>
                             {product.discount && (
                               <span className="text-xs text-muted-foreground line-through">
                                 ${product.price.toFixed(2)}
                               </span>
                             )}
                           </div>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                           <Button
                             variant="ghost"
                             size="icon"
                             className="h-6 w-6 text-muted-foreground hover:text-destructive"
                             onClick={() => removeItem(product.id)}
                           >
                             <X className="h-4 w-4" />
                           </Button>
                           <div className="flex items-center gap-1 bg-background rounded-md border">
                             <Button
                               variant="ghost"
                               size="icon"
                               className="h-7 w-7"
                               onClick={() => updateQuantity(product.id, quantity - 1)}
                             >
                               <Minus className="h-3 w-3" />
                             </Button>
                             <span className="w-8 text-center text-sm font-medium">
                               {quantity}
                             </span>
                             <Button
                               variant="ghost"
                               size="icon"
                               className="h-7 w-7"
                               onClick={() => updateQuantity(product.id, quantity + 1)}
                             >
                               <Plus className="h-3 w-3" />
                             </Button>
                           </div>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </ScrollArea>
 
               <Separator className="my-4" />
 
               <SheetFooter className="flex-col gap-4 sm:flex-col">
                 <div className="w-full space-y-2">
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Subtotal</span>
                     <span>${subtotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Shipping</span>
                     <span className="text-green-500">Free</span>
                   </div>
                   <Separator />
                   <div className="flex justify-between font-semibold text-lg">
                     <span>Total</span>
                     <span className="text-primary">${subtotal.toFixed(2)}</span>
                   </div>
                 </div>
 
                 <div className="flex gap-2 w-full">
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={clearCart}
                     className="flex-shrink-0"
                   >
                     <Trash2 className="h-4 w-4 mr-1" />
                     Clear
                   </Button>
                   <Button
                     className="flex-1"
                     onClick={() => setShowCheckout(true)}
                   >
                     <CreditCard className="h-4 w-4 mr-2" />
                     Checkout
                   </Button>
                 </div>
               </SheetFooter>
             </>
           )}
         </SheetContent>
       </Sheet>
 
       <Dialog open={showCheckout} onOpenChange={closeCheckout}>
         <DialogContent className="sm:max-w-md">
           {orderComplete ? (
             <div className="flex flex-col items-center text-center py-6">
               <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                 <CheckCircle className="h-8 w-8 text-accent" />
               </div>
               <DialogHeader>
                 <DialogTitle className="text-2xl">Order Complete!</DialogTitle>
                 <DialogDescription className="text-base">
                   Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                 </DialogDescription>
               </DialogHeader>
               <Button className="mt-6" onClick={closeCheckout}>
                 Continue Shopping
               </Button>
             </div>
           ) : (
             <>
               <DialogHeader>
                 <DialogTitle>Checkout</DialogTitle>
                 <DialogDescription>
                   Complete your purchase of {totalItems} item{totalItems > 1 ? 's' : ''}
                 </DialogDescription>
               </DialogHeader>
               <div className="space-y-4 py-4">
                 <div className="p-4 rounded-lg bg-muted/50 border">
                   <div className="flex justify-between mb-2">
                     <span className="text-muted-foreground">Items ({totalItems})</span>
                     <span>${subtotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between mb-2">
                     <span className="text-muted-foreground">Shipping</span>
                     <span className="text-green-500">Free</span>
                   </div>
                   <Separator className="my-2" />
                   <div className="flex justify-between font-semibold text-lg">
                     <span>Total</span>
                     <span className="text-primary">${subtotal.toFixed(2)}</span>
                   </div>
                 </div>
                 <p className="text-xs text-muted-foreground text-center">
                   Demo checkout - no real payment processed.
                 </p>
               </div>
               <div className="flex gap-2">
                 <Button variant="outline" onClick={closeCheckout} className="flex-1">
                   Cancel
                 </Button>
                 <Button
                   onClick={handleCheckout}
                   disabled={isProcessing}
                   className="flex-1"
                 >
                   {isProcessing ? (
                     <>
                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                       Processing...
                     </>
                   ) : (
                     <>
                       <CreditCard className="h-4 w-4 mr-2" />
                       Pay ${subtotal.toFixed(2)}
                     </>
                   )}
                 </Button>
               </div>
             </>
           )}
         </DialogContent>
       </Dialog>
     </>
   );
 };
 
 export default CartDrawer;
 import React, { createContext, useContext, ReactNode } from 'react';
 import { useCart, CartItem } from '@/hooks/useCart';
 import { Product } from '@/data/products';
 
 interface CartContextType {
   items: CartItem[];
   addItem: (product: Product, quantity?: number) => void;
   removeItem: (productId: number) => void;
   updateQuantity: (productId: number, quantity: number) => void;
   clearCart: () => void;
   totalItems: number;
   subtotal: number;
 }
 
 const CartContext = createContext<CartContextType | undefined>(undefined);
 
 export const CartProvider = ({ children }: { children: ReactNode }) => {
   const cart = useCart();
 
   return (
     <CartContext.Provider value={cart}>
       {children}
     </CartContext.Provider>
   );
 };
 
 export const useCartContext = () => {
   const context = useContext(CartContext);
   if (!context) {
     throw new Error('useCartContext must be used within a CartProvider');
   }
   return context;
 };
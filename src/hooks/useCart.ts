 import { useState, useEffect, useCallback } from 'react';
 import { Product } from '@/data/products';
 
 export interface CartItem {
   product: Product;
   quantity: number;
 }
 
 const CART_STORAGE_KEY = 'bizmap-cart';
 
 export const useCart = () => {
   const [items, setItems] = useState<CartItem[]>(() => {
     try {
       const stored = localStorage.getItem(CART_STORAGE_KEY);
       return stored ? JSON.parse(stored) : [];
     } catch {
       return [];
     }
   });
 
   useEffect(() => {
     localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
   }, [items]);
 
   const addItem = useCallback((product: Product, quantity: number = 1) => {
     setItems(prev => {
       const existing = prev.find(item => item.product.id === product.id);
       if (existing) {
         return prev.map(item =>
           item.product.id === product.id
             ? { ...item, quantity: item.quantity + quantity }
             : item
         );
       }
       return [...prev, { product, quantity }];
     });
   }, []);
 
   const removeItem = useCallback((productId: number) => {
     setItems(prev => prev.filter(item => item.product.id !== productId));
   }, []);
 
   const updateQuantity = useCallback((productId: number, quantity: number) => {
     if (quantity <= 0) {
       setItems(prev => prev.filter(item => item.product.id !== productId));
       return;
     }
     setItems(prev =>
       prev.map(item =>
         item.product.id === productId ? { ...item, quantity } : item
       )
     );
   }, []);
 
   const clearCart = useCallback(() => {
     setItems([]);
   }, []);
 
   const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
   
   const subtotal = items.reduce((sum, item) => {
     const price = item.product.discount
       ? item.product.price * (1 - item.product.discount / 100)
       : item.product.price;
     return sum + price * item.quantity;
   }, 0);
 
   return {
     items,
     addItem,
     removeItem,
     updateQuantity,
     clearCart,
     totalItems,
     subtotal,
   };
 };
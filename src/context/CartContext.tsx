'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string; // product id
  name: string;
  slug: string;
  sku: string;
  brand: string;
  image: string;
  price: number;
  mrp: number;
  quantity: number;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  couponCode: string;
  shipping: number;
  gst: number;
  total: number;
  isCartOpen: boolean;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  addItem: (product: any, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const freeShippingThreshold = 1999;
  const standardShipping = 99;

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hc_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem('hc_coupon');
      if (savedCoupon) {
        const parsed = JSON.parse(savedCoupon);
        setCouponCode(parsed.code || '');
        setDiscount(parsed.discount || 0);
      }
    } catch (e) {
      console.warn('Failed to read cart from local storage', e);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('hc_cart', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to local storage', e);
    }
  }, [items, isInitialized]);

  const addItem = (product: any, quantity: number = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === product._id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(product.stock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: product._id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          brand: product.brand,
          image: product.images?.[0] || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80',
          price: product.sellingPrice,
          mrp: product.mrp,
          quantity: Math.min(product.stock, quantity),
          stock: product.stock,
        };
        return [...prev, newItem];
      }
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            quantity: Math.min(item.stock, quantity),
          };
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= freeShippingThreshold ? 0 : standardShipping;
  const gst = Math.round((subtotal * 18) / 118); // 18% included GST
  const finalDiscount = Math.min(discount, subtotal);
  const total = Math.max(0, subtotal - finalDiscount + shipping);

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponCode(data.coupon.code);
        setDiscount(data.discountAmount);
        localStorage.setItem(
          'hc_coupon',
          JSON.stringify({ code: data.coupon.code, discount: data.discountAmount })
        );
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch {
      return { success: false, message: 'Failed to apply coupon.' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
    localStorage.removeItem('hc_coupon');
  };

  const clearCart = () => {
    setItems([]);
    removeCoupon();
    localStorage.removeItem('hc_cart');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount: finalDiscount,
        couponCode,
        shipping,
        gst,
        total,
        isCartOpen,
        freeShippingThreshold,
        freeShippingProgress,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

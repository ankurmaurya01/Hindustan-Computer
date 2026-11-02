'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CompareContextType {
  compareItems: any[];
  addToCompare: (product: any) => { success: boolean; message: string };
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  compareCount: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareItems, setCompareItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hc_compare');
      if (saved) {
        setCompareItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load compare items', e);
    }
  }, []);

  const addToCompare = (product: any) => {
    if (compareItems.some((p) => p._id === product._id)) {
      return { success: false, message: 'Product already added to comparison' };
    }
    if (compareItems.length >= 4) {
      return { success: false, message: 'You can compare maximum 4 products at a time' };
    }
    const updated = [...compareItems, product];
    setCompareItems(updated);
    try {
      localStorage.setItem('hc_compare', JSON.stringify(updated));
    } catch {}
    return { success: true, message: 'Added to comparison list' };
  };

  const removeFromCompare = (productId: string) => {
    const updated = compareItems.filter((p) => p._id !== productId);
    setCompareItems(updated);
    try {
      localStorage.setItem('hc_compare', JSON.stringify(updated));
    } catch {}
  };

  const clearCompare = () => {
    setCompareItems([]);
    try {
      localStorage.removeItem('hc_compare');
    } catch {}
  };

  const isInCompare = (productId: string) => compareItems.some((p) => p._id === productId);

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        compareCount: compareItems.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}

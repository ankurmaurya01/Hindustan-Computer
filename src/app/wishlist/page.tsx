'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/customer/Header';
import Footer from '@/components/customer/Footer';
import ProductCard from '@/components/customer/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      if (wishlistIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/products?limit=100');
        const data = await res.json();
        const matches = (data.products || []).filter((p: any) => wishlistIds.includes(p._id));
        setProducts(matches);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadWishlistProducts();
  }, [wishlistIds]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="w-6 h-6 text-red-500 fill-current" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            My Wishlist ({products.length})
          </h1>
        </div>

        {loading ? (
          <div className="text-slate-400 text-sm">Loading wishlist...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4 shadow-sm">
            <Heart className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-lg font-bold">Your wishlist is empty</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Save gaming components, laptops, and accessories to your wishlist to buy later.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

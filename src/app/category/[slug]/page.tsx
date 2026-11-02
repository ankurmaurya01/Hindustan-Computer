'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/customer/Header';
import Footer from '@/components/customer/Footer';
import ProductCard from '@/components/customer/ProductCard';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryProducts() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/products?category=${slug}`),
          fetch(`/api/categories`),
        ]);

        const prodData = await prodRes.json();
        const allCats = await catRes.json();

        setProducts(prodData.products || []);
        const found = allCats?.find((c: any) => c.slug === slug);
        setCategory(found || { name: slug.replace(/-/g, ' ').toUpperCase() });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryProducts();
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white font-bold capitalize">
            {category?.name || slug}
          </span>
        </div>

        {/* Category Header Banner */}
        <div className="bg-gradient-to-r from-brand-navy to-blue-900 rounded-3xl p-6 md:p-8 text-white mb-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-300">
              Department
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold capitalize">{category?.name}</h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl">
              {category?.description || 'Authentic hardware components and systems backed by manufacturer warranty.'}
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Categories</span>
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white dark:bg-slate-900 border rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-3">
            <p className="text-sm text-slate-500">Currently no products listed in this category.</p>
            <Link
              href="/products"
              className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              Browse Other Categories
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

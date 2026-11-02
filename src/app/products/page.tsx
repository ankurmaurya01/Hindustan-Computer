'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/customer/Header';
import Footer from '@/components/customer/Footer';
import ProductCard from '@/components/customer/ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState(400000);
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'all') query.set('category', selectedCategory);
        if (selectedBrand && selectedBrand !== 'all') query.set('brand', selectedBrand);
        if (search) query.set('search', search);
        if (sort) query.set('sort', sort);
        if (inStockOnly) query.set('inStockOnly', 'true');
        if (priceRange) query.set('maxPrice', String(priceRange));

        const res = await fetch(`/api/products?${query.toString()}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFilteredProducts();
  }, [selectedCategory, selectedBrand, search, sort, inStockOnly, priceRange]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSearch('');
    setSort('newest');
    setInStockOnly(false);
    setPriceRange(400000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Computer Store Catalog
            </h1>
            <p className="text-xs text-slate-500">
              Showing {products.length} genuine products with Indian warranty
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterMobileOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </button>

            {/* Sorting */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent border-none text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="newest" className="dark:bg-slate-900">Newest First</option>
                <option value="price-asc" className="dark:bg-slate-900">Price: Low to High</option>
                <option value="price-desc" className="dark:bg-slate-900">Price: High to Low</option>
                <option value="rating" className="dark:bg-slate-900">Highest Rated</option>
                <option value="discount" className="dark:bg-slate-900">Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar Filter */}
          <aside className={`lg:block ${isFilterMobileOpen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-900 p-6 overflow-y-auto' : 'hidden'}`}>
            <div className="flex items-center justify-between lg:hidden mb-4 pb-2 border-b">
              <h3 className="font-bold text-base">Filter Products</h3>
              <button onClick={() => setIsFilterMobileOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 bg-white dark:bg-slate-900 lg:border border-slate-200 dark:border-slate-800 lg:rounded-2xl lg:p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  Filters
                </span>
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Reset All
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2.5">
                  Category
                </h4>
                <div className="space-y-1 max-h-56 overflow-y-auto text-xs pr-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-2 py-1.5 rounded-lg font-medium transition ${
                      selectedCategory === 'all'
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg font-medium transition ${
                        selectedCategory === cat.slug
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* In-Stock Toggle */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Show In-Stock Only</span>
                </label>
              </div>

              {/* Price Filter Slider */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Max Budget:</span>
                  <span className="font-mono font-bold text-blue-600">₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="400000"
                  step="5000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Mobile apply button */}
              <button
                onClick={() => setIsFilterMobileOpen(false)}
                className="lg:hidden w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Right Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 6, 7].map((n) => (
                  <div key={n} className="bg-white dark:bg-slate-900 border rounded-2xl h-80 animate-pulse p-4" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-3">
                <p className="text-slate-400 text-sm">No products found matching your active filters.</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

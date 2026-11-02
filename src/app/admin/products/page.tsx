'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Package,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<any[]>([]);

  async function loadProducts() {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products?limit=200'),
        fetch('/api/categories'),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      setProducts(prodData.products || []);
      setCategories(catData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from your shop catalog?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const handleQuickStockUpdate = async (id: string, newStock: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        setProducts(
          products.map((p) => (p._id === id ? { ...p, stock: newStock } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Product & Inventory Manager
          </h1>
          <p className="text-xs text-slate-500">
            Total {products.length} products listed in your shop
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Box */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by product name, brand, or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Selling Price</th>
                <th className="p-3">MRP</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
                        <Package className="w-6 h-6" />
                      </div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                        No Products in Catalog
                      </h4>
                      <p className="text-xs text-slate-500">
                        All previous demo products have been removed. You can now add your own items with specifications, stock, and pricing.
                      </p>
                      <div className="pt-2">
                        <Link
                          href="/admin/products/new"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Add Your First Product</span>
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No matching products found.</td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 flex items-center gap-3 min-w-[220px]">
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=200&q=80'}
                        alt={prod.name}
                        className="w-10 h-10 object-contain rounded-xl bg-slate-50 dark:bg-slate-800 p-1 shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/products/${prod.slug}`}
                          target="_blank"
                          className="font-bold text-slate-900 dark:text-white hover:text-blue-600 line-clamp-1 flex items-center gap-1"
                        >
                          <span>{prod.name}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                        </Link>
                        <span className="text-[10px] text-slate-400 font-mono">SKU: {prod.sku}</span>
                      </div>
                    </td>

                    <td className="p-3 capitalize text-slate-600 dark:text-slate-300">
                      {prod.category?.replace(/-/g, ' ')}
                    </td>

                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">
                      ₹{prod.sellingPrice?.toLocaleString('en-IN')}
                    </td>

                    <td className="p-3 text-slate-400 line-through">
                      ₹{prod.mrp?.toLocaleString('en-IN')}
                    </td>

                    {/* Stock quick edit */}
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          defaultValue={prod.stock}
                          onBlur={(e) => handleQuickStockUpdate(prod._id, Number(e.target.value))}
                          className="w-16 p-1 border rounded text-xs text-center font-bold bg-slate-50 dark:bg-slate-800"
                        />
                        <span className="text-[10px] text-slate-400">units</span>
                      </div>
                    </td>

                    <td className="p-3">
                      {prod.stock > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          <span>In Stock</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" />
                          <span>Out of Stock</span>
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right space-x-1">
                      <Link
                        href={`/admin/products/${prod._id}`}
                        className="inline-block p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                        title="Edit Product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(prod._id, prod.name)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/60 text-red-500 transition"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

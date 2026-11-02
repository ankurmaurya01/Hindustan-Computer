'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    brand: 'ASUS',
    category: 'laptops',
    sellingPrice: '',
    mrp: '',
    purchasePrice: '',
    stock: '10',
    warranty: '1 Year Brand Warranty',
    image: '',
    shortDescription: '',
    description: '',
    isFeatured: false,
    isBestseller: false,
  });

  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: 'Processor / Chipset', value: '' },
    { key: 'Memory / RAM', value: '' },
    { key: 'Storage', value: '' },
    { key: 'Graphics / GPU', value: '' },
  ]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategories();
  }, []);

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.name || !form.sellingPrice) {
      setErrorMsg('Product name and selling price are required.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: form.name,
        brand: form.brand,
        category: form.category,
        sellingPrice: Number(form.sellingPrice),
        mrp: Number(form.mrp) || Number(form.sellingPrice),
        purchasePrice: Number(form.purchasePrice) || 0,
        stock: Number(form.stock) || 0,
        warranty: form.warranty,
        images: form.image ? [form.image] : [
          'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
        ],
        shortDescription: form.shortDescription || form.name,
        description: form.description || form.shortDescription || form.name,
        specifications: specs.filter((s) => s.key && s.value),
        highlights: specs.filter((s) => s.value).map((s) => `${s.key}: ${s.value}`),
        isFeatured: form.isFeatured,
        isBestseller: form.isBestseller,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create product');
      }

      router.push('/admin/products');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 bg-white dark:bg-slate-900 border rounded-xl hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Add New Product to Shop
            </h1>
            <p className="text-xs text-slate-500">
              Fill details to publish immediately to your customer website
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Main Details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b pb-2">
            1. Basic Information
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-bold mb-1">Product Title / Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. ASUS ROG Strix G16 (Intel i7 13th Gen / RTX 4060 / 16GB RAM / 1TB SSD)"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl capitalize"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="e.g. ASUS / HP / Intel"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b pb-2">
            2. Price & Cost (₹)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold mb-1">Selling Price to Customer (₹) *</label>
              <input
                type="number"
                required
                value={form.sellingPrice}
                onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                placeholder="e.g. 84990"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">MRP / Printed Price (₹)</label>
              <input
                type="number"
                value={form.mrp}
                onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                placeholder="e.g. 99990"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Purchase / Cost Price (₹ - Optional)</label>
              <input
                type="number"
                value={form.purchasePrice}
                onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
                placeholder="e.g. 72000"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Media & Warranty */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b pb-2">
            3. Image URL & Warranty
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-bold mb-1">Product Photo URL</label>
              <input
                type="url"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://images.unsplash.com/... or paste image web link"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Leave blank to use official hardware placeholder image automatically.
              </span>
            </div>

            <div>
              <label className="block font-bold mb-1">Warranty Term</label>
              <input
                type="text"
                value={form.warranty}
                onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                placeholder="e.g. 2 Years Manufacturer Onsite Warranty"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Short Description / Summary</label>
              <textarea
                rows={2}
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                placeholder="Key selling points, e.g. Ultra high FPS for gaming with 16-inch 165Hz IPS screen."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              4. Technical Specifications
            </h3>
            <button
              type="button"
              onClick={handleAddSpec}
              className="inline-flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Spec Row</span>
            </button>
          </div>

          <div className="space-y-2">
            {specs.map((spec, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Feature (e.g. CPU)"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                  className="w-1/3 p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Intel Core i7 13700H)"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                  className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(idx)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : 'Save & Publish Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

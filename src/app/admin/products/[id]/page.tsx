'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState<any>({
    name: '',
    brand: '',
    category: '',
    sellingPrice: '',
    mrp: '',
    purchasePrice: '',
    stock: '',
    warranty: '',
    image: '',
    shortDescription: '',
    description: '',
  });

  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch('/api/categories'),
        ]);

        if (!prodRes.ok) {
          router.push('/admin/products');
          return;
        }

        const prod = await prodRes.json();
        const cats = await catRes.json();

        setCategories(cats || []);
        setForm({
          name: prod.name || '',
          brand: prod.brand || '',
          category: prod.category || '',
          sellingPrice: prod.sellingPrice || '',
          mrp: prod.mrp || '',
          purchasePrice: prod.purchasePrice || '',
          stock: prod.stock || 0,
          warranty: prod.warranty || '',
          image: prod.images?.[0] || '',
          shortDescription: prod.shortDescription || '',
          description: prod.description || '',
        });
        setSpecs(prod.specifications || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, router]);

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
    setSuccessMsg('');
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
        images: form.image ? [form.image] : undefined,
        shortDescription: form.shortDescription,
        description: form.description,
        specifications: specs.filter((s) => s.key && s.value),
      };

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to update product');
      }

      setSuccessMsg('Product updated successfully!');
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating product.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-sm text-slate-500">Loading product for editing...</div>;
  }

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
              Edit Product: {form.name}
            </h1>
            <p className="text-xs text-slate-500">Update stock, change price, or revise technical specs</p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold">{errorMsg}</div>
      )}
      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold">{successMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Main Details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b pb-2">
            Basic Information
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-bold mb-1">Product Title / Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold mb-1">Category</label>
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
                <label className="block font-bold mb-1">Brand</label>
                <input
                  type="text"
                  required
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
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
            Pricing (₹)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                value={form.sellingPrice}
                onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">MRP (₹)</label>
              <input
                type="number"
                value={form.mrp}
                onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Purchase Cost (₹)</label>
              <input
                type="number"
                value={form.purchasePrice}
                onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Media & Warranty */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b pb-2">
            Image & Warranty
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-bold mb-1">Photo URL</label>
              <input
                type="url"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Warranty Term</label>
              <input
                type="text"
                value={form.warranty}
                onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Specifications
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
                  placeholder="Key"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                  className="w-1/3 p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Value"
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
            <span>{submitting ? 'Updating...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

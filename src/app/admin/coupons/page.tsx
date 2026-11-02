'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '10',
    minOrderAmount: '2000',
    maxDiscountAmount: '2000',
    description: '',
  });

  async function loadCoupons() {
    setLoading(true);
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      setCoupons(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewCoupon({
          code: '',
          discountType: 'percentage',
          discountValue: '10',
          minOrderAmount: '2000',
          maxDiscountAmount: '2000',
          description: '',
        });
        await loadCoupons();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    try {
      const res = await fetch(`/api/coupons?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCoupons(coupons.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Coupons & Promo Offers
          </h1>
          <p className="text-xs text-slate-500">
            Create discount codes for your customers to use during checkout
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon._id}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-sm relative"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-lg text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-xl">
                {coupon.code}
              </span>
              <button
                onClick={() => handleDeleteCoupon(coupon._id)}
                className="text-slate-400 hover:text-red-500 p-1"
                title="Delete Coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {coupon.discountType === 'percentage'
                ? `Flat ${coupon.discountValue}% OFF`
                : `Flat ₹${coupon.discountValue} OFF`}
            </p>

            <p className="text-[11px] text-slate-500">
              Min order: ₹{coupon.minOrderAmount?.toLocaleString('en-IN') || 0}{' '}
              {coupon.maxDiscountAmount ? `• Max savings: ₹${coupon.maxDiscountAmount.toLocaleString('en-IN')}` : ''}
            </p>

            <div className="pt-2 border-t text-[10px] text-slate-400 flex items-center justify-between">
              <span>Used {coupon.usedCount || 0} times</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 space-y-4 shadow-2xl border">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              Create Discount Coupon
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                    placeholder="e.g. 15"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.minOrderAmount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: e.target.value })}
                    placeholder="e.g. 2000"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.maxDiscountAmount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscountAmount: e.target.value })}
                    placeholder="e.g. 3000"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

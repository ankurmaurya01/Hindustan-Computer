'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/customer/Header';
import Footer from '@/components/customer/Footer';
import { useCart } from '@/context/CartContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotal,
    discount,
    couponCode,
    shipping,
    total,
    freeShippingThreshold,
    freeShippingProgress,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setIsApplying(true);
    setCouponMsg(null);
    const res = await applyCoupon(inputCoupon.trim());
    setIsApplying(false);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setInputCoupon('');
  };

  const remaining = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
          Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Your shopping cart is empty</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Check out our latest laptops, gaming desktop rigs, GPUs, processors, and computer accessories.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Items Table (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free delivery tracker */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-300">
                  <Truck className="w-4 h-4 text-blue-600" />
                  {remaining > 0 ? (
                    <span>
                      Add <strong>₹{remaining.toLocaleString('en-IN')}</strong> more to your cart to qualify for <strong>Free Express Shipping</strong>!
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      🎉 Congratulations! You have unlocked Free Express Shipping across India.
                    </span>
                  )}
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400 uppercase font-bold tracking-wider">
                  <span>Product</span>
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:underline capitalize"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {items.map((item) => (
                    <div key={item.id} className="p-4 flex flex-col sm:flex-row items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-contain rounded-2xl bg-slate-50 dark:bg-slate-800 p-2 shrink-0"
                      />
                      <div className="flex-1 text-center sm:text-left min-w-0">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                          {item.brand}
                        </span>
                        <Link href={`/products/${item.slug}`}>
                          <h3 className="font-semibold text-sm text-slate-900 dark:text-white hover:text-blue-600 line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-400 mt-0.5">SKU: {item.sku}</p>
                        <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                          ₹{item.price.toLocaleString('en-IN')}{' '}
                          {item.mrp > item.price && (
                            <span className="text-xs text-slate-400 line-through font-normal">
                              ₹{item.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity buttons */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-l"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-r disabled:opacity-40"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-sm font-extrabold min-w-[80px] text-right text-slate-900 dark:text-white">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Summary Box (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Coupon Box */}
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-sm">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  Have a Promo Code?
                </span>

                {couponCode ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      '{couponCode}' Applied (-₹{discount.toLocaleString('en-IN')})
                    </span>
                    <button onClick={removeCoupon} className="text-red-500 hover:underline font-bold">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. WELCOMEHC"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl uppercase font-mono"
                      />
                      <button
                        type="submit"
                        disabled={isApplying}
                        className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-800 text-xs font-bold rounded-xl hover:bg-blue-600 transition"
                      >
                        {isApplying ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponMsg && (
                      <p className={`text-[11px] ${couponMsg.isError ? 'text-red-500' : 'text-emerald-600'}`}>
                        {couponMsg.text}
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Order Financials */}
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Order Summary</h3>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Cart Subtotal</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Promo Discount</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span>{shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-base font-black text-slate-900 dark:text-white">
                    <span>Final Total</span>
                    <span className="text-blue-600 dark:text-blue-400">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 text-right">Includes all taxes (18% GST)</p>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-sm shadow-lg shadow-blue-500/25 transition"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Trust Points */}
                <div className="space-y-2 pt-2 border-t text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Safe & Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>7 Days Replacement Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/customer/Header';
import Footer from '@/components/customer/Footer';
import {
  Truck,
  CheckCircle2,
  Clock,
  Package,
  Search,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

const ORDER_STEPS = [
  'Order Placed',
  'Payment Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get('orderNumber') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${orderNumber.trim()}`);
      if (!res.ok) {
        throw new Error('Order not found. Please check your Order ID (e.g. HC-2026-1001).');
      }
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not find order. Please verify details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrder) {
      handleTrack({ preventDefault: () => {} } as any);
    }
  }, [initialOrder]);

  const currentStepIndex = order ? ORDER_STEPS.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto mb-1">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Track Your Order</h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Enter your Order Number provided in your confirmation message to see live packing and dispatch progress.
          </p>
        </div>

        {/* Tracking Input Box */}
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Order Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. HC-2026-1001"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm font-mono font-bold uppercase focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <span>Searching shipment records...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Check Live Order Status</span>
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs text-center font-bold">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Order Result & Visual Stepper */}
        {order && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Shipment For</span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Order #{order.orderNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  Recipient: {order.customer?.name} &bull; Destination: {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-extrabold rounded-full">
                  Status: {order.status}
                </span>
              </div>
            </div>

            {/* Courier Info if Shipped */}
            {order.tracking?.courier && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                    Courier Partner: {order.tracking.courier}
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono">
                    Tracking AWB: {order.tracking.trackingNumber || 'Available upon pickup'}
                  </span>
                </div>
                {order.tracking.trackingUrl && (
                  <a
                    href={order.tracking.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition"
                  >
                    <span>Track on Courier Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Visual Stepper */}
            <div className="py-4">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-6">
                Live Timeline
              </h4>

              <div className="relative flex flex-col md:flex-row justify-between gap-4">
                {ORDER_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step} className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 relative">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div className="text-left md:text-center">
                        <p className={`text-xs font-bold ${isCurrent ? 'text-blue-600 dark:text-blue-400' : isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>
                          {step}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shopkeeper WhatsApp Assistance */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">Need immediate help with this delivery?</span>
              <a
                href={`https://wa.me/919935908565?text=Hi%20Hindustan%20Computer,%20I%20have%20an%20inquiry%20regarding%20my%20Order%20${order.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Shopkeeper on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading order tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}

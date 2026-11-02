'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/customer/Header';
import Footer from '@/components/customer/Footer';
import Link from 'next/link';
import {
  CheckCircle,
  Printer,
  MessageCircle,
  MapPin,
  Clock,
  Store,
  PhoneCall,
  ShoppingBag,
} from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppNotify = () => {
    if (!order) return;
    const msg = `*Store Pickup Request - Hindustan Computer*
*Order Ref:* ${order.orderNumber}
*Customer:* ${order.customer?.name} (${order.customer?.phone})
*Total Amount:* ₹${order.financials?.total?.toLocaleString('en-IN')}

Hello Hindustan Computer, I submitted a pickup request for these items. Please confirm stock availability so I can come and collect them from the shop.`;
    window.open(`https://wa.me/919935908565?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <div className="no-print">
        <Header />
      </div>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          {/* Header celebration */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 flex items-center justify-center gap-1">
              <Store className="w-4 h-4" />
              Pickup Request Registered
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Thank You! Your Pickup Request is Placed
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              We have noted your items. Please visit our shop in Dohrighat to inspect and collect your products.
            </p>
          </div>

          {/* Order Details Badge */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Pickup Token / Ref #</span>
              <strong className="text-sm font-mono text-blue-600 dark:text-blue-400">
                {order?.orderNumber || orderId}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                <Store className="w-4 h-4" />
                {order?.status || 'Pickup Requested'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Payment Mode</span>
              <strong className="text-slate-800 dark:text-slate-200">
                Pay at Shop Counter (Cash / UPI)
              </strong>
            </div>
          </div>

          {/* Shop Location Banner for Pickup */}
          <div className="p-5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 rounded-2xl space-y-2 text-xs">
            <span className="font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <MapPin className="w-4 h-4 text-blue-600" />
              Store Pickup Location:
            </span>
            <p className="text-slate-800 dark:text-slate-200 font-bold">
              Hindustan Computer
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Dohrighat Road, Near Bus Stand, Dohrighat, Uttar Pradesh - 275303
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Mon – Sat: 10:30 AM to 8:30 PM
              </span>
              <span className="flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-blue-500" />
                Call: +91 99359 08565
              </span>
            </div>
          </div>

          {/* Action Buttons: WhatsApp & Print */}
          <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleWhatsAppNotify}
              className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirm Stock with Shopkeeper on WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition border border-slate-300 dark:border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span>Print Pickup Slip</span>
            </button>
          </div>

          {/* Items Summary Table */}
          {order && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Items to Collect</h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                      <p className="text-slate-400">Qty: {item.quantity} &times; ₹{item.price?.toLocaleString('en-IN')}</p>
                    </div>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      ₹{item.total?.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financials Breakdown */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{order.financials?.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {order.financials?.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount:</span>
                    <span>-₹{order.financials.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Fulfillment:</span>
                  <span className="text-emerald-600 font-bold">In-Store Pickup (FREE)</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white border-t pt-2">
                  <span>Payable at Store:</span>
                  <span className="text-blue-600 dark:text-blue-400">₹{order.financials?.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Links */}
          <div className="no-print pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs">
            <a
              href="https://maps.app.goo.gl/QrpkQuvfyPWnit8E9"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              <MapPin className="w-4 h-4 text-red-500" />
              <span>Get Directions to Store on Google Maps &rarr;</span>
            </a>
            <Link
              href="/products"
              className="text-slate-600 dark:text-slate-300 font-semibold hover:underline"
            >
              &larr; Back to Products
            </Link>
          </div>
        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
}

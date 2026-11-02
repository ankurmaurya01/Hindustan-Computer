'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/customer/Header';
import Footer from '@/components/customer/Footer';
import Link from 'next/link';
import {
  CheckCircle,
  Truck,
  Printer,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
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
    const msg = `Hello Hindustan Computer, I just placed an order on your website! 
*Order ID:* ${order.orderNumber}
*Customer Name:* ${order.customer?.name}
*Total Amount:* ₹${order.financials?.total.toLocaleString('en-IN')}
*Payment Method:* ${order.payment?.method}
Please confirm and arrange dispatch. Thank you!`;
    window.open(`https://wa.me/919935908565?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
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
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Order Confirmed & Received
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Thank You For Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Your order has been safely registered at Hindustan Computer. A confirmation invoice is ready.
            </p>
          </div>

          {/* Order Details Badge */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Order Number</span>
              <strong className="text-sm font-mono text-blue-600 dark:text-blue-400">
                {order?.orderNumber || orderId}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                <PackageCheck className="w-4 h-4" />
                {order?.status || 'Order Placed'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Payment Method</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {order?.payment?.method || 'Cash on Delivery'}
              </strong>
            </div>
          </div>

          {/* Action Buttons: WhatsApp & Print */}
          <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleWhatsAppNotify}
              className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Receipt to Shopkeeper on WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition border border-slate-300 dark:border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice Bill</span>
            </button>
          </div>

          {/* Items Summary Table */}
          {order && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Items in this Order</h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                      <p className="text-slate-400">Qty: {item.quantity} &times; ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      ₹{item.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financials Breakdown */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{order.financials?.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {order.financials?.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount:</span>
                    <span>-₹{order.financials.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>{order.financials?.shipping === 0 ? 'FREE' : `₹${order.financials?.shipping}`}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white border-t pt-2">
                  <span>Total Payable:</span>
                  <span className="text-blue-600 dark:text-blue-400">₹{order.financials?.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Shipping To:
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{order.shippingAddress?.fullName} ({order.shippingAddress?.phone})</p>
                <p className="text-slate-600 dark:text-slate-400">
                  {order.shippingAddress?.addressLine1}, {order.shippingAddress?.landmark && `${order.shippingAddress.landmark}, `}
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}
                </p>
              </div>
            </div>
          )}

          {/* Links */}
          <div className="no-print pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs">
            <Link
              href={`/track-order?orderNumber=${order?.orderNumber || orderId}`}
              className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Order Status &rarr;</span>
            </Link>
            <Link
              href="/"
              className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium"
            >
              Continue Shopping &rarr;
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

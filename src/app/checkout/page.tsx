'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/customer/Header';
import Footer from '@/components/customer/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Store,
  MapPin,
  Clock,
  ArrowRight,
  MessageCircle,
  Banknote,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, couponCode, total, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    pickupTime: 'Today (आज ही)',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'Pay at Store' | 'UPI on Pickup'>('Pay at Store');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Header />
        <div className="flex-1 max-w-7xl mx-auto p-12 text-center space-y-4">
          <h2 className="text-xl font-bold">Your pickup cart is empty</h2>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Browse Products
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePlacePickup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setErrorMsg('Please enter your full name and WhatsApp mobile number.');
      return;
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number so we can notify you about stock.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          userId: user?.id,
          name: formData.fullName.trim(),
          email: `${cleanPhone}@customer.hindustancomputer.com`,
          phone: formData.phone.trim(),
        },
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          addressLine1: 'Self Pickup from Store (दुकान से संग्रह)',
          addressLine2: `Expected Pickup: ${formData.pickupTime}`,
          landmark: 'Dohrighat Road, Near Bus Stand',
          city: 'Dohrighat',
          state: 'Uttar Pradesh',
          pinCode: '275303',
        },
        items: items.map((i) => ({
          productId: i.id,
          name: i.name,
          sku: i.sku,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
          total: i.price * i.quantity,
        })),
        financials: {
          subtotal,
          discount,
          couponCode,
          shipping: 0,
          gst: Math.round((subtotal * 18) / 118),
          total,
        },
        payment: {
          method: paymentMethod,
          status: 'pending_pickup',
          transactionId: 'STORE_PICKUP_' + Date.now(),
        },
        status: 'Pickup Requested',
        internalNotes: `Pickup time: ${formData.pickupTime}. Notes: ${formData.notes || 'None'}`,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();

        // Prepare pre-formatted WhatsApp message
        let itemsListText = '';
        items.forEach((item) => {
          itemsListText += `• ${item.name} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString('en-IN')}\n`;
        });

        const whatsappMsg = `*Store Pickup & Availability Inquiry - Hindustan Computer*
*Order Ref:* ${data.order?.orderNumber || 'HC-PICKUP'}
*Customer:* ${formData.fullName.trim()} (${formData.phone.trim()})
*Expected Pickup:* ${formData.pickupTime}
${formData.notes ? `*Customer Note:* ${formData.notes}\n` : ''}
*Items to Collect:*
${itemsListText}
*Estimated Amount:* ₹${total.toLocaleString('en-IN')}
*Payment:* Pay at store on collection (Cash / UPI)

Hello Hindustan Computer! Please check if these items are currently in stock at your Dohrighat shop so I can come and collect them.`;

        // Open WhatsApp directly
        window.open(`https://wa.me/919935908565?text=${encodeURIComponent(whatsappMsg)}`, '_blank');

        // Redirect to success page
        router.push(`/order-success/${data.order?.orderNumber || data.order?._id}`);
      } else {
        setErrorMsg(data.message || 'Failed to submit pickup request. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('Something went wrong. You can also message us directly on WhatsApp at +91 99359 08565.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Store className="w-3.5 h-3.5" />
            In-Store Collection
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Store Pickup & Stock Confirmation
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-2xl">
            We operate on a <strong>Take from Shop</strong> model (no courier delivery). Submit your list below to check item availability and reserve them at our Dohrighat shop.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-2xl text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handlePlacePickup}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Pickup Details Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Pickup Address Box */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600">
                      Collection Location:
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Hindustan Computer (Shop Counter)
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Dohrighat Road, Near Bus Stand, Dohrighat, Uttar Pradesh - 275303
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Shop Hours: Mon – Sat, 10:30 AM to 8:30 PM (Sunday Closed)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Contact Information */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Your Contact Information</span>
                </h3>
                <p className="text-xs text-slate-500">
                  We use your WhatsApp number to confirm if the items are in stock before you visit.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      When Do You Plan to Visit the Shop?
                    </label>
                    <select
                      value={formData.pickupTime}
                      onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="Today (आज ही)">Today (आज ही)</option>
                      <option value="Tomorrow (कल)">Tomorrow (कल)</option>
                      <option value="Within 2-3 Days (2-3 दिनों में)">Within 2-3 Days (2-3 दिनों में)</option>
                      <option value="Just inquiring for now (सिर्फ जानकारी चाहिए)">Just inquiring for now (सिर्फ जानकारी चाहिए)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Any Questions or Brand Preference? (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Do you have Dell or Lapcare in stock?"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Payment Method at Store Counter
                </h3>
                <p className="text-xs text-slate-500">
                  Pay directly at our shop counter after checking the products in person.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label
                    onClick={() => setPaymentMethod('Pay at Store')}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                      paymentMethod === 'Pay at Store'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <div>
                      <strong className="block text-xs text-slate-900 dark:text-white">Cash at Counter</strong>
                      <span className="text-[11px] text-slate-500">Pay cash upon item pickup</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('UPI on Pickup')}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                      paymentMethod === 'UPI on Pickup'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    <div>
                      <strong className="block text-xs text-slate-900 dark:text-white">UPI / GPay / PhonePe / Paytm</strong>
                      <span className="text-[11px] text-slate-500">Scan QR code at shop counter</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Col: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Pickup Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h3>

                <div className="max-h-64 overflow-y-auto space-y-3 divide-y divide-slate-100 dark:divide-slate-800 pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="pt-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=200&q=80'}
                          alt={item.name}
                          className="w-10 h-10 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 p-1 border shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{item.name}</p>
                          <span className="text-slate-400 text-[11px]">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-900 dark:text-white shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Coupon Discount</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs">
                    <span>Fulfillment Mode</span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      Store Pickup (₹0)
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-base font-black text-slate-900 dark:text-white">
                    <span>Estimated Total</span>
                    <span className="text-blue-600 dark:text-blue-400">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs md:text-sm shadow-xl shadow-emerald-600/25 transition disabled:opacity-50"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>{isSubmitting ? 'Submitting Reservation...' : 'Confirm Store Pickup & Check on WhatsApp'}</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                  Clicking will open WhatsApp with your item list to verify availability directly with our shopkeeper in Dohrighat!
                </p>

                {/* Trust Points */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Pay only at the shop counter after inspecting items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Tested genuine brand accessories & hardware</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

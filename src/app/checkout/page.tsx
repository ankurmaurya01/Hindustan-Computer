'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/customer/Header';
import Footer from '@/components/customer/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  Lock,
  ArrowRight,
  Truck,
  CheckCircle2,
} from 'lucide-react';

const INDIAN_STATES = [
  'Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat',
  'Haryana', 'West Bengal', 'Rajasthan', 'Telangana', 'Kerala', 'Punjab',
  'Madhya Pradesh', 'Bihar', 'Odisha', 'Andhra Pradesh', 'Assam', 'Jharkhand',
  'Uttarakhand', 'Himachal Pradesh', 'Goa', 'Chandigarh', 'Jammu and Kashmir',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, couponCode, shipping, gst, total, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: 'Dohrighat',
    state: 'Uttar Pradesh',
    pinCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'UPI' | 'Razorpay'>('Cash on Delivery');
  const [internalNotes, setInternalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 max-w-7xl mx-auto p-12 text-center space-y-4">
          <h2 className="text-xl font-bold">Your cart is empty</h2>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Go to Shop
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.pinCode) {
      setErrorMsg('Please fill in your name, 10-digit mobile number, address, and PIN code.');
      return;
    }

    if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for order verification.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          userId: user?.id,
          name: formData.fullName,
          email: formData.email || `${formData.phone}@customer.hindustancomputer.com`,
          phone: formData.phone,
        },
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2 || '',
          landmark: formData.landmark || '',
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
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
          shipping,
          gst,
          total,
        },
        payment: {
          method: paymentMethod,
          status: paymentMethod === 'Cash on Delivery' ? 'pending' : 'paid',
          transactionId: paymentMethod !== 'Cash on Delivery' ? 'pay_HC' + Date.now() : '',
        },
        internalNotes,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Clear cart
      clearCart();

      // Redirect to success page
      router.push(`/order-success/${data.order.orderNumber}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-emerald-600" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Secure Checkout</h1>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-300 text-red-600 text-xs font-bold rounded-2xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Address & Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Contact & Delivery Address */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                Delivery Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">10-Digit Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9811234567"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">Email Address (For Bill/Invoice)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">House No. / Building / Street Address *</label>
                  <input
                    type="text"
                    required
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="e.g. Flat 402, Shivam Apartments, Main Road"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Area / Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="e.g. Near Metro Station / Shiv Mandir"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">6-Digit PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder="e.g. 275303"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
                Choose Payment Method
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${paymentMethod === 'Cash on Delivery' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30' : 'border-slate-200 dark:border-slate-800'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      Cash on Delivery (COD) / Pay upon Delivery
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pay in cash or UPI QR scan directly to the courier agent when your parcel arrives.
                    </p>
                  </div>
                </label>

                {/* UPI Direct */}
                <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${paymentMethod === 'UPI' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30' : 'border-slate-200 dark:border-slate-800'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-purple-600" />
                      Instant UPI / Google Pay / PhonePe / Paytm
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Fastest zero-fee payment method directly linked to your bank account.
                    </p>
                  </div>
                </label>

                {/* Cards / Online */}
                <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${paymentMethod === 'Razorpay' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30' : 'border-slate-200 dark:border-slate-800'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      Debit Card / Credit Card / Net Banking (Razorpay Secure)
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Accepts Visa, MasterCard, RuPay, and corporate credit cards.
                    </p>
                  </div>
                </label>
              </div>

              {/* Special instructions */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Order Note / Special Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="e.g. Call before delivery, deliver after 2 PM, require GST number on bill"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Right Summary Box (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Order Summary</h3>

              {/* Items summary */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-xl bg-slate-50 dark:bg-slate-800 p-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-slate-400">Qty: {item.quantity} &times; ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="space-y-2 pt-3 border-t text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount Coupon</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-3 text-lg font-black text-slate-900 dark:text-white">
                  <span>Total Amount</span>
                  <span className="text-blue-600 dark:text-blue-400">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-slate-400 text-right">Includes all taxes (18% GST bill)</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-base shadow-xl hover:shadow-emerald-500/25 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Confirming Order...</span>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-slate-400 space-y-1">
                <p>🔒 256-Bit SSL Encrypted Verification</p>
                <p>Our shopkeeper will verify and dispatch within 24 hours.</p>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

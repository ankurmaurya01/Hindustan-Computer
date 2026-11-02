'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Store, Phone, MessageCircle, MapPin, Truck } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    storeName: 'Hindustan Computer',
    tagline: "India's Premier Gaming & IT Hardware Destination",
    phone: '+91 99359 08565',
    whatsapp: '+919935908565',
    email: 'contact@hindustancomputer.com',
    gstin: '',
    address: 'Dohrighat Road, Near Bus Stand, Dohrighat',
    city: 'Dohrighat',
    state: 'Uttar Pradesh',
    pincode: '275303',
    shippingCharge: 99,
    freeShippingThreshold: 1999,
    enableCod: true,
    announcement: '⚡ Mega Tech Sale: Flat 10% Off on Gaming Rigs | Free Express Delivery across India on orders above ₹1,999 | Call/WhatsApp: +91 99359 08565',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data) {
          setSettings(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-sm text-slate-500">Loading shop settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Shop Settings & Contact Information
          </h1>
          <p className="text-xs text-slate-500">
            Changes saved here automatically update all website phone numbers, WhatsApp links, and invoices
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Shop settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Contact Info */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b pb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600" />
            1. Shop Phone & WhatsApp Numbers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1">Customer Care Calling Number</label>
              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                placeholder="+91 99359 08565"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">WhatsApp Order Number (with Country Code)</label>
              <input
                type="text"
                name="whatsapp"
                value={settings.whatsapp}
                onChange={handleChange}
                placeholder="+919935908565"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-emerald-600 font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                All customer WhatsApp inquiry buttons will route to this number.
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold mb-1">Official Support Email</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Physical Address & GSTIN */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b pb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            2. Retail Shop Address & GST
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold mb-1">Shop Address</label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">City</label>
              <input
                type="text"
                name="city"
                value={settings.city}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">State</label>
              <input
                type="text"
                name="state"
                value={settings.state}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">PIN Code</label>
              <input
                type="text"
                name="pincode"
                value={settings.pincode}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">GSTIN Number (Printed on customer bills)</label>
              <input
                type="text"
                name="gstin"
                value={settings.gstin}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono uppercase font-bold"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Rules */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b pb-2 flex items-center gap-2">
            <Truck className="w-4 h-4 text-purple-600" />
            3. Shipping Rules & Payment Options
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1">Standard Shipping Charge (₹)</label>
              <input
                type="number"
                name="shippingCharge"
                value={settings.shippingCharge}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Free Shipping Order Amount (₹)</label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={settings.freeShippingThreshold}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-blue-600"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Orders equal or above this amount automatically get Free Delivery.
              </span>
            </div>

            <div className="sm:col-span-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  name="enableCod"
                  checked={settings.enableCod}
                  onChange={(e) => setSettings({ ...settings, enableCod: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span>Enable Cash on Delivery (COD) Option at Checkout</span>
              </label>
            </div>
          </div>
        </div>

        {/* Top Announcement Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b pb-2">
            4. Website Top Announcement Text
          </h3>

          <div>
            <label className="block font-bold mb-1">Ticker Message (Displayed on all pages)</label>
            <input
              type="text"
              name="announcement"
              value={settings.announcement}
              onChange={handleChange}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-sm shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

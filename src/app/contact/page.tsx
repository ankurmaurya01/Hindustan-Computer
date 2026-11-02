'use client';

import React, { useState } from 'react';
import Header from '@/components/customer/Header';
import Footer from '@/components/customer/Footer';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle,
} from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Get In Touch
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Contact Hindustan Computer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Have questions about a laptop, need a custom PC build estimate, or want to check local stock? Reach out to our shopkeeper directly!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Shop Details Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Showroom Address & Hours
              </h3>

              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white mb-0.5">Physical Shop Location:</strong>
                    <a href="https://maps.app.goo.gl/QrpkQuvfyPWnit8E9" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Dohrighat Road, Near Bus Stand, Dohrighat, UP - 275303 ↗</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white mb-0.5">WhatsApp Direct Line:</strong>
                    <a
                      href="https://wa.me/919935908565"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      +91 99359 08565 (Click to Chat)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white mb-0.5">Telephone Inquiry:</strong>
                    <a href="tel:+919935908565" className="hover:underline">
                      +91 99359 08565 / +91 99359 08565
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white mb-0.5">Store Opening Hours:</strong>
                    <span>Monday to Saturday: 10:30 AM to 8:30 PM<br />Sunday: Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Action Card */}
            <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl text-white space-y-3 shadow-md">
              <h4 className="font-black text-base">Instant WhatsApp Support</h4>
              <p className="text-xs text-emerald-100">
                Send your PC component list, motherboard requirements, or laptop model directly to our shop technician on WhatsApp.
              </p>
              <a
                href="https://wa.me/919935908565?text=Hi%20Hindustan%20Computer,%20I%20have%20an%20inquiry%20regarding%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-800 font-bold text-xs rounded-xl hover:bg-emerald-50 transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp Now</span>
              </a>
            </div>
          </div>

          {/* Contact Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4">
              Send an Online Inquiry
            </h3>

            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">Message Received!</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thank you for contacting Hindustan Computer. Our team will call or message you back shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Mobile Number (With WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. rahul@gmail.com"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Inquiry / Requirements *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe what product or PC configuration you are looking for..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Message to Store</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

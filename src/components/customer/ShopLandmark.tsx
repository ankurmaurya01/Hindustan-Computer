'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, PhoneCall, MessageCircle, Navigation, Clock, CheckCircle } from 'lucide-react';

const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/QrpkQuvfyPWnit8E9';
const PHONE_NUMBER = '+919935908565';
const WHATSAPP_URL = 'https://wa.me/919935908565?text=Hello%20Hindustan%20Computer,%20I%20want%20to%20visit%20your%20shop.';

export default function ShopLandmark() {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 my-6 sm:my-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Shop Photo Column */}
          <div className="lg:col-span-5 relative bg-slate-100 dark:bg-slate-950 min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] flex items-center justify-center p-3 sm:p-4">
            <div className="relative w-full h-full min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] rounded-2xl overflow-hidden shadow-md group">
              <Image
                src="/shop-front.png"
                alt="Hindustan Computer Shop Front - Dohrighat"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

              {/* Verified Badge */}
              <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white">
                  Verified Local Shopfront
                </span>
              </div>

              {/* Bottom Caption on Image */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs font-bold drop-shadow">Hindustan Computer Sales &amp; Service</p>
                <p className="text-[11px] text-white/90 drop-shadow">Jai Guru Dev Ashram, Dohrighat - Mau</p>
              </div>
            </div>
          </div>

          {/* Details & Directions Column */}
          <div className="lg:col-span-7 p-5 sm:p-6 lg:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Heading */}
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                  <MapPin className="w-4 h-4 text-red-500" />
                  Clear Landmark &amp; Directions
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Visit Hindustan Computer in Dohrighat
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Look for our orange showroom board shown in the photo. Feel free to call us anytime if you need help finding the way!
                </p>
              </div>

              {/* Landmark Highlights Card */}
              <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200">
                      Exact Landmark:
                    </h4>
                    <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed mt-0.5">
                      <strong>Jai Guru Dev Ashram Road</strong>, Near Dohrighat Bus Stand, Dohrighat, Mau, Uttar Pradesh - 275303
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Mon – Sat: <strong>10:30 AM – 8:30 PM</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Proprietor:</span>
                    <span>Raghunandan Maurya</span>
                  </div>
                </div>
              </div>

              {/* Services Available on Spot */}
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-white">Available in-store: </span>
                Laptop/Desktop Repair &bull; Windows Setup &bull; SSD &amp; RAM Upgrades &bull; Keyboards, Mouse, Inks &bull; CCTV Installation &bull; Printing
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-sm active:scale-95"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions on Maps ↗</span>
              </a>

              <a
                href={`tel:${PHONE_NUMBER}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-bold text-xs sm:text-sm rounded-xl transition shadow-sm active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Shopkeeper</span>
              </a>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-sm active:scale-95"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

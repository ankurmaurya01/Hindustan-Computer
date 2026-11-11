'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 text-sm border-t border-slate-800">
      {/* 4 Feature Badges */}
      <div className="border-b border-slate-800 py-6 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-white text-xs md:text-sm truncate sm:whitespace-normal">100% Genuine</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate sm:whitespace-normal">Direct brand warranty</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-white text-xs md:text-sm truncate sm:whitespace-normal">Insured Delivery</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate sm:whitespace-normal">Across all India</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-600/10 text-amber-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-white text-xs md:text-sm truncate sm:whitespace-normal">UPI, Card & COD</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate sm:whitespace-normal">Zero fraud verified</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-white text-xs md:text-sm truncate sm:whitespace-normal">7 Days Replacement</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate sm:whitespace-normal">Hassle-free guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Store Intro */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              HC
            </div>
            <span className="font-extrabold text-lg text-white">HINDUSTAN COMPUTER</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your trusted local computer shop in Dohrighat. We provide computer & laptop repair, Windows installation, virus removal, printer ink, toners, keyboards, mouse, monitors, SSDs, and all computer accessories.
          </p>
          <div className="text-xs text-slate-400 space-y-1">
            <p><strong className="text-white">GSTIN:</strong> </p>
            <p><strong className="text-white">Govt. Registered Enterprise</strong></p>
          </div>
        </div>

        {/* Col 2: Categories */}
        <div>
          <h3 className="text-white font-bold text-sm mb-3">Shop Categories & Services</h3>
          <ul className="space-y-2 text-xs">
            <li><Link href="/category/keyboards" className="hover:text-blue-400 transition">Keyboards & Optical Mouse</Link></li>
            <li><Link href="/category/printers" className="hover:text-blue-400 transition">Printer Inks & 88A/12A Toners</Link></li>
            <li><Link href="/category/computer-monitors" className="hover:text-blue-400 transition">Computer Monitors (Lapcare / Acer)</Link></li>
            <li><Link href="/category/ssd-and-hdd" className="hover:text-blue-400 transition">SSD Upgrades (128GB / 256GB / 512GB)</Link></li>
            <li><Link href="/category/computer-accessories" className="hover:text-blue-400 transition">Cables, Adapters & Laptop Chargers</Link></li>
            <li><Link href="/contact" className="hover:text-blue-400 transition">Computer & Laptop Repair (Windows ₹200)</Link></li>
          </ul>
        </div>

        {/* Col 3: Customer Care & Policies */}
        <div>
          <h3 className="text-white font-bold text-sm mb-3">Customer Support</h3>
          <ul className="space-y-2 text-xs">
            <li><Link href="/track-order" className="hover:text-blue-400 transition">Track Your Order Status</Link></li>
            <li><Link href="/contact" className="hover:text-blue-400 transition">Visit Our Showroom</Link></li>
            <li><Link href="/contact#faq" className="hover:text-blue-400 transition">Frequently Asked Questions (FAQ)</Link></li>
            <li><Link href="/contact#return-policy" className="hover:text-blue-400 transition">Warranty & Return Policy</Link></li>
            <li><Link href="/contact#privacy" className="hover:text-blue-400 transition">Privacy & Payment Terms</Link></li>
            <li><Link href="/admin/login" className="text-blue-400 hover:underline font-semibold">Shopkeeper Dashboard Login</Link></li>
          </ul>
        </div>

        {/* Col 4: Store Address & Hours */}
        <div className="space-y-3">
          <h3 className="text-white font-bold text-sm mb-3">Shop Address & Timings</h3>
          <div className="flex items-start gap-2 text-xs">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>Shop #14-16, Ground Floor, IT Mall, Dohrighat, Uttar Pradesh - 275303</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Phone className="w-4 h-4 text-blue-400 shrink-0" />
            <a href="tel:+919935908565" className="hover:text-white transition">+91 99359 08565</a>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <a href="https://wa.me/919935908565" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition">
              WhatsApp: +91 99359 08565
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Monday – Saturday: 10:30 AM – 8:30 PM (Sunday Closed)</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Payment Methods */}
      <div className="border-t border-slate-800 py-4 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} Hindustan Computer. All rights reserved. Computer Sales, Repair & IT Services • Dohrighat, Uttar Pradesh.</p>
          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-1.5 sm:gap-2">
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] sm:text-[11px] text-slate-300 font-mono">UPI / GPay</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] sm:text-[11px] text-slate-300 font-mono">RuPay</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] sm:text-[11px] text-slate-300 font-mono">Net Banking</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] sm:text-[11px] text-slate-300 font-mono">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

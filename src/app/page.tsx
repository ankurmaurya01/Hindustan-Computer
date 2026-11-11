'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/customer/Header';
import Footer from '@/components/customer/Footer';
import ProductCard from '@/components/customer/ProductCard';
import RepairInquiry from '@/components/customer/RepairInquiry';
import GoogleReview from '@/components/customer/GoogleReview';
import {
  Laptop,
  Monitor,
  Cpu,
  Layers,
  HardDrive,
  Keyboard,
  Printer,
  ChevronRight,
  Sparkles,
  PhoneCall,
  MessageCircle,
  Wrench,
  Shield,
  Truck,
  ArrowRight,
  Package,
  PlusCircle,
  ShieldAlert,
  Settings,
  Disc,
  MapPin,
  CheckCircle,
} from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes, banRes] = await Promise.all([
          fetch('/api/products?limit=24'),
          fetch('/api/categories'),
          fetch('/api/banners'),
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();
        const banData = await banRes.json();

        setProducts(prodData.products || []);
        setCategories(catData || []);
        setBanners(banData || []);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Hero auto-slider
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Category Icon Mapper
  const getCatIcon = (slug: string) => {
    switch (slug) {
      case 'laptops': return <Laptop className="w-6 h-6" />;
      case 'desktop-computers': return <Monitor className="w-6 h-6" />;
      case 'computer-monitors': return <Monitor className="w-6 h-6" />;
      case 'ssd-and-hdd': return <HardDrive className="w-6 h-6" />;
      case 'keyboards': return <Keyboard className="w-6 h-6" />;
      case 'mouse': return <Keyboard className="w-6 h-6" />;
      case 'printers': return <Printer className="w-6 h-6" />;
      case 'motherboards': return <Layers className="w-6 h-6" />;
      case 'power-supply-smps': return <Cpu className="w-6 h-6" />;
      default: return <Cpu className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="flex-1 space-y-10 pb-16">
        {/* Hero Banner Slider */}
        <section className="max-w-7xl mx-auto px-3 sm:px-4 pt-2 sm:pt-4">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 min-h-[340px] sm:min-h-[300px] md:aspect-24/9 shadow-xl flex items-center">
            {banners.length > 0 ? (
              banners.map((slide, idx) => (
                <div
                  key={slide._id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center ${
                    idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {/* Background Image with Overlay */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover object-center filter brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />

                  {/* Slide Content */}
                  <div className="relative z-20 max-w-xl p-4 sm:p-6 md:p-12 space-y-2.5 sm:space-y-3">
                    {slide.badge && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-600/90 text-white font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider shadow-sm">
                        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        {slide.badge}
                      </span>
                    )}
                    <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xs md:text-sm text-slate-300 line-clamp-2">
                      {slide.subtitle}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3">
                      <Link
                        href={slide.link || '/products'}
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm rounded-xl shadow-lg transition"
                      >
                        <span>{slide.buttonText || 'Browse Shop'}</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Link>
                      <a
                        href="https://wa.me/919935908565?text=Hi%20Hindustan%20Computer,%20I%20have%20an%20inquiry%20regarding%20products%20or%20repair%20services."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs md:text-sm rounded-xl backdrop-blur-md transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 sm:p-12 text-white text-xs sm:text-sm">Loading shop details...</div>
            )}

            {/* Slider Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Google Review Banner */}
        <GoogleReview />

        {/* Quick Highlights Strip */}
        <section className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2.5 sm:gap-3 p-1 sm:p-2 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">Genuine Parts</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Keyboards, SSDs & inks</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3 p-1 sm:p-2 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">Expert Repair</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Fast PC diagnostics</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3 p-1 sm:p-2 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Disc className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">Windows Setup</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">OS setup from ₹200</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3 p-1 sm:p-2 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">Direct Support</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Talk to shopkeeper</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Computer Services (Reflecting https://hindustan-computer.netlify.app/) */}
        <section className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm space-y-5 sm:space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Wrench className="w-3.5 h-3.5" />
                  Service & Maintenance
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                  Our Computer & Laptop Services
                </h2>
                <p className="text-xs text-slate-500 max-w-xl">
                  We offer reliable and affordable IT solutions for home, student, shop billing, and office computers in Dohrighat.
                </p>
              </div>
              <a
                href="https://wa.me/919935908565?text=Hi%20Hindustan%20Computer,%20I%20need%20help%20with%20a%20computer%20service%20request."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition shrink-0"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Request Service on WhatsApp</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Service 1: Repair */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Repair Services
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Troubleshooting, screen & hinge repairs, hardware replacements, and software fixes for all major brands.
                </p>
              </div>

              {/* Service 2: Virus Removal */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Virus & Malware Removal
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Deep system cleaning, malware protection, PC speed-up, and data recovery assistance.
                </p>
              </div>

              {/* Service 3: Custom Builds */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Monitor className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Desktop PC Assembly
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tailored budget desktop assembly for home study, office, shop billing, and everyday usage.
                </p>
              </div>

              {/* Service 4: Windows Installation */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Disc className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Windows Installation
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fresh Windows OS installation, driver setup, and essential software configuration. Starting at ₹200.
                </p>
              </div>
            </div>
          </div>
        </section>


                {/* Can It Be Repaired? Interactive Inquiry Tool */}
        <RepairInquiry />

        {/* Shop by Popular Categories */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Browse Shop by Category
              </h2>
              <p className="text-xs text-slate-500">Keyboards, mice, printer inks, storage, cables & components</p>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View All Products</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-md text-center transition"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  {getCatIcon(cat.slug)}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-blue-600 transition">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">Explore &rarr;</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Catalog Empty State when no products are present */}
        {!loading && products.length === 0 && (
          <section className="max-w-7xl mx-auto px-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Package className="w-8 h-8" />
              </div>
              <div className="max-w-lg mx-auto space-y-1">
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Inventory Under Preparation
                </h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                  We are updating our store catalog with fresh accessories and stock. Browse our categories, visit our shop, or message us directly on WhatsApp!
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href="https://wa.me/919935908565?text=Hi%20Hindustan%20Computer,%20I%20am%20looking%20for%20computer%20accessories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Inquiries</span>
                </a>
                <Link
                  href="/admin/products/new"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add First Product (Admin)</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Normal Budget Desktop PC Assembly Banner */}
        <section className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-5 sm:p-6 md:p-10 border border-blue-900/40 shadow-xl">
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] sm:text-xs font-bold uppercase">
                <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Custom Desktop Assembly
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
                Need a Desktop PC for Home, Office, or Study?
              </h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Tell us your budget (e.g. ₹12,000, ₹18,000, or ₹25,000) and requirement (Shop billing, Tally, student study, CSC center, or internet browsing). We assemble tested desktop PCs with warranty, monitors, and accessories!
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2">
                <a
                  href="https://wa.me/919935908565?text=Hi%20Hindustan%20Computer,%20I%20want%20to%20get%20a%20quotation%20for%20an%20assembled%20desktop%20PC.%20My%20budget%20is%20₹"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs md:text-sm rounded-xl shadow-lg transition"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  <span>Get Free PC Quotation on WhatsApp</span>
                </a>
                <Link
                  href="/products"
                  className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs md:text-sm rounded-xl transition border border-slate-700"
                >
                  <span>Browse All Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
          </div>
        </section>

        {/* Available Products Grid (when items are added) */}
        {products.length > 0 && (
          <section className="max-w-7xl mx-auto px-3 sm:px-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Available in Store
                </h2>
                <p className="text-xs text-slate-500">Genuine computer peripherals and accessories</p>
              </div>
              <Link
                href="/products"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View Full Catalog</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Offline Showroom Visit Callout */}
        <section className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 shadow-sm">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center justify-center md:justify-start gap-1">
                <MapPin className="w-4 h-4" />
                Visit Our Local Shop
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
                Visit Hindustan Computer in Dohrighat
              </h3>
              <p className="text-xs text-slate-500 max-w-lg">
                Located at <strong>Dohrighat Road, Near Bus Stand, Dohrighat, UP - 275303</strong>. Buy keyboards, mouse, printer inks, SSDs, cables, laptop chargers, or bring your computer for quick servicing!
              </p>
            </div>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2.5 sm:gap-3 shrink-0">
              <a
                href="https://maps.app.goo.gl/QrpkQuvfyPWnit8E9"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold rounded-xl text-center hover:opacity-90 transition flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Google Maps Location</span>
              </a>
              <a
                href="tel:+919935908565"
                className="w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-2.5 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-slate-700 text-xs font-bold rounded-xl text-center hover:bg-blue-100 transition flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call: +91 99359 08565</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/customer/Header';
import Footer from '@/components/customer/Footer';
import ProductCard from '@/components/customer/ProductCard';
import {
  Laptop,
  Monitor,
  Gamepad2,
  Cpu,
  Layers,
  HardDrive,
  Keyboard,
  Printer,
  ChevronRight,
  Flame,
  Clock,
  Sparkles,
  PhoneCall,
  MessageCircle,
  Wrench,
  Shield,
  Truck,
  ArrowRight,
  Package,
  PlusCircle,
} from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Countdown timer for Deals of the day
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes, banRes] = await Promise.all([
          fetch('/api/products?limit=20'),
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
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const featuredGamingRigs = products.filter(
    (p) => p.category === 'gaming-pcs' || p.category === 'graphics-cards-gpu'
  );
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNewArrival || p.isFeatured).slice(0, 8);

  // Category Icon Mapper
  const getCatIcon = (slug: string) => {
    switch (slug) {
      case 'laptops': return <Laptop className="w-6 h-6" />;
      case 'desktop-computers': return <Monitor className="w-6 h-6" />;
      case 'gaming-pcs': return <Gamepad2 className="w-6 h-6" />;
      case 'processors-cpu': return <Cpu className="w-6 h-6" />;
      case 'graphics-cards-gpu': return <Layers className="w-6 h-6" />;
      case 'ssd-and-hdd': return <HardDrive className="w-6 h-6" />;
      case 'keyboards': return <Keyboard className="w-6 h-6" />;
      case 'printers': return <Printer className="w-6 h-6" />;
      default: return <Cpu className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 space-y-10 pb-16">
        {/* Hero Banner Slider */}
        <section className="max-w-7xl mx-auto px-4 pt-4">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 aspect-21/9 md:aspect-24/9 min-h-[320px] shadow-2xl flex items-center">
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
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

                  {/* Slide Content */}
                  <div className="relative z-20 max-w-xl p-6 md:p-12 space-y-3">
                    {slide.badge && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/90 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        {slide.badge}
                      </span>
                    )}
                    <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-sm md:text-base text-slate-300 line-clamp-2">
                      {slide.subtitle}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-3">
                      <Link
                        href={slide.link || '/products'}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-blue-500/25 transition"
                      >
                        <span>{slide.buttonText || 'Shop Now'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <a
                        href="https://wa.me/919935908565?text=Hi%20Hindustan%20Computer,%20I%20want%20to%20inquire%20about%20your%20current%20offers"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl backdrop-blur-md transition"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                        <span>Ask on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-white">Loading promotions...</div>
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

        {/* Quick Highlights Strip */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white">Authorized Dealer</h4>
                <p className="text-[11px] text-slate-500">100% genuine brand warranty</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white">Free Express Delivery</h4>
                <p className="text-[11px] text-slate-500">On all orders above ₹1,999</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white">Custom PC Assembly</h4>
                <p className="text-[11px] text-slate-500">Free cable-management & test</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white">Direct Shop Support</h4>
                <p className="text-[11px] text-slate-500">Talk directly to shopkeeper</p>
              </div>
            </div>
          </div>
        </section>

        {/* Shop by Popular Categories */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Shop by Category
              </h2>
              <p className="text-xs text-slate-500">Explore computer hardware, peripherals, and systems</p>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View All 25 Categories</span>
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
                  We are updating our store catalog with brand-new products and fresh stock. Browse our categories, visit our showroom, or contact us directly on WhatsApp!
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href="https://wa.me/919935908565?text=Hi%20Hindustan%20Computer,%20I%20am%20looking%20for%20computer%20hardware"
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

        {/* Hot Deals of the Day (Countdown Timer) */}
        {bestsellers.length > 0 && (
          <section className="max-w-7xl mx-auto px-4">
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-6 text-white shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <Flame className="w-8 h-8 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs font-bold tracking-widest uppercase text-amber-200">
                    Flash Discount Sale
                  </span>
                  <h3 className="text-xl md:text-2xl font-black">Today's Mega Tech Deals</h3>
                  <p className="text-xs text-rose-100">Special prices directly negotiated with manufacturers</p>
                </div>
              </div>

              {/* Countdown Box */}
              <div className="flex items-center gap-2 font-mono text-sm font-bold bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>Ends in:</span>
                <span className="bg-black/50 px-2 py-1 rounded text-amber-300">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                :
                <span className="bg-black/50 px-2 py-1 rounded text-amber-300">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                :
                <span className="bg-black/50 px-2 py-1 rounded text-amber-300">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            {/* Deals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {bestsellers.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Custom PC Build Banner for Shopkeeper */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy via-slate-900 to-blue-950 p-6 md:p-10 border border-blue-900/40 shadow-xl">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase">
                <Gamepad2 className="w-4 h-4" />
                Custom Gaming Rig Builder
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                Want a Custom PC Build Within Your Budget?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Tell us your budget (e.g. ₹50,000, ₹1 Lakh, or ₹2.5 Lakhs) and what games or software you use (GTA V, Valorant, 3D Blender, Video Editing). Our senior technician will assemble, wire, and stress-test your rig with zero assembly charges!
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://wa.me/919935908565?text=Hi%20Hindustan%20Computer,%20I%20want%20to%20get%20a%20quotation%20for%20a%20custom%20PC%20build.%20My%20budget%20is%20₹"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg transition"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Get Free PC Quotation on WhatsApp</span>
                </a>
                <Link
                  href="/category/gaming-pcs"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition border border-slate-700"
                >
                  <span>View Ready Prebuilt PCs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
          </div>
        </section>

        {/* Featured Gaming PCs & GPUs */}
        {products.length > 0 && (
          <section className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    High-Performance Gaming PCs & GPUs
                  </h2>
                </div>
                <p className="text-xs text-slate-500">Ultra-fast framerates for 1080p, 1440p, and 4K raytracing</p>
              </div>
              <Link
                href="/category/gaming-pcs"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View All Gaming Rigs</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {featuredGamingRigs.length > 0
                ? featuredGamingRigs.map((product) => <ProductCard key={product._id} product={product} />)
                : products.slice(0, 4).map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          </section>
        )}

        {/* New Arrivals & Best-Selling Hardware */}
        {newArrivals.length > 0 && (
          <section className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  New Arrivals & Trending Products
                </h2>
                <p className="text-xs text-slate-500">Fresh stock just arrived at our store</p>
              </div>
              <Link
                href="/products"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Explore All Products</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Offline Showroom Visit Callout */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                Visit Our Physical Store
              </span>
              <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
                Want to See & Test Products Before Buying?
              </h3>
              <p className="text-xs text-slate-500 max-w-lg">
                Visit our retail showroom at <strong>Dohrighat Road, Near Bus Stand, Dohrighat, UP - 275303</strong>. Try out mechanical keyboards, gaming monitors, and test laptops in person!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/contact"
                className="px-5 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold rounded-xl text-center hover:opacity-90 transition"
              >
                Store Location & Directions
              </Link>
              <a
                href="tel:+919935908565"
                className="px-5 py-2.5 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-slate-700 text-xs font-bold rounded-xl text-center hover:bg-blue-100 transition"
              >
                Call Shop: +91 99359 08565
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

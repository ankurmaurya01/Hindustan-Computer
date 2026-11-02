'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  Phone,
  Moon,
  Sun,
  Menu,
  X,
  ShieldCheck,
  User,
  Truck,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
  const router = useRouter();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Live search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data.results || []);
        setShowSearchDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Top Announcement Bar */}
      <div className="bg-brand-navy text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wide">
              Official Store
            </span>
            <span className="truncate">
              ⚡ 100% Genuine Hardware &bull; GST Bill &bull; Brand Warranty &bull; Free Delivery above ₹1,999
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <a
              href="https://wa.me/919935908565"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-emerald-400 transition"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Shop: +91 99359 08565</span>
            </a>
            <span className="hidden md:inline text-slate-500">|</span>
            <Link href="/track-order" className="hidden md:flex items-center gap-1 hover:text-white transition">
              <Truck className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v10h16V6H4zm4 13h8v2H8v-2z" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-xl md:text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              HINDUSTAN <span className="text-blue-600 dark:text-blue-400">COMPUTER</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500 dark:text-slate-400 block -mt-1">
              PC &bull; Laptop &bull; IT Hardware
            </span>
          </div>
        </Link>

        {/* Live Search Bar */}
        <div ref={searchRef} className="relative hidden md:block flex-1 max-w-lg mx-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search laptops, GPUs, processors, SSDs, keyboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
              className="w-full pl-10 pr-20 py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-full text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full transition"
            >
              Search
            </button>
          </form>

          {/* Search suggestions dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50">
              {isSearching ? (
                <div className="p-4 text-center text-sm text-slate-500">Searching store...</div>
              ) : searchResults.length > 0 ? (
                <div>
                  <div className="p-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50">
                    Product Suggestions
                  </div>
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.slug}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 transition"
                    >
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded bg-white p-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">
                          ₹{item.price.toLocaleString('en-IN')}{' '}
                          <span className="text-slate-400 line-through text-[11px] font-normal">
                            ₹{item.mrp.toLocaleString('en-IN')}
                          </span>
                        </p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${item.stock > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-red-100 text-red-700'}`}>
                        {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </Link>
                  ))}
                  <Link
                    href={`/products?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="block text-center p-2.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                  >
                    View all matching results &rarr;
                  </Link>
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-slate-500">
                  No products found for "{searchQuery}". Try searching for laptops, GPUs, or processors.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
            title="Toggle Dark / Light Mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
            title="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {itemCount}
              </span>
            )}
          </button>

          {/* Shopkeeper Admin Portal Link */}
          {isAdmin ? (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white dark:bg-blue-600 hover:bg-blue-700 text-xs font-semibold rounded-lg shadow-sm transition"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin Panel</span>
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 dark:border-slate-700 hover:border-blue-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition"
            >
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Shopkeeper Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Menu Bar */}
      <nav className="bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold tracking-wide">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center gap-6 whitespace-nowrap">
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
              Home
            </Link>
            <Link href="/products" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 transition">
              All Products
            </Link>
            <Link href="/category/laptops" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 transition">
              Laptops
            </Link>
            <Link href="/category/gaming-pcs" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 transition flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Gaming PCs
            </Link>
            <Link href="/category/graphics-cards-gpu" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 transition">
              Graphics Cards (GPU)
            </Link>
            <Link href="/category/processors-cpu" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 transition">
              Processors (CPU)
            </Link>
            <Link href="/category/computer-monitors" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 transition">
              Monitors
            </Link>
            <Link href="/category/ssd-and-hdd" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 transition">
              SSD & HDD
            </Link>
            <Link href="/category/keyboards" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 transition">
              Keyboards & Mouse
            </Link>
            <Link href="/category/printers" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 transition">
              Printers
            </Link>
            <Link href="/contact" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 transition">
              Contact Shop
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-slate-500 dark:text-slate-400 whitespace-nowrap pl-4">
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Call Shop: <strong>+91 99359 08565</strong></span>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <div className="flex flex-col gap-2 font-medium text-sm">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
              Home
            </Link>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
              All Products
            </Link>
            <Link href="/category/gaming-pcs" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
              Gaming PCs & Rigs
            </Link>
            <Link href="/category/laptops" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
              Laptops
            </Link>
            <Link href="/category/graphics-cards-gpu" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
              Graphics Cards (GPU)
            </Link>
            <Link href="/track-order" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
              Track My Order
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
              Shop Address & Contact
            </Link>
            <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)} className="p-2 text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/40 rounded">
              Shopkeeper Admin Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

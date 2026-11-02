'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/customer/Header';
import Footer from '@/components/customer/Footer';
import ProductCard from '@/components/customer/ProductCard';
import Link from 'next/link';
import {
  ShoppingCart,
  Zap,
  MessageCircle,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  MapPin,
  Store,
  Clock,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Pin code delivery checker
  const [pinCode, setPinCode] = useState('');
  const [pinResult, setPinResult] = useState<any>(null);
  const [pinLoading, setPinLoading] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'warranty' | 'reviews'>('specs');

  // Customer reviews
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) {
          router.push('/products');
          return;
        }
        const data = await res.json();
        setProduct(data);

        // Fetch related products in same category
        if (data.category) {
          const relRes = await fetch(`/api/products?category=${data.category}&limit=4`);
          const relData = await relRes.json();
          setRelated((relData.products || []).filter((p: any) => p._id !== data._id));
        }

        // Fetch reviews
        const revRes = await fetch(`/api/reviews?productId=${data._id}`);
        const revData = await revRes.json();
        setReviews(revData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug, router]);

  const handleCheckPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode.trim() || pinCode.trim().length !== 6) return;
    setPinLoading(true);
    setPinResult(null);
    try {
      const res = await fetch(`/api/pincode/${pinCode.trim()}`);
      const data = await res.json();
      setPinResult(data);
    } catch {
      setPinResult({ available: false, message: 'Could not verify PIN code' });
    } finally {
      setPinLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addItem(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product && product.stock > 0) {
      addItem(product, quantity);
      router.push('/checkout');
    }
  };

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    const msg = `Hello Hindustan Computer! I want to check stock availability for: *${product.name}* (Price: ₹${product.sellingPrice.toLocaleString('en-IN')}). Can I pick this up from your Dohrighat shop?`;
    window.open(`https://wa.me/919935908565?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          customerName: reviewName,
          customerEmail: reviewEmail,
          rating: reviewRating,
          title: reviewTitle || 'Great Product',
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews([data.review, ...reviews]);
        setReviewSuccess(true);
        setReviewComment('');
        setReviewTitle('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 max-w-7xl mx-auto p-8 text-center text-slate-500">Loading product details...</div>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  const discount =
    product.discountPercentage ||
    (product.mrp && product.sellingPrice
      ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
      : 0);

  const images = product.images && product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/category/${product.category}`} className="hover:text-blue-600 capitalize">
            {product.category?.replace(/-/g, ' ')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Top Product Section: Gallery & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Col 1: Images (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-center overflow-hidden shadow-sm">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-16 rounded-xl border p-1 bg-white shrink-0 transition ${
                      activeImage === idx
                        ? 'border-blue-600 ring-2 ring-blue-600/30'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Col 2: Details & Purchase Box (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-extrabold uppercase text-blue-600 tracking-wider">
                  {product.brand}
                </span>
                <span className="font-mono text-slate-400">SKU: {product.sku}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s <= Math.round(product.rating || 5) ? 'fill-current' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {product.rating || 5.0}
                </span>
                <span className="text-xs text-slate-400">
                  ({reviews.length || product.numReviews || 0} verified reviews)
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                ₹{product.sellingPrice?.toLocaleString('en-IN')}
              </span>
              {product.mrp && product.mrp > product.sellingPrice && (
                <span className="text-sm text-slate-400 line-through">
                  MRP: ₹{product.mrp?.toLocaleString('en-IN')}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                  You Save: ₹{(product.mrp - product.sellingPrice).toLocaleString('en-IN')} ({discount}%)
                </span>
              )}
              <span className="w-full text-[11px] text-slate-500">
                Inclusive of 18% GST &bull; Tax invoice provided with delivery
              </span>
            </div>

            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="space-y-1.5 py-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Key Highlights:
                </span>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  {product.highlights.map((hl: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stock status */}
            <div className="text-xs flex items-center gap-2">
              <span className="font-semibold text-slate-500">Availability:</span>
              {product.stock > 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  In Stock at Dohrighat Shop ({product.stock} units available)
                </span>
              ) : (
                <span className="text-red-500 font-bold">Currently Out of Stock</span>
              )}
            </div>

            {/* In-Store Pickup Location Box */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 space-y-2 text-xs">
              <span className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                <Store className="w-4 h-4 text-blue-600" />
                Store Pickup Only (दुकान से संग्रह):
              </span>
              <p className="text-slate-700 dark:text-slate-300">
                Collect directly from <strong>Hindustan Computer</strong>, Dohrighat Road, Near Bus Stand, Dohrighat, UP - 275303.
              </p>
              <div className="text-[11px] text-slate-500 flex flex-wrap gap-3 pt-1">
                <span>⏱️ Mon – Sat: 10:30 AM to 8:30 PM</span>
                <span>📞 Call/WhatsApp: +91 99359 08565</span>
              </div>
            </div>

            {/* Quantity Selector + Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity:</span>
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-l"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-r disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(product._id)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:text-red-500 transition"
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current text-red-500' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition disabled:opacity-40"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black rounded-xl text-sm shadow-md transition disabled:opacity-40"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now</span>
                </button>

                <button
                  onClick={handleWhatsAppInquiry}
                  className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Order on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Shopkeeper Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{product.warranty || 'Brand Warranty'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>7 Days Replacement</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Express Insured Shipping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Specifications / Description / Warranty / Customer Reviews */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-x-auto">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-3.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('desc')}
              className={`px-6 py-3.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'desc'
                  ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Full Description & Overview
            </button>
            <button
              onClick={() => setActiveTab('warranty')}
              className={`px-6 py-3.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'warranty'
                  ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Warranty & Service Policy
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          <div className="p-6">
            {/* Specs Tab */}
            {activeTab === 'specs' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                  Technical Specifications Table
                </h3>
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
                    {product.specifications.map((spec: any, idx: number) => (
                      <div key={idx} className="grid grid-cols-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <span className="font-bold text-slate-500 col-span-1">{spec.key}</span>
                        <span className="text-slate-900 dark:text-white font-medium col-span-2">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Contact shop on WhatsApp for full hardware compatibility spec sheet.</p>
                )}
              </div>
            )}

            {/* Description Tab */}
            {activeTab === 'desc' && (
              <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                <p>{product.description}</p>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/40 text-blue-900 dark:text-blue-200 mt-4">
                  <h4 className="font-bold mb-1">Authenticity & Indian Tax Invoice Guarantee</h4>
                  <p>All products sold by Hindustan Computer are 100% brand new, factory sealed in original retail boxes with unbroken manufacturer holographic seals. You will receive an official GST bill with serialized component tracking.</p>
                </div>
              </div>
            )}

            {/* Warranty Tab */}
            {activeTab === 'warranty' && (
              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Warranty Coverage</h4>
                  <p>{product.warranty}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">7-Day Replacement Policy</h4>
                  <p>In the unlikely event of physical transit damage or dead-on-arrival (DOA) hardware, notify us within 7 days for immediate replacement or full refund.</p>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Write a review form */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Write a Review</h4>
                  {reviewSuccess && (
                    <p className="text-xs text-emerald-600 font-bold mb-2">Thank you! Your verified review has been posted.</p>
                  )}
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-medium mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          className="w-full p-2 bg-white dark:bg-slate-800 border rounded-xl"
                          placeholder="e.g. Ramesh Patel"
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Rating</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full p-2 bg-white dark:bg-slate-800 border rounded-xl"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                          <option value="4">⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                          <option value="3">⭐⭐⭐ (3 Stars - Average)</option>
                        </select>
                      </div>
                    </div>
                    <div className="text-xs">
                      <label className="block font-medium mb-1">Review Comment</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-slate-800 border rounded-xl"
                        placeholder="Share your experience with this product and delivery..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
                    >
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-3">
                  {reviews.length > 0 ? (
                    reviews.map((rev: any) => (
                      <div key={rev._id} className="p-4 border rounded-2xl bg-white dark:bg-slate-800/40 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">{rev.customerName}</span>
                          <span className="text-slate-400 text-[11px]">{new Date(rev.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{rev.title}</p>
                        <p className="text-slate-600 dark:text-slate-300">{rev.comment}</p>
                        {rev.adminReply && (
                          <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/30 text-blue-800 dark:text-blue-300 mt-2">
                            <span className="font-bold">Shopkeeper Response:</span> {rev.adminReply}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">No reviews yet for this product. Be the first to review!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Related Hardware & Accessories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

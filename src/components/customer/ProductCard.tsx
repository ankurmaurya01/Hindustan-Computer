'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, MessageCircle, Star, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductCard({ product }: { product: any }) {
  const { addItem, items } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product._id);
  const cartItem = items.find((i) => i.id === product._id);
  const isInCart = !!cartItem;

  const discount =
    product.discountPercentage ||
    (product.mrp && product.sellingPrice
      ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
      : 0);

  // WhatsApp order click pre-fill
  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const msg = `Hello Hindustan Computer, I am interested in buying: *${product.name}* (Price: ₹${product.sellingPrice.toLocaleString('en-IN')}). Is it currently available for delivery?`;
    window.open(`https://wa.me/919935908565?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addItem(product, 1);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:shadow-xl hover:border-blue-500/40 transition-all duration-300">
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
              -{discount}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Hot Deal
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`p-1.5 rounded-full border transition ${
            isFavorited
              ? 'bg-red-50 dark:bg-red-950/40 border-red-300 text-red-500'
              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500'
          }`}
          title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square my-2 overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800/40 p-2">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80'}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Product Details */}
      <div className="space-y-1.5 pt-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-blue-600 dark:text-blue-400">
            {product.brand}
          </span>
          {product.rating && (
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
              <span className="text-slate-400 text-[10px] font-normal">({product.numReviews || 0})</span>
            </div>
          )}
        </div>

        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition">
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="pt-1 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
            ₹{product.sellingPrice?.toLocaleString('en-IN')}
          </span>
          {product.mrp && product.mrp > product.sellingPrice && (
            <span className="text-xs text-slate-400 line-through">
              ₹{product.mrp?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Stock info */}
        <div className="text-[11px] flex items-center gap-1">
          {product.stock > 0 ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {product.stock <= 3 ? `Only ${product.stock} Left in Shop!` : 'In Stock (Ready to Dispatch)'}
            </span>
          ) : (
            <span className="text-red-500 font-medium">Out of Stock</span>
          )}
        </div>
      </div>

      {/* Actions: Add to Cart + WhatsApp Order */}
      <div className="pt-3 grid grid-cols-2 gap-2">
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition ${
            isInCart
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : product.stock > 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added ({cartItem?.quantity})</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <button
          onClick={handleWhatsAppOrder}
          className="flex items-center justify-center gap-1 py-2 px-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-bold transition"
          title="Direct WhatsApp Order with Shopkeeper"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
}

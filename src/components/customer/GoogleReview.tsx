'use client';

import React, { useState } from 'react';

const REVIEW_TEXT =
  'Excellent computer shop in Dohrighat! Genuine products, great prices, expert laptop & PC repair service. Very helpful and trustworthy shopkeeper. Highly recommend Hindustan Computer!';

const GOOGLE_REVIEW_URL = 'https://maps.app.goo.gl/QrpkQuvfyPWnit8E9';

export default function GoogleReview() {
  const [copied, setCopied] = useState(false);

  const handleCopyAndRate = async () => {
    try {
      await navigator.clipboard.writeText(REVIEW_TEXT);
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea');
      el.value = REVIEW_TEXT;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 my-4 sm:my-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 shadow-lg p-4 sm:p-6">
        {/* Decorative background circles */}
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Google G logo + stars */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-2">
              {/* Google G SVG */}
              <svg viewBox="0 0 48 48" className="w-9 h-9 sm:w-10 sm:h-10" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.3 9 3.4l6.7-6.7C35.9 2.5 30.3 0 24 0 14.7 0 6.8 5.4 2.9 13.3l7.8 6.1C12.5 13.1 17.8 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"/>
                <path fill="#FBBC05" d="M10.7 28.6A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7.8-6.1A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.7l8.2-6.1z"/>
                <path fill="#34A853" d="M24 48c6.3 0 11.6-2.1 15.5-5.6l-7.5-5.8c-2.1 1.4-4.8 2.3-8 2.3-6.2 0-11.5-4.2-13.3-9.9l-8.2 6.1C6.8 42.6 14.7 48 24 48z"/>
              </svg>
            </div>
            {/* 5 Stars */}
            <div className="flex gap-0.5" aria-label="5 out of 5 stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} viewBox="0 0 20 20" className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow" fill="currentColor" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
          </div>

          {/* Text content */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h3 className="text-lg sm:text-xl font-extrabold text-white drop-shadow-sm mb-1">
              Liked our service? Rate us on Google! ⭐
            </h3>
            <p className="text-white/90 text-xs sm:text-sm mb-3 leading-relaxed">
              Click below to copy a ready-made review &amp; share your experience — it takes just 10 seconds!
            </p>

            {/* Pre-written review box */}
            <div className="bg-white/25 backdrop-blur-sm rounded-xl px-3 py-2 mb-3 text-white text-xs sm:text-sm italic border border-white/40 leading-relaxed">
              &ldquo;{REVIEW_TEXT}&rdquo;
            </div>

            {/* CTA Button */}
            <button
              onClick={handleCopyAndRate}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base shadow-md transition-all duration-200 ${
                copied
                  ? 'bg-green-600 text-white scale-95'
                  : 'bg-white text-amber-600 hover:bg-amber-50 hover:scale-105 active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Copied! Opening Google…
                </>
              ) : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                  </svg>
                  Copy Review &amp; Rate on Google ⭐
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

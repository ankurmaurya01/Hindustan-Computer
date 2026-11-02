'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloating() {
  const shopWhatsAppNumber = '919935908565';
  const defaultMessage = 'Hello Hindustan Computer! I am looking for computer parts / accessories. Can you help me?';

  const handleClick = () => {
    window.open(`https://wa.me/${shopWhatsAppNumber}?text=${encodeURIComponent(defaultMessage)}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      <div className="hidden sm:block mr-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold py-1.5 px-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
        Chat with Shopkeeper
      </div>
      <button
        onClick={handleClick}
        className="w-13 h-13 p-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center animate-bounce"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </button>
    </div>
  );
}

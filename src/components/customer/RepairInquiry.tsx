'use client';

import React, { useState } from 'react';
import {
  Wrench,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  Laptop,
  Monitor,
  Printer,
  Cpu,
  Layers,
  Sparkles,
  Send,
} from 'lucide-react';

const DEVICE_OPTIONS = [
  { id: 'laptop', label: 'Laptop (लैपटॉप)', icon: Laptop },
  { id: 'desktop', label: 'Desktop PC (कंप्यूटर)', icon: Monitor },
  { id: 'printer', label: 'Printer / Scanner (प्रिंटर)', icon: Printer },
  { id: 'monitor', label: 'Monitor Screen (मॉनिटर)', icon: Monitor },
  { id: 'motherboard', label: 'Motherboard / SMPS', icon: Layers },
  { id: 'other', label: 'Other Device (अन्य)', icon: Cpu },
];

const COMMON_PROBLEMS = [
  'No Display / Blank Screen (स्क्रीन नहीं आ रही)',
  'Not Turning On / Dead Power (चालू नहीं हो रहा)',
  'Very Slow / Hanging / Virus (सिस्टम स्लो चल रहा है)',
  'Windows Crash / Blue Screen / Won\'t Boot',
  'Broken Screen / Damaged Hinges (स्क्रीन/बॉडी टूटी है)',
  'Water Damage / Liquid Spill (पानी गिर गया)',
  'Printer Paper Jam / Ink Flow Problem',
  'SSD & RAM Upgrade (स्पीड बढ़ानी है)',
  'Keyboard Key / Touchpad Not Working',
  'Overheating / Fan Noise / Auto Restart',
];

export default function RepairInquiry() {
  const [selectedDevice, setSelectedDevice] = useState(DEVICE_OPTIONS[0].label);
  const [selectedProblem, setSelectedProblem] = useState(COMMON_PROBLEMS[0]);
  const [customDetails, setCustomDetails] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return;

    setLoading(true);

    try {
      // 1. Log inquiry in DB
      await fetch('/api/repair-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceType: selectedDevice,
          problem: selectedProblem,
          details: customDetails,
          customerName,
          phone,
        }),
      });
    } catch (err) {
      console.warn('Could not log repair inquiry to db', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }

    // 2. Open WhatsApp with pre-filled inquiry to shopkeeper
    const whatsappMsg = `*Computer / Laptop Repair Inquiry - Hindustan Computer*
*Device:* ${selectedDevice}
*Problem:* ${selectedProblem}
${customDetails ? `*Issue Details:* ${customDetails}\n` : ''}*Customer Name:* ${customerName}
*Phone:* ${phone}

Hello technician! Can this problem be repaired at your Dohrighat shop? Please let me know the approximate cost and time required.`;

    window.open(`https://wa.me/919935908565?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
  };

  return (
    <section id="repair-inquiry" className="max-w-7xl mx-auto px-3 sm:px-4">
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 border border-blue-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl text-white">
        <div className="max-w-3xl space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            Repair & Service Consultation
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
            Can It Be Repaired? Ask Our Shop Technician!
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Have a problem with your laptop, desktop PC, printer, or screen? Select your issue below to check if it can be repaired at our Dohrighat shop and get a fast cost estimate on WhatsApp!
          </p>
        </div>

        {submitted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center space-y-4 border border-white/20">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Inquiry Sent to Technician!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your inquiry has opened on WhatsApp. If WhatsApp didn't open automatically, message us directly at{' '}
              <strong className="text-white">+91 99359 08565</strong>. You can also visit our shop directly at Dohrighat Road, Near Bus Stand.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition"
            >
              Ask Another Repair Question
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Device Type */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-blue-200">
                1. Select Device Type:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {DEVICE_OPTIONS.map((dev) => {
                  const Icon = dev.icon;
                  const isSelected = selectedDevice === dev.label;
                  return (
                    <button
                      type="button"
                      key={dev.id}
                      onClick={() => setSelectedDevice(dev.label)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-2 transition text-center ${
                        isSelected
                          ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{dev.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Problem Pills */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-blue-200">
                2. Select Common Problem:
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_PROBLEMS.map((prob) => {
                  const isSelected = selectedProblem === prob;
                  return (
                    <button
                      type="button"
                      key={prob}
                      onClick={() => setSelectedProblem(prob)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                        isSelected
                          ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold shadow'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {prob}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Specific details + Customer info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="md:col-span-1 space-y-1">
                <label className="block text-xs font-bold text-slate-300">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-1 space-y-1">
                <label className="block text-xs font-bold text-slate-300">WhatsApp Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-1 space-y-1">
                <label className="block text-xs font-bold text-slate-300">Brand / Model / Extra Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Dell Inspiron 15 / HP 1020 / Acer"
                  value={customDetails}
                  onChange={(e) => setCustomDetails(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-emerald-500/25 transition"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Ask Technician on WhatsApp: Can It Be Repaired?</span>
              </button>

              <span className="text-xs text-slate-400 text-center sm:text-left">
                ⚡ Direct consultation with shopkeeper in Dohrighat &bull; Quick reply
              </span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

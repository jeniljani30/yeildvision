import React, { useState } from 'react';
import { X, MapPin, Mail, Phone, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('Advisory inquiry transmitted to Pune Research Hub', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#063F2F]/40 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-xl rounded-[28px] bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_25px_60px_rgba(6,63,47,0.18)] p-7 sm:p-9 text-left z-10 animate-fade-rise">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-[#063F2F] hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close contact modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Eyebrow & Title */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDF5EA] text-[#064E3B] text-[11px] font-semibold tracking-wider uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />
          <span>REACH US • ADVISORY DESK</span>
        </div>

        <h3 className="font-serif text-3xl sm:text-4xl text-[#063F2F] tracking-tight leading-tight">
          Connect with Agronomic Advisory
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-[#65756E] leading-relaxed font-sans">
          Direct liaison for sugar mill deployments, cane cooperative telemetry, and varietal research trials.
        </p>

        {/* Direct Contact Cards */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 text-[#063F2F] font-semibold mb-1">
              <MapPin className="w-4 h-4 text-[#064E3B]" />
              <span>Pune Research Center</span>
            </div>
            <p className="text-[#65756E] text-[11px] leading-relaxed">
              Agronomy Tech Park, Baner-Pashan Road, Pune, Maharashtra 411045, India
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 text-[#063F2F] font-semibold mb-1">
              <Phone className="w-4 h-4 text-[#064E3B]" />
              <span>Direct Helplines</span>
            </div>
            <p className="text-[#65756E] text-[11px] leading-relaxed">
              Advisory Desk: +91 (020) 2569-8200<br />
              Toll-Free: 1800-200-9435 (YIELD)
            </p>
          </div>
        </div>

        {/* Form or Submitted State */}
        {submitted ? (
          <div className="mt-6 py-6 p-4 rounded-2xl bg-[#EAF7F0] border border-[#064E3B]/20 text-center flex flex-col items-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2" />
            <h4 className="font-serif text-xl text-[#063F2F]">Inquiry Received</h4>
            <p className="text-xs text-[#65756E] mt-1 max-w-sm">
              Our sugarcane modeling specialist will respond to your inquiry within 24 hours.
            </p>
            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="mt-4 px-5 py-2 rounded-full bg-[#063F2F] text-white text-xs font-semibold"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#10231D] uppercase tracking-wider mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Kulkarni"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-[#10231D] focus:bg-white focus:border-[#064E3B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#10231D] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rajesh@cane-mill.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-[#10231D] focus:bg-white focus:border-[#064E3B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#10231D] uppercase tracking-wider mb-1">
                Inquiry / Farm Acreage
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Specify your sugarcane variety, soil region, or mill integration requirements..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-[#10231D] focus:bg-white focus:border-[#064E3B] focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-full bg-[#063F2F] hover:bg-[#064E3B] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-emerald-300" />
              <span>Send Advisory Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

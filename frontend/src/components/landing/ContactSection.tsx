import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building2, 
  Globe2, 
  MessageSquare,
  ShieldCheck,
  Headphones
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    state: 'Maharashtra',
    inquiryType: 'Enterprise Mill Integration',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <section id="contact" className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#FAFCF9] border-t border-[#073B2A]/10 overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#DDF5EA]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#073B2A]" />
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#073B2A]">
              CONTACT & ADVISORY
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl text-[#073B2A] tracking-tight leading-[1.05]">
            Connect with our agronomic{' '}
            <span className="text-[#6F6F6F] block mt-1">intelligence team.</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-[#4F5A54] font-sans leading-relaxed max-w-2xl">
            Whether you are a sugar mill director, commercial sugarcane grower, or agricultural researcher, 
            our team in Pune and Lucknow provides direct data consultation and custom model calibrations.
          </p>
        </div>

        {/* 2-Column Grid: Contact Information & Direct Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Official Contact Details & Hubs */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            {/* Main HQ Card */}
            <div className="p-7 sm:p-8 rounded-[24px] bg-white border border-slate-200/80 shadow-[0_10px_35px_rgba(7,59,42,0.06)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#DDF5EA]/30 rounded-bl-full pointer-events-none" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-[#073B2A] text-white flex items-center justify-center shadow-md">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[#073B2A] leading-tight">
                    YieldVision Research Center
                  </h3>
                  <p className="text-xs font-sans text-[#6F6F6F] uppercase tracking-wider">
                    Agronomic Intelligence Hub • India
                  </p>
                </div>
              </div>

              {/* Detailed Points */}
              <div className="space-y-4 text-sm font-sans">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#073B2A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#17201C] block">Headquarters & Laboratory</span>
                    <span className="text-[#4F5A54] text-xs leading-relaxed block mt-0.5">
                      Agronomy Technology Park, Baner-Pashan Road, Pune, Maharashtra 411045, India
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-[#073B2A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#17201C] block">Electronic Inquiries</span>
                    <div className="flex flex-col text-xs text-[#073B2A] gap-0.5 mt-0.5">
                      <a href="mailto:advisory@yieldvision.ai" className="hover:underline font-medium">
                        advisory@yieldvision.ai
                      </a>
                      <a href="mailto:research@yieldvision.ai" className="hover:underline font-medium">
                        research@yieldvision.ai
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-[#073B2A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#17201C] block">Helpline & Direct Desk</span>
                    <div className="text-xs text-[#4F5A54] mt-0.5 space-y-0.5">
                      <div>Desk: <span className="font-medium text-[#17201C]">+91 (020) 2569-8200</span></div>
                      <div>Toll-Free Helpline: <span className="font-medium text-[#073B2A]">1800-200-9435 (YIELD)</span></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-[#073B2A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#17201C] block">Advisory Consultation Hours</span>
                    <span className="text-[#4F5A54] text-xs block mt-0.5">
                      Monday to Saturday: 8:30 AM – 6:30 PM IST (UTC+5:30)
                    </span>
                  </div>
                </div>
              </div>

              {/* Research Partner Accreditation */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#6F6F6F]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>ICAR-Sugarcane Breeding Calibration</span>
                </div>
                <span className="font-mono text-[#073B2A] font-semibold">120+ Verified Trials</span>
              </div>
            </div>

            {/* Regional Research Field Offices */}
            <div className="p-6 rounded-[20px] bg-[#EAF7F0]/60 border border-[#073B2A]/15 text-left">
              <div className="text-xs uppercase tracking-wider font-semibold text-[#073B2A] mb-3 flex items-center gap-2">
                <Globe2 className="w-4 h-4" />
                <span>Regional Liaison Centers</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white/70 p-2.5 rounded-xl border border-white">
                  <div className="font-semibold text-[#17201C]">Lucknow Hub</div>
                  <div className="text-[#6F6F6F] text-[11px]">Sub-Tropical North Belt</div>
                  <div className="text-[#073B2A] text-[10px] font-medium mt-0.5">Uttar Pradesh</div>
                </div>
                <div className="bg-white/70 p-2.5 rounded-xl border border-white">
                  <div className="font-semibold text-[#17201C]">Belagavi Station</div>
                  <div className="text-[#6F6F6F] text-[11px]">Deccan Cane Belt</div>
                  <div className="text-[#073B2A] text-[10px] font-medium mt-0.5">Karnataka</div>
                </div>
                <div className="bg-white/70 p-2.5 rounded-xl border border-white">
                  <div className="font-semibold text-[#17201C]">Coimbatore Lab</div>
                  <div className="text-[#6F6F6F] text-[11px]">Varietal Research Hub</div>
                  <div className="text-[#073B2A] text-[10px] font-medium mt-0.5">Tamil Nadu</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Consultation & Inquiries Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-[28px] bg-white border border-slate-200/80 shadow-[0_15px_45px_rgba(7,59,42,0.07)] text-left relative">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
                <div>
                  <h3 className="font-serif text-3xl text-[#073B2A]">
                    Send an Inquiry
                  </h3>
                  <p className="text-xs text-[#6F6F6F] font-sans mt-0.5">
                    Our agricultural modeling specialists respond within 24 hours.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF5EA] text-[#073B2A] text-xs font-medium">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Direct Advisory</span>
                </div>
              </div>

              {submitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-rise">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-2xl text-[#073B2A]">
                    Inquiry Received Successfully
                  </h4>
                  <p className="text-sm text-[#4F5A54] max-w-md mt-2 leading-relaxed">
                    Thank you, <span className="font-semibold text-[#17201C]">{formState.name}</span>. An agronomist from our Pune research lab has been assigned to your request and will contact you at <span className="font-medium text-[#073B2A]">{formState.email}</span>.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({
                        name: '',
                        email: '',
                        phone: '',
                        organization: '',
                        state: 'Maharashtra',
                        inquiryType: 'Enterprise Mill Integration',
                        message: '',
                      });
                    }}
                    className="mt-6 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#073B2A] text-white hover:bg-[#0B4D38] transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#17201C] uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="e.g. Dr. Rajesh Kulkarni"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-[#17201C] focus:bg-white focus:border-[#073B2A] focus:outline-none focus:ring-1 focus:ring-[#073B2A] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#17201C] uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="rajesh@cane-enterprise.in"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-[#17201C] focus:bg-white focus:border-[#073B2A] focus:outline-none focus:ring-1 focus:ring-[#073B2A] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#17201C] uppercase tracking-wider mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="+91 98220 XXXXX"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-[#17201C] focus:bg-white focus:border-[#073B2A] focus:outline-none focus:ring-1 focus:ring-[#073B2A] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#17201C] uppercase tracking-wider mb-1.5">
                        Sugar Mill / Organization
                      </label>
                      <input
                        type="text"
                        value={formState.organization}
                        onChange={(e) => setFormState({ ...formState, organization: e.target.value })}
                        placeholder="e.g. Sahyadri Sugar Factory Ltd."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-[#17201C] focus:bg-white focus:border-[#073B2A] focus:outline-none focus:ring-1 focus:ring-[#073B2A] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#17201C] uppercase tracking-wider mb-1.5">
                        Sugarcane Region / State *
                      </label>
                      <select
                        value={formState.state}
                        onChange={(e) => setFormState({ ...formState, state: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-[#17201C] focus:bg-white focus:border-[#073B2A] focus:outline-none focus:ring-1 focus:ring-[#073B2A] transition-all"
                      >
                        <option value="Maharashtra">Maharashtra (Western & Marathwada)</option>
                        <option value="Uttar Pradesh">Uttar Pradesh (Central & Terai)</option>
                        <option value="Karnataka">Karnataka (Belagavi & Mandya)</option>
                        <option value="Tamil Nadu">Tamil Nadu (Cauvery Basin)</option>
                        <option value="Andhra Pradesh">Andhra Pradesh / Telangana</option>
                        <option value="Gujarat">Gujarat (South Gujarat Belt)</option>
                        <option value="Haryana">Haryana / Punjab</option>
                        <option value="Other">Other Agricultural Region</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#17201C] uppercase tracking-wider mb-1.5">
                        Inquiry Nature
                      </label>
                      <select
                        value={formState.inquiryType}
                        onChange={(e) => setFormState({ ...formState, inquiryType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-[#17201C] focus:bg-white focus:border-[#073B2A] focus:outline-none focus:ring-1 focus:ring-[#073B2A] transition-all"
                      >
                        <option value="Enterprise Mill Integration">Enterprise Mill Ingestion & API</option>
                        <option value="Precision Field Advisory">Farm Precision Yield Advisory</option>
                        <option value="Research & Trial Collaboration">Research & Varietal Trial Partnership</option>
                        <option value="General Question">General Platform Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17201C] uppercase tracking-wider mb-1.5">
                      Message & Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Please specify your cane acreage, current harvest challenges, or data requirements..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-[#17201C] focus:bg-white focus:border-[#073B2A] focus:outline-none focus:ring-1 focus:ring-[#073B2A] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-4 px-8 rounded-full bg-[#073B2A] text-white font-sans text-sm font-semibold hover:bg-[#0B4D38] transition-all shadow-[0_10px_25px_rgba(7,59,42,0.2)] hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span>Transmitting Inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-emerald-300" />
                        <span>Submit Advisory Request</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { X, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { YieldVisionLogo } from '../ui/YieldVisionLogo';

export const LoginModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    setIsLoginModalOpen, 
    login, 
    signUp,
    supabaseStatus,
    loginRedirectPage, 
    setCurrentPage, 
    addToast 
  } = useApp();

  // Mode: 'signin' (Image 3) or 'signup' (Image 2)
  const [viewMode, setViewMode] = useState<'signin' | 'signup'>('signin');
  // For 'signin', whether email form is expanded
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Sign up form fields (Image 2)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  // 1. Google One-Tap / Instant Sign In
  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await login('karina.kesur@yieldvision.ai', undefined, 'Karina Kesur');
      setIsLoginModalOpen(false);
      addToast('Signed in with Google as Karina Kesur', 'success');
      setCurrentPage(loginRedirectPage || 'dashboard');
    } catch (e) {
      addToast('Google authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 2. SSO Authentication
  const handleSSOAuth = async () => {
    setLoading(true);
    try {
      await login('karina.kesur@yieldvision.ai', undefined, 'Karina Kesur');
      setIsLoginModalOpen(false);
      addToast('Enterprise SSO verified: Karina Kesur (Lead Agronomist)', 'success');
      setCurrentPage(loginRedirectPage || 'dashboard');
    } catch (e) {
      addToast('SSO authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 3. Email Sign In Form Submit
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const activeName = email.toLowerCase().includes('karina') ? 'Karina Kesur' : undefined;
      await login(email || 'karina.kesur@yieldvision.ai', password, activeName);
      setIsLoginModalOpen(false);
      addToast(`Authenticated as ${activeName || 'Karina Kesur'}`, 'success');
      setCurrentPage(loginRedirectPage || 'dashboard');
    } catch (e) {
      addToast('Sign in failed. Check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 4. Sign Up Form Submit (Image 2)
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      addToast('Please agree to the Terms of Use and Privacy Policy', 'warning');
      return;
    }
    setLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim() || 'Karina Kesur';
      const res = await signUp(email || 'karina.kesur@yieldvision.ai', password, fullName);
      if (res.success) {
        setIsLoginModalOpen(false);
        addToast(res.message, 'success');
        setCurrentPage(loginRedirectPage || 'dashboard');
      } else {
        addToast(res.message, 'error');
      }
    } catch (e: any) {
      addToast(e?.message || 'Failed to create account', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dimmed Backdrop */}
      <div 
        onClick={() => setIsLoginModalOpen(false)}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* Clean Modal Card */}
      <div className="relative w-full max-w-[420px] rounded-2xl bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-6 sm:p-8 text-left z-10 animate-fade-rise">
        {/* Close Button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center mb-5">
          <YieldVisionLogo size="md" />
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-medium text-emerald-800">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>Supabase Cloud Auth Active</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: SIGN IN VIEW (IMAGE 3)                           */}
        {/* ======================================================== */}
        {viewMode === 'signin' && (
          <div>
            {!showEmailForm ? (
              /* Image 3 layout: 3 stacked option buttons */
              <div className="space-y-3">
                {/* 1. Sign in with Google */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-800 text-base font-semibold transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-sm cursor-pointer"
                >
                  {/* Authentic 4-color Google G icon */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                {/* 2. Sign in with email */}
                <button
                  type="button"
                  onClick={() => setShowEmailForm(true)}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-800 text-base font-semibold transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-sm cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-slate-900" />
                  <span>Sign in with email</span>
                </button>

                {/* 3. Single Sign On (SSO) */}
                <button
                  type="button"
                  onClick={handleSSOAuth}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-800 text-base font-semibold transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-sm cursor-pointer"
                >
                  {/* Cloud with lock icon */}
                  <svg className="w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
                    <rect x="10" y="14" width="4" height="4" rx="1" stroke="currentColor" strokeWidth={1.5} />
                  </svg>
                  <span>Single Sign On (SSO)</span>
                </button>

                {/* Bottom link: Don't have an account? Sign up */}
                <div className="pt-6 text-center text-sm sm:text-base text-slate-600">
                  <span>Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('signup');
                      setShowEmailForm(false);
                    }}
                    className="font-semibold text-slate-900 hover:text-[#064E3B] transition-colors cursor-pointer"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            ) : (
              /* Email Sign In Form View */
              <form onSubmit={handleEmailSignIn} className="space-y-3.5">
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] transition-all font-sans"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] transition-all font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#063F2F] text-white text-base font-semibold transition-all shadow-[0_4px_16px_rgba(6,78,59,0.20)] hover:shadow-lg cursor-pointer disabled:opacity-70 mt-2"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                {/* 1-Click Agronomist Demo Shortcut */}
                <button
                  type="button"
                  onClick={() => {
                    setEmail('karina.kesur@yieldvision.ai');
                    setPassword('••••••••••••');
                    login('karina.kesur@yieldvision.ai', undefined, 'Karina Kesur').then(() => {
                      setIsLoginModalOpen(false);
                      addToast('Signed in as Karina Kesur (Lead Agronomist)', 'success');
                      setCurrentPage(loginRedirectPage || 'dashboard');
                    });
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#DDF5EA]/60 hover:bg-[#DDF5EA] text-[#064E3B] text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>1-Click Demo: Karina Kesur</span>
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to all options</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('signup');
                      setShowEmailForm(false);
                    }}
                    className="text-xs font-semibold text-[#064E3B] hover:underline cursor-pointer"
                  >
                    Create account
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: SIGN UP VIEW (IMAGE 2)                           */}
        {/* ======================================================== */}
        {viewMode === 'signup' && (
          <div>
            {/* Top Button: Sign up with Google */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-sm font-medium transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-sm cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>

            {/* Divider: or */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-xs text-slate-400 font-sans">or</span>
              <div className="border-t border-slate-200 w-full" />
            </div>

            {/* Form Inputs (Image 2) */}
            <form onSubmit={handleSignUpSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] transition-all font-sans"
                />
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] transition-all font-sans"
                />
              </div>

              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] transition-all font-sans"
                />
              </div>

              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] transition-all font-sans"
                />
              </div>

              {/* Checkbox: Terms of Use & Privacy Policy (Image 2) */}
              <div className="flex items-start gap-2.5 pt-1.5 text-xs text-slate-600">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#064E3B] focus:ring-[#064E3B] cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="leading-snug select-none cursor-pointer">
                  I agree to YieldVision's{' '}
                  <a
                    href="#terms"
                    onClick={(e) => e.preventDefault()}
                    className="underline text-slate-900 font-medium hover:text-[#064E3B]"
                  >
                    Terms of Use Agreement
                  </a>{' '}
                  and{' '}
                  <a
                    href="#privacy"
                    onClick={(e) => e.preventDefault()}
                    className="underline text-slate-900 font-medium hover:text-[#064E3B]"
                  >
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#063F2F] text-white text-sm font-medium transition-all shadow-[0_4px_16px_rgba(6,78,59,0.20)] hover:shadow-lg cursor-pointer disabled:opacity-70"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            {/* Switch to Sign In */}
            <div className="pt-4 text-center text-sm text-slate-600">
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={() => {
                  setViewMode('signin');
                  setShowEmailForm(false);
                }}
                className="font-semibold text-slate-900 hover:text-[#064E3B] transition-colors cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { AboutModal } from '../components/landing/AboutModal';
import { ContactModal } from '../components/landing/ContactModal';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { 
    setCurrentPage, 
    isAuthenticated, 
    setIsLoginModalOpen, 
    setLoginRedirectPage,
    addToast 
  } = useApp();

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleLaunchPredict = () => {
    if (isAuthenticated) {
      setCurrentPage('predict');
    } else {
      setLoginRedirectPage('predict');
      setIsLoginModalOpen(true);
      addToast('Administrator login required to access Yield Predictor', 'warning');
    }
  };

  const handleLaunchClimate = () => {
    if (isAuthenticated) {
      setCurrentPage('climate');
    } else {
      setLoginRedirectPage('climate');
      setIsLoginModalOpen(true);
      addToast('Administrator login required to access Climate Intelligence', 'warning');
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#F8FAF7] text-[#10231D] font-sans overflow-hidden">
      {/* 1. Minimal Header & Understated Navigation */}
      <LandingNavbar
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onExploreIntelligence={handleLaunchClimate}
        onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* 2. Fullscreen Editorial Hero Section */}
      <HeroSection
        onPredictClick={handleLaunchPredict}
        onExploreClick={handleLaunchClimate}
      />

      {/* 3. Deep Agronomic Information Modals (Keeps Landing Page Focused & Uncluttered) */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
};

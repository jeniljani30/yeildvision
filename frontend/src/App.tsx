import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { HelpInfoModal } from './components/layout/HelpInfoModal';
import { ToastContainer } from './components/ui/ToastContainer';
import { LoginModal } from './components/auth/LoginModal';
import { LayoutGrid } from 'lucide-react';

// Pages
import { LandingPage } from './pages/LandingPage';
import { OverviewDashboard } from './pages/OverviewDashboard';
import { YieldPrediction } from './pages/YieldPrediction';
import { WhatIfSimulator } from './pages/WhatIfSimulator';
import { ModelPerformance } from './pages/ModelPerformance';
import { ClimateIntelligence } from './pages/ClimateIntelligence';
import { PredictionHistory } from './pages/PredictionHistory';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';

export const AppContent: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    isAuthenticated, 
    setIsLoginModalOpen, 
    setLoginRedirectPage 
  } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Global Route Guard: If user is not authenticated, prevent access to dashboard, prediction, climate, etc.
  useEffect(() => {
    const protectedPages = ['dashboard', 'predict', 'climate', 'simulator', 'models', 'history', 'analytics', 'settings', 'profile'];
    if (!isAuthenticated && protectedPages.includes(currentPage)) {
      const targetPage = currentPage;
      setCurrentPage('landing');
      setLoginRedirectPage(targetPage);
      setIsLoginModalOpen(true);
    }
  }, [isAuthenticated, currentPage, setCurrentPage, setLoginRedirectPage, setIsLoginModalOpen]);

  const handleWorkbenchClick = () => {
    if (isAuthenticated) {
      setCurrentPage('dashboard');
    } else {
      setLoginRedirectPage('dashboard');
      setIsLoginModalOpen(true);
    }
  };

  // If on Landing Page, render landing page experience
  if (currentPage === 'landing') {
    return (
      <div className="relative min-h-screen bg-[#FAFCF9] text-[#17201C] font-sans antialiased">
        <LandingPage />

        {/* Global floating workbench shortcut matching Image 1 */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={handleWorkbenchClick}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/85 hover:bg-white backdrop-blur-xl border border-white/80 text-xs sm:text-sm font-sans font-semibold text-[#064E3B] shadow-[0_10px_30px_rgba(6,78,59,0.15)] hover:shadow-xl transition-all duration-300 cursor-pointer"
            title="Open Deep Agronomic Workbench"
          >
            <LayoutGrid className="w-4 h-4 text-[#064E3B]" />
            <span className="hidden sm:inline">Agronomic Workbench</span>
          </button>
        </div>

        <GlobalSearchModal />
        <HelpInfoModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        <LoginModal />
        <ToastContainer />
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <OverviewDashboard />;
      case 'predict':
        return <YieldPrediction />;
      case 'simulator':
        return <WhatIfSimulator />;
      case 'models':
        return <ModelPerformance />;
      case 'climate':
        return <ClimateIntelligence />;
      case 'history':
        return <PredictionHistory />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCF9] dark:bg-[#091711] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area (offset by sidebar on desktop) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Top Header */}
        <Header
          onMenuToggle={() => setIsMobileSidebarOpen((prev) => !prev)}
          onOpenHelp={() => setIsHelpOpen(true)}
        />


        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentPage()}
        </main>

        {/* Footer */}
        <footer className="py-6 px-4 sm:px-8 border-t border-emerald-500/10 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-medium">
              YieldVision — Agricultural Intelligence & ML Crop Yield Prediction
            </p>
            <p className="text-[11px] text-slate-400">
              Lead Agronomist & ML Research: Karina Kesur
            </p>
          </div>
        </footer>
      </div>

      {/* Global Modals & Notifications */}
      <GlobalSearchModal />
      <HelpInfoModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <LoginModal />
      <ToastContainer />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Layers, 
  Send, 
  Video, 
  ArrowLeft, 
  ExternalLink, 
  Sliders, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  Sparkles, 
  MapPin, 
  RefreshCw, 
  Sun, 
  Moon,
  ShieldCheck,
  Check
} from 'lucide-react';
import { LAGOS_TARGETS_50, SECTORS, getCompanyBySlug, findCompanyBySlug } from './data/lagosTargets50';
import { useTheme } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import OutreachCommandCenter from './components/OutreachCommandCenter';
import FreightEstimatorEngine from './components/solutions/FreightEstimatorEngine';
import BespokeJoineryConfigurator from './components/solutions/BespokeJoineryConfigurator';
import PackagingVolumeEngine from './components/solutions/PackagingVolumeEngine';
import HeavyEquipmentRFQPortal from './components/solutions/HeavyEquipmentRFQPortal';
import ErrorBoundary from './components/ErrorBoundary';
import CompanyNotFound from './components/CompanyNotFound';

export default function App() {
  const { isDark } = useTheme();

  // Navigation View: 'command' | 'demo'
  const [currentView, setCurrentView] = useState('command');
  
  // Selected Company (defaults to #1 Cargo Naija)
  const [selectedCompany, setSelectedCompany] = useState(LAGOS_TARGETS_50[0]);

  // Missing or misspelled slug state for Error Boundary / Fallback
  const [notFoundSlug, setNotFoundSlug] = useState(null);

  // Clean / Loom Mode (hides agency chrome for recording 90-second screen share)
  const [loomCleanMode, setLoomCleanMode] = useState(false);

  // Initialize and synchronize with window.location hash (Hash Routing)
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash || '';
      const path = window.location.pathname || '';
      const [hashRoute] = hash.split('?');

      // Primary client-side hash routing: #/demo/[slug]
      if (hashRoute.startsWith('#/demo/')) {
        const slug = hashRoute.replace('#/demo/', '').replace(/\/$/, '');
        const found = findCompanyBySlug(slug);
        if (found) {
          setSelectedCompany(found);
          setNotFoundSlug(null);
          setCurrentView('demo');
        } else {
          setSelectedCompany(null);
          setNotFoundSlug(slug);
          setCurrentView('demo');
        }
      } else if (hashRoute.startsWith('#/outreach/')) {
        const slug = hashRoute.replace('#/outreach/', '').replace(/\/$/, '');
        const found = findCompanyBySlug(slug);
        if (found) {
          setSelectedCompany(found);
          setNotFoundSlug(null);
          setCurrentView('command');
        } else {
          setSelectedCompany(LAGOS_TARGETS_50[0]);
          setNotFoundSlug(null);
          setCurrentView('command');
        }
      } else if (path.startsWith('/demo/')) {
        // Fallback for direct browser path entry: migrate cleanly to hash routing
        const [pathRoute] = path.split('?');
        const slug = pathRoute.replace('/demo/', '').replace(/\/$/, '');
        const found = findCompanyBySlug(slug);
        if (found) {
          setSelectedCompany(found);
          setNotFoundSlug(null);
          setCurrentView('demo');
          window.history.replaceState(null, '', `/#/demo/${slug}`);
        } else {
          setSelectedCompany(null);
          setNotFoundSlug(slug);
          setCurrentView('demo');
        }
      } else if (hash === '' || hash === '#' || hash === '#/') {
        setNotFoundSlug(null);
        setCurrentView('command');
      }
    };

    handleUrlChange();
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Switch to demo view for a specific company using Hash Routing
  const handleSelectDemoCompany = (company) => {
    if (!company) return;
    setSelectedCompany(company);
    setNotFoundSlug(null);
    setCurrentView('demo');
    window.location.hash = `#/demo/${company.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch back to command center using Hash Routing
  const handleBackToCommandCenter = () => {
    setNotFoundSlug(null);
    setCurrentView('command');
    window.location.hash = '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render the appropriate polymorphic engine
  const renderSolutionEngine = () => {
    if (!selectedCompany) return null;
    switch (selectedCompany.sector) {
      case 'freight':
        return <FreightEstimatorEngine company={selectedCompany} />;
      case 'furniture':
        return <BespokeJoineryConfigurator company={selectedCompany} />;
      case 'packaging':
        return <PackagingVolumeEngine company={selectedCompany} />;
      case 'equipment':
        return <HeavyEquipmentRFQPortal company={selectedCompany} />;
      default:
        return <FreightEstimatorEngine company={selectedCompany} />;
    }
  };

  const currentSector = selectedCompany ? SECTORS[selectedCompany.sector] : null;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 dark:bg-[#090C12] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-amber-500/30 selection:text-amber-700 dark:selection:text-amber-200">
        
        {/* Agency Navigation Bar (Hidden when in Loom Clean Mode) */}
        {!loomCleanMode && (
          <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0E131F]/95 backdrop-blur-md border-b-2 border-black dark:border-zinc-800 px-4 lg:px-8 py-3 transition-colors duration-200">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              
              {/* Left: Branding & View Switcher */}
              <div className="flex items-center gap-4 font-mono">
                <div 
                  onClick={handleBackToCommandCenter}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div className="w-9 h-9 bg-black text-amber-400 dark:bg-amber-500 dark:text-black font-black text-sm flex items-center justify-center border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                    LAG
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black block">
                      Automation Factory
                    </span>
                    <span className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      Lagos B2B Lead Engine
                    </span>
                  </div>
                </div>

                {/* View Switcher Pills */}
                <div className="hidden sm:flex items-center border-2 border-black dark:border-zinc-700 text-xs font-bold">
                  <button
                    type="button"
                    onClick={handleBackToCommandCenter}
                    className={`min-h-[38px] px-3.5 py-1.5 transition-all cursor-pointer ${
                      currentView === 'command'
                        ? 'bg-black text-amber-400 dark:bg-white dark:text-black font-black'
                        : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-100'
                    }`}
                  >
                    Agency Pipeline (50)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedCompany) {
                        handleSelectDemoCompany(selectedCompany);
                      }
                    }}
                    className={`min-h-[38px] px-3.5 py-1.5 border-l-2 border-black dark:border-zinc-700 transition-all cursor-pointer ${
                      currentView === 'demo'
                        ? 'bg-black text-amber-400 dark:bg-white dark:text-black font-black'
                        : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-100'
                    }`}
                  >
                    Live Client Demo
                  </button>
                </div>
              </div>

              {/* Right: Quick 50-Company Switcher, Theme Toggle & Loom Clean Mode Toggle */}
              <div className="flex items-center gap-2.5 font-mono">
                
                {/* Theme Toggle Button */}
                <ThemeToggle />

                {/* Company Picker Dropdown */}
                <div className="relative hidden md:flex items-center">
                  <select
                    value={selectedCompany ? selectedCompany.slug : ''}
                    onChange={(e) => {
                      const comp = findCompanyBySlug(e.target.value);
                      if (comp) {
                        handleSelectDemoCompany(comp);
                      }
                    }}
                    className="min-h-[44px] bg-white dark:bg-black border-2 border-black dark:border-zinc-700 text-slate-900 dark:text-white text-xs font-mono font-bold px-3 py-1.5 pr-8 focus:outline-none cursor-pointer max-w-[210px] truncate"
                  >
                    <optgroup label="Sector A: Freight & Clearing (15)">
                      {LAGOS_TARGETS_50.filter(c => c.sector === 'freight').map(c => (
                        <option key={c.slug} value={c.slug}>#{c.id} {c.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Sector B: Furniture & Fit-Out (12)">
                      {LAGOS_TARGETS_50.filter(c => c.sector === 'furniture').map(c => (
                        <option key={c.slug} value={c.slug}>#{c.id} {c.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Sector C: Print & Packaging (12)">
                      {LAGOS_TARGETS_50.filter(c => c.sector === 'packaging').map(c => (
                        <option key={c.slug} value={c.slug}>#{c.id} {c.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Sector D: Heavy Equipment (11)">
                      {LAGOS_TARGETS_50.filter(c => c.sector === 'equipment').map(c => (
                        <option key={c.slug} value={c.slug}>#{c.id} {c.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Loom Clean Mode Toggle Button */}
                {currentView === 'demo' && selectedCompany && (
                  <button
                    type="button"
                    onClick={() => setLoomCleanMode(true)}
                    className="min-h-[44px] bg-rose-600 hover:bg-rose-500 text-white border-2 border-black dark:border-white px-3.5 py-1.5 text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                    title="Hide agency chrome to record clean 90-second Loom"
                  >
                    <Video className="w-4 h-4 animate-pulse" />
                    <span className="hidden sm:inline">Loom Mode</span>
                  </button>
                )}

              </div>

            </div>
          </header>
        )}

        {/* Main Content Area */}
        <main className={`flex-1 p-4 lg:p-8 ${currentView === 'demo' && selectedCompany && !loomCleanMode ? 'pb-32' : ''}`}>
          {currentView === 'command' ? (
            <OutreachCommandCenter 
              onSelectDemoCompany={handleSelectDemoCompany}
              selectedCompanyId={selectedCompany?.id}
            />
          ) : notFoundSlug ? (
            <CompanyNotFound 
              attemptedSlug={notFoundSlug}
              onSelectCompany={handleSelectDemoCompany}
              onBackHome={handleBackToCommandCenter}
            />
          ) : selectedCompany ? (
            <div className="space-y-6">
              
              {/* Demo Header Bar (Only visible if NOT in Loom Clean Mode) */}
              {!loomCleanMode && (
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-black dark:border-zinc-800 gap-4 font-mono">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleBackToCommandCenter}
                      className="min-h-[44px] min-w-[44px] bg-white dark:bg-black border-2 border-black dark:border-zinc-700 text-slate-900 dark:text-white flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer"
                      title="Return to Agency Master Pipeline"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">
                          Client Solution Engine
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 border font-bold uppercase ${currentSector?.badgeColor}`}>
                          {selectedCompany.sectorLabel}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-black uppercase text-slate-900 dark:text-white mt-0.5">
                        {selectedCompany.name} // Live Demo Portal
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                      URL: <strong className="text-slate-900 dark:text-white">/#/demo/{selectedCompany.slug}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setLoomCleanMode(true)}
                      className="min-h-[44px] bg-white dark:bg-black hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-900 dark:text-white px-3.5 py-1.5 border-2 border-black dark:border-zinc-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <EyeOff className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Enter Clean Mode</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Client-Facing Engine Container */}
              <div className="w-full">
                {renderSolutionEngine()}
              </div>

            </div>
          ) : null}
        </main>

        {/* The Client Closing CTA Layer (Sticky Footer in Demo View) */}
        {currentView === 'demo' && selectedCompany && !loomCleanMode && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-black text-white border-t-2 border-amber-500 p-3.5 sm:p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.8)] font-mono">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-center md:text-left">
                <div className="hidden sm:flex w-10 h-10 bg-amber-500 text-black font-black text-xs items-center justify-center border-2 border-white shrink-0">
                  7D
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black uppercase tracking-tight text-white">
                    Want this automated intake engine for <span className="text-amber-400 font-mono underline decoration-amber-500 decoration-2">{selectedCompany.name}</span>? | Turnaround: 7 Days
                  </p>
                  <p className="text-[11px] sm:text-xs text-zinc-400 font-sans">
                    Turnkey WhatsApp API dispatch • Real-time Lagos rate formulas • Zero generic spreadsheets
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <a
                  href={`https://wa.me/2348033045612?text=${encodeURIComponent(
                    `Hello Lagos B2B Automation Factory! I am reviewing the live custom demo for *${selectedCompany.name}* (${currentSector?.name || selectedCompany.sector} intake engine) and want to deploy this system for our commercial desk within the 7-day turnaround window.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto min-h-[44px] bg-amber-500 hover:bg-amber-400 text-black font-black px-6 py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-black dark:border-white transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-y-0.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Deploy This System</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Floating Restore & Controls Bar when in Loom Clean Mode */}
        {loomCleanMode && (
          <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 font-mono">
            <ThemeToggle className="shadow-2xl" />
            <button
              type="button"
              onClick={() => setLoomCleanMode(false)}
              className="min-h-[44px] bg-black text-white hover:bg-zinc-800 border-2 border-white px-4 py-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider shadow-2xl transition-all cursor-pointer"
              title="Exit Clean Mode and restore Agency Navigation Bar"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Restore Agency Bar</span>
            </button>
          </div>
        )}

        {/* Footer */}
        {!loomCleanMode && (
          <footer className="border-t-2 border-black dark:border-zinc-800 py-6 px-4 text-center text-xs text-slate-500 dark:text-zinc-400 font-mono transition-colors duration-200 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <span>
                Lagos B2B Lead Funnel & Personalized Outreach Automation Factory • 50 Targets Active
              </span>
              <span className="text-slate-600 dark:text-zinc-400">
                Run <code className="bg-slate-100 dark:bg-zinc-900 px-1.5 py-0.5 text-amber-600 dark:text-amber-400 border border-black dark:border-zinc-700 font-bold">npm run generate:outreach</code> to export all 50 target playbooks
              </span>
            </div>
          </footer>
        )}

      </div>
    </ErrorBoundary>
  );
}

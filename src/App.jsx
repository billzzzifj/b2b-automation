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
  Moon
} from 'lucide-react';
import { LAGOS_TARGETS_50, SECTORS, getCompanyBySlug } from './data/lagosTargets50';
import { useTheme } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import OutreachCommandCenter from './components/OutreachCommandCenter';
import FreightEstimatorEngine from './components/solutions/FreightEstimatorEngine';
import BespokeJoineryConfigurator from './components/solutions/BespokeJoineryConfigurator';
import PackagingVolumeEngine from './components/solutions/PackagingVolumeEngine';
import HeavyEquipmentRFQPortal from './components/solutions/HeavyEquipmentRFQPortal';

export default function App() {
  const { isDark } = useTheme();

  // Navigation View: 'command' | 'demo'
  const [currentView, setCurrentView] = useState('command');
  
  // Selected Company (defaults to #1 Cargo Naija)
  const [selectedCompany, setSelectedCompany] = useState(LAGOS_TARGETS_50[0]);

  // Clean / Loom Mode (hides agency chrome for recording 90-second screen share)
  const [loomCleanMode, setLoomCleanMode] = useState(false);

  // Initialize and synchronize with window.location pathname / hash
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path.startsWith('/demo/')) {
        const slug = path.replace('/demo/', '').replace(/\/$/, '');
        const found = getCompanyBySlug(slug);
        setSelectedCompany(found);
        setCurrentView('demo');
      } else if (hash.startsWith('#/demo/')) {
        const slug = hash.replace('#/demo/', '');
        const found = getCompanyBySlug(slug);
        setSelectedCompany(found);
        setCurrentView('demo');
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Switch to demo view for a specific company
  const handleSelectDemoCompany = (company) => {
    setSelectedCompany(company);
    setCurrentView('demo');
    window.history.pushState(null, '', `/demo/${company.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch back to command center
  const handleBackToCommandCenter = () => {
    setCurrentView('command');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render the appropriate polymorphic engine
  const renderSolutionEngine = () => {
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

  const currentSector = SECTORS[selectedCompany.sector];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090C12] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-amber-500/30 selection:text-amber-700 dark:selection:text-amber-200">
      
      {/* Agency Navigation Bar (Hidden when in Loom Clean Mode) */}
      {!loomCleanMode && (
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 lg:px-8 py-3 transition-colors duration-200 shadow-sm dark:shadow-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Left: Branding & View Switcher */}
            <div className="flex items-center gap-4">
              <div 
                onClick={handleBackToCommandCenter}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-amber-500/20">
                  LAG
                </div>
                <div>
                  <span className="text-xs font-mono tracking-widest text-amber-600 dark:text-amber-400 uppercase font-bold block">
                    Automation Factory
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    Lagos B2B Funnel Engine
                  </span>
                </div>
              </div>

              {/* View Switcher Pills */}
              <div className="hidden sm:flex items-center p-0.5 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <button
                  onClick={handleBackToCommandCenter}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    currentView === 'command'
                      ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Agency Pipeline (50)
                </button>
                <button
                  onClick={() => {
                    setCurrentView('demo');
                    window.history.pushState(null, '', `/demo/${selectedCompany.slug}`);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    currentView === 'demo'
                      ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Live Client Demo
                </button>
              </div>
            </div>

            {/* Right: Quick 50-Company Switcher, Theme Toggle & Loom Clean Mode Toggle */}
            <div className="flex items-center gap-2.5">
              
              {/* Theme Toggle Button */}
              <ThemeToggle />

              {/* Company Picker Dropdown */}
              <div className="relative flex items-center">
                <select
                  value={selectedCompany.slug}
                  onChange={(e) => {
                    const comp = getCompanyBySlug(e.target.value);
                    setSelectedCompany(comp);
                    if (currentView === 'demo') {
                      window.history.pushState(null, '', `/demo/${comp.slug}`);
                    }
                  }}
                  className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono rounded-xl px-3 py-1.5 pr-8 focus:outline-none focus:border-amber-500 cursor-pointer max-w-[210px] truncate shadow-sm dark:shadow-none"
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
              {currentView === 'demo' && (
                <button
                  type="button"
                  onClick={() => setLoomCleanMode(true)}
                  className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/70 dark:hover:bg-rose-900 border border-rose-300 dark:border-rose-500/50 text-rose-700 dark:text-rose-300 px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  title="Hide agency chrome to record clean 90-second Loom"
                >
                  <Video className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 animate-pulse" />
                  <span className="hidden sm:inline">Loom / Clean Mode</span>
                </button>
              )}

            </div>

          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-8">
        {currentView === 'command' ? (
          <OutreachCommandCenter 
            onSelectDemoCompany={handleSelectDemoCompany}
            selectedCompanyId={selectedCompany.id}
          />
        ) : (
          <div className="space-y-6">
            
            {/* Demo Header Bar (Only visible if NOT in Loom Clean Mode) */}
            {!loomCleanMode && (
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToCommandCenter}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm dark:shadow-none"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
                        Client-Facing Solution Engine
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${currentSector?.badgeColor}`}>
                        {selectedCompany.sectorLabel}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                      {selectedCompany.name} // Live Demo Portal
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                    URL: <strong className="text-slate-800 dark:text-slate-200">/demo/{selectedCompany.slug}</strong>
                  </span>
                  <button
                    onClick={() => setLoomCleanMode(true)}
                    className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-mono flex items-center gap-1.5 shadow-sm dark:shadow-none"
                  >
                    <EyeOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
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
        )}
      </main>

      {/* Floating Restore & Controls Bar when in Loom Clean Mode */}
      {loomCleanMode && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
          <ThemeToggle className="shadow-2xl opacity-60 hover:opacity-100" />
          <button
            onClick={() => setLoomCleanMode(false)}
            className="bg-white/95 dark:bg-slate-950/90 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-mono transition-all backdrop-blur-md opacity-50 hover:opacity-100"
            title="Exit Clean Mode and restore Agency Navigation Bar"
          >
            <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Restore Agency Bar</span>
          </button>
        </div>
      )}

      {/* Footer */}
      {!loomCleanMode && (
        <footer className="border-t border-slate-200 dark:border-slate-800/60 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 font-mono transition-colors duration-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>
              Lagos B2B Lead Funnel & Personalized Outreach Automation Factory • 50 Targets Active
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              Run <code className="bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-slate-800">npm run generate:outreach</code> to export all 50 target playbooks
            </span>
          </div>
        </footer>
      )}

    </div>
  );
}

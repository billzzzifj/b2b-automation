import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  Send, 
  Copy, 
  Check, 
  Video, 
  Mail, 
  MessageSquare, 
  Briefcase, 
  FileText, 
  ChevronRight, 
  X, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  PhoneCall, 
  CheckCircle2, 
  Layers, 
  ArrowUpRight,
  RefreshCw,
  Building2,
  DollarSign,
  MapPin
} from 'lucide-react';
import { LAGOS_TARGETS_50, SECTORS } from '../data/lagosTargets50';
import { generateOutreachPack, getDemoUrl } from '../data/outreachDispatcher';

export default function OutreachCommandCenter({ onSelectDemoCompany, selectedCompanyId }) {
  // CRM State persisted in localStorage
  const [pipeline, setPipeline] = useState(() => {
    const saved = localStorage.getItem('lagos_b2b_pipeline_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading CRM state:', e);
      }
    }
    return LAGOS_TARGETS_50;
  });

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Drawer / Personalization state
  const [activeDrawerCompany, setActiveDrawerCompany] = useState(null);
  const [activeScriptTab, setActiveScriptTab] = useState('whatsapp');
  const [copyFeedback, setCopyFeedback] = useState('');

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('lagos_b2b_pipeline_v1', JSON.stringify(pipeline));
  }, [pipeline]);

  // Update status or notes for a target
  const updateCompany = (id, updates) => {
    setPipeline(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    if (activeDrawerCompany && activeDrawerCompany.id === id) {
      setActiveDrawerCompany(prev => ({ ...prev, ...updates }));
    }
  };

  // Reset pipeline to defaults
  const resetPipeline = () => {
    if (window.confirm('Reset all 50 Lagos companies to initial uncontacted state?')) {
      setPipeline(LAGOS_TARGETS_50);
      localStorage.removeItem('lagos_b2b_pipeline_v1');
    }
  };

  // Filtered targets
  const filteredCompanies = pipeline.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.diagnosedLeak.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'all' || c.sector === sectorFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesSector && matchesStatus;
  });

  // Aggregated Pipeline Metrics
  const totalLeads = pipeline.length;
  const auditReadyCount = pipeline.filter(c => c.status === 'Audit Ready').length;
  const demoSentCount = pipeline.filter(c => c.status === 'Demo Sent').length;
  const bookedCount = pipeline.filter(c => c.status === 'Booked').length;
  const closedCount = pipeline.filter(c => c.status === 'Closed').length;
  const totalHoursLost = pipeline.reduce((acc, c) => acc + (c.estimatedMonthlyHoursLost || 0), 0);
  const estimatedPipelineValueNgn = (demoSentCount * 1250000) + (bookedCount * 2500000) + (closedCount * 3750000);

  // Dynamic Script Generators (delegated to outreachDispatcher for bulletproof hash routing)
  const generateScripts = (c) => {
    return generateOutreachPack(c);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(''), 2200);
  };

  // Export full pipeline to CSV
  const exportToCSV = () => {
    const headers = [
      'ID',
      'Company Name',
      'Sector',
      'Location',
      'Status',
      'Target Persona',
      'Diagnosed Leak',
      'Hours Lost Monthly',
      'Phone',
      'Email',
      'Demo Link'
    ];

    const rows = pipeline.map(c => [
      c.id,
      `"${c.name}"`,
      `"${c.sector}"`,
      `"${c.location}"`,
      `"${c.status}"`,
      `"${c.targetPersona || ''}"`,
      `"${(c.diagnosedLeak || '').replace(/"/g, '""')}"`,
      c.estimatedMonthlyHoursLost,
      `"${c.samplePhone || ''}"`,
      `"${c.email || ''}"`,
      `"${getDemoUrl(c)}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lagos_50_b2b_outreach_pipeline_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export pipeline to JSON
  const exportToJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pipeline, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lagos_50_b2b_pipeline_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const currentScripts = activeDrawerCompany ? generateScripts(activeDrawerCompany) : {};

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-mono text-slate-900 dark:text-slate-100">
      
      {/* Header & Performance Telemetry Card (Brutalist) */}
      <div className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] space-y-6">
        
        {/* Top Action Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black dark:border-zinc-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">
                Executive Agency Console
              </span>
              <span className="text-[11px] bg-black text-amber-400 px-2 py-0.5 font-bold uppercase">
                50 Lagos Enterprises
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase text-slate-900 dark:text-white tracking-tight mt-1">
              B2B Outreach Command Center
            </h1>
            <p className="text-xs text-slate-600 dark:text-zinc-400 font-sans mt-0.5">
              Targeting 4 high-friction corridors across Lagos State (Freight, Millwork, Packaging, Plant Hire).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={exportToCSV}
              className="min-h-[44px] bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-900 dark:text-white text-xs font-bold px-4 py-2 border-2 border-black dark:border-zinc-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Download Master CSV for Apollo, HubSpot or Instantly"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={exportToJSON}
              className="min-h-[44px] bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-900 dark:text-white text-xs font-bold px-3 py-2 border-2 border-black dark:border-zinc-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Download raw JSON backup"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>JSON</span>
            </button>

            <button
              type="button"
              onClick={resetPipeline}
              className="min-h-[44px] bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-bold px-3 py-2 border-2 border-black dark:border-zinc-700 transition-colors cursor-pointer"
              title="Reset pipeline CRM to initial defaults"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6-Metric Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="border border-slate-300 dark:border-zinc-800 p-3.5 bg-slate-50 dark:bg-black">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">Total Accounts</span>
            <span className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">{totalLeads}</span>
            <span className="text-[10px] text-slate-400 block font-sans">4 Corridors</span>
          </div>

          <div className="border border-slate-300 dark:border-zinc-800 p-3.5 bg-slate-50 dark:bg-black">
            <span className="text-[10px] text-amber-600 uppercase block font-bold">Audit Ready</span>
            <span className="text-2xl font-black font-mono tabular-nums text-amber-600 dark:text-amber-400">{auditReadyCount}</span>
            <span className="text-[10px] text-slate-400 block font-sans">Diagnosis Ready</span>
          </div>

          <div className="border border-slate-300 dark:border-zinc-800 p-3.5 bg-slate-50 dark:bg-black">
            <span className="text-[10px] text-blue-600 uppercase block font-bold">Demos Sent</span>
            <span className="text-2xl font-black font-mono tabular-nums text-blue-600 dark:text-blue-400">{demoSentCount}</span>
            <span className="text-[10px] text-slate-400 block font-sans">Live Funnel Sent</span>
          </div>

          <div className="border border-slate-300 dark:border-zinc-800 p-3.5 bg-slate-50 dark:bg-black">
            <span className="text-[10px] text-purple-600 uppercase block font-bold">Calls Booked</span>
            <span className="text-2xl font-black font-mono tabular-nums text-purple-600 dark:text-purple-400">{bookedCount}</span>
            <span className="text-[10px] text-slate-400 block font-sans">Loom Follow-Up</span>
          </div>

          <div className="border border-slate-300 dark:border-zinc-800 p-3.5 bg-slate-50 dark:bg-black">
            <span className="text-[10px] text-emerald-600 uppercase block font-bold">Deals Closed</span>
            <span className="text-2xl font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">{closedCount}</span>
            <span className="text-[10px] text-slate-400 block font-sans">Active Retainers</span>
          </div>

          <div className="border border-slate-300 dark:border-zinc-800 p-3.5 bg-slate-50 dark:bg-black">
            <span className="text-[10px] text-amber-600 uppercase block font-bold">Pipeline Value</span>
            <span className="text-xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
              ₦{(estimatedPipelineValueNgn / 1000000).toFixed(1)}M
            </span>
            <span className="text-[10px] text-emerald-600 block font-bold">{totalHoursLost}h/mo leak</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar (Brutalist) */}
      <div className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search company, corridor or leak..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-h-[44px] bg-slate-50 dark:bg-black border-2 border-black dark:border-zinc-700 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        {/* Sector Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setSectorFilter('all')}
            className={`min-h-[44px] px-3.5 py-1.5 text-xs font-bold border-2 transition-all cursor-pointer ${
              sectorFilter === 'all'
                ? 'bg-black text-amber-400 border-black dark:bg-white dark:text-black'
                : 'bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-300 dark:border-zinc-800 hover:border-black'
            }`}
          >
            All (50)
          </button>
          {Object.entries(SECTORS).map(([key, sec]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSectorFilter(key)}
              className={`min-h-[44px] px-3.5 py-1.5 text-xs font-bold border-2 transition-all cursor-pointer ${
                sectorFilter === key
                  ? 'bg-black text-amber-400 border-black dark:bg-white dark:text-black'
                  : 'bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-300 dark:border-zinc-800 hover:border-black'
              }`}
            >
              {sec.name.split('&')[0]} ({sec.count})
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-slate-500">Stage:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-h-[44px] bg-slate-50 dark:bg-black border-2 border-black dark:border-zinc-700 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
          >
            <option value="all">All Stages</option>
            <option value="Audit Ready">Audit Ready</option>
            <option value="Not Contacted">Not Contacted</option>
            <option value="Demo Sent">Demo Sent</option>
            <option value="Booked">Booked</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* The Master Pipeline Table (Horizontal Scrollable on Mobile) */}
      <div className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-max text-left text-xs font-mono">
            <thead className="bg-black text-amber-400 uppercase text-[10px] tracking-wider border-b-2 border-black">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Company & Corridor Location</th>
                <th className="py-3.5 px-4">Sector</th>
                <th className="py-3.5 px-4 max-w-sm">Diagnosed Operational Leak</th>
                <th className="py-3.5 px-4 text-center">Lost Hrs/Mo</th>
                <th className="py-3.5 px-4">Pipeline Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 text-slate-800 dark:text-zinc-200">
              {filteredCompanies.map((c) => {
                const sec = SECTORS[c.sector];
                const isSelected = selectedCompanyId === c.id;

                return (
                  <tr 
                    key={c.id}
                    className={`hover:bg-slate-50 dark:hover:bg-zinc-900/60 transition-colors ${
                      isSelected ? 'bg-amber-500/10 font-bold' : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-center tabular-nums">
                      {String(c.id).padStart(2, '0')}
                    </td>

                    {/* Company & Location */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-3 h-3 shrink-0" 
                          style={{ backgroundColor: c.primaryColor }}
                        />
                        <div>
                          <strong className="text-slate-900 dark:text-white font-black block text-xs">{c.name}</strong>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-sans">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {c.location}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Sector Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 border text-[10px] font-mono font-bold uppercase ${sec?.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                        {c.sectorLabel}
                      </span>
                    </td>

                    {/* Diagnosed Operational Leak */}
                    <td className="py-3.5 px-4 max-w-xs font-sans">
                      <p className="text-slate-700 dark:text-zinc-300 text-xs line-clamp-2 leading-relaxed" title={c.diagnosedLeak}>
                        {c.diagnosedLeak}
                      </p>
                    </td>

                    {/* Estimated Hours Lost */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-black text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 border border-amber-300 dark:border-amber-500/30 tabular-nums">
                        ~{c.estimatedMonthlyHoursLost}h
                      </span>
                    </td>

                    {/* Status Dropdown (min-h-[44px]) */}
                    <td className="py-3.5 px-4">
                      <select
                        value={c.status}
                        onChange={(e) => updateCompany(c.id, { status: e.target.value })}
                        className="min-h-[44px] text-xs font-mono font-bold px-2.5 py-1 border-2 border-black dark:border-zinc-700 bg-white dark:bg-black text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                      >
                        <option value="Not Contacted">Not Contacted</option>
                        <option value="Audit Ready">Audit Ready</option>
                        <option value="Demo Sent">Demo Sent</option>
                        <option value="Booked">Booked</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    {/* Action Buttons (All min-h-[44px]) */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectDemoCompany(c)}
                          className="min-h-[44px] bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-900 dark:text-white px-3 py-1.5 text-xs font-bold border-2 border-black dark:border-zinc-700 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Open Live Calculator Demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>Demo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveDrawerCompany(c);
                            setActiveScriptTab('whatsapp');
                          }}
                          className="min-h-[44px] bg-amber-500 hover:bg-amber-400 text-black px-4 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1 border-2 border-black transition-colors cursor-pointer"
                          title="Open Personalized Outreach Drawer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Outreach</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sliding Personalization Drawer Modal */}
      {activeDrawerCompany && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-in">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-950 border-l-2 border-black dark:border-zinc-800 h-full overflow-y-auto p-5 sm:p-6 flex flex-col justify-between shadow-2xl">
            
            <div className="space-y-6">
              
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-4 border-b-2 border-black dark:border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">
                      Personalized Outreach Kit
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 border font-bold uppercase ${SECTORS[activeDrawerCompany.sector]?.badgeColor}`}>
                      {activeDrawerCompany.sectorLabel}
                    </span>
                  </div>
                  <h2 className="text-xl font-black uppercase text-slate-900 dark:text-white mt-1">{activeDrawerCompany.name}</h2>
                  <p className="text-xs text-slate-500 font-sans">{activeDrawerCompany.location}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDrawerCompany(null)}
                  className="min-h-[44px] min-w-[44px] border-2 border-black dark:border-zinc-700 bg-slate-100 dark:bg-zinc-900 text-slate-800 dark:text-white flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Diagnosed Operational Leak Teardown Box */}
              <div className="bg-amber-50 dark:bg-zinc-900 border-2 border-black dark:border-amber-500/40 p-4 space-y-2">
                <span className="text-xs text-amber-800 dark:text-amber-400 uppercase tracking-wider block font-black">
                  Diagnosed Operational Leak
                </span>
                <p className="text-xs text-slate-800 dark:text-zinc-200 leading-relaxed font-sans font-medium">
                  {activeDrawerCompany.diagnosedLeak}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-black/10 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400">
                  <span>Persona: <strong className="text-black dark:text-white">{activeDrawerCompany.targetPersona}</strong></span>
                  <span className="text-amber-700 dark:text-amber-400 font-bold tabular-nums">~{activeDrawerCompany.estimatedMonthlyHoursLost}h / month wasted</span>
                </div>
              </div>

              {/* Direct Demo Link Preview Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 gap-2">
                <div className="flex items-center gap-2 text-xs truncate">
                  <ExternalLink className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-slate-700 dark:text-zinc-300 font-mono truncate">
                    {currentScripts.demoUrl}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectDemoCompany(activeDrawerCompany);
                    setActiveDrawerCompany(null);
                  }}
                  className="min-h-[44px] bg-amber-500 hover:bg-amber-400 text-black text-xs font-black px-4 py-2 uppercase tracking-wider flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                >
                  <span>Launch Live Demo</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* 5-Tab Script Switcher (All min-h-[44px]) */}
              <div className="flex p-1 bg-slate-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 text-xs font-bold overflow-x-auto gap-1">
                <button
                  type="button"
                  onClick={() => setActiveScriptTab('whatsapp')}
                  className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 whitespace-nowrap cursor-pointer ${
                    activeScriptTab === 'whatsapp' ? 'bg-emerald-600 text-white font-black' : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveScriptTab('linkedin')}
                  className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 whitespace-nowrap cursor-pointer ${
                    activeScriptTab === 'linkedin' ? 'bg-blue-600 text-white font-black' : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>LinkedIn</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveScriptTab('email')}
                  className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 whitespace-nowrap cursor-pointer ${
                    activeScriptTab === 'email' ? 'bg-purple-600 text-white font-black' : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Cold Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveScriptTab('loom')}
                  className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 whitespace-nowrap cursor-pointer ${
                    activeScriptTab === 'loom' ? 'bg-rose-600 text-white font-black' : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>90s Loom</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveScriptTab('proposal')}
                  className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 whitespace-nowrap cursor-pointer ${
                    activeScriptTab === 'proposal' ? 'bg-amber-500 text-black font-black' : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Proposal</span>
                </button>
              </div>

              {/* Script Tab Display Content */}
              <div className="bg-slate-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 p-4 space-y-3">
                
                {/* 1. WhatsApp Tab */}
                {activeScriptTab === 'whatsapp' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">Direct WhatsApp Friction-Breaker</span>
                      <span className="text-[10px] text-slate-500">Phone: {activeDrawerCompany.samplePhone}</span>
                    </div>

                    <pre className="text-xs font-mono text-slate-800 dark:text-zinc-200 whitespace-pre-wrap bg-white dark:bg-black p-3.5 border border-slate-300 dark:border-zinc-800 leading-relaxed max-h-72 overflow-y-auto">
                      {currentScripts.whatsappMsg}
                    </pre>

                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                      <a
                        href={currentScripts.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] flex-1 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 px-4 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <Send className="w-4 h-4" />
                        <span>Launch in WhatsApp</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(currentScripts.whatsappMsg, 'whatsapp')}
                        className="min-h-[44px] w-full sm:w-auto bg-white dark:bg-black hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-900 dark:text-white py-2.5 px-4 text-xs font-bold border-2 border-black dark:border-zinc-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copyFeedback === 'whatsapp' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        <span>{copyFeedback === 'whatsapp' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. LinkedIn Tab */}
                {activeScriptTab === 'linkedin' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase">LinkedIn Executive DM</span>
                      <span className="text-[10px] text-slate-500 font-sans">Recipient: {activeDrawerCompany.targetPersona}</span>
                    </div>

                    <pre className="text-xs font-mono text-slate-800 dark:text-zinc-200 whitespace-pre-wrap bg-white dark:bg-black p-3.5 border border-slate-300 dark:border-zinc-800 leading-relaxed max-h-72 overflow-y-auto">
                      {currentScripts.linkedinMsg}
                    </pre>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentScripts.linkedinMsg, 'linkedin')}
                      className="min-h-[44px] w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-2.5 px-4 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {copyFeedback === 'linkedin' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                      <span>{copyFeedback === 'linkedin' ? 'Copied to Clipboard!' : 'Copy LinkedIn Message'}</span>
                    </button>
                  </div>
                )}

                {/* 3. Cold Email Tab */}
                {activeScriptTab === 'email' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Subject Line</span>
                      <div className="bg-white dark:bg-black p-2.5 border border-slate-300 dark:border-zinc-800 text-xs text-slate-900 dark:text-white font-bold">
                        {currentScripts.emailSubject}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Email Body</span>
                      <pre className="text-xs font-mono text-slate-800 dark:text-zinc-200 whitespace-pre-wrap bg-white dark:bg-black p-3.5 border border-slate-300 dark:border-zinc-800 leading-relaxed max-h-64 overflow-y-auto">
                        {currentScripts.emailBody}
                      </pre>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(`Subject: ${currentScripts.emailSubject}\n\n${currentScripts.emailBody}`, 'email')}
                      className="min-h-[44px] w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-2.5 px-4 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {copyFeedback === 'email' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                      <span>{copyFeedback === 'email' ? 'Subject & Body Copied!' : 'Copy Cold Email Pack'}</span>
                    </button>
                  </div>
                )}

                {/* 4. 90-Second Loom Script Tab */}
                {activeScriptTab === 'loom' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase">90-Second Loom Script</span>
                      <span className="text-[10px] text-slate-500">Timestamps 0:00 - 1:30</span>
                    </div>

                    <pre className="text-xs font-mono text-slate-800 dark:text-zinc-200 whitespace-pre-wrap bg-white dark:bg-black p-3.5 border border-slate-300 dark:border-zinc-800 leading-relaxed max-h-72 overflow-y-auto">
                      {currentScripts.loomScript}
                    </pre>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentScripts.loomScript, 'loom')}
                      className="min-h-[44px] w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-2.5 px-4 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {copyFeedback === 'loom' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                      <span>{copyFeedback === 'loom' ? 'Loom Script Copied!' : 'Copy Teleprompter Script'}</span>
                    </button>
                  </div>
                )}

                {/* 5. Implementation Proposal Scope Tab */}
                {activeScriptTab === 'proposal' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Commercial Scope</span>
                      <span className="text-[10px] text-slate-500">Phase 1 - 4 Turnkey</span>
                    </div>

                    <pre className="text-xs font-mono text-slate-800 dark:text-zinc-200 whitespace-pre-wrap bg-white dark:bg-black p-3.5 border border-slate-300 dark:border-zinc-800 leading-relaxed max-h-72 overflow-y-auto">
                      {currentScripts.proposal}
                    </pre>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentScripts.proposal, 'proposal')}
                      className="min-h-[44px] w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-2.5 px-4 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {copyFeedback === 'proposal' ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                      <span>{copyFeedback === 'proposal' ? 'Proposal Copied!' : 'Copy Commercial Proposal'}</span>
                    </button>
                  </div>
                )}

              </div>

            </div>

            {/* Drawer Footer Status Updater */}
            <div className="pt-4 border-t-2 border-black dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6">
              <span className="text-xs uppercase font-bold text-slate-500">Update Pipeline CRM:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {['Audit Ready', 'Demo Sent', 'Booked', 'Closed'].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateCompany(activeDrawerCompany.id, { status })}
                    className={`min-h-[44px] px-3 py-1 text-xs font-bold border-2 transition-colors cursor-pointer ${
                      activeDrawerCompany.status === status
                        ? 'bg-amber-500 text-black border-black font-black'
                        : 'bg-slate-100 dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:border-black'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

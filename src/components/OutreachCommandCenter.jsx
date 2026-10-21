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
  DollarSign
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
        console.error(e);
      }
    }
    return LAGOS_TARGETS_50;
  });

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Drawer state
  const [activeDrawerCompany, setActiveDrawerCompany] = useState(null);
  const [activeScriptTab, setActiveScriptTab] = useState('whatsapp'); // 'whatsapp' | 'linkedin' | 'email' | 'loom' | 'proposal'
  const [copyFeedback, setCopyFeedback] = useState('');

  // Persist to localStorage whenever pipeline changes
  useEffect(() => {
    localStorage.setItem('lagos_b2b_pipeline_v1', JSON.stringify(pipeline));
  }, [pipeline]);

  // Update company status or details
  const updateCompany = (id, fields) => {
    setPipeline(prev => prev.map(c => c.id === id ? { ...c, ...fields } : c));
    if (activeDrawerCompany && activeDrawerCompany.id === id) {
      setActiveDrawerCompany(prev => ({ ...prev, ...fields }));
    }
  };

  // Reset to factory registry
  const resetPipeline = () => {
    if (window.confirm("Reset all 50 Lagos companies back to initial registry state?")) {
      setPipeline(LAGOS_TARGETS_50);
      localStorage.removeItem('lagos_b2b_pipeline_v1');
    }
  };

  // Filtered companies
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

  // Export full pipeline to JSON
  const exportToJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pipeline, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lagos_50_b2b_pipeline_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const currentScripts = activeDrawerCompany ? generateScripts(activeDrawerCompany) : null;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Top Telemetry & Control Center Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-200">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
                B2B Growth Engineering Control Center
              </span>
              <span className="bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/30 font-semibold">
                50 Lagos Targets Live
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Lagos B2B Lead Funnel & Outreach Automation Factory
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              High-friction B2B conversion engines across Freight, Millwork, Packaging, and Heavy Plant hire in Lagos, Nigeria.
            </p>
          </div>

          {/* Quick Global Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={exportToCSV}
              className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Export CSV (HubSpot/Apollo)</span>
            </button>
            <button
              onClick={exportToJSON}
              className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 transition-colors shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Backup JSON</span>
            </button>
            <button
              onClick={resetPipeline}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs py-2.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
              title="Reset CRM Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6-Metric Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block">Total Registry</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">{totalLeads}</span>
            <span className="text-[10px] text-slate-500 block">4 Lagos Sectors</span>
          </div>

          <div className="bg-amber-50/50 dark:bg-slate-950/60 border border-amber-200/60 dark:border-slate-800/80 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 uppercase block">Audit Ready</span>
            <span className="text-2xl font-black text-amber-700 dark:text-amber-300 font-mono tabular-nums">{auditReadyCount}</span>
            <span className="text-[10px] text-slate-500 block">Scripts Generated</span>
          </div>

          <div className="bg-blue-50/50 dark:bg-slate-950/60 border border-blue-200/60 dark:border-slate-800/80 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400 uppercase block">Demos Sent</span>
            <span className="text-2xl font-black text-blue-700 dark:text-blue-300 font-mono tabular-nums">{demoSentCount}</span>
            <span className="text-[10px] text-slate-500 block">Loom/Link Delivered</span>
          </div>

          <div className="bg-purple-50/50 dark:bg-slate-950/60 border border-purple-200/60 dark:border-slate-800/80 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono text-purple-700 dark:text-purple-400 uppercase block">Calls Booked</span>
            <span className="text-2xl font-black text-purple-700 dark:text-purple-300 font-mono tabular-nums">{bookedCount}</span>
            <span className="text-[10px] text-slate-500 block">Executive Review</span>
          </div>

          <div className="bg-emerald-50/50 dark:bg-slate-950/60 border border-emerald-200/60 dark:border-slate-800/80 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 uppercase block">Deals Closed</span>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono tabular-nums">{closedCount}</span>
            <span className="text-[10px] text-slate-500 block">Active Retainers</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 uppercase block">Pipeline Value</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              ₦{(estimatedPipelineValueNgn / 1000000).toFixed(1)}M
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">{totalHoursLost} hrs/mo saved</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm dark:shadow-none transition-colors duration-200">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search company, corridor or leak..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Sector Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          <button
            onClick={() => setSectorFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sectorFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
            }`}
          >
            All (50)
          </button>
          {Object.entries(SECTORS).map(([key, sec]) => (
            <button
              key={key}
              onClick={() => setSectorFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                sectorFilter === key
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {sec.name.split('&')[0]} ({sec.count})
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
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

      {/* The Master Pipeline Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 font-mono uppercase text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Company & Location</th>
                <th className="py-3.5 px-4">Sector</th>
                <th className="py-3.5 px-4">Diagnosed Operational Leak</th>
                <th className="py-3.5 px-4 text-center">Lost Hrs/Mo</th>
                <th className="py-3.5 px-4">Pipeline Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              {filteredCompanies.map((c) => {
                const sec = SECTORS[c.sector];
                const isSelected = selectedCompanyId === c.id;

                return (
                  <tr 
                    key={c.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-amber-50/70 dark:bg-amber-500/5' : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="py-3 px-4 font-mono text-slate-400 dark:text-slate-500 text-center">
                      {String(c.id).padStart(2, '0')}
                    </td>

                    {/* Company & Location */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: c.primaryColor }}
                        />
                        <div>
                          <strong className="text-slate-900 dark:text-slate-100 font-bold block text-sm">{c.name}</strong>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                            {c.location}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Sector Badge */}
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono border ${sec?.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                        {c.sectorLabel}
                      </span>
                    </td>

                    {/* Diagnosed Operational Leak */}
                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2 leading-relaxed" title={c.diagnosedLeak}>
                        {c.diagnosedLeak}
                      </p>
                    </td>

                    {/* Estimated Hours Lost */}
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded border border-amber-200 dark:border-amber-500/20 tabular-nums">
                        ~{c.estimatedMonthlyHoursLost}h
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-4">
                      <select
                        value={c.status}
                        onChange={(e) => updateCompany(c.id, { status: e.target.value })}
                        className={`text-xs font-mono font-semibold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                          c.status === 'Closed' ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' :
                          c.status === 'Booked' ? 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800' :
                          c.status === 'Demo Sent' ? 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800' :
                          c.status === 'Audit Ready' ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800' :
                          'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800'
                        }`}
                      >
                        <option value="Not Contacted">Not Contacted</option>
                        <option value="Audit Ready">Audit Ready</option>
                        <option value="Demo Sent">Demo Sent</option>
                        <option value="Booked">Booked</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectDemoCompany(c)}
                          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
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
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl transition-colors duration-200">
            
            <div className="space-y-6">
              
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
                      Personalized Outreach Kit
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${SECTORS[activeDrawerCompany.sector]?.badgeColor}`}>
                      {activeDrawerCompany.sectorLabel}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{activeDrawerCompany.name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{activeDrawerCompany.location}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDrawerCompany(null)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Diagnosed Operational Leak Teardown Box */}
              <div className="bg-amber-50/50 dark:bg-slate-950/80 border border-amber-300/80 dark:border-amber-500/30 rounded-xl p-4 space-y-2">
                <span className="text-[11px] font-mono text-amber-800 dark:text-amber-400 uppercase tracking-wider block font-bold">
                  Diagnosed Operational Leak
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {activeDrawerCompany.diagnosedLeak}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-amber-200 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                  <span>Persona: <strong className="text-slate-900 dark:text-slate-300">{activeDrawerCompany.targetPersona}</strong></span>
                  <span className="text-amber-700 dark:text-amber-400 font-bold">~{activeDrawerCompany.estimatedMonthlyHoursLost}h / month wasted</span>
                </div>
              </div>

              {/* Direct Demo Link Preview Button */}
              <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-xs">
                  <ExternalLink className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-mono truncate max-w-sm">
                    {currentScripts.demoUrl}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectDemoCompany(activeDrawerCompany);
                    setActiveDrawerCompany(null);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 shadow-sm"
                >
                  <span>Launch Live Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 5-Tab Script Switcher */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto">
                <button
                  onClick={() => setActiveScriptTab('whatsapp')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeScriptTab === 'whatsapp' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp DM</span>
                </button>

                <button
                  onClick={() => setActiveScriptTab('linkedin')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeScriptTab === 'linkedin' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>LinkedIn DM</span>
                </button>

                <button
                  onClick={() => setActiveScriptTab('email')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeScriptTab === 'email' ? 'bg-purple-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Cold Email</span>
                </button>

                <button
                  onClick={() => setActiveScriptTab('loom')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeScriptTab === 'loom' ? 'bg-rose-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>90s Loom Script</span>
                </button>

                <button
                  onClick={() => setActiveScriptTab('proposal')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeScriptTab === 'proposal' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Scope Proposal</span>
                </button>
              </div>

              {/* Script Tab Display Content */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                
                {/* 1. WhatsApp Tab */}
                {activeScriptTab === 'whatsapp' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">Direct WhatsApp Friction-Breaker</span>
                      <span className="text-[10px] text-slate-500 font-mono">Target: {activeDrawerCompany.samplePhone}</span>
                    </div>

                    <pre className="text-xs font-mono text-slate-800 dark:text-slate-300 whitespace-pre-wrap bg-white dark:bg-slate-900/80 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed max-h-72 overflow-y-auto">
                      {currentScripts.whatsappMsg}
                    </pre>

                    <div className="flex items-center gap-2 pt-2">
                      <a
                        href={currentScripts.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Launch in WhatsApp Web</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(currentScripts.whatsappMsg, 'whatsapp')}
                        className="bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2.5 px-4 rounded-xl text-xs font-mono flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                      >
                        {copyFeedback === 'whatsapp' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copyFeedback === 'whatsapp' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. LinkedIn Tab */}
                {activeScriptTab === 'linkedin' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-blue-700 dark:text-blue-400 font-bold">LinkedIn Executive DM</span>
                      <span className="text-[10px] text-slate-500 font-mono">Recipient: {activeDrawerCompany.targetPersona}</span>
                    </div>

                    <pre className="text-xs font-mono text-slate-800 dark:text-slate-300 whitespace-pre-wrap bg-white dark:bg-slate-900/80 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed max-h-72 overflow-y-auto">
                      {currentScripts.linkedinMsg}
                    </pre>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentScripts.linkedinMsg, 'linkedin')}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      {copyFeedback === 'linkedin' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copyFeedback === 'linkedin' ? 'Copied to Clipboard!' : 'Copy LinkedIn Message'}</span>
                    </button>
                  </div>
                )}

                {/* 3. Cold Email Tab */}
                {activeScriptTab === 'email' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Subject Line</span>
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 font-semibold shadow-sm">
                        {currentScripts.emailSubject}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Email Body</span>
                      <pre className="text-xs font-mono text-slate-800 dark:text-slate-300 whitespace-pre-wrap bg-white dark:bg-slate-900/80 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed max-h-64 overflow-y-auto">
                        {currentScripts.emailBody}
                      </pre>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(`Subject: ${currentScripts.emailSubject}\n\n${currentScripts.emailBody}`, 'email')}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      {copyFeedback === 'email' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copyFeedback === 'email' ? 'Subject & Body Copied!' : 'Copy Cold Email Pack'}</span>
                    </button>
                  </div>
                )}

                {/* 4. 90-Second Loom Script Tab */}
                {activeScriptTab === 'loom' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-rose-700 dark:text-rose-400 font-bold">90-Second Loom Teleprompter Script</span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Timestamps 0:00 - 1:30</span>
                    </div>

                    <pre className="text-xs font-mono text-slate-800 dark:text-slate-300 whitespace-pre-wrap bg-white dark:bg-slate-900/80 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed max-h-72 overflow-y-auto">
                      {currentScripts.loomScript}
                    </pre>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentScripts.loomScript, 'loom')}
                      className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      {copyFeedback === 'loom' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copyFeedback === 'loom' ? 'Loom Script Copied!' : 'Copy Teleprompter Script'}</span>
                    </button>
                  </div>
                )}

                {/* 5. Implementation Proposal Scope Tab */}
                {activeScriptTab === 'proposal' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-amber-700 dark:text-amber-400 font-bold">Commercial Implementation Scope</span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Phase 1 - 4 Roadmap (₦)</span>
                    </div>

                    <pre className="text-xs font-mono text-slate-800 dark:text-slate-300 whitespace-pre-wrap bg-white dark:bg-slate-900/80 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed max-h-72 overflow-y-auto">
                      {currentScripts.proposal}
                    </pre>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentScripts.proposal, 'proposal')}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      {copyFeedback === 'proposal' ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copyFeedback === 'proposal' ? 'Proposal Copied!' : 'Copy Commercial Proposal'}</span>
                    </button>
                  </div>
                )}

              </div>

            </div>

            {/* Drawer Footer Status Updater */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between mt-6">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Update CRM Stage:</span>
              <div className="flex items-center gap-1.5">
                {['Audit Ready', 'Demo Sent', 'Booked', 'Closed'].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateCompany(activeDrawerCompany.id, { status })}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      activeDrawerCompany.status === status
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
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

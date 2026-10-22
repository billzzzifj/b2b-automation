import React, { useState } from 'react';
import { Search, ArrowLeft, Building2, ExternalLink, AlertOctagon } from 'lucide-react';
import { LAGOS_TARGETS_50, SECTORS } from '../data/lagosTargets50';

export default function CompanyNotFound({ attemptedSlug, onSelectCompany, onBackHome }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = LAGOS_TARGETS_50.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Suggested flagship targets across 4 sectors
  const flagships = [
    LAGOS_TARGETS_50.find(c => c.slug === 'cargo-naija'),
    LAGOS_TARGETS_50.find(c => c.slug === 'woodify-ng'),
    LAGOS_TARGETS_50.find(c => c.slug === 'printivo'),
    LAGOS_TARGETS_50.find(c => c.slug === 'mantrac-nigeria-cat')
  ].filter(Boolean);

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 font-mono space-y-8">
      {/* 404 Brutalist Banner */}
      <div className="border-2 border-black dark:border-amber-500 bg-white dark:bg-zinc-950 p-6 sm:p-8 space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(245,158,11,0.5)]">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <AlertOctagon className="w-7 h-7 shrink-0 text-red-600" />
          <span className="text-xs uppercase tracking-widest font-black block">
            404 // Target Not Registered In Pipeline
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Company Not Found
        </h1>

        <div className="bg-slate-100 dark:bg-black p-3.5 border border-slate-300 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-300">
          <span>Attempted Route Slug: </span>
          <code className="text-red-600 dark:text-red-400 font-bold">
            /#/demo/{attemptedSlug || 'unknown'}
          </code>
        </div>

        <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
          The requested company slug does not match any of the 50 registered high-friction Lagos enterprises in the master registry. Check for a typo or select an active commercial portal below.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onBackHome}
            className="min-h-[44px] bg-black hover:bg-zinc-800 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-black font-black px-6 py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Agency Pipeline</span>
          </button>
        </div>
      </div>

      {/* Flagship Quick Launchers */}
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 font-bold block">
          Flagship Sector Deployments (Verified Active)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {flagships.map(comp => (
            <button
              key={comp.slug}
              type="button"
              onClick={() => onSelectCompany(comp)}
              className="min-h-[44px] p-4 text-left border-2 border-slate-300 dark:border-zinc-800 hover:border-black dark:hover:border-amber-500 bg-white dark:bg-zinc-900 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400 block">
                  {SECTORS[comp.sector]?.name.split('&')[0]}
                </span>
                <span className="font-black text-sm text-slate-900 dark:text-white block group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {comp.name}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 block mt-1">
                  {comp.location}
                </span>
              </div>
              <span className="mt-3 text-[11px] font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                Launch Portal ➔
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Directory Search */}
      <div className="border border-slate-300 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950 space-y-4">
        <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400 font-bold block">
          Search All 50 Registered Lagos Targets
        </span>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type company name, corridor location (Ikeja, Lekki, Apapa), or sector..."
            className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-black dark:focus:border-amber-500"
          />
        </div>

        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-900">
          {filtered.map(c => (
            <div
              key={c.slug}
              onClick={() => onSelectCompany(c)}
              className="py-2.5 px-2 hover:bg-slate-50 dark:hover:bg-zinc-900/60 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white">#{c.id} {c.name}</span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 ml-2">({c.location})</span>
              </div>
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 border border-amber-500/30 px-1.5 py-0.5">
                {c.sector.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

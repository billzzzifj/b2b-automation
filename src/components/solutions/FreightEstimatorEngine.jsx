import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Ship, 
  Calculator, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check, 
  Send, 
  AlertCircle, 
  Layers, 
  DollarSign, 
  Scale, 
  Box, 
  FileText,
  Sparkles,
  MapPin,
  ExternalLink,
  Smartphone,
  Printer
} from 'lucide-react';
import WhatsAppSimulatorModal from '../common/WhatsAppSimulatorModal';
import ProformaInvoiceModal from '../common/ProformaInvoiceModal';

export default function FreightEstimatorEngine({ company }) {
  const custom = company?.customMetrics || {
    airRateUsd: 8.40,
    seaRateUsd: 235,
    exchangeRate: 1485,
    handlingFeeNgn: 4500
  };

  // State
  const [freightType, setFreightType] = useState('air'); // 'air' | 'sea'
  const [origin, setOrigin] = useState('Guangzhou (CAN)');
  const [destination, setDestination] = useState('MMA Cargo Terminal, Lagos');
  const [cargoCategory, setCargoCategory] = useState('general');
  const [weightKg, setWeightKg] = useState(85);
  const [volumeCbm, setVolumeCbm] = useState(2.5);
  const [invoiceValueUsd, setInvoiceValueUsd] = useState(1200);
  const [dutyBracket, setDutyBracket] = useState(0.10); // 10% duty
  const [includeClearing, setIncludeClearing] = useState(true);
  const [currencyView, setCurrencyView] = useState('NGN'); // 'NGN' | 'USD'
  const [copied, setCopied] = useState(false);
  const [isWhatsAppSimOpen, setIsWhatsAppSimOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Countdown timer simulation for next consolidation cut-off
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 27, seconds: 43 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return { days: 3, hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const exchangeRate = custom.exchangeRate || 1485;

  // Rate multipliers by cargo category
  const categoryMultipliers = {
    general: { name: 'General Merchandise', airFactor: 1.0, seaFactor: 1.0 },
    electronics: { name: 'Batteries / Electronics', airFactor: 1.18, seaFactor: 1.12 },
    spares: { name: 'Industrial Spares / Heavy Tools', airFactor: 1.10, seaFactor: 1.05 },
    fashion: { name: 'Apparel, Shoes & Textiles', airFactor: 1.05, seaFactor: 1.02 }
  };

  const selectedCat = categoryMultipliers[cargoCategory];

  // Freight Calculation
  let freightCostUsd = 0;
  if (freightType === 'air') {
    const effectiveAirRate = custom.airRateUsd * selectedCat.airFactor;
    freightCostUsd = weightKg * effectiveAirRate;
  } else {
    const effectiveSeaRate = custom.seaRateUsd * selectedCat.seaFactor;
    freightCostUsd = volumeCbm * effectiveSeaRate;
  }

  const freightCostNgn = freightCostUsd * exchangeRate;
  const handlingFeeNgn = custom.handlingFeeNgn || 4500;

  // Statutory Customs Duty & Surcharges (Nigeria Customs Service Tariff Formulation)
  const cifValueNgn = (invoiceValueUsd * exchangeRate) + freightCostNgn;
  const customsDutyNgn = includeClearing ? cifValueNgn * dutyBracket : 0;
  const cissNgn = includeClearing ? cifValueNgn * 0.01 : 0; // 1% CISS
  const etlsNgn = includeClearing ? cifValueNgn * 0.005 : 0; // 0.5% ETLS
  const portLevyNgn = includeClearing ? customsDutyNgn * 0.07 : 0; // 7% Surcharge on Duty
  const vatNgn = includeClearing ? (cifValueNgn + customsDutyNgn + portLevyNgn) * 0.075 : 0; // 7.5% VAT
  const clearanceAdminFeeNgn = includeClearing ? 45000 : 0; // PAAR/terminal handling

  const totalClearingNgn = customsDutyNgn + cissNgn + etlsNgn + portLevyNgn + vatNgn + clearanceAdminFeeNgn;
  const totalLandedCostNgn = freightCostNgn + handlingFeeNgn + totalClearingNgn;
  const totalLandedCostUsd = totalLandedCostNgn / exchangeRate;

  // Formatting helpers
  const formatNgn = (val) => `₦${Math.round(val).toLocaleString()}`;
  const formatUsd = (val) => `$${Number(val).toFixed(2)}`;

  // Automated WhatsApp Booking Card Generation
  const whatsappBookingText = `*BOOKING INQUIRY // ${company.name.toUpperCase()}*
---------------------------------------
• Route: ${origin} ➔ ${destination}
• Service: ${freightType === 'air' ? 'AIR CARGO CONSOLIDATION' : 'OCEAN FREIGHT LCL/FCL'}
• Category: ${selectedCat.name}
• Metrics: ${freightType === 'air' ? `${weightKg} KG Gross Weight` : `${volumeCbm} CBM Volume`}
• Declared Value: $${invoiceValueUsd.toLocaleString()}
---------------------------------------
• Freight Estimate: ${formatNgn(freightCostNgn)} (${formatUsd(freightCostUsd)})
• Terminal Handling: ${formatNgn(handlingFeeNgn)}
${includeClearing ? `• Est. Customs & Clearing: ${formatNgn(totalClearingNgn)}\n` : ''}• *TOTAL LANDED ESTIMATE: ${formatNgn(totalLandedCostNgn)}*
---------------------------------------
Generated via ${company.name} Automated Rate Portal. Please confirm space allocation for this shipment.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappBookingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const phoneTarget = company.samplePhone || '2348033045612';
  const whatsappUrl = `https://wa.me/${phoneTarget}?text=${encodeURIComponent(whatsappBookingText)}`;

  const invoiceData = {
    title: `${freightType === 'air' ? 'Air Cargo Consolidation' : 'Ocean Container Freight'} Landed Quote`,
    subtitle: `Transit Route: ${origin} ➔ ${destination}`,
    subtotal: freightCostNgn + handlingFeeNgn,
    surcharges: cissNgn + etlsNgn + portLevyNgn + clearanceAdminFeeNgn,
    vat: vatNgn,
    total: totalLandedCostNgn,
    items: [
      {
        name: `${freightType === 'air' ? 'Air Freight Cargo Space Allocation' : 'Ocean Container Freight Transit'}`,
        desc: `${selectedCat.name} (${freightType === 'air' ? `${weightKg} KG` : `${volumeCbm} CBM`}) from ${origin.split(' ')[0]} to Lagos`,
        qty: freightType === 'air' ? `${weightKg} KG` : `${volumeCbm} CBM`,
        rate: freightType === 'air' ? (custom.airRateUsd * selectedCat.airFactor * exchangeRate) : (custom.seaRateUsd * selectedCat.seaFactor * exchangeRate),
        total: freightCostNgn
      },
      {
        name: 'Lagos Terminal Handling & Port Dues',
        desc: 'Ground handling, sorting, physical transfer and security scanning',
        qty: '1 Consignment',
        rate: handlingFeeNgn,
        total: handlingFeeNgn
      },
      ...(includeClearing ? [
        {
          name: `Customs Statutory Import Duty (${dutyBracket * 100}%)`,
          desc: `Calculated on commercial invoice CIF value ($${invoiceValueUsd.toLocaleString()})`,
          qty: 'Statutory Tariff',
          rate: customsDutyNgn,
          total: customsDutyNgn
        },
        {
          name: 'Nigeria Customs Port Surcharges & PAAR Processing',
          desc: '1% CISS, 0.5% ETLS, 7% Port Development Surcharge, PAAR documentation',
          qty: 'Statutory Fees',
          rate: cissNgn + etlsNgn + portLevyNgn + clearanceAdminFeeNgn,
          total: cissNgn + etlsNgn + portLevyNgn + clearanceAdminFeeNgn
        }
      ] : [])
    ]
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Banner: Urgency & Consolidation Schedule */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-100 dark:from-amber-950/40 dark:via-amber-900/20 dark:to-slate-900/60 border border-amber-300 dark:border-amber-500/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-sm transition-colors duration-200 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-wider uppercase text-amber-700 dark:text-amber-400 font-semibold">Priority Schedule</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Next scheduled consolidation flight departing from <strong className="text-amber-700 dark:text-amber-300">Guangzhou (CAN)</strong> closes in:
            </p>
          </div>
        </div>
        
        {/* Countdown Box */}
        <div className="flex items-center gap-2 font-mono text-center">
          <div className="bg-white dark:bg-slate-950/80 border border-amber-300 dark:border-amber-500/30 px-3 py-1.5 rounded-lg shadow-sm">
            <span className="text-lg font-bold text-amber-700 dark:text-amber-400 tabular-nums">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase">Days</span>
          </div>
          <span className="text-amber-500 font-bold">:</span>
          <div className="bg-white dark:bg-slate-950/80 border border-amber-300 dark:border-amber-500/30 px-3 py-1.5 rounded-lg shadow-sm">
            <span className="text-lg font-bold text-amber-700 dark:text-amber-400 tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase">Hours</span>
          </div>
          <span className="text-amber-500 font-bold">:</span>
          <div className="bg-white dark:bg-slate-950/80 border border-amber-300 dark:border-amber-500/30 px-3 py-1.5 rounded-lg shadow-sm">
            <span className="text-lg font-bold text-amber-700 dark:text-amber-400 tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase">Mins</span>
          </div>
          <span className="text-amber-500 font-bold">:</span>
          <div className="bg-white dark:bg-slate-950/80 border border-amber-300 dark:border-amber-500/30 px-3 py-1.5 rounded-lg shadow-sm">
            <span className="text-lg font-bold text-amber-700 dark:text-amber-400 tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase">Secs</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls vs Live Financial Quotation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Configuration Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 backdrop-blur-md shadow-xl dark:shadow-2xl transition-colors duration-200">
          
          {/* Header & Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">Rate Calculator</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">FX @ ₦{exchangeRate}/$</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{company.name} Cargo Matrix</h2>
            </div>

            {/* Air / Sea Toggle Buttons */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
              <button
                onClick={() => setFreightType('air')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  freightType === 'air'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Plane className="w-4 h-4" />
                Air Freight
              </button>
              <button
                onClick={() => setFreightType('sea')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  freightType === 'sea'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Ship className="w-4 h-4" />
                Sea Cargo
              </button>
            </div>
          </div>

          {/* Route Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 font-medium">
                Origin Logistics Hub
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition-colors shadow-sm dark:shadow-none"
              >
                <option value="Guangzhou (CAN), China">Guangzhou Hub (CAN), China</option>
                <option value="Yiwu Warehouse (YIW), China">Yiwu Consolidation (YIW), China</option>
                <option value="London Heathrow (LHR), UK">London Heathrow (LHR), United Kingdom</option>
                <option value="New York (JFK), USA">New York (JFK), United States</option>
                <option value="Dubai Cargo Village (DXB), UAE">Dubai Cargo Village (DXB), UAE</option>
                <option value="Istanbul Airport (IST), Turkey">Istanbul Airport (IST), Turkey</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 font-medium">
                Lagos Destination Terminal
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 transition-colors shadow-sm dark:shadow-none"
              >
                <option value="MMA Cargo Terminal, Ikeja">MMA Cargo Terminal (Ikeja, Lagos)</option>
                <option value="Apapa Ocean Terminal, Lagos">Apapa Port Corridor (Wharf Road)</option>
                <option value="Tin Can Island Port, Lagos">Tin Can Island Terminal</option>
                <option value="Lillypond Container Depot, Ijora">Lillypond Container Depot, Ijora</option>
                <option value="Direct Doorstep Courier (Lagos Island/Mainland)">Doorstep Delivery (Lagos Express)</option>
              </select>
            </div>
          </div>

          {/* Cargo Classification */}
          <div>
            <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 font-medium">
              Cargo Classification
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(categoryMultipliers).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCargoCategory(key)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    cargoCategory === key
                      ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold shadow-sm dark:bg-amber-500/10 dark:border-amber-500/60 dark:text-amber-300 dark:shadow-inner'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="block font-medium truncate">{item.name}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {freightType === 'air' ? `Rate x${item.airFactor}` : `Rate x${item.seaFactor}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Sliders based on Air vs Sea */}
          {freightType === 'air' ? (
            <div className="space-y-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-700 dark:text-slate-300 flex items-center gap-2 font-semibold">
                  <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Consignment Gross Weight (Kilograms)
                </span>
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg shadow-sm">
                  <input
                    type="number"
                    min="1"
                    max="3000"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value)))}
                    className="w-16 bg-transparent text-right font-mono text-sm font-bold text-amber-600 dark:text-amber-400 focus:outline-none"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">KG</span>
                </div>
              </div>

              <input
                type="range"
                min="5"
                max="1000"
                step="5"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
              />

              {/* Quick weight presets */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Quick Presets:</span>
                {[20, 50, 150, 300, 500].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setWeightKg(val)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      weightKg === val 
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-transparent'
                    }`}
                  >
                    {val}kg
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-700 dark:text-slate-300 flex items-center gap-2 font-semibold">
                  <Box className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Cargo Volume (Cubic Meters - CBM)
                </span>
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg shadow-sm">
                  <input
                    type="number"
                    min="0.5"
                    max="70"
                    step="0.5"
                    value={volumeCbm}
                    onChange={(e) => setVolumeCbm(Math.max(0.5, Number(e.target.value)))}
                    className="w-16 bg-transparent text-right font-mono text-sm font-bold text-blue-600 dark:text-blue-400 focus:outline-none"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">CBM</span>
                </div>
              </div>

              <input
                type="range"
                min="0.5"
                max="68"
                step="0.5"
                value={volumeCbm}
                onChange={(e) => setVolumeCbm(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
              />

              {/* Container presets */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Container Milestones:</span>
                {[
                  { label: '1 CBM (LCL)', val: 1.0 },
                  { label: '5 CBM (Groupage)', val: 5.0 },
                  { label: '28 CBM (20ft FCL)', val: 28.0 },
                  { label: '68 CBM (40ft HQ)', val: 68.0 },
                ].map(item => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setVolumeCbm(item.val)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      volumeCbm === item.val 
                        ? 'bg-blue-600 text-white font-bold shadow-sm' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-transparent'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customs Duty & Statutory Clearing Section */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-200 font-semibold">
                  Customs Duty & Port Surcharges
                </span>
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={includeClearing}
                  onChange={(e) => setIncludeClearing(e.target.checked)}
                  className="rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-0 w-4 h-4"
                />
                <span>Include Nigeria Customs Clearance</span>
              </label>
            </div>

            {includeClearing && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-inner">
                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 mb-1 font-medium">
                    Declared Commercial Invoice Value (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400">$</span>
                    <input
                      type="number"
                      min="100"
                      step="50"
                      value={invoiceValueUsd}
                      onChange={(e) => setInvoiceValueUsd(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-7 pr-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 font-mono shadow-sm dark:shadow-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 mb-1 font-medium">
                    Customs HS Duty Tariff Bracket
                  </label>
                  <select
                    value={dutyBracket}
                    onChange={(e) => setDutyBracket(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 font-mono shadow-sm dark:shadow-none"
                  >
                    <option value={0.05}>5% - Capital Goods, Heavy Machinery & Raw Materials</option>
                    <option value={0.10}>10% - Intermediate Industrial Supplies & Parts</option>
                    <option value={0.20}>20% - Finished Consumer & Retail Goods</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Operational ROI Banner */}
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                <strong>Desk Automation Impact:</strong> Replaces ~45 daily manual WhatsApp voice notes with self-serve instant quotations.
              </span>
            </div>
            <span className="font-mono bg-amber-200/60 dark:bg-amber-500/20 px-2 py-0.5 rounded text-amber-900 dark:text-amber-200 text-[11px] shrink-0 ml-2 font-bold">
              +{company.estimatedMonthlyHoursLost} hrs/mo saved
            </span>
          </div>

        </div>

        {/* Right Column: Live Quotation Summary Card & WhatsApp Dispatch (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-200">
            
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl -z-0" />

            <div className="relative z-10 space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">Formal Quotation</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {company.name} Desk Estimate
                  </h3>
                </div>

                {/* Currency Switcher */}
                <div className="flex p-0.5 bg-slate-100 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                  <button
                    onClick={() => setCurrencyView('NGN')}
                    className={`px-2 py-1 rounded transition-colors ${
                      currencyView === 'NGN' 
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    NGN (₦)
                  </button>
                  <button
                    onClick={() => setCurrencyView('USD')}
                    className={`px-2 py-1 rounded transition-colors ${
                      currencyView === 'USD' 
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              {/* Shipment Metrics Strip */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 dark:bg-slate-950/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Service Type</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold uppercase">{freightType} Forwarding</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Billable Quantity</span>
                  <span className="text-amber-700 dark:text-amber-400 font-bold">
                    {freightType === 'air' ? `${weightKg} KG Gross` : `${volumeCbm} CBM`}
                  </span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] uppercase">Transit Corridor</span>
                  <span className="text-slate-700 dark:text-slate-300 text-[11px] truncate max-w-[220px]">
                    {origin.split(' ')[0]} ➔ {destination.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Financial Itemization */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Core International Freight</span>
                  <span className="font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">
                    {currencyView === 'NGN' ? formatNgn(freightCostNgn) : formatUsd(freightCostUsd)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Lagos Handling & Cargo Dues</span>
                  <span className="font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">
                    {currencyView === 'NGN' ? formatNgn(handlingFeeNgn) : formatUsd(handlingFeeNgn / exchangeRate)}
                  </span>
                </div>

                {includeClearing && (
                  <>
                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800/50">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Customs Statutory Duty ({(dutyBracket * 100)}%)</span>
                      <span className="font-mono font-medium tabular-nums text-slate-900 dark:text-slate-300">
                        {currencyView === 'NGN' ? formatNgn(customsDutyNgn) : formatUsd(customsDutyNgn / exchangeRate)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Port Surcharges (CISS + ETLS + Port)</span>
                      <span className="font-mono font-medium tabular-nums text-slate-600 dark:text-slate-400">
                        {currencyView === 'NGN' ? formatNgn(cissNgn + etlsNgn + portLevyNgn) : formatUsd((cissNgn + etlsNgn + portLevyNgn) / exchangeRate)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Import VAT (7.5%) & PAAR Handling</span>
                      <span className="font-mono font-medium tabular-nums text-slate-600 dark:text-slate-400">
                        {currencyView === 'NGN' ? formatNgn(vatNgn + clearanceAdminFeeNgn) : formatUsd((vatNgn + clearanceAdminFeeNgn) / exchangeRate)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Total Landed Cost Card */}
              <div className="bg-slate-50 dark:bg-slate-950 border-2 border-amber-500/40 rounded-xl p-4 space-y-1 shadow-sm">
                <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 uppercase tracking-wider block font-bold">
                  Total Landed Cost Estimate
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
                    {currencyView === 'NGN' ? formatNgn(totalLandedCostNgn) : formatUsd(totalLandedCostUsd)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {currencyView === 'NGN' ? `~${formatUsd(totalLandedCostUsd)}` : `~${formatNgn(totalLandedCostNgn)}`}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 pt-1">
                  *Includes documentation, clearance and terminal consolidation handling.
                </p>
              </div>

              {/* WhatsApp & Proforma Actions */}
              <div className="space-y-2 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-950/20 dark:shadow-emerald-950/40 transition-all group"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>Dispatch Booking via WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWhatsAppSimOpen(true)}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Test in Simulator</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsInvoiceOpen(true)}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Proforma PDF</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Booking Payload Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>Copy Raw WhatsApp Payload</span>
                    </>
                  )}
                </button>
              </div>

              {/* Desk Information Footer */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {company.location}
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400">Active Rate Session</span>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* WhatsApp Simulator Modal */}
      <WhatsAppSimulatorModal
        isOpen={isWhatsAppSimOpen}
        onClose={() => setIsWhatsAppSimOpen(false)}
        company={company}
        payloadText={whatsappBookingText}
        onOpenInvoice={() => setIsInvoiceOpen(true)}
      />

      {/* Official Proforma Invoice Modal */}
      <ProformaInvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        company={company}
        invoiceData={invoiceData}
      />
    </div>
  );
}

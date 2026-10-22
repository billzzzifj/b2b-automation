import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Ship, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  Copy, 
  Check, 
  Send, 
  Sliders, 
  MapPin, 
  Sparkles, 
  HelpCircle,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ExternalLink,
  Smartphone,
  Printer,
  Link2
} from 'lucide-react';
import WhatsAppSimulatorModal from '../common/WhatsAppSimulatorModal';
import ProformaInvoiceModal from '../common/ProformaInvoiceModal';
import { getHashParams, updateHashParams, buildShareUrl } from '../../utils/urlState';

export default function FreightEstimatorEngine({ company }) {
  const custom = company?.customMetrics || {
    airRateUsd: 8.40,
    seaRateUsd: 235,
    exchangeRate: 1485,
    handlingFeeNgn: 4500
  };

  // Read initial configuration from URL params
  const initialParams = getHashParams();

  // State
  const [freightType, setFreightType] = useState(
    initialParams.service === 'sea' ? 'sea' : 'air'
  );
  const [origin, setOrigin] = useState(initialParams.origin || 'Guangzhou (CAN)');
  const [destination, setDestination] = useState('MMA Cargo Terminal, Lagos');
  const [cargoCategory, setCargoCategory] = useState(initialParams.cat || 'general');
  const [weightKg, setWeightKg] = useState(
    initialParams.weight ? Math.max(1, Number(initialParams.weight)) : 85
  );
  const [volumeCbm, setVolumeCbm] = useState(
    initialParams.cbm ? Math.max(0.1, Number(initialParams.cbm)) : 2.5
  );
  const [invoiceValueUsd, setInvoiceValueUsd] = useState(
    initialParams.val ? Math.max(100, Number(initialParams.val)) : 1200
  );
  const [dutyBracket, setDutyBracket] = useState(0.10);
  const [includeClearing, setIncludeClearing] = useState(
    initialParams.clearing !== '0'
  );
  const [currencyView, setCurrencyView] = useState(
    initialParams.curr === 'USD' ? 'USD' : 'NGN'
  );

  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isWhatsAppSimOpen, setIsWhatsAppSimOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Sync state to URL hash query parameters on change
  useEffect(() => {
    updateHashParams({
      service: freightType,
      origin: origin,
      weight: freightType === 'air' ? weightKg : undefined,
      cbm: freightType === 'sea' ? volumeCbm : undefined,
      clearing: includeClearing ? '1' : '0',
      curr: currencyView,
      cat: cargoCategory
    }, company?.slug);
  }, [freightType, origin, weightKg, volumeCbm, includeClearing, currencyView, cargoCategory, company?.slug]);

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

  const selectedCat = categoryMultipliers[cargoCategory] || categoryMultipliers.general;

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
  const cissNgn = includeClearing ? cifValueNgn * 0.01 : 0;
  const etlsNgn = includeClearing ? cifValueNgn * 0.005 : 0;
  const portLevyNgn = includeClearing ? customsDutyNgn * 0.07 : 0;
  const vatNgn = includeClearing ? (cifValueNgn + customsDutyNgn + portLevyNgn) * 0.075 : 0;
  const clearanceAdminFeeNgn = includeClearing ? 45000 : 0;

  const totalClearingNgn = customsDutyNgn + cissNgn + etlsNgn + portLevyNgn + vatNgn + clearanceAdminFeeNgn;
  const totalLandedCostNgn = freightCostNgn + handlingFeeNgn + totalClearingNgn;
  const totalLandedCostUsd = totalLandedCostNgn / exchangeRate;

  // Formatting helpers
  const formatNgn = (val) => `₦${Math.round(val).toLocaleString()}`;
  const formatUsd = (val) => `$${Number(val).toFixed(2)}`;

  // Automated WhatsApp Booking Card Generation
  const whatsappBookingText = `*BOOKING INQUIRY // ${company.name.toUpperCase()}*
---------------------------------------
• Transit Mode: ${freightType.toUpperCase()} FREIGHT
• Corridor: ${origin} ➔ ${destination}
• Commodity Type: ${selectedCat.name}
• Billable Spec: ${freightType === 'air' ? `${weightKg} KG Gross Weight` : `${volumeCbm} CBM Volume`}
• Commercial Value: $${invoiceValueUsd.toLocaleString()} USD (~${formatNgn(invoiceValueUsd * exchangeRate)})
• Turnkey Clearing: ${includeClearing ? 'YES (Includes Customs Duty, CISS, ETLS, VAT)' : 'NO (Freight Only)'}
---------------------------------------
*LANDED COST ESTIMATE (FX @ ₦${exchangeRate}/$):*
• International Freight: ${formatNgn(freightCostNgn)} (${formatUsd(freightCostUsd)})
• Handling & Terminal Dues: ${formatNgn(handlingFeeNgn)}
${includeClearing ? `• Statutory Customs Duty (10%): ${formatNgn(customsDutyNgn)}
• Port Levies & Surcharges: ${formatNgn(cissNgn + etlsNgn + portLevyNgn)}
• Import VAT (7.5%) & PAAR: ${formatNgn(vatNgn + clearanceAdminFeeNgn)}\n` : ''}---------------------------------------
*TOTAL LANDED QUOTE: ${formatNgn(totalLandedCostNgn)} (~${formatUsd(totalLandedCostUsd)})*
---------------------------------------
Generated via ${company.name} Automated Rate Engine. Please confirm consolidation space allocation.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappBookingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleCopyShareLink = () => {
    const shareUrl = buildShareUrl(company.slug, {
      service: freightType,
      origin: origin,
      weight: freightType === 'air' ? weightKg : undefined,
      cbm: freightType === 'sea' ? volumeCbm : undefined,
      clearing: includeClearing ? '1' : '0',
      curr: currencyView,
      cat: cargoCategory
    });
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const phoneTarget = company.samplePhone || '2348033045612';
  const whatsappUrl = `https://wa.me/${phoneTarget}?text=${encodeURIComponent(whatsappBookingText)}`;

  const invoiceData = {
    title: `${freightType.toUpperCase()} Freight Quotation & Landing BOQ`,
    subtitle: `Corridor: ${origin} ➔ Lagos • Spec: ${freightType === 'air' ? `${weightKg} KG` : `${volumeCbm} CBM`}`,
    subtotal: freightCostNgn + handlingFeeNgn,
    surcharges: totalClearingNgn,
    vat: Math.round(vatNgn),
    total: totalLandedCostNgn,
    items: [
      {
        name: `International Freight (${freightType.toUpperCase()})`,
        desc: `${origin} to Lagos Cargo Airport/Port (${selectedCat.name})`,
        qty: freightType === 'air' ? `${weightKg} KG` : `${volumeCbm} CBM`,
        rate: freightType === 'air' ? (custom.airRateUsd * selectedCat.airFactor * exchangeRate) : (custom.seaRateUsd * selectedCat.seaFactor * exchangeRate),
        total: freightCostNgn
      },
      {
        name: 'Terminal Handling & Consolidation Charges',
        desc: 'Lagos warehouse handling, security scanning and tallying',
        qty: '1 Consignment',
        rate: handlingFeeNgn,
        total: handlingFeeNgn
      },
      ...(includeClearing ? [
        {
          name: 'Nigeria Customs Statutory Duty (10%)',
          desc: 'Statutory import tariff assessed on CIF landed valuation',
          qty: 'Statutory',
          rate: customsDutyNgn,
          total: customsDutyNgn
        },
        {
          name: 'Port Surcharges (CISS, ETLS, Port Dev Levy)',
          desc: 'Statutory trade levies and port operational surcharges',
          qty: 'Combined',
          rate: cissNgn + etlsNgn + portLevyNgn,
          total: cissNgn + etlsNgn + portLevyNgn
        },
        {
          name: 'PAAR Documentation & Import VAT (7.5%)',
          desc: 'Pre-Arrival Assessment Report processing and statutory Federal VAT',
          qty: 'Standard',
          rate: vatNgn + clearanceAdminFeeNgn,
          total: vatNgn + clearanceAdminFeeNgn
        }
      ] : [])
    ]
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-mono text-slate-900 dark:text-slate-100">
      
      {/* Top Banner: Shipment Cut-Off Countdown (Brutalist) */}
      <div className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-black text-amber-400 dark:bg-amber-500 dark:text-black flex items-center justify-center font-black shrink-0">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">
                Air & Sea Cargo Cut-Off Desk
              </span>
              <span className="text-[11px] px-2 py-0.5 border font-bold uppercase bg-amber-100 text-amber-900 border-amber-500 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-500">
                Weekly Flight LOS-CAN
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400 font-sans mt-0.5">
              Live landed calculation and automated customs clearance booking for <strong className="text-black dark:text-white font-mono">{company.name}</strong>.
            </p>
          </div>
        </div>

        {/* Action Controls: Share Link + Countdown */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="min-h-[44px] px-4 py-2 border-2 border-black dark:border-zinc-700 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            title="Copy sharable URL preserving all current weight, origin and duty parameters"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 dark:text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                <span>Share Quote Link</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5 bg-black text-amber-400 px-3 py-2 font-mono text-xs font-black">
            <span>Cut-Off:</span>
            <span className="tabular-nums">
              {String(timeLeft.days).padStart(2, '0')}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Responsive 12-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Calculator Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-5 sm:p-6 space-y-6">
          
          {/* Mode Switcher: Air vs Sea */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-black/10 dark:border-zinc-800 pb-2">
              <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">
                01 // Select Freight Transit Mode
              </span>
              <span className="text-xs text-slate-500">Air Express vs Sea Container</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFreightType('air')}
                className={`min-h-[44px] p-3.5 border-2 text-left transition-all cursor-pointer ${
                  freightType === 'air'
                    ? 'bg-amber-500 text-black border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-slate-50 dark:bg-zinc-900 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-black dark:hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-black dark:text-amber-400" />
                    <span className="text-xs font-black uppercase">Air Freight Express</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-black text-white px-1.5 py-0.5">3-5 Days</span>
                </div>
                <p className="text-[11px] opacity-80 mt-1 font-sans">
                  Rate from ${custom.airRateUsd}/KG gross. Guangzhou / London / Houston to Lagos.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFreightType('sea')}
                className={`min-h-[44px] p-3.5 border-2 text-left transition-all cursor-pointer ${
                  freightType === 'sea'
                    ? 'bg-amber-500 text-black border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-slate-50 dark:bg-zinc-900 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-black dark:hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ship className="w-4 h-4 text-black dark:text-amber-400" />
                    <span className="text-xs font-black uppercase">Ocean Cargo (CBM)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-black text-white px-1.5 py-0.5">35-45 Days</span>
                </div>
                <p className="text-[11px] opacity-80 mt-1 font-sans">
                  Rate from ${custom.seaRateUsd}/CBM. Bulk groupage and full container load (FCL).
                </p>
              </button>
            </div>
          </div>

          {/* Transit Corridor & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black block mb-2">
                Origin Hub
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full min-h-[44px] bg-slate-50 dark:bg-black border-2 border-black dark:border-zinc-700 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
              >
                <option value="Guangzhou (CAN)">Guangzhou Baiyun (CAN), China</option>
                <option value="Yiwu / Ningbo (NGB)">Yiwu / Ningbo (NGB), China</option>
                <option value="London Heathrow (LHR)">London Heathrow (LHR), UK</option>
                <option value="Houston / JFK (IAH)">Houston / New York (JFK), USA</option>
                <option value="Dubai Cargo Village (DXB)">Dubai Cargo Village (DXB), UAE</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black block mb-2">
                Cargo Classification
              </label>
              <select
                value={cargoCategory}
                onChange={(e) => setCargoCategory(e.target.value)}
                className="w-full min-h-[44px] bg-slate-50 dark:bg-black border-2 border-black dark:border-zinc-700 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
              >
                <option value="general">General Merchandise (1.0x)</option>
                <option value="electronics">Electronics / Battery Goods (+18%)</option>
                <option value="spares">Industrial Tools / Heavy Spares (+10%)</option>
                <option value="fashion">Apparel, Shoes & Textiles (+5%)</option>
              </select>
            </div>
          </div>

          {/* Quantity Slider */}
          <div className="border-2 border-black dark:border-zinc-800 p-4 bg-slate-50 dark:bg-zinc-900 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 dark:border-zinc-800 pb-2">
              <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">
                {freightType === 'air' ? '02 // Consignment Gross Weight' : '02 // Consignment Volume (CBM)'}
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={freightType === 'air' ? 5 : 0.5}
                  max={freightType === 'air' ? 1000 : 65}
                  step={freightType === 'air' ? 5 : 0.5}
                  value={freightType === 'air' ? weightKg : volumeCbm}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (freightType === 'air') setWeightKg(Math.max(1, val));
                    else setVolumeCbm(Math.max(0.1, val));
                  }}
                  className="w-24 min-h-[44px] bg-white dark:bg-black border-2 border-black dark:border-zinc-700 px-3 py-1 text-center font-mono text-sm font-bold text-slate-900 dark:text-white"
                />
                <span className="text-xs font-bold uppercase">{freightType === 'air' ? 'KG Gross' : 'CBM Vol'}</span>
              </div>
            </div>

            <input
              type="range"
              min={freightType === 'air' ? 5 : 0.5}
              max={freightType === 'air' ? 500 : 40}
              step={freightType === 'air' ? 5 : 0.5}
              value={freightType === 'air' ? weightKg : volumeCbm}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (freightType === 'air') setWeightKg(val);
                else setVolumeCbm(val);
              }}
              className="w-full accent-amber-500 cursor-pointer h-3 bg-slate-300 dark:bg-zinc-800 border border-black dark:border-zinc-700 appearance-none"
            />
          </div>

          {/* Customs Tariff Matrix (Horizontal Scrollable) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">
                Customs Tariff Formulations
              </span>
              <button
                type="button"
                onClick={() => setIncludeClearing(!includeClearing)}
                className={`text-xs px-2.5 py-1 border font-bold uppercase cursor-pointer ${
                  includeClearing ? 'bg-emerald-600 text-white border-black' : 'bg-slate-200 text-slate-700 border-slate-400'
                }`}
              >
                {includeClearing ? '✓ Clearing Included' : 'Freight Only'}
              </button>
            </div>
            <div className="w-full overflow-x-auto border-2 border-black dark:border-zinc-800">
              <table className="w-full min-w-max text-left text-xs font-mono">
                <thead className="bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 uppercase text-[10px] border-b border-black dark:border-zinc-800">
                  <tr>
                    <th className="p-2.5">Statutory Surcharge</th>
                    <th className="p-2.5 text-center">NCS Tariff Rate</th>
                    <th className="p-2.5 text-right">Estimated Cost (₦)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-900 text-slate-800 dark:text-zinc-200">
                  <tr>
                    <td className="p-2.5">Customs Statutory Import Duty</td>
                    <td className="p-2.5 text-center font-bold">10.0% of CIF</td>
                    <td className="p-2.5 text-right tabular-nums font-bold">{formatNgn(customsDutyNgn)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Comprehensive Import Supervision (CISS)</td>
                    <td className="p-2.5 text-center">1.0% FOB</td>
                    <td className="p-2.5 text-right tabular-nums">{formatNgn(cissNgn)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">ECOWAS Trade Liberalization (ETLS)</td>
                    <td className="p-2.5 text-center">0.5% CIF</td>
                    <td className="p-2.5 text-right tabular-nums">{formatNgn(etlsNgn)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Port Development Surcharge</td>
                    <td className="p-2.5 text-center">7.0% of Duty</td>
                    <td className="p-2.5 text-right tabular-nums">{formatNgn(portLevyNgn)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Federal Import VAT</td>
                    <td className="p-2.5 text-center">7.5% Tax</td>
                    <td className="p-2.5 text-right tabular-nums">{formatNgn(vatNgn)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Formal Quote Card & WhatsApp Dispatch (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] relative">
            
            <div className="space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-zinc-800">
                <div>
                  <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">
                    Official Freight Quotation
                  </span>
                  <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white">
                    {company.name} Desk
                  </h3>
                </div>

                {/* Currency Switcher */}
                <div className="flex border border-black dark:border-zinc-700">
                  <button
                    type="button"
                    onClick={() => setCurrencyView('NGN')}
                    className={`px-3 py-1 text-xs font-bold ${
                      currencyView === 'NGN' ? 'bg-amber-500 text-black font-black' : 'bg-slate-100 text-slate-700 dark:bg-zinc-900 dark:text-zinc-300'
                    }`}
                  >
                    NGN
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrencyView('USD')}
                    className={`px-3 py-1 text-xs font-bold ${
                      currencyView === 'USD' ? 'bg-amber-500 text-black font-black' : 'bg-slate-100 text-slate-700 dark:bg-zinc-900 dark:text-zinc-300'
                    }`}
                  >
                    USD
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-slate-700 dark:text-zinc-300">
                  <div>
                    <span className="text-xs text-slate-500 block">Core Freight ({freightType.toUpperCase()})</span>
                    <span className="text-[11px] text-slate-400 font-sans">{origin.split('(')[0]} ➔ Lagos</span>
                  </div>
                  <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                    {currencyView === 'NGN' ? formatNgn(freightCostNgn) : formatUsd(freightCostUsd)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-700 dark:text-zinc-300">
                  <div>
                    <span className="text-xs text-slate-500 block">Terminal Dues & Security</span>
                    <span className="text-[11px] text-slate-400 font-sans">Lagos Airport/Port tally</span>
                  </div>
                  <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                    {currencyView === 'NGN' ? formatNgn(handlingFeeNgn) : formatUsd(handlingFeeNgn / exchangeRate)}
                  </span>
                </div>

                {includeClearing && (
                  <div className="flex justify-between items-center text-slate-700 dark:text-zinc-300 pt-2 border-t border-slate-200 dark:border-zinc-800">
                    <div>
                      <span className="text-xs text-slate-500 block">Nigeria Customs Statutory Clearing</span>
                      <span className="text-[11px] text-slate-400 font-sans">Duty + Surcharges + VAT</span>
                    </div>
                    <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                      {currencyView === 'NGN' ? formatNgn(totalClearingNgn) : formatUsd(totalClearingNgn / exchangeRate)}
                    </span>
                  </div>
                )}
              </div>

              {/* Total Landed Cost Card */}
              <div className="bg-slate-50 dark:bg-black border-2 border-black dark:border-amber-500 p-4 space-y-1">
                <span className="text-xs uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 block">
                  Total Landed Cost Estimate
                </span>
                <div className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
                  {currencyView === 'NGN' ? formatNgn(totalLandedCostNgn) : formatUsd(totalLandedCostUsd)}
                </div>
                <p className="text-[10px] text-slate-500 pt-1 font-sans">
                  *Official FX rate locked at ₦{exchangeRate}/$ for active session.
                </p>
              </div>

              {/* Action Buttons (All min-h-[44px]) */}
              <div className="space-y-2 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-4 flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch Booking via WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
                </a>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWhatsAppSimOpen(true)}
                    className="min-h-[44px] bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-900 dark:text-white text-xs font-bold py-2.5 px-3 border border-black dark:border-zinc-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>WhatsApp Simulator</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsInvoiceOpen(true)}
                    className="min-h-[44px] bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-900 dark:text-white text-xs font-bold py-2.5 px-3 border border-black dark:border-zinc-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Proforma PDF</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="min-h-[44px] bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-900 dark:text-white font-mono text-xs font-bold py-2.5 px-3 border border-black dark:border-zinc-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700 dark:text-emerald-400">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                        <span>Copy Quote Link</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="min-h-[44px] bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-900 dark:text-white font-mono text-xs font-bold py-2.5 px-3 border border-black dark:border-zinc-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700 dark:text-emerald-400">Payload Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                        <span>Copy Raw Payload</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Desk Information Footer */}
              <div className="pt-3 border-t border-black/10 dark:border-zinc-800 text-xs text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {company.location}
                </span>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold uppercase">
                  Rate Engine Active
                </span>
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

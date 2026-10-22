import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Wrench, 
  Fuel, 
  FileCheck, 
  Download, 
  Send, 
  ExternalLink, 
  Copy, 
  Check, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Sliders, 
  Sparkles,
  Lock,
  Unlock,
  ChevronRight,
  Smartphone,
  Printer,
  Link2
} from 'lucide-react';
import WhatsAppSimulatorModal from '../common/WhatsAppSimulatorModal';
import ProformaInvoiceModal from '../common/ProformaInvoiceModal';
import { getHashParams, updateHashParams, buildShareUrl } from '../../utils/urlState';

export default function HeavyEquipmentRFQPortal({ company }) {
  const custom = company?.customMetrics || {
    craneDailyRateNgn: 450000,
    excavatorDailyRateNgn: 320000,
    generatorDailyRateNgn: 180000,
    wetLeaseFuelMultiplier: 1.38,
    mobMainlandNgn: 180000,
    mobIslandNgn: 260000,
    mobRefineryNgn: 480000,
    weeklyDiscount: 0.10,
    monthlyDiscount: 0.22
  };

  // Fleet Catalog
  const fleetCatalog = {
    crane: {
      name: '50-Ton Mobile Telescopic Crane',
      model: 'Liebherr LTM 1050-3.1 / Tadano GT-550E',
      dailyRate: custom.craneDailyRateNgn || 450000,
      specs: '38m Main Boom + 16m Fly Jib, 3-Axle All-Terrain, 12.5T Counterweight',
      operatorCertification: 'Factory Certified Rigging Crew (Level 3 LEEA Certified)',
      fuelConsumptionLitresPerDay: 140,
      availability: 'Immediate (Ikeja Yard)'
    },
    excavator: {
      name: '30-Ton Hydraulic Crawler Excavator',
      model: 'Caterpillar 330D2L / Komatsu PC300-8',
      dailyRate: custom.excavatorDailyRateNgn || 320000,
      specs: '1.8 m³ Heavy-Duty Rock Bucket, Auxiliary Piping for Hydraulic Hammer',
      operatorCertification: 'Civil Site Operator (10+ Yrs Oilfield & Trenching Experience)',
      fuelConsumptionLitresPerDay: 190,
      availability: '2 Units Active in Lagos'
    },
    generator: {
      name: '500kVA Silent Soundproof Power Plant',
      model: 'Cummins QSK19 / Perkins Olympian Power',
      dailyRate: custom.generatorDailyRateNgn || 180000,
      specs: '400V/50Hz Synchronized, 68 dB(A) @ 7m Acoustic Canopy, 1,000L Bunded Tank',
      operatorCertification: '24/7 Dedicated Electrical Maintenance Technician',
      fuelConsumptionLitresPerDay: 260,
      availability: 'Immediate Dispatch'
    },
    trailer: {
      name: '60-Ton Multi-Axle Lowbed Heavy Hauler',
      model: 'Mack Titan Prime Mover + Faymonville MultiMAX',
      dailyRate: 280000,
      specs: 'Hydraulic Folding Ramps, Outriggers for Over-Width Loads, Air Suspension',
      operatorCertification: 'Heavy Haulage Certified Route Pilot Driver',
      fuelConsumptionLitresPerDay: 120,
      availability: 'Available (Apapa Corridor)'
    },
    staging: {
      name: 'Heavy-Duty Modular Scaffolding & Concert Rigging',
      model: 'Layher Allround Ringlock System / Prolyte Trussing',
      dailyRate: 210000,
      specs: 'Load Capacity 450kg/m², Galvanized High-Tensile Steel, Wind Rated to 110km/h',
      operatorCertification: 'Certified Riggers & Scaffolding Inspectors (CISRS Standard)',
      fuelConsumptionLitresPerDay: 0,
      availability: 'Immediate (Island Base)'
    }
  };

  // Lagos & Offshore Mobilization Zones
  const mobilizationZones = {
    mainland: {
      name: 'Lagos Mainland Industrial (Ikeja, Oshodi, Agbara, Ikorodu)',
      cost: custom.mobMainlandNgn || 180000,
      lowbedTrips: 1,
      escortRequired: false
    },
    island: {
      name: 'Lagos Island & Lekki Commercial (Ikoyi, VI, Lekki Phase 1)',
      cost: custom.mobIslandNgn || 260000,
      lowbedTrips: 1,
      escortRequired: true
    },
    refinery: {
      name: 'Dangote Refinery / Lekki Free Trade Zone Corridor',
      cost: custom.mobRefineryNgn || 480000,
      lowbedTrips: 1,
      escortRequired: true
    },
    offshore: {
      name: 'Deepwater & Escravos Offshore Terminal Staging',
      cost: 950000,
      lowbedTrips: 2,
      escortRequired: true
    }
  };

  // Read initial configuration from URL params
  const initialParams = getHashParams();

  // State
  const [selectedCategory, setSelectedCategory] = useState(
    initialParams.cat && fleetCatalog[initialParams.cat] ? initialParams.cat : 'crane'
  );
  const [leaseType, setLeaseType] = useState(
    initialParams.lease === 'dry' ? 'dry' : 'wet'
  );
  const [durationDays, setDurationDays] = useState(
    initialParams.days ? Math.max(1, Math.min(90, Number(initialParams.days))) : 7
  );
  const [mobilizationZone, setMobilizationZone] = useState(
    initialParams.zone && mobilizationZones[initialParams.zone] ? initialParams.zone : 'island'
  );
  const [rcNumber, setRcNumber] = useState('');
  const [procurementEmail, setProcurementEmail] = useState('');
  const [specSheetUnlocked, setSpecSheetUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isWhatsAppSimOpen, setIsWhatsAppSimOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Sync state to URL hash query parameters on change
  useEffect(() => {
    updateHashParams({
      cat: selectedCategory,
      lease: leaseType,
      days: durationDays,
      zone: mobilizationZone
    }, company?.slug);
  }, [selectedCategory, leaseType, durationDays, mobilizationZone, company?.slug]);

  const selectedMachine = fleetCatalog[selectedCategory] || fleetCatalog.crane;
  const selectedZone = mobilizationZones[mobilizationZone] || mobilizationZones.island;

  // Rate Multipliers
  const wetLeaseMultiplier = leaseType === 'wet' ? (custom.wetLeaseFuelMultiplier || 1.38) : 1.0;
  const baseDayRate = selectedMachine.dailyRate * wetLeaseMultiplier;

  // Duration Discounts
  let durationDiscountPct = 0;
  if (durationDays >= 30) {
    durationDiscountPct = custom.monthlyDiscount || 0.22;
  } else if (durationDays >= 7) {
    durationDiscountPct = custom.weeklyDiscount || 0.10;
  }

  const discountedDayRate = baseDayRate * (1 - durationDiscountPct);
  const totalMachineRentalNgn = discountedDayRate * durationDays;
  const mobilizationTotalNgn = selectedZone.cost * 1.8;
  const siteWaiverNgn = totalMachineRentalNgn * 0.035;
  const totalContractNgn = totalMachineRentalNgn + mobilizationTotalNgn + siteWaiverNgn;

  const formatNgn = (val) => `₦${Math.round(val).toLocaleString()}`;

  const handleUnlockSpecSheet = (e) => {
    e.preventDefault();
    if (rcNumber.trim().length > 3) {
      setSpecSheetUnlocked(true);
    }
  };

  // WhatsApp RFQ Payload
  const whatsappRfqText = `*HEAVY EQUIPMENT ENTERPRISE RFQ // ${company.name.toUpperCase()}*
---------------------------------------
• Equipment: ${selectedMachine.name}
• Model: ${selectedMachine.model}
• Lease Format: ${leaseType === 'wet' ? 'WET LEASE (Certified Operator + Diesel Fuel Supply)' : 'DRY LEASE (Machine Only)'}
• Hire Duration: ${durationDays} Calendar Days (${durationDiscountPct > 0 ? `${Math.round(durationDiscountPct * 100)}% Volume Discount Applied` : 'Standard Day Rate'})
• Site Mobilization Zone: ${selectedZone.name}
• Operator Requirement: ${selectedMachine.operatorCertification}
---------------------------------------
*ESTIMATED CONTRACT VALUE:*
• Equipment Day Rate: ${formatNgn(discountedDayRate)} / day
• Base Machine Lease (${durationDays} days): ${formatNgn(totalMachineRentalNgn)}
• Roundtrip Lowbed Mobilization: ${formatNgn(mobilizationTotalNgn)}
• Site Plant Insurance Waiver (3.5%): ${formatNgn(siteWaiverNgn)}
---------------------------------------
*TOTAL PROJECT RFQ DISPATCH: ${formatNgn(totalContractNgn)}*
${rcNumber ? `• Verified Client CAC / RC Number: ${rcNumber}\n` : ''}---------------------------------------
Generated via ${company.name} Heavy Equipment RFQ Portal. Requesting formal proforma invoice & site inspection dispatch.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappRfqText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleCopyShareLink = () => {
    const shareUrl = buildShareUrl(company.slug, {
      cat: selectedCategory,
      lease: leaseType,
      days: durationDays,
      zone: mobilizationZone
    });
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const phoneTarget = company.samplePhone || '2348033045612';
  const whatsappUrl = `https://wa.me/${phoneTarget}?text=${encodeURIComponent(whatsappRfqText)}`;

  const invoiceData = {
    title: `${selectedMachine.name} Turnkey Lease Quotation`,
    subtitle: `Asset: ${selectedMachine.model} • ${leaseType.toUpperCase()} LEASE (${durationDays} Days) • ${selectedZone.name.split('(')[0]}`,
    subtotal: totalMachineRentalNgn,
    surcharges: mobilizationTotalNgn + siteWaiverNgn,
    vat: Math.round(totalContractNgn * 0.075),
    total: totalContractNgn + Math.round(totalContractNgn * 0.075),
    items: [
      {
        name: `Plant Asset Hire: ${selectedMachine.name}`,
        desc: `${selectedMachine.model} (${durationDays} days @ ${formatNgn(discountedDayRate)}/day, ${leaseType.toUpperCase()} format)`,
        qty: `${durationDays} Days`,
        rate: discountedDayRate,
        total: totalMachineRentalNgn
      },
      {
        name: 'Roundtrip Multi-Axle Lowbed Mobilization & Demobilization',
        desc: `${selectedZone.name} delivery, heavy haulage route pilot escort and return logistics`,
        qty: 'Two-Way Haulage',
        rate: mobilizationTotalNgn,
        total: mobilizationTotalNgn
      },
      {
        name: 'Site Plant Damage Waiver & Mechanical Insurance',
        desc: '3.5% statutory equipment risk mitigation and certified operator safety indemnity',
        qty: 'Comprehensive',
        rate: siteWaiverNgn,
        total: siteWaiverNgn
      }
    ]
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-mono text-slate-900 dark:text-slate-100">
      
      {/* Top Banner: Industrial Heavy Plant Terminal (Brutalist) */}
      <div className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-black text-yellow-400 dark:bg-yellow-500 dark:text-black flex items-center justify-center font-black shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-yellow-600 dark:text-yellow-400 font-black">
                Industrial Fleet Portal
              </span>
              <span className="text-[11px] px-2 py-0.5 border font-bold uppercase bg-yellow-100 text-yellow-900 border-yellow-500 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-500">
                Lagos Certified Plant
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400 font-sans mt-0.5">
              Wet/Dry lease calculator, lowbed mobilization & technical load charts for <strong className="text-black dark:text-white font-mono">{company.name}</strong>.
            </p>
          </div>
        </div>

        {/* Action Controls: Share Link */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="min-h-[44px] px-4 py-2 border-2 border-black dark:border-zinc-700 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            title="Copy sharable URL preserving all current machinery and mobilization parameters"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 dark:text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                <span>Share Spec Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Responsive 12-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Equipment Customizer (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-5 sm:p-6 space-y-6">
          
          {/* Step 1: Machinery Selection */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-black/10 dark:border-zinc-800 pb-2">
              <span className="text-xs uppercase tracking-widest text-yellow-600 dark:text-yellow-400 font-black">
                01 // Select Plant & Machinery Fleet Asset
              </span>
              <span className="text-xs text-slate-500">Fleet Availability</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(fleetCatalog).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedCategory(key)}
                  className={`min-h-[44px] p-3 border-2 text-left transition-all cursor-pointer ${
                    selectedCategory === key
                      ? 'bg-yellow-500 text-black border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-slate-50 dark:bg-zinc-900 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-black dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-tight">{item.name.split('/')[0]}</span>
                    {selectedCategory === key && <Check className="w-4 h-4 text-black shrink-0" />}
                  </div>
                  <span className="text-[10px] font-mono block opacity-80 mt-1">{item.model}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Wet vs Dry Lease Switch */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-black/10 dark:border-zinc-800 pb-2">
              <span className="text-xs uppercase tracking-widest text-yellow-600 dark:text-yellow-400 font-black">
                02 // Lease Framework Structure
              </span>
              <span className="text-xs text-slate-500">Fuel & Operator Options</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLeaseType('wet')}
                className={`min-h-[44px] p-3.5 border-2 text-left transition-all cursor-pointer ${
                  leaseType === 'wet'
                    ? 'bg-yellow-500 text-black border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-slate-50 dark:bg-zinc-900 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-black dark:hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-black dark:text-yellow-400" />
                    <span className="text-xs font-black uppercase">Wet Lease Turnkey</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-black text-white px-1.5 py-0.5">Recommended</span>
                </div>
                <p className="text-[11px] opacity-80 mt-1 font-sans">
                  Includes certified operator, diesel supply ({selectedMachine.fuelConsumptionLitresPerDay}L/day) & routine maintenance.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setLeaseType('dry')}
                className={`min-h-[44px] p-3.5 border-2 text-left transition-all cursor-pointer ${
                  leaseType === 'dry'
                    ? 'bg-yellow-500 text-black border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-slate-50 dark:bg-zinc-900 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-black dark:hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-black dark:text-yellow-400" />
                    <span className="text-xs font-black uppercase">Dry Lease (Machine Only)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-black text-white px-1.5 py-0.5">Base Rate</span>
                </div>
                <p className="text-[11px] opacity-80 mt-1 font-sans">
                  Machine only. Hirer provides diesel, certified operator and site insurance indemnity.
                </p>
              </button>
            </div>
          </div>

          {/* Step 3: Duration Slider */}
          <div className="border-2 border-black dark:border-zinc-800 p-4 bg-slate-50 dark:bg-zinc-900 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 dark:border-zinc-800 pb-2">
              <span className="text-xs uppercase tracking-widest text-yellow-600 dark:text-yellow-400 font-black">
                03 // Contract Lease Duration
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Math.max(1, Math.min(90, Number(e.target.value))))}
                  className="w-20 min-h-[44px] bg-white dark:bg-black border-2 border-black dark:border-zinc-700 px-3 py-1 text-center font-mono text-sm font-bold text-slate-900 dark:text-white"
                />
                <span className="text-xs font-bold uppercase">Days</span>
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="60"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full accent-yellow-500 cursor-pointer h-3 bg-slate-300 dark:bg-zinc-800 border border-black dark:border-zinc-700 appearance-none"
            />
          </div>

          {/* Fleet Comparison Matrix Table (Horizontal Scrollable) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-yellow-600 dark:text-yellow-400 font-black">
                Fleet Availability & Spec Matrix
              </span>
              <span className="text-xs text-slate-500">Live Yard Inventory</span>
            </div>
            <div className="w-full overflow-x-auto border-2 border-black dark:border-zinc-800">
              <table className="w-full min-w-max text-left text-xs font-mono">
                <thead className="bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 uppercase text-[10px] border-b border-black dark:border-zinc-800">
                  <tr>
                    <th className="p-2.5">Asset Class</th>
                    <th className="p-2.5">Model / Rating</th>
                    <th className="p-2.5 text-center">Crew Standard</th>
                    <th className="p-2.5 text-right">Day Rate (₦)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-900 text-slate-800 dark:text-zinc-200">
                  {Object.entries(fleetCatalog).map(([k, itm]) => {
                    const isSelected = selectedCategory === k;
                    return (
                      <tr key={k} className={isSelected ? 'bg-yellow-50 dark:bg-yellow-950/40 font-bold' : ''}>
                        <td className="p-2.5">
                          {itm.name}
                          {isSelected && <span className="ml-2 text-[10px] text-yellow-600 font-black">← Active</span>}
                        </td>
                        <td className="p-2.5 font-sans text-[11px] text-slate-500 dark:text-zinc-400">{itm.model}</td>
                        <td className="p-2.5 text-center text-[10px]">{itm.operatorCertification.split('(')[0]}</td>
                        <td className="p-2.5 text-right tabular-nums font-bold text-yellow-700 dark:text-yellow-400">
                          {formatNgn(itm.dailyRate)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Step 4: Mobilization Zones */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-black/10 dark:border-zinc-800 pb-2">
              <span className="text-xs uppercase tracking-widest text-yellow-600 dark:text-yellow-400 font-black">
                04 // Mobilization Radius & Lowbed Transit
              </span>
              <span className="text-xs text-slate-500">Site Location</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(mobilizationZones).map(([key, zone]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMobilizationZone(key)}
                  className={`min-h-[44px] p-3 border-2 text-left text-xs transition-all cursor-pointer ${
                    mobilizationZone === key
                      ? 'bg-yellow-500 text-black border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-slate-50 dark:bg-zinc-900 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-black dark:hover:border-zinc-600'
                  }`}
                >
                  <span className="block font-bold">{zone.name.split('(')[0]}</span>
                  <span className="text-[11px] font-mono block mt-1 tabular-nums">
                    {formatNgn(zone.cost * 1.8)} (Roundtrip Lowbed)
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 5: Gated Technical Spec Sheet */}
          <div className="border-2 border-black dark:border-zinc-800 p-4 bg-slate-50 dark:bg-zinc-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-yellow-600 dark:text-yellow-400 font-black flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                05 // Gated Technical Load Chart & Certs
              </span>
              <span className="text-xs text-slate-500">RC Verification</span>
            </div>

            {!specSheetUnlocked ? (
              <form onSubmit={handleUnlockSpecSheet} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Company RC / CAC (e.g. RC-184920)"
                    value={rcNumber}
                    onChange={(e) => setRcNumber(e.target.value)}
                    className="min-h-[44px] bg-white dark:bg-black border-2 border-black dark:border-zinc-700 px-3 py-2 text-xs font-mono"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Procurement Email"
                    value={procurementEmail}
                    onChange={(e) => setProcurementEmail(e.target.value)}
                    className="min-h-[44px] bg-white dark:bg-black border-2 border-black dark:border-zinc-700 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="min-h-[44px] w-full bg-black text-yellow-400 dark:bg-yellow-500 dark:text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Unlock Technical Spec-Sheet PDF</span>
                </button>
              </form>
            ) : (
              <div className="bg-emerald-100 dark:bg-emerald-950 border border-emerald-500 p-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>LEEA Rigging Cert Unlocked for RC: {rcNumber}</span>
                <span className="text-emerald-600">✓ Verified</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Commercial RFQ Summary & WhatsApp Dispatch (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] relative">
            
            <div className="space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-zinc-800">
                <div>
                  <span className="text-xs uppercase tracking-widest text-yellow-600 dark:text-yellow-400 font-black">
                    Commercial Lease RFQ
                  </span>
                  <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white">
                    {company.name} Hire
                  </h3>
                </div>
                <span className="text-xs font-mono bg-black text-yellow-400 px-3 py-1 font-black">
                  {durationDays} Days Hire
                </span>
              </div>

              {/* Machinery Selected */}
              <div className="border border-slate-200 dark:border-zinc-800 p-3.5 space-y-1">
                <span className="text-[10px] text-yellow-600 dark:text-yellow-400 uppercase font-black block">Selected Plant Asset</span>
                <span className="text-sm font-black uppercase text-slate-900 dark:text-white block">{selectedMachine.name}</span>
                <span className="text-xs text-slate-500 block font-mono">{selectedMachine.model}</span>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-zinc-900 font-sans">{selectedMachine.specs}</p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-slate-700 dark:text-zinc-300">
                  <div>
                    <span className="text-xs text-slate-500 block">Daily Machine Rate</span>
                    <span className="text-[11px] text-slate-400 font-sans">{leaseType.toUpperCase()} LEASE</span>
                  </div>
                  <span className="font-mono font-bold text-yellow-600 dark:text-yellow-400 text-base tabular-nums">
                    {formatNgn(discountedDayRate)} <span className="text-xs text-slate-500 font-normal">/ day</span>
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-700 dark:text-zinc-300">
                  <div>
                    <span className="text-xs text-slate-500 block">Plant Rental ({durationDays} Days)</span>
                    <span className="text-[11px] text-slate-400 font-sans">Base equipment hire</span>
                  </div>
                  <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">{formatNgn(totalMachineRentalNgn)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-700 dark:text-zinc-300">
                  <div>
                    <span className="text-xs text-slate-500 block">Lowbed Mobilization</span>
                    <span className="text-[11px] text-slate-400 font-sans">{selectedZone.name.split('(')[0]}</span>
                  </div>
                  <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">{formatNgn(mobilizationTotalNgn)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-700 dark:text-zinc-300">
                  <div>
                    <span className="text-xs text-slate-500 block">Plant Damage Risk Waiver</span>
                    <span className="text-[11px] text-slate-400 font-sans">3.5% statutory equipment bond</span>
                  </div>
                  <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">{formatNgn(siteWaiverNgn)}</span>
                </div>
              </div>

              {/* Total RFQ Estimate Card */}
              <div className="bg-slate-50 dark:bg-black border-2 border-black dark:border-yellow-500 p-4 space-y-1">
                <span className="text-xs uppercase tracking-wider font-bold text-yellow-600 dark:text-yellow-400 block">
                  Total Estimated Contract Value
                </span>
                <div className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
                  {formatNgn(totalContractNgn)}
                </div>
                <p className="text-[10px] text-slate-500 pt-1 font-sans">
                  *Includes operator allowances, scheduled oil changes, and mobilization permits.
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
                  <span>Dispatch RFQ to Fleet Desk</span>
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
                    <Printer className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
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
                        <span className="text-emerald-700 dark:text-emerald-400">RFQ Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                        <span>Copy Raw RFQ</span>
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
                <span className="font-mono text-yellow-600 dark:text-yellow-400 font-bold uppercase">
                  ISO 9001 Safety Compliant
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
        payloadText={whatsappRfqText}
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

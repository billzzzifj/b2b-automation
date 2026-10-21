import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';

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

  // State
  const [selectedCategory, setSelectedCategory] = useState('crane'); // 'crane' | 'excavator' | 'generator' | 'trailer' | 'staging'
  const [leaseType, setLeaseType] = useState('wet'); // 'wet' | 'dry'
  const [durationDays, setDurationDays] = useState(7);
  const [mobilizationZone, setMobilizationZone] = useState('island'); // 'mainland' | 'island' | 'refinery' | 'offshore'
  const [rcNumber, setRcNumber] = useState('');
  const [procurementEmail, setProcurementEmail] = useState('');
  const [specSheetUnlocked, setSpecSheetUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);

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
      name: 'Offshore Shallow-Water Barge / Escravos / Niger Delta Riverine',
      cost: 950000,
      lowbedTrips: 2,
      escortRequired: true
    }
  };

  const selectedMachine = fleetCatalog[selectedCategory];
  const selectedZone = mobilizationZones[mobilizationZone];

  // Duration discounts
  let durationDiscountPct = 0;
  if (durationDays >= 30) {
    durationDiscountPct = custom.monthlyDiscount || 0.22; // 22% monthly discount
  } else if (durationDays >= 7) {
    durationDiscountPct = custom.weeklyDiscount || 0.10; // 10% weekly discount
  }

  // Daily rate math
  const baseDayRate = selectedMachine.dailyRate;
  const effectiveDayRate = leaseType === 'wet'
    ? baseDayRate * (custom.wetLeaseFuelMultiplier || 1.38)
    : baseDayRate;

  const discountedDayRate = effectiveDayRate * (1 - durationDiscountPct);
  const totalMachineRentalNgn = discountedDayRate * durationDays;

  // Mobilization logistics (Two-way mobilization and demobilization)
  const mobilizationTotalNgn = selectedZone.cost * 1.8; // roundtrip delivery & return

  // Insurance & site risk bond (3% statutory site damage waiver)
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

  const phoneTarget = company.samplePhone || '2348029988776';
  const whatsappUrl = `https://wa.me/${phoneTarget}?text=${encodeURIComponent(whatsappRfqText)}`;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner: Industrial Heavy Plant Terminal */}
      <div className="bg-amber-50/70 dark:bg-[#101216] border border-amber-200 dark:border-amber-500/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-200 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-600 dark:text-yellow-500">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-yellow-700 dark:text-yellow-500 font-bold">Industrial Fleet Portal</span>
              <span className="text-[10px] font-mono bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300 px-2 py-0.5 rounded border border-yellow-200 dark:border-yellow-500/40 font-semibold">
                Lagos Certified Machinery
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Wet/Dry lease calculator, lowbed mobilization & technical spec sheets for <strong className="text-yellow-800 dark:text-yellow-400">{company.name}</strong>.
            </p>
          </div>
        </div>

        {/* Live Availability Status */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono shadow-sm dark:shadow-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-500 dark:text-slate-400">Status:</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">{selectedMachine.availability}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Fleet Selection & Configuration (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#11141B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl dark:shadow-2xl transition-colors duration-200">
          
          {/* Machine Category Matrix */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-yellow-700 dark:text-yellow-500 uppercase tracking-widest font-bold">
                01 // Select Plant Machinery
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Heavy plant categories</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {Object.entries(fleetCatalog).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedCategory(key)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedCategory === key
                      ? 'bg-yellow-50 border-yellow-500 text-slate-900 dark:bg-yellow-500/10 dark:border-yellow-500 dark:text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{item.name.split(' ')[0]} {item.name.split(' ')[1]}</span>
                    {selectedCategory === key && <Check className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />}
                  </div>
                  <span className="text-[11px] font-mono text-yellow-700 dark:text-yellow-500 block mt-1 font-bold">
                    {formatNgn(item.dailyRate)}/day
                  </span>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.model}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Wet Lease vs Dry Lease Mode Switcher */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-yellow-700 dark:text-yellow-500 uppercase tracking-widest font-bold">
                02 // Lease Framework (Wet vs Dry)
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Operator & fuel allocation</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLeaseType('wet')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  leaseType === 'wet'
                    ? 'bg-yellow-50 border-yellow-500 text-slate-900 dark:bg-yellow-500/10 dark:border-yellow-500 dark:text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-yellow-800 dark:text-yellow-400 flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    Turnkey Wet Lease
                  </span>
                  <span className="text-[10px] font-mono bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300 px-1.5 py-0.5 rounded font-semibold">Recommended</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                  Includes certified operator, continuous on-site diesel supply ({selectedMachine.fuelConsumptionLitresPerDay}L/day), and maintenance coverage.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setLeaseType('dry')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  leaseType === 'dry'
                    ? 'bg-yellow-50 border-yellow-500 text-slate-900 dark:bg-yellow-500/10 dark:border-yellow-500 dark:text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    Machine Dry Lease
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Machine Only</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Bare equipment only. Client provides licensed operator, daily AGO fueling, and routine consumable top-ups.
                </p>
              </button>
            </div>
          </div>

          {/* Duration Selector & Volume Tiering */}
          <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-yellow-700 dark:text-yellow-500 uppercase tracking-widest font-bold block">
                  03 // Rental Duration (Days)
                </span>
                <span className="text-[11px] text-slate-500">Weekly (7+ days: 10% off) • Monthly (30+ days: 22% off)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg shadow-sm">
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Math.max(1, Number(e.target.value)))}
                  className="w-16 bg-transparent text-right font-mono text-sm font-bold text-yellow-700 dark:text-yellow-400 focus:outline-none"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Days</span>
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="60"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full accent-yellow-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
            />

            {/* Quick Presets */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {[
                { label: '3 Days (Spot)', days: 3 },
                { label: '7 Days (Weekly -10%)', days: 7 },
                { label: '14 Days (Bi-Weekly)', days: 14 },
                { label: '30 Days (Monthly -22%)', days: 30 },
                { label: '60 Days (Project)', days: 60 },
              ].map(item => (
                <button
                  key={item.days}
                  type="button"
                  onClick={() => setDurationDays(item.days)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    durationDays === item.days
                      ? 'bg-yellow-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lagos / Offshore Mobilization Zones */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-yellow-700 dark:text-yellow-500 uppercase tracking-widest font-bold">
                04 // Mobilization Radius & Lowbed Transit
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Site location in Lagos/Niger Delta</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(mobilizationZones).map(([key, zone]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMobilizationZone(key)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    mobilizationZone === key
                      ? 'bg-yellow-50 border-yellow-500 text-slate-900 dark:bg-yellow-500/10 dark:border-yellow-500 dark:text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{zone.name.split('(')[0]}</span>
                    <span className="font-mono text-yellow-700 dark:text-yellow-500 font-bold">{formatNgn(zone.cost * 1.8)}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Roundtrip lowbed carrier mobilization</p>
                </button>
              ))}
            </div>
          </div>

          {/* Gated Technical Spec-Sheet Unlock */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-yellow-700 dark:text-yellow-500 uppercase tracking-widest font-bold flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                05 // Gated Technical Load Chart & Inspection Certs
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Corporate verification</span>
            </div>

            {!specSheetUnlocked ? (
              <form onSubmit={handleUnlockSpecSheet} className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <Lock className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                  <span>Enter your Corporate CAC / RC Number to unlock full OEM calibration certificates:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Company RC / CAC Number (e.g. RC-184920)"
                    value={rcNumber}
                    onChange={(e) => setRcNumber(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-yellow-500 font-mono shadow-sm"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Procurement Officer Work Email"
                    value={procurementEmail}
                    onChange={(e) => setProcurementEmail(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-yellow-500 font-mono shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Unlock Technical Spec-Sheet PDF</span>
                </button>
              </form>
            ) : (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/40 p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                      OEM Calibration Chart & LEEA Rigging Certificate Unlocked
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                      Verified for: {rcNumber} ({procurementEmail || 'corporate'})
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Simulating PDF Download: ${selectedMachine.model} Load Chart.pdf`)}
                  className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-1.5 font-mono shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-500" />
                  <span>Download PDF</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Commercial RFQ Summary & WhatsApp Dispatch (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-[#12151D] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl dark:shadow-2xl relative transition-colors duration-200">
            
            <div className="space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-yellow-700 dark:text-yellow-500 font-bold">Commercial RFQ Summary</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {company.name} Hire Sheet
                  </h3>
                </div>
                <span className="text-xs font-mono bg-yellow-500 text-slate-950 px-2.5 py-1 rounded-lg font-black shadow-sm">
                  {durationDays} Days Hire
                </span>
              </div>

              {/* Machinery Header Box */}
              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
                <span className="text-[10px] font-mono text-yellow-700 dark:text-yellow-500 uppercase tracking-widest block font-bold">Selected Fleet Asset</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block">{selectedMachine.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-mono">{selectedMachine.model}</span>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-900">{selectedMachine.specs}</p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Daily Machine Hire Rate</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">{leaseType.toUpperCase()} LEASE {durationDiscountPct > 0 ? `(${Math.round(durationDiscountPct * 100)}% off)` : ''}</span>
                  </div>
                  <span className="font-mono font-bold text-yellow-700 dark:text-yellow-400 text-base tabular-nums">
                    {formatNgn(discountedDayRate)} <span className="text-xs text-slate-500 font-normal">/ day</span>
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Plant Rental Subtotal</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">{durationDays} days @ {formatNgn(discountedDayRate)}</span>
                  </div>
                  <span className="font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">{formatNgn(totalMachineRentalNgn)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Lowbed Mobilization & Return</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">{selectedZone.name.split('(')[0]}</span>
                  </div>
                  <span className="font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">{formatNgn(mobilizationTotalNgn)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Site Risk & Plant Damage Waiver</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">3.5% statutory equipment bond</span>
                  </div>
                  <span className="font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">{formatNgn(siteWaiverNgn)}</span>
                </div>
              </div>

              {/* Total RFQ Estimate Card */}
              <div className="bg-slate-50 dark:bg-slate-950 border-2 border-yellow-500/40 rounded-xl p-4 space-y-1 shadow-sm">
                <span className="text-[11px] font-mono text-yellow-700 dark:text-yellow-500 uppercase tracking-wider block font-bold">
                  Total Estimated Lease Contract Value
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
                  {formatNgn(totalContractNgn)}
                </div>
                <p className="text-[10px] text-slate-500 pt-1">
                  *Includes operator allowances, scheduled oil changes, and mobilization permits.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-950/20 dark:shadow-emerald-950/40 transition-all group"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>Dispatch RFQ to Fleet Desk</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-mono text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">RFQ Payload Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span>Copy Enterprise RFQ Spec</span>
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
                <span className="font-mono text-yellow-700 dark:text-yellow-500/80 font-medium">ISO 9001 Safety Compliant</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

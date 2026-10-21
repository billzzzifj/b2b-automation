import React, { useState } from 'react';
import { 
  Hammer, 
  Layers, 
  Maximize2, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  Send, 
  ExternalLink, 
  Sliders, 
  FileSpreadsheet, 
  TrendingDown, 
  ShieldAlert, 
  Compass,
  MapPin,
  Smartphone,
  Printer
} from 'lucide-react';
import WhatsAppSimulatorModal from '../common/WhatsAppSimulatorModal';
import ProformaInvoiceModal from '../common/ProformaInvoiceModal';

export default function BespokeJoineryConfigurator({ company }) {
  const custom = company?.customMetrics || {
    baseBoardCostNgn: 42000,
    hmrMultiplier: 1.45,
    teakMultiplier: 2.25,
    blumHardwarePremium: 0.32,
    wasteFactor: 0.15,
    minProjectThresholdNgn: 3500000
  };

  // State
  const [projectType, setProjectType] = useState('kitchen');
  const [substrateTier, setSubstrateTier] = useState('hmr'); // 'egger' | 'hmr' | 'teak'
  const [hardwareTier, setHardwareTier] = useState('blum'); // 'dtc' | 'blum'
  const [linearMeters, setLinearMeters] = useState(8.5);
  const [ceilingHeightMeters, setCeilingHeightMeters] = useState(2.8);
  const [haulageZone, setHaulageZone] = useState('island'); // 'island' | 'mainland' | 'outskirts'
  const [valueEngineeringActive, setValueEngineeringActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isWhatsAppSimOpen, setIsWhatsAppSimOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Project Type Presets
  const projectCatalog = {
    kitchen: {
      name: 'Luxury Island Chef’s Kitchen',
      baseRatePerMeter: 380000,
      boardUsageFactor: 2.4, // boards per linear meter
      hardwareUnits: 14,
      desc: 'Double-sided island, concealed pantry cabinets & soft-close drawer stacks.'
    },
    wardrobe: {
      name: 'Master Floor-to-Ceiling Walk-In',
      baseRatePerMeter: 340000,
      boardUsageFactor: 2.8,
      hardwareUnits: 18,
      desc: 'LED integrated channels, smoked glass aluminum doors & velvet jewelry trays.'
    },
    boardroom: {
      name: 'Executive Boardroom Table & Credenza',
      baseRatePerMeter: 420000,
      boardUsageFactor: 2.0,
      hardwareUnits: 8,
      desc: 'Concealed power wire-troughs, wire-brushed fluted base & chamfered edge.'
    },
    hospitality: {
      name: 'Signature Boutique Suite Fit-Out',
      baseRatePerMeter: 395000,
      boardUsageFactor: 2.6,
      hardwareUnits: 12,
      desc: 'Headboard acoustic paneling, luggage credenza & floating study vanity.'
    },
    paneling: {
      name: 'Architectural Geometric Wall Paneling',
      baseRatePerMeter: 240000,
      boardUsageFactor: 1.8,
      hardwareUnits: 4,
      desc: 'Acoustic ribbed batten system with concealed moisture-sealed fixing rails.'
    }
  };

  // Substrate Multipliers & Attributes
  const substrates = {
    egger: {
      name: 'Egger Eurodekor MFC',
      mult: custom.eggerMultiplier || 1.0,
      veReplacement: false,
      tag: 'Imported Austrian Core',
      desc: 'Durable synchronized pore texture; ideal for dry carcass zones and residential closets.'
    },
    hmr: {
      name: 'HMR MDF / Marine Plywood Core',
      mult: custom.hmrMultiplier || 1.45,
      veReplacement: true,
      tag: 'High-Moisture Resistance',
      desc: 'Mandatory specification for Lagos Island coastal humidity, wet kitchens & vanities.'
    },
    teak: {
      name: 'Kiln-Dried Nigerian Teak / Iroko',
      mult: custom.teakMultiplier || 2.25,
      veReplacement: true,
      tag: 'Artisan Solid Hardwood',
      desc: 'Premium natural timber hand-finished with polyx-oil; maximum heritage luxury.'
    }
  };

  // Lagos Haulage & Site Hoisting Zones
  const haulageZones = {
    island: {
      name: 'Lagos Island (Ikoyi, Lekki Phase 1, VI, Eko Atlantic)',
      cost: 160000,
      hoistingCharge: 45000
    },
    mainland: {
      name: 'Lagos Mainland (Ikeja, Surulere, Gbagada, Yaba, Maryland)',
      cost: 95000,
      hoistingCharge: 25000
    },
    outskirts: {
      name: 'Outskirts Corridor (Ibeju-Lekki, Epe, Badagry, Agbara)',
      cost: 240000,
      hoistingCharge: 60000
    }
  };

  const selectedProject = projectCatalog[projectType];
  const effectiveSubstrate = valueEngineeringActive && substrateTier === 'teak' 
    ? 'hmr' 
    : substrateTier;
  const currentSubstrate = substrates[effectiveSubstrate];
  const effectiveHardwareTier = valueEngineeringActive && hardwareTier === 'blum'
    ? 'dtc'
    : hardwareTier;

  // Board Yield Calculations (4x8ft = 1.22m x 2.44m = 2.97 sqm)
  const rawBoardsNeeded = linearMeters * selectedProject.boardUsageFactor;
  const wasteFactor = custom.wasteFactor || 0.15; // 15% fabrication drop-off
  const grossBoardsWithWaste = Math.ceil(rawBoardsNeeded * (1 + wasteFactor));
  const edgeBandingMeters = Math.round(linearMeters * 18.5); // Average ABS edge banding run

  // Mathematical Costing in NGN
  const boardCostPerUnit = custom.baseBoardCostNgn || 42000;
  const substrateMaterialsCost = grossBoardsWithWaste * (boardCostPerUnit * currentSubstrate.mult);
  
  // Hardware Costing
  const baseHardwareCost = selectedProject.hardwareUnits * 18500;
  const hardwareMultiplier = effectiveHardwareTier === 'blum' ? (1 + (custom.blumHardwarePremium || 0.32)) : 1.0;
  const totalHardwareCost = baseHardwareCost * hardwareMultiplier;

  // Fabrication & Joinery Precision Labor
  const joineryLaborCost = linearMeters * (selectedProject.baseRatePerMeter * 0.42);

  // Finishing & Edge Banding
  const edgeBandingCost = edgeBandingMeters * 1200;

  // Haulage & Installation
  const zoneInfo = haulageZones[haulageZone];
  const logisticsTotal = zoneInfo.cost + zoneInfo.hoistingCharge;

  // Subtotal & Full Estimate
  const totalProductionCostNgn = substrateMaterialsCost + totalHardwareCost + joineryLaborCost + edgeBandingCost + logisticsTotal;

  // Un-engineered comparison value to show VE savings
  const unengineeredCostNgn = rawBoardsNeeded * (1 + wasteFactor) * (boardCostPerUnit * substrates[substrateTier].mult)
    + (selectedProject.hardwareUnits * 18500 * (hardwareTier === 'blum' ? 1.32 : 1.0))
    + joineryLaborCost + edgeBandingCost + logisticsTotal;
  
  const veSavingsNgn = Math.max(0, unengineeredCostNgn - totalProductionCostNgn);
  const veSavingsPct = unengineeredCostNgn > 0 ? Math.round((veSavingsNgn / unengineeredCostNgn) * 100) : 0;

  // Threshold verification
  const thresholdNgn = custom.minProjectThresholdNgn || 3500000;
  const meetsThreshold = totalProductionCostNgn >= thresholdNgn;

  const formatNgn = (val) => `₦${Math.round(val).toLocaleString()}`;

  // WhatsApp spec card payload
  const whatsappBoqText = `*ARCHITECTURAL SPECIFICATION & BOQ // ${company.name.toUpperCase()}*
---------------------------------------
• Project Scope: ${selectedProject.name}
• Run Length: ${linearMeters} Linear Meters (${ceilingHeightMeters}m Height)
• Substrate Core: ${currentSubstrate.name} (${currentSubstrate.tag})
• Hardware Specification: ${effectiveHardwareTier === 'blum' ? 'Blum Tandembox / Aventos HF Soft-Close' : 'Heavy-Duty DTC Engineered Soft-Close'}
• Board Yield: ${grossBoardsWithWaste} Panels (incl. 15% fabrication wastage)
• Edge-Banding ABS: ${edgeBandingMeters} Meters
• Delivery Corridor: ${zoneInfo.name}
${valueEngineeringActive ? `• Value-Engineering: APPLIED (₦${Math.round(veSavingsNgn).toLocaleString()} Saved)\n` : ''}---------------------------------------
*ESTIMATED PRODUCTION & FIT-OUT BUDGET:*
• Substrate Core Materials: ${formatNgn(substrateMaterialsCost)}
• Precision Motion Hardware: ${formatNgn(totalHardwareCost)}
• Joinery & CNC Milling Labor: ${formatNgn(joineryLaborCost)}
• ABS Edge-Banding: ${formatNgn(edgeBandingCost)}
• Lagos Haulage & Hoisting: ${formatNgn(logisticsTotal)}
---------------------------------------
*TOTAL PROJECT ESTIMATE: ${formatNgn(totalProductionCostNgn)}*
${meetsThreshold ? '✅ Tier Status: VIP SPECIFIER RUN (>₦3.5M)' : '⚠️ Note: Below standard custom fabrication gate (₦3.5M)'}
---------------------------------------
Generated via ${company.name} Bespoke Joinery Configurator. Requesting factory consultation & site survey.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappBoqText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const phoneTarget = company.samplePhone || '2348021122334';
  const whatsappUrl = `https://wa.me/${phoneTarget}?text=${encodeURIComponent(whatsappBoqText)}`;

  const invoiceData = {
    title: `${selectedProject.name} Specification & BOQ`,
    subtitle: `Substrate: ${currentSubstrate.name} • Hardware: ${effectiveHardwareTier.toUpperCase()}`,
    subtotal: substrateMaterialsCost + totalHardwareCost + joineryLaborCost + edgeBandingCost,
    surcharges: zoneInfo.cost + zoneInfo.hoistingCharge,
    vat: Math.round(totalProductionCostNgn * 0.075),
    total: totalProductionCostNgn + Math.round(totalProductionCostNgn * 0.075),
    items: [
      {
        name: `Core Millwork Substrate Panels (${currentSubstrate.name})`,
        desc: `${grossBoardsWithWaste} Panels (incl. 15% fabrication wastage factor) for ${linearMeters}m run`,
        qty: `${grossBoardsWithWaste} Boards`,
        rate: boardCostPerUnit * currentSubstrate.mult,
        total: substrateMaterialsCost
      },
      {
        name: `Precision Damped Motion Hardware (${effectiveHardwareTier.toUpperCase()})`,
        desc: `${selectedProject.hardwareUnits} Pairs/Units (Hinges, Tandembox runners & lifts)`,
        qty: `${selectedProject.hardwareUnits} Units`,
        rate: Math.round(totalHardwareCost / selectedProject.hardwareUnits),
        total: totalHardwareCost
      },
      {
        name: 'Workshop CNC Milling, Joinery & Bench Labor',
        desc: 'Precision computerized slicing, joinery mortising and sub-assembly',
        qty: `${linearMeters} Meters`,
        rate: Math.round(joineryLaborCost / linearMeters),
        total: joineryLaborCost
      },
      {
        name: 'ABS Impact Edge-Banding & Adhesive Sealing',
        desc: `${edgeBandingMeters} Meters of 2.0mm high-durability moisture-sealed ABS edging`,
        qty: `${edgeBandingMeters} Meters`,
        rate: 1200,
        total: edgeBandingCost
      },
      {
        name: 'Lagos Haulage, Delivery & Site Hoisting',
        desc: `${zoneInfo.name} with site rigging and delivery insurance`,
        qty: 'Turnkey Logistics',
        rate: zoneInfo.cost + zoneInfo.hoistingCharge,
        total: zoneInfo.cost + zoneInfo.hoistingCharge
      }
    ]
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner: Value Engineering & Minimum Production Threshold */}
      <div className="bg-amber-50/70 dark:bg-gradient-to-r dark:from-stone-900 dark:via-amber-950/30 dark:to-stone-900 border border-amber-200 dark:border-amber-900/40 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-200 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-600/30 flex items-center justify-center text-amber-600 dark:text-amber-500">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold">Architectural Millwork Portal</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                meetsThreshold ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40' : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40'
              }`}>
                {meetsThreshold ? 'Passed ₦3.5M Gate' : 'Under ₦3.5M Minimum'}
              </span>
            </div>
            <p className="text-sm text-stone-700 dark:text-stone-300">
              Interactive 5-step board yield, hardware, and substrate calculator for <strong className="text-amber-900 dark:text-amber-200">{company.name}</strong>.
            </p>
          </div>
        </div>

        {/* 1-Click Value-Engineering Toggle */}
        <button
          onClick={() => setValueEngineeringActive(!valueEngineeringActive)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
            valueEngineeringActive
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 font-bold'
              : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-amber-300 border-stone-300 dark:border-amber-800/60 hover:bg-stone-50 dark:hover:bg-stone-800 shadow-sm'
          }`}
        >
          <TrendingDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{valueEngineeringActive ? 'Value-Engineering Active' : 'Enable Value-Engineering'}</span>
          {valueEngineeringActive && <span className="bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-mono">-{veSavingsPct}%</span>}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 5-Step Configurator Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#12110F] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-6 shadow-xl dark:shadow-2xl transition-colors duration-200">
          
          {/* Step 1: Project Type */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-amber-600 dark:text-amber-500 uppercase tracking-widest font-bold">
                Step 01 // Project Classification
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">Select architectural category</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(projectCatalog).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setProjectType(key)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    projectType === key
                      ? 'bg-amber-50 border-amber-500 text-stone-900 dark:bg-amber-950/40 dark:border-amber-500/80 dark:text-white shadow-sm'
                      : 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">{item.name}</span>
                    {projectType === key && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Lagos Substrate Tiers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-amber-600 dark:text-amber-500 uppercase tracking-widest font-bold">
                Step 02 // Core Substrate & Moisture Grade
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">Lagos coastal tolerance tier</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {Object.entries(substrates).map(([key, item]) => {
                const isSelected = effectiveSubstrate === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSubstrateTier(key);
                      setValueEngineeringActive(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 text-stone-900 dark:bg-amber-950/50 dark:border-amber-500 dark:text-white shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-200">{item.name}</span>
                        <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">x{item.mult}</span>
                      </div>
                      <span className="text-[10px] bg-white dark:bg-stone-950 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-800 inline-block mb-1 font-semibold">
                        {item.tag}
                      </span>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Motion Hardware & Runners */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-amber-600 dark:text-amber-500 uppercase tracking-widest font-bold">
                Step 03 // Precision Motion Hardware
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">Runners, hinges & lift mechanisms</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setHardwareTier('dtc');
                  setValueEngineeringActive(false);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  effectiveHardwareTier === 'dtc'
                    ? 'bg-amber-50 border-amber-500 text-stone-900 dark:bg-amber-950/40 dark:border-amber-500 dark:text-white shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-900 dark:text-stone-200">Heavy-Duty DTC Soft-Close</span>
                  <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 font-semibold">Base Spec</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">High-cycle hydraulic damping, 45kg load-rated slide runners.</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHardwareTier('blum');
                  setValueEngineeringActive(false);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  effectiveHardwareTier === 'blum'
                    ? 'bg-amber-50 border-amber-500 text-stone-900 dark:bg-amber-950/40 dark:border-amber-500 dark:text-white shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-900 dark:text-stone-200">Blum Tandembox / Aventos HF</span>
                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-bold">+32% Premium</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">Austrian bi-fold lifts, Tip-On Blumotion push-to-open integration.</p>
              </button>
            </div>
          </div>

          {/* Step 4: Scale & Board Yield Calculation */}
          <div className="bg-stone-50 dark:bg-stone-950/70 p-4 rounded-xl border border-stone-200 dark:border-stone-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-600 dark:text-amber-500 uppercase tracking-widest font-bold">
                Step 04 // Run Length & Board Yield Math
              </span>
              <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 px-3 py-1 rounded-lg shadow-sm">
                <input
                  type="number"
                  min="2"
                  max="40"
                  step="0.5"
                  value={linearMeters}
                  onChange={(e) => setLinearMeters(Math.max(2, Number(e.target.value)))}
                  className="w-16 bg-transparent text-right font-mono text-sm font-bold text-amber-600 dark:text-amber-400 focus:outline-none"
                />
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">Meters</span>
              </div>
            </div>

            <input
              type="range"
              min="2"
              max="25"
              step="0.5"
              value={linearMeters}
              onChange={(e) => setLinearMeters(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none"
            />

            {/* Board yield telemetry */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 p-2 rounded-lg shadow-sm">
                <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 uppercase block">4x8ft Panels Needed</span>
                <span className="text-base font-bold font-mono text-amber-700 dark:text-amber-300">{grossBoardsWithWaste} Boards</span>
                <span className="text-[9px] text-stone-400 dark:text-stone-500 block">(incl. 15% wastage)</span>
              </div>
              <div className="bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 p-2 rounded-lg shadow-sm">
                <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 uppercase block">Edge-Banding ABS</span>
                <span className="text-base font-bold font-mono text-amber-700 dark:text-amber-300">{edgeBandingMeters} Meters</span>
                <span className="text-[9px] text-stone-400 dark:text-stone-500 block">2.0mm High-Impact</span>
              </div>
              <div className="bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 p-2 rounded-lg shadow-sm">
                <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 uppercase block">Motion Hinges / Pairs</span>
                <span className="text-base font-bold font-mono text-amber-700 dark:text-amber-300">{selectedProject.hardwareUnits} Units</span>
                <span className="text-[9px] text-stone-400 dark:text-stone-500 block">{effectiveHardwareTier.toUpperCase()} System</span>
              </div>
            </div>
          </div>

          {/* Step 5: Lagos Logistics & Haulage Zones */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-amber-600 dark:text-amber-500 uppercase tracking-widest font-bold">
                Step 05 // Lagos Haulage & Site Hoisting
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">Corridor logistics & assembly</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {Object.entries(haulageZones).map(([key, zone]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setHaulageZone(key)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    haulageZone === key
                      ? 'bg-amber-50 border-amber-500 text-stone-900 dark:bg-amber-950/40 dark:border-amber-500 dark:text-white shadow-sm'
                      : 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <span className="block font-medium text-stone-800 dark:text-stone-200 truncate">{zone.name.split('(')[0]}</span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 block mt-0.5">
                    {formatNgn(zone.cost + zone.hoistingCharge)} (incl. hoist)
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Editorial BOQ Generator & WhatsApp Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-[#151412] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xl dark:shadow-2xl relative transition-colors duration-200">
            
            <div className="space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-500 font-bold">Bill of Quantities</span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    {company.name} Specification
                  </h3>
                </div>
                <span className="text-xs font-mono bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 px-2.5 py-1 rounded-lg text-amber-700 dark:text-amber-400 font-bold">
                  {linearMeters}m Run
                </span>
              </div>

              {/* Value Engineering Callout when Active */}
              {valueEngineeringActive && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-500/40 rounded-xl p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>VE optimization applied without degrading facade aesthetic.</span>
                  </div>
                  <strong className="font-mono text-emerald-700 dark:text-emerald-200">Saved {formatNgn(veSavingsNgn)}</strong>
                </div>
              )}

              {/* BOQ Itemized Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-stone-700 dark:text-stone-300">
                  <div>
                    <span className="text-xs text-stone-500 dark:text-stone-400 block">Core Substrate Material</span>
                    <span className="text-[11px] text-stone-400 dark:text-stone-500">{grossBoardsWithWaste}x {currentSubstrate.name}</span>
                  </div>
                  <span className="font-mono font-medium tabular-nums text-stone-900 dark:text-stone-100">{formatNgn(substrateMaterialsCost)}</span>
                </div>

                <div className="flex justify-between items-center text-stone-700 dark:text-stone-300">
                  <div>
                    <span className="text-xs text-stone-500 dark:text-stone-400 block">Engineered Motion Hardware</span>
                    <span className="text-[11px] text-stone-400 dark:text-stone-500">{selectedProject.hardwareUnits}x {effectiveHardwareTier.toUpperCase()} Damped Units</span>
                  </div>
                  <span className="font-mono font-medium tabular-nums text-stone-900 dark:text-stone-100">{formatNgn(totalHardwareCost)}</span>
                </div>

                <div className="flex justify-between items-center text-stone-700 dark:text-stone-300">
                  <div>
                    <span className="text-xs text-stone-500 dark:text-stone-400 block">CNC Milling, Joinery & Assembly</span>
                    <span className="text-[11px] text-stone-400 dark:text-stone-500">Workshop fabrication labor</span>
                  </div>
                  <span className="font-mono font-medium tabular-nums text-stone-900 dark:text-stone-100">{formatNgn(joineryLaborCost)}</span>
                </div>

                <div className="flex justify-between items-center text-stone-700 dark:text-stone-300">
                  <div>
                    <span className="text-xs text-stone-500 dark:text-stone-400 block">Edge-Banding & Bonding</span>
                    <span className="text-[11px] text-stone-400 dark:text-stone-500">{edgeBandingMeters}m 2mm impact ABS</span>
                  </div>
                  <span className="font-mono font-medium tabular-nums text-stone-900 dark:text-stone-100">{formatNgn(edgeBandingCost)}</span>
                </div>

                <div className="flex justify-between items-center text-stone-700 dark:text-stone-300">
                  <div>
                    <span className="text-xs text-stone-500 dark:text-stone-400 block">Lagos Haulage & Site Hoisting</span>
                    <span className="text-[11px] text-stone-400 dark:text-stone-500">{zoneInfo.name.split('(')[0]}</span>
                  </div>
                  <span className="font-mono font-medium tabular-nums text-stone-900 dark:text-stone-100">{formatNgn(logisticsTotal)}</span>
                </div>
              </div>

              {/* Budget Gate Total Card */}
              <div className="bg-stone-50 dark:bg-stone-950 border-2 border-amber-500/40 rounded-xl p-4 space-y-1 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 uppercase tracking-wider font-bold">
                    Total Estimated Fit-Out Budget
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    meetsThreshold ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800' : 'bg-red-50 text-red-700 border border-red-300 dark:bg-red-950 dark:text-red-400 dark:border-red-800'
                  }`}>
                    {meetsThreshold ? 'Threshold Approved' : 'Under ₦3.5M Minimum'}
                  </span>
                </div>
                
                <div className="text-2xl font-black text-stone-900 dark:text-white font-mono tabular-nums tracking-tight">
                  {formatNgn(totalProductionCostNgn)}
                </div>
                
                <p className="text-[10px] text-stone-500 pt-1">
                  *Includes CAD drafting, board fabrication, edge-sealing, hardware, and site commissioning.
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
                  <span>Send Spec Sheet to Workshop</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWhatsAppSimOpen(true)}
                    className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>WhatsApp Simulator</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsInvoiceOpen(true)}
                    className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Official BOQ PDF</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full bg-stone-50 hover:bg-stone-100 dark:bg-stone-950 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-400 font-mono text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 border border-stone-200 dark:border-stone-800 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">BOQ Spec Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-stone-400" />
                      <span>Copy Full Specifier BOQ</span>
                    </>
                  )}
                </button>
              </div>

              {/* Desk Information Footer */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800/80 text-[11px] text-stone-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  {company.location}
                </span>
                <span className="font-mono text-amber-700 dark:text-amber-500/80 font-medium">Est. 48hr Costing Delay Solved</span>
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
        payloadText={whatsappBoqText}
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

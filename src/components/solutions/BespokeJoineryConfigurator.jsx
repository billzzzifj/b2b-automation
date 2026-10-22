import React, { useState, useEffect } from 'react';
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
  Printer,
  Link2
} from 'lucide-react';
import WhatsAppSimulatorModal from '../common/WhatsAppSimulatorModal';
import ProformaInvoiceModal from '../common/ProformaInvoiceModal';
import { getHashParams, updateHashParams, buildShareUrl } from '../../utils/urlState';

export default function BespokeJoineryConfigurator({ company }) {
  const custom = company?.customMetrics || {
    baseBoardCostNgn: 42000,
    hmrMultiplier: 1.45,
    teakMultiplier: 2.25,
    blumHardwarePremium: 0.32,
    wasteFactor: 0.15,
    minProjectThresholdNgn: 3500000
  };

  // Project Type Presets
  const projectCatalog = {
    kitchen: {
      name: 'Luxury Island Chef’s Kitchen',
      baseRatePerMeter: 380000,
      boardUsageFactor: 2.4,
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

  // Read initial configuration from URL params for persistent state
  const initialParams = getHashParams();

  // State
  const [projectType, setProjectType] = useState(
    initialParams.project && projectCatalog[initialParams.project] ? initialParams.project : 'kitchen'
  );
  const [substrateTier, setSubstrateTier] = useState(
    initialParams.material && substrates[initialParams.material] ? initialParams.material : 'hmr'
  );
  const [hardwareTier, setHardwareTier] = useState(
    initialParams.hardware === 'dtc' ? 'dtc' : 'blum'
  );
  const [linearMeters, setLinearMeters] = useState(
    initialParams.meters ? Math.max(2, Math.min(40, Number(initialParams.meters))) : 8.5
  );
  const [haulageZone, setHaulageZone] = useState(
    initialParams.haulage && haulageZones[initialParams.haulage] ? initialParams.haulage : 'island'
  );
  const [valueEngineeringActive, setValueEngineeringActive] = useState(
    initialParams.ve === '1'
  );

  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isWhatsAppSimOpen, setIsWhatsAppSimOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Sync state to URL hash query parameters on change
  useEffect(() => {
    updateHashParams({
      project: projectType,
      material: substrateTier,
      hardware: hardwareTier,
      meters: linearMeters,
      haulage: haulageZone,
      ve: valueEngineeringActive ? '1' : undefined
    }, company?.slug);
  }, [projectType, substrateTier, hardwareTier, linearMeters, haulageZone, valueEngineeringActive, company?.slug]);

  const selectedProject = projectCatalog[projectType] || projectCatalog.kitchen;
  const currentSubstrate = substrates[substrateTier] || substrates.hmr;
  const zoneInfo = haulageZones[haulageZone] || haulageZones.island;

  // Value Engineering Effect
  const effectiveSubstrate = valueEngineeringActive && substrateTier !== 'egger' ? substrates.egger : currentSubstrate;
  const effectiveHardwareTier = valueEngineeringActive ? 'dtc' : hardwareTier;

  // Board Yield & Waste Calculation
  const netBoardsRequired = Math.ceil(linearMeters * selectedProject.boardUsageFactor);
  const wasteFactor = custom.wasteFactor || 0.15;
  const grossBoardsWithWaste = Math.ceil(netBoardsRequired * (1 + wasteFactor));
  const edgeBandingMeters = Math.round(grossBoardsWithWaste * 18.5);

  // Financial Costing (in NGN)
  const baseBoardCost = custom.baseBoardCostNgn || 42000;
  const substrateMaterialsCost = grossBoardsWithWaste * (baseBoardCost * effectiveSubstrate.mult);
  
  const blumHardwareCost = selectedProject.hardwareUnits * 24500;
  const dtcHardwareCost = selectedProject.hardwareUnits * 16800;
  const totalHardwareCost = effectiveHardwareTier === 'blum' ? blumHardwareCost : dtcHardwareCost;

  const joineryLaborCost = linearMeters * 65000;
  const edgeBandingCost = edgeBandingMeters * 1200;
  const logisticsTotal = zoneInfo.cost + zoneInfo.hoistingCharge;

  const totalProductionCostNgn = substrateMaterialsCost + totalHardwareCost + joineryLaborCost + edgeBandingCost + logisticsTotal;

  // Standard Non-VE Cost (for savings comparison)
  const standardSubstrateCost = grossBoardsWithWaste * (baseBoardCost * currentSubstrate.mult);
  const standardHardwareCost = hardwareTier === 'blum' ? blumHardwareCost : dtcHardwareCost;
  const standardCostNgn = standardSubstrateCost + standardHardwareCost + joineryLaborCost + edgeBandingCost + logisticsTotal;
  const veSavingsNgn = Math.max(0, standardCostNgn - totalProductionCostNgn);
  const veSavingsPct = standardCostNgn > 0 ? Math.round((veSavingsNgn / standardCostNgn) * 100) : 0;

  // Minimum Project Threshold Check (₦3,500,000)
  const thresholdNgn = custom.minProjectThresholdNgn || 3500000;
  const meetsThreshold = totalProductionCostNgn >= thresholdNgn;

  const formatNgn = (val) => `₦${Math.round(val).toLocaleString()}`;

  // WhatsApp BOQ Payload
  const whatsappBoqText = `*BESPOKE JOINERY SPECIFIER BOQ // ${company.name.toUpperCase()}*
---------------------------------------
• Project Class: ${selectedProject.name}
• Scale: ${linearMeters} Linear Meters (${grossBoardsWithWaste} Panels 4x8ft with 15% Wastage)
• Specified Core: ${effectiveSubstrate.name} (${effectiveSubstrate.tag})
• Hardware Suite: ${effectiveHardwareTier === 'blum' ? 'BLUM Austria Soft-Close Tandembox' : 'Heavy-Duty DTC Concealed Slides'}
• Haulage Zone: ${zoneInfo.name.split('(')[0]} (Includes Site Hoisting)
${valueEngineeringActive ? `• Value-Engineering: ACTIVE (Saved ${formatNgn(veSavingsNgn)} / ${veSavingsPct}%)\n` : ''}---------------------------------------
*ESTIMATED PRODUCTION & FIT-OUT BUDGET:*
• Substrate Materials (${grossBoardsWithWaste} bds): ${formatNgn(substrateMaterialsCost)}
• Hardware Package (${selectedProject.hardwareUnits} units): ${formatNgn(totalHardwareCost)}
• CNC Joinery Fabrication: ${formatNgn(joineryLaborCost)}
• 2.0mm ABS Edge-Banding (${edgeBandingMeters}m): ${formatNgn(edgeBandingCost)}
• Site Logistics & Hoisting: ${formatNgn(logisticsTotal)}
---------------------------------------
*TOTAL ESTIMATED PROJECT VALUE: ${formatNgn(totalProductionCostNgn)}*
${meetsThreshold ? '✅ Meets Minimum Production Threshold (₦3.5M)' : '⚠️ Below ₦3.5M Studio Minimum'}
---------------------------------------
Generated via ${company.name} Live Intake Engine. Please review BOQ and confirm site assessment schedule.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappBoqText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleCopyShareLink = () => {
    const shareUrl = buildShareUrl(company.slug, {
      project: projectType,
      material: substrateTier,
      hardware: hardwareTier,
      meters: linearMeters,
      haulage: haulageZone,
      ve: valueEngineeringActive ? '1' : undefined
    });
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const phoneTarget = company.samplePhone || '2348033045612';
  const whatsappUrl = `https://wa.me/${phoneTarget}?text=${encodeURIComponent(whatsappBoqText)}`;

  const invoiceData = {
    title: `${selectedProject.name} Joinery Specification BOQ`,
    subtitle: `Substrate: ${effectiveSubstrate.name} • ${linearMeters}m Run • ${effectiveHardwareTier.toUpperCase()} Motion`,
    subtotal: totalProductionCostNgn,
    surcharges: logisticsTotal,
    vat: Math.round(totalProductionCostNgn * 0.075),
    total: totalProductionCostNgn + Math.round(totalProductionCostNgn * 0.075),
    items: [
      {
        name: `Core Substrate Material: ${effectiveSubstrate.name}`,
        desc: `${grossBoardsWithWaste}x 4x8ft Panels with 15% wastage allowance (${effectiveSubstrate.tag})`,
        qty: `${grossBoardsWithWaste} Boards`,
        rate: Math.round(substrateMaterialsCost / grossBoardsWithWaste),
        total: substrateMaterialsCost
      },
      {
        name: `Hardware Suite: ${effectiveHardwareTier === 'blum' ? 'Blum Austria' : 'Heavy-Duty DTC'}`,
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
    <div className="w-full max-w-7xl mx-auto space-y-6 font-mono text-slate-900 dark:text-slate-100">
      
      {/* Top Banner: Value Engineering & Minimum Production Threshold (Brutalist) */}
      <div className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-black text-amber-400 dark:bg-amber-500 dark:text-black flex items-center justify-center font-black shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">
                Architectural Millwork Engine
              </span>
              <span className={`text-[11px] px-2 py-0.5 border font-bold uppercase ${
                meetsThreshold 
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-500 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500' 
                  : 'bg-amber-100 text-amber-900 border-amber-500 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-500'
              }`}>
                {meetsThreshold ? 'Passed ₦3.5M Qualification Gate' : 'Below ₦3.5M Minimum Studio Spec'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400 font-sans mt-0.5">
              5-step substrate yield, Blum hardware costing & automated BOQ generation for <strong className="text-black dark:text-white font-mono">{company.name}</strong>.
            </p>
          </div>
        </div>

        {/* Action Controls: Value Engineering + Share URL */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="min-h-[44px] px-4 py-2 border-2 border-black dark:border-zinc-700 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            title="Copy sharable URL preserving all current configuration parameters"
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

          <button
            type="button"
            onClick={() => setValueEngineeringActive(!valueEngineeringActive)}
            className={`min-h-[44px] px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
              valueEngineeringActive
                ? 'bg-amber-500 text-black border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-black text-white dark:bg-zinc-800 dark:text-amber-300 border-black dark:border-zinc-700 hover:bg-zinc-800'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>{valueEngineeringActive ? 'Value-Eng Active' : 'Value-Engineer'}</span>
            {valueEngineeringActive && <span className="bg-black text-amber-400 px-1.5 py-0.5 text-[10px]">-{veSavingsPct}%</span>}
          </button>
        </div>
      </div>

      {/* Main Grid: Responsive 12-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 5-Step Configurator Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-5 sm:p-6 space-y-6">
          
          {/* Step 1: Project Type */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-black/10 dark:border-zinc-800 pb-2">
              <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">
                01 // Architectural Project Category
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Select typology</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(projectCatalog).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setProjectType(key)}
                  className={`min-h-[44px] p-3 border-2 text-left transition-all cursor-pointer ${
                    projectType === key
                      ? 'bg-amber-500 text-black border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-slate-50 dark:bg-zinc-900 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-black dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-tight">{item.name}</span>
                    {projectType === key && <Check className="w-4 h-4 text-black shrink-0" />}
                  </div>
                  <p className="text-[11px] opacity-80 mt-1 line-clamp-1 font-sans">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Lagos Substrate Tiers */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-black/10 dark:border-zinc-800 pb-2">
              <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">
                02 // Substrate & Moisture Grade
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Lagos coastal tolerance</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {Object.entries(substrates).map(([key, sub]) => {
                const isSelected = substrateTier === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSubstrateTier(key);
                      setValueEngineeringActive(false);
                    }}
                    className={`min-h-[44px] p-3 border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-black border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-slate-50 dark:bg-zinc-900 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-black dark:hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase">{sub.name.split('/')[0]}</span>
                      <span className="text-[10px] font-mono px-1 py-0.2 bg-black text-white dark:bg-zinc-800 dark:text-amber-400">{sub.mult}x</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold block mt-1 text-amber-800 dark:text-amber-400">{sub.tag}</span>
                    <p className="text-[11px] opacity-80 mt-1 line-clamp-2 font-sans">{sub.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Engineered Motion Hardware */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-black/10 dark:border-zinc-800 pb-2">
              <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">
                03 // Motion Hardware & Runners
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Blum Austria vs DTC</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setHardwareTier('dtc');
                  setValueEngineeringActive(false);
                }}
                className={`min-h-[44px] p-3.5 border-2 text-left transition-all cursor-pointer ${
                  effectiveHardwareTier === 'dtc'
                    ? 'bg-amber-500 text-black border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-slate-50 dark:bg-zinc-900 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-black dark:hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase">Heavy-Duty DTC Soft-Close</span>
                  <span className="text-[10px] font-mono font-bold bg-black text-white px-1.5 py-0.5">Base Spec</span>
                </div>
                <p className="text-[11px] opacity-80 mt-1 font-sans">Hydraulic damping, 45kg load-rated slide runners.</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHardwareTier('blum');
                  setValueEngineeringActive(false);
                }}
                className={`min-h-[44px] p-3.5 border-2 text-left transition-all cursor-pointer ${
                  effectiveHardwareTier === 'blum'
                    ? 'bg-amber-500 text-black border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-slate-50 dark:bg-zinc-900 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-black dark:hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase">Blum Austria Tandembox</span>
                  <span className="text-[10px] font-mono font-bold bg-amber-600 text-white px-1.5 py-0.5">+32% Premium</span>
                </div>
                <p className="text-[11px] opacity-80 mt-1 font-sans">Austrian bi-fold lifts, Tip-On Blumotion push-to-open.</p>
              </button>
            </div>
          </div>

          {/* Step 4: Scale & Board Yield Calculation */}
          <div className="border-2 border-black dark:border-zinc-800 p-4 bg-slate-50 dark:bg-zinc-900 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 dark:border-zinc-800 pb-2">
              <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">
                04 // Run Length & Board Yield Math
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="2"
                  max="40"
                  step="0.5"
                  value={linearMeters}
                  onChange={(e) => setLinearMeters(Math.max(2, Number(e.target.value)))}
                  className="w-20 min-h-[44px] bg-white dark:bg-black border-2 border-black dark:border-zinc-700 px-3 py-1 text-center font-mono text-sm font-bold text-slate-900 dark:text-white"
                />
                <span className="text-xs font-bold uppercase">Meters</span>
              </div>
            </div>

            <input
              type="range"
              min="2"
              max="25"
              step="0.5"
              value={linearMeters}
              onChange={(e) => setLinearMeters(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-3 bg-slate-300 dark:bg-zinc-800 border border-black dark:border-zinc-700 appearance-none"
            />

            {/* Board yield telemetry */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-center">
              <div className="bg-white dark:bg-black border border-slate-300 dark:border-zinc-800 p-3">
                <span className="text-[10px] font-mono uppercase block text-slate-500">4x8ft Panels Needed</span>
                <span className="text-base font-black font-mono text-amber-600 dark:text-amber-400 tabular-nums">{grossBoardsWithWaste} Boards</span>
                <span className="text-[10px] text-slate-400 block">(incl. 15% wastage)</span>
              </div>
              <div className="bg-white dark:bg-black border border-slate-300 dark:border-zinc-800 p-3">
                <span className="text-[10px] font-mono uppercase block text-slate-500">Edge-Banding ABS</span>
                <span className="text-base font-black font-mono text-amber-600 dark:text-amber-400 tabular-nums">{edgeBandingMeters} Meters</span>
                <span className="text-[10px] text-slate-400 block">2.0mm High-Impact</span>
              </div>
              <div className="bg-white dark:bg-black border border-slate-300 dark:border-zinc-800 p-3">
                <span className="text-[10px] font-mono uppercase block text-slate-500">Motion Pairs</span>
                <span className="text-base font-black font-mono text-amber-600 dark:text-amber-400 tabular-nums">{selectedProject.hardwareUnits} Units</span>
                <span className="text-[10px] text-slate-400 block">{effectiveHardwareTier.toUpperCase()} System</span>
              </div>
            </div>
          </div>

          {/* Step 5: Lagos Logistics & Haulage Zones */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-black/10 dark:border-zinc-800 pb-2">
              <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">
                05 // Lagos Haulage & Site Hoisting
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Transit & rigging</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {Object.entries(haulageZones).map(([key, zone]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setHaulageZone(key)}
                  className={`min-h-[44px] p-3 border-2 text-left text-xs transition-all cursor-pointer ${
                    haulageZone === key
                      ? 'bg-amber-500 text-black border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-slate-50 dark:bg-zinc-900 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-black dark:hover:border-zinc-600'
                  }`}
                >
                  <span className="block font-bold truncate">{zone.name.split('(')[0]}</span>
                  <span className="text-[11px] font-mono block mt-1 tabular-nums">
                    {formatNgn(zone.cost + zone.hoistingCharge)}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Editorial BOQ Generator & WhatsApp Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] relative">
            
            <div className="space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-zinc-800">
                <div>
                  <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">
                    Live Bill of Quantities
                  </span>
                  <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white">
                    {company.name} BOQ
                  </h3>
                </div>
                <span className="text-xs font-mono bg-black text-amber-400 px-3 py-1 font-black">
                  {linearMeters}m Run
                </span>
              </div>

              {/* Value Engineering Callout */}
              {valueEngineeringActive && (
                <div className="bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-600 p-3 text-xs text-emerald-900 dark:text-emerald-300 flex items-center justify-between font-bold">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    <span>VE applied without degrading facade spec.</span>
                  </div>
                  <strong className="font-mono tabular-nums text-emerald-900 dark:text-emerald-200">
                    Saved {formatNgn(veSavingsNgn)}
                  </strong>
                </div>
              )}

              {/* Horizontal Scrollable BOQ Matrix Table */}
              <div className="w-full overflow-x-auto border border-slate-200 dark:border-zinc-800">
                <table className="w-full min-w-max text-left text-xs font-mono">
                  <thead className="bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 uppercase text-[10px] border-b border-slate-200 dark:border-zinc-800">
                    <tr>
                      <th className="p-2.5">Component / Spec</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Total (₦)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-900 text-slate-800 dark:text-zinc-200">
                    <tr>
                      <td className="p-2.5">
                        <strong className="block text-xs">{effectiveSubstrate.name}</strong>
                        <span className="text-[10px] text-slate-500">Core Substrate Panels</span>
                      </td>
                      <td className="p-2.5 text-center tabular-nums">{grossBoardsWithWaste} bds</td>
                      <td className="p-2.5 text-right font-bold tabular-nums">{formatNgn(substrateMaterialsCost)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">
                        <strong className="block text-xs">{effectiveHardwareTier.toUpperCase()} Damped Suite</strong>
                        <span className="text-[10px] text-slate-500">Runners & Hinges</span>
                      </td>
                      <td className="p-2.5 text-center tabular-nums">{selectedProject.hardwareUnits} units</td>
                      <td className="p-2.5 text-right font-bold tabular-nums">{formatNgn(totalHardwareCost)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">
                        <strong className="block text-xs">CNC Joinery & Labor</strong>
                        <span className="text-[10px] text-slate-500">Milling & Assembly</span>
                      </td>
                      <td className="p-2.5 text-center tabular-nums">{linearMeters}m</td>
                      <td className="p-2.5 text-right font-bold tabular-nums">{formatNgn(joineryLaborCost)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">
                        <strong className="block text-xs">ABS Edge-Banding</strong>
                        <span className="text-[10px] text-slate-500">2.0mm High Impact</span>
                      </td>
                      <td className="p-2.5 text-center tabular-nums">{edgeBandingMeters}m</td>
                      <td className="p-2.5 text-right font-bold tabular-nums">{formatNgn(edgeBandingCost)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">
                        <strong className="block text-xs">Haulage & Hoisting</strong>
                        <span className="text-[10px] text-slate-500">{zoneInfo.name.split('(')[0]}</span>
                      </td>
                      <td className="p-2.5 text-center">Site</td>
                      <td className="p-2.5 text-right font-bold tabular-nums">{formatNgn(logisticsTotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Budget Gate Total Card */}
              <div className="bg-slate-50 dark:bg-black border-2 border-black dark:border-amber-500 p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
                    Total Estimated Fit-Out Budget
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 border font-bold uppercase ${
                    meetsThreshold 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-500 dark:bg-emerald-950 dark:text-emerald-300' 
                      : 'bg-red-100 text-red-800 border-red-500 dark:bg-red-950 dark:text-red-300'
                  }`}>
                    {meetsThreshold ? 'Threshold Approved' : 'Under ₦3.5M Minimum'}
                  </span>
                </div>
                
                <div className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
                  {formatNgn(totalProductionCostNgn)}
                </div>
                
                <p className="text-[10px] text-slate-500 pt-1 font-sans">
                  *Includes CAD drafting, board fabrication, edge-sealing, motion hardware, and site commissioning.
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
                  <span>Send Spec Sheet to Workshop</span>
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
                    <span>Official BOQ PDF</span>
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
                        <span className="text-emerald-700 dark:text-emerald-400">BOQ Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                        <span>Copy Raw BOQ</span>
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
                  48hr Costing Delay Solved
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

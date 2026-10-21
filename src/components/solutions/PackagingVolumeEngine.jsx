import React, { useState } from 'react';
import { 
  Package, 
  Layers, 
  Sparkles, 
  FileCheck2, 
  UploadCloud, 
  Check, 
  Copy, 
  Send, 
  ExternalLink, 
  Percent, 
  ArrowDownRight, 
  HelpCircle,
  ShieldCheck,
  MapPin,
  FileCode,
  Smartphone,
  Printer
} from 'lucide-react';
import WhatsAppSimulatorModal from '../common/WhatsAppSimulatorModal';
import ProformaInvoiceModal from '../common/ProformaInvoiceModal';

export default function PackagingVolumeEngine({ company }) {
  const custom = company?.customMetrics || {
    plateChargeNgn: 45000,
    sampleKitNgn: 15000,
    leadTimeDays: 7,
    baseMailer500UnitNgn: 1250,
    baseMailer10kUnitNgn: 260
  };

  // State
  const [packagingType, setPackagingType] = useState('mailer'); // 'mailer' | 'rigid' | 'carton' | 'pouch' | 'label'
  const [quantity, setQuantity] = useState(2500);
  const [gsmStock, setGsmStock] = useState('350');
  const [selectedFinishes, setSelectedFinishes] = useState(['matte']); // 'matte', 'spotUv', 'goldFoil', 'emboss'
  const [preflightStatus, setPreflightStatus] = useState('idle'); // 'idle' | 'checking' | 'verified'
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [sampleKitOrdered, setSampleKitOrdered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isWhatsAppSimOpen, setIsWhatsAppSimOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Packaging Catalog Specs
  const packagingCatalog = {
    mailer: {
      name: 'E-Commerce Corrugated Mailer',
      subtitle: 'E-Flute Kraft Core with Exterior Bleed Print',
      base500: custom.baseMailer500UnitNgn || 1250,
      base10k: custom.baseMailer10kUnitNgn || 260,
      plateFee: custom.plateChargeNgn || 45000,
      moq: 500,
      unitWeightGrams: 95
    },
    rigid: {
      name: 'Luxury Rigid Magnetic Box',
      subtitle: '150gsm Art Paper Wrapped Over 1200gsm Rigid Greyboard',
      base500: 2450,
      base10k: 780,
      plateFee: 65000,
      moq: 500,
      unitWeightGrams: 280
    },
    carton: {
      name: 'Retail Mono-Carton / Medicine Box',
      subtitle: '350gsm Food-Grade Virgin Bleached Board (FBB)',
      base500: 750,
      base10k: 135,
      plateFee: 38000,
      moq: 1000,
      unitWeightGrams: 35
    },
    pouch: {
      name: 'High-Barrier Stand-Up Pouch',
      subtitle: 'PET / AL / LLDPE Triple Metallized Barrier Film with Zipper',
      base500: 980,
      base10k: 185,
      plateFee: 55000,
      moq: 2000,
      unitWeightGrams: 22
    },
    label: {
      name: 'Self-Adhesive Die-Cut Roll Labels',
      subtitle: 'White Polypropylene (PP) with Glassine Backing for Machine Applicators',
      base500: 380,
      base10k: 48,
      plateFee: 25000,
      moq: 1000,
      unitWeightGrams: 4
    }
  };

  // Finishes
  const finishCatalog = {
    matte: { name: 'Soft-Touch Matte Lamination', costFactor: 0.08, desc: 'Velvety tactile finish, scuff-resistant' },
    spotUv: { name: 'Precision Raised Spot UV', costFactor: 0.16, desc: 'High-gloss selective polymer relief' },
    goldFoil: { name: 'Hot Metallic Stamping (Gold/Silver)', costFactor: 0.22, desc: 'Brass die heat-transferred metallic foil' },
    emboss: { name: 'Blind Embossing / Debossing', costFactor: 0.12, desc: 'Multi-level sculptured structural relief' }
  };

  const currentPkg = packagingCatalog[packagingType];

  // Volume Unit Cost Calculation with economies of scale curve
  const minVol = 500;
  const maxVol = 50000;
  const logMin = Math.log(minVol);
  const logMax = Math.log(maxVol);
  const logCurrent = Math.log(Math.max(minVol, quantity));
  const t = Math.min(1, Math.max(0, (logCurrent - logMin) / (logMax - logMin)));

  // Interpolated base unit price
  const baseUnitPrice = currentPkg.base500 - t * (currentPkg.base500 - currentPkg.base10k * 0.85);

  // Add finishing surcharges
  let finishMultiplier = 1.0;
  selectedFinishes.forEach(f => {
    if (finishCatalog[f]) {
      finishMultiplier += finishCatalog[f].costFactor;
    }
  });

  const finalUnitPriceNgn = Math.round(baseUnitPrice * finishMultiplier);
  const totalProductionNgn = finalUnitPriceNgn * quantity;
  const totalOrderNgn = totalProductionNgn + currentPkg.plateFee;

  // Comparison to 500-unit price to show volume discount savings
  const totalAt500UnitPriceNgn = (currentPkg.base500 * finishMultiplier) * quantity;
  const volumeSavingsNgn = Math.max(0, totalAt500UnitPriceNgn - totalProductionNgn);
  const volumeSavingsPct = totalAt500UnitPriceNgn > 0 ? Math.round((volumeSavingsNgn / totalAt500UnitPriceNgn) * 100) : 0;

  const toggleFinish = (key) => {
    if (selectedFinishes.includes(key)) {
      if (selectedFinishes.length > 1) {
        setSelectedFinishes(selectedFinishes.filter(f => f !== key));
      }
    } else {
      setSelectedFinishes([...selectedFinishes, key]);
    }
  };

  // Pre-flight file simulation
  const handleSimulatePreflight = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setPreflightStatus('checking');
      setTimeout(() => {
        setPreflightStatus('verified');
      }, 1400);
    } else {
      setUploadedFileName('brand-packaging-die-cut.pdf');
      setPreflightStatus('checking');
      setTimeout(() => {
        setPreflightStatus('verified');
      }, 1400);
    }
  };

  const formatNgn = (val) => `₦${Math.round(val).toLocaleString()}`;

  // WhatsApp payload
  const whatsappPackagingText = `*BULK PACKAGING INQUIRY // ${company.name.toUpperCase()}*
---------------------------------------
• Product Line: ${currentPkg.name}
• Order Volume: ${quantity.toLocaleString()} Units
• Substrate Core: ${gsmStock} GSM Artboard / Board
• Finishes Applied: ${selectedFinishes.map(f => finishCatalog[f].name).join(', ')}
• Tooling & CTP Plate Charge: ${formatNgn(currentPkg.plateFee)}
---------------------------------------
*COMMERCIAL UNIT METRICS:*
• Unit Production Cost: ${formatNgn(finalUnitPriceNgn)} / unit
• Total Production Run: ${formatNgn(totalProductionNgn)}
• Total Turnkey Order: ${formatNgn(totalOrderNgn)}
• Volume Efficiency: ${volumeSavingsPct}% Bulk Cost Reduction (${formatNgn(volumeSavingsNgn)} Saved)
${preflightStatus === 'verified' ? `• Artwork Pre-Flight: VERIFIED (300DPI, CMYK, 3mm Bleed)\n` : ''}${sampleKitOrdered ? `• Sample Kit Pack: INCLUDED (₦15,000 credited back on bulk invoice)\n` : ''}---------------------------------------
Generated via ${company.name} Automated Packaging Volume Engine. Requesting print-bed allocation & die line template.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappPackagingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const phoneTarget = company.samplePhone || '2348034455667';
  const whatsappUrl = `https://wa.me/${phoneTarget}?text=${encodeURIComponent(whatsappPackagingText)}`;

  const invoiceData = {
    title: `${currentPkg.name} Commercial Print Run`,
    subtitle: `Volume: ${quantity.toLocaleString()} Pcs • ${gsmStock} GSM • ${selectedFinishes.map(f => finishCatalog[f].name).join(', ')}`,
    subtotal: totalProductionNgn,
    surcharges: currentPkg.plateFee + (sampleKitOrdered ? (custom.sampleKitNgn || 15000) : 0),
    vat: Math.round(totalOrderNgn * 0.075),
    total: totalOrderNgn + (sampleKitOrdered ? (custom.sampleKitNgn || 15000) : 0) + Math.round(totalOrderNgn * 0.075),
    items: [
      {
        name: `Core Production: ${currentPkg.name}`,
        desc: `${quantity.toLocaleString()} units on ${gsmStock} GSM stock with ${selectedFinishes.map(f => finishCatalog[f].name).join(', ')}`,
        qty: `${quantity.toLocaleString()} Pcs`,
        rate: finalUnitPriceNgn,
        total: totalProductionNgn
      },
      {
        name: 'CTP Aluminum Plates & Die-Cut Tooling',
        desc: 'High-resolution computerized thermal offset plates and custom steel-rule die',
        qty: 'Tooling Setup',
        rate: currentPkg.plateFee,
        total: currentPkg.plateFee
      },
      ...(sampleKitOrdered ? [
        {
          name: 'Pre-Production Physical Proof Swatch Pack',
          desc: 'Digital hardcopy color-matched proof (100% credited against bulk run invoice)',
          qty: '1 Kit',
          rate: custom.sampleKitNgn || 15000,
          total: custom.sampleKitNgn || 15000
        }
      ] : [])
    ]
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner: Swiss Style High-Contrast Header */}
      <div className="bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-200 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-700 dark:text-blue-400 font-semibold">Bulk Production Engine</span>
              <span className="text-[10px] font-mono bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-500/40 font-semibold">
                Turnaround: {custom.leadTimeDays || 7} Working Days
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Interactive sliding-scale unit costing & automated pre-flight for <strong className="text-slate-900 dark:text-white">{company.name}</strong>.
            </p>
          </div>
        </div>

        {/* 1-Click Sample Kit Button */}
        <button
          onClick={() => setSampleKitOrdered(!sampleKitOrdered)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
            sampleKitOrdered
              ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/30 font-bold'
              : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400 shadow-sm'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span>{sampleKitOrdered ? 'Sample Kit Added (₦15,000)' : 'Order Prototype Sample Kit'}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Volume Slider, Packaging Types & Finishes (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 backdrop-blur-sm shadow-xl dark:shadow-2xl transition-colors duration-200">
          
          {/* Packaging Type Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-blue-700 dark:text-blue-400 uppercase tracking-widest font-bold">
                01 // Select Packaging Category
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Commercial press specifications</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(packagingCatalog).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPackagingType(key)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    packagingType === key
                      ? 'bg-blue-50 border-blue-500 text-slate-900 dark:bg-blue-950/40 dark:border-blue-500 dark:text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.name}</span>
                    {packagingType === key && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{item.subtitle}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Volume Scale Slider & Preset Buttons */}
          <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-blue-700 dark:text-blue-400 uppercase tracking-widest font-bold block">
                  02 // Production Volume Scale (Units)
                </span>
                <span className="text-[11px] text-slate-500">Notice the sharp unit price drop across volume tiers</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg shadow-sm">
                <input
                  type="number"
                  min="500"
                  max="100000"
                  step="500"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(500, Number(e.target.value)))}
                  className="w-20 bg-transparent text-right font-mono text-sm font-bold text-blue-700 dark:text-blue-400 focus:outline-none"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Pcs</span>
              </div>
            </div>

            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
            />

            {/* Quick volume presets */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {[500, 1000, 2500, 5000, 10000, 25000, 50000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setQuantity(val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    quantity === val
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {val.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Economies of scale indicator strip */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 p-3 rounded-lg flex items-center justify-between text-xs shadow-sm">
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <ArrowDownRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Unit cost progression:
              </span>
              <div className="flex items-center gap-4 font-mono text-xs">
                <span className="text-slate-500">500 units: ~{formatNgn(currentPkg.base500)}/ea</span>
                <span className="text-blue-700 dark:text-blue-400 font-bold">➔ At {quantity.toLocaleString()}: {formatNgn(finalUnitPriceNgn)}/ea</span>
              </div>
            </div>
          </div>

          {/* Substrate GSM & Finishing Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-blue-700 dark:text-blue-400 uppercase tracking-widest font-bold">
                03 // Premium Embellishments & Coatings
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Multi-select finishing options</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(finishCatalog).map(([key, fin]) => {
                const isChecked = selectedFinishes.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleFinish(key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isChecked
                        ? 'bg-blue-50 border-blue-500 text-slate-900 dark:bg-blue-950/30 dark:border-blue-500/70 dark:text-slate-100 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{fin.name}</span>
                      <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400 font-bold">+{Math.round(fin.costFactor * 100)}%</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{fin.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Automated Artwork Pre-Flight Checker */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-blue-700 dark:text-blue-400 uppercase tracking-widest font-bold flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                04 // Automated Artwork Pre-Flight
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">AI / PDF / EPS Validator</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:border-blue-500/50 transition-colors">
              {preflightStatus === 'idle' && (
                <div className="space-y-2">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                  <div>
                    <label className="text-xs text-blue-700 dark:text-blue-400 font-semibold cursor-pointer hover:underline">
                      Upload Print-Ready Vector PDF / AI
                      <input 
                        type="file" 
                        accept=".pdf,.ai,.eps" 
                        className="hidden" 
                        onChange={handleSimulatePreflight} 
                      />
                    </label>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Or click here to test automated 300DPI, CMYK & 3mm Bleed Pre-Flight simulation.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSimulatePreflight({})}
                    className="text-[11px] bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                  >
                    Simulate Pre-Flight File Check
                  </button>
                </div>
              )}

              {preflightStatus === 'checking' && (
                <div className="py-4 space-y-2">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-mono">Running pre-flight raster & vector analysis...</p>
                </div>
              )}

              {preflightStatus === 'verified' && (
                <div className="space-y-2 text-left bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/30 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Pre-Flight Passed: {uploadedFileName || 'brand-packaging-die-cut.pdf'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreflightStatus('idle')}
                      className="text-[10px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 underline font-mono"
                    >
                      Reset File
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-emerald-900 dark:text-slate-300 pt-1">
                    <span className="text-emerald-700 dark:text-emerald-400">✓ Color Profile: Fogra39 CMYK</span>
                    <span className="text-emerald-700 dark:text-emerald-400">✓ Resolution: 300 DPI Verified</span>
                    <span className="text-emerald-700 dark:text-emerald-400">✓ Exterior Bleed: 3.0mm Included</span>
                    <span className="text-emerald-700 dark:text-emerald-400">✓ Fonts: Outlined & Embedded</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Volume Quote Summary & Sample Checkout (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl dark:shadow-2xl relative transition-colors duration-200">
            
            <div className="space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-blue-700 dark:text-blue-400 font-bold">Turnkey Commercial Quote</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {company.name} Packaging Run
                  </h3>
                </div>
                <span className="text-xs font-mono bg-blue-50 dark:bg-slate-950 border border-blue-200 dark:border-slate-800 px-2.5 py-1 rounded-lg text-blue-700 dark:text-blue-400 font-bold">
                  {quantity.toLocaleString()} Pcs
                </span>
              </div>

              {/* Volume Savings Callout */}
              <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 rounded-xl p-3 text-xs text-blue-900 dark:text-blue-300 flex items-center justify-between">
                <div>
                  <span className="block font-semibold">Bulk Production Efficiency</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Saved vs. low-volume baseline</span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold block">-{volumeSavingsPct}% Discount</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{formatNgn(volumeSavingsNgn)} Saved</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Unit Cost at {quantity.toLocaleString()} Pcs</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">Includes substrate & selected finishes</span>
                  </div>
                  <span className="font-mono font-bold text-blue-700 dark:text-blue-400 text-base tabular-nums">
                    {formatNgn(finalUnitPriceNgn)} <span className="text-xs text-slate-500 font-normal">/ unit</span>
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Bulk Production Subtotal</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">{quantity.toLocaleString()} x {formatNgn(finalUnitPriceNgn)}</span>
                  </div>
                  <span className="font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">{formatNgn(totalProductionNgn)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">CTP Aluminum Plates & Die-Tooling</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">One-time setup fee (waived on re-orders)</span>
                  </div>
                  <span className="font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">{formatNgn(currentPkg.plateFee)}</span>
                </div>

                {sampleKitOrdered && (
                  <div className="flex justify-between items-center text-amber-700 dark:text-amber-300 pt-1 border-t border-slate-200 dark:border-slate-800/60">
                    <div>
                      <span className="text-xs block font-semibold">Prototype Sample Proof Pack</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">100% credited against bulk order invoice</span>
                    </div>
                    <span className="font-mono font-medium tabular-nums">{formatNgn(custom.sampleKitNgn || 15000)}</span>
                  </div>
                )}
              </div>

              {/* Total Card */}
              <div className="bg-slate-50 dark:bg-slate-950 border-2 border-blue-500/40 rounded-xl p-4 space-y-1 shadow-sm">
                <span className="text-[11px] font-mono text-blue-700 dark:text-blue-400 uppercase tracking-wider block font-bold">
                  Total Production Order Value
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
                  {formatNgn(totalOrderNgn + (sampleKitOrdered ? (custom.sampleKitNgn || 15000) : 0))}
                </div>
                <p className="text-[10px] text-slate-500 pt-1">
                  *Delivery within {custom.leadTimeDays || 7} working days upon CTP pre-flight sign-off.
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
                  <span>Dispatch Quote via WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWhatsAppSimOpen(true)}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>WhatsApp Simulator</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsInvoiceOpen(true)}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Proforma PDF</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Packaging Spec Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span>Copy Turnkey Packaging Spec</span>
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
                <span className="font-mono text-blue-700 dark:text-blue-400/80 font-medium">Automated CTP Proofing</span>
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
        payloadText={whatsappPackagingText}
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

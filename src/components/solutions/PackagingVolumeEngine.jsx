import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Layers, 
  Sparkles, 
  FileCheck, 
  UploadCloud, 
  Send, 
  ExternalLink, 
  Copy, 
  Check, 
  Sliders, 
  ShoppingCart, 
  Award, 
  MapPin, 
  AlertCircle,
  TrendingDown,
  Printer,
  Smartphone,
  Link2
} from 'lucide-react';
import WhatsAppSimulatorModal from '../common/WhatsAppSimulatorModal';
import ProformaInvoiceModal from '../common/ProformaInvoiceModal';
import { getHashParams, updateHashParams, buildShareUrl } from '../../utils/urlState';

export default function PackagingVolumeEngine({ company }) {
  const custom = company?.customMetrics || {
    plateChargeNgn: 45000,
    sampleKitNgn: 15000,
    baseMailer500UnitNgn: 1250,
    baseMailer10kUnitNgn: 260
  };

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

  // Read initial configuration from URL params
  const initialParams = getHashParams();

  // State
  const [packagingType, setPackagingType] = useState(
    initialParams.pkg && packagingCatalog[initialParams.pkg] ? initialParams.pkg : 'mailer'
  );
  const [quantity, setQuantity] = useState(
    initialParams.qty ? Math.max(500, Math.min(50000, Number(initialParams.qty))) : 2500
  );
  const [gsmStock, setGsmStock] = useState(initialParams.gsm || '350');
  const [selectedFinishes, setSelectedFinishes] = useState(
    initialParams.finishes ? initialParams.finishes.split(',').filter(f => finishCatalog[f]) : ['matte']
  );
  const [preflightStatus, setPreflightStatus] = useState('idle');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [sampleKitOrdered, setSampleKitOrdered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isWhatsAppSimOpen, setIsWhatsAppSimOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Sync state to URL hash query parameters on change
  useEffect(() => {
    updateHashParams({
      pkg: packagingType,
      qty: quantity,
      gsm: gsmStock,
      finishes: selectedFinishes.join(',')
    }, company?.slug);
  }, [packagingType, quantity, gsmStock, selectedFinishes, company?.slug]);

  const currentPkg = packagingCatalog[packagingType] || packagingCatalog.mailer;

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

  const formatNgn = (val) => `₦${Math.round(val).toLocaleString()}`;

  // Pre-flight file simulation
  const handlePreflightUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      setPreflightStatus('checking');
      setTimeout(() => {
        setPreflightStatus('verified');
      }, 1500);
    }
  };

  // WhatsApp Packaging RFQ Payload
  const whatsappPackagingText = `*BULK PRINT & PACKAGING RFQ // ${company.name.toUpperCase()}*
---------------------------------------
• Product Format: ${currentPkg.name}
• Order Volume: ${quantity.toLocaleString()} Units (MOQ: ${currentPkg.moq})
• Board Substrate: ${gsmStock} GSM High-Yield Rigid Board
• Premium Finishes: ${selectedFinishes.map(f => finishCatalog[f].name).join(' + ')}
• CTP Pre-Flight Status: ${preflightStatus === 'verified' ? `VERIFIED (File: ${uploadedFileName || 'vector.ai'})` : 'Awaiting vector upload'}
• Sample Kit Request: ${sampleKitOrdered ? 'YES (+₦15,000 credited to invoice)' : 'NO (Direct Bulk Run)'}
---------------------------------------
*PRODUCTION INVESTMENT BREAKDOWN:*
• Unit Cost: ${formatNgn(finalUnitPriceNgn)} / unit (Saved ${volumeSavingsPct}% via volume tier)
• Bulk Run Subtotal: ${formatNgn(totalProductionNgn)}
• CTP Plates & Die-Cutting Tooling: ${formatNgn(currentPkg.plateFee)}
${sampleKitOrdered ? `• Physical Sample Proofing Pack: ${formatNgn(custom.sampleKitNgn || 15000)}\n` : ''}---------------------------------------
*TOTAL ESTIMATED PRODUCTION: ${formatNgn(totalOrderNgn + (sampleKitOrdered ? (custom.sampleKitNgn || 15000) : 0))}*
---------------------------------------
Generated via ${company.name} Automated Intake Engine. Requesting official proforma invoice and press-run slot.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappPackagingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleCopyShareLink = () => {
    const shareUrl = buildShareUrl(company.slug, {
      pkg: packagingType,
      qty: quantity,
      gsm: gsmStock,
      finishes: selectedFinishes.join(',')
    });
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const phoneTarget = company.samplePhone || '2348033045612';
  const whatsappUrl = `https://wa.me/${phoneTarget}?text=${encodeURIComponent(whatsappPackagingText)}`;

  const invoiceData = {
    title: `${currentPkg.name} Bulk Packaging Quotation`,
    subtitle: `Volume: ${quantity.toLocaleString()} Units • ${gsmStock} GSM • ${selectedFinishes.map(f => finishCatalog[f].name).join(', ')}`,
    subtotal: totalOrderNgn,
    surcharges: sampleKitOrdered ? (custom.sampleKitNgn || 15000) : 0,
    vat: Math.round(totalOrderNgn * 0.075),
    total: totalOrderNgn + (sampleKitOrdered ? (custom.sampleKitNgn || 15000) : 0) + Math.round(totalOrderNgn * 0.075),
    items: [
      {
        name: `Custom Packaging Production: ${currentPkg.name}`,
        desc: `${quantity.toLocaleString()} units @ ${formatNgn(finalUnitPriceNgn)}/unit (${gsmStock} GSM substrate with specialty finishes)`,
        qty: `${quantity.toLocaleString()} Units`,
        rate: finalUnitPriceNgn,
        total: totalProductionNgn
      },
      {
        name: 'CTP Aluminum Thermal Plates & Steel Rule Cutting Dies',
        desc: 'One-time computerized plate output & laser-cut die rule manufacturing',
        qty: '1 Setup',
        rate: currentPkg.plateFee,
        total: currentPkg.plateFee
      },
      ...(sampleKitOrdered ? [{
        name: 'Physical Prototype Sample Box & Calibration Proof',
        desc: 'Digital plot proof sample delivered in Lagos before full press run (credited on balance)',
        qty: '1 Pack',
        rate: custom.sampleKitNgn || 15000,
        total: custom.sampleKitNgn || 15000
      }] : [])
    ]
  };

  // Helper to calculate tier prices for the matrix
  const calculateTierUnit = (vol) => {
    const logCur = Math.log(Math.max(minVol, vol));
    const ratio = Math.min(1, Math.max(0, (logCur - logMin) / (logMax - logMin)));
    const base = currentPkg.base500 - ratio * (currentPkg.base500 - currentPkg.base10k * 0.85);
    return Math.round(base * finishMultiplier);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-mono text-slate-900 dark:text-slate-100">
      
      {/* Top Banner: Sliding Scale Volume Engine (Brutalist) */}
      <div className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-black text-blue-400 dark:bg-blue-600 dark:text-white flex items-center justify-center font-black shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-black">
                Bulk Print & Packaging Factory
              </span>
              <span className="text-[11px] px-2 py-0.5 border font-bold uppercase bg-blue-100 text-blue-900 border-blue-500 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-500">
                Lagos Industrial Converter
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400 font-sans mt-0.5">
              Sliding-scale MOQ curves, Spot UV / Gold Foil finishes & CTP pre-flight engine for <strong className="text-black dark:text-white font-mono">{company.name}</strong>.
            </p>
          </div>
        </div>

        {/* Action Controls: Share Link + Sample Kit */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="min-h-[44px] px-4 py-2 border-2 border-black dark:border-zinc-700 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            title="Copy sharable URL preserving all current volume and finish parameters"
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
            onClick={() => setSampleKitOrdered(!sampleKitOrdered)}
            className={`min-h-[44px] px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
              sampleKitOrdered
                ? 'bg-amber-500 text-black border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-black text-white dark:bg-zinc-800 dark:text-amber-300 border-black dark:border-zinc-700 hover:bg-zinc-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{sampleKitOrdered ? 'Sample Kit Added' : 'Add Sample Kit (₦15k)'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Responsive 12-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Packaging Customizer (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-5 sm:p-6 space-y-6">
          
          {/* Step 1: Packaging Format */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-black/10 dark:border-zinc-800 pb-2">
              <span className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-black">
                01 // Packaging Product Typology
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Select structural box or pouch</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {Object.entries(packagingCatalog).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPackagingType(key)}
                  className={`min-h-[44px] p-3 border-2 text-left transition-all cursor-pointer ${
                    packagingType === key
                      ? 'bg-blue-600 text-white border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-slate-50 dark:bg-zinc-900 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-black dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-tight">{item.name.split('(')[0]}</span>
                    {packagingType === key && <Check className="w-4 h-4 text-white shrink-0" />}
                  </div>
                  <span className="text-[10px] font-mono block opacity-80 mt-1">MOQ: {item.moq.toLocaleString()} pcs</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Sliding-Scale Volume Slider */}
          <div className="border-2 border-black dark:border-zinc-800 p-4 bg-slate-50 dark:bg-zinc-900 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 dark:border-zinc-800 pb-2">
              <span className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-black">
                02 // Sliding Production Volume
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="500"
                  max="50000"
                  step="500"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(500, Math.min(50000, Number(e.target.value))))}
                  className="w-24 min-h-[44px] bg-white dark:bg-black border-2 border-black dark:border-zinc-700 px-3 py-1 text-center font-mono text-sm font-bold text-slate-900 dark:text-white"
                />
                <span className="text-xs font-bold uppercase">Units</span>
              </div>
            </div>

            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-3 bg-slate-300 dark:bg-zinc-800 border border-black dark:border-zinc-700 appearance-none"
            />

            {/* Quick volume buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[1000, 5000, 10000, 25000].map(vol => (
                <button
                  key={vol}
                  type="button"
                  onClick={() => setQuantity(vol)}
                  className={`min-h-[44px] py-1 text-xs font-bold border transition-all cursor-pointer ${
                    quantity === vol
                      ? 'bg-black text-blue-400 border-black dark:bg-white dark:text-black'
                      : 'bg-white dark:bg-zinc-950 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-black'
                  }`}
                >
                  {vol >= 1000 ? `${vol / 1000}k` : vol}
                </button>
              ))}
            </div>
          </div>

          {/* Volume Scale Price Comparison Table (Horizontal Scrollable) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-black">
                Economies of Scale Matrix
              </span>
              <span className="text-xs text-slate-500">Unit cost breakdown</span>
            </div>
            <div className="w-full overflow-x-auto border-2 border-black dark:border-zinc-800">
              <table className="w-full min-w-max text-left text-xs font-mono">
                <thead className="bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 uppercase text-[10px] border-b border-black dark:border-zinc-800">
                  <tr>
                    <th className="p-2.5">Tier Volume</th>
                    <th className="p-2.5 text-center">Unit Price (₦)</th>
                    <th className="p-2.5 text-center">Discount</th>
                    <th className="p-2.5 text-right">Batch Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-900 text-slate-800 dark:text-zinc-200">
                  {[500, 2500, 10000, 25000, 50000].map(vol => {
                    const unitPrice = calculateTierUnit(vol);
                    const isCurrentTier = (quantity >= vol * 0.7 && quantity <= vol * 1.3) || (vol === 50000 && quantity > 35000);
                    const disc = Math.round((1 - unitPrice / calculateTierUnit(500)) * 100);
                    return (
                      <tr key={vol} className={isCurrentTier ? 'bg-blue-50 dark:bg-blue-950/40 font-bold' : ''}>
                        <td className="p-2.5 tabular-nums">
                          {vol.toLocaleString()} units
                          {isCurrentTier && <span className="ml-2 text-[10px] text-blue-600 dark:text-blue-400 uppercase font-black">← Active</span>}
                        </td>
                        <td className="p-2.5 text-center font-bold tabular-nums text-blue-700 dark:text-blue-400">
                          {formatNgn(unitPrice)}
                        </td>
                        <td className="p-2.5 text-center tabular-nums text-emerald-600 font-bold">
                          {disc > 0 ? `-${disc}%` : 'Base'}
                        </td>
                        <td className="p-2.5 text-right tabular-nums font-mono">
                          {formatNgn(unitPrice * vol + currentPkg.plateFee)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Step 3: Specialty Finishes & GSM */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-black/10 dark:border-zinc-800 pb-2">
              <span className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-black">
                03 // Premium Finishes & Embellishments
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Select multiple options</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(finishCatalog).map(([key, fin]) => {
                const active = selectedFinishes.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleFinish(key)}
                    className={`min-h-[44px] p-3 border-2 text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-blue-600 text-white border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-slate-50 dark:bg-zinc-900 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-black dark:hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase">{fin.name}</span>
                      <span className="text-[10px] font-mono font-bold bg-black text-white px-1.5 py-0.5">+{Math.round(fin.costFactor * 100)}%</span>
                    </div>
                    <p className="text-[11px] opacity-80 mt-1 font-sans">{fin.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Automated Artwork Pre-Flight Checker */}
          <div className="border-2 border-black dark:border-zinc-800 p-4 bg-slate-50 dark:bg-zinc-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-black flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                04 // CTP Pre-Flight Artwork Verification
              </span>
              <span className="text-xs text-slate-500">CMYK 300 DPI</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="min-h-[44px] flex-1 w-full bg-white dark:bg-black border-2 border-dashed border-black dark:border-zinc-700 p-3 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase">{uploadedFileName || 'Upload .AI / .PDF / .EPS Vector File'}</span>
                <input type="file" accept=".pdf,.ai,.eps,.cdr" onChange={handlePreflightUpload} className="hidden" />
              </label>

              {preflightStatus === 'checking' && (
                <span className="text-xs font-bold text-amber-600 animate-pulse">Analyzing color profiles...</span>
              )}

              {preflightStatus === 'verified' && (
                <div className="bg-emerald-100 dark:bg-emerald-950 border border-emerald-500 px-3 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>3mm Bleed & CMYK Verified</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Commercial Summary & WhatsApp Dispatch (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] relative">
            
            <div className="space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-zinc-800">
                <div>
                  <span className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-black">
                    Packaging Production Order
                  </span>
                  <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white">
                    {company.name} Quote
                  </h3>
                </div>
                <span className="text-xs font-mono bg-black text-blue-400 px-3 py-1 font-black">
                  {quantity.toLocaleString()} Pcs
                </span>
              </div>

              {/* Volume Savings Banner */}
              {volumeSavingsPct > 0 && (
                <div className="bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-600 p-3 text-xs text-emerald-900 dark:text-emerald-300 flex items-center justify-between font-bold">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    <span>Scale discount active ({volumeSavingsPct}% off base unit rate).</span>
                  </div>
                  <strong className="font-mono tabular-nums text-emerald-900 dark:text-emerald-200">
                    Saved {formatNgn(volumeSavingsNgn)}
                  </strong>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-slate-700 dark:text-zinc-300">
                  <div>
                    <span className="text-xs text-slate-500 block">Unit Cost @ {quantity.toLocaleString()} Pcs</span>
                    <span className="text-[11px] text-slate-400 font-sans">{selectedFinishes.length} Finishes Included</span>
                  </div>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-base tabular-nums">
                    {formatNgn(finalUnitPriceNgn)} <span className="text-xs text-slate-500 font-normal">/ unit</span>
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-700 dark:text-zinc-300">
                  <div>
                    <span className="text-xs text-slate-500 block">Bulk Production Subtotal</span>
                    <span className="text-[11px] text-slate-400 font-sans">{quantity.toLocaleString()} x {formatNgn(finalUnitPriceNgn)}</span>
                  </div>
                  <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">{formatNgn(totalProductionNgn)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-700 dark:text-zinc-300">
                  <div>
                    <span className="text-xs text-slate-500 block">CTP Plates & Laser Cutting Dies</span>
                    <span className="text-[11px] text-slate-400 font-sans">One-time tooling fee</span>
                  </div>
                  <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">{formatNgn(currentPkg.plateFee)}</span>
                </div>

                {sampleKitOrdered && (
                  <div className="flex justify-between items-center text-amber-700 dark:text-amber-400 pt-1 border-t border-slate-200 dark:border-zinc-800">
                    <div>
                      <span className="text-xs font-bold block">Prototype Sample Proof Pack</span>
                      <span className="text-[11px] text-slate-400 font-sans">Credited on bulk order</span>
                    </div>
                    <span className="font-mono font-bold tabular-nums">{formatNgn(custom.sampleKitNgn || 15000)}</span>
                  </div>
                )}
              </div>

              {/* Total Order Card */}
              <div className="bg-slate-50 dark:bg-black border-2 border-black dark:border-blue-500 p-4 space-y-1">
                <span className="text-xs uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 block">
                  Total Production Order Value
                </span>
                <div className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
                  {formatNgn(totalOrderNgn + (sampleKitOrdered ? (custom.sampleKitNgn || 15000) : 0))}
                </div>
                <p className="text-[10px] text-slate-500 pt-1 font-sans">
                  *Delivery within {custom.leadTimeDays || 7} working days upon CTP pre-flight sign-off.
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
                  <span>Dispatch Quote via WhatsApp</span>
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
                    <Printer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
                        <span className="text-emerald-700 dark:text-emerald-400">Spec Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                        <span>Copy Raw Spec</span>
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
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold uppercase">
                  Automated CTP Proofing
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

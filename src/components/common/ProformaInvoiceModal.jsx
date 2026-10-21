import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  CreditCard, 
  FileText,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export default function ProformaInvoiceModal({ isOpen, onClose, company, invoiceData }) {
  if (!isOpen) return null;

  const invoiceNumber = `PI-LAGOS-${String(company.id).padStart(2, '0')}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const validUntil = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatNgn = (val) => `₦${Math.round(val || 0).toLocaleString()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in">
      <div className="w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-300">
        
        {/* Top Action Bar (Hidden during Print) */}
        <div className="bg-slate-900 text-slate-100 px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase">
              Official Commercial Proforma Invoice Preview
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Page */}
        <div className="p-8 md:p-12 space-y-8 font-sans bg-white print:p-6 text-slate-800">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md"
                  style={{ backgroundColor: company.primaryColor || '#D97706' }}
                >
                  {company.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{company.name}</h1>
                  <span className="text-xs font-medium text-slate-500 block">{company.sectorLabel}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {company.location}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                RC Registration: RC-{Math.floor(100000 + company.id * 18492)} • Tax ID: 24890{company.id}-0001
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-700 font-bold block">
                PROFORMA INVOICE
              </span>
              <span className="text-sm font-bold font-mono text-slate-900 block">{invoiceNumber}</span>
              <div className="text-xs text-slate-500 pt-1 space-y-0.5">
                <div>Date: <strong className="text-slate-800">{today}</strong></div>
                <div>Validity: <strong className="text-slate-800">{validUntil} (14 Days)</strong></div>
              </div>
            </div>
          </div>

          {/* Bill To & Corridor Delivery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold mb-1">
                COMMERCIAL CLIENT (BILL TO)
              </span>
              <p className="font-bold text-slate-900 text-sm">Enterprise Procurement Desk</p>
              <p className="text-slate-600 mt-0.5">Corporate Account & Supply Chain Management</p>
              <p className="text-slate-500">Lagos Commercial Corridor, Nigeria</p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold mb-1">
                LOGISTICS & SITE SPECIFICATION
              </span>
              <p className="font-bold text-slate-900 text-sm">{invoiceData?.title || 'Commercial Project Scope'}</p>
              <p className="text-slate-600 mt-0.5">{invoiceData?.subtitle || 'Standard Contract Terms'}</p>
              <p className="text-slate-500 font-mono">Corridor: {company.location}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-mono uppercase text-[11px] border-b border-slate-300">
                <tr>
                  <th className="py-2.5 px-3">Description & Specification</th>
                  <th className="py-2.5 px-3 text-center">Qty / Metrics</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate (₦)</th>
                  <th className="py-2.5 px-3 text-right">Total (₦)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoiceData?.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3">
                      <strong className="block text-slate-900">{item.name}</strong>
                      <span className="text-[11px] text-slate-500">{item.desc}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-700">{item.qty}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700">{formatNgn(item.rate)}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">{formatNgn(item.total)}</td>
                  </tr>
                )) || (
                  <tr>
                    <td className="py-3 px-3" colSpan="4">Standard turnkey quotation details applied.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200">
            
            {/* Remittance Banking Instructions */}
            <div className="text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 max-w-sm">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                Direct Wire Remittance Instructions
              </span>
              <p className="text-slate-700">Bank: <strong className="text-slate-900">Guaranty Trust Bank (GTBank) / Zenith Bank</strong></p>
              <p className="text-slate-700">Account Name: <strong className="text-slate-900">{company.name} Commercial Ltd</strong></p>
              <p className="text-slate-700 font-mono">Account No: <strong className="text-slate-900">0129849201 (NGN Corporate)</strong></p>
              <p className="text-[10px] text-slate-400 pt-1">
                *Please quote invoice #{invoiceNumber} on wire transfer remarks.
              </p>
            </div>

            {/* Calculations Table */}
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Net:</span>
                <span className="font-mono font-medium text-slate-900">{formatNgn(invoiceData?.subtotal || invoiceData?.total)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Statutory Surcharges / Port:</span>
                <span className="font-mono font-medium text-slate-900">{formatNgn(invoiceData?.surcharges || 0)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Value Added Tax (VAT 7.5%):</span>
                <span className="font-mono font-medium text-slate-900">{formatNgn(invoiceData?.vat || 0)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-slate-900 text-sm font-black text-slate-900">
                <span>TOTAL DUE:</span>
                <span className="font-mono text-base text-amber-800">{formatNgn(invoiceData?.total)}</span>
              </div>
            </div>

          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-600 flex items-center justify-center text-amber-700 font-bold text-[9px] uppercase text-center p-1 font-mono">
                Official Lagos Seal
              </div>
              <div>
                <span className="block font-bold text-slate-800">{company.name} Operations Desk</span>
                <span className="text-[10px] text-slate-400">Electronic Verification Hash: 9f8a2-c4e1</span>
              </div>
            </div>

            <div className="text-right">
              <div className="w-40 border-b border-slate-400 mb-1" />
              <span className="font-mono text-[10px] uppercase block text-slate-400">Authorized Commercial Signatory</span>
              <span className="text-slate-700 font-medium">{company.targetPersona}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

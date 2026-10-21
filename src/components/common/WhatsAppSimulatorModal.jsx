import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCheck, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Mic, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles,
  FileText,
  Building2
} from 'lucide-react';

export default function WhatsAppSimulatorModal({ isOpen, onClose, company, payloadText, onOpenInvoice }) {
  const [copied, setCopied] = useState(false);
  const [showReply, setShowReply] = useState(true);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(payloadText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const phoneTarget = company?.samplePhone || '2348033045612';
  const whatsappWebUrl = `https://wa.me/${phoneTarget}?text=${encodeURIComponent(payloadText)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Control Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Live WhatsApp Business Simulator
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Smartphone Shell */}
        <div className="flex-1 flex flex-col bg-[#0B141B] text-slate-100 overflow-hidden font-sans">
          
          {/* WhatsApp Header */}
          <div className="bg-[#1F2C34] px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                style={{ backgroundColor: company?.primaryColor || '#10B981' }}
              >
                {company?.name?.slice(0, 2).toUpperCase() || 'WA'}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-100 leading-tight">
                  {company?.name || 'Commercial Desk'}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Verified Business Account • Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <Video className="w-4 h-4 opacity-70 hover:opacity-100 cursor-pointer" />
              <Phone className="w-4 h-4 opacity-70 hover:opacity-100 cursor-pointer" />
              <MoreVertical className="w-4 h-4 opacity-70 hover:opacity-100 cursor-pointer" />
            </div>
          </div>

          {/* Chat Messages Body with WhatsApp Wallpaper Pattern */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0B141B] text-xs">
            
            {/* Encryption Notice */}
            <div className="text-center my-2">
              <span className="bg-[#182229] text-amber-200/80 px-3 py-1 rounded-lg text-[10px] inline-block shadow-sm border border-amber-500/10 max-w-[85%] leading-relaxed">
                🔒 Messages are end-to-end encrypted. This business uses automated rate dispatch verified for Lagos commercial hubs.
              </span>
            </div>

            {/* Outgoing Message (from user / customer) */}
            <div className="flex justify-end">
              <div className="bg-[#005C4B] text-slate-100 rounded-2xl rounded-tr-sm p-3 max-w-[88%] shadow-md space-y-1.5 border border-emerald-600/20">
                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-emerald-50">
                  {payloadText}
                </pre>
                <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-300/80 pt-0.5">
                  <span>10:44 AM</span>
                  <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
            </div>

            {/* Automated Business Confirmation Reply */}
            {showReply && (
              <div className="flex justify-start animate-in">
                <div className="bg-[#202C33] text-slate-100 rounded-2xl rounded-tl-sm p-3 max-w-[88%] shadow-md space-y-2 border border-slate-700/40">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{company?.name} Automated Desk</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed text-xs">
                    Hello! We have received your preliminary specifications. A senior estimator has locked in your priority rate.
                  </p>
                  
                  {/* Interactive Buttons inside WhatsApp message */}
                  <div className="space-y-1 pt-1">
                    {onOpenInvoice && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenInvoice();
                        }}
                        className="w-full bg-[#182229] hover:bg-[#2A3942] text-emerald-400 text-xs font-semibold py-2 px-3 rounded-lg border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Commercial Proforma Invoice</span>
                      </button>
                    )}
                    <a
                      href={whatsappWebUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#00A884] hover:bg-[#008F6F] text-slate-950 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Continue to Official WhatsApp</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-end text-[10px] text-slate-400 pt-0.5">
                    <span>10:45 AM</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Fake Input Bar */}
          <div className="bg-[#202C33] p-2 flex items-center gap-2 border-t border-slate-800">
            <Smile className="w-5 h-5 text-slate-400" />
            <Paperclip className="w-5 h-5 text-slate-400" />
            <div className="flex-1 bg-[#2A3942] text-slate-400 px-3 py-1.5 rounded-xl text-xs">
              Type a response...
            </div>
            <div className="w-8 h-8 rounded-full bg-[#00A884] flex items-center justify-center text-slate-950">
              <Mic className="w-4 h-4" />
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-slate-950 p-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 px-3 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Payload!' : 'Copy Text Payload'}</span>
          </button>

          <a
            href={whatsappWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Launch WhatsApp Web</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>

      </div>
    </div>
  );
}

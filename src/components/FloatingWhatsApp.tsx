"use client";

import { Phone, MessageCircle } from "lucide-react";
import { trackContactClick } from "@/lib/analytics";
import { PHONE_TEL_LINK, WHATSAPP_LINK } from "@/lib/constants";

export default function FloatingWhatsApp() {
  return (
    <>
      {/* Mobile Sticky Bar (Always visible at bottom without scroll) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A110B]/95 backdrop-blur-md border-t border-[#C5A059]/40 p-2.5 sm:hidden flex items-center gap-2 shadow-2xl">
        <a
          href={PHONE_TEL_LINK}
          onClick={() => trackContactClick('call')}
          className="flex-1 bg-[#C5A059] hover:bg-[#B08B46] text-white py-2.5 px-3 rounded-lg text-xs font-alexandria font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
        >
          <Phone className="w-4 h-4" />
          <span>📞 اتصل الآن</span>
        </a>
        <a
          href={WHATSAPP_LINK}
          onClick={() => trackContactClick('whatsapp')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#25D366] hover:bg-[#1ebd59] text-white py-2.5 px-3 rounded-lg text-xs font-alexandria font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
        >
          <MessageCircle className="w-4 h-4" />
          <span>💬 واتساب</span>
        </a>
      </div>

      {/* Desktop Floating Quick Contact Actions */}
      <div className="hidden sm:flex fixed bottom-6 left-6 z-40 flex-col gap-2.5">
        <a
          href={PHONE_TEL_LINK}
          onClick={() => trackContactClick('call')}
          className="bg-[#1A110B] hover:bg-[#2A1D15] text-[#FAF8F5] px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 font-alexandria text-xs font-bold border border-[#C5A059]/50 group"
          aria-label="اتصل الآن"
        >
          <Phone className="w-4 h-4 text-[#C5A059]" />
          <span>📞 اتصل الآن</span>
        </a>
        <a
          href={WHATSAPP_LINK}
          onClick={() => trackContactClick('whatsapp')}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#1ebd59] text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 font-alexandria text-xs font-bold border border-white/20 group"
          aria-label="تواصل عبر الواتساب"
        >
          <MessageCircle className="w-5 h-5 text-white" />
          <span>💬 طلب سريع عبر الواتساب</span>
        </a>
      </div>
    </>
  );
}

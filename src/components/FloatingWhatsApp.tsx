"use client";

import { MessageCircle } from "lucide-react";
import { trackContactClick } from "@/lib/analytics";
import { WHATSAPP_LINK } from "@/lib/constants";

export default function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a
        href={WHATSAPP_LINK}
        onClick={() => trackContactClick("whatsapp")}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebd59] text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white cursor-pointer"
        aria-label="تواصل عبر الواتساب"
        title="تواصل معنا عبر الواتساب"
      >
        {/* Subtle Pulse Animation */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none opacity-75" />

        <MessageCircle className="w-7 h-7 text-white fill-current" />

        {/* Tooltip on Hover */}
        <span className="absolute right-16 px-3 py-1.5 bg-[#1A110B] text-white text-xs font-alexandria font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-[#C5A059]/40">
          تواصل عبر الواتساب
        </span>
      </a>
    </div>
  );
}

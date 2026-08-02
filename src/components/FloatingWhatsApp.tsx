"use client";

import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const handleWhatsAppClick = () => {
    const message = "أهلاً بن بدران 👋 أرغب في التحدث معكم أو إتمام طلب قهوة.";
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/201020499680?text=${encoded}`, "_blank");
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 left-6 z-40 bg-[#25D366] hover:bg-[#1ebd59] text-white p-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 flex items-center gap-2 font-alexandria text-xs font-bold border border-white/20 group"
      aria-label="تواصل عبر الواتساب"
    >
      <MessageCircle className="w-5 h-5 text-white" />
      <span className="hidden sm:inline">طلب سريع عبر الواتساب</span>
    </button>
  );
}

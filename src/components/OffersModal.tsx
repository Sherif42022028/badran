"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SpecialOffer, getActiveOffers } from "@/data/offers";
import { WHATSAPP_NUMBER } from "@/config/whatsapp";
import { buildWhatsAppLink } from "@/lib/whatsapp/buildWhatsAppLink";
import {
  Percent,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MessageSquare,
  Clock,
  Flame,
  Tag,
} from "lucide-react";

interface OffersModalProps {
  initialOffers?: SpecialOffer[];
}

export default function OffersModal({ initialOffers }: OffersModalProps) {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const active = getActiveOffers(initialOffers);
    setOffers(active);
  }, [initialOffers]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "ArrowRight") handlePrev();
      if (e.key === "ArrowLeft") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, offers.length]);

  if (offers.length === 0) {
    // If no active offers, show a muted non-pulsing icon or nothing
    return null;
  }

  const currentOffer = offers[currentIndex] || offers[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < offers.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : offers.length - 1));
  };

  const handleOrderOffer = (offer: SpecialOffer) => {
    const phone = WHATSAPP_NUMBER || "201020499680";
    const msg =
      offer.whatsappMessage ||
      `السلام عليكم، حابب أستفسر وأطلب ${offer.title} من عروض بن بدران.`;
    const link = buildWhatsAppLink(phone, msg);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* ================= 1. FLOATING ACTION BUTTON ================= */}
      <div className="fixed bottom-24 right-5 sm:bottom-8 sm:right-24 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-[#F78320] to-[#E65100] text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white cursor-pointer"
          aria-label="عرض العروض الحالية"
          title="عروض بن بدران الحصرية"
        >
          {/* Subtle pulse ring animation */}
          <span className="absolute -inset-1.5 rounded-full bg-[#F78320]/40 animate-ping pointer-events-none opacity-75" />

          <div className="relative flex items-center justify-center">
            <Percent className="w-7 h-7 text-white font-bold animate-bounce" />
          </div>

          {/* Active Offers Count Badge */}
          <span className="absolute -top-1 -right-1 bg-[#1A110B] text-[#C5A059] border border-[#C5A059] text-[11px] font-bold font-price w-5 h-5 rounded-full flex items-center justify-center shadow-md">
            {offers.length}
          </span>

          {/* Tooltip on hover */}
          <span className="absolute right-16 px-3 py-1 bg-[#1A110B] text-white text-xs font-alexandria font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-[#C5A059]/40">
            العروض الحالية ({offers.length})
          </span>
        </button>
      </div>

      {/* ================= 2. OFFERS POPUP MODAL ================= */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#FAF8F5] border-2 border-[#C5A059] rounded-2xl shadow-2xl overflow-hidden animate-scaleUp text-[#1A110B]"
          >
            {/* Modal Top Header */}
            <div className="bg-[#1A110B] text-[#FAF8F5] px-4 py-3 flex items-center justify-between border-b border-[#C5A059]/40">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-[#F78320] rounded-lg text-white">
                  <Flame className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-amiri font-bold text-base sm:text-lg text-[#C5A059] leading-none">
                    عروض بن بدران الخاصة
                  </h3>
                  <span className="text-[11px] font-alexandria text-white/70">
                    عرض {currentIndex + 1} من {offers.length}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Carousel Slide */}
            <div className="p-4 sm:p-5 space-y-4">
              {/* Offer Image (Uniform 4:3 Ratio) */}
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-[#1A110B]/15 shadow-inner bg-[#1A110B]">
                <Image
                  src={currentOffer.image}
                  alt={currentOffer.title}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Offer Badge Overlay */}
                {currentOffer.badge && (
                  <span className="absolute top-3 right-3 bg-[#F78320] text-white font-alexandria font-bold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-white/40">
                    <Tag className="w-3 h-3" />
                    <span>{currentOffer.badge}</span>
                  </span>
                )}

                {/* Carousel Navigation Arrows */}
                {offers.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1A110B]/80 hover:bg-[#F78320] text-white p-2 rounded-full border border-[#C5A059]/40 shadow-md transition-all active:scale-95"
                      title="العرض السابق"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#1A110B]/80 hover:bg-[#F78320] text-white p-2 rounded-full border border-[#C5A059]/40 shadow-md transition-all active:scale-95"
                      title="العرض التالي"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Offer Content */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-amiri text-xl sm:text-2xl font-bold text-[#1A110B] leading-tight">
                    {currentOffer.title}
                  </h4>

                  {/* Price breakdown if available */}
                  {currentOffer.discountPrice && (
                    <div className="text-left shrink-0">
                      <div className="font-price font-bold text-2xl text-[#F78320]">
                        {currentOffer.discountPrice}{" "}
                        <span className="text-xs text-[#1A110B]">ج.م</span>
                      </div>
                      {currentOffer.originalPrice && (
                        <div className="font-price text-xs text-[#1A110B]/50 line-through">
                          {currentOffer.originalPrice} ج.م
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="font-alexandria text-xs sm:text-sm text-[#1A110A]/80 font-light leading-relaxed">
                  {currentOffer.description}
                </p>

                {/* Active Dates Badge */}
                {currentOffer.active_until && (
                  <div className="flex items-center gap-1.5 text-[11px] font-alexandria text-[#1A110A]/70 pt-1">
                    <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>ساري حتى: {currentOffer.active_until}</span>
                  </div>
                )}
              </div>

              {/* Action Button: Order via WhatsApp */}
              <div className="pt-2">
                <button
                  onClick={() => handleOrderOffer(currentOffer)}
                  className="w-full bg-[#25D366] hover:bg-[#1ebd59] text-white font-alexandria font-bold text-sm py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{currentOffer.ctaText || "اطلب هذا العرض الآن"}</span>
                </button>
              </div>

              {/* Carousel Dots Indicator */}
              {offers.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {offers.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        currentIndex === idx
                          ? "w-6 bg-[#F78320]"
                          : "w-2 bg-[#1A110B]/20 hover:bg-[#1A110B]/40"
                      }`}
                      aria-label={`انتقل إلى العرض ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { getRandomCoffeeTip } from "@/data/coffeeTips";
import {
  Sparkles,
  RefreshCw,
  X,
  Coffee,
  Lightbulb,
  Quote,
} from "lucide-react";

export default function CoffeeTipsModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentTip, setCurrentTip] = useState<string>("");
  const [isRotating, setIsRotating] = useState<boolean>(false);

  // Pick random tip on open
  const handleOpen = () => {
    const tip = getRandomCoffeeTip(currentTip);
    setCurrentTip(tip);
    setIsOpen(true);
  };

  // Generate another random tip without closing
  const handleNextTip = () => {
    setIsRotating(true);
    setTimeout(() => {
      const tip = getRandomCoffeeTip(currentTip);
      setCurrentTip(tip);
      setIsRotating(false);
    }, 200);
  };

  // Keyboard navigation (Escape to close, Space/Arrow to refresh)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        handleNextTip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentTip]);

  return (
    <>
      {/* ================= 1. FLOATING ACTION BUTTON (GOLD) ================= */}
      <div className="fixed bottom-8 left-5 sm:bottom-8 sm:left-8 z-40">
        <button
          onClick={handleOpen}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#C9A45F] to-[#9E7A32] text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white cursor-pointer"
          aria-label="نصائح عن القهوة"
          title="نصيحة قهوة من بدران"
        >
          {/* Subtle gold pulse ring animation */}
          <span className="absolute -inset-1.5 rounded-full bg-[#C9A45F]/30 animate-pulse pointer-events-none" />

          <div className="relative flex items-center justify-center">
            <Coffee className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>

          {/* Decorative Sparkle Badge */}
          <span className="absolute -top-1 -right-1 bg-[#1A110B] text-[#C9A45F] border border-[#C9A45F] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
            ✦
          </span>

          {/* Tooltip on hover */}
          <span className="absolute left-16 px-3 py-1 bg-[#1A110B] text-[#C9A45F] text-xs font-alexandria font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-[#C9A45F]/40">
            نصائح عن القهوة ☕
          </span>
        </button>
      </div>

      {/* ================= 2. COFFEE TIP POPUP MODAL ================= */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#FAF8F5] border-2 border-[#C9A45F] rounded-2xl shadow-2xl overflow-hidden animate-scaleUp text-[#1A110B]"
          >
            {/* Modal Header */}
            <div className="bg-[#1A110B] text-[#FAF8F5] px-5 py-3.5 flex items-center justify-between border-b border-[#C9A45F]/40">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-[#C9A45F]/20 border border-[#C9A45F]/50 rounded-lg text-[#C9A45F]">
                  <Lightbulb className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-amiri font-bold text-lg text-[#C9A45F] leading-none">
                    تعرف إن...؟
                  </h3>
                  <span className="text-[11px] font-alexandria text-white/70">
                    نصائح وخبرات بن بدران لعشاق القهوة
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-6 text-center">
              {/* Decorative Quote & Coffee Icon */}
              <div className="flex justify-center items-center gap-2 text-[#C9A45F]/60">
                <Quote className="w-6 h-6 rotate-180" />
                <span className="w-12 h-[1px] bg-[#C9A45F]/30" />
                <Coffee className="w-5 h-5 text-[#C9A45F]" />
                <span className="w-12 h-[1px] bg-[#C9A45F]/30" />
                <Quote className="w-6 h-6" />
              </div>

              {/* The Tip Text */}
              <div className="min-h-[90px] flex items-center justify-center px-2">
                <p
                  className={`font-amiri text-xl sm:text-2xl text-[#1A110B] font-bold leading-relaxed transition-all duration-200 ${
                    isRotating ? "opacity-30 scale-98" : "opacity-100 scale-100"
                  }`}
                >
                  &quot;{currentTip}&quot;
                </p>
              </div>

              {/* Decorative Divider */}
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C9A45F] to-transparent mx-auto" />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleNextTip}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#C9A45F] hover:bg-[#B38D45] text-white font-alexandria font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-[#C9A45F]"
                >
                  <RefreshCw
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isRotating ? "rotate-180" : ""
                    }`}
                  />
                  <span>نصيحة تانية 🔄</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-[#1A110B]/5 text-[#1A110B] font-alexandria font-bold text-xs sm:text-sm rounded-xl transition-all border border-[#1A110B]/20 cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

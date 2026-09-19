"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, Maximize2, X, ShieldCheck } from "lucide-react";

interface PouchCompact {
  id: "sada" | "mohawaj";
  title: string;
  tag: string;
  tagBg: string;
  image: string;
  subtitle: string;
}

const POUCHES: PouchCompact[] = [
  {
    id: "sada",
    title: "كيس بن بدران سادة",
    tag: "سـادة",
    tagBg: "bg-[#E65100] text-white",
    image: "/pouches/pouch-sada.png",
    subtitle: "طعم البن الصافي والنقي بدون إضافات",
  },
  {
    id: "mohawaj",
    title: "كيس بن بدران محوج بالحبهان",
    tag: "محوج بالحبهان",
    tagBg: "bg-[#2E7D32] text-white",
    image: "/pouches/pouch-mohawaj.png",
    subtitle: "توليفة بدران التراثية بحبات الحبهان الأخضر",
  },
];

export default function AuthenticPouchesShowcase() {
  const [activeModal, setActiveModal] = useState<PouchCompact | null>(null);

  return (
    <div className="mt-6 pt-5 border-t border-dashed border-[#C5A059]/30">
      {/* Compact Elegant Showcase Container */}
      <div className="bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] rounded-2xl border border-[#C5A059]/30 p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Text & Guarantee Info */}
          <div className="space-y-1 text-center sm:text-right">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold font-alexandria text-[#C5A059]">
              <Package className="w-3.5 h-3.5" />
              <span>العبوة الأصلية لبن بدران</span>
            </div>
            <h4 className="font-amiri text-lg sm:text-xl font-bold text-[#1A110B]">
              نفس الكيس اللي بتستلمه طازة في إيدك
            </h4>
            <p className="font-alexandria text-xs text-[#1A110B]/70 max-w-md font-light leading-relaxed">
              عبوة مخصصة بطبقة ألومنيوم عازلة، مع صمام الحفظ وسحاب Ziplock لإعادة الغلق بعد كل فنجان.
            </p>
          </div>

          {/* Mini Dual Pouches Display */}
          <div className="flex items-center justify-center gap-4 shrink-0">
            {POUCHES.map((pouch) => (
              <div
                key={pouch.id}
                onClick={() => setActiveModal(pouch)}
                className="group relative flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-1"
                title={`انقر لتكبير ${pouch.title}`}
              >
                {/* Mini Tag */}
                <span
                  className={`text-[10px] font-bold font-alexandria px-2 py-0.5 rounded-full mb-1 shadow-2xs ${pouch.tagBg}`}
                >
                  {pouch.tag}
                </span>

                {/* Standing Pouch Mini Mockup */}
                <div className="relative w-16 sm:w-20 aspect-[530/770] filter drop-shadow-[0_6px_10px_rgba(26,17,11,0.18)]">
                  <Image
                    src={pouch.image}
                    alt={pouch.title}
                    fill
                    className="object-contain transition-transform group-hover:scale-105"
                    sizes="80px"
                  />
                  {/* Subtle Zoom Badge on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg">
                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* Ground Shadow */}
                <div className="w-12 h-2 mt-0.5 bg-[#1A110B]/15 rounded-[100%] blur-xs" />
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Fullscreen Lightbox Modal on Tap */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative max-w-sm w-full bg-[#1A110B] rounded-2xl border border-[#C5A059]/60 p-4 shadow-2xl flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#C5A059]/30 text-right">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${activeModal.tagBg}`}>
                  {activeModal.tag}
                </span>
                <h4 className="font-amiri text-lg font-bold text-white mt-1">
                  {activeModal.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pouch Image */}
            <div className="relative w-full aspect-[530/770] max-h-[60vh] my-1">
              <Image
                src={activeModal.image}
                alt={activeModal.title}
                fill
                className="object-contain filter drop-shadow-[0_12px_25px_rgba(197,160,89,0.3)]"
                sizes="(max-width: 768px) 90vw, 400px"
              />
            </div>

            {/* Modal Footer Note */}
            <div className="mt-2 text-xs font-alexandria text-white/70 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{activeModal.subtitle}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

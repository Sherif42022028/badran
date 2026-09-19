"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Award,
  Maximize2,
  X,
  CheckCircle2,
} from "lucide-react";

export interface HoneySlide {
  id: string;
  image: string;
  title: string;
  shortTitle: string;
  badge: string;
  description: string;
  tag: string;
}

const HONEY_SLIDES: HoneySlide[] = [
  {
    id: "citrus",
    image: "/honey/honey-citrus.jpg",
    title: "عسل موالح برتقال طبيعي",
    shortTitle: "عسل موالح",
    badge: "100% طبيعي من أزهار البرتقال",
    description:
      "مستخلص نقي من أزهار البرتقال والليمون بمذاق منعش وخفيف، غني بفيتامين C ومضادات الأكسدة الطبيعية.",
    tag: "طبيعي 100%",
  },
  {
    id: "clover",
    image: "/honey/honey-clover.jpg",
    title: "عسل زهور البرسيم الصافي",
    shortTitle: "زهور البرسيم",
    badge: "عسل نحل طبيعي صافي متوفر بعبوات زجاج وعصر",
    description:
      "العسل الكلاسيكي المفضل للأسرة، يتميز بقوام ذهبي ناعم وسكر طبيعي متوازن مثالي لتحلية المشروبات والقهوة.",
    tag: "الأعلى طلباً",
  },
  {
    id: "nuts",
    image: "/honey/honey-nuts.jpg",
    title: "عسل مكسرات بدران الملكي",
    shortTitle: "مكسرات بالعسل",
    badge: "لوز، بندق، كاجو، وعين جمل",
    description:
      "توليفة فاخرة من عسل النحل الكثيف الممزوج بمكسرات نية منتقاة بعناية لتعزيز الطاقة والحيوية والمناعة.",
    tag: "طاقة ومناعة",
  },
  {
    id: "sidr",
    image: "/honey/honey-sidr.jpg",
    title: "عسل سدر مصري وعسل حبة البركة",
    shortTitle: "سدر وحبة البركة",
    badge: "طعم أصيل وفوائد علاجية استثنائية",
    description:
      "قيمة غذائية ودوائية عالية تجمع بين نقاء السدر البلدي وخواص حبة البركة السوداء لتقوية المناعة والجهاز التنفسي.",
    tag: "عسل تخصصي",
  },
  {
    id: "yemeni",
    image: "/honey/honey-yemeni.jpg",
    title: "عسل يمني حضرمي وباور هاني",
    shortTitle: "يمني & Power",
    badge: "أفخر أنواع الأعسال النادرة والمقوية",
    description:
      "عسل يمني حضرمي أصلي من أودية حضرموت مع منتج باور هاني الغني بخلاصات التغذية والطاقة الطبيعية.",
    tag: "نخب أول",
  },
];

export default function HoneyHeaderShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const current = HONEY_SLIDES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HONEY_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + HONEY_SLIDES.length) % HONEY_SLIDES.length
    );
  };

  // Auto-advance timer (pauses when lightbox open or hovered)
  useEffect(() => {
    if (!isAutoPlaying || lightboxOpen) return;
    autoPlayTimerRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, lightboxOpen]);

  return (
    <div
      className="relative mb-8 rounded-3xl overflow-hidden border border-[#C5A059]/40 bg-[#1A110B] shadow-xl group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Dynamic Background Backdrop with Amber Blur Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={current.image}
          alt={current.title}
          fill
          className="object-cover blur-2xl opacity-25 scale-110 transition-all duration-1000"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A110B] via-[#1A110B]/85 to-[#1A110B]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(197,160,89,0.18),transparent_70%)]" />
      </div>

      {/* Main Grid: Visual Showcase + Text Content */}
      <div className="relative z-10 p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Right (Arabic reading) Column: Text, Highlights & Interactive Selection */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-5 text-right order-2 lg:order-1">
          {/* Top category indicator */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-alexandria bg-[#C5A059] text-[#1A110B] shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>قسم العسل الطبيعي والمناحل</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold font-alexandria bg-[#FAF8F5]/10 text-[#C5A059] border border-[#C5A059]/30 backdrop-blur-xs">
              <Award className="w-3.5 h-3.5" />
              <span>جودة مضمونة من آل بدران</span>
            </span>

            <span className="text-[11px] font-alexandria text-white/60 mr-auto">
              الصورة {currentIndex + 1} من {HONEY_SLIDES.length}
            </span>
          </div>

          {/* Current Honey Slide Title & Tag */}
          <div className="space-y-2">
            <div className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold font-alexandria bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {current.tag}
            </div>
            <h3 className="font-amiri text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
              {current.title}
            </h3>
            <p className="font-alexandria text-xs sm:text-sm text-[#C5A059] font-medium">
              {current.badge}
            </p>
            <p className="font-alexandria text-xs sm:text-sm text-[#FAF8F5]/85 leading-relaxed font-light max-w-xl">
              {current.description}
            </p>
          </div>

          {/* 3 Quality Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs font-alexandria">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span className="text-white/90 text-[11px] font-medium">
                عسل نقي بدون سكريات مضافة
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span className="text-white/90 text-[11px] font-medium">
                معبأ بعبوات زجاجية صحية
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2.5">
              <Award className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span className="text-white/90 text-[11px] font-medium">
                فحص دوري وسلامة مضمونة
              </span>
            </div>
          </div>

          {/* Interactive Honey Selection Tabs */}
          <div className="pt-2 border-t border-white/10">
            <div className="text-[11px] font-bold font-alexandria text-white/60 mb-2">
              تصفح أصناف العسل المتاحة:
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {HONEY_SLIDES.map((slide, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative rounded-xl overflow-hidden p-1 sm:p-1.5 text-center transition-all cursor-pointer border ${
                      isActive
                        ? "bg-[#C5A059]/20 border-[#C5A059] ring-2 ring-[#C5A059]/40 shadow-sm"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="relative w-full h-10 sm:h-12 rounded-lg overflow-hidden mb-1">
                      <Image
                        src={slide.image}
                        alt={slide.shortTitle}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 20vw, 100px"
                      />
                    </div>
                    <span
                      className={`block text-[10px] sm:text-xs font-alexandria font-bold truncate ${
                        isActive ? "text-[#C5A059]" : "text-white/70"
                      }`}
                    >
                      {slide.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Left Column: Featured High-Res Display Photo with Zoom Button */}
        <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-sm sm:max-w-md aspect-3/4 rounded-2xl overflow-hidden border-2 border-[#C5A059]/50 shadow-2xl group/photo bg-black/40">
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover/photo:scale-105"
              sizes="(max-width: 768px) 90vw, 450px"
              priority
            />

            {/* Subtle Gradient Shadow at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A110B] via-transparent to-black/30 pointer-events-none" />

            {/* Top Bar inside photo: Zoom & Tag */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              <button
                onClick={() => setLightboxOpen(true)}
                className="p-2 rounded-xl bg-black/60 text-white hover:bg-[#C5A059] hover:text-[#1A110B] backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-md flex items-center gap-1.5 text-xs font-alexandria font-semibold"
                title="تكبير الصورة"
                aria-label="تكبير صورة العسل"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تكبير وفحص العسل</span>
              </button>

              <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold font-alexandria bg-black/60 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                آل بدران
              </span>
            </div>

            {/* Navigation Arrows inside Photo */}
            <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="pointer-events-auto p-2 rounded-full bg-black/50 text-white hover:bg-[#C5A059] hover:text-[#1A110B] backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-md"
                aria-label="الصورة التالية"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="pointer-events-auto p-2 rounded-full bg-black/50 text-white hover:bg-[#C5A059] hover:text-[#1A110B] backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-md"
                aria-label="الصورة السابقة"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-3 left-3 right-3 z-10 text-center">
              <div className="inline-block px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-[#C5A059]/40 text-xs font-alexandria text-amber-200">
                {current.shortTitle} — جودة طبيعية ممتازة
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= LIGHTBOX MODAL FOR CLOSE-UP INSPECTION ================= */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[92vh] flex flex-col items-center bg-[#1A110B] rounded-2xl border border-[#C5A059]/60 p-4 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Close */}
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-[#C5A059]/30 text-right">
              <div>
                <h4 className="font-amiri text-xl sm:text-2xl font-bold text-white">
                  {current.title}
                </h4>
                <p className="text-xs font-alexandria text-[#C5A059]">
                  {current.badge}
                </p>
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-Res Image Container */}
            <div className="relative w-full aspect-3/4 max-h-[65vh] rounded-xl overflow-hidden border border-white/10">
              <Image
                src={current.image}
                alt={current.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 95vw, 800px"
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="w-full mt-3 flex items-center justify-between text-xs font-alexandria text-white/80">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#C5A059] hover:text-[#1A110B] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>السابق</span>
              </button>

              <span>
                {currentIndex + 1} / {HONEY_SLIDES.length}
              </span>

              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#C5A059] hover:text-[#1A110B] transition-colors cursor-pointer"
              >
                <span>التالي</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

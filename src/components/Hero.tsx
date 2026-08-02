import Image from "next/image";
import { Coffee, Sparkles, Award, Clock, MapPin, ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="py-10 md:py-20 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-8 md:p-16 text-center relative overflow-hidden bg-gradient-to-b from-white via-[#FAF7F2] to-[#FAF6F0]">
        
        {/* Subtle Luxury Ambient Radial Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Central Logo Royal Seal */}
        <div className="relative mx-auto w-28 h-28 md:w-36 md:h-36 mb-8 rounded-full border-2 border-[#C89B3C] p-1.5 bg-white shadow-xl flex items-center justify-center group">
          <div className="relative w-full h-full rounded-full overflow-hidden border border-[#C89B3C]/40">
            <Image
              src="/logo.jpg"
              alt="شعار بن بدران الأصلي"
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
          <div className="absolute -bottom-2 bg-[#1E110A] text-[#C89B3C] px-3 py-0.5 rounded-full text-[10px] font-alexandria font-bold tracking-widest border border-[#C89B3C]/50 shadow-md">
            SINCE 1990s
          </div>
        </div>

        {/* Heritage Quality Solid Badge */}
        <div className="inline-block mb-6">
          <span className="solid-badge text-xs md:text-sm tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-[#C89B3C]" />
            <span>BUDRAN COFFEE — ARTISANAL ROASTERY</span>
            <Sparkles className="w-4 h-4 text-[#C89B3C]" />
          </span>
        </div>

        {/* Main Headline */}
        <h2 className="font-amiri text-4xl md:text-6xl lg:text-7xl font-bold text-[#1E110A] mb-6 leading-tight tracking-tight">
          بن بدران.. <span className="text-gold-gradient font-bold">عراقة القهوة</span> وجوهر الفخامة
        </h2>

        {/* Description Paragraph */}
        <p className="font-alexandria text-sm md:text-lg text-[#1E110A]/80 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
          ننتقي لكم أجود حبوب البن من أعالي جبال كولومبيا وإثيوبيا واليمن، مع سر التوليف التراثي والتحميص الطازج يومياً والتحويج بالحبهان الهندي الأخضر الفاخر والمستكة اليونانية الأصيلة.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          <a
            href="#menu"
            className="w-full sm:w-auto bg-[#1E110A] hover:bg-[#321E14] text-[#FAF7F2] font-alexandria font-bold text-sm md:text-base px-8 py-3.5 rounded-full border border-[#C89B3C]/40 transition-all shadow-md flex items-center justify-center gap-2.5 group"
          >
            <Coffee className="w-4 h-4 text-[#C89B3C] group-hover:rotate-12 transition-transform" />
            <span>استعراض المنيو والأسعار</span>
          </a>

          <a
            href="#blend-builder"
            className="w-full sm:w-auto bg-gold-gradient text-white font-alexandria font-bold text-sm md:text-base px-8 py-3.5 rounded-full transition-all shadow-md flex items-center justify-center gap-2.5 hover:shadow-lg active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>صمّم توليفتك المخصصة</span>
          </a>
        </div>

        {/* Prestige Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-dashed border-[#C89B3C]/30 max-w-4xl mx-auto text-center font-alexandria text-xs text-[#1E110A]">
          <div className="flex items-center justify-center gap-2.5 p-3 bg-white/80 rounded-xl border border-[#C89B3C]/20 shadow-xs">
            <Award className="w-4 h-4 text-[#C89B3C] shrink-0" />
            <span className="font-semibold">حبوب أرابيكا 100% وتحمير طازج يومياً</span>
          </div>

          <div className="flex items-center justify-center gap-2.5 p-3 bg-white/80 rounded-xl border border-[#C89B3C]/20 shadow-xs">
            <Clock className="w-4 h-4 text-[#C89B3C] shrink-0" />
            <span className="font-semibold">استقبال وخدمة 24 ساعة طوال الأسبوع</span>
          </div>

          <div className="flex items-center justify-center gap-2.5 p-3 bg-white/80 rounded-xl border border-[#C89B3C]/20 shadow-xs">
            <MapPin className="w-4 h-4 text-[#C89B3C] shrink-0" />
            <span className="font-semibold">الفرع الرئيسي: ميت غمر - الدقهلية</span>
          </div>
        </div>

      </div>
    </section>
  );
}

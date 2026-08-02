import Image from "next/image";
import { Coffee, Award, Clock, MapPin, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="py-3 md:py-6 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-5 sm:p-8 md:p-10 text-center relative overflow-hidden bg-[#FFFFFF]">
        
        {/* Central Logo Seal */}
        <div className="relative mx-auto w-20 h-20 md:w-24 md:h-24 mb-3 rounded-full border-2 border-[#C5A059] p-0.5 bg-white shadow-sm flex items-center justify-center group">
          <div className="relative w-full h-full rounded-full overflow-hidden border border-[#1A110B]/20">
            <Image
              src="/logo.jpg"
              alt="شعار بن بدران الأصلي"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Local Authentic Badge */}
        <div className="inline-block mb-3">
          <span className="solid-badge text-[11px] md:text-xs font-bold tracking-wide py-1 px-3">
            <span>بن بدران — محمصة ومطحنة ميت غمر</span>
          </span>
        </div>

        {/* Main Headline */}
        <h2 className="font-amiri text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A110B] mb-3 leading-snug">
          بن بدران.. أصل القهوة والتحويجة البلدي في ميت غمر
        </h2>

        {/* Description Paragraph */}
        <p className="font-alexandria text-xs sm:text-sm md:text-base text-[#1A110A]/80 max-w-2xl mx-auto mb-5 leading-relaxed font-light">
          بن نقي 100%، طحن وتحمير طازة قدام عينك في المحل يومياً، مع أجود أنواع الحبهان الهندي الأخضر والمستكة اليوناني الأصلي، وخلطات فرنسية بنكهات البندق والشوكولاتة بالفانيليا.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6">
          <a
            href="#menu"
            className="w-full sm:w-auto bg-[#1A110B] hover:bg-[#2A1D15] text-[#FAF8F5] font-alexandria font-bold text-xs md:text-sm px-6 py-2.5 rounded-lg border border-[#C5A059]/40 transition-all shadow-xs flex items-center justify-center gap-2 group"
          >
            <Coffee className="w-4 h-4 text-[#C5A059]" />
            <span>تصفح الأسعار والمنيو</span>
          </a>

          <a
            href="#blend-builder"
            className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#B08B46] text-white font-alexandria font-bold text-xs md:text-sm px-6 py-2.5 rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>ركّب خلطتك بنفسك</span>
          </a>
        </div>

        {/* Natural Local Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-dashed border-[#C5A059]/30 max-w-3xl mx-auto text-center font-alexandria text-[11px] md:text-xs text-[#1A110B]">
          <div className="flex items-center justify-center gap-2 p-2.5 bg-[#F7F4EF] rounded-lg border border-[#1A110B]/10">
            <Award className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span className="font-semibold">بن نقي 100% وتحمير طازة يومياً</span>
          </div>

          <div className="flex items-center justify-center gap-2 p-2.5 bg-[#F7F4EF] rounded-lg border border-[#1A110B]/10">
            <Clock className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span className="font-semibold">شغالين 24 ساعة بميت غمر</span>
          </div>

          <div className="flex items-center justify-center gap-2 p-2.5 bg-[#F7F4EF] rounded-lg border border-[#1A110B]/10">
            <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span className="font-semibold">الفرع الرئيسي: الشارع الرئيسي بميت غمر</span>
          </div>
        </div>

      </div>
    </section>
  );
}

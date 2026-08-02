import Image from "next/image";
import { Coffee, Award, Clock, MapPin, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="py-10 md:py-16 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-8 md:p-14 text-center relative overflow-hidden bg-[#FFFFFF]">
        
        {/* Central Logo Royal Seal */}
        <div className="relative mx-auto w-28 h-28 md:w-36 md:h-36 mb-6 rounded-full border-2 border-[#C5A059] p-1 bg-white shadow-md flex items-center justify-center group">
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
        <div className="inline-block mb-4">
          <span className="solid-badge text-xs md:text-sm font-bold tracking-wide">
            <span>بن بدران — محمصة ومطحنة ميت غمر</span>
          </span>
        </div>

        {/* Main Headline */}
        <h2 className="font-amiri text-4xl md:text-6xl lg:text-7xl font-bold text-[#1A110B] mb-5 leading-tight">
          بن بدران.. أصل القهوة والتحويجة البلدي في ميت غمر
        </h2>

        {/* Description Paragraph */}
        <p className="font-alexandria text-sm md:text-base text-[#1A110B]/80 max-w-3xl mx-auto mb-8 leading-relaxed font-light">
          بن نقي 100%، طحن وتحمير طازة قدام عينك في المحل يومياً، مع أجود أنواع الحبهان الهندي الأخضر والمستكة اليوناني الأصلي، وخلطات فرنسية بنكهات البندق والشوكولاتة بالفانيليا.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
          <a
            href="#menu"
            className="w-full sm:w-auto bg-[#1A110B] hover:bg-[#2A1D15] text-[#FAF8F5] font-alexandria font-bold text-sm md:text-base px-8 py-3.5 rounded-lg border border-[#C5A059]/40 transition-all shadow-xs flex items-center justify-center gap-2.5 group"
          >
            <Coffee className="w-4 h-4 text-[#C5A059]" />
            <span>تصفح الأسعار والمنيو</span>
          </a>

          <a
            href="#blend-builder"
            className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#B08B46] text-white font-alexandria font-bold text-sm md:text-base px-8 py-3.5 rounded-lg transition-all shadow-xs flex items-center justify-center gap-2.5 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>ركّب خلطتك بنفسك</span>
          </a>
        </div>

        {/* Natural Local Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-dashed border-[#C5A059]/30 max-w-4xl mx-auto text-center font-alexandria text-xs text-[#1A110B]">
          <div className="flex items-center justify-center gap-2.5 p-3 bg-[#F7F4EF] rounded-lg border border-[#1A110B]/10">
            <Award className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span className="font-semibold">بن نقي 100% وتحمير طازة يومياً</span>
          </div>

          <div className="flex items-center justify-center gap-2.5 p-3 bg-[#F7F4EF] rounded-lg border border-[#1A110B]/10">
            <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span className="font-semibold">شغالين 24 ساعة بميت غمر</span>
          </div>

          <div className="flex items-center justify-center gap-2.5 p-3 bg-[#F7F4EF] rounded-lg border border-[#1A110B]/10">
            <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span className="font-semibold">الفرع الرئيسي: الشارع الرئيسي بميت غمر</span>
          </div>
        </div>

      </div>
    </section>
  );
}

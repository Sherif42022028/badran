import Image from "next/image";
import { Coffee, Sparkles, Award, Clock, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="py-8 md:py-14 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-6 md:p-12 text-center relative overflow-hidden">
        {/* Subtle Background Pattern Accent */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3A2416_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Central Logo Seal */}
        <div className="relative mx-auto w-24 h-24 md:w-32 md:h-32 mb-6 rounded-full border-4 border-[#3A2416] p-2 bg-[#FFF8F6] shadow-md flex items-center justify-center">
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image
              src="/logo.jpg"
              alt="شعار بن بدران الأصلي"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Quality Heritage Solid Badge Header */}
        <div className="inline-block mb-4">
          <span className="solid-badge text-sm md:text-base">
            <Sparkles className="w-4 h-4 text-[#C97A2B]" />
            <span>BUDRAN COFFEE — PREMIUM QUALITY</span>
            <Sparkles className="w-4 h-4 text-[#C97A2B]" />
          </span>
        </div>

        {/* Main Headline */}
        <h2 className="font-lalezar text-3xl md:text-5xl lg:text-6xl text-[#3A2416] mb-4 leading-tight">
          بن بدران.. أصالة القهوة وجوهر المزاج الرفيع
        </h2>

        {/* Description Paragraph */}
        <p className="font-tajawal text-base md:text-xl text-[#3A2416]/85 max-w-3xl mx-auto mb-8 leading-relaxed">
          ننتقي لكم أجود حبوب البن من أعالي جبال كولومبيا وإثيوبيا واليمن، مع سر التوليف العتيق والتحميص الطازج يومياً والتحويج بالحبهان الهندي الأخضر والمستكة اليونانية الاصيلة.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex flex-wrap justify-center items-center gap-4 mb-10">
          <a
            href="#menu"
            className="w-full sm:w-auto bg-[#3A2416] hover:bg-[#6B2A22] text-[#FFF8F6] font-lalezar text-lg px-8 py-3.5 rounded border-2 border-[#3A2416] transition-all shadow-md flex items-center justify-center gap-2 group"
          >
            <Coffee className="w-5 h-5 text-[#C97A2B] group-hover:rotate-12 transition-transform" />
            <span>استعراض المنيو والأسعار</span>
          </a>

          <a
            href="#blend-builder"
            className="w-full sm:w-auto bg-[#C97A2B] hover:bg-[#E08930] text-white font-lalezar text-lg px-8 py-3.5 rounded border-2 border-[#3A2416] transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>صمّم توليفتك المخصصة</span>
          </a>
        </div>

        {/* Heritage Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-dashed border-[#3A2416]/30 max-w-4xl mx-auto text-center font-tajawal text-xs md:text-sm text-[#3A2416]">
          <div className="flex items-center justify-center gap-2 p-2 bg-[#FFF8F6]/80 rounded border border-[#3A2416]/20">
            <Award className="w-5 h-5 text-[#C97A2B] shrink-0" />
            <span className="font-semibold">بن صافي وتحمير طازج يومياً</span>
          </div>

          <div className="flex items-center justify-center gap-2 p-2 bg-[#FFF8F6]/80 rounded border border-[#3A2416]/20">
            <Clock className="w-5 h-5 text-[#C97A2B] shrink-0" />
            <span className="font-semibold">خدمة واستقبال 24 ساعة</span>
          </div>

          <div className="flex items-center justify-center gap-2 p-2 bg-[#FFF8F6]/80 rounded border border-[#3A2416]/20">
            <MapPin className="w-5 h-5 text-[#C97A2B] shrink-0" />
            <span className="font-semibold">الفرع الرئيسي: ميت غمر</span>
          </div>
        </div>
      </div>
    </section>
  );
}

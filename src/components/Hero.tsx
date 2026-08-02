import Image from "next/image";
import { Coffee, Award, Clock, MapPin, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="py-10 md:py-16 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-8 md:p-14 text-center relative overflow-hidden bg-gradient-to-b from-white via-[#FAF7F2] to-[#FAF6F0]">
        
        {/* Central Logo Royal Seal */}
        <div className="relative mx-auto w-28 h-28 md:w-36 md:h-36 mb-6 rounded-full border-2 border-[#C89B3C] p-1.5 bg-white shadow-xl flex items-center justify-center group">
          <div className="relative w-full h-full rounded-full overflow-hidden border border-[#C89B3C]/40">
            <Image
              src="/logo.jpg"
              alt="شعار بن بدران الأصلي"
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
        </div>

        {/* Local Authentic Badge */}
        <div className="inline-block mb-4">
          <span className="solid-badge text-xs md:text-sm font-bold tracking-wide">
            <span>بن بدران — محمصة ومطحنة ميت غمر الأصيلة</span>
          </span>
        </div>

        {/* Main Headline */}
        <h2 className="font-amiri text-4xl md:text-6xl lg:text-7xl font-bold text-[#1E110A] mb-5 leading-tight">
          بن بدران.. أصل القهوة والتحويجة البلدي في ميت غمر
        </h2>

        {/* Description Paragraph */}
        <p className="font-alexandria text-sm md:text-lg text-[#1E110A]/85 max-w-3xl mx-auto mb-8 leading-relaxed font-light">
          بن نقي 100%، طحن وتحمير طازة قدام عينك في المحل يومياً، مع أجود أنواع الحبهان الهندي الأخضر والمستكة اليوناني الاصلي، وخلطات فرنسية بنكهات البندق والشوكولاتة بالفانيليا.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
          <a
            href="#menu"
            className="w-full sm:w-auto bg-[#1E110A] hover:bg-[#321E14] text-[#FAF7F2] font-alexandria font-bold text-sm md:text-base px-8 py-3.5 rounded-full border border-[#C89B3C]/40 transition-all shadow-md flex items-center justify-center gap-2.5 group"
          >
            <Coffee className="w-4 h-4 text-[#C89B3C] group-hover:rotate-12 transition-transform" />
            <span>تصفح المنيو والأسعار</span>
          </a>

          <a
            href="#blend-builder"
            className="w-full sm:w-auto bg-gold-gradient text-white font-alexandria font-bold text-sm md:text-base px-8 py-3.5 rounded-full transition-all shadow-md flex items-center justify-center gap-2.5 hover:shadow-lg active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>ركّب خلطتك الخاصة بنفسك</span>
          </a>
        </div>

        {/* Natural Local Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-dashed border-[#C89B3C]/30 max-w-4xl mx-auto text-center font-alexandria text-xs text-[#1E110A]">
          <div className="flex items-center justify-center gap-2.5 p-3 bg-white rounded-xl border border-[#C89B3C]/20 shadow-xs">
            <Award className="w-4 h-4 text-[#C89B3C] shrink-0" />
            <span className="font-semibold">بن نقي 100% وتحمير طازة يومياً</span>
          </div>

          <div className="flex items-center justify-center gap-2.5 p-3 bg-white rounded-xl border border-[#C89B3C]/20 shadow-xs">
            <Clock className="w-4 h-4 text-[#C89B3C] shrink-0" />
            <span className="font-semibold">شغالين 24 ساعة لخدمتكم بميت غمر</span>
          </div>

          <div className="flex items-center justify-center gap-2.5 p-3 bg-white rounded-xl border border-[#C89B3C]/20 shadow-xs">
            <MapPin className="w-4 h-4 text-[#C89B3C] shrink-0" />
            <span className="font-semibold">الفرع الرئيسي: الشارع الرئيسي بميت غمر</span>
          </div>
        </div>

      </div>
    </section>
  );
}

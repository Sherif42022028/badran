import Image from "next/image";
import { Phone, MapPin, Clock, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-[#C89B3C]/50 bg-[#1E110A] text-[#FAF7F2] font-alexandria pt-12 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Header Anchored Brand Seal */}
        <div className="text-center mb-10">
          <div className="relative mx-auto w-16 h-16 rounded-full border-2 border-[#C89B3C] p-1 bg-white overflow-hidden mb-3 shadow-lg inline-block">
            <Image
              src="/logo.jpg"
              alt="شعار بن بدران الأصلي"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="font-amiri text-3xl text-[#D4AF37]">بن بدران (Budran Coffee)</h3>
          <p className="font-price text-[10px] text-[#C89B3C] tracking-[0.25em] uppercase font-bold mt-1">
            PREMIUM ARTISANAL COFFEE — SINCE LEGACY
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-dashed border-[#C89B3C]/20 text-center md:text-right">
          
          {/* Col 1 */}
          <div className="space-y-3">
            <h4 className="font-amiri text-xl text-[#C89B3C]">عن المحل</h4>
            <p className="text-xs text-[#FAF7F2]/80 leading-relaxed max-w-sm mx-auto md:mx-0 font-light">
              بن بدران هو عنوان الجودة والعراقة في ميت غمر. نوفر لكم أنقى أصناف البن العالمي والخلطات الملكية المحوجة بالحبهان والمستكة طازجة يومياً.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="font-amiri text-xl text-[#C89B3C]">روابط سريعة</h4>
            <ul className="text-xs space-y-2 text-[#FAF7F2]/90">
              <li>
                <a href="#hero" className="hover:text-[#C89B3C] transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#C89B3C] transition-colors">
                  قصتنا والعراقة
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#C89B3C] transition-colors">
                  المنيو والأسعار
                </a>
              </li>
              <li>
                <a href="#blend-builder" className="hover:text-[#C89B3C] transition-colors">
                  صمّم توليفتك
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#C89B3C] transition-colors">
                  موقعنا وتواصلنا
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="font-amiri text-xl text-[#C89B3C]">تواصل معنا</h4>
            <p className="text-xs text-[#FAF7F2]/90 flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4 text-[#C89B3C]" />
              <span>ميت غمر - محافظة الدقهلية - مصر</span>
            </p>
            <p className="text-xs text-[#FAF7F2]/90 flex items-center justify-center md:justify-start gap-2">
              <Phone className="w-4 h-4 text-[#C89B3C]" />
              <span className="font-price font-bold">01020499680</span>
            </p>
            <p className="text-xs text-[#FAF7F2]/90 flex items-center justify-center md:justify-start gap-2">
              <Clock className="w-4 h-4 text-[#C89B3C]" />
              <span>خدمة 24 ساعة طوال الأسبوع</span>
            </p>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 text-center text-xs text-[#FAF7F2]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© جميع الحقوق محفوظة لـ بن بدران (Budran Coffee)</p>
          <p className="flex items-center gap-1.5">
            صنع بـ <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> لعشاق القهوة الفاخرة
          </p>
        </div>

      </div>
    </footer>
  );
}

import Image from "next/image";
import { Phone, MapPin, Clock, Coffee, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-14 border-t-[3px] border-double border-[#3A2416] bg-[#3A2416] text-[#FFF8F6] font-tajawal pt-10 pb-6 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Header Anchored Brand Seal */}
        <div className="text-center mb-8">
          <div className="relative mx-auto w-16 h-16 rounded-full border-2 border-[#C97A2B] p-1 bg-[#FFF8F6] overflow-hidden mb-3 shadow-md inline-block">
            <Image
              src="/logo.jpg"
              alt="شعار بن بدران الأصلي"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="font-lalezar text-2xl text-[#FFF8F6]">بن بدران (Budran Coffee)</h3>
          <p className="font-price text-xs text-[#C97A2B] tracking-widest uppercase font-semibold">
            PREMIUM ARTISANAL COFFEE — SINCE LEGACY
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-y border-dashed border-[#FFF8F6]/20 text-center md:text-right">
          
          {/* Col 1 */}
          <div className="space-y-2">
            <h4 className="font-lalezar text-lg text-[#C97A2B]">عن المحل</h4>
            <p className="text-xs text-[#FFF8F6]/80 leading-relaxed max-w-sm mx-auto md:mx-0">
              بن بدران هو رمز الجودة والعراقة في ميت غمر. نوفر لكم أجود أنواع البن العالمي والخلطات التراثية المحوجة بالحبهان والمستكة طازجة يومياً.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-lalezar text-lg text-[#C97A2B]">روابط سريعة</h4>
            <ul className="text-xs space-y-2 text-[#FFF8F6]/90">
              <li>
                <a href="#hero" className="hover:text-[#C97A2B] transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#C97A2B] transition-colors">
                  قصتنا والعراقة
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#C97A2B] transition-colors">
                  المنيو والأسعار
                </a>
              </li>
              <li>
                <a href="#blend-builder" className="hover:text-[#C97A2B] transition-colors">
                  صمّم توليفتك
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#C97A2B] transition-colors">
                  موقعنا وتواصلنا
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-lalezar text-lg text-[#C97A2B]">تواصل معنا</h4>
            <p className="text-xs text-[#FFF8F6]/90 flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4 text-[#C97A2B]" />
              <span>ميت غمر - محافظة الدقهلية - مصر</span>
            </p>
            <p className="text-xs text-[#FFF8F6]/90 flex items-center justify-center md:justify-start gap-2">
              <Phone className="w-4 h-4 text-[#C97A2B]" />
              <span className="font-price">01020499680</span>
            </p>
            <p className="text-xs text-[#FFF8F6]/90 flex items-center justify-center md:justify-start gap-2">
              <Clock className="w-4 h-4 text-[#C97A2B]" />
              <span>خدمة 24 ساعة طوال الأسبوع</span>
            </p>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 text-center text-xs text-[#FFF8F6]/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© جميع الحقوق محفوظة لـ بن بدران (Budran Coffee)</p>
          <p className="flex items-center gap-1">
            صنع بـ <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> لعشاق القهوة الحقيقيين
          </p>
        </div>

      </div>
    </footer>
  );
}

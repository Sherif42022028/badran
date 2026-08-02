import Image from "next/image";
import { Phone, MapPin, Clock, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[#C5A059]/40 bg-[#1A110B] text-[#FAF8F5] font-alexandria pt-12 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Header Anchored Brand Seal */}
        <div className="text-center mb-10">
          <div className="relative mx-auto w-16 h-16 rounded-lg border border-[#C5A059]/60 p-1 bg-white overflow-hidden mb-3 shadow-md inline-block">
            <Image
              src="/logo.jpg"
              alt="شعار بن بدران الأصلي"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="font-amiri text-3xl text-[#C5A059]">بن بدران (Budran Coffee)</h3>
          <p className="font-alexandria text-xs text-[#C5A059] font-semibold mt-1">
            محمصة ومطحنة ميت غمر الأصيلة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-dashed border-[#C5A059]/20 text-center md:text-right">
          
          {/* Col 1 */}
          <div className="space-y-3">
            <h4 className="font-amiri text-xl text-[#C5A059]">عن المحل</h4>
            <p className="text-xs text-[#FAF8F5]/80 leading-relaxed max-w-sm mx-auto md:mx-0 font-light">
              بن بدران هو أصل القهوة والتحويجة البلدي في ميت غمر. نوفر لكم أجود أنواع البن والخلطات المحوجة بالحبةان والمستكة طازجة يومياً.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="font-amiri text-xl text-[#C5A059]">روابط سريعة</h4>
            <ul className="text-xs space-y-2 text-[#FAF8F5]/90">
              <li>
                <a href="#hero" className="hover:text-[#C5A059] transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#C5A059] transition-colors">
                  قصة المحل
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#C5A059] transition-colors">
                  أسعار المنيو
                </a>
              </li>
              <li>
                <a href="#blend-builder" className="hover:text-[#C5A059] transition-colors">
                  ركّب خلطتك
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#C5A059] transition-colors">
                  موقعنا وتواصلنا
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="font-amiri text-xl text-[#C5A059]">تواصل معنا</h4>
            <p className="text-xs text-[#FAF8F5]/90 flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              <span>ميت غمر - محافظة الدقهلية - مصر</span>
            </p>
            <p className="text-xs text-[#FAF8F5]/90 flex items-center justify-center md:justify-start gap-2">
              <Phone className="w-4 h-4 text-[#C5A059]" />
              <span className="font-price font-bold">01020499680</span>
            </p>
            <p className="text-xs text-[#FAF8F5]/90 flex items-center justify-center md:justify-start gap-2">
              <Clock className="w-4 h-4 text-[#C5A059]" />
              <span>شغالين 24 ساعة طوال أيام الأسبوع</span>
            </p>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 text-center text-xs text-[#FAF8F5]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© جميع الحقوق محفوظة لـ بن بدران بميت غمر</p>
          <p className="flex items-center gap-1.5">
            صنع بـ <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> لعشاق القهوة الأصيلة
          </p>
        </div>

      </div>
    </footer>
  );
}

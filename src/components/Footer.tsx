import Image from "next/image";
import { Phone, MapPin, Clock, Heart, Mail } from "lucide-react";
import { PHONE_DISPLAY, PHONE_TEL_LINK, FACEBOOK_URL, INSTAGRAM_URL, EMAIL_ADDRESS, EXACT_ADDRESS_EN } from "@/lib/constants";
import { trackContactClick } from "@/lib/analytics";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[#C5A059]/40 bg-[#1A110B] text-[#FAF8F5] font-alexandria pt-12 pb-24 sm:pb-8 relative">
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
            {/* Social Media Links */}
            <div className="pt-2 flex items-center justify-center md:justify-start gap-3">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#2A1D15] hover:bg-[#C5A059] text-[#C5A059] hover:text-white rounded-lg transition-colors border border-[#C5A059]/30 flex items-center gap-1.5 text-xs font-semibold"
                aria-label="فيسبوك"
              >
                <FacebookIcon className="w-4 h-4" />
                <span>فيسبوك</span>
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#2A1D15] hover:bg-[#C5A059] text-[#C5A059] hover:text-white rounded-lg transition-colors border border-[#C5A059]/30 flex items-center gap-1.5 text-xs font-semibold"
                aria-label="انستجرام"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>انستجرام</span>
              </a>
            </div>
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
            <p className="text-xs text-[#FAF8F5]/90 flex items-start justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <span>{EXACT_ADDRESS_EN}</span>
            </p>
            <p className="text-xs text-[#FAF8F5]/90 flex items-center justify-center md:justify-start gap-2">
              <Phone className="w-4 h-4 text-[#C5A059]" />
              <a
                href={PHONE_TEL_LINK}
                onClick={() => trackContactClick('call')}
                className="font-price font-bold hover:text-[#C5A059] transition-colors"
              >
                {PHONE_DISPLAY}
              </a>
            </p>
            <p className="text-xs text-[#FAF8F5]/90 flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-[#C5A059]" />
              <a href={`mailto:${EMAIL_ADDRESS}`} className="hover:text-[#C5A059] transition-colors font-mono dir-ltr">
                {EMAIL_ADDRESS}
              </a>
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

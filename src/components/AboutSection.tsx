import Image from "next/image";
import { BookOpen, CheckCircle, ShieldCheck, Flame } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-8 md:py-12 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-6 md:p-10">
        
        {/* Solid Badge Title */}
        <div className="mb-8 text-center sm:text-right">
          <span className="solid-badge text-lg">
            <BookOpen className="w-5 h-5 text-[#C97A2B]" />
            <span>قصتنا وعراقة المحل</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Shop Photo with Heritage Overlapping Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded border-4 border-[#3A2416] overflow-hidden shadow-lg aspect-[4/3] bg-[#3A2416]">
              <Image
                src="/محل.jpg"
                alt="محل بن بدران - ميت غمر"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#3A2416] to-transparent p-4 text-white font-lalezar text-center">
                محل بن بدران — ميت غمر
              </div>
            </div>
            {/* Heritage Ribbon Accent */}
            <div className="absolute -top-3 -right-3 heritage-ribbon text-xs font-lalezar shadow-md z-10">
              الفرع الأصلي
            </div>
          </div>

          {/* Story Text & Values */}
          <div className="lg:col-span-7 space-y-4 font-tajawal text-[#3A2416]">
            <h3 className="font-lalezar text-2xl md:text-3xl text-[#3A2416] border-b border-dashed border-[#3A2416]/30 pb-3">
              من القلب إلى الفنجان.. رحلة بن بدران
            </h3>
            
            <p className="text-base md:text-lg leading-relaxed text-[#3A2416]/90">
              تأسس **بن بدران (Budran Coffee)** ليكون وجهة عشاق القهوة الحقيقيين في ميت غمر والمحافظة. نحن لا نكتفي ببيع البن، بل نعيش شغف القهوة في كل مرحلة: من اختيار الحبوب الخضراء النقية من أشهر المزارع العالمية، وحتى طحنها وتحويجها أمام عينيك بأعلى قدر من الدقة.
            </p>

            <p className="text-base leading-relaxed text-[#3A2416]/80">
              نتميز بتحويجتنا الفريدة التي تعتمد على أجود أصناف الحبهان الهندي الأخضر الأصلي والمستكة اليونانية، مع درجات تحميص متعددة (فاتح، وسط، غامق) تناسب كافة الأذواق ورغبات المزاج.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 font-semibold text-sm">
              <div className="flex items-center gap-2 bg-[#FFF8F6] p-2.5 rounded border border-[#3A2416]/20">
                <CheckCircle className="w-4 h-4 text-[#6B2A22]" />
                <span>حبوب بن صافية 100% بدون أي إضافات ضارة</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FFF8F6] p-2.5 rounded border border-[#3A2416]/20">
                <Flame className="w-4 h-4 text-[#C97A2B]" />
                <span>طحن وتغليف محكم طازج عند الطلب</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FFF8F6] p-2.5 rounded border border-[#3A2416]/20">
                <ShieldCheck className="w-4 h-4 text-[#6B2A22]" />
                <span>خلطات فرنسية بنكهات للبندق والشوكولاتة والفانيليا</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FFF8F6] p-2.5 rounded border border-[#3A2416]/20">
                <CheckCircle className="w-4 h-4 text-[#C97A2B]" />
                <span>تلبية الطلبات الخاصة والتوليفات حسب طلب العميل</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

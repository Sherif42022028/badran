import Image from "next/image";
import { BookOpen, CheckCircle, ShieldCheck, Flame } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-10 md:py-16 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-8 md:p-14">
        
        {/* Solid Badge Title */}
        <div className="mb-10 text-center sm:text-right">
          <span className="solid-badge text-sm md:text-base">
            <BookOpen className="w-4 h-4 text-[#C89B3C]" />
            <span>قصتنا وعراقة بن بدران</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Shop Photo with Luxury Gold Border & Ribbon */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl border-2 border-[#C89B3C]/60 p-1.5 bg-white shadow-xl">
              <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-[#1E110A]">
                <Image
                  src="/محل.jpg"
                  alt="محل بن بدران - ميت غمر"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E110A]/90 via-transparent to-transparent flex items-end p-4 text-white">
                  <p className="font-amiri text-lg text-[#D4AF37]">
                    محل بن بدران الأصلي — ميت غمر
                  </p>
                </div>
              </div>
            </div>

            {/* Gold Ribbon Accent */}
            <div className="absolute -top-3 -right-3 heritage-ribbon text-[11px] font-alexandria font-bold shadow-lg z-10">
              الفرع الأصلي 📍
            </div>
          </div>

          {/* Story Text & Values */}
          <div className="lg:col-span-7 space-y-5 font-alexandria text-[#1E110A]">
            <h3 className="font-amiri text-3xl md:text-4xl text-[#1E110A] border-b border-dashed border-[#C89B3C]/30 pb-4">
              رحلة الشغف.. من الأغصان العالمية إلى الفنجان
            </h3>
            
            <p className="text-sm md:text-base leading-relaxed text-[#1E110A]/85 font-light">
              تأسس **بن بدران (Budran Coffee)** ليكون المقصد الأول لعشاق القهوة الأصيلة في ميت غمر والمحافظة. نحن لا نكتفي بتقديم القهوة، بل نعيش شغف العراقة في كل مرحلة: من استيراد الحبوب الخضراء النقية من أعالي المزارع العالمية، وحتى طحنها وتحويجها أمام عينيك باحترافية وتوازن.
            </p>

            <p className="text-sm leading-relaxed text-[#1E110A]/75 font-light">
              نتميز بتوليفاتنا الخاصة التي تعتمد على أجود أصناف الحبهان الهندي الأخضر فرز أول والمستكة اليونانية، مع درجات تحميص بدقة متناهية (فاتح، وسط، غامق) تناسب كافة الأذواق ورغبات المزاج المرفوع.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-xs font-medium">
              <div className="flex items-center gap-2.5 bg-white p-3 rounded-lg border border-[#C89B3C]/25 shadow-xs">
                <CheckCircle className="w-4 h-4 text-[#C89B3C] shrink-0" />
                <span>حبوب بن نقي 100% بدون أي إضافات</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white p-3 rounded-lg border border-[#C89B3C]/25 shadow-xs">
                <Flame className="w-4 h-4 text-[#C89B3C] shrink-0" />
                <span>طحن وتغليف محكم طازج عند الطلب</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white p-3 rounded-lg border border-[#C89B3C]/25 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#C89B3C] shrink-0" />
                <span>خلطات فرنسية بالنكهات والكريمة الناعمة</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white p-3 rounded-lg border border-[#C89B3C]/25 shadow-xs">
                <CheckCircle className="w-4 h-4 text-[#C89B3C] shrink-0" />
                <span>توليفات ملكية مخصصة حسب رغبتك</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

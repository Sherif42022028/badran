import Image from "next/image";
import { CheckCircle, ShieldCheck, Flame, Store } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-10 md:py-16 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-8 md:p-14">
        
        {/* Solid Badge Title */}
        <div className="mb-8 text-center sm:text-right">
          <span className="solid-badge text-sm md:text-base">
            <Store className="w-4 h-4 text-[#C5A059]" />
            <span>قصة المحل والعراقة</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Shop Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl border border-[#C5A059]/60 p-1.5 bg-white shadow-md">
              <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-[#1A110B]">
                <Image
                  src="/محل.jpg"
                  alt="محل بن بدران في ميت غمر"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A110B]/90 via-transparent to-transparent flex items-end p-4 text-white">
                  <p className="font-amiri text-lg text-[#C5A059]">
                    فرع بن بدران الرئيسي بميت غمر
                  </p>
                </div>
              </div>
            </div>

            {/* Local Ribbon */}
            <div className="absolute -top-3 -right-3 heritage-ribbon text-[11px] font-alexandria font-bold shadow-md z-10">
              ميت غمر 📍
            </div>
          </div>

          {/* Genuine Local Story */}
          <div className="lg:col-span-7 space-y-4 font-alexandria text-[#1A110B]">
            <h3 className="font-amiri text-3xl md:text-4xl text-[#1A110B] border-b border-dashed border-[#C5A059]/30 pb-3">
              من المحل لفنجانك.. السر في تحميصة بدران
            </h3>
            
            <p className="text-sm md:text-base leading-relaxed text-[#1A110B]/85 font-light">
              تأسس **بن بدران** ليكون الوجهة الأولى لعشاق القهوة الحقيقيين في ميت غمر والدقهلية. نحن نهتم بكل تفصيلة في القهوة: بدءاً من اختيار حبوب البن الخضراء الصافية، وحتى تحميصها وطحنها قدام عينك في المحل بالنسبة والتحويجة اللي تحبها.
            </p>

            <p className="text-sm leading-relaxed text-[#1A110B]/80 font-light">
              بنقدم لكم خلطات بدران الخاصة المحوجة بأجود أنواع الحبهان الهندي الأخضر والمستكة اليوناني الأصلي، مع كافة درجات التحميص (فاتح، وسط، غامق - سادة ومحوج) لتناسب ذوقك واحتياجك.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium">
              <div className="flex items-center gap-2.5 bg-[#F7F4EF] p-3 rounded-lg border border-[#1A110B]/10">
                <CheckCircle className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>حبوب بن صافية 100% بدون إضافات</span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#F7F4EF] p-3 rounded-lg border border-[#1A110B]/10">
                <Flame className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>طحن وتعبئة طازة عند الطلب</span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#F7F4EF] p-3 rounded-lg border border-[#1A110B]/10">
                <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>فرنساوي بالبندق والشوكولاتة والفانيليا</span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#F7F4EF] p-3 rounded-lg border border-[#1A110B]/10">
                <CheckCircle className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>تجهيز الخلطات والتوليفات الخاصة</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

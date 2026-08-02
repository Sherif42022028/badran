"use client";

import { CheckCircle, ShieldCheck, Flame, Store } from "lucide-react";
import TiltedCard from "@/components/reactbits/TiltedCard";

export default function AboutSection() {
  return (
    <section id="about" className="py-4 md:py-8 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-5 sm:p-8 md:p-10">
        
        {/* Solid Badge Title */}
        <div className="mb-6 text-center sm:text-right">
          <span className="solid-badge text-xs md:text-sm py-1 px-3">
            <Store className="w-4 h-4 text-[#C5A059]" />
            <span>قصة المحل والعراقة</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Shop Photo with 3D Tilt Effect */}
          <div className="lg:col-span-5 relative">
            <TiltedCard
              imageSrc="/محل.jpg"
              altText="محل بن بدران في ميت غمر"
              captionText="محل بن بدران بميت غمر 📍"
              containerHeight="260px"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              scaleOnHover={1.04}
              rotateAmplitude={12}
              showTooltip={true}
            />

            {/* Local Ribbon */}
            <div className="absolute -top-3 -right-3 heritage-ribbon text-[10px] font-alexandria font-bold shadow-md z-10">
              ميت غمر 📍
            </div>
          </div>

          {/* Genuine Local Story */}
          <div className="lg:col-span-7 space-y-3 font-alexandria text-[#1A110B]">
            <h3 className="font-amiri text-2xl md:text-3xl text-[#1A110B] border-b border-dashed border-[#C5A059]/30 pb-2">
              من المحل لفنجانك.. السر في تحميصة بدران
            </h3>
            
            <p className="text-xs md:text-sm leading-relaxed text-[#1A110B]/85 font-light">
              تأسس **بن بدران** ليكون الوجهة الأولى لعشاق القهوة الحقيقيين في ميت غمر والدقهلية. نحن نهتم بكل تفصيلة في القهوة: بدءاً من اختيار حبوب البن الخضراء الصافية، وحتى تحميصها وطحنها قدام عينك في المحل بالنسبة والتحويجة اللي تحبها.
            </p>

            <p className="text-xs md:text-sm leading-relaxed text-[#1A110B]/80 font-light">
              بنقدم لكم خلطات بدران الخاصة المحوجة بأجود أنواع الحبهان الهندي الأخضر والمستكة اليوناني الأصلي، مع كافة درجات التحميص (فاتح، وسط، غامق - سادة ومحوج) لتناسب ذوقك واحتياجك.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-medium">
              <div className="flex items-center gap-2 bg-[#F7F4EF] p-2.5 rounded-lg border border-[#1A110B]/10">
                <CheckCircle className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>حبوب بن صافية 100% بدون إضافات</span>
              </div>
              <div className="flex items-center gap-2 bg-[#F7F4EF] p-2.5 rounded-lg border border-[#1A110B]/10">
                <Flame className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>طحن وتعبئة طازة عند الطلب</span>
              </div>
              <div className="flex items-center gap-2 bg-[#F7F4EF] p-2.5 rounded-lg border border-[#1A110B]/10">
                <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>فرنساوي بالبندق والشوكولاتة والفانيليا</span>
              </div>
              <div className="flex items-center gap-2 bg-[#F7F4EF] p-2.5 rounded-lg border border-[#1A110B]/10">
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

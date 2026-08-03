"use client";

import { useState } from "react";
import { Sparkles, Coffee, CheckCircle, MessageSquare } from "lucide-react";
import { trackContactClick } from "@/lib/analytics";

export default function BlendBuilder() {
  const [roast, setRoast] = useState<string>("وسط");
  const [cardamom, setCardamom] = useState<string>("محوج وسط");
  const [origin, setOrigin] = useState<string>("خلطة كولومبي وحبشي");
  const [additions, setAdditions] = useState<string[]>(["مستكة يوناني"]);
  const [weight, setWeight] = useState<string>("ربع كيلو (250جم)");

  const toggleAddition = (item: string) => {
    if (additions.includes(item)) {
      setAdditions(additions.filter((a) => a !== item));
    } else {
      setAdditions([...additions, item]);
    }
  };

  const basePrices: Record<string, number> = {
    "ثمن كيلو (125جم)": 90,
    "ربع كيلو (250جم)": 175,
    "نصف كيلو (500جم)": 340,
    "كيلو كامل": 660,
  };

  const cardamomAddons: Record<string, number> = {
    سادة: 0,
    "محوج خفيف": 15,
    "محوج وسط": 25,
    "محوج رويال سوبر": 45,
  };

  const totalCalculated =
    (basePrices[weight] || 175) +
    (cardamomAddons[cardamom] || 0) +
    additions.length * 10;

  const handleWhatsAppOrder = () => {
    trackContactClick('whatsapp');
    const message = `أهلاً بن بدران 👋 أرغب في طلب خلطة قهوة خاصة بالخيارات التالية:
• التحميص: ${roast}
• التحويج: ${cardamom}
• نوع البن: ${origin}
• الإضافات: ${additions.length > 0 ? additions.join(" + ") : "بدون إضافات"}
• الوزن: ${weight}
• التكلفة التقديرية: ${totalCalculated} ج.م`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/201020499680?text=${encoded}`, "_blank");
  };

  return (
    <section id="blend-builder" className="py-4 md:py-8 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-5 sm:p-8 md:p-10">
        
        {/* Section Header */}
        <div className="text-center mb-6">
          <span className="solid-badge text-xs md:text-sm mb-2 py-1 px-3">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>ازاي بتحب قهوتك؟ ركّب خلطتك بنفسك</span>
          </span>
          <p className="font-alexandria text-xs md:text-sm text-[#1A110A]/75 max-w-2xl mx-auto mt-2 font-light">
            اختار درجة التحميص ونسبة الحبهان والإضافات اللي تظبط مزاجك، ونجهزها ونطحنها لك خصيصاً في المحل.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Builder Controls */}
          <div className="lg:col-span-8 space-y-6 font-alexandria">
            
            {/* 1. Roast Selection */}
            <div>
              <label className="font-amiri text-lg font-bold text-[#1A110A] block mb-2">
                1. درجة التحميص:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {["فاتح", "وسط", "غامق"].map((title) => (
                  <button
                    key={title}
                    onClick={() => setRoast(title)}
                    className={`p-3 rounded-lg border text-xs font-bold transition-all ${
                      roast === title
                        ? "bg-[#1A110A] text-[#C5A059] border-[#C5A059]"
                        : "bg-white text-[#1A110A] border-[#1A110A]/15 hover:bg-[#1A110A]/5"
                    }`}
                  >
                    {title}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Cardamom & Spices */}
            <div>
              <label className="font-amiri text-lg font-bold text-[#1A110A] block mb-2">
                2. مستوى التحويج والحبهان:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {["سادة", "محوج خفيف", "محوج وسط", "محوج رويال سوبر"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setCardamom(item)}
                    className={`p-2.5 rounded-lg border text-xs font-bold transition-all ${
                      cardamom === item
                        ? "bg-[#3D120E] text-white border-[#C5A059]/50"
                        : "bg-white text-[#1A110A] border-[#1A110A]/15 hover:bg-[#1A110A]/5"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Base Coffee Origin */}
            <div>
              <label className="font-amiri text-lg font-bold text-[#1A110A] block mb-2">
                3. نوع البن الأساسي:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  "خلطة كولومبي وحبشي",
                  "بن يمني أصيل 100%",
                  "توليفة بن بدران الخاصة",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setOrigin(item)}
                    className={`p-3 rounded-lg border text-xs font-bold transition-all ${
                      origin === item
                        ? "bg-[#1A110A] text-[#C5A059] border-[#C5A059]"
                        : "bg-white text-[#1A110A] border-[#1A110A]/15 hover:bg-[#1A110A]/5"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Special Additions */}
            <div>
              <label className="font-amiri text-lg font-bold text-[#1A110A] block mb-2">
                4. الإضافات الخاصة:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {["مستكة يوناني", "زر ورد طبيعي", "جوزة الطيب", "قرفة خشابي"].map((item) => {
                  const selected = additions.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleAddition(item)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                        selected
                          ? "bg-[#C5A059] text-white border border-[#C5A059]"
                          : "bg-white text-[#1A110A] border border-[#1A110A]/15 hover:bg-[#1A110A]/5"
                      }`}
                    >
                      <CheckCircle className={`w-3.5 h-3.5 ${selected ? "text-white" : "opacity-30"}`} />
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Weight Selection */}
            <div>
              <label className="font-amiri text-lg font-bold text-[#1A110A] block mb-2">
                5. الوزن المطلوب:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {["ثمن كيلو (125جم)", "ربع كيلو (250جم)", "نصف كيلو (500جم)", "كيلو كامل"].map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeight(w)}
                    className={`p-2.5 rounded-lg border text-xs font-bold transition-all ${
                      weight === w
                        ? "bg-[#1A110A] text-[#C5A059] border-[#C5A059]"
                        : "bg-white text-[#1A110A] border-[#1A110A]/15"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Live Order Summary Card */}
          <div className="lg:col-span-4 bg-[#1A110A] text-[#FAF8F5] p-5 rounded-xl border border-[#C5A059]/40 shadow-md sticky top-24 font-alexandria space-y-4">
            <h4 className="font-amiri text-xl text-[#C5A059] border-b border-dashed border-[#C5A059]/30 pb-2.5 flex items-center gap-2">
              <Coffee className="w-4 h-4 text-[#C5A059]" />
              <span>ملخص خلطتك الخاصة</span>
            </h4>

            <div className="space-y-2 text-xs text-[#FAF8F5]/90">
              <div className="flex justify-between border-b border-dashed border-[#C5A059]/20 pb-1.5">
                <span className="text-[#C5A059]">التحميص:</span>
                <span className="font-bold">{roast}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#C5A059]/20 pb-1.5">
                <span className="text-[#C5A059]">التحويج:</span>
                <span className="font-bold">{cardamom}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#C5A059]/20 pb-1.5">
                <span className="text-[#C5A059]">الأساس:</span>
                <span className="font-bold">{origin}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#C5A059]/20 pb-1.5">
                <span className="text-[#C5A059]">الإضافات:</span>
                <span className="font-bold text-[#C5A059]">
                  {additions.length > 0 ? additions.join("، ") : "لا يوجد"}
                </span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#C5A059]/20 pb-1.5">
                <span className="text-[#C5A059]">الوزن:</span>
                <span className="font-bold">{weight}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-dashed border-[#C5A059]/40 flex items-baseline justify-between">
              <span className="font-alexandria text-xs text-[#FAF8F5]">السعر التقديري:</span>
              <span className="font-price font-bold text-2xl text-[#C5A059]">
                {totalCalculated} <span className="text-xs text-[#FAF8F5]">ج.م</span>
              </span>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] hover:bg-[#1ebd59] text-white font-alexandria font-bold text-sm py-3 rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 mt-3"
            >
              <MessageSquare className="w-4 h-4" />
              <span>اطلب الخلطة عبر الواتساب</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

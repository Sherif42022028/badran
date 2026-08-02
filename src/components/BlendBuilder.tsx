"use client";

import { useState } from "react";
import { Sparkles, Coffee, Sliders, CheckCircle, MessageSquare } from "lucide-react";

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

  // Base price calculation estimate
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
    const message = `أهلاً بن بدران 👋 أرغب في طلب توليفة قهوة خاصة بالمواصفات التالية:
• درجة التحميص: ${roast}
• مستوى التحويج: ${cardamom}
• نوع البن الأساسي: ${origin}
• الإضافات الخاصة: ${additions.length > 0 ? additions.join(" + ") : "بدون إضافات"}
• الوزن المطلوب: ${weight}
• التكلفة التقديرية: ${totalCalculated} ج.م`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/201020499680?text=${encoded}`, "_blank");
  };

  return (
    <section id="blend-builder" className="py-8 md:py-14 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-6 md:p-10">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="solid-badge text-xl mb-3">
            <Sparkles className="w-5 h-5 text-[#C97A2B]" />
            <span>صمّم توليفتك المخصصة بنفسك</span>
          </span>
          <p className="font-tajawal text-sm md:text-base text-[#3A2416]/80 max-w-2xl mx-auto mt-2">
            حدد درجة التحميص ومستوى التحويج بالإضافات المميزة لنقوم بطحنها وتوليفها لك خصيصاً في المحل.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Builder Controls */}
          <div className="lg:col-span-8 space-y-6 font-tajawal">
            
            {/* 1. Roast Selection */}
            <div>
              <label className="font-lalezar text-lg text-[#3A2416] block mb-2">
                1. درجة التحميص المفضلة:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["فاتح (Light)", "وسط (Medium)", "غامق (Dark)"].map((item) => {
                  const title = item.split(" ")[0];
                  return (
                    <button
                      key={title}
                      onClick={() => setRoast(title)}
                      className={`p-3 rounded border text-sm font-semibold transition-all ${
                        roast === title
                          ? "bg-[#3A2416] text-[#FFF8F6] border-[#3A2416] shadow-sm"
                          : "bg-[#FFF8F6] text-[#3A2416] border-[#3A2416]/30 hover:bg-[#3A2416]/10"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Cardamom & Spices */}
            <div>
              <label className="font-lalezar text-lg text-[#3A2416] block mb-2">
                2. مستوى التحويج والحبهان:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["سادة", "محوج خفيف", "محوج وسط", "محوج رويال سوبر"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setCardamom(item)}
                    className={`p-2.5 rounded border text-xs sm:text-sm font-semibold transition-all ${
                      cardamom === item
                        ? "bg-[#6B2A22] text-white border-[#6B2A22] shadow-sm"
                        : "bg-[#FFF8F6] text-[#3A2416] border-[#3A2416]/30 hover:bg-[#3A2416]/10"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Base Coffee Origin */}
            <div>
              <label className="font-lalezar text-lg text-[#3A2416] block mb-2">
                3. نوع البن والخلطة الأساسية:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  "خلطة كولومبي وحبشي",
                  "بن يمني أصيل 100%",
                  "توليفة بن بدران الملكية",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setOrigin(item)}
                    className={`p-3 rounded border text-xs sm:text-sm font-semibold transition-all ${
                      origin === item
                        ? "bg-[#3A2416] text-[#FFF8F6] border-[#3A2416] shadow-sm"
                        : "bg-[#FFF8F6] text-[#3A2416] border-[#3A2416]/30 hover:bg-[#3A2416]/10"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Special Additions */}
            <div>
              <label className="font-lalezar text-lg text-[#3A2416] block mb-2">
                4. الإضافات التراثية الخاصة:
              </label>
              <div className="flex flex-wrap gap-3">
                {["مستكة يوناني", "زر ورد طبيعي", "جوزة الطيب", "قرفة خشابي"].map((item) => {
                  const selected = additions.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleAddition(item)}
                      className={`px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        selected
                          ? "bg-[#C97A2B] text-white border border-[#C97A2B]"
                          : "bg-[#FFF8F6] text-[#3A2416] border border-[#3A2416]/30 hover:bg-[#3A2416]/10"
                      }`}
                    >
                      <CheckCircle className={`w-3.5 h-3.5 ${selected ? "text-white" : "opacity-40"}`} />
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Weight Selection */}
            <div>
              <label className="font-lalezar text-lg text-[#3A2416] block mb-2">
                5. الوزن المطلوب:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["ثمن كيلو (125جم)", "ربع كيلو (250جم)", "نصف كيلو (500جم)", "كيلو كامل"].map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeight(w)}
                    className={`p-2.5 rounded border text-xs font-semibold transition-all ${
                      weight === w
                        ? "bg-[#3A2416] text-[#FFF8F6] border-[#3A2416]"
                        : "bg-[#FFF8F6] text-[#3A2416] border-[#3A2416]/30"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Live Order Summary Card */}
          <div className="lg:col-span-4 bg-[#FFF8F6] p-6 rounded border-2 border-[#3A2416] shadow-md sticky top-24 font-tajawal space-y-4">
            <h4 className="font-lalezar text-xl text-[#3A2416] border-b border-dashed border-[#3A2416]/30 pb-3 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-[#C97A2B]" />
              <span>ملخص التوليفة الخاصة</span>
            </h4>

            <div className="space-y-2 text-xs md:text-sm text-[#3A2416]">
              <div className="flex justify-between border-b border-dashed border-[#3A2416]/20 pb-1.5">
                <span>التحميص:</span>
                <span className="font-bold">{roast}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#3A2416]/20 pb-1.5">
                <span>التحويج:</span>
                <span className="font-bold text-[#6B2A22]">{cardamom}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#3A2416]/20 pb-1.5">
                <span>الأساس:</span>
                <span className="font-bold">{origin}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#3A2416]/20 pb-1.5">
                <span>الإضافات:</span>
                <span className="font-bold text-[#C97A2B]">
                  {additions.length > 0 ? additions.join("، ") : "لا يوجد"}
                </span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#3A2416]/20 pb-1.5">
                <span>الوزن:</span>
                <span className="font-bold">{weight}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-dashed border-[#3A2416]/40 flex items-baseline justify-between">
              <span className="font-lalezar text-lg text-[#3A2416]">التكلفة التقديرية:</span>
              <span className="font-price font-bold text-2xl text-[#6B2A22]">
                {totalCalculated} <span className="text-xs text-[#3A2416]">ج.م</span>
              </span>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] hover:bg-[#1ebd59] text-white font-lalezar text-lg py-3 rounded border border-[#1ebd59] transition-all shadow-md flex items-center justify-center gap-2 mt-4"
            >
              <MessageSquare className="w-5 h-5" />
              <span>اطلب التوليفة عبر واتساب</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

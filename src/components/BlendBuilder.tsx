"use client";

import { useState } from "react";
import { Sparkles, Coffee, CheckCircle, MessageSquare, User, Phone, FileText, Scale, Plus, Minus } from "lucide-react";
import { trackContactClick } from "@/lib/analytics";
import { generateOrderId } from "@/lib/orderId";
import { WHATSAPP_NUMBER } from "@/config/whatsapp";
import { buildWhatsAppLink } from "@/lib/whatsapp/buildWhatsAppLink";
import { generateBlendWhatsAppMessage, CustomBlendOrder } from "@/lib/whatsapp/generateWhatsAppMessage";
import OrderPreviewModal from "@/components/OrderPreviewModal";
import { CheckoutOrder } from "@/types/Order";

export default function BlendBuilder() {
  const [roast, setRoast] = useState<string>("وسط");
  const [cardamom, setCardamom] = useState<string>("محوج وسط");
  const [origin, setOrigin] = useState<string>("خلطة كولومبي وحبشي");
  const [additions, setAdditions] = useState<string[]>(["مستكة يوناني"]);
  
  // Custom Grams State
  const [isCustomGrams, setIsCustomGrams] = useState<boolean>(false);
  const [customGrams, setCustomGrams] = useState<number>(250);
  const [presetWeight, setPresetWeight] = useState<string>("ربع كيلو — 250 جم");

  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [builtMessage, setBuiltMessage] = useState("");
  const [checkoutOrderObj, setCheckoutOrderObj] = useState<CheckoutOrder | null>(null);

  const toggleAddition = (item: string) => {
    if (additions.includes(item)) {
      setAdditions(additions.filter((a) => a !== item));
    } else {
      setAdditions([...additions, item]);
    }
  };

  // Base price per kilo depending on coffee origin
  const originKiloPrices: Record<string, number> = {
    "خلطة كولومبي وحبشي": 760,
    "بن يمني أصيل 100%": 1800,
    "توليفة بن بدران الخاصة": 680,
    "بن برازيلي سانتوس": 720,
    "بن هندي بلانتيشن": 760,
  };

  // Cardamom additions per kilo
  const cardamomAddonsPerKilo: Record<string, number> = {
    "سادة": 0,
    "محوج خفيف": 80,
    "محوج وسط": 120,
    "محوج رويال سوبر": 180,
  };

  // Active weight in grams
  const effectiveGrams = isCustomGrams
    ? customGrams
    : presetWeight === "ثمن كيلو — 125 جم"
    ? 125
    : presetWeight === "ربع كيلو — 250 جم"
    ? 250
    : presetWeight === "نصف كيلو — 500 جم"
    ? 500
    : 1000;

  const displayWeightLabel = isCustomGrams
    ? `${customGrams} جرام (توليفة مخصصة)`
    : presetWeight;

  // Calculate dynamic price proportional to grams
  const baseKilo = originKiloPrices[origin] || 680;
  const cardamomKilo = cardamomAddonsPerKilo[cardamom] || 0;
  const totalKiloPrice = baseKilo + cardamomKilo;

  const weightRatio = effectiveGrams / 1000;
  const coffeePrice = Math.round(totalKiloPrice * weightRatio);
  const additionsPrice = additions.length * Math.round(15 * Math.max(weightRatio, 0.25));
  const totalCalculated = Math.max(coffeePrice + additionsPrice, 20);

  const handlePresetSelect = (w: string, grams: number) => {
    setIsCustomGrams(false);
    setPresetWeight(w);
    setCustomGrams(grams);
  };

  const handleCustomGramsChange = (val: number) => {
    const clamped = Math.max(50, Math.min(val || 50, 5000));
    setCustomGrams(clamped);
    setIsCustomGrams(true);
  };

  const handleOpenPreview = () => {
    trackContactClick("whatsapp");

    const orderId = generateOrderId("BD");

    const blendOrder: CustomBlendOrder = {
      orderId,
      customerName,
      customerPhone,
      roast,
      cardamom,
      origin,
      additions,
      weight: displayWeightLabel,
      totalPrice: totalCalculated,
      notes,
    };

    const message = generateBlendWhatsAppMessage(blendOrder);

    const summaryOrderObj: CheckoutOrder = {
      orderId,
      customer: {
        name: customerName.trim() || "عميل بن بدران",
        phone: customerPhone.trim() || "01020499680",
      },
      orderType: "Pickup",
      items: [
        {
          name: `خلطة بن خاصة (${origin}) - ${displayWeightLabel}`,
          quantity: 1,
          options: {
            size: displayWeightLabel,
            sugar: cardamom,
            extras: [`التحميص: ${roast}`, ...additions],
          },
        },
      ],
      subtotal: totalCalculated,
      total: totalCalculated,
      paymentMethod: "Cash",
      additionalNote: notes || undefined,
      currency: "ج.م",
    };

    setBuiltMessage(message);
    setCheckoutOrderObj(summaryOrderObj);
    setIsPreviewOpen(true);
  };

  const handleSendViaWhatsApp = () => {
    if (!builtMessage) return;

    try {
      const targetPhone = WHATSAPP_NUMBER || "201020499680";
      const link = buildWhatsAppLink(targetPhone, builtMessage);

      if (typeof window !== "undefined") {
        try {
          const lastOrder = {
            orderId: checkoutOrderObj?.orderId,
            type: "Custom Blend",
            roast,
            cardamom,
            origin,
            additions,
            weight: displayWeightLabel,
            totalPrice: totalCalculated,
            customerName,
            customerPhone,
            notes,
            timestamp: new Date().toISOString(),
          };
          localStorage.setItem("badran_last_order", JSON.stringify(lastOrder));
        } catch (e) {
          console.warn("Failed to save to localStorage", e);
        }
      }

      window.open(link, "_blank", "noopener,noreferrer");
      setIsPreviewOpen(false);
    } catch (err: any) {
      alert(err?.message || "حدث خطأ أثناء إنشاء رابط الطلب عبر الواتساب");
    }
  };

  return (
    <section id="blend-builder" className="py-6 md:py-10 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-5 sm:p-8 md:p-10 bg-white">
        {/* Section Header */}
        <div className="text-center mb-6">
          <span className="solid-badge text-xs md:text-sm mb-2 py-1 px-4">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>ازاي بتحب قهوتك؟ ركّب خلطتك بالجرام على مزاجك</span>
          </span>
          <h3 className="font-amiri text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A110B] mt-2">
            مُصمم توليفات بن بدران الخاصة
          </h3>
          <p className="font-alexandria text-xs md:text-sm text-[#1A110A]/75 max-w-2xl mx-auto mt-2 font-light leading-relaxed">
            اختار البن الأساسي ودرجة التحميص ونسبة الحبهان والإضافات، وحدد الجرامات بدقة حسب راحتك وسنحسب لك السعر الفوري ونطحنها لك طازجة في المحل.
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
                    type="button"
                    onClick={() => setRoast(title)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      roast === title
                        ? "bg-[#1A110A] text-[#C5A059] border-[#C5A059] shadow-xs"
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
                    type="button"
                    onClick={() => setCardamom(item)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      cardamom === item
                        ? "bg-[#3D120E] text-white border-[#C5A059]/50 shadow-xs"
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
                  "توليفة بن بدران الخاصة",
                  "خلطة كولومبي وحبشي",
                  "بن يمني أصيل 100%",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setOrigin(item)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      origin === item
                        ? "bg-[#1A110A] text-[#C5A059] border-[#C5A059] shadow-xs"
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
                      type="button"
                      onClick={() => toggleAddition(item)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                        selected
                          ? "bg-[#C5A059] text-white border border-[#C5A059] shadow-2xs"
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

            {/* 5. Custom Grams & Weight Selection */}
            <div className="p-4 bg-[#F7F4EF] rounded-2xl border border-[#C5A059]/40 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-amiri text-lg font-bold text-[#1A110A] flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#C5A059]" />
                  <span>5. تحديد الوزن والجرامات بدقة:</span>
                </label>
                <span className="text-xs font-bold font-price bg-[#1A110A] text-[#C5A059] px-3 py-1 rounded-lg">
                  {effectiveGrams} جرام
                </span>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "ثمن كيلو — 125 جم", g: 125 },
                  { label: "ربع كيلو — 250 جم", g: 250 },
                  { label: "نصف كيلو — 500 جم", g: 500 },
                  { label: "كيلو كامل — 1000 جم", g: 1000 },
                ].map((w) => {
                  const isSelected = !isCustomGrams && presetWeight === w.label;
                  return (
                    <button
                      key={w.label}
                      type="button"
                      onClick={() => handlePresetSelect(w.label, w.g)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-[#1A110A] text-[#C5A059] border-[#C5A059] shadow-xs"
                          : "bg-white text-[#1A110A] border-[#1A110A]/15 hover:bg-[#1A110A]/5"
                      }`}
                    >
                      {w.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom Grams Manual Input & Range Slider */}
              <div className="pt-3 border-t border-dashed border-[#C5A059]/30 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#1A110A]">
                  <span>أو اكتب الجرامات يدوياً (حسب رغبتك):</span>
                  <button
                    type="button"
                    onClick={() => setIsCustomGrams(true)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-md font-semibold transition-colors ${
                      isCustomGrams
                        ? "bg-[#C5A059] text-white"
                        : "bg-[#1A110A]/10 text-[#1A110A] hover:bg-[#1A110A]/20"
                    }`}
                  >
                    تفعيل الوزن الحر
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Minus button */}
                  <button
                    type="button"
                    onClick={() => handleCustomGramsChange(effectiveGrams - 25)}
                    className="p-2.5 bg-white border border-[#1A110A]/20 rounded-xl hover:bg-[#1A110A]/5 text-[#1A110A] transition-all shrink-0"
                    title="تقليل 25 جرام"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  {/* Range slider */}
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="25"
                    value={effectiveGrams}
                    onChange={(e) => handleCustomGramsChange(Number(e.target.value))}
                    className="flex-1 accent-[#C5A059] h-2 bg-white rounded-lg cursor-pointer"
                  />

                  {/* Plus button */}
                  <button
                    type="button"
                    onClick={() => handleCustomGramsChange(effectiveGrams + 25)}
                    className="p-2.5 bg-white border border-[#1A110A]/20 rounded-xl hover:bg-[#1A110A]/5 text-[#1A110A] transition-all shrink-0"
                    title="زيادة 25 جرام"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Number Input */}
                  <div className="flex items-center gap-1 bg-white border border-[#C5A059] rounded-xl px-3 py-1.5 shrink-0 shadow-2xs">
                    <input
                      type="number"
                      min="50"
                      max="5000"
                      step="10"
                      value={customGrams}
                      onChange={(e) => handleCustomGramsChange(Number(e.target.value))}
                      className="w-16 font-price font-bold text-center text-sm text-[#1A110A] focus:outline-none"
                    />
                    <span className="text-xs font-alexandria text-[#C5A059] font-bold">جم</span>
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-[#1A110A]/60 font-price px-1">
                  <span>50 جم (عينة خلطة)</span>
                  <span>250 جم (ربع)</span>
                  <span>500 جم (نصف)</span>
                  <span>1000 جم (كيلو)</span>
                  <span>2000 جم (2 ك)</span>
                </div>
              </div>
            </div>

            {/* 6. Customer Information (Optional) */}
            <div className="pt-3 border-t border-dashed border-[#C5A059]/30 space-y-3">
              <label className="font-amiri text-lg font-bold text-[#1A110A] block">
                6. بياناتك للتأكيد (اختياري):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <User className="w-4 h-4 text-[#C5A059] absolute top-3 right-3" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="الاسم الكريم..."
                    className="w-full py-2.5 pr-9 pl-3 bg-[#FAF8F5] border border-[#1A110A]/15 rounded-lg text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#C5A059] absolute top-3 right-3" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="رقم الهاتف..."
                    className="w-full py-2.5 pr-9 pl-3 bg-[#FAF8F5] border border-[#1A110A]/15 rounded-lg text-xs font-price focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
              <div className="relative">
                <FileText className="w-4 h-4 text-[#C5A059] absolute top-3 right-3" />
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي ملاحظات إضافية للطحن، درجة النعومة أو التغليف..."
                  className="w-full py-2.5 pr-9 pl-3 bg-[#FAF8F5] border border-[#1A110A]/15 rounded-lg text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          </div>

          {/* Live Order Summary Card */}
          <div className="lg:col-span-4 bg-[#1A110A] text-[#FAF8F5] p-5 rounded-2xl border-2 border-[#C5A059] shadow-xl sticky top-24 font-alexandria space-y-4">
            <h4 className="font-amiri text-xl text-[#C5A059] border-b border-dashed border-[#C5A059]/30 pb-2.5 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-[#C5A059]" />
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
                <span className="text-[#C5A059]">نوع البن:</span>
                <span className="font-bold">{origin}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#C5A059]/20 pb-1.5">
                <span className="text-[#C5A059]">الإضافات:</span>
                <span className="font-bold text-[#C5A059]">
                  {additions.length > 0 ? additions.join("، ") : "بدون إضافات"}
                </span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#C5A059]/20 pb-1.5">
                <span className="text-[#C5A059]">الوزن المطلوب:</span>
                <span className="font-bold text-white bg-[#C5A059]/30 px-2 py-0.5 rounded">
                  {displayWeightLabel}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-dashed border-[#C5A059]/40 flex items-baseline justify-between">
              <span className="font-alexandria text-xs text-[#FAF8F5]/80">السعر التقديري:</span>
              <span className="font-price font-bold text-2xl text-[#C5A059]">
                {totalCalculated} <span className="text-xs text-[#FAF8F5]">ج.م</span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleOpenPreview}
              className="w-full bg-[#25D366] hover:bg-[#1ebd59] text-white font-alexandria font-bold text-sm py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-3 cursor-pointer active:scale-98"
            >
              <MessageSquare className="w-4 h-4" />
              <span>اطلب الخلطة عبر الواتساب</span>
            </button>
          </div>
        </div>
      </div>

      {checkoutOrderObj && (
        <OrderPreviewModal
          isOpen={isPreviewOpen}
          message={builtMessage}
          order={checkoutOrderObj}
          onClose={() => setIsPreviewOpen(false)}
          onSend={handleSendViaWhatsApp}
        />
      )}
    </section>
  );
}

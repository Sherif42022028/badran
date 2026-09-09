"use client";

import { useState, useMemo } from "react";
import {
  Sparkles,
  Coffee,
  CheckCircle,
  Plus,
  Minus,
  Scale,
  Search,
  ShoppingBag,
  Check,
  RotateCcw,
  MessageSquare,
  Trash2,
  Flame,
  Info,
} from "lucide-react";
import {
  BLEND_COFFEE_BEANS,
  BLEND_ORIGIN_CATEGORIES,
  BlendBeanOrigin,
} from "@/data/blendOrigins";
import {
  calculateCustomBlend,
  GRIND_OPTIONS,
  ADDITIONS_LIST,
  SelectedBlendComponent,
} from "@/lib/blendPricing";
import { trackContactClick } from "@/lib/analytics";
import { generateOrderId } from "@/lib/orderId";
import { WHATSAPP_NUMBER } from "@/config/whatsapp";
import { buildWhatsAppLink } from "@/lib/whatsapp/buildWhatsAppLink";
import {
  generateBlendWhatsAppMessage,
  CustomBlendOrder,
} from "@/lib/whatsapp/generateWhatsAppMessage";
import OrderPreviewModal from "@/components/OrderPreviewModal";
import { CheckoutOrder } from "@/types/Order";
import { Product } from "@/types/products";

interface BlendBuilderProps {
  onAddToCart?: (
    item: Product,
    selectedPrice: { unit: string; label: string; price: number },
    quantity?: number
  ) => void;
  isEmbedded?: boolean;
}

export default function BlendBuilder({
  onAddToCart,
  isEmbedded = false,
}: BlendBuilderProps) {
  // Selected coffee beans: mapping bean.id -> grams
  // Defaults to Santos (150g) + Harari (100g) for an instant delicious recipe
  const [selectedGrams, setSelectedGrams] = useState<Record<string, number>>({
    "br-san": 150,
    "hab-har": 100,
  });

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Customization options
  const [grind, setGrind] = useState<string>("تركي ناعم كلاسيكي (مع الوش)");
  const [additionGrams, setAdditionGrams] = useState<Record<string, number>>({});
  const [blendName, setBlendName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // WhatsApp Checkout Modal states
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [builtMessage, setBuiltMessage] = useState("");
  const [checkoutOrderObj, setCheckoutOrderObj] = useState<CheckoutOrder | null>(
    null
  );
  const [addedAlert, setAddedAlert] = useState(false);

  // Add bean with default 100g or toggle
  const handleToggleBean = (bean: BlendBeanOrigin) => {
    setSelectedGrams((prev) => {
      const next = { ...prev };
      if (next[bean.id] !== undefined && next[bean.id] > 0) {
        delete next[bean.id];
      } else {
        next[bean.id] = 100; // default 100g
      }
      return next;
    });
  };

  // Remove a bean from the recipe
  const handleRemoveBean = (beanId: string) => {
    setSelectedGrams((prev) => {
      const next = { ...prev };
      delete next[beanId];
      return next;
    });
  };

  // Change grams for a bean directly
  const handleGramsChange = (beanId: string, value: number) => {
    if (isNaN(value) || value <= 0) {
      setSelectedGrams((prev) => {
        const next = { ...prev };
        delete next[beanId];
        return next;
      });
      return;
    }
    const valid = Math.max(1, Math.min(3000, value));
    setSelectedGrams((prev) => ({
      ...prev,
      [beanId]: valid,
    }));
  };

  // Step grams (+/- delta)
  const handleStepGrams = (beanId: string, delta: number) => {
    setSelectedGrams((prev) => {
      const current = prev[beanId] || 0;
      if (current === 0 && delta > 0) {
        return {
          ...prev,
          [beanId]: delta >= 25 ? delta : 50,
        };
      }
      const nextVal = current + delta;
      if (nextVal <= 0) {
        const next = { ...prev };
        delete next[beanId];
        return next;
      }
      return {
        ...prev,
        [beanId]: Math.min(3000, nextVal),
      };
    });
  };

  // Toggle addition (starts at 1 gram)
  const toggleAddition = (addId: string) => {
    setAdditionGrams((prev) => {
      const next = { ...prev };
      if (next[addId] !== undefined && next[addId] > 0) {
        delete next[addId];
      } else {
        next[addId] = 1; // starts at 1 gram
      }
      return next;
    });
  };

  // Change addition grams (1 to 50g)
  const handleAdditionGramsChange = (addId: string, val: number) => {
    if (isNaN(val) || val <= 0) {
      setAdditionGrams((prev) => {
        const next = { ...prev };
        delete next[addId];
        return next;
      });
      return;
    }
    setAdditionGrams((prev) => ({
      ...prev,
      [addId]: Math.max(1, Math.min(50, val)),
    }));
  };

  // Step addition grams (+/- 1g)
  const handleStepAddition = (addId: string, delta: number) => {
    const current = additionGrams[addId] || 1;
    const nextVal = current + delta;
    if (nextVal <= 0) {
      setAdditionGrams((prev) => {
        const next = { ...prev };
        delete next[addId];
        return next;
      });
    } else {
      handleAdditionGramsChange(addId, nextVal);
    }
  };

  // Filter beans for catalog
  const filteredBeans = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return BLEND_COFFEE_BEANS.filter((bean) => {
      const matchCat =
        activeCategory === "all" || bean.category === activeCategory;
      const matchQuery =
        !q ||
        bean.name.toLowerCase().includes(q) ||
        bean.blendRole.toLowerCase().includes(q) ||
        bean.categoryLabel.toLowerCase().includes(q) ||
        bean.description.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [activeCategory, searchQuery]);

  // Selected components list
  const selectedComponentsList = useMemo(() => {
    return Object.entries(selectedGrams)
      .map(([beanId, grams]) => {
        const bean = BLEND_COFFEE_BEANS.find((b) => b.id === beanId);
        return bean && grams > 0 ? { bean, grams } : null;
      })
      .filter(Boolean) as SelectedBlendComponent[];
  }, [selectedGrams]);

  // Dynamic price calculation
  const blendResult = useMemo(() => {
    return calculateCustomBlend(
      selectedComponentsList,
      "سادة",
      additionGrams,
      0
    );
  }, [selectedComponentsList, additionGrams]);

  // Validation: at least one coffee bean with grams >= 1
  const isValidBlend =
    selectedComponentsList.length > 0 && blendResult.totalGrams >= 1;

  // Add to Cart
  const handleAddToCartClick = () => {
    if (!isValidBlend) return;

    const finalBlendName =
      blendName.trim() ||
      `توليفة على مزاجك (${selectedComponentsList
        .map((c) => c.bean.name.replace("بن ", ""))
        .join(" + ")})`;

    const customBlendProduct: Product = {
      id: `custom-blend-${Date.now()}`,
      name: finalBlendName,
      category: "custom_blend",
      description: blendResult.summaryRecipe,
      badge: "توليفة على مزاجك",
      tier: 1,
      variantType: "none",
      basePrice: blendResult.totalPrice,
      unitLabel: `${blendResult.totalGrams} جم`,
    };

    const activeAdditions = Object.entries(additionGrams)
      .filter(([_, g]) => g > 0)
      .map(([id, g]) => `${id} (${g} جم)`);

    const detailsLabel = `${blendResult.summaryRecipe} | طحن: ${grind}${
      activeAdditions.length > 0 ? ` | إضافات: ${activeAdditions.join("، ")}` : ""
    }`;

    if (onAddToCart) {
      onAddToCart(
        customBlendProduct,
        {
          unit: `${blendResult.totalGrams} جم`,
          label: detailsLabel,
          price: blendResult.totalPrice,
        },
        1
      );

      setAddedAlert(true);
      setTimeout(() => setAddedAlert(false), 4000);
    }
  };

  // Open Direct WhatsApp Preview Modal
  const handleOpenPreview = () => {
    if (!isValidBlend) return;
    trackContactClick("whatsapp");

    const orderId = generateOrderId("BD");
    const finalBlendName = blendName.trim() || "توليفتك على مزاجك الخاصة";

    const activeAdditions = Object.entries(additionGrams)
      .filter(([_, g]) => g > 0)
      .map(([id, g]) => `${id} (${g} جم)`);

    const blendOrder: CustomBlendOrder = {
      orderId,
      customerName,
      customerPhone,
      blendName: finalBlendName,
      grind,
      recipeBreakdown: blendResult.summaryRecipe,
      additions: activeAdditions,
      weight: `${blendResult.totalGrams} جم (سعر الكيلو التقديري: ${blendResult.weightedKiloPrice} ج.م)`,
      totalPrice: blendResult.totalPrice,
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
          name: finalBlendName,
          quantity: 1,
          options: {
            size: `${blendResult.totalGrams} جم`,
            extras: [
              `الخلطة: ${blendResult.summaryRecipe}`,
              `الطحن: ${grind}`,
              ...activeAdditions,
            ],
          },
        },
      ],
      subtotal: blendResult.totalPrice,
      total: blendResult.totalPrice,
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
            blendName: blendName.trim() || "توليفتك على مزاجك",
            recipe: blendResult.summaryRecipe,
            grind,
            additions: Object.entries(additionGrams)
              .filter(([_, g]) => g > 0)
              .map(([id, g]) => `${id} (${g} جم)`),
            weight: `${blendResult.totalGrams} جم`,
            totalPrice: blendResult.totalPrice,
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

  const resetBlend = () => {
    setSelectedGrams({});
    setBlendName("");
    setNotes("");
    setAdditionGrams({});
  };

  return (
    <section
      id="blend-builder"
      className={`max-w-7xl mx-auto ${
        isEmbedded ? "py-2" : "py-6 md:py-12 px-3 sm:px-5"
      }`}
    >
      <div className="framed-section p-4 sm:p-7 md:p-9 bg-white">
        {/* ================= 1. HERITAGE SECTION HEADER ================= */}
        <div className="text-center mb-8 border-b border-dashed border-[#C5A059]/40 pb-6">
          <span className="solid-badge text-xs md:text-sm mb-3 py-1 px-4 inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>توليفتك على مزاجك</span>
          </span>

          <h2 className="font-amiri text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A110B] leading-tight mt-1">
            صمم توليفة قهوتك الخاصة بالجرام
          </h2>

          <p className="font-alexandria text-xs sm:text-sm text-[#1A110A]/75 max-w-2xl mx-auto mt-2.5 font-light leading-relaxed">
            اختر حبوب البن المفضلة لخلطتك، حدد وزن كل نوع بالجرام بدقة متناهية، واضبط درجة الطحن والإضافات السرية لتستمتع بفنجان على مزاجك.
          </p>

          {/* Quick Counter Ticker */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-alexandria font-semibold text-[#1A110B]">
            <div className="inline-flex items-center gap-1.5 bg-[#FAF8F5] border border-[#C5A059]/40 py-1 px-3 rounded-full">
              <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>وزن التوليفة الحالي: </span>
              <strong className="font-price font-bold text-[#C5A059]">
                {blendResult.totalGrams} جم
              </strong>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-[#FAF8F5] border border-[#C5A059]/40 py-1 px-3 rounded-full">
              <Coffee className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>الأصناف المختارة: </span>
              <strong className="font-price font-bold text-[#1A110B]">
                {selectedComponentsList.length} أنواع
              </strong>
            </div>

            {selectedComponentsList.length > 0 && (
              <button
                type="button"
                onClick={resetBlend}
                className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100/70 border border-red-200 py-1 px-2.5 rounded-full transition-all cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>تفريغ التوليفة</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT / MAIN BUILDER (7-8 COLS) ================= */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8 font-alexandria">

            {/* ----------------- STEP 1: SELECT BEANS & ADJUST WEIGHT ----------------- */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#1A110B] text-[#C5A059] font-price font-bold text-sm flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <h3 className="font-amiri text-xl font-bold text-[#1A110A]">
                      اختر حبوب البن وحدد وزن كل نوع بالجرام:
                    </h3>
                    <span className="text-[11px] text-[#1A110A]/60">
                      اضغط &quot;+ أضف للخلطة&quot; ثم عدّل الجرامات بسهولة
                    </span>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#1A110A]/10">
                  {BLEND_ORIGIN_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeCategory === cat.id
                          ? "bg-[#1A110B] text-[#FAF8F5] shadow-xs"
                          : "text-[#1A110A]/70 hover:bg-white"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bean Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredBeans.map((bean) => {
                  const isSelected =
                    selectedGrams[bean.id] !== undefined &&
                    selectedGrams[bean.id] > 0;
                  const currentGrams = selectedGrams[bean.id] || 0;
                  const itemSubtotal = Math.round(
                    (bean.kiloPrice * currentGrams) / 1000
                  );
                  const percentage =
                    blendResult.totalGrams > 0 && isSelected
                      ? Math.round((currentGrams / blendResult.totalGrams) * 100)
                      : 0;

                  return (
                    <div
                      key={bean.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#FAF8F5] border-[#C5A059] ring-1 ring-[#C5A059] shadow-xs"
                          : "bg-white border-[#1A110A]/15 hover:border-[#C5A059]/60"
                      }`}
                    >
                      {/* Top Details */}
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="heritage-ribbon text-[10px] font-alexandria">
                            🎯 {bean.blendRole}
                          </span>

                          <span className="text-xs font-price font-bold text-[#C5A059]">
                            {bean.kiloPrice} ج.م / ك
                          </span>
                        </div>

                        <h4 className="font-amiri text-lg font-bold text-[#1A110A] mt-2 leading-snug">
                          {bean.name}
                        </h4>

                        <p className="text-xs text-[#1A110A]/70 font-light mt-1 line-clamp-2">
                          {bean.description}
                        </p>

                        {/* Flavor Notes */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {bean.flavorNotes.map((note, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] text-[#1A110A]/60 bg-white border border-[#1A110A]/10 px-1.5 py-0.5 rounded"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Controls */}
                      <div className="mt-3.5 pt-3 border-t border-dashed border-[#1A110A]/15">
                        {!isSelected ? (
                          /* Not in blend yet */
                          <button
                            type="button"
                            onClick={() => handleToggleBean(bean)}
                            className="w-full py-2 px-3 rounded-lg text-xs font-bold font-alexandria flex items-center justify-center gap-1.5 bg-[#FAF8F5] hover:bg-[#1A110B] hover:text-[#FAF8F5] text-[#1A110A] border border-[#1A110A]/15 transition-all cursor-pointer active:scale-98"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>+ أضف للخلطة (100 جم)</span>
                          </button>
                        ) : (
                          /* In blend - Active Grams Stepper */
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[11px] font-bold text-[#1A110B] flex items-center gap-1">
                                <Check className="w-3 h-3 text-[#C5A059]" />
                                <span>مضاف بالخلطة ({percentage}%)</span>
                              </span>

                              <span className="font-price font-bold text-xs text-[#C5A059] bg-white border border-[#C5A059]/40 px-2 py-0.5 rounded">
                                {currentGrams} جم = {itemSubtotal} ج.م
                              </span>
                            </div>

                            {/* Stepper Buttons & Manual Input */}
                            <div className="flex items-center gap-1 bg-white border border-[#1A110A]/15 rounded-lg p-1">
                              <button
                                type="button"
                                onClick={() => handleStepGrams(bean.id, -25)}
                                className="w-7 h-7 rounded bg-[#FAF8F5] hover:bg-[#1A110A] hover:text-white text-[#1A110A] flex items-center justify-center cursor-pointer transition-colors active:scale-95"
                                title="تقليل 25 جرام"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              <div className="flex-1 flex items-center justify-center">
                                <input
                                  type="number"
                                  min="1"
                                  max="3000"
                                  step="5"
                                  value={currentGrams}
                                  onChange={(e) =>
                                    handleGramsChange(
                                      bean.id,
                                      parseInt(e.target.value, 10)
                                    )
                                  }
                                  className="w-14 text-center font-price font-bold text-sm text-[#1A110A] focus:outline-none"
                                />
                                <span className="text-xs text-[#C5A059] font-bold">
                                  جم
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleStepGrams(bean.id, 25)}
                                className="w-7 h-7 rounded bg-[#FAF8F5] hover:bg-[#1A110A] hover:text-white text-[#1A110A] flex items-center justify-center cursor-pointer transition-colors active:scale-95"
                                title="زيادة 25 جرام"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemoveBean(bean.id)}
                                className="w-7 h-7 rounded text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center justify-center cursor-pointer transition-colors mr-1"
                                title="إزالة من التوليفة"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Quick Presets */}
                            <div className="flex items-center justify-between gap-1 pt-0.5">
                              <span className="text-[10px] text-[#1A110A]/50">
                                أوزان سريعة:
                              </span>
                              <div className="flex items-center gap-1">
                                {[50, 100, 150, 250, 500].map((preset) => (
                                  <button
                                    key={preset}
                                    type="button"
                                    onClick={() =>
                                      handleGramsChange(bean.id, preset)
                                    }
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-price font-bold transition-all cursor-pointer border ${
                                      currentGrams === preset
                                        ? "bg-[#1A110B] text-[#C5A059] border-[#C5A059]"
                                        : "bg-white text-[#1A110A]/70 border-[#1A110A]/10 hover:border-[#C5A059]"
                                    }`}
                                  >
                                    {preset}جم
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ----------------- STEP 2: GRIND DEGREE ----------------- */}
            <div className="pt-6 border-t border-dashed border-[#C5A059]/40 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#1A110B] text-[#C5A059] font-price font-bold text-sm flex items-center justify-center">
                  2
                </span>
                <div>
                  <h3 className="font-amiri text-xl font-bold text-[#1A110A]">
                    درجة الطحن المفضلة:
                  </h3>
                  <span className="text-[11px] text-[#1A110A]/60">
                    نطحنها طازجة فور طلبك بالنسب المطلوبة
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {GRIND_OPTIONS.map((g) => {
                  const isSelected = grind === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrind(g)}
                      className={`p-3 rounded-xl text-xs font-bold text-center transition-all cursor-pointer border flex items-center justify-center gap-2 ${
                        isSelected
                          ? "bg-[#1A110B] text-[#FAF8F5] border-[#C5A059] ring-1 ring-[#C5A059]"
                          : "bg-[#FAF8F5] text-[#1A110A] border-[#1A110A]/15 hover:border-[#C5A059]/60 hover:bg-white"
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      )}
                      <span>{g}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ----------------- STEP 3: SECRET ADDITIONS (1-GRAM PRECISION) ----------------- */}
            <div className="pt-6 border-t border-dashed border-[#C5A059]/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#1A110B] text-[#C5A059] font-price font-bold text-sm flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <h3 className="font-amiri text-xl font-bold text-[#1A110A]">
                      إضافات سرية خاصة (اختياري بالجرام الواحد):
                    </h3>
                    <span className="text-[11px] text-[#1A110A]/60">
                      إضافات فاخرة توزن بدقة متناهية لكل جرام
                    </span>
                  </div>
                </div>

                {blendResult.additionsPrice > 0 && (
                  <span className="font-price font-bold text-xs text-[#C5A059] bg-[#1A110B] px-3 py-1 rounded-md">
                    +{blendResult.additionsPrice} ج.م
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ADDITIONS_LIST.map((add) => {
                  const isChecked =
                    additionGrams[add.id] !== undefined &&
                    additionGrams[add.id] > 0;
                  const grams = additionGrams[add.id] || 1;
                  const itemSubtotal = grams * add.pricePerGram;

                  return (
                    <div
                      key={add.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isChecked
                          ? "bg-[#FAF8F5] border-[#C5A059] ring-1 ring-[#C5A059]"
                          : "bg-white border-[#1A110A]/15 hover:border-[#C5A059]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => toggleAddition(add.id)}
                          className="flex items-center gap-2.5 cursor-pointer text-right flex-1"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="w-4 h-4 rounded accent-[#C5A059] cursor-pointer"
                          />
                          <div>
                            <span className="font-bold text-xs text-[#1A110A] block">
                              {add.label}
                            </span>
                            <span className="text-[10px] text-[#1A110A]/50 font-price">
                              {add.pricePerGram} ج.م / جم
                            </span>
                          </div>
                        </button>

                        {isChecked && (
                          <span className="font-price text-xs font-bold text-[#C5A059] bg-white border border-[#C5A059] px-2 py-0.5 rounded">
                            {grams} جم = {itemSubtotal} ج.م
                          </span>
                        )}
                      </div>

                      {/* Clean 1-Gram Stepper (Starts at 1g) */}
                      {isChecked && (
                        <div className="mt-3 pt-2 border-t border-dashed border-[#C5A059]/40 flex items-center justify-between gap-2 animate-fadeIn">
                          <span className="text-[11px] text-[#1A110A]/70">
                            الوزن المطلوب:
                          </span>

                          <div className="flex items-center gap-1.5 bg-white border border-[#C5A059] rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => handleStepAddition(add.id, -1)}
                              className="w-6 h-6 rounded bg-[#FAF8F5] hover:bg-[#1A110B] hover:text-white text-[#1A110A] flex items-center justify-center cursor-pointer text-xs"
                              title="تقليل 1 جرام"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            <input
                              type="number"
                              min="1"
                              max="50"
                              step="1"
                              value={grams}
                              onChange={(e) =>
                                handleAdditionGramsChange(
                                  add.id,
                                  parseInt(e.target.value, 10)
                                )
                              }
                              className="w-8 text-center font-price font-bold text-xs text-[#1A110A] focus:outline-none"
                            />
                            <span className="text-[10px] text-[#C5A059] font-bold pl-1">
                              جم
                            </span>

                            <button
                              type="button"
                              onClick={() => handleStepAddition(add.id, 1)}
                              className="w-6 h-6 rounded bg-[#FAF8F5] hover:bg-[#1A110B] hover:text-white text-[#1A110A] flex items-center justify-center cursor-pointer text-xs"
                              title="زيادة 1 جرام"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ----------------- STEP 4: BLEND NAME ----------------- */}
            <div className="pt-6 border-t border-dashed border-[#C5A059]/40 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#1A110B] text-[#C5A059] font-price font-bold text-sm flex items-center justify-center">
                  4
                </span>
                <div>
                  <h3 className="font-amiri text-xl font-bold text-[#1A110A]">
                    سمّي توليفك الخاصة (اختياري):
                  </h3>
                  <span className="text-[11px] text-[#1A110A]/60">
                    اكتب اسماً مميزاً سنطبعه لك على كيس قهوتك الخاصة
                  </span>
                </div>
              </div>

              <input
                type="text"
                placeholder="مثال: خلطة الصباح، قهوة المزاج العالي، توليفة ديوانية بدران..."
                value={blendName}
                onChange={(e) => setBlendName(e.target.value)}
                className="w-full py-2.5 px-4 bg-[#FAF8F5] border border-[#1A110A]/15 rounded-xl text-xs sm:text-sm text-[#1A110A] focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* ================= RIGHT: STICKY BLEND PASSPORT CARD (4-5 COLS) ================= */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-4 font-alexandria">
            <div className="bg-[#FAF8F5] border-2 border-[#C5A059] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-dashed border-[#C5A059]/40 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#1A110B] text-[#C5A059] flex items-center justify-center">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-amiri text-lg font-bold text-[#1A110B]">
                      بطاقة وصفة قهوتك
                    </h4>
                    <span className="text-[11px] text-[#1A110A]/60">
                      {selectedComponentsList.length} أصناف بن مختارة
                    </span>
                  </div>
                </div>

                {isValidBlend && (
                  <span className="font-price font-bold text-sm bg-[#C5A059] text-white px-3 py-1 rounded-lg">
                    {blendResult.totalGrams} جم
                  </span>
                )}
              </div>

              {/* Recipe Ratio Preview Bar */}
              {blendResult.totalGrams > 0 ? (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#1A110A]/80 block">
                    توزيع نسب البن في الفنجان:
                  </span>
                  <div className="h-3 w-full rounded-full overflow-hidden flex bg-gray-200 shadow-inner">
                    {blendResult.componentsRatio.map((comp) => (
                      <div
                        key={comp.bean.id}
                        style={{
                          width: `${comp.percentage}%`,
                          backgroundColor: comp.bean.color,
                        }}
                        title={`${comp.bean.name}: ${comp.grams}جم (${comp.percentage}%)`}
                        className="h-full transition-all duration-300"
                      />
                    ))}
                  </div>

                  {/* Ratio Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {blendResult.componentsRatio.map((comp) => (
                      <span
                        key={comp.bean.id}
                        className="inline-flex items-center gap-1 text-[10px] bg-white border border-[#1A110A]/10 px-2 py-0.5 rounded font-price font-bold"
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: comp.bean.color }}
                        />
                        <span className="font-alexandria truncate max-w-[90px]">
                          {comp.bean.name.replace("بن ", "")}
                        </span>
                        <strong className="text-[#C5A059]">
                          {comp.percentage}%
                        </strong>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-amber-800 text-xs">
                  اختر أصناف البن من القائمة للبدء
                </div>
              )}

              {/* Breakdown List */}
              {blendResult.componentsRatio.length > 0 && (
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1 text-xs border-y border-dashed border-[#C5A059]/30 py-3">
                  {blendResult.componentsRatio.map((comp) => (
                    <div
                      key={comp.bean.id}
                      className="flex items-center justify-between text-[#1A110A]"
                    >
                      <span className="truncate max-w-[170px] text-[11px] font-medium">
                        {comp.bean.name}
                      </span>
                      <div className="flex items-center gap-2 font-price text-xs">
                        <span className="text-[#1A110A]/60">
                          {comp.grams} جم
                        </span>
                        <span className="font-bold text-[#1A110A]">
                          {comp.subtotal} ج.م
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Grind Summary */}
                  <div className="flex items-center justify-between text-xs text-[#1A110A]/75 pt-1 border-t border-dashed border-[#1A110A]/10">
                    <span>درجة الطحن:</span>
                    <span className="font-bold text-[#1A110A] truncate max-w-[150px]">
                      {grind}
                    </span>
                  </div>

                  {/* Additions Summary */}
                  {blendResult.additionsPrice > 0 && (
                    <div className="space-y-1 pt-1 border-t border-dashed border-[#1A110A]/10">
                      {Object.entries(additionGrams)
                        .filter(([_, g]) => g > 0)
                        .map(([addId, g]) => {
                          const addObj = ADDITIONS_LIST.find(
                            (a) => a.id === addId
                          );
                          const cost = (addObj?.pricePerGram || 0) * g;
                          return (
                            <div
                              key={addId}
                              className="flex items-center justify-between text-xs text-[#C5A059] font-bold"
                            >
                              <span>
                                {addId} ({g} جم)
                              </span>
                              <span className="font-price">+{cost} ج.م</span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* Total Calculation */}
              <div className="space-y-2 pt-1">
                <div className="flex items-baseline justify-between text-xs text-[#1A110A]/70">
                  <span>سعر الكيلو التقديري للتوليفة:</span>
                  <strong className="font-price text-sm text-[#1A110A]">
                    {blendResult.weightedKiloPrice} ج.م / ك
                  </strong>
                </div>

                <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-[#C5A059] shadow-2xs">
                  <div>
                    <span className="text-xs font-bold text-[#1A110A] block">
                      الإجمالي النهائي:
                    </span>
                    <span className="text-[10px] text-[#1A110A]/60">
                      شامل الطحن والتعبئة
                    </span>
                  </div>
                  <div className="font-price font-bold text-2xl text-[#C5A059]">
                    {blendResult.totalPrice}{" "}
                    <span className="text-xs font-alexandria text-[#1A110A]">
                      ج.م
                    </span>
                  </div>
                </div>
              </div>

              {/* Added Alert */}
              {addedAlert && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs text-center font-bold flex items-center justify-center gap-1.5 animate-fadeIn">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>تمت إضافة التوليفة بنجاح إلى سلة المشتريات!</span>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  disabled={!isValidBlend}
                  onClick={handleAddToCartClick}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                    isValidBlend
                      ? "bg-[#1A110B] hover:bg-[#2A1D15] text-[#FAF8F5] border border-[#C5A059] active:scale-[0.98]"
                      : "bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed shadow-none"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                  <span>
                    {isValidBlend
                      ? `أضف التوليفة للسلة (${blendResult.totalPrice} ج.م)`
                      : "اختر نوع بن ووزنه للتفعيل"}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={!isValidBlend}
                  onClick={handleOpenPreview}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                    isValidBlend
                      ? "bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-600 shadow-2xs"
                      : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>طلب مباشر بالخلطة عبر الواتساب</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Order Preview Modal */}
      {isPreviewOpen && checkoutOrderObj && (
        <OrderPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          message={builtMessage}
          order={checkoutOrderObj}
          onSend={handleSendViaWhatsApp}
        />
      )}
    </section>
  );
}

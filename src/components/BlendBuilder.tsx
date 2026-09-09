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
  Sliders,
  Flame,
  Check,
  RotateCcw,
  MessageSquare,
  Info,
} from "lucide-react";
import {
  BLEND_COFFEE_BEANS,
  BLEND_ORIGIN_CATEGORIES,
  BlendBeanOrigin,
} from "@/data/blendOrigins";
import {
  calculateCustomBlend,
  CARDAMOM_OPTIONS,
  ROAST_OPTIONS,
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
  // Selected components: mapping bean.id -> grams
  const [selectedGrams, setSelectedGrams] = useState<Record<string, number>>({
    "hab-har": 150,
    "br-san": 100,
  });

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Customization options
  const [blendName, setBlendName] = useState<string>("");
  const [roast, setRoast] = useState<string>("وسط");
  const [grind, setGrind] = useState<string>("تركي ناعم كلاسيكي (مع الوش)");
  const [cardamom, setCardamom] = useState<string>("سادة");
  const [cardamomGrams, setCardamomGrams] = useState<number>(0);
  const [additionGrams, setAdditionGrams] = useState<Record<string, number>>({});
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

  // Toggle bean selection (0g <-> 100g)
  const handleToggleBean = (bean: BlendBeanOrigin) => {
    setSelectedGrams((prev) => {
      const next = { ...prev };
      if (next[bean.id] !== undefined && next[bean.id] > 0) {
        delete next[bean.id];
      } else {
        next[bean.id] = 100; // default 100 grams
      }
      return next;
    });
  };

  // Change grams for a bean directly or via slider
  const handleGramsChange = (beanId: string, value: number) => {
    if (isNaN(value) || value <= 0) {
      setSelectedGrams((prev) => {
        const next = { ...prev };
        delete next[beanId];
        return next;
      });
      return;
    }
    const valid = Math.max(1, Math.min(2000, value));
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
        [beanId]: Math.min(2000, nextVal),
      };
    });
  };

  // Cardamom handler with grams
  const handleCardamomPreset = (cId: string, grams: number) => {
    setCardamom(cId);
    setCardamomGrams(grams);
  };

  const handleCardamomGramsChange = (val: number) => {
    const valid = Math.max(0, Math.min(80, isNaN(val) ? 0 : val));
    setCardamomGrams(valid);
    if (valid === 0) setCardamom("سادة");
    else if (valid <= 12) setCardamom("محوج خفيف");
    else if (valid <= 25) setCardamom("محوج وسط");
    else setCardamom("محوج رويال");
  };

  // Addition toggle and grams
  const toggleAddition = (addId: string, defaultGrams: number = 5) => {
    setAdditionGrams((prev) => {
      const next = { ...prev };
      if (next[addId] !== undefined && next[addId] > 0) {
        delete next[addId];
      } else {
        next[addId] = defaultGrams;
      }
      return next;
    });
  };

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
      [addId]: Math.min(50, val),
    }));
  };

  const handleStepAddition = (addId: string, delta: number) => {
    const current = additionGrams[addId] || 0;
    handleAdditionGramsChange(addId, current + delta);
  };

  // Filter beans
  const filteredBeans = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return BLEND_COFFEE_BEANS.filter((b) => {
      if (activeCategory !== "all" && b.category !== activeCategory) {
        return false;
      }
      if (q) {
        const matchName = b.name.toLowerCase().includes(q);
        const matchDesc = b.description.toLowerCase().includes(q);
        const matchFlavor = b.flavorNotes.some((fn) =>
          fn.toLowerCase().includes(q)
        );
        return matchName || matchDesc || matchFlavor;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  // Selected components array for calculations
  const selectedComponentsList: SelectedBlendComponent[] = useMemo(() => {
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
      cardamom,
      additionGrams,
      cardamomGrams > 0 ? cardamomGrams : undefined
    );
  }, [selectedComponentsList, cardamom, additionGrams, cardamomGrams]);

  // Validation
  const isValidBlend =
    selectedComponentsList.length > 0 && blendResult.totalGrams >= 1;

  // Add to Cart
  const handleAddToCartClick = () => {
    if (!isValidBlend) return;

    const finalBlendName =
      blendName.trim() ||
      `توليفة خاصة (${selectedComponentsList.map((c) => c.bean.name.split(" ")[1] || c.bean.name).join(" + ")})`;

    const customBlendProduct: Product = {
      id: `custom-blend-${Date.now()}`,
      name: finalBlendName,
      category: "custom_blend",
      description: blendResult.summaryRecipe,
      badge: "توليفة على زوقك",
      tier: 1,
      variantType: "none",
      basePrice: blendResult.totalPrice,
      unitLabel: `${blendResult.totalGrams} جم`,
    };

    const activeAdditions = Object.entries(additionGrams)
      .filter(([_, g]) => g > 0)
      .map(([id, g]) => `${id} (${g}جم)`);

    const cardamomDetails =
      cardamomGrams > 0
        ? `حبهان: ${cardamom} (${cardamomGrams} جم)`
        : "سادة (بدون حبهان)";

    const detailsLabel = `${blendResult.summaryRecipe} | تحميص: ${roast} | طحن: ${grind} | ${cardamomDetails}${
      activeAdditions.length > 0 ? ` + ${activeAdditions.join("، ")}` : ""
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
    const finalBlendName = blendName.trim() || "توليفتك على زوقك الخاصة";

    const activeAdditions = Object.entries(additionGrams)
      .filter(([_, g]) => g > 0)
      .map(([id, g]) => `${id} (${g}جم)`);

    const cardamomDetails =
      cardamomGrams > 0
        ? `${cardamom} (${cardamomGrams} جم)`
        : "سادة بدون حبهان";

    const blendOrder: CustomBlendOrder = {
      orderId,
      customerName,
      customerPhone,
      blendName: finalBlendName,
      roast,
      cardamom: cardamomDetails,
      recipeBreakdown: blendResult.summaryRecipe,
      grind,
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
            sugar: cardamomDetails,
            extras: [
              `الخلطة: ${blendResult.summaryRecipe}`,
              `التحميص: ${roast}`,
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
            blendName: blendName.trim() || "توليفتك الخاصة",
            recipe: blendResult.summaryRecipe,
            roast,
            cardamom:
              cardamomGrams > 0
                ? `${cardamom} (${cardamomGrams} جم)`
                : "سادة بدون حبهان",
            grind,
            additions: Object.entries(additionGrams)
              .filter(([_, g]) => g > 0)
              .map(([id, g]) => `${id} (${g}جم)`),
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
    setCardamom("سادة");
    setCardamomGrams(0);
    setAdditionGrams({});
  };

  return (
    <section
      id="blend-builder"
      className={`max-w-7xl mx-auto ${
        isEmbedded ? "py-2" : "py-6 md:py-12 px-3 sm:px-5"
      }`}
    >
      <div className="framed-section p-4 sm:p-6 md:p-8 bg-white shadow-xs">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="solid-badge text-xs md:text-sm mb-2 py-1 px-4 inline-flex items-center gap-1.5 font-alexandria">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>صمم خلطتك بالجرام على مزاجك</span>
          </span>
          <h2 className="font-amiri text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A110B] mt-2">
            توليفتك على زوقك — ركّب خلطة بن خاصة بك بالجرام
          </h2>
          <p className="font-alexandria text-xs sm:text-sm text-[#1A110A]/75 max-w-2xl mx-auto mt-2 font-light leading-relaxed">
            اختار أي عدد من أنواع البن المتاحة، واستخدم عداد الجرامات لتحديد وزن كل نوع بدقة.
            سنحسب لك السعر تلقائياً بالمتوسط المرجّح ونطحنها لك طازجة بالنسب المطلوبة.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= LEFT / MAIN: BEAN SELECTOR & OPTIONS (8 COLS) ================= */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 font-alexandria">
            {/* Step 1: Category Filter & Search Bar */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1A110B] text-[#C5A059] font-price font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <label className="font-amiri text-lg font-bold text-[#1A110A]">
                    اختار أنواع البن وحدد وزن كل نوع بالجرام (عداد مخصص لكل صنف):
                  </label>
                </div>

                {/* Reset button */}
                {selectedComponentsList.length > 0 && (
                  <button
                    type="button"
                    onClick={resetBlend}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>تفريغ التوليفة</span>
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                {BLEND_ORIGIN_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      activeCategory === cat.id
                        ? "bg-[#1A110B] text-[#FAF8F5] border-[#C5A059] shadow-xs ring-1 ring-[#C5A059]"
                        : "bg-[#FAF8F5] text-[#1A110A] border-[#1A110A]/15 hover:bg-[#1A110A]/5"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#1A110A]/40 absolute top-3 right-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="ابحث عن نوع بن معين (مثال: هراري، سيرادو، بلانتيشن، يمني...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pr-9 pl-3 bg-[#FAF8F5] border border-[#1A110A]/15 rounded-xl text-xs text-[#1A110A] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Beans Cards Grid with Dedicated Grams Slider Counter on EVERY bean */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[520px] overflow-y-auto p-1 pr-1.5 scrollbar-thin">
              {filteredBeans.map((bean) => {
                const isSelected =
                  selectedGrams[bean.id] !== undefined &&
                  selectedGrams[bean.id] > 0;
                const grams = selectedGrams[bean.id] || 0;
                const percentage =
                  blendResult.totalGrams > 0 && isSelected
                    ? Math.round((grams / blendResult.totalGrams) * 100)
                    : 0;
                const subtotal = Math.round((bean.kiloPrice * grams) / 1000);

                return (
                  <div
                    key={bean.id}
                    className={`p-3.5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#FAF8F5] border-[#C5A059] ring-1 ring-[#C5A059] shadow-xs"
                        : "bg-white border-[#1A110A]/15 hover:border-[#C5A059]/60"
                    }`}
                  >
                    {/* Header Row */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleBean(bean)}
                            id={`bean-${bean.id}`}
                            className="mt-1 w-4 h-4 rounded accent-[#C5A059] cursor-pointer"
                          />
                          <div>
                            <label
                              htmlFor={`bean-${bean.id}`}
                              className="font-amiri text-base font-bold text-[#1A110A] cursor-pointer leading-tight block"
                            >
                              {bean.name}
                            </label>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-price font-bold text-[#C5A059] text-xs">
                                {bean.kiloPrice} ج.م / ك
                              </span>
                              {isSelected && (
                                <span className="font-price text-[11px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  ({grams} جم = {subtotal} ج.م)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="font-price font-bold text-[11px] bg-[#1A110B] text-[#C5A059] px-2 py-0.5 rounded-full shrink-0 shadow-2xs">
                            {percentage}%
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#1A110A]/45 font-alexandria bg-gray-100 px-1.5 py-0.5 rounded">
                            0 جم
                          </span>
                        )}
                      </div>

                      {/* Bean Description */}
                      <p className="font-alexandria text-[11px] text-[#1A110A]/70 font-light mt-1.5 line-clamp-1 leading-relaxed">
                        {bean.description}
                      </p>

                      {/* Flavor tags */}
                      <div className="flex items-center gap-1 mt-1 text-[#1A110A]/55">
                        {bean.flavorNotes.slice(0, 3).map((fn) => (
                          <span
                            key={fn}
                            className="bg-white px-1.5 py-0.2 rounded border border-[#1A110A]/10 text-[9px] font-alexandria"
                          >
                            {fn}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Dedicated Grams Slider Counter (عداد الجرامات التفاعلي لكل صنف) */}
                    <div className="mt-3 pt-2.5 border-t border-dashed border-[#1A110A]/15 space-y-2">
                      <div className="flex items-center gap-1.5">
                        {/* Minus Button */}
                        <button
                          type="button"
                          onClick={() => handleStepGrams(bean.id, -25)}
                          className="w-7 h-7 rounded-lg bg-white border border-[#1A110A]/20 hover:bg-[#1A110A]/5 text-[#1A110A] flex items-center justify-center cursor-pointer shadow-2xs text-xs shrink-0 transition-all active:scale-95"
                          title="تقليل 25 جرام"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        {/* Interactive Range Slider */}
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          step="5"
                          value={grams}
                          onChange={(e) =>
                            handleGramsChange(bean.id, Number(e.target.value))
                          }
                          className="flex-1 accent-[#C5A059] h-2 bg-gray-200 rounded-lg cursor-pointer"
                        />

                        {/* Plus Button */}
                        <button
                          type="button"
                          onClick={() => handleStepGrams(bean.id, 25)}
                          className="w-7 h-7 rounded-lg bg-white border border-[#1A110A]/20 hover:bg-[#1A110A]/5 text-[#1A110A] flex items-center justify-center cursor-pointer shadow-2xs text-xs shrink-0 transition-all active:scale-95"
                          title="زيادة 25 جرام"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>

                        {/* Direct Number Input Box */}
                        <div
                          className={`flex items-center gap-1 bg-white border rounded-xl px-2 py-0.5 shrink-0 shadow-2xs ${
                            isSelected
                              ? "border-[#C5A059] ring-1 ring-[#C5A059]"
                              : "border-[#1A110A]/20"
                          }`}
                        >
                          <input
                            type="number"
                            min="0"
                            max="5000"
                            step="5"
                            value={grams === 0 ? "" : grams}
                            placeholder="0"
                            onChange={(e) =>
                              handleGramsChange(
                                bean.id,
                                parseInt(e.target.value, 10)
                              )
                            }
                            className="w-12 font-price font-bold text-center text-xs text-[#1A110A] focus:outline-none"
                          />
                          <span className="text-[10px] text-[#C5A059] font-bold">
                            جم
                          </span>
                        </div>
                      </div>

                      {/* Quick Weight Presets Chips */}
                      <div className="flex items-center justify-between gap-1 pt-0.5">
                        <span className="text-[10px] text-[#1A110A]/60 font-alexandria shrink-0">
                          أوزان سريعة:
                        </span>
                        <div className="flex items-center gap-1 overflow-x-auto">
                          {[25, 50, 100, 150, 250, 500].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => handleGramsChange(bean.id, preset)}
                              className={`px-1.5 py-0.5 rounded-md text-[10px] font-price font-bold transition-all cursor-pointer border ${
                                grams === preset
                                  ? "bg-[#1A110B] text-[#C5A059] border-[#C5A059] shadow-xs"
                                  : "bg-white text-[#1A110A] border-[#1A110A]/15 hover:border-[#C5A059] hover:bg-[#FAF8F5]"
                              }`}
                            >
                              {preset}جم
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step 2: Roast & Grind Customization */}
            <div className="pt-4 border-t border-dashed border-[#1A110A]/15 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Roast Level */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Flame className="w-4 h-4 text-[#C5A059]" />
                    <label className="font-amiri text-base font-bold text-[#1A110A]">
                      2. درجة التحميص:
                    </label>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {ROAST_OPTIONS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRoast(r)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition-all cursor-pointer border ${
                          roast === r
                            ? "bg-[#1A110B] text-[#FAF8F5] border-[#C5A059] shadow-xs ring-1 ring-[#C5A059]"
                            : "bg-white text-[#1A110A] border-[#1A110A]/15 hover:bg-[#1A110A]/5"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cardamom with Dedicated Grams Counter & Presets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      <label className="font-amiri text-base font-bold text-[#1A110A]">
                        3. مستوى التحويج والحبهان:
                      </label>
                    </div>
                    {cardamomGrams > 0 && (
                      <span className="font-price font-bold text-xs text-[#C5A059]">
                        +{blendResult.cardamomPrice} ج.م
                      </span>
                    )}
                  </div>

                  {/* Cardamom Presets */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {CARDAMOM_OPTIONS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleCardamomPreset(c.id, c.grams)}
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer border ${
                          cardamom === c.id
                            ? "bg-[#1A110B] text-[#FAF8F5] border-[#C5A059] shadow-xs ring-1 ring-[#C5A059]"
                            : "bg-white text-[#1A110A] border-[#1A110A]/15 hover:bg-[#1A110A]/5"
                        }`}
                      >
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Cardamom Grams Slider Counter */}
                  <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#1A110A]/80">
                      <span>عداد جرامات الحبهان:</span>
                      <span className="font-price text-[#C5A059]">
                        {cardamomGrams} جم حبهان
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleCardamomGramsChange(cardamomGrams - 5)
                        }
                        className="w-6 h-6 rounded-lg bg-white border border-[#1A110A]/20 hover:bg-[#1A110A]/5 text-[#1A110A] flex items-center justify-center cursor-pointer shadow-2xs text-xs shrink-0"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <input
                        type="range"
                        min="0"
                        max="60"
                        step="5"
                        value={cardamomGrams}
                        onChange={(e) =>
                          handleCardamomGramsChange(Number(e.target.value))
                        }
                        className="flex-1 accent-[#C5A059] h-2 bg-gray-200 rounded-lg cursor-pointer"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleCardamomGramsChange(cardamomGrams + 5)
                        }
                        className="w-6 h-6 rounded-lg bg-white border border-[#1A110A]/20 hover:bg-[#1A110A]/5 text-[#1A110A] flex items-center justify-center cursor-pointer shadow-2xs text-xs shrink-0"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      <div className="flex items-center gap-1 bg-white border border-[#C5A059] rounded-lg px-2 py-0.5 shrink-0 shadow-2xs">
                        <input
                          type="number"
                          min="0"
                          max="80"
                          step="5"
                          value={cardamomGrams}
                          onChange={(e) =>
                            handleCardamomGramsChange(
                              parseInt(e.target.value, 10)
                            )
                          }
                          className="w-10 font-price font-bold text-center text-xs text-[#1A110A] focus:outline-none"
                        />
                        <span className="text-[10px] text-[#C5A059] font-bold">
                          جم
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grind Degree */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Sliders className="w-4 h-4 text-[#C5A059]" />
                  <label className="font-amiri text-base font-bold text-[#1A110A]">
                    4. درجة الطحن المفضلة:
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {GRIND_OPTIONS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrind(g)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center transition-all cursor-pointer border truncate ${
                        grind === g
                          ? "bg-[#1A110B] text-[#FAF8F5] border-[#C5A059] shadow-xs ring-1 ring-[#C5A059]"
                          : "bg-white text-[#1A110A] border-[#1A110A]/15 hover:bg-[#1A110A]/5"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Additions with Grams Counter for Each */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-amiri text-base font-bold text-[#1A110A]">
                    5. إضافات سرية خاصة (مع عداد جرامات لكل إضافة):
                  </label>
                  {blendResult.additionsPrice > 0 && (
                    <span className="font-price font-bold text-xs text-[#C5A059]">
                      +{blendResult.additionsPrice} ج.م
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ADDITIONS_LIST.map((add) => {
                    const isChecked =
                      additionGrams[add.id] !== undefined &&
                      additionGrams[add.id] > 0;
                    const grams = additionGrams[add.id] || 0;
                    const additionSubtotal = grams * add.pricePerGram;

                    return (
                      <div
                        key={add.id}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                          isChecked
                            ? "bg-[#FAF8F5] border-[#C5A059] ring-1 ring-[#C5A059]/40"
                            : "bg-white border-[#1A110A]/15 hover:border-[#C5A059]/60"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              toggleAddition(add.id, add.defaultGrams)
                            }
                            className="flex items-center gap-1.5 cursor-pointer text-right"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="w-3.5 h-3.5 rounded accent-[#C5A059]"
                            />
                            <span>{add.label}</span>
                          </button>

                          {isChecked && (
                            <span className="font-price text-[11px] text-[#C5A059] font-bold">
                              +{additionSubtotal} ج.م
                            </span>
                          )}
                        </div>

                        {/* Addition Grams Counter */}
                        {isChecked && (
                          <div className="mt-2 pt-1.5 border-t border-dashed border-[#C5A059]/40 flex items-center justify-between gap-2 animate-fadeIn">
                            <span className="text-[10px] text-[#1A110A]/70 font-alexandria">
                              الوزن المضاف:
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleStepAddition(add.id, -1)}
                                className="w-5 h-5 rounded bg-white border border-[#1A110A]/20 hover:bg-[#1A110A]/5 text-[#1A110A] flex items-center justify-center cursor-pointer shadow-2xs text-[10px]"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>

                              <div className="flex items-center gap-0.5 bg-white border border-[#C5A059] rounded px-1.5 py-0.5 shadow-2xs">
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
                                  className="w-8 font-price font-bold text-center text-xs text-[#1A110A] focus:outline-none"
                                />
                                <span className="text-[9px] text-[#C5A059] font-bold">
                                  جم
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleStepAddition(add.id, 1)}
                                className="w-5 h-5 rounded bg-white border border-[#1A110A]/20 hover:bg-[#1A110A]/5 text-[#1A110A] flex items-center justify-center cursor-pointer shadow-2xs text-[10px]"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Blend Name (Optional) */}
              <div>
                <label className="font-amiri text-base font-bold text-[#1A110A] block mb-1">
                  6. سمّي توليفك الخاصة (اختياري):
                </label>
                <input
                  type="text"
                  placeholder="مثال: خلطة الصباح الملكية، قهوة ديوانية بدران..."
                  value={blendName}
                  onChange={(e) => setBlendName(e.target.value)}
                  className="w-full py-2.5 px-3.5 bg-[#FAF8F5] border border-[#1A110A]/15 rounded-xl text-xs text-[#1A110A] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          </div>

          {/* ================= RIGHT: LIVE RATIO BAR & SUMMARY STICKY BOX (4 COLS) ================= */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-4 font-alexandria">
            <div className="bg-[#FAF8F5] border-2 border-[#C5A059] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-dashed border-[#C5A059]/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1A110B] text-[#C5A059] flex items-center justify-center shadow-xs">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-amiri text-lg font-bold text-[#1A110B]">
                      ملخص التوليفة المباشر
                    </h4>
                    <span className="text-[10px] text-[#1A110A]/60">
                      {selectedComponentsList.length} أنواع بن مختارة
                    </span>
                  </div>
                </div>

                {isValidBlend && (
                  <span className="font-price font-bold text-sm bg-[#C5A059] text-white px-2.5 py-1 rounded-lg">
                    {blendResult.totalGrams} جم
                  </span>
                )}
              </div>

              {/* Visual Multi-Bean Color Ratio Bar */}
              {blendResult.totalGrams > 0 ? (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#1A110A]/80 block">
                    نسب الخلطة في الفنجان:
                  </span>
                  <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-gray-200 shadow-inner">
                    {blendResult.componentsRatio.map((comp) => (
                      <div
                        key={comp.bean.id}
                        style={{
                          width: `${comp.percentage}%`,
                          backgroundColor: comp.bean.color,
                        }}
                        title={`${comp.bean.name}: ${comp.grams} جم (${comp.percentage}%)`}
                        className="h-full transition-all"
                      />
                    ))}
                  </div>

                  {/* Ratio Legend Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {blendResult.componentsRatio.map((comp) => (
                      <span
                        key={comp.bean.id}
                        className="inline-flex items-center gap-1 text-[10px] bg-white border border-[#1A110A]/10 px-2 py-0.5 rounded-md font-price font-semibold"
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
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-amber-800 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>اختار أنواع البن وحرك عداد الجرامات لتكوين التوليفة</span>
                </div>
              )}

              {/* Recipe Breakdown List */}
              {blendResult.componentsRatio.length > 0 && (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs border-y border-dashed border-[#1A110A]/10 py-2.5">
                  {blendResult.componentsRatio.map((comp) => (
                    <div
                      key={comp.bean.id}
                      className="flex items-center justify-between text-[#1A110A]"
                    >
                      <span className="truncate max-w-[170px] text-[11px]">
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

                  {cardamomGrams > 0 && (
                    <div className="flex items-center justify-between text-xs text-[#C5A059] font-bold pt-1">
                      <span>حبهان ({cardamomGrams} جم)</span>
                      <span className="font-price">
                        +{blendResult.cardamomPrice} ج.م
                      </span>
                    </div>
                  )}

                  {blendResult.additionsPrice > 0 && (
                    <div className="flex items-center justify-between text-xs text-[#C5A059] font-bold">
                      <span>إضافات خاصة</span>
                      <span className="font-price">
                        +{blendResult.additionsPrice} ج.م
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Pricing Cards */}
              <div className="space-y-2 pt-1">
                <div className="flex items-baseline justify-between text-xs text-[#1A110A]/70">
                  <span>سعر الكيلو المرجّح للتوليفة:</span>
                  <strong className="font-price text-sm text-[#1A110A]">
                    {blendResult.weightedKiloPrice} ج.م / ك
                  </strong>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#C5A059] shadow-2xs">
                  <div>
                    <span className="text-xs font-bold text-[#1A110A] block">
                      الإجمالي المستحق للطلب:
                    </span>
                    <span className="text-[10px] text-[#1A110A]/60">
                      شامل الطحن والتغليف الطازج
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

              {/* Added to Cart Notification Alert */}
              {addedAlert && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs text-center font-bold flex items-center justify-center gap-1.5 animate-fadeIn">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>تمت إضافة التوليفة بنجاح إلى سلة المشتريات!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {/* 1. Add to Cart Button */}
                <button
                  type="button"
                  disabled={!isValidBlend}
                  onClick={handleAddToCartClick}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                    isValidBlend
                      ? "bg-[#1A110B] hover:bg-[#2A1D15] text-[#FAF8F5] border border-[#C5A059]"
                      : "bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed shadow-none"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                  <span>
                    {isValidBlend
                      ? `أضف التوليفة للسلة (${blendResult.totalPrice} ج.م)`
                      : "حدد نوع بن ووزنه للتفعيل"}
                  </span>
                </button>

                {/* 2. Direct WhatsApp Order Button */}
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

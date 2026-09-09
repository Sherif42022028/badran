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
  Check,
  RotateCcw,
  MessageSquare,
  Info,
  Tag,
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
  const [selectedGrams, setSelectedGrams] = useState<Record<string, number>>({
    "hab-har": 150,
    "br-san": 100,
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

  // Toggle bean selection (0g <-> 100g)
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
        const matchRole = b.blendRole.toLowerCase().includes(q);
        const matchFlavor = b.flavorNotes.some((fn) =>
          fn.toLowerCase().includes(q)
        );
        return matchName || matchDesc || matchRole || matchFlavor;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  // Selected components list for calculations
  const selectedComponentsList: SelectedBlendComponent[] = useMemo(() => {
    return Object.entries(selectedGrams)
      .map(([beanId, grams]) => {
        const bean = BLEND_COFFEE_BEANS.find((b) => b.id === beanId);
        return bean && grams > 0 ? { bean, grams } : null;
      })
      .filter(Boolean) as SelectedBlendComponent[];
  }, [selectedGrams]);

  // Dynamic price calculation (cardamom omitted)
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
      `توليفة خاصة (${selectedComponentsList.map((c) => c.bean.name.replace("بن ", "")).join(" + ")})`;

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
    const finalBlendName = blendName.trim() || "توليفتك على زوقك الخاصة";

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
            blendName: blendName.trim() || "توليفتك الخاصة",
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
      <div className="framed-section p-4 sm:p-6 md:p-8 bg-white shadow-xs rounded-3xl">
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center mb-8 border-b border-dashed border-[#C5A059]/30 pb-6">
          <span className="solid-badge text-xs md:text-sm mb-2.5 py-1 px-4 inline-flex items-center gap-1.5 font-alexandria shadow-xs">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>صمم خلطتك بالجرام على زوقك</span>
          </span>
          <h2 className="font-amiri text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A110B] mt-2">
            توليفتك على زوقك — ركّب خلطة بن خاصة بك بالجرام
          </h2>
          <p className="font-alexandria text-xs sm:text-sm text-[#1A110A]/75 max-w-2xl mx-auto mt-2 font-light leading-relaxed">
            اختار الحبوب المخصصة للتوليف، حدد الجرامات بدقة بواسطة العداد، واضبط درجة الطحن والإضافات المفضلة.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT / MAIN: STEPS (8 COLS) ================= */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8 font-alexandria">
            {/* ================= STEP 1: BEAN SELECTION & GRAMS ================= */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#1A110B] text-[#C5A059] font-price font-bold text-sm flex items-center justify-center shadow-xs">
                    1
                  </span>
                  <div>
                    <h3 className="font-amiri text-xl font-bold text-[#1A110A]">
                      اختار أنواع البن وحدد وزن كل نوع بالجرام:
                    </h3>
                    <span className="text-[11px] text-[#1A110A]/60">
                      كل نوع مخصص لوظيفة معينة بالتوليفة (قاعدة، وش، عطرية...)
                    </span>
                  </div>
                </div>

                {selectedComponentsList.length > 0 && (
                  <button
                    type="button"
                    onClick={resetBlend}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer font-bold self-start sm:self-auto bg-red-50 hover:bg-red-100/70 border border-red-200 px-2.5 py-1 rounded-lg transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>تفريغ التوليفة</span>
                  </button>
                )}
              </div>

              {/* Category Pills & Search */}
              <div className="space-y-2.5 bg-[#FAF8F5] p-3 rounded-2xl border border-[#1A110A]/10">
                <div className="flex flex-wrap gap-1.5">
                  {BLEND_ORIGIN_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        activeCategory === cat.id
                          ? "bg-[#1A110B] text-[#FAF8F5] border-[#C5A059] shadow-xs ring-1 ring-[#C5A059]"
                          : "bg-white text-[#1A110A] border-[#1A110A]/15 hover:bg-[#FAF8F5]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-[#1A110A]/40 absolute top-2.5 right-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="ابحث عن نوع بن أو وظيفة معينة (مثال: سانتوس، وش كثيف، هراري، يمني...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 pr-9 pl-3 bg-white border border-[#1A110A]/15 rounded-xl text-xs text-[#1A110A] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Clean Engineered Bean Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[500px] overflow-y-auto p-1 pr-1.5 scrollbar-thin">
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
                      {/* Top Row: Name, Checkbox, Role & Price */}
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleBean(bean)}
                              id={`bean-${bean.id}`}
                              className="mt-1 w-4 h-4 rounded accent-[#C5A059] cursor-pointer shrink-0"
                            />
                            <div>
                              <label
                                htmlFor={`bean-${bean.id}`}
                                className="font-amiri text-base font-bold text-[#1A110A] cursor-pointer leading-tight block"
                              >
                                {bean.name}
                              </label>

                              {/* Blend Role Tag */}
                              <span className="text-[10px] font-bold text-[#C5A059] bg-[#1A110B] px-2 py-0.5 rounded-md inline-block mt-1 font-alexandria shadow-2xs">
                                🎯 {bean.blendRole}
                              </span>
                            </div>
                          </div>

                          {/* Percentage Badge */}
                          {isSelected ? (
                            <span className="font-price font-bold text-[11px] bg-[#1A110B] text-[#C5A059] px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs">
                              {percentage}%
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#1A110A]/40 font-alexandria bg-gray-100 px-2 py-0.5 rounded-md">
                              0 جم
                            </span>
                          )}
                        </div>

                        {/* Price Row */}
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-dashed border-[#1A110A]/10 text-xs">
                          <span className="font-price font-bold text-[#C5A059]">
                            {bean.kiloPrice} ج.م / ك
                          </span>
                          {isSelected && (
                            <span className="font-price text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
                              {grams} جم = {subtotal} ج.م
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Grams Slider Counter Controls */}
                      <div className="mt-3 pt-2 border-t border-[#1A110A]/10 space-y-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStepGrams(bean.id, -25)}
                            className="w-7 h-7 rounded-lg bg-white border border-[#1A110A]/20 hover:bg-[#1A110A]/5 text-[#1A110A] flex items-center justify-center cursor-pointer shadow-2xs text-xs shrink-0 transition-all active:scale-95"
                            title="تقليل 25 جرام"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

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

                          <button
                            type="button"
                            onClick={() => handleStepGrams(bean.id, 25)}
                            className="w-7 h-7 rounded-lg bg-white border border-[#1A110A]/20 hover:bg-[#1A110A]/5 text-[#1A110A] flex items-center justify-center cursor-pointer shadow-2xs text-xs shrink-0 transition-all active:scale-95"
                            title="زيادة 25 جرام"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

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

                        {/* Quick Presets */}
                        <div className="flex items-center justify-between gap-1 pt-0.5">
                          <span className="text-[10px] text-[#1A110A]/50 font-alexandria shrink-0">
                            أوزان سريعة:
                          </span>
                          <div className="flex items-center gap-1 overflow-x-auto">
                            {[50, 100, 150, 250, 500].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => handleGramsChange(bean.id, preset)}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-price font-bold transition-all cursor-pointer border ${
                                  grams === preset
                                    ? "bg-[#1A110B] text-[#C5A059] border-[#C5A059] shadow-xs"
                                    : "bg-white text-[#1A110A] border-[#1A110A]/15 hover:border-[#C5A059]"
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
            </div>

            {/* ================= STEP 2: GRIND DEGREE ================= */}
            <div className="pt-6 border-t border-dashed border-[#1A110A]/15 space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#1A110B] text-[#C5A059] font-price font-bold text-sm flex items-center justify-center shadow-xs">
                  2
                </span>
                <div>
                  <h3 className="font-amiri text-xl font-bold text-[#1A110A]">
                    درجة الطحن المفضلة:
                  </h3>
                  <span className="text-[11px] text-[#1A110A]/60">
                    نطحنها لك طازجة بالنسب المطلوبة فور تجهيز الطلب
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GRIND_OPTIONS.map((g) => {
                  const isSelected = grind === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrind(g)}
                      className={`p-3 rounded-xl text-xs font-bold text-center transition-all cursor-pointer border flex items-center justify-center gap-2 ${
                        isSelected
                          ? "bg-[#1A110B] text-[#FAF8F5] border-[#C5A059] shadow-xs ring-1 ring-[#C5A059]"
                          : "bg-white text-[#1A110A] border-[#1A110A]/15 hover:border-[#C5A059]/60 hover:bg-[#FAF8F5]"
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

            {/* ================= STEP 3: SECRET ADDITIONS (STARTS AT 1 GRAM) ================= */}
            <div className="pt-6 border-t border-dashed border-[#1A110A]/15 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#1A110B] text-[#C5A059] font-price font-bold text-sm flex items-center justify-center shadow-xs">
                    3
                  </span>
                  <div>
                    <h3 className="font-amiri text-xl font-bold text-[#1A110A]">
                      إضافات سرية خاصة (بالجرام تبدأ من 1 جم):
                    </h3>
                    <span className="text-[11px] text-[#1A110A]/60">
                      إضافات فاخرة تقاس بالجرام الواحد وتوزن بدقة متناهية
                    </span>
                  </div>
                </div>

                {blendResult.additionsPrice > 0 && (
                  <span className="font-price font-bold text-xs text-[#C5A059] bg-[#1A110B] px-3 py-1 rounded-lg shadow-2xs">
                    +{blendResult.additionsPrice} ج.م
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADDITIONS_LIST.map((add) => {
                  const isChecked =
                    additionGrams[add.id] !== undefined &&
                    additionGrams[add.id] > 0;
                  const grams = additionGrams[add.id] || 1;
                  const itemSubtotal = grams * add.pricePerGram;

                  return (
                    <div
                      key={add.id}
                      className={`p-3 rounded-2xl border transition-all ${
                        isChecked
                          ? "bg-[#FAF8F5] border-[#C5A059] ring-1 ring-[#C5A059]/50 shadow-xs"
                          : "bg-white border-[#1A110A]/15 hover:border-[#C5A059]/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => toggleAddition(add.id)}
                          className="flex items-center gap-2 cursor-pointer text-right flex-1"
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
                          <span className="font-price text-xs font-bold text-[#C5A059] bg-white border border-[#C5A059] px-2 py-0.5 rounded-lg shadow-2xs">
                            {grams} جم = {itemSubtotal} ج.م
                          </span>
                        )}
                      </div>

                      {/* 1-Gram Counter & Slider (Starts from 1g) */}
                      {isChecked && (
                        <div className="mt-3 pt-2 border-t border-dashed border-[#C5A059]/40 space-y-1.5 animate-fadeIn">
                          <div className="flex items-center justify-between text-[10px] text-[#1A110A]/70">
                            <span>الوزن المطلوب (بالجرام):</span>
                            <span className="font-price font-bold text-[#C5A059]">
                              {grams} جم
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleStepAddition(add.id, -1)}
                              className="w-6 h-6 rounded-lg bg-white border border-[#1A110A]/20 hover:bg-[#1A110A]/5 text-[#1A110A] flex items-center justify-center cursor-pointer shadow-2xs text-xs font-bold"
                              title="تقليل 1 جرام"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            <input
                              type="range"
                              min="1"
                              max="25"
                              step="1"
                              value={grams}
                              onChange={(e) =>
                                handleAdditionGramsChange(
                                  add.id,
                                  Number(e.target.value)
                                )
                              }
                              className="flex-1 accent-[#C5A059] h-2 bg-gray-200 rounded-lg cursor-pointer"
                            />

                            <button
                              type="button"
                              onClick={() => handleStepAddition(add.id, 1)}
                              className="w-6 h-6 rounded-lg bg-white border border-[#1A110A]/20 hover:bg-[#1A110A]/5 text-[#1A110A] flex items-center justify-center cursor-pointer shadow-2xs text-xs font-bold"
                              title="زيادة 1 جرام"
                            >
                              <Plus className="w-3 h-3" />
                            </button>

                            <div className="flex items-center gap-1 bg-white border border-[#C5A059] rounded-xl px-2 py-0.5 shrink-0 shadow-2xs">
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
                                className="w-9 font-price font-bold text-center text-xs text-[#1A110A] focus:outline-none"
                              />
                              <span className="text-[10px] text-[#C5A059] font-bold">
                                جم
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ================= STEP 4: BLEND NAME & NOTES ================= */}
            <div className="pt-6 border-t border-dashed border-[#1A110A]/15 space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#1A110B] text-[#C5A059] font-price font-bold text-sm flex items-center justify-center shadow-xs">
                  4
                </span>
                <div>
                  <h3 className="font-amiri text-xl font-bold text-[#1A110A]">
                    سمّي توليفك الخاصة (اختياري):
                  </h3>
                  <span className="text-[11px] text-[#1A110A]/60">
                    اكتب اسماً مميزاً سنطبعه لك على كيس القهوة
                  </span>
                </div>
              </div>

              <input
                type="text"
                placeholder="مثال: خلطة الصباح الملكية، قهوة ديوانية بدران، توليفة أبو علي..."
                value={blendName}
                onChange={(e) => setBlendName(e.target.value)}
                className="w-full py-3 px-4 bg-[#FAF8F5] border border-[#1A110A]/15 rounded-2xl text-xs sm:text-sm text-[#1A110A] focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* ================= RIGHT: LUXURY STICKY BLEND ATELIER SUMMARY (4 COLS) ================= */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-4 font-alexandria">
            <div className="bg-[#FAF8F5] border-2 border-[#C5A059] rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
              {/* Summary Header */}
              <div className="flex items-center justify-between border-b border-dashed border-[#C5A059]/40 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#1A110B] text-[#C5A059] flex items-center justify-center shadow-xs">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-amiri text-xl font-bold text-[#1A110B]">
                      ملخص التوليفة المباشر
                    </h4>
                    <span className="text-[11px] text-[#1A110A]/60">
                      {selectedComponentsList.length} أنواع بن مختارة
                    </span>
                  </div>
                </div>

                {isValidBlend && (
                  <span className="font-price font-bold text-sm bg-[#C5A059] text-white px-3 py-1 rounded-xl shadow-xs">
                    {blendResult.totalGrams} جم
                  </span>
                )}
              </div>

              {/* Visual Multi-Bean Color Ratio Bar */}
              {blendResult.totalGrams > 0 ? (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#1A110A]/80 block">
                    توزيع النسب في الفنجان:
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
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {blendResult.componentsRatio.map((comp) => (
                      <span
                        key={comp.bean.id}
                        className="inline-flex items-center gap-1 text-[10px] bg-white border border-[#1A110A]/10 px-2 py-0.5 rounded-lg font-price font-bold"
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: comp.bean.color }}
                        />
                        <span className="font-alexandria truncate max-w-[100px]">
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
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-center text-amber-800 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>اختار نوع بن واحد على الأقل واكتب وزنه للبدء</span>
                </div>
              )}

              {/* Detailed Breakdown List */}
              {blendResult.componentsRatio.length > 0 && (
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1 text-xs border-y border-dashed border-[#1A110A]/10 py-3">
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

                  {/* Grind degree in summary */}
                  <div className="flex items-center justify-between text-xs text-[#1A110A]/75 pt-1 border-t border-dashed border-[#1A110A]/10">
                    <span>درجة الطحن:</span>
                    <span className="font-bold text-[#1A110A] truncate max-w-[160px]">
                      {grind}
                    </span>
                  </div>

                  {/* Active additions breakdown */}
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

              {/* Pricing Breakdown */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-baseline justify-between text-xs text-[#1A110A]/70">
                  <span>سعر الكيلو المرجّح للتوليفة:</span>
                  <strong className="font-price text-sm text-[#1A110A]">
                    {blendResult.weightedKiloPrice} ج.م / ك
                  </strong>
                </div>

                <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#C5A059] shadow-2xs">
                  <div>
                    <span className="text-xs font-bold text-[#1A110A] block">
                      الإجمالي المستحق:
                    </span>
                    <span className="text-[10px] text-[#1A110A]/60">
                      شامل الطحن الطازج والتعبئة
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
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs text-center font-bold flex items-center justify-center gap-1.5 animate-fadeIn">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>تمت إضافة التوليفة بنجاح إلى سلة المشتريات!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  disabled={!isValidBlend}
                  onClick={handleAddToCartClick}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
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

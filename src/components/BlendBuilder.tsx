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
  AlertCircle,
  Flame,
} from "lucide-react";
import {
  Card,
  Button,
  Chip,
  Tabs,
} from "@heroui/react";
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
  // Selected coffee beans: defaults to Santos (150g) + Harari (100g)
  const [selectedGrams, setSelectedGrams] = useState<Record<string, number>>({
    "br-san": 150,
    "hab-har": 100,
  });

  // Selected preparation (sada vs mohawaj) per bean
  const [selectedPreps, setSelectedPreps] = useState<Record<string, "sada" | "mohawaj">>({
    "br-san": "sada",
    "hab-har": "mohawaj",
  });

  // Default active category: "basics"
  const [activeCategory, setActiveCategory] = useState<string>("basics");
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
  const [checkoutOrderObj, setCheckoutOrderObj] = useState<CheckoutOrder | null>(null);
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

    if (!selectedPreps[bean.id]) {
      setSelectedPreps((prev) => ({
        ...prev,
        [bean.id]: "sada",
      }));
    }
  };

  // Switch bean preparation between sada and mohawaj
  const handleTogglePrep = (beanId: string, prep: "sada" | "mohawaj") => {
    setSelectedPreps((prev) => ({
      ...prev,
      [beanId]: prep,
    }));
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

  // Step grams by delta (+25, -25, etc.)
  const handleStepGrams = (beanId: string, delta: number) => {
    const current = selectedGrams[beanId] || 0;
    const next = current + delta;
    if (next <= 0) {
      handleRemoveBean(beanId);
    } else {
      handleGramsChange(beanId, next);
    }
  };

  // Toggle additions
  const toggleAddition = (addId: string) => {
    setAdditionGrams((prev) => {
      const next = { ...prev };
      if (next[addId] !== undefined && next[addId] > 0) {
        delete next[addId];
      } else {
        next[addId] = 1; // default 1 gram
      }
      return next;
    });
  };

  const handleAdditionGramsChange = (addId: string, value: number) => {
    if (isNaN(value) || value <= 0) {
      setAdditionGrams((prev) => {
        const next = { ...prev };
        delete next[addId];
        return next;
      });
      return;
    }
    const valid = Math.max(1, Math.min(50, value));
    setAdditionGrams((prev) => ({
      ...prev,
      [addId]: valid,
    }));
  };

  const handleStepAddition = (addId: string, delta: number) => {
    const current = additionGrams[addId] || 0;
    const next = current + delta;
    if (next <= 0) {
      toggleAddition(addId);
    } else {
      handleAdditionGramsChange(addId, next);
    }
  };

  // Filter beans by active category & search query
  const filteredBeans = useMemo(() => {
    let list = BLEND_COFFEE_BEANS;
    if (activeCategory !== "all") {
      list = list.filter((b) => b.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.blendRole.toLowerCase().includes(q) ||
          b.flavorNotes.some((n) => n.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

  // Selected components list with their individual preparation
  const selectedComponentsList: SelectedBlendComponent[] = useMemo(() => {
    return Object.entries(selectedGrams)
      .map(([beanId, grams]) => {
        const bean = BLEND_COFFEE_BEANS.find((b) => b.id === beanId);
        if (!bean || grams <= 0) return null;
        return {
          bean,
          grams,
          preparation: selectedPreps[beanId] || "sada",
        };
      })
      .filter(Boolean) as SelectedBlendComponent[];
  }, [selectedGrams, selectedPreps]);

  // Dynamic blend calculation result
  const blendResult = useMemo(() => {
    return calculateCustomBlend(
      selectedComponentsList,
      "سادة",
      additionGrams
    );
  }, [selectedComponentsList, additionGrams]);

  const isValidBlend = blendResult.totalGrams >= 25;

  // Handle Add to Cart
  const handleAddToCartClick = () => {
    if (!onAddToCart || !isValidBlend) return;

    const finalBlendName =
      blendName.trim() || `توليفة خاصة (${blendResult.totalGrams} جم)`;

    const customBlendProduct: Product = {
      id: `custom-blend-${Date.now()}`,
      name: finalBlendName,
      category: "blends",
      description: `توليفة خاصة: ${blendResult.summaryRecipe} | طحن: ${grind}`,
      tier: 1,
      variantType: "none",
      basePrice: blendResult.totalPrice,
      unitLabel: `${blendResult.totalGrams} جم`,
    };

    onAddToCart(
      customBlendProduct,
      {
        unit: `${blendResult.totalGrams} جم`,
        label: `${blendResult.totalGrams} جم - ${blendResult.summaryRecipe}`,
        price: blendResult.totalPrice,
      },
      1
    );

    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 4000);
  };

  // Open Preview Modal
  const handleOpenPreview = () => {
    trackContactClick("whatsapp");
    const orderId = generateOrderId("BD-BL");
    const finalBlendName = blendName.trim() || "توليفة خاصة من اختيارك";

    const activeAdditions = Object.entries(additionGrams)
      .filter(([_, g]) => g > 0)
      .map(([addId, g]) => `${addId} (${g} جم)`);

    const blendOrder: CustomBlendOrder = {
      orderId,
      customerName,
      customerPhone,
      blendName: finalBlendName,
      recipeBreakdown: blendResult.summaryRecipe,
      grind,
      additions: activeAdditions,
      weight: `${blendResult.totalGrams} جم`,
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
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "حدث خطأ أثناء إنشاء رابط الطلب عبر الواتساب";
      alert(errorMsg);
    }
  };

  const resetBlend = () => {
    setSelectedGrams({});
    setSelectedPreps({});
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
            اختر حبوب البن المفضلة لخلطتك من الأساسيات ودرجات التحميص، الأرابيكات الفاخرة، البن الحبشي أو الهندي. حدد وزن كل صنف بدقة واختر نوع تجهيزه (ساده أو محوج).
          </p>

          {/* Quick Counter Ticker */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-alexandria font-semibold text-[#1A110B]">
            <div className="inline-flex items-center gap-1.5 bg-[#FAF8F5] border border-[#C5A059]/40 py-1 px-3 rounded-full shadow-2xs">
              <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>وزن التوليفة الحالي: </span>
              <strong className="font-price font-bold text-[#C5A059]">
                {blendResult.totalGrams} جم
              </strong>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-[#FAF8F5] border border-[#C5A059]/40 py-1 px-3 rounded-full shadow-2xs">
              <Coffee className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>الأصناف المختارة: </span>
              <strong className="font-price font-bold text-[#1A110B]">
                {selectedComponentsList.length} أصناف
              </strong>
            </div>

            {selectedComponentsList.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onPress={resetBlend}
                className="text-xs text-red-600 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100/70 border border-red-200 py-1 px-2.5 rounded-full transition-all cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 ml-1" />
                <span>تفريغ التوليفة</span>
              </Button>
            )}
          </div>
        </div>

        {/* Selected Beans Quick Overview Bar (Always visible for quick reference) */}
        {selectedComponentsList.length > 0 && (
          <div className="mb-6 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/40 flex flex-wrap items-center justify-between gap-3 font-alexandria animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1A110B] flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#C5A059]" />
                <span>الأصناف المضافة بالخلطة حالياً:</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {selectedComponentsList.map((comp) => (
                <span
                  key={comp.bean.id}
                  className="inline-flex items-center gap-1.5 text-xs bg-white border border-[#C5A059]/40 px-2.5 py-1 rounded-lg shadow-2xs"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: comp.bean.color }}
                  />
                  <strong className="font-amiri text-sm">{comp.bean.name}</strong>
                  <span className="text-[11px] font-bold text-[#C5A059] bg-[#FAF8F5] px-1.5 py-0.5 rounded">
                    {comp.preparation === "mohawaj" ? "محوج" : "ساده"}
                  </span>
                  <span className="font-price font-bold text-[#1A110B]">
                    {comp.grams} جم
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBean(comp.bean.id)}
                    className="text-red-400 hover:text-red-600 cursor-pointer mr-0.5"
                    title="حذف من التوليفة"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT / MAIN BUILDER (7-8 COLS) ================= */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8 font-alexandria">

            {/* ----------------- STEP 1: CATEGORY TABS & EXPANDABLE BEAN CARDS ----------------- */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#1A110B] text-[#C5A059] font-price font-bold text-sm flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <h3 className="font-amiri text-xl font-bold text-[#1A110A]">
                      اختر حبوب البن واضبط وزنها وتجهيزها:
                    </h3>
                    <span className="text-[11px] text-[#1A110A]/60">
                      انقر على الصنف لإضافته وتوسيعه لضبط الجرامات وخيار (ساده / محوج)
                    </span>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 text-[#1A110A]/40 absolute top-2.5 right-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="ابحث عن نوع بن..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-1.5 pr-8 pl-3 bg-[#FAF8F5] border border-[#1A110A]/15 rounded-lg text-xs text-[#1A110A] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Origin Categories Tabs */}
              <div className="w-full">
                <Tabs
                  selectedKey={activeCategory}
                  onSelectionChange={(key) => setActiveCategory(String(key))}
                  className="w-full"
                >
                  <Tabs.ListContainer className="w-full overflow-x-auto">
                    <Tabs.List
                      aria-label="أقسام حبوب البن"
                      className="flex flex-wrap gap-1.5 bg-[#FAF8F5] p-1.5 rounded-xl border border-[#1A110A]/10 w-full"
                    >
                      {BLEND_ORIGIN_CATEGORIES.map((cat) => {
                        const isSelected = activeCategory === cat.id;
                        return (
                          <Tabs.Tab
                            key={cat.id}
                            id={cat.id}
                            className={`px-3 py-2 rounded-lg font-alexandria text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                              isSelected
                                ? "bg-[#1A110B] text-[#FAF8F5] border-[#C5A059] shadow-xs"
                                : "bg-white text-[#1A110A]/70 border-[#1A110A]/10 hover:border-[#C5A059]/50 hover:bg-white"
                            }`}
                          >
                            {cat.label}
                          </Tabs.Tab>
                        );
                      })}
                    </Tabs.List>
                  </Tabs.ListContainer>
                </Tabs>
              </div>

              {/* Bean Cards Grid: Expandable Architecture (Compact when unselected, Full workstation when selected) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {filteredBeans.map((bean) => {
                  const isSelected =
                    selectedGrams[bean.id] !== undefined &&
                    selectedGrams[bean.id] > 0;
                  const currentGrams = selectedGrams[bean.id] || 0;
                  const currentPrep = selectedPreps[bean.id] || "sada";
                  const currentKiloPrice =
                    currentPrep === "mohawaj" ? bean.mohawajPrice : bean.sadaPrice;
                  const itemSubtotal = Math.round(
                    (currentKiloPrice * currentGrams) / 1000
                  );
                  const percentage =
                    blendResult.totalGrams > 0 && isSelected
                      ? Math.round((currentGrams / blendResult.totalGrams) * 100)
                      : 0;

                  // ================= UNSELECTED (COMPACT COLLAPSED CARD) =================
                  if (!isSelected) {
                    return (
                      <div
                        key={bean.id}
                        className="p-3.5 bg-white rounded-xl border border-[#1A110A]/12 hover:border-[#C5A059]/70 hover:shadow-xs transition-all flex flex-col justify-between gap-3 text-right"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="text-[10px] bg-[#FAF8F5] text-[#C5A059] font-bold px-2 py-0.5 rounded border border-[#C5A059]/30">
                              🎯 {bean.blendRole}
                            </span>
                            <span className="text-[11px] font-price font-bold text-[#1A110B] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#1A110A]/10">
                              {bean.sadaPrice} ج.م/ك
                            </span>
                          </div>

                          <h4 className="font-amiri text-base sm:text-lg font-bold text-[#1A110B] leading-tight">
                            {bean.name}
                          </h4>

                          <p className="text-[11px] text-[#1A110A]/65 line-clamp-1 mt-1 font-light">
                            {bean.description}
                          </p>

                          {/* Quick Flavor Notes */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {bean.flavorNotes.slice(0, 2).map((note, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] text-[#1A110A]/60 bg-[#FAF8F5] border border-[#1A110A]/10 px-1.5 py-0.5 rounded"
                              >
                                {note}
                              </span>
                            ))}
                            <span className="text-[10px] text-[#C5A059] font-bold px-1 py-0.5">
                              (ساده ومحوج)
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleBean(bean)}
                          className="w-full py-2 px-3 rounded-lg text-xs font-bold font-alexandria flex items-center justify-center gap-1.5 bg-[#FAF8F5] hover:bg-[#1A110B] hover:text-[#FAF8F5] text-[#1A110A] border border-[#1A110A]/15 transition-all cursor-pointer active:scale-98"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>+ أضف للتوليفة (100 جم)</span>
                        </button>
                      </div>
                    );
                  }

                  // ================= SELECTED (EXPANDED ACTIVE LUXURY CARD) =================
                  return (
                    <div
                      key={bean.id}
                      className="p-4 bg-[#FAF7F2] rounded-xl border-2 border-[#C5A059] ring-2 ring-[#C5A059]/25 shadow-xs flex flex-col justify-between gap-3 text-right animate-fadeIn"
                    >
                      {/* Top Header with Selected Badge, Percent, and Remove Button */}
                      <div className="flex items-start justify-between gap-2 border-b border-dashed border-[#C5A059]/40 pb-2.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#C5A059] text-white px-2 py-0.5 rounded shadow-2xs">
                              <Check className="w-3 h-3" />
                              <span>مضاف للتوليفة</span>
                            </span>
                            {percentage > 0 && (
                              <span className="text-[11px] font-price font-bold text-[#1A110B] bg-white border border-[#C5A059]/40 px-2 py-0.5 rounded">
                                {percentage}% من الفنجان
                              </span>
                            )}
                          </div>

                          <h4 className="font-amiri text-lg sm:text-xl font-bold text-[#1A110B] leading-snug">
                            {bean.name}
                          </h4>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveBean(bean.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="إزالة الصنف من التوليفة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Preparation Switcher (ساده vs محوج بالحبهان) */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#1A110A]/85 flex items-center justify-between">
                          <span>تجهيز البن:</span>
                          <span className="font-price font-bold text-[#C5A059] text-xs">
                            {currentKiloPrice} ج.م / كيلو
                          </span>
                        </label>
                        <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-lg border border-[#1A110A]/15 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleTogglePrep(bean.id, "sada")}
                            className={`py-1.5 px-2 rounded-md text-xs font-bold font-alexandria transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              currentPrep === "sada"
                                ? "bg-[#1A110B] text-[#FAF8F5] shadow-2xs"
                                : "text-[#1A110A]/70 hover:text-[#1A110A] hover:bg-[#FAF8F5]"
                            }`}
                          >
                            <span>ساده</span>
                            <span className="text-[10px] font-price opacity-80">
                              ({bean.sadaPrice} ج)
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleTogglePrep(bean.id, "mohawaj")}
                            className={`py-1.5 px-2 rounded-md text-xs font-bold font-alexandria transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              currentPrep === "mohawaj"
                                ? "bg-[#C5A059] text-white shadow-2xs"
                                : "text-[#1A110A]/70 hover:text-[#1A110A] hover:bg-[#FAF8F5]"
                            }`}
                          >
                            <span>محوج بالحبهان</span>
                            <span className="text-[10px] font-price opacity-90">
                              ({bean.mohawajPrice} ج)
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Interactive Grams Counter & Stepper */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <label className="text-[11px] font-bold text-[#1A110A]/85">
                            الوزن المطلوب:
                          </label>
                          <span className="font-price font-bold text-xs text-[#C5A059] bg-white border border-[#C5A059]/40 px-2 py-0.5 rounded shadow-2xs">
                            {currentGrams} جم = {itemSubtotal} ج.م
                          </span>
                        </div>

                        {/* Stepper Controls */}
                        <div className="flex items-center gap-1.5 bg-white border border-[#C5A059] rounded-xl p-1 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleStepGrams(bean.id, -25)}
                            className="w-8 h-8 rounded-lg bg-[#FAF8F5] hover:bg-[#1A110B] hover:text-white text-[#1A110A] flex items-center justify-center font-bold text-xs transition-colors cursor-pointer active:scale-95"
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
                              className="w-16 text-center font-price font-bold text-base text-[#1A110A] focus:outline-none"
                            />
                            <span className="text-xs text-[#C5A059] font-bold mr-1">
                              جم
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleStepGrams(bean.id, 25)}
                            className="w-8 h-8 rounded-lg bg-[#FAF8F5] hover:bg-[#1A110B] hover:text-white text-[#1A110A] flex items-center justify-center font-bold text-xs transition-colors cursor-pointer active:scale-95"
                            title="زيادة 25 جرام"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Quick Weight Presets */}
                        <div className="flex items-center justify-between gap-1 pt-1">
                          <span className="text-[10px] text-[#1A110A]/50 font-alexandria">
                            أوزان سريعة:
                          </span>
                          <div className="flex items-center gap-1">
                            {[50, 100, 150, 200, 250, 500].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => handleGramsChange(bean.id, preset)}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-price font-bold transition-all cursor-pointer border ${
                                  currentGrams === preset
                                    ? "bg-[#1A110B] text-[#C5A059] border-[#C5A059]"
                                    : "bg-white text-[#1A110A]/70 border-[#1A110A]/12 hover:border-[#C5A059]"
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
                    <Button
                      key={g}
                      variant={isSelected ? "primary" : "secondary"}
                      onPress={() => setGrind(g)}
                      className={`p-3 h-auto rounded-xl text-xs font-bold text-center transition-all cursor-pointer border flex items-center justify-center gap-2 font-alexandria ${
                        isSelected
                          ? "bg-[#1A110B] text-[#FAF8F5] border-[#C5A059] ring-1 ring-[#C5A059]"
                          : "bg-[#FAF8F5] text-[#1A110A] border-[#1A110A]/15 hover:border-[#C5A059]/60 hover:bg-white"
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      )}
                      <span>{g}</span>
                    </Button>
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
                      إضافات بهارات سرية خاصة (اختياري بالجرام الواحد):
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
                    <Card
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
                          className="flex items-center gap-2 cursor-pointer text-right flex-1"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="w-4 h-4 rounded accent-[#C5A059] cursor-pointer shrink-0"
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

                      {/* Clean 1-Gram Stepper */}
                      {isChecked && (
                        <div className="mt-3 pt-2 border-t border-dashed border-[#C5A059]/40 flex items-center justify-between gap-2 animate-fadeIn">
                          <span className="text-[11px] text-[#1A110A]/70">
                            الوزن المطلوب:
                          </span>

                          <div className="flex items-center gap-1.5 bg-white border border-[#C5A059] rounded-lg p-0.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onPress={() => handleStepAddition(add.id, -1)}
                              className="w-6 h-6 min-w-0 p-0 rounded bg-[#FAF8F5] hover:bg-[#1A110B] hover:text-white text-[#1A110A] flex items-center justify-center cursor-pointer text-xs"
                              aria-label="تقليل 1 جرام"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>

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

                            <Button
                              variant="ghost"
                              size="sm"
                              onPress={() => handleStepAddition(add.id, 1)}
                              className="w-6 h-6 min-w-0 p-0 rounded bg-[#FAF8F5] hover:bg-[#1A110B] hover:text-white text-[#1A110A] flex items-center justify-center cursor-pointer text-xs"
                              aria-label="زيادة 1 جرام"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
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

          {/* ================= RIGHT: HERO UI SUMMARY CARD (4-5 COLS) ================= */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-4 font-alexandria">
            <Card className="bg-[#FAF8F5] border-2 border-[#C5A059] rounded-2xl shadow-xs">
              {/* Header */}
              <Card.Header className="p-5 pb-3 border-b border-dashed border-[#C5A059]/40 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#1A110B] text-[#C5A059] flex items-center justify-center">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <Card.Title className="font-amiri text-lg font-bold text-[#1A110B]">
                      بطاقة وصفة قهوتك
                    </Card.Title>
                    <Card.Description className="text-[11px] text-[#1A110A]/60 font-alexandria">
                      {selectedComponentsList.length} أصناف بن مختارة
                    </Card.Description>
                  </div>
                </div>

                {isValidBlend && (
                  <Chip
                    variant="primary"
                    size="md"
                    className="bg-[#C5A059] text-white font-price font-bold text-sm px-3 py-1 rounded-lg"
                  >
                    <Chip.Label>{blendResult.totalGrams} جم</Chip.Label>
                  </Chip>
                )}
              </Card.Header>

              {/* Card Content: Breakdown & Ratio */}
              <Card.Content className="p-5 space-y-4">
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
                          <span className="text-[#C5A059]">
                            ({comp.preparation === "mohawaj" ? "محوج" : "ساده"})
                          </span>
                          <strong className="text-[#1A110B]">
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
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs border-y border-dashed border-[#C5A059]/30 py-3">
                    {blendResult.componentsRatio.map((comp) => (
                      <div
                        key={comp.bean.id}
                        className="flex items-center justify-between text-[#1A110A]"
                      >
                        <div className="truncate max-w-[170px] text-[11px] font-medium flex items-center gap-1">
                          <span>{comp.bean.name}</span>
                          <span className="text-[10px] font-bold text-[#C5A059]">
                            [{comp.preparation === "mohawaj" ? "محوج" : "ساده"}]
                          </span>
                        </div>
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
              </Card.Content>

              {/* Card Footer: Actions */}
              <Card.Footer className="p-5 pt-0 space-y-3 flex flex-col w-full">
                {/* Payment Policy Notice Box */}
                <div className="w-full bg-amber-50 border border-amber-300/80 rounded-xl p-3 text-xs text-amber-950 flex items-start gap-2 shadow-2xs leading-relaxed text-right">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="font-bold block text-amber-900 font-alexandria text-[11px] sm:text-xs">
                      تنبيه هام بشأن الدفع وتجهيز الأوردر:
                    </strong>
                    <p className="text-[11px] text-amber-950/85 leading-normal font-alexandria">
                      يتم سداد قيمة الأوردر بالكامل أثناء التأكيد عبر الواتساب (عبر إنستاباي أو فودافون كاش)، ولن يتم تجهيز أو خروج الأوردر إلا بعد تحصيل المبلغ كاملاً.
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  isDisabled={!isValidBlend}
                  onPress={handleAddToCartClick}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
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
                </Button>

                <Button
                  variant="secondary"
                  isDisabled={!isValidBlend}
                  onPress={handleOpenPreview}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                    isValidBlend
                      ? "bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-600 shadow-2xs"
                      : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>طلب مباشر بالخلطة عبر الواتساب</span>
                </Button>
              </Card.Footer>
            </Card>
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

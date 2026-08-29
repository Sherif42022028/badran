"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  CATEGORIES_LIST,
  PRODUCTS_CATALOG,
  PRINTED_MENU_PAGES,
} from "@/data/products";
import { Product, SelectedProductOptions } from "@/types/products";
import { calculateProductPrice } from "@/lib/pricing";
import {
  Search,
  ShoppingBag,
  X,
  ZoomIn,
  Grid,
  FileText,
  ChevronLeft,
  ChevronRight,
  Eye,
  Flame,
  Sparkles,
  Coffee,
  Leaf,
  CupSoda,
  Globe,
  Sun,
  Zap,
  IceCream,
  Check,
} from "lucide-react";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

interface MenuSectionProps {
  onAddToCart: (
    item: Product,
    selectedPrice: { unit: string; label: string; price: number }
  ) => void;
}

export default function MenuSection({ onAddToCart }: MenuSectionProps) {
  const [activeTab, setActiveTab] = useState<"digital" | "printed">("digital");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Lightbox index state (0 to 6) or null
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Store selected options for each product: { [productId]: SelectedProductOptions }
  const [productOptions, setProductOptions] = useState<
    Record<string, SelectedProductOptions>
  >({});

  // Get or initialize options for a product
  const getProductSelection = (product: Product): SelectedProductOptions => {
    const current = productOptions[product.id];
    if (current) return current;

    if (product.variants && product.variants.length > 0) {
      return {
        variantId: product.variants[0].id,
        variantLabel: product.variants[0].label,
      };
    }

    if (product.matrix) {
      return {
        matrixOption1: product.matrix.option1Values[0],
        matrixOption2: product.matrix.option2Values[0],
      };
    }

    return {};
  };

  const handleVariantSelect = (product: Product, variantId: string, variantLabel: string) => {
    setProductOptions((prev) => ({
      ...prev,
      [product.id]: {
        ...prev[product.id],
        variantId,
        variantLabel,
      },
    }));
  };

  const handleMatrixSelect = (
    product: Product,
    optionKey: "matrixOption1" | "matrixOption2",
    value: string
  ) => {
    const current = getProductSelection(product);
    setProductOptions((prev) => ({
      ...prev,
      [product.id]: {
        ...current,
        [optionKey]: value,
      },
    }));
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS_CATALOG.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.badge && item.badge.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handlePrevPage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        lightboxIndex > 0 ? lightboxIndex - 1 : PRINTED_MENU_PAGES.length - 1
      );
    }
  };

  const handleNextPage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        lightboxIndex < PRINTED_MENU_PAGES.length - 1 ? lightboxIndex + 1 : 0
      );
    }
  };

  // Helper to map category icon
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Flame":
        return <Flame className="w-4 h-4" />;
      case "Sparkles":
        return <Sparkles className="w-4 h-4" />;
      case "Coffee":
        return <Coffee className="w-4 h-4" />;
      case "Leaf":
        return <Leaf className="w-4 h-4" />;
      case "CupSoda":
        return <CupSoda className="w-4 h-4" />;
      case "Globe":
        return <Globe className="w-4 h-4" />;
      case "Sun":
        return <Sun className="w-4 h-4" />;
      case "Zap":
        return <Zap className="w-4 h-4" />;
      case "IceCream":
        return <IceCream className="w-4 h-4" />;
      default:
        return <Coffee className="w-4 h-4" />;
    }
  };

  return (
    <section id="menu" className="py-6 md:py-12 px-3 sm:px-4 max-w-7xl mx-auto">
      <div className="framed-section p-4 sm:p-7 md:p-9 bg-[#FBF8F3]/90">
        {/* Section Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#5C2A26] text-white px-4 py-1.5 rounded-full border border-[#C9A45F]/40 shadow-xs mb-2">
            <Sparkles className="w-4 h-4 text-[#F78320]" />
            <span className="font-amiri text-sm md:text-base font-bold">
              قائمة أسعار Budran Coffee الشاملة
            </span>
          </div>

          <h2 className="font-amiri text-2xl sm:text-3xl md:text-4xl font-bold text-[#5C2A26] mt-1">
            قهوة تستحقها كل يوم ☕
          </h2>

          <p className="font-alexandria text-xs sm:text-sm text-[#7F3A35] max-w-2xl mx-auto mt-2 font-light leading-relaxed">
            تصفح جميع أقسام القائمة الـ 11 مع نظام السعر الديناميكي الفوري، أو عاين صفحات المنيو المطبوع الأصلية.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex p-1 bg-[#5C2A26]/10 rounded-xl mt-4 border border-[#C9A45F]/40">
            <button
              onClick={() => setActiveTab("digital")}
              className={`px-4 sm:px-6 py-2 rounded-lg font-alexandria text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === "digital"
                  ? "bg-[#5C2A26] text-white shadow-md"
                  : "text-[#5C2A26] hover:bg-[#5C2A26]/10"
              }`}
            >
              <Grid className="w-4 h-4 text-[#F78320]" />
              <span>الكتالوج الرقمي الذكي (11 قسم)</span>
            </button>
            <button
              onClick={() => setActiveTab("printed")}
              className={`px-4 sm:px-6 py-2 rounded-lg font-alexandria text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === "printed"
                  ? "bg-[#5C2A26] text-white shadow-md"
                  : "text-[#5C2A26] hover:bg-[#5C2A26]/10"
              }`}
            >
              <FileText className="w-4 h-4 text-[#F78320]" />
              <span>معرض المنيو المطبوع (1-7)</span>
            </button>
          </div>
        </div>

        {/* ================= DIGITAL MENU LEDGER TABLE ================= */}
        {activeTab === "digital" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Printed Banner */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-[#5C2A26] to-[#7F3A35] rounded-xl text-white shadow-md border border-[#C9A45F]/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#F78320] text-white rounded-lg shrink-0 shadow-xs">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-amiri text-base sm:text-lg font-bold text-[#FBF3E7]">
                    تصفح فوري لـ 11 قسماً مع الأسعار المحدثة
                  </h5>
                  <p className="font-alexandria text-xs text-white/80 font-light">
                    اختر نوع التحضير، الحجم، أو درجة التحميص وسيتحدث السعر فوراً
                  </p>
                </div>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="ابحث عن بن، خلطة، عسل، بهارات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 bg-white text-[#5C2A26] placeholder-[#7F3A35]/60 border border-[#C9A45F]/50 rounded-lg text-xs font-alexandria focus:outline-none focus:ring-2 focus:ring-[#F78320]"
                />
                <Search className="w-4 h-4 text-[#F78320] absolute right-3 top-2.5" />
              </div>
            </div>

            {/* Category Navigation Bar (11 Categories exactly as index) */}
            <div className="overflow-x-auto pb-2 scrollbar-thin">
              <div className="flex items-center gap-2 min-w-max">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold font-alexandria flex items-center gap-1.5 transition-all ${
                    selectedCategory === "all"
                      ? "bg-[#F78320] text-white shadow-sm border border-[#F78320]"
                      : "bg-white text-[#5C2A26] border border-[#5C2A26]/15 hover:bg-[#5C2A26]/5"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>جميع الأقسام ({PRODUCTS_CATALOG.length})</span>
                </button>

                {CATEGORIES_LIST.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const count = PRODUCTS_CATALOG.filter(
                    (p) => p.category === cat.id
                  ).length;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold font-alexandria flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? "bg-[#5C2A26] text-white shadow-sm border border-[#C9A45F]"
                          : "bg-white text-[#5C2A26] border border-[#5C2A26]/15 hover:bg-[#5C2A26]/5"
                      }`}
                    >
                      <span className={isSelected ? "text-[#F78320]" : "text-[#7F3A35]"}>
                        {getCategoryIcon(cat.iconName)}
                      </span>
                      <span>{cat.shortName}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-[#5C2A26]/10 text-[#5C2A26]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Category Info Banner */}
            {selectedCategory !== "all" && (
              <div className="p-3 bg-[#5C2A26]/5 rounded-xl border border-[#C9A45F]/30 flex items-center justify-between">
                <div>
                  <h4 className="font-amiri font-bold text-base text-[#5C2A26]">
                    {CATEGORIES_LIST.find((c) => c.id === selectedCategory)?.name}
                  </h4>
                  <p className="font-alexandria text-xs text-[#7F3A35] font-light">
                    {CATEGORIES_LIST.find((c) => c.id === selectedCategory)?.description}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const pageNum =
                      CATEGORIES_LIST.find((c) => c.id === selectedCategory)
                        ?.pageNumber || 3;
                    const pageIdx = Math.min(Math.max(pageNum - 1, 0), PRINTED_MENU_PAGES.length - 1);
                    setLightboxIndex(pageIdx);
                  }}
                  className="text-xs font-alexandria font-bold text-[#F78320] hover:text-[#5C2A26] flex items-center gap-1 shrink-0 p-1.5 rounded-lg hover:bg-white transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">معاينة صفحة المنيو المطبوع</span>
                </button>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5">
              {filteredProducts.map((product) => {
                const currentSelection = getProductSelection(product);
                const { price: currentPrice, label: currentLabel } =
                  calculateProductPrice(product, currentSelection);

                return (
                  <SpotlightCard
                    key={product.id}
                    className="p-4 sm:p-5 bg-white rounded-2xl border border-[#5C2A26]/15 hover:border-[#C9A45F] transition-all shadow-xs flex flex-col justify-between relative group"
                    spotlightColor="rgba(247, 131, 32, 0.12)"
                  >
                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-[#F78320] text-white text-[10px] font-bold font-alexandria px-2.5 py-0.5 rounded-full shadow-2xs z-10">
                        {product.badge}
                      </span>
                    )}

                    <div>
                      {/* Title & Instant Dynamic Price Line */}
                      <div className="flex items-start justify-between gap-3 border-b border-dashed border-[#C9A45F]/30 pb-3 mb-3">
                        <div className="flex-1 pr-1">
                          <h4 className="font-amiri text-lg sm:text-xl font-bold text-[#5C2A26] leading-snug">
                            {product.name}
                          </h4>
                          {product.description && (
                            <p className="font-alexandria text-xs text-[#7F3A35]/80 mt-1 font-light leading-relaxed">
                              {product.description}
                            </p>
                          )}
                        </div>

                        <div className="text-left shrink-0 pl-1">
                          <div className="font-price font-bold text-xl sm:text-2xl text-[#F78320] leading-none">
                            {currentPrice}{" "}
                            <span className="text-xs font-normal text-[#5C2A26]">
                              ج.م
                            </span>
                          </div>
                          <span className="font-alexandria text-[11px] text-[#7F3A35] font-medium block mt-1">
                            {currentLabel}
                          </span>
                        </div>
                      </div>

                      {/* ================= VARIANT CONTROLS (TIERS 1-5) ================= */}

                      {/* Tier 2: Preparation Toggle (ساده / محوج) */}
                      {product.tier === 2 && product.variants && (
                        <div className="my-2.5 p-2 bg-[#FAF7F2] rounded-xl border border-[#5C2A26]/10 flex items-center justify-between gap-2">
                          <span className="text-xs font-bold font-alexandria text-[#5C2A26]">
                            نوع التحضير:
                          </span>
                          <div className="flex items-center gap-1.5">
                            {product.variants.map((v) => {
                              const isSelected =
                                (currentSelection.variantId ||
                                  product.variants?.[0].id) === v.id;
                              return (
                                <button
                                  key={v.id}
                                  onClick={() =>
                                    handleVariantSelect(product, v.id, v.label)
                                  }
                                  className={`px-3 py-1 rounded-lg text-xs font-alexandria font-bold transition-all flex items-center gap-1 ${
                                    isSelected
                                      ? "bg-[#5C2A26] text-white shadow-xs"
                                      : "bg-white text-[#5C2A26] border border-[#5C2A26]/15 hover:bg-[#5C2A26]/10"
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 text-[#F78320]" />}
                                  <span>{v.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Tier 3 & 4: Size / Weight Options Pills */}
                      {(product.tier === 3 || product.tier === 4) &&
                        product.variants && (
                          <div className="my-2.5 p-2 bg-[#FAF7F2] rounded-xl border border-[#5C2A26]/10">
                            <span className="text-[11px] font-bold font-alexandria text-[#7F3A35] block mb-1.5">
                              {product.tier === 3 ? "الحجم المتاح:" : "الوزن / العبوة:"}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {product.variants.map((v) => {
                                const isSelected =
                                  (currentSelection.variantId ||
                                    product.variants?.[0].id) === v.id;
                                return (
                                  <button
                                    key={v.id}
                                    onClick={() =>
                                      handleVariantSelect(product, v.id, v.label)
                                    }
                                    className={`px-2.5 py-1 rounded-lg text-xs font-alexandria font-medium transition-all ${
                                      isSelected
                                        ? "bg-[#5C2A26] text-white shadow-2xs font-bold"
                                        : "bg-white text-[#5C2A26] border border-[#5C2A26]/15 hover:bg-[#5C2A26]/10"
                                    }`}
                                  >
                                    {v.label} ({v.price} ج.م)
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      {/* Tier 5: Matrix (التحميص × العبوة) */}
                      {product.tier === 5 && product.matrix && (
                        <div className="my-2.5 p-2.5 bg-[#FAF7F2] rounded-xl border border-[#5C2A26]/10 space-y-2">
                          {/* Option 1: Roasting Level */}
                          <div>
                            <span className="text-[11px] font-bold font-alexandria text-[#7F3A35] block mb-1">
                              درجة التحميص:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {product.matrix.option1Values.map((roast) => {
                                const isSelected =
                                  (currentSelection.matrixOption1 ||
                                    product.matrix?.option1Values[0]) === roast;
                                return (
                                  <button
                                    key={roast}
                                    onClick={() =>
                                      handleMatrixSelect(
                                        product,
                                        "matrixOption1",
                                        roast
                                      )
                                    }
                                    className={`px-2.5 py-1 rounded-md text-xs font-alexandria font-semibold transition-all ${
                                      isSelected
                                        ? "bg-[#5C2A26] text-white shadow-2xs"
                                        : "bg-white text-[#5C2A26] border border-[#5C2A26]/15 hover:bg-[#5C2A26]/10"
                                    }`}
                                  >
                                    {roast}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Option 2: Package Size */}
                          <div>
                            <span className="text-[11px] font-bold font-alexandria text-[#7F3A35] block mb-1">
                              حجم العبوة:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {product.matrix.option2Values.map((pack) => {
                                const isSelected =
                                  (currentSelection.matrixOption2 ||
                                    product.matrix?.option2Values[0]) === pack;
                                const comboKey = `${
                                  currentSelection.matrixOption1 ||
                                  product.matrix?.option1Values[0]
                                }|${pack}`;
                                const isAvailable =
                                  product.matrix?.prices[comboKey] !== undefined;

                                return (
                                  <button
                                    key={pack}
                                    disabled={!isAvailable}
                                    onClick={() =>
                                      handleMatrixSelect(
                                        product,
                                        "matrixOption2",
                                        pack
                                      )
                                    }
                                    className={`px-2.5 py-1 rounded-md text-xs font-alexandria transition-all ${
                                      isSelected
                                        ? "bg-[#F78320] text-white font-bold shadow-2xs"
                                        : isAvailable
                                        ? "bg-white text-[#5C2A26] border border-[#5C2A26]/15 hover:bg-[#5C2A26]/10 font-medium"
                                        : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-50 text-[11px]"
                                    }`}
                                  >
                                    {pack}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA Action Bar */}
                    <div className="pt-3 mt-2 border-t border-dashed border-[#5C2A26]/10 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[#7F3A35] font-alexandria">
                        متاح للطلب والاستلام الفوري
                      </span>

                      <button
                        onClick={() =>
                          onAddToCart(product, {
                            unit: currentLabel,
                            label: currentLabel,
                            price: currentPrice,
                          })
                        }
                        className="bg-[#F78320] hover:bg-[#e07216] text-white px-4 py-2 rounded-xl text-xs font-bold font-alexandria flex items-center gap-1.5 transition-all shadow-xs hover:shadow-md active:scale-95 shrink-0 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4 text-white" />
                        <span>أضف للسلة</span>
                      </button>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#5C2A26]/15 font-alexandria text-sm text-[#7F3A35]">
                <Coffee className="w-12 h-12 mx-auto text-[#C9A45F] mb-3 opacity-60" />
                لم نجد أي صنف يطابق &quot;{searchQuery}&quot;. يرجى تجربة كلمات بحث أخرى.
              </div>
            )}
          </div>
        )}

        {/* ================= PRINTED MENU GALLERY (1-7) ================= */}
        {activeTab === "printed" && (
          <div className="space-y-5 animate-fadeIn">
            <p className="text-center font-alexandria text-xs md:text-sm text-[#7F3A35]">
              اضغط على أي صفحة لمشاهدتها بالحجم الكامل ومعاينة كافة الأسعار والأصناف كما هي في المحل.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {PRINTED_MENU_PAGES.map((page, index) => (
                <div
                  key={page.id}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative rounded-2xl border-2 border-[#5C2A26]/20 overflow-hidden bg-white shadow-xs cursor-pointer hover:border-[#C9A45F] hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[3/4] w-full bg-[#1A110B]">
                    <Image
                      src={page.src}
                      alt={page.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-alexandria text-xs font-bold gap-2">
                      <ZoomIn className="w-5 h-5 text-[#F78320]" />
                      <span>انقر للتكبير والمعاينة</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white border-t border-[#5C2A26]/10 flex items-center justify-between">
                    <span className="font-alexandria font-bold text-xs text-[#5C2A26]">
                      صفحة {page.id}: {page.title}
                    </span>
                    <ZoomIn className="w-4 h-4 text-[#F78320] group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL WITH NEXT / PREV CAROUSEL */}
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[92vh] bg-[#1A110A] border-2 border-[#C9A45F] rounded-2xl p-4 overflow-hidden flex flex-col items-center shadow-2xl"
          >
            {/* Lightbox Header Controls */}
            <div className="w-full flex items-center justify-between border-b border-dashed border-[#C9A45F]/30 pb-3 mb-3 text-white">
              <div className="flex items-center gap-2">
                <span className="bg-[#F78320] text-white font-bold px-2.5 py-0.5 rounded-md text-xs font-price">
                  {lightboxIndex + 1} / {PRINTED_MENU_PAGES.length}
                </span>
                <h4 className="font-amiri text-lg text-[#C9A45F] font-bold">
                  {PRINTED_MENU_PAGES[lightboxIndex].title}
                </h4>
              </div>

              <button
                onClick={() => setLightboxIndex(null)}
                className="bg-white/10 hover:bg-white/20 text-[#FAF8F5] p-2 rounded-lg transition-colors border border-white/20"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Image View with Navigation Buttons */}
            <div className="relative w-full h-[72vh] flex items-center justify-center bg-black/40 rounded-xl overflow-hidden">
              {/* Previous Page Button */}
              <button
                onClick={handlePrevPage}
                className="absolute right-3 z-30 bg-[#1A110A]/80 hover:bg-[#F78320] text-white p-3 rounded-full border border-[#C9A45F]/40 transition-all shadow-md active:scale-95"
                title="الصفحة السابقة"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* High-res Image */}
              <div className="relative w-full h-full">
                <Image
                  src={PRINTED_MENU_PAGES[lightboxIndex].src}
                  alt={PRINTED_MENU_PAGES[lightboxIndex].title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Next Page Button */}
              <button
                onClick={handleNextPage}
                className="absolute left-3 z-30 bg-[#1A110A]/80 hover:bg-[#F78320] text-white p-3 rounded-full border border-[#C9A45F]/40 transition-all shadow-md active:scale-95"
                title="الصفحة التالية"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Page Indicator Thumbnails */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto max-w-full pb-1">
              {PRINTED_MENU_PAGES.map((pg, idx) => (
                <button
                  key={pg.id}
                  onClick={() => setLightboxIndex(idx)}
                  className={`px-3 py-1 rounded-md text-xs font-alexandria font-bold transition-all ${
                    lightboxIndex === idx
                      ? "bg-[#F78320] text-white shadow-xs"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  صفحة {pg.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

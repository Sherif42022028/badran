"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  CATEGORIES_LIST,
  PRODUCTS_CATALOG,
  PRINTED_MENU_PAGES,
} from "@/data/products";
import { Product, SelectedProductOptions } from "@/types/products";
import { calculateProductPrice, isProductEligibleForGrams } from "@/lib/pricing";
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
  Check,
  Scale,
  Plus,
  Minus,
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
  const [selectedCategory, setSelectedCategory] = useState<string>("basics");
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

  const handleVariantSelect = (
    product: Product,
    variantId: string,
    variantLabel: string
  ) => {
    setProductOptions((prev) => ({
      ...prev,
      [product.id]: {
        ...prev[product.id],
        variantId,
        variantLabel,
      },
    }));
  };

  const handleGramsSelect = (product: Product, customGrams: number) => {
    const current = getProductSelection(product);
    setProductOptions((prev) => ({
      ...prev,
      [product.id]: {
        ...current,
        customGrams,
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
      default:
        return <Coffee className="w-4 h-4" />;
    }
  };

  // Filtered categories to display
  const categoriesToDisplay = useMemo(() => {
    if (searchQuery.trim()) {
      return CATEGORIES_LIST;
    }
    return CATEGORIES_LIST.filter((c) => c.id === selectedCategory);
  }, [selectedCategory, searchQuery]);

  return (
    <section id="menu" className="py-6 md:py-10 px-3 sm:px-4 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="text-center mb-8">
        <span className="solid-badge text-xs md:text-sm mb-2 py-1 px-4">
          <span>قائمة أسعار بن بدران (Budran Coffee)</span>
        </span>
        <h2 className="font-amiri text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A110B] mt-2">
          منيو الأصناف والمنتجات التراثية
        </h2>
        <p className="font-alexandria text-xs sm:text-sm text-[#1A110A]/75 max-w-2xl mx-auto mt-2 font-light leading-relaxed">
          نفس تقسيم وفهرس الـ PDF المطبوع بالكامل (الأقسام الـ 9 الأساسية) مع نظام حساب السعر الفوري.
        </p>

        {/* Mode Switcher Tabs */}
        <div className="inline-flex p-1 bg-[#1A110A]/5 rounded-xl mt-4 border border-[#C5A059]/30">
          <button
            onClick={() => setActiveTab("digital")}
            className={`px-5 py-2 rounded-lg font-alexandria text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === "digital"
                ? "bg-[#1A110B] text-[#FAF8F5] shadow-xs"
                : "text-[#1A110B] hover:bg-[#1A110B]/10"
            }`}
          >
            <Grid className="w-4 h-4 text-[#C5A059]" />
            <span>جدول الأسعار الرقمي (9 أقسام)</span>
          </button>
          <button
            onClick={() => setActiveTab("printed")}
            className={`px-5 py-2 rounded-lg font-alexandria text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === "printed"
                ? "bg-[#1A110B] text-[#FAF8F5] shadow-xs"
                : "text-[#1A110B] hover:bg-[#1A110B]/10"
            }`}
          >
            <FileText className="w-4 h-4 text-[#C5A059]" />
            <span>معرض المنيو المطبوع (1-7)</span>
          </button>
        </div>
      </div>

      {/* ================= DIGITAL MENU LEDGER TABLE ================= */}
      {activeTab === "digital" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Quick Category Navigation & Search */}
          <div className="p-4 bg-white rounded-2xl border border-[#C5A059]/40 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold font-alexandria text-[#1A110B]">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>فهرس الأقسام (اضغط للفلترة السريعة):</span>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="ابحث عن أي نوع بن أو صنف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 bg-[#F7F4EF] text-[#1A110B] placeholder-[#1A110B]/50 border border-[#1A110B]/15 rounded-lg text-xs font-alexandria focus:outline-none focus:border-[#C5A059]"
                />
                <Search className="w-4 h-4 text-[#C5A059] absolute right-3 top-2.5" />
              </div>
            </div>

            {/* Category Navigation Pills */}
            <div className="overflow-x-auto pb-1 scrollbar-thin">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 min-w-max">
                {CATEGORIES_LIST.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-alexandria flex items-center gap-1.5 transition-all ${
                      selectedCategory === cat.id
                        ? "bg-[#1A110B] text-white shadow-xs"
                        : "bg-[#F7F4EF] text-[#1A110B] hover:bg-[#1A110B]/10 border border-[#1A110B]/10"
                    }`}
                  >
                    <span className="text-[#C5A059]">
                      {getCategoryIcon(cat.iconName)}
                    </span>
                    <span>{cat.shortName}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ================= 9 SECTIONS AS IN PDF ================= */}
          {categoriesToDisplay.map((cat) => {
            const q = searchQuery.toLowerCase().trim();
            const sectionItems = PRODUCTS_CATALOG.filter((item) => {
              if (item.category !== cat.id) return false;
              if (!q) return true;
              return (
                item.name.toLowerCase().includes(q) ||
                (item.description && item.description.toLowerCase().includes(q)) ||
                (item.badge && item.badge.toLowerCase().includes(q))
              );
            });

            if (sectionItems.length === 0) return null;

            return (
              <div
                key={cat.id}
                id={cat.id}
                className="framed-section p-5 sm:p-7 md:p-8 bg-white"
              >
                {/* Section Header Solid Badge */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-dashed border-[#C5A059]/40 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="solid-badge text-sm md:text-base py-1.5 px-4 font-amiri font-bold">
                      <span className="text-[#C5A059]">
                        {getCategoryIcon(cat.iconName)}
                      </span>
                      <span>{cat.name}</span>
                    </span>
                    <span className="text-xs text-[#1A110A]/60 font-alexandria font-semibold">
                      ({sectionItems.length} صنف)
                    </span>
                  </div>

                  <p className="font-alexandria text-xs text-[#1A110A]/70 font-light max-w-md text-right">
                    {cat.description}
                  </p>
                </div>

                {/* Section Product Cards / Ledger Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {sectionItems.map((product) => {
                    const currentSelection = getProductSelection(product);
                    const { price: currentPrice, label: currentLabel } =
                      calculateProductPrice(product, currentSelection);

                    return (
                      <SpotlightCard
                        key={product.id}
                        className={`p-4 bg-white rounded-xl border border-[#1A110A]/15 hover:border-[#C5A059] transition-all shadow-xs flex flex-col justify-between relative ${
                          product.badge ? "pt-7" : ""
                        }`}
                        spotlightColor="rgba(197, 160, 89, 0.18)"
                      >
                        {/* Heritage Ribbon Badge */}
                        {product.badge && (
                          <span className="absolute top-2.5 right-3 heritage-ribbon text-[10px] z-10 shadow-2xs">
                            {product.badge}
                          </span>
                        )}

                        <div>
                          {/* Name & Dynamic Price Line */}
                          <div className="flex items-start justify-between gap-3 border-b border-dashed border-[#C5A059]/30 pb-2.5 mb-2.5">
                            <div className="flex-1">
                              <h4 className="font-amiri text-xl font-bold text-[#1A110A]">
                                {product.name}
                              </h4>
                              {product.description && (
                                <p className="font-alexandria text-xs text-[#1A110A]/75 mt-1 font-light leading-relaxed">
                                  {product.description}
                                </p>
                              )}
                            </div>

                            <div className="text-left shrink-0 pl-1">
                              <div className="font-price font-bold text-xl text-[#C5A059]">
                                {currentPrice}{" "}
                                <span className="text-xs text-[#1A110A]">ج.م</span>
                              </div>
                              <span className="font-alexandria text-[11px] text-[#1A110A]/70 font-semibold block mt-0.5">
                                {currentLabel}
                              </span>
                            </div>
                          </div>

                          {/* ================= DYNAMIC VARIANT CONTROLS ================= */}

                          {/* Tier 1 with Grams Selection (Items sold by weight/kilo) */}
                          {product.tier === 1 && isProductEligibleForGrams(product) && (
                            <div className="my-2 p-2 bg-[#F7F4EF] rounded-lg border border-[#1A110A]/10 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold font-alexandria text-[#1A110A] flex items-center gap-1.5">
                                  <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
                                  <span>تحديد الوزن بالجرام:</span>
                                </span>
                                <span className="text-[10px] font-bold font-price text-[#C5A059] bg-[#1A110A] px-2 py-0.5 rounded">
                                  {currentSelection.customGrams || 250} جم
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-1">
                                {[
                                  { label: "ثمن (125جم)", g: 125 },
                                  { label: "ربع (250جم)", g: 250 },
                                  { label: "نصف (500جم)", g: 500 },
                                  { label: "كيلو (1000جم)", g: 1000 },
                                ].map((w) => {
                                  const isSelected =
                                    (currentSelection.customGrams || 250) === w.g;
                                  return (
                                    <button
                                      key={w.g}
                                      onClick={() => handleGramsSelect(product, w.g)}
                                      className={`px-2 py-0.5 rounded text-[11px] font-alexandria font-semibold transition-all ${
                                        isSelected
                                          ? "bg-[#1A110A] text-[#FAF8F5]"
                                          : "bg-white text-[#1A110A] hover:bg-[#1A110A]/10 border border-[#1A110A]/10"
                                      }`}
                                    >
                                      {w.label}
                                    </button>
                                  );
                                })}

                                <div className="inline-flex items-center gap-1 bg-white border border-[#1A110A]/20 rounded px-1.5 py-0.5">
                                  <input
                                    type="number"
                                    min="25"
                                    max="5000"
                                    step="25"
                                    placeholder="جرام"
                                    value={currentSelection.customGrams || 250}
                                    onChange={(e) =>
                                      handleGramsSelect(
                                        product,
                                        Math.max(25, Number(e.target.value) || 25)
                                      )
                                    }
                                    className="w-12 text-center text-[11px] font-price font-bold text-[#1A110A] focus:outline-none"
                                  />
                                  <span className="text-[10px] text-[#1A110A]/60">جم</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Tier 2: Preparation Toggle (ساده / محوج) + Grams Selection */}
                          {product.tier === 2 && product.variants && (
                            <div className="my-2 space-y-2">
                              {/* Preparation Toggle */}
                              <div className="p-2 bg-[#F7F4EF] rounded-lg border border-[#1A110A]/10 flex items-center justify-between gap-2">
                                <span className="text-[11px] font-bold font-alexandria text-[#1A110A]">
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
                                        className={`px-3 py-1 rounded-md text-xs font-alexandria font-bold transition-all flex items-center gap-1 ${
                                          isSelected
                                            ? "bg-[#1A110A] text-[#FAF8F5] shadow-xs"
                                            : "bg-white text-[#1A110A] border border-[#1A110A]/15 hover:bg-[#1A110A]/5"
                                        }`}
                                      >
                                        {isSelected && (
                                          <Check className="w-3 h-3 text-[#C5A059]" />
                                        )}
                                        <span>{v.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Grams / Weight Selection Scale with Stepper and Range Slider */}
                              <div className="p-2 bg-[#F7F4EF] rounded-lg border border-[#1A110A]/10 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold font-alexandria text-[#1A110A] flex items-center gap-1.5">
                                    <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
                                    <span>تحديد الوزن بالجرام:</span>
                                  </span>
                                  <span className="text-[10px] font-bold font-price text-[#C5A059] bg-[#1A110A] px-2 py-0.5 rounded">
                                    {currentSelection.customGrams || 250} جم
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-1">
                                  {[
                                    { label: "ثمن (125جم)", g: 125 },
                                    { label: "ربع (250جم)", g: 250 },
                                    { label: "نصف (500جم)", g: 500 },
                                    { label: "كيلو (1000جم)", g: 1000 },
                                  ].map((w) => {
                                    const isSelected =
                                      (currentSelection.customGrams || 250) === w.g;
                                    return (
                                      <button
                                        key={w.g}
                                        onClick={() => handleGramsSelect(product, w.g)}
                                        className={`px-2 py-0.5 rounded text-[11px] font-alexandria font-semibold transition-all ${
                                          isSelected
                                            ? "bg-[#1A110A] text-[#FAF8F5]"
                                            : "bg-white text-[#1A110A] hover:bg-[#1A110A]/10 border border-[#1A110A]/10"
                                        }`}
                                      >
                                        {w.label}
                                      </button>
                                    );
                                  })}

                                  {/* Custom input */}
                                  <div className="inline-flex items-center gap-1 bg-white border border-[#1A110A]/20 rounded px-1.5 py-0.5">
                                    <input
                                      type="number"
                                      min="25"
                                      max="5000"
                                      step="25"
                                      placeholder="جرام"
                                      value={currentSelection.customGrams || 250}
                                      onChange={(e) =>
                                        handleGramsSelect(
                                          product,
                                          Math.max(25, Number(e.target.value) || 25)
                                        )
                                      }
                                      className="w-12 text-center text-[11px] font-price font-bold text-[#1A110A] focus:outline-none"
                                    />
                                    <span className="text-[10px] text-[#1A110A]/60">جم</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Tier 4: Weight & Packaging Pills + Optional Custom Grams */}
                          {product.tier === 4 && product.variants && (
                            <div className="my-2 p-2 bg-[#F7F4EF] rounded-lg border border-[#1A110A]/10 space-y-2">
                              <div>
                                <span className="text-[11px] font-bold font-alexandria text-[#1A110A]/80 block mb-1">
                                  اختر العبوة أو الوزن:
                                </span>
                                <div className="flex flex-wrap gap-1">
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
                                        className={`px-2.5 py-1 rounded text-xs font-alexandria font-semibold transition-all ${
                                          isSelected
                                            ? "bg-[#1A110A] text-[#FAF8F5]"
                                            : "bg-white text-[#1A110A] hover:bg-[#1A110A]/10 border border-[#1A110A]/10"
                                        }`}
                                      >
                                        {v.label} ({v.price} ج.م)
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Custom grams for bulk items */}
                              {isProductEligibleForGrams(product) && (
                                <div className="pt-1.5 border-t border-dashed border-[#1A110A]/10 flex items-center justify-between gap-2">
                                  <span className="text-[11px] font-bold font-alexandria text-[#1A110A] flex items-center gap-1">
                                    <Scale className="w-3 h-3 text-[#C5A059]" />
                                    <span>أو اكتب الجرامات:</span>
                                  </span>
                                  <div className="inline-flex items-center gap-1 bg-white border border-[#1A110A]/20 rounded px-1.5 py-0.5">
                                    <input
                                      type="number"
                                      min="25"
                                      max="5000"
                                      step="25"
                                      placeholder="جرام"
                                      value={currentSelection.customGrams || 250}
                                      onChange={(e) =>
                                        handleGramsSelect(
                                          product,
                                          Math.max(25, Number(e.target.value) || 25)
                                        )
                                      }
                                      className="w-12 text-center text-[11px] font-price font-bold text-[#1A110A] focus:outline-none"
                                    />
                                    <span className="text-[10px] text-[#1A110A]/60">جم</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Tier 5: Matrix (التحميص × العبوة) */}
                          {product.tier === 5 && product.matrix && (
                            <div className="my-2 p-2.5 bg-[#F7F4EF] rounded-lg border border-[#1A110A]/10 space-y-2">
                              {/* Roasting Option */}
                              <div>
                                <span className="text-[11px] font-bold font-alexandria text-[#1A110A]/80 block mb-1">
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
                                        className={`px-2.5 py-1 rounded text-xs font-alexandria font-bold transition-all ${
                                          isSelected
                                            ? "bg-[#1A110A] text-[#FAF8F5]"
                                            : "bg-white text-[#1A110A] border border-[#1A110A]/15 hover:bg-[#1A110A]/5"
                                        }`}
                                      >
                                        {roast}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Package Option */}
                              <div>
                                <span className="text-[11px] font-bold font-alexandria text-[#1A110A]/80 block mb-1">
                                  العبوة:
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
                                        className={`px-2.5 py-1 rounded text-xs font-alexandria transition-all ${
                                          isSelected
                                            ? "bg-[#C5A059] text-white font-bold"
                                            : isAvailable
                                            ? "bg-white text-[#1A110A] border border-[#1A110A]/15 hover:bg-[#1A110A]/5 font-medium"
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

                        {/* Add to Cart Action */}
                        <div className="pt-2.5 border-t border-dashed border-[#1A110A]/10 flex items-center justify-between gap-2 relative z-10">
                          <span className="text-[11px] text-[#1A110A]/60 font-alexandria">
                            طلب واستلام من المحل
                          </span>

                          <button
                            onClick={() =>
                              onAddToCart(product, {
                                unit: currentLabel,
                                label: currentLabel,
                                price: currentPrice,
                              })
                            }
                            className="bg-[#1A110A] hover:bg-[#2A1D15] text-white px-4 py-1.5 rounded-lg text-xs font-bold font-alexandria flex items-center gap-1.5 transition-all border border-[#C5A059]/30 active:scale-95 shrink-0 cursor-pointer shadow-2xs"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>أضف للسلة</span>
                          </button>
                        </div>
                      </SpotlightCard>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Fallback if search returns nothing */}
          {categoriesToDisplay.length > 0 &&
            PRODUCTS_CATALOG.filter((p) => {
              const q = searchQuery.toLowerCase().trim();
              if (!q) return true;
              return (
                p.name.toLowerCase().includes(q) ||
                (p.description && p.description.toLowerCase().includes(q))
              );
            }).length === 0 && (
              <div className="text-center py-14 bg-white rounded-2xl border border-[#C5A059]/30 font-alexandria text-sm text-[#1A110A]/70">
                لم نجد عناصر تطابق بحثك &quot;{searchQuery}&quot;. يرجى تجربة صنف آخر.
              </div>
            )}
        </div>
      )}

      {/* ================= PRINTED MENU GALLERY (1-7) ================= */}
      {activeTab === "printed" && (
        <div className="space-y-5 animate-fadeIn">
          <p className="text-center font-alexandria text-xs md:text-sm text-[#1A110A]/75">
            اضغط على أي صفحة لمشاهدتها بالحجم الكامل ومعاينة كافة الأسعار والأصناف كما هي في المحل.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {PRINTED_MENU_PAGES.map((page, index) => (
              <div
                key={page.id}
                onClick={() => setLightboxIndex(index)}
                className="group relative rounded-xl border border-[#C5A059]/40 overflow-hidden bg-white shadow-xs cursor-pointer hover:shadow-md transition-all"
              >
                <div className="relative aspect-[3/4] w-full bg-[#1A110B]">
                  <Image
                    src={page.src}
                    alt={page.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-alexandria text-xs font-bold gap-2">
                    <ZoomIn className="w-5 h-5 text-[#C5A059]" />
                    <span>انقر للتكبير والمعاينة</span>
                  </div>
                </div>

                <div className="p-3 bg-white border-t border-[#1A110A]/10 flex items-center justify-between">
                  <span className="font-alexandria font-bold text-xs text-[#1A110A]">
                    صفحة {page.id}: {page.title}
                  </span>
                  <ZoomIn className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL WITH NEXT / PREV CAROUSEL */}
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[92vh] bg-[#1A110A] border border-[#C5A059]/60 rounded-2xl p-4 overflow-hidden flex flex-col items-center shadow-2xl"
          >
            {/* Lightbox Header Controls */}
            <div className="w-full flex items-center justify-between border-b border-dashed border-[#C5A059]/30 pb-3 mb-3 text-white">
              <div className="flex items-center gap-2">
                <span className="bg-[#C5A059] text-white font-bold px-2.5 py-0.5 rounded-md text-xs font-price">
                  {lightboxIndex + 1} / {PRINTED_MENU_PAGES.length}
                </span>
                <h4 className="font-amiri text-lg text-[#C5A059] font-bold">
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
                className="absolute right-3 z-30 bg-[#1A110A]/80 hover:bg-[#C5A059] text-white p-3 rounded-full border border-[#C5A059]/40 transition-all shadow-md active:scale-95"
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
                className="absolute left-3 z-30 bg-[#1A110A]/80 hover:bg-[#C5A059] text-white p-3 rounded-full border border-[#C5A059]/40 transition-all shadow-md active:scale-95"
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
                      ? "bg-[#C5A059] text-white shadow-xs"
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

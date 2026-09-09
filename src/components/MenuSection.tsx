"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  CATEGORIES_LIST,
  PRODUCTS_CATALOG,
} from "@/data/products";
import { Product, SelectedProductOptions } from "@/types/products";
import {
  calculateProductPrice,
  isProductEligibleForGrams,
  getBaseKiloPrice,
  getQuickWeightPresets,
  formatProductSelectionSummary,
} from "@/lib/pricing";
import {
  Search,
  ShoppingBag,
  X,
  ZoomIn,
  Grid,
  FileText,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
  Coffee,
  Leaf,
  CupSoda,
  Globe,
  Sun,
  Check,
  Scale,
  MapPin,
  CheckCircle2,
  ArrowUpDown,
  RotateCcw,
  Plus,
  Minus,
} from "lucide-react";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import PrintedMenuBooklet from "@/components/PrintedMenuBooklet";

interface MenuSectionProps {
  onAddToCart: (
    item: Product,
    selectedPrice: { unit: string; label: string; price: number },
    quantity?: number
  ) => void;
}

type SortOption = "popular" | "price-asc" | "price-desc" | "alpha";

export default function MenuSection({ onAddToCart }: MenuSectionProps) {
  const [activeTab, setActiveTab] = useState<"digital" | "printed">("digital");
  const [selectedCategory, setSelectedCategory] = useState<string>("basics");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  // Track product quantities: { [productId]: quantity }
  const [productQuantities, setProductQuantities] = useState<
    Record<string, number>
  >({});

  const getProductQuantity = (productId: string): number => {
    return productQuantities[productId] || 1;
  };

  const handleUpdateProductQuantity = (productId: string, delta: number) => {
    setProductQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleResetProductQuantity = (productId: string) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: 1,
    }));
  };

  // Track which product has presets view active (default false = Free Weight Slider counter active)
  const [productWeightPresetsView, setProductWeightPresetsView] = useState<
    Record<string, boolean>
  >({});

  // Store selected options for each product: { [productId]: SelectedProductOptions }
  const [productOptions, setProductOptions] = useState<
    Record<string, SelectedProductOptions>
  >({});

  // Helper to initialize or retrieve current selection for a product
  const getProductSelection = (product: Product): SelectedProductOptions => {
    const current = productOptions[product.id];
    if (current) return current;

    if (product.matrix) {
      return {
        matrixOption1: product.matrix.option1Values[0],
        matrixOption2: product.matrix.option2Values[0],
      };
    }

    if (product.tier === 2 && product.variants && product.variants.length > 0) {
      return {
        variantId: product.variants[0].id,
        variantLabel: product.variants[0].label,
        customGrams: 250,
      };
    }

    if (isProductEligibleForGrams(product)) {
      if (product.variants && product.variants.length > 0) {
        return {
          variantId: product.variants[0].id,
          variantLabel: product.variants[0].label,
          customGrams: 250,
        };
      }
      return { customGrams: 250 };
    }

    if (product.variants && product.variants.length > 0) {
      return {
        variantId: product.variants[0].id,
        variantLabel: product.variants[0].label,
      };
    }

    return {};
  };

  const handleVariantSelect = (
    product: Product,
    variantId: string,
    variantLabel: string
  ) => {
    handleResetProductQuantity(product.id);
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
    handleResetProductQuantity(product.id);
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
    handleResetProductQuantity(product.id);
    const current = getProductSelection(product);
    setProductOptions((prev) => ({
      ...prev,
      [product.id]: {
        ...current,
        [optionKey]: value,
      },
    }));
  };

  const toggleWeightView = (productId: string) => {
    setProductWeightPresetsView((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("basics");
    setSortBy("popular");
  };

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedCategory !== "basics" ||
    sortBy !== "popular";

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

  // Filter and sort items
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return PRODUCTS_CATALOG.filter((item) => {
      // Category filter
      if (selectedCategory === "popular") {
        const isPopular =
          Boolean(item.badge) ||
          item.id === "basic-plain-matrix" ||
          item.id === "basic-mohawaj-matrix";
        if (!isPopular) return false;
      } else if (selectedCategory !== "all") {
        if (item.category !== selectedCategory) return false;
      }

      // Search query
      if (q) {
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q) || false;
        const matchBadge = item.badge?.toLowerCase().includes(q) || false;
        if (!matchName && !matchDesc && !matchBadge) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "popular") {
        const aScore = a.badge ? 2 : 1;
        const bScore = b.badge ? 2 : 1;
        return bScore - aScore;
      }
      if (sortBy === "price-asc") {
        const priceA = a.basePrice || a.variants?.[0]?.price || 0;
        const priceB = b.basePrice || b.variants?.[0]?.price || 0;
        return priceA - priceB;
      }
      if (sortBy === "price-desc") {
        const priceA = a.basePrice || a.variants?.[0]?.price || 0;
        const priceB = b.basePrice || b.variants?.[0]?.price || 0;
        return priceB - priceA;
      }
      if (sortBy === "alpha") {
        return a.name.localeCompare(b.name, "ar");
      }
      return 0;
    });
  }, [searchQuery, selectedCategory, sortBy]);

  // Group filtered products by Category
  const groupedCategories = useMemo(() => {
    if (selectedCategory === "popular") {
      return [
        {
          id: "popular",
          name: "ترشيحات واختيارات بدران",
          shortName: "ترشيحات بدران",
          iconName: "Sparkles",
          description: "أصناف بن بدران المختارة بعناية والأعلى ترشيحاً لزبائننا الكرام",
          pageNumber: 3,
          image: "/categories/blends.jpg",
          items: filteredProducts,
        },
      ];
    }

    if (selectedCategory === "all") {
      return CATEGORIES_LIST.map((cat) => ({
        ...cat,
        items: filteredProducts.filter((p) => p.category === cat.id),
      })).filter((cat) => cat.items.length > 0);
    }

    const currentCat = CATEGORIES_LIST.find((c) => c.id === selectedCategory);
    if (!currentCat) return [];

    return [
      {
        ...currentCat,
        items: filteredProducts.filter((p) => p.category === currentCat.id),
      },
    ];
  }, [selectedCategory, filteredProducts]);

  return (
    <section id="menu" className="py-6 md:py-12 px-3 sm:px-5 max-w-7xl mx-auto">
      {/* ================= 1. RESTRUCTURED SECTION HEADER ================= */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="font-amiri text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A110B] leading-snug">
          منيو بن بدران — اختار البن، الوزن، وطريقة التحميص
        </h2>
        <p className="font-alexandria text-xs sm:text-sm text-[#1A110B]/80 max-w-2xl mx-auto mt-2 font-light leading-relaxed">
          بن طازة محمص ومطحون عند الطلب، مع إمكانية اختيار التحميص والوزن واستلام
          الطلب من المحل.
        </p>

        {/* 3-Information Ticker Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-alexandria font-semibold text-[#1A110B]">
          <div className="inline-flex items-center gap-1.5 bg-white/90 border border-[#C5A059]/40 py-1 px-3 rounded-full shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>الأسعار محدثة</span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-white/90 border border-[#C5A059]/40 py-1 px-3 rounded-full shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>الطحن حسب الطلب</span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-white/90 border border-[#C5A059]/40 py-1 px-3 rounded-full shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>الاستلام من فرع ميت غمر</span>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="inline-flex p-1 bg-[#1A110A]/5 rounded-xl mt-5 border border-[#C5A059]/30 shadow-2xs">
          <button
            onClick={() => setActiveTab("digital")}
            className={`px-4 sm:px-5 py-2 rounded-lg font-alexandria text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "digital"
                ? "bg-[#1A110B] text-[#FAF8F5] shadow-xs"
                : "text-[#1A110B] hover:bg-[#1A110B]/10"
            }`}
          >
            <Grid className="w-4 h-4 text-[#C5A059]" />
            <span>المنيو الرقمي التفاعلي</span>
          </button>
          <button
            onClick={() => setActiveTab("printed")}
            className={`px-4 sm:px-5 py-2 rounded-lg font-alexandria text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "printed"
                ? "bg-[#1A110B] text-[#FAF8F5] shadow-xs"
                : "text-[#1A110B] hover:bg-[#1A110B]/10"
            }`}
          >
            <FileText className="w-4 h-4 text-[#C5A059]" />
            <span>كتالوج ومنيو بن بدران المطبوع</span>
          </button>
        </div>
      </div>

      {/* ================= DIGITAL MENU LEDGER ================= */}
      {activeTab === "digital" && (
        <div className="space-y-6 md:space-y-8 animate-fadeIn">
          {/* ================= 2. BROWSING CONTROLS CONTAINER ================= */}
          <div className="bg-white rounded-2xl border border-[#C5A059]/40 p-4 sm:p-5 shadow-xs space-y-3.5">
            {/* Search Bar */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن أي نوع بن أو صنف (مثال: ساده، محوج، كافيه، حبهان...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-[#FAF8F5] text-[#1A110B] placeholder-[#1A110B]/50 border border-[#1A110B]/15 rounded-xl text-xs sm:text-sm font-alexandria focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all"
              />
              <Search className="w-4 h-4 text-[#C5A059] absolute right-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-3 p-0.5 text-gray-400 hover:text-[#1A110B] rounded-full transition-colors cursor-pointer"
                  aria-label="مسح البحث"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* الصف الأول: الأقسام الرئيسية فقط */}
            <div className="pt-2 border-t border-dashed border-[#1A110B]/10 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold font-alexandria text-[#1A110B]">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>القسم:</span>
              </div>
              <div className="overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin">
                <div className="flex items-center gap-1.5 min-w-max">
                  {/* All button */}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-alexandria transition-all cursor-pointer ${
                      selectedCategory === "all"
                        ? "bg-[#1A110B] text-white shadow-xs ring-1 ring-[#C5A059]"
                        : "bg-[#FAF8F5] text-[#1A110B] hover:bg-[#1A110B]/10 border border-[#1A110B]/10"
                    }`}
                  >
                    <span>كل الأقسام</span>
                  </button>

                  {/* Badran's Recommendations */}
                  <button
                    onClick={() => setSelectedCategory("popular")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-alexandria flex items-center gap-1.5 transition-all cursor-pointer ${
                      selectedCategory === "popular"
                        ? "bg-[#C5A059] text-white shadow-xs"
                        : "bg-[#FAF8F5] text-[#1A110B] hover:bg-[#C5A059]/10 border border-[#C5A059]/40"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059] group-hover:text-white" />
                    <span>ترشيحات بدران</span>
                  </button>

                  {/* 9 Categories in order */}
                  {CATEGORIES_LIST.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-alexandria flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#1A110B] text-white shadow-xs ring-1 ring-[#C5A059]"
                            : "bg-[#FAF8F5] text-[#1A110B] hover:bg-[#1A110B]/10 border border-[#1A110B]/10"
                        }`}
                      >
                        <span className="text-[#C5A059]">
                          {getCategoryIcon(cat.iconName)}
                        </span>
                        <span>{cat.shortName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* الصف الثاني: الترتيب وعدد النتائج */}
            <div className="pt-2 border-t border-dashed border-[#1A110B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-alexandria">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">
                  عرض{" "}
                  <strong className="text-[#1A110B] font-bold">
                    {filteredProducts.length}
                  </strong>{" "}
                  صنف
                </span>

                {isFiltered && (
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100/70 border border-red-200 px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>إعادة ضبط العرض</span>
                  </button>
                )}
              </div>

              {/* Sorting options */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-[#1A110B]/80 font-bold flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>ترتيب النتائج:</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-[#FAF8F5] text-[#1A110B] border border-[#1A110B]/15 rounded-lg py-1 px-2 text-xs font-alexandria font-semibold focus:outline-none focus:border-[#C5A059] cursor-pointer"
                >
                  <option value="popular">ترشيحات بدران أولاً</option>
                  <option value="price-asc">الأقل سعراً أولاً</option>
                  <option value="price-desc">الأعلى سعراً أولاً</option>
                  <option value="alpha">أبجدياً (أ - ي)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ================= 3. SECTIONS & STANDARDIZED PRODUCT CARDS ================= */}
          {groupedCategories.map((cat) => {
            if (cat.items.length === 0 && cat.id !== "custom_blend") return null;

            return (
              <div
                key={cat.id}
                id={cat.id}
                className="framed-section p-4 sm:p-6 md:p-8 bg-white"
              >
                {/* Category Hero Banner with Representing Photo */}
                {cat.image ? (
                  <div className="relative overflow-hidden rounded-2xl mb-6 shadow-md border border-[#C5A059]/40 h-44 sm:h-52 md:h-64 group bg-[#1A110B]">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                    />
                    {/* Rich gradient overlays for luxury contrast and legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A110B] via-[#1A110B]/60 to-black/25" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1A110B]/20 to-[#1A110B]/85" />

                    {/* Banner Content */}
                    <div className="absolute inset-0 p-4 sm:p-6 md:p-7 flex flex-col justify-end text-right z-10">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-alexandria bg-[#C5A059] text-[#1A110B] shadow-xs">
                          {getCategoryIcon(cat.iconName)}
                          <span>{cat.shortName || cat.name}</span>
                        </span>
                        <span className="text-[11px] sm:text-xs font-bold font-alexandria px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs border border-white/20">
                          {cat.items.length} أصناف متوفرة
                        </span>
                      </div>

                      <h3 className="font-amiri text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-md leading-tight">
                        {cat.name}
                      </h3>

                      <p className="font-alexandria text-xs sm:text-sm text-[#FAF8F5]/90 max-w-2xl leading-relaxed mt-1.5 font-light line-clamp-2 sm:line-clamp-none drop-shadow-sm">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Fallback Header */
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-dashed border-[#C5A059]/40 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="solid-badge text-sm md:text-base py-1.5 px-4 font-amiri font-bold">
                        <span className="text-[#C5A059]">
                          {getCategoryIcon(cat.iconName)}
                        </span>
                        <span>{cat.name}</span>
                      </span>
                      <span className="text-xs text-[#1A110A]/60 font-alexandria font-semibold">
                        ({cat.items.length} صنف)
                      </span>
                    </div>

                    <p className="font-alexandria text-xs text-[#1A110A]/70 font-light max-w-md text-right">
                      {cat.description}
                    </p>
                  </div>
                )}

                  {/* 2-Column Responsive Product Card Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {cat.items.map((product) => {
                      const currentSelection = getProductSelection(product);
                      const { price: currentPrice, label: currentLabel } =
                        calculateProductPrice(product, currentSelection);
                      const productQuantity = getProductQuantity(product.id);
                      const lineTotalPrice = currentPrice * productQuantity;
                      const baseKilo = getBaseKiloPrice(product, currentSelection);
                      const weightPresets = isProductEligibleForGrams(product)
                        ? getQuickWeightPresets(product, currentSelection)
                        : [];
                      const summaryText = formatProductSelectionSummary(
                        product,
                        currentSelection
                      );
                      const isPresetsView =
                        productWeightPresetsView[product.id] || false;

                    return (
                      <SpotlightCard
                        key={product.id}
                        className="p-4 sm:p-5 bg-white rounded-2xl border border-[#1A110A]/15 hover:border-[#C5A059] transition-all shadow-xs flex flex-col justify-between relative"
                        spotlightColor="rgba(197, 160, 89, 0.16)"
                      >
                        {/* ================= PART 1: BADGE ================= */}
                        {product.badge && (
                          <span className="absolute top-3 right-3 heritage-ribbon text-[11px] z-10 shadow-2xs font-alexandria">
                            {product.badge}
                          </span>
                        )}

                        <div className={product.badge ? "pt-5" : ""}>
                          {/* ================= PART 2: PRODUCT NAME ================= */}
                          <h4 className="font-amiri text-xl sm:text-2xl font-bold text-[#1A110A] leading-tight">
                            {product.name}
                          </h4>

                          {/* ================= PART 3: DESCRIPTION ================= */}
                          {product.description && (
                            <p className="font-alexandria text-xs text-[#1A110A]/75 mt-1.5 font-light leading-relaxed line-clamp-2">
                              {product.description}
                            </p>
                          )}

                          {/* ================= PART 4: DYNAMIC PRICE & REFERENCE ================= */}
                          <div className="flex items-baseline justify-between border-b border-dashed border-[#C5A059]/30 pb-2.5 my-2.5">
                            <div>
                              <div className="font-price font-bold text-2xl text-[#C5A059] leading-none">
                                {currentPrice}{" "}
                                <span className="text-xs font-alexandria text-[#1A110A]">
                                  ج.م
                                </span>
                              </div>
                              <span className="font-alexandria text-xs text-[#1A110A]/70 font-semibold block mt-1">
                                {currentLabel}
                              </span>
                            </div>

                            {baseKilo && (
                              <div className="text-left text-xs text-[#1A110A]/55 font-alexandria">
                                <span>{baseKilo.label}: </span>
                                <strong className="font-price text-sm text-[#1A110A]/75">
                                  {baseKilo.price} ج.م
                                </strong>
                              </div>
                            )}
                          </div>

                          {/* ================= PART 5: CUSTOMIZATION CONTROLS ================= */}

                          {/* 5A. Matrix Products: (بن ساده & بن محوج) */}
                          {product.tier === 5 && product.matrix && (
                            <div className="my-2.5 p-3 bg-[#FAF8F5] rounded-xl border border-[#1A110A]/10 space-y-2.5">
                              {/* Roasting Options */}
                              <div>
                                <span className="text-xs font-bold font-alexandria text-[#1A110A]/80 block mb-1">
                                  درجة التحميص:
                                </span>
                                <div className="grid grid-cols-4 gap-1.5">
                                  {product.matrix.option1Values.map((roast) => {
                                    const isSelected =
                                      (currentSelection.matrixOption1 ||
                                        product.matrix?.option1Values[0]) ===
                                      roast;
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
                                        className={`py-1.5 px-2 rounded-lg text-xs font-alexandria font-bold transition-all cursor-pointer text-center ${
                                          isSelected
                                            ? "bg-[#1A110B] text-[#FAF8F5] shadow-xs ring-1 ring-[#C5A059]"
                                            : "bg-white text-[#1A110A] border border-[#1A110A]/15 hover:bg-[#1A110A]/5"
                                        }`}
                                      >
                                        {roast}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Packaging Options */}
                              <div>
                                <span className="text-xs font-bold font-alexandria text-[#1A110A]/80 block mb-1">
                                  نوع العبوة والحجم:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {product.matrix.option2Values.map((pack) => {
                                    const isSelected =
                                      (currentSelection.matrixOption2 ||
                                        product.matrix?.option2Values[0]) ===
                                      pack;
                                    const comboKey = `${
                                      currentSelection.matrixOption1 ||
                                      product.matrix?.option1Values[0]
                                    }|${pack}`;
                                    const comboPrice =
                                      product.matrix?.prices[comboKey];
                                    const isAvailable = comboPrice !== undefined;

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
                                        className={`px-2.5 py-1.5 rounded-lg text-xs font-alexandria transition-all flex items-center gap-1 cursor-pointer ${
                                          isSelected
                                            ? "bg-[#C5A059] text-white font-bold shadow-xs"
                                            : isAvailable
                                            ? "bg-white text-[#1A110A] border border-[#1A110A]/15 hover:bg-[#1A110A]/5 font-medium"
                                            : "bg-gray-100 text-gray-400 border border-gray-200 opacity-50 cursor-not-allowed text-[11px]"
                                        }`}
                                      >
                                        <span>{pack}</span>
                                        {comboPrice && (
                                          <span className="font-price text-[10px] opacity-85">
                                            ({comboPrice} ج.م)
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 5B. Variants Selector (Preparation for Tier 2 OR Espresso Concentrations) */}
                          {product.variants &&
                            product.variants.length > 0 &&
                            isProductEligibleForGrams(product) && (
                              <div className="my-2.5 p-2.5 bg-[#FAF8F5] rounded-xl border border-[#1A110A]/10 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold font-alexandria text-[#1A110A]">
                                    {product.id === "blend-espresso-custom"
                                      ? "تركيز ونوع الاسبريسو:"
                                      : "نوع التحضير:"}
                                  </span>
                                  {product.id === "blend-espresso-custom" && (
                                    <span className="text-[10px] font-alexandria text-[#C5A059] font-bold">
                                      (اختر التركيز المطلوب)
                                    </span>
                                  )}
                                </div>
                                <div
                                  className={
                                    product.variants.length === 3
                                      ? "grid grid-cols-1 sm:grid-cols-3 gap-1.5"
                                      : product.variants.length > 2
                                      ? "grid grid-cols-1 sm:grid-cols-2 gap-1.5"
                                      : "flex items-center gap-1.5"
                                  }
                                >
                                  {product.variants.map((v) => {
                                    const isSelected =
                                      (currentSelection.variantId ||
                                        product.variants?.[0].id) === v.id;
                                    return (
                                      <button
                                        key={v.id}
                                        type="button"
                                        onClick={() =>
                                          handleVariantSelect(
                                            product,
                                            v.id,
                                            v.label
                                          )
                                        }
                                        className={`px-3 py-1.5 rounded-lg text-xs font-alexandria font-bold transition-all flex items-center justify-between gap-1.5 cursor-pointer border ${
                                          isSelected
                                            ? "bg-[#1A110B] text-[#FAF8F5] border-[#C5A059] shadow-xs ring-1 ring-[#C5A059]"
                                            : "bg-white text-[#1A110A] border border-[#1A110A]/15 hover:bg-[#1A110A]/5"
                                        }`}
                                      >
                                        <div className="flex items-center gap-1">
                                          {isSelected && (
                                            <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                                          )}
                                          <span>
                                            {v.label.replace(/\s*\(كيلو\)/, "")}
                                          </span>
                                        </div>
                                        {product.id === "blend-espresso-custom" && (
                                          <span
                                            className={`font-price text-[11px] font-bold shrink-0 ${
                                              isSelected
                                                ? "text-[#C5A059]"
                                                : "text-[#1A110A]/65"
                                            }`}
                                          >
                                            {v.price} ج.م
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                          {/* 5C. Weighted Products: Free Weight Slider Counter & Presets */}
                          {isProductEligibleForGrams(product) &&
                            product.id !== "basic-plain-matrix" &&
                            product.id !== "basic-mohawaj-matrix" && (
                              <div className="my-2.5 p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 space-y-2.5 shadow-2xs">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5 font-bold text-xs font-alexandria text-[#1A110A]">
                                    <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
                                    <span>
                                      {!isPresetsView
                                        ? "أو اكتب الجرامات يدوياً (حسب رغبتك):"
                                        : "اختار الوزن المطلوب:"}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => toggleWeightView(product.id)}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-alexandria font-bold transition-all cursor-pointer bg-white border border-[#1A110A]/20 hover:border-[#C5A059] text-[#1A110A] shadow-2xs"
                                  >
                                    {!isPresetsView
                                      ? "الأوزان السريعة"
                                      : "تفعيل الوزن الحر"}
                                  </button>
                                </div>

                                {!isPresetsView ? (
                                  /* Free Weight Slider View matching user's screenshot */
                                  <div className="space-y-2 pt-0.5 animate-fadeIn">
                                    <div className="flex items-center gap-2">
                                      {/* Minus button on the right (RTL) */}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleGramsSelect(
                                            product,
                                            Math.max(
                                              50,
                                              (currentSelection.customGrams || 250) - 25
                                            )
                                          )
                                        }
                                        className="w-8 h-8 flex items-center justify-center bg-white border border-[#1A110A]/20 rounded-xl hover:bg-[#1A110A]/5 text-[#1A110A] transition-all shrink-0 cursor-pointer shadow-2xs"
                                        title="تقليل 25 جرام"
                                      >
                                        <Minus className="w-3.5 h-3.5" />
                                      </button>

                                      {/* Range slider */}
                                      <input
                                        type="range"
                                        min="50"
                                        max="2000"
                                        step="25"
                                        value={currentSelection.customGrams || 250}
                                        onChange={(e) =>
                                          handleGramsSelect(
                                            product,
                                            Number(e.target.value)
                                          )
                                        }
                                        className="flex-1 accent-[#C5A059] h-2 bg-white rounded-lg cursor-pointer"
                                      />

                                      {/* Plus button */}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleGramsSelect(
                                            product,
                                            Math.min(
                                              2000,
                                              (currentSelection.customGrams || 250) + 25
                                            )
                                          )
                                        }
                                        className="w-8 h-8 flex items-center justify-center bg-white border border-[#1A110A]/20 rounded-xl hover:bg-[#1A110A]/5 text-[#1A110A] transition-all shrink-0 cursor-pointer shadow-2xs"
                                        title="زيادة 25 جرام"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                      </button>

                                      {/* Number input pill box matching screenshot */}
                                      <div className="flex items-center gap-1 bg-white border border-[#C5A059] rounded-xl px-2.5 py-1 shrink-0 shadow-2xs">
                                        <input
                                          type="number"
                                          min="50"
                                          max="5000"
                                          step="10"
                                          value={currentSelection.customGrams || 250}
                                          onChange={(e) =>
                                            handleGramsSelect(
                                              product,
                                              Math.max(
                                                25,
                                                Math.min(
                                                  5000,
                                                  Number(e.target.value) || 25
                                                )
                                              )
                                            )
                                          }
                                          className="w-12 font-price font-bold text-center text-xs text-[#1A110A] focus:outline-none"
                                        />
                                        <span className="text-[10px] font-alexandria text-[#C5A059] font-bold">
                                          جم
                                        </span>
                                      </div>
                                    </div>

                                    {/* Clickable Preset Ticks matching screenshot */}
                                    <div className="flex justify-between text-[10px] text-[#1A110A]/70 font-price px-0.5 pt-0.5">
                                      <button
                                        type="button"
                                        onClick={() => handleGramsSelect(product, 50)}
                                        className={`hover:text-[#C5A059] cursor-pointer transition-colors ${
                                          (currentSelection.customGrams || 250) === 50
                                            ? "text-[#C5A059] font-bold underline"
                                            : ""
                                        }`}
                                      >
                                        50 جم (عينة خلطة)
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleGramsSelect(product, 250)}
                                        className={`hover:text-[#C5A059] cursor-pointer transition-colors ${
                                          (currentSelection.customGrams || 250) === 250
                                            ? "text-[#C5A059] font-bold underline"
                                            : ""
                                        }`}
                                      >
                                        250 جم (ربع)
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleGramsSelect(product, 500)}
                                        className={`hover:text-[#C5A059] cursor-pointer transition-colors ${
                                          (currentSelection.customGrams || 250) === 500
                                            ? "text-[#C5A059] font-bold underline"
                                            : ""
                                        }`}
                                      >
                                        500 جم (نصف)
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleGramsSelect(product, 1000)}
                                        className={`hover:text-[#C5A059] cursor-pointer transition-colors ${
                                          (currentSelection.customGrams || 250) === 1000
                                            ? "text-[#C5A059] font-bold underline"
                                            : ""
                                        }`}
                                      >
                                        1000 جم (كيلو)
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleGramsSelect(product, 2000)}
                                        className={`hover:text-[#C5A059] cursor-pointer transition-colors ${
                                          (currentSelection.customGrams || 250) === 2000
                                            ? "text-[#C5A059] font-bold underline"
                                            : ""
                                        }`}
                                      >
                                        2000 جم (2 ك)
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  /* Presets View (4 compact buttons) */
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1 animate-fadeIn">
                                    {weightPresets.map((preset) => {
                                      const isSelected =
                                        (currentSelection.customGrams || 250) ===
                                        preset.grams;
                                      return (
                                        <button
                                          key={preset.grams}
                                          type="button"
                                          onClick={() =>
                                            handleGramsSelect(product, preset.grams)
                                          }
                                          className={`p-2 rounded-xl text-center transition-all cursor-pointer border ${
                                            isSelected
                                              ? "bg-[#1A110B] text-white border-[#C5A059] shadow-xs ring-1 ring-[#C5A059]"
                                              : "bg-white text-[#1A110A] border-[#1A110A]/15 hover:bg-[#1A110A]/5"
                                          }`}
                                        >
                                          <span className="block text-xs font-alexandria font-bold leading-tight">
                                            {preset.title}
                                          </span>
                                          <span className="block text-[10px] font-alexandria text-[#C5A059] font-semibold mt-0.5">
                                            {preset.shortLabel}
                                          </span>
                                          <span
                                            className={`block font-price text-xs font-bold mt-1 ${
                                              isSelected
                                                ? "text-white"
                                                : "text-[#1A110A]/80"
                                            }`}
                                          >
                                            {preset.price} ج.م
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}

                          {/* 5D. Tier 4 Other items (Honey with preset variants) */}
                          {product.tier === 4 &&
                            product.variants &&
                            !isProductEligibleForGrams(product) && (
                              <div className="my-2.5 p-3 bg-[#FAF8F5] rounded-xl border border-[#1A110A]/10 space-y-2">
                                <span className="text-xs font-bold font-alexandria text-[#1A110A]/80 block">
                                  اختر العبوة أو الحجم:
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
                                          handleVariantSelect(
                                            product,
                                            v.id,
                                            v.label
                                          )
                                        }
                                        className={`px-3 py-1.5 rounded-lg text-xs font-alexandria font-semibold transition-all cursor-pointer ${
                                          isSelected
                                            ? "bg-[#1A110B] text-[#FAF8F5] shadow-xs"
                                            : "bg-white text-[#1A110A] hover:bg-[#1A110A]/10 border border-[#1A110A]/10"
                                        }`}
                                      >
                                        {v.label} ({v.price} ج.م)
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                        </div>

                        {/* ================= PART 6: ACTION & SUMMARY ================= */}
                        <div className="mt-4 pt-3 border-t border-dashed border-[#1A110A]/15 space-y-2.5">
                          {/* Quantity Selector */}
                          <div className="flex items-center justify-between bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#1A110A]/10">
                            <span className="text-xs font-bold font-alexandria text-[#1A110A]">
                              الكمية:
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateProductQuantity(product.id, -1)
                                }
                                disabled={productQuantity <= 1}
                                aria-label="تقليل الكمية"
                                className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                                  productQuantity <= 1
                                    ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed"
                                    : "border-[#1A110B]/20 text-[#1A110B] bg-white hover:bg-[#1A110B] hover:text-white"
                                }`}
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="font-price font-bold text-sm min-w-[22px] text-center text-[#1A110B]">
                                {productQuantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateProductQuantity(product.id, 1)
                                }
                                aria-label="زيادة الكمية"
                                className="w-7 h-7 rounded-lg flex items-center justify-center border border-[#1A110B]/20 text-[#1A110B] bg-white hover:bg-[#1A110B] hover:text-white transition-all cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Live Selection Summary Line */}
                          <div className="text-[11px] font-alexandria font-semibold text-[#1A110B]/85 bg-[#FAF8F5] py-1.5 px-3 rounded-lg border border-[#C5A059]/30 truncate text-center shadow-2xs">
                            {summaryText}{" "}
                            {productQuantity > 1 &&
                              `× ${productQuantity} (الإجمالي: ${lineTotalPrice} ج.م)`}
                          </div>

                          {/* Add to Cart Primary Button */}
                          <button
                            onClick={() =>
                              onAddToCart(
                                product,
                                {
                                  unit: currentLabel,
                                  label: currentLabel,
                                  price: currentPrice,
                                },
                                productQuantity
                              )
                            }
                            className="w-full bg-[#1A110B] hover:bg-[#2A1D15] text-[#FAF8F5] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold font-alexandria flex items-center justify-center gap-2 transition-all border border-[#C5A059]/40 active:scale-[0.98] shadow-sm hover:shadow-md cursor-pointer group"
                          >
                            <ShoppingBag className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" />
                            <span>أضف للسلة</span>
                            <span className="font-price text-xs text-[#C5A059] mr-1">
                              ({lineTotalPrice} ج.م)
                            </span>
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
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#C5A059]/30 space-y-3 p-6">
              <Coffee className="w-10 h-10 text-[#C5A059] mx-auto opacity-70" />
              <h3 className="font-amiri text-xl font-bold text-[#1A110B]">
                لم نجد أصنافاً مطابقة للبحث أو الفلتر الحالي
              </h3>
              <p className="font-alexandria text-xs text-[#1A110A]/70 max-w-md mx-auto">
                جرب تغيير كلمة البحث أو الضغط على زر &quot;مسح الفلاتر&quot;
                للعودة لكافة منتجات منيو بن بدران.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 inline-flex items-center gap-1.5 bg-[#1A110B] text-white px-4 py-2 rounded-xl text-xs font-bold font-alexandria shadow-xs hover:bg-[#2A1D15] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>إعادة ضبط وعرض كل المنيو</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= PRINTED MENU BOOKLET ================= */}
      {activeTab === "printed" && (
        <PrintedMenuBooklet />
      )}
    </section>
  );
}

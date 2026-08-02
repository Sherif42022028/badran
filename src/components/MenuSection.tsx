"use client";

import { useState } from "react";
import Image from "next/image";
import { CATEGORIES, MENU_ITEMS, PRINTED_MENU_PAGES, MenuItem } from "@/data/menu";
import { Search, ShoppingBag, X, ZoomIn, Grid, FileText, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, selectedPrice: { unit: string; price: number }) => void;
}

export default function MenuSection({ onAddToCart }: MenuSectionProps) {
  const [activeTab, setActiveTab] = useState<"digital" | "printed">("digital");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Lightbox index state (0 to 6) or null
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Selected weight state for each item
  const [selectedWeights, setSelectedWeights] = useState<Record<string, number>>({});

  const handleWeightChange = (itemId: string, index: number) => {
    setSelectedWeights((prev) => ({ ...prev, [itemId]: index }));
  };

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryPageIndex = (category: string): number => {
    switch (category) {
      case "special": return 3;
      case "arabica": return 1;
      case "french": return 2;
      case "turkish": return 4;
      case "drinks": return 5;
      default: return 0;
    }
  };

  const handlePrevPage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : PRINTED_MENU_PAGES.length - 1);
    }
  };

  const handleNextPage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex < PRINTED_MENU_PAGES.length - 1 ? lightboxIndex + 1 : 0);
    }
  };

  return (
    <section id="menu" className="py-4 md:py-8 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-5 sm:p-8 md:p-10">
        
        {/* Section Title */}
        <div className="text-center mb-6">
          <span className="solid-badge text-xs md:text-sm mb-2 py-1 px-3">
            <span>أسعار المنيو والمنتجات</span>
          </span>
          <p className="font-alexandria text-xs md:text-sm text-[#1A110A]/75 max-w-2xl mx-auto mt-2 font-light">
            تصفح أسعار البن المحدثة للطلب المباشر، أو اضغط لمشاهدة صفحات المنيو المطبوع الأصلي بالصور.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex p-1 bg-[#1A110A]/5 rounded-lg mt-4 border border-[#C5A059]/30">
            <button
              onClick={() => setActiveTab("digital")}
              className={`px-5 py-2 rounded-md font-alexandria text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === "digital"
                  ? "bg-[#1A110A] text-[#FAF8F5] shadow-xs"
                  : "text-[#1A110A] hover:bg-[#1A110A]/10"
              }`}
            >
              <Grid className="w-4 h-4 text-[#C5A059]" />
              <span>جدول الأسعار الرقمي</span>
            </button>
            <button
              onClick={() => setActiveTab("printed")}
              className={`px-5 py-2 rounded-md font-alexandria text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === "printed"
                  ? "bg-[#1A110A] text-[#FAF8F5] shadow-xs"
                  : "text-[#1A110A] hover:bg-[#1A110A]/10"
              }`}
            >
              <FileText className="w-4 h-4 text-[#C5A059]" />
              <span>معرض المنيو المطبوع (1-7)</span>
            </button>
          </div>
        </div>

        {/* ================= DIGITAL MENU LEDGER TABLE ================= */}
        {activeTab === "digital" && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Quick Banner to open Printed Menu Lightbox */}
            <div className="p-3.5 bg-[#1A110A] rounded-xl border border-[#C5A059]/40 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#C5A059] text-white rounded-lg shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-amiri text-base text-[#C5A059] font-bold">
                    معرض المنيو المطبوع بالصور
                  </h5>
                  <p className="font-alexandria text-xs text-[#FAF8F5]/80 font-light">
                    اضغط لتصفح صفحات المنيو الورقي الـ 7 بدقة عالية والتكبير
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLightboxIndex(0)}
                className="bg-[#C5A059] hover:bg-[#B08B46] text-white px-4 py-1.5 rounded-lg font-alexandria text-xs font-bold shrink-0 transition-all"
              >
                تصفح المنيو المطبوع 🖼️
              </button>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-dashed border-[#C5A059]/30 pb-4">
              
              {/* Category Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-alexandria transition-all ${
                    selectedCategory === "all"
                      ? "bg-[#3D120E] text-white border border-[#C5A059]/50"
                      : "bg-white text-[#1A110A] border border-[#1A110A]/15 hover:bg-[#1A110A]/5"
                  }`}
                >
                  جميع الأقسام
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-alexandria transition-all ${
                      selectedCategory === cat.id
                        ? "bg-[#3D120E] text-white border border-[#C5A059]/50"
                        : "bg-white text-[#1A110A] border border-[#1A110A]/15 hover:bg-[#1A110A]/5"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="ابحث عن نوع بن أو مشروب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 bg-white border border-[#1A110A]/20 rounded-lg text-xs font-alexandria focus:outline-none focus:border-[#C5A059]"
                />
                <Search className="w-4 h-4 text-[#C5A059] absolute right-3 top-2.5" />
              </div>
            </div>

            {/* Menu Items Grid with Spotlight Effect */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredItems.map((item) => {
                const selectedPriceIndex = selectedWeights[item.id] || 0;
                const priceObj = item.prices[selectedPriceIndex] || item.prices[0];
                const pageIndex = getCategoryPageIndex(item.category);

                return (
                  <SpotlightCard
                    key={item.id}
                    className={`p-4 bg-white rounded-xl border border-[#1A110A]/15 hover:border-[#C5A059] transition-all shadow-xs flex flex-col justify-between ${
                      item.isSpecial ? "pt-7" : ""
                    }`}
                    spotlightColor="rgba(197, 160, 89, 0.18)"
                  >
                    {item.isSpecial && (
                      <span className="absolute top-2.5 right-3 heritage-ribbon text-[10px] z-10 shadow-2xs">
                        خلطة بدران
                      </span>
                    )}

                    <div>
                      {/* Name & Price Line */}
                      <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-[#C5A059]/25 pb-2.5 mb-2.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-amiri text-xl font-bold text-[#1A110A]">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => setLightboxIndex(pageIndex)}
                            title="معاينة صفحة المنيو المطبوعة الخاصة بهذا الصنف"
                            className="text-[#C5A059] hover:text-[#1A110A] p-0.5 rounded transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="font-price font-bold text-lg text-[#C5A059]">
                          {priceObj.price} <span className="text-xs text-[#1A110A]">ج.م</span>
                        </div>
                      </div>

                      <p className="font-alexandria text-xs text-[#1A110A]/75 mb-3 leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>

                    {/* Weight Options Selector & Add Button */}
                    <div className="pt-2.5 border-t border-dashed border-[#1A110A]/10 flex flex-wrap items-center justify-between gap-2 relative z-10">
                      {/* Weight Selector */}
                      <div className="flex flex-wrap gap-1">
                        {item.prices.map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleWeightChange(item.id, idx)}
                            className={`px-2 py-0.5 rounded text-[11px] font-alexandria font-semibold transition-all ${
                              selectedPriceIndex === idx
                                ? "bg-[#1A110A] text-[#FAF8F5]"
                                : "bg-[#F7F4EF] text-[#1A110A] hover:bg-[#1A110A]/10 border border-[#1A110A]/10"
                            }`}
                          >
                            {p.unit}
                          </button>
                        ))}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => onAddToCart(item, priceObj)}
                        className="bg-[#1A110A] hover:bg-[#2A1D15] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold font-alexandria flex items-center gap-1.5 transition-all border border-[#C5A059]/30 active:scale-95 shrink-0"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>أضف للسلة</span>
                      </button>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-10 font-alexandria text-sm text-[#66584F]">
                لم نجد عناصر تطابق بحثك. يرجى تجربة بحث آخر.
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

      </div>

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

"use client";

import { useState } from "react";
import Image from "next/image";
import { CATEGORIES, MENU_ITEMS, PRINTED_MENU_PAGES, MenuItem } from "@/data/menu";
import { Search, ShoppingBag, X, ZoomIn, Grid, FileText, ChevronLeft, ChevronRight, Eye } from "lucide-react";

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, selectedPrice: { unit: string; price: number }) => void;
}

export default function MenuSection({ onAddToCart }: MenuSectionProps) {
  const [activeTab, setActiveTab] = useState<"digital" | "printed">("digital");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Lightbox state: index of PRINTED_MENU_PAGES (0 to 6) or null
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

  // Map category to printed page index (0 to 6)
  const getCategoryPageIndex = (category: string): number => {
    switch (category) {
      case "special": return 3; // Page 4
      case "arabica": return 1; // Page 2
      case "french": return 2; // Page 3
      case "turkish": return 4; // Page 5
      case "drinks": return 5; // Page 6
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
    <section id="menu" className="py-10 md:py-16 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-6 sm:p-10 md:p-14">
        
        {/* Section Title */}
        <div className="text-center mb-10">
          <span className="solid-badge text-base md:text-lg mb-3">
            <span>قائمة الأسعار والمنتجات الرسمية</span>
          </span>
          <p className="font-alexandria text-xs md:text-sm text-[#1E110A]/75 max-w-2xl mx-auto mt-3 font-light">
            تصفح القائمة الرقمية المحدثة للطلب المباشر، أو اضغط لمشاهدة صفحات المنيو المطبوع الأصلي عالي الدقة.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex p-1 bg-[#1E110A]/5 rounded-full mt-6 border border-[#C89B3C]/30 shadow-inner">
            <button
              onClick={() => setActiveTab("digital")}
              className={`px-6 py-2.5 rounded-full font-alexandria text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === "digital"
                  ? "bg-[#1E110A] text-[#FAF7F2] shadow-md"
                  : "text-[#1E110A] hover:bg-[#1E110A]/10"
              }`}
            >
              <Grid className="w-4 h-4 text-[#C89B3C]" />
              <span>جدول الأسعار الرقمي</span>
            </button>
            <button
              onClick={() => setActiveTab("printed")}
              className={`px-6 py-2.5 rounded-full font-alexandria text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === "printed"
                  ? "bg-[#1E110A] text-[#FAF7F2] shadow-md"
                  : "text-[#1E110A] hover:bg-[#1E110A]/10"
              }`}
            >
              <FileText className="w-4 h-4 text-[#C89B3C]" />
              <span>معرض المنيو المطبوع الأصلي (1-7)</span>
            </button>
          </div>
        </div>

        {/* ================= DIGITAL MENU LEDGER TABLE ================= */}
        {activeTab === "digital" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Quick Banner to open Printed Menu Lightbox */}
            <div className="p-4 bg-gradient-to-r from-[#1E110A] via-[#321E14] to-[#1E110A] rounded-xl border border-[#C89B3C]/50 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#C89B3C] text-white rounded-lg shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-amiri text-lg text-[#D4AF37] font-bold">
                    معرض المنيو المطبوع الأصلي بالصور
                  </h5>
                  <p className="font-alexandria text-xs text-[#FAF7F2]/80 font-light">
                    اضغط لتصفح صفحات المنيو المطبوع الـ 7 بدقة عالية والتكبير
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLightboxIndex(0)}
                className="bg-gold-gradient text-white px-5 py-2 rounded-full font-alexandria text-xs font-bold shrink-0 hover:shadow-lg transition-all"
              >
                تصفح المنيو المطبوع 🖼️
              </button>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-dashed border-[#C89B3C]/30 pb-6">
              
              {/* Category Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-full text-xs font-bold font-alexandria transition-all ${
                    selectedCategory === "all"
                      ? "bg-[#4A1510] text-white border border-[#C89B3C]/50 shadow-xs"
                      : "bg-white text-[#1E110A] border border-[#C89B3C]/30 hover:bg-[#1E110A]/5"
                  }`}
                >
                  جميع الأقسام
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold font-alexandria transition-all ${
                      selectedCategory === cat.id
                        ? "bg-[#4A1510] text-white border border-[#C89B3C]/50 shadow-xs"
                        : "bg-white text-[#1E110A] border border-[#C89B3C]/30 hover:bg-[#1E110A]/5"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="ابحث عن نوع بن أو مشروب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 bg-white border border-[#C89B3C]/40 rounded-full text-xs font-alexandria focus:outline-none focus:ring-1 focus:ring-[#C89B3C] shadow-2xs"
                />
                <Search className="w-4 h-4 text-[#C89B3C] absolute right-3.5 top-3" />
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => {
                const selectedPriceIndex = selectedWeights[item.id] || 0;
                const priceObj = item.prices[selectedPriceIndex] || item.prices[0];
                const pageIndex = getCategoryPageIndex(item.category);

                return (
                  <div
                    key={item.id}
                    className="relative p-5 bg-white rounded-xl border border-[#C89B3C]/30 hover:border-[#C89B3C] transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
                  >
                    {item.isSpecial && (
                      <span className="absolute -top-3 right-5 heritage-ribbon text-[10px]">
                        ★ خلطة بدران الملكية
                      </span>
                    )}

                    <div>
                      {/* Name & Price Line */}
                      <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-[#C89B3C]/25 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-amiri text-2xl font-bold text-[#1E110A]">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => setLightboxIndex(pageIndex)}
                            title="معاينة ورقة المنيو المطبوعة الخاصة بهذا الصنف"
                            className="text-[#C89B3C] hover:text-[#1E110A] p-1 rounded transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="font-price font-bold text-xl text-[#C89B3C]">
                          {priceObj.price} <span className="text-xs text-[#1E110A]">ج.م</span>
                        </div>
                      </div>

                      <p className="font-alexandria text-xs text-[#1E110A]/75 mb-4 leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>

                    {/* Weight Options Selector & Add Button */}
                    <div className="pt-3 border-t border-dashed border-[#C89B3C]/20 flex flex-wrap items-center justify-between gap-2">
                      {/* Weight Selector */}
                      <div className="flex flex-wrap gap-1.5">
                        {item.prices.map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleWeightChange(item.id, idx)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-alexandria font-semibold transition-all ${
                              selectedPriceIndex === idx
                                ? "bg-[#1E110A] text-[#D4AF37]"
                                : "bg-[#FAF7F2] text-[#1E110A] hover:bg-[#1E110A]/10 border border-[#C89B3C]/20"
                            }`}
                          >
                            {p.unit}
                          </button>
                        ))}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => onAddToCart(item, priceObj)}
                        className="bg-gold-gradient text-white hover:shadow-md px-4 py-2 rounded-full text-xs font-bold font-alexandria flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>أضف للسلة</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12 font-alexandria text-sm text-[#6B5B52]">
                لم نجد عناصر تطابق بحثك. يرجى تجربة بحث آخر.
              </div>
            )}
          </div>
        )}

        {/* ================= PRINTED MENU GALLERY (1-7) ================= */}
        {activeTab === "printed" && (
          <div className="space-y-6 animate-fadeIn">
            <p className="text-center font-alexandria text-xs md:text-sm text-[#1E110A]/75">
              اضغط على أي صفحة لمشاهدتها بالحجم الكامل ومعاينة كافة الأسعار والأصناف كما هي في المحل.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {PRINTED_MENU_PAGES.map((page, index) => (
                <div
                  key={page.id}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative rounded-xl border border-[#C89B3C]/40 overflow-hidden bg-white shadow-xs cursor-pointer hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[3/4] w-full bg-[#1E110A]">
                    <Image
                      src={page.src}
                      alt={page.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-alexandria text-xs font-bold gap-2">
                      <ZoomIn className="w-5 h-5 text-[#D4AF37]" />
                      <span>انقر للتكبير والمعاينة</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white border-t border-[#C89B3C]/20 flex items-center justify-between">
                    <span className="font-alexandria font-bold text-xs text-[#1E110A]">
                      صفحة {page.id}: {page.title}
                    </span>
                    <ZoomIn className="w-4 h-4 text-[#C89B3C] group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* INTERACTIVE LIGHTBOX MODAL WITH NEXT / PREV CAROUSEL */}
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[92vh] bg-[#1E110A] border-2 border-[#C89B3C] rounded-2xl p-4 overflow-hidden flex flex-col items-center shadow-2xl"
          >
            {/* Lightbox Header Controls */}
            <div className="w-full flex items-center justify-between border-b border-dashed border-[#C89B3C]/30 pb-3 mb-3 text-white">
              <div className="flex items-center gap-2">
                <span className="bg-[#C89B3C] text-white font-bold px-2.5 py-0.5 rounded-full text-xs font-price">
                  {lightboxIndex + 1} / {PRINTED_MENU_PAGES.length}
                </span>
                <h4 className="font-amiri text-lg text-[#D4AF37] font-bold">
                  {PRINTED_MENU_PAGES[lightboxIndex].title}
                </h4>
              </div>

              <button
                onClick={() => setLightboxIndex(null)}
                className="bg-white/10 hover:bg-white/20 text-[#FAF7F2] p-2 rounded-full transition-colors border border-white/20"
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
                className="absolute right-3 z-30 bg-[#1E110A]/80 hover:bg-[#C89B3C] text-white p-3 rounded-full border border-[#C89B3C]/50 transition-all shadow-lg active:scale-95"
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
                className="absolute left-3 z-30 bg-[#1E110A]/80 hover:bg-[#C89B3C] text-white p-3 rounded-full border border-[#C89B3C]/50 transition-all shadow-lg active:scale-95"
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
                  className={`px-3 py-1 rounded-full text-xs font-alexandria font-bold transition-all ${
                    lightboxIndex === idx
                      ? "bg-[#C89B3C] text-white shadow-md"
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

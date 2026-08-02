"use client";

import { useState } from "react";
import Image from "next/image";
import { CATEGORIES, MENU_ITEMS, PRINTED_MENU_PAGES, MenuItem } from "@/data/menu";
import { Search, ShoppingBag, X, ZoomIn, Sparkles, Grid, FileText } from "lucide-react";

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, selectedPrice: { unit: string; price: number }) => void;
}

export default function MenuSection({ onAddToCart }: MenuSectionProps) {
  const [activeTab, setActiveTab] = useState<"digital" | "printed">("digital");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  return (
    <section id="menu" className="py-10 md:py-16 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-6 sm:p-10 md:p-14">
        
        {/* Section Title */}
        <div className="text-center mb-10">
          <span className="solid-badge text-base md:text-lg mb-3">
            <span>قائمة الأسعار والمنتجات الرسمية</span>
          </span>
          <p className="font-alexandria text-xs md:text-sm text-[#1E110A]/75 max-w-2xl mx-auto mt-3 font-light">
            تصفح القائمة الرقمية المحدثة للطلب المباشر، أو قم بمعاينة المنيو المطبوع الأصلي عالي الدقة.
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
              <span>معرض المنيو المطبوع (1-7)</span>
            </button>
          </div>
        </div>

        {/* ================= DIGITAL MENU LEDGER TABLE ================= */}
        {activeTab === "digital" && (
          <div className="space-y-8 animate-fadeIn">
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
                        <h4 className="font-amiri text-2xl font-bold text-[#1E110A]">
                          {item.name}
                        </h4>
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
              {PRINTED_MENU_PAGES.map((page) => (
                <div
                  key={page.id}
                  onClick={() => setSelectedImage(page.src)}
                  className="group relative rounded-xl border border-[#C89B3C]/40 overflow-hidden bg-white shadow-xs cursor-pointer hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[3/4] w-full bg-[#1E110A]">
                    <Image
                      src={page.src}
                      alt={page.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
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

      {/* LIGHTBOX MODAL FOR PRINTED MENU */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-white border-2 border-[#C89B3C] rounded-2xl p-3 overflow-hidden flex flex-col items-center shadow-2xl"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 left-4 bg-[#1E110A] text-[#D4AF37] p-2 rounded-full hover:bg-[#4A1510] transition-colors z-20 shadow-lg border border-[#C89B3C]/40"
              aria-label="إغلاق"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full h-[75vh]">
              <Image
                src={selectedImage}
                alt="صفحة المنيو المكبرة"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

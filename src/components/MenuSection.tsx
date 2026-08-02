"use client";

import { useState } from "react";
import Image from "next/image";
import { CATEGORIES, MENU_ITEMS, PRINTED_MENU_PAGES, MenuItem } from "@/data/menu";
import { Search, ShoppingBag, Eye, X, ZoomIn, Sparkles, Filter, FileText, Grid } from "lucide-react";

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, selectedPrice: { unit: string; price: number }) => void;
}

export default function MenuSection({ onAddToCart }: MenuSectionProps) {
  const [activeTab, setActiveTab] = useState<"digital" | "printed">("digital");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Selected weight state for each item id
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
    <section id="menu" className="py-8 md:py-14 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-4 sm:p-8 md:p-10">
        
        {/* Section Title */}
        <div className="text-center mb-8">
          <span className="solid-badge text-xl mb-3">
            <span>المنيو والأسعار الرسمية</span>
          </span>
          <p className="font-tajawal text-sm md:text-base text-[#3A2416]/80 max-w-2xl mx-auto mt-2">
            يمكنك تصفح جدول الأسعار الرقمي والطلب المباشر، أو مشاهدة المنيو المطبوع الأصلي عالي الدقة.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex p-1 bg-[#3A2416]/10 rounded-lg mt-6 border border-[#3A2416]/30">
            <button
              onClick={() => setActiveTab("digital")}
              className={`px-5 py-2.5 rounded font-lalezar text-base flex items-center gap-2 transition-all ${
                activeTab === "digital"
                  ? "bg-[#3A2416] text-[#FFF8F6] shadow-sm"
                  : "text-[#3A2416] hover:bg-[#3A2416]/10"
              }`}
            >
              <Grid className="w-4 h-4 text-[#C97A2B]" />
              <span>جدول الأسعار الرقمي</span>
            </button>
            <button
              onClick={() => setActiveTab("printed")}
              className={`px-5 py-2.5 rounded font-lalezar text-base flex items-center gap-2 transition-all ${
                activeTab === "printed"
                  ? "bg-[#3A2416] text-[#FFF8F6] shadow-sm"
                  : "text-[#3A2416] hover:bg-[#3A2416]/10"
              }`}
            >
              <FileText className="w-4 h-4 text-[#C97A2B]" />
              <span>معرض المنيو المطبوع (1-7)</span>
            </button>
          </div>
        </div>

        {/* ================= DIGITAL MENU LEDGER TABLE ================= */}
        {activeTab === "digital" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Category Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-dashed border-[#3A2416]/30 pb-6">
              
              {/* Category Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1.5 rounded text-xs font-semibold font-tajawal transition-all ${
                    selectedCategory === "all"
                      ? "bg-[#6B2A22] text-white"
                      : "bg-[#FFF8F6] text-[#3A2416] border border-[#3A2416]/30 hover:bg-[#3A2416]/10"
                  }`}
                >
                  كافة الأقسام
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold font-tajawal transition-all ${
                      selectedCategory === cat.id
                        ? "bg-[#6B2A22] text-white"
                        : "bg-[#FFF8F6] text-[#3A2416] border border-[#3A2416]/30 hover:bg-[#3A2416]/10"
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
                  className="w-full pl-3 pr-9 py-2 bg-[#FFF8F6] border border-[#3A2416] rounded text-xs font-tajawal focus:outline-none focus:ring-1 focus:ring-[#6B2A22]"
                />
                <Search className="w-4 h-4 text-[#5E604D] absolute right-2.5 top-2.5" />
              </div>
            </div>

            {/* Menu Items Ledger Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => {
                const selectedPriceIndex = selectedWeights[item.id] || 0;
                const priceObj = item.prices[selectedPriceIndex] || item.prices[0];

                return (
                  <div
                    key={item.id}
                    className="relative p-4 bg-[#FFF8F6] rounded border border-[#3A2416]/30 hover:border-[#3A2416] transition-all shadow-xs flex flex-col justify-between"
                  >
                    {item.isSpecial && (
                      <span className="absolute -top-2.5 right-4 heritage-ribbon text-[10px]">
                        خلطة خاصة
                      </span>
                    )}

                    <div>
                      {/* Name & Price Header Line */}
                      <div className="flex items-baseline justify-between gap-2 border-b border-dashed border-[#3A2416]/30 pb-2 mb-2">
                        <h4 className="font-lalezar text-lg text-[#3A2416]">
                          {item.name}
                        </h4>
                        <div className="font-price font-bold text-lg text-[#6B2A22]">
                          {priceObj.price} <span className="text-xs text-[#3A2416]">ج.م</span>
                        </div>
                      </div>

                      <p className="font-tajawal text-xs text-[#3A2416]/80 mb-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Weight Options Selector & Add Button */}
                    <div className="pt-2 border-t border-dashed border-[#3A2416]/20 flex flex-wrap items-center justify-between gap-2">
                      {/* Weight Selector */}
                      <div className="flex flex-wrap gap-1">
                        {item.prices.map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleWeightChange(item.id, idx)}
                            className={`px-2 py-1 rounded text-[11px] font-tajawal transition-all ${
                              selectedPriceIndex === idx
                                ? "bg-[#3A2416] text-[#FFF8F6] font-bold"
                                : "bg-[#F3ECDD] text-[#3A2416] hover:bg-[#3A2416]/10"
                            }`}
                          >
                            {p.unit}
                          </button>
                        ))}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => onAddToCart(item, priceObj)}
                        className="bg-[#C97A2B] hover:bg-[#E08930] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 shrink-0"
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
              <div className="text-center py-10 font-tajawal text-sm text-[#5E604D]">
                لم نجد عناصر تطابق بحثك. يرجى تجربة بحث آخر.
              </div>
            )}
          </div>
        )}

        {/* ================= PRINTED MENU GALLERY (1-7) ================= */}
        {activeTab === "printed" && (
          <div className="space-y-6 animate-fadeIn">
            <p className="text-center font-tajawal text-xs md:text-sm text-[#3A2416]/80">
              اضغط على أي صفحة لمشاهدتها بالحجم الكامل ومعاينة جميع الأسعار والأصناف كما هي في المحل.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {PRINTED_MENU_PAGES.map((page) => (
                <div
                  key={page.id}
                  onClick={() => setSelectedImage(page.src)}
                  className="group relative rounded border-2 border-[#3A2416] overflow-hidden bg-[#FFF8F6] shadow-sm cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={page.src}
                      alt={page.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-3 bg-[#FFF8F6] border-t border-[#3A2416]/30 flex items-center justify-between">
                    <span className="font-lalezar text-sm text-[#3A2416]">
                      صفحة {page.id}: {page.title}
                    </span>
                    <ZoomIn className="w-4 h-4 text-[#C97A2B] group-hover:scale-110 transition-transform" />
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-[#FFF8F6] border-4 border-[#3A2416] rounded p-2 overflow-hidden flex flex-col items-center"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 left-4 bg-[#3A2416] text-white p-2 rounded-full hover:bg-[#6B2A22] transition-colors z-20 shadow-md"
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

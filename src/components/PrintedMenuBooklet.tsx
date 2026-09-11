"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  FileDown,
  Sparkles,
  Coffee,
  Flame,
  Award,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Grid,
  BookOpen,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { PRINTED_MENU_PAGES } from "@/data/products";

export default function PrintedMenuBooklet() {
  const [viewMode, setViewMode] = useState<"booklet" | "all" | "scanned">("booklet");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedScanImage, setSelectedScanImage] = useState<string | null>(null);
  const totalPages = 8;

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages));
  }, [totalPages]);

  // Keyboard navigation for booklet pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== "booklet") return;
      if (e.key === "ArrowLeft") {
        nextPage();
      } else if (e.key === "ArrowRight") {
        prevPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, nextPage, prevPage]);

  return (
    <div className="space-y-6 animate-fadeIn text-right font-alexandria">
      {/* Top Header & Action Controls Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border-2 border-[#C5A059]/40 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#1A110B] text-[#C5A059] shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-amiri text-xl sm:text-2xl font-bold text-[#1A110B]">
                كتالوج ومنيو بن بدران الرسمي — الطبعة المعتمدة 2026
              </h3>
              <p className="text-xs text-[#1A110A]/70 mt-0.5">
                نسخة إلكترونية ومطبوعة متطابقة 100% مع أسعار فرع ميت غمر والمتجر الإلكتروني.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          {/* View Mode Toggle Switch */}
          <div className="inline-flex bg-[#1A110A]/5 p-1 rounded-xl border border-[#1A110A]/10 text-xs font-bold font-alexandria">
            <button
              type="button"
              onClick={() => setViewMode("booklet")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "booklet"
                  ? "bg-[#1A110B] text-white shadow-xs"
                  : "text-[#1A110B] hover:bg-[#1A110A]/10"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>تصفح بالصفحات</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("all")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "all"
                  ? "bg-[#1A110B] text-white shadow-xs"
                  : "text-[#1A110B] hover:bg-[#1A110A]/10"
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>عرض الكتالوج كاملاً</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("scanned")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "scanned"
                  ? "bg-[#1A110B] text-white shadow-xs"
                  : "text-[#1A110B] hover:bg-[#1A110A]/10"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>المنيو الورقي المصور</span>
            </button>
          </div>

          {/* Genuine Real PDF Download Button */}
          <a
            href="/budran_coffee_price_list.pdf"
            download="منيو_بن_بدران_الرسمي_2026.pdf"
            className="px-4 sm:px-5 py-2.5 bg-[#C5A059] hover:bg-[#b08d47] text-[#1A110B] font-bold text-xs sm:text-sm font-alexandria rounded-xl shadow-xs hover:shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-98 border border-[#C5A059]/40"
          >
            <FileDown className="w-4.5 h-4.5 shrink-0" />
            <span>تحميل نسخة PDF الرسمية</span>
            <span className="text-[10px] bg-[#1A110B]/10 px-1.5 py-0.5 rounded font-mono font-bold">
              149 KB
            </span>
          </a>
        </div>
      </div>

      {/* Synchronized Pricing Guarantee Banner */}
      <div className="bg-amber-50 border border-amber-300/80 rounded-xl p-3.5 text-xs text-amber-950 flex items-center justify-between gap-3 shadow-2xs font-alexandria">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            جميع الأسعار في هذا الكتالوج المطبوع محدثة ومطابقة لآخر تعديلات فرع ميت غمر (زيادة الفرنساويات + سيدامو وليمو الحبشي).
          </span>
        </div>
        <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-md border border-amber-300/60 shrink-0">
          طبعة 2026 الرسمية
        </span>
      </div>

      {/* Booklet Navigation Controls - Only in booklet mode */}
      {viewMode === "booklet" && (
        <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-[#C5A059]/30 shadow-2xs">
          <button
            type="button"
            onClick={prevPage}
            className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#1A110B] hover:text-white text-[#1A110B] border border-[#1A110A]/15 text-xs font-bold font-alexandria flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-4 h-4 text-[#C5A059]" />
            <span>الصفحة السابقة</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-alexandria font-bold text-xs text-[#1A110B]">
              صفحة <span className="text-[#C5A059]">{currentPage}</span> من {totalPages}
            </span>
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold font-price flex items-center justify-center transition-all cursor-pointer ${
                    currentPage === idx + 1
                      ? "bg-[#1A110B] text-[#C5A059] shadow-xs"
                      : "bg-[#FAF8F5] text-[#1A110A]/70 hover:bg-[#1A110A]/10"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={nextPage}
            className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#1A110B] hover:text-white text-[#1A110B] border border-[#1A110A]/15 text-xs font-bold font-alexandria flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <span>الصفحة التالية</span>
            <ChevronLeft className="w-4 h-4 text-[#C5A059]" />
          </button>
        </div>
      )}

      {/* ========================================================
          MODE 3: SCANNED ORIGINAL MENU PHOTOS (7 PAGES)
          ======================================================== */}
      {viewMode === "scanned" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/40 text-center">
            <h4 className="font-amiri text-xl font-bold text-[#1A110B]">
              صور الكتالوج الورقي المطبوع الأصلي (7 صفحات)
            </h4>
            <p className="text-xs text-[#1A110A]/70 mt-1">
              انقر على أي صفحة لتكبيرها واستعراض تفاصيلها الأصلية بدقة عالية.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PRINTED_MENU_PAGES.map((page) => (
              <div
                key={page.id}
                onClick={() => setSelectedScanImage(page.src)}
                className="group relative bg-white rounded-2xl border-2 border-[#1A110A]/12 hover:border-[#C5A059] p-3 shadow-xs hover:shadow-lg transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div className="relative w-full aspect-3/4 rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={page.src}
                    alt={page.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-[#1A110B]/90 text-[#C5A059] rounded-xl shadow-md flex items-center gap-1.5 text-xs font-bold">
                      <Maximize2 className="w-4 h-4" />
                      <span>تكبير الصفحة</span>
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className="text-[11px] font-bold text-[#C5A059] block">
                    صفحة {page.id}
                  </span>
                  <h5 className="font-amiri text-sm font-bold text-[#1A110B] truncate mt-0.5">
                    {page.title}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          MODE 1 & 2: INTERACTIVE DIGITAL BOOKLET PAGES
          ======================================================== */}
      {(viewMode === "booklet" || viewMode === "all") && (
        <div className="space-y-8">
          {/* ================= PAGE 1: COVER PAGE ================= */}
          {(viewMode === "all" || currentPage === 1) && (
            <div className="relative bg-[#1A110B] text-[#FAF8F5] rounded-2xl md:rounded-3xl border-2 border-[#C5A059] p-6 sm:p-10 md:p-14 shadow-xl overflow-hidden min-h-[580px] flex flex-col justify-between">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute inset-3 sm:inset-4 border border-[#C5A059]/40 rounded-xl md:rounded-2xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between border-b border-[#C5A059]/30 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#C5A059] text-[#1A110B] rounded-full text-[11px] font-bold font-alexandria">
                    طبعة رسمية معتمدة
                  </span>
                  <span className="text-xs text-[#FAF8F5]/70 font-alexandria">
                    2026 — 1447 هـ
                  </span>
                </div>
                <div className="text-left font-alexandria text-xs text-[#C5A059] font-semibold">
                  بيت البن الأصيل بميت غمر
                </div>
              </div>

              <div className="relative z-10 my-auto py-8 text-center space-y-4 sm:space-y-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto relative rounded-full overflow-hidden border-2 border-[#C5A059] shadow-lg bg-[#FAF8F5] p-1">
                  <Image
                    src="/logo.jpg"
                    alt="شعار بن بدران"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-xs sm:text-sm font-alexandria tracking-widest text-[#C5A059] uppercase block">
                    Badran Artisan Coffee Roastery
                  </span>
                  <h1 className="font-amiri text-4xl sm:text-5xl md:text-6xl font-bold text-[#FAF8F5] drop-shadow-md">
                    بُـــن بَــــدْرَان
                  </h1>
                  <p className="font-amiri text-lg sm:text-2xl text-[#C5A059] font-medium">
                    طعم يميّزك ... وجودة تثق بها
                  </p>
                </div>

                <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto" />

                <p className="font-alexandria text-xs sm:text-sm text-[#FAF8F5]/85 max-w-lg mx-auto font-light leading-relaxed">
                  قائمة الأسعار الشاملة والكتالوج الرسمي لأرقى أنواع البن العالمي المحمص طازجاً على أصوله، والتوليفات الحصرية المبتكرة.
                </p>
              </div>

              <div className="relative z-10 border-t border-[#C5A059]/30 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-alexandria text-[#FAF8F5]/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                  <span>الفرع الرئيسي: ميت غمر — محافظة الدقهلية</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#C5A059]">●</span>
                  <span>طحن وتعبئة فورية عند الطلب</span>
                  <span className="text-[#C5A059]">●</span>
                  <span>سداد مسبق عبر الواتساب</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE 2: BASICS & ROASTING ================= */}
          {(viewMode === "all" || currentPage === 2) && (
            <div className="bg-white rounded-2xl border-2 border-[#C5A059]/40 p-5 sm:p-8 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#C5A059]" />
                  <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1A110B]">
                    1. الأساسيات والتحميص الكلاسيكي
                  </h2>
                </div>
                <span className="text-xs font-alexandria font-bold text-[#C5A059] bg-[#1A110B] px-3 py-1 rounded-full">
                  صفحة 2
                </span>
              </div>

              <p className="text-xs text-[#1A110A]/75 leading-relaxed">
                البن الكلاسيكي النقي المفضل لملايين عشاق القهوة، متوفر بكافة درجات التحميص الأربعة وأوزان تناسب مختلف الاحتياجات.
              </p>

              {/* Plain Coffee Table */}
              <div className="space-y-2">
                <h3 className="font-amiri font-bold text-lg text-[#1A110B] flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-[#C5A059]" />
                  <span>بن ساده بدران (بدون إضافات)</span>
                </h3>
                <div className="overflow-x-auto rounded-xl border border-[#1A110A]/15">
                  <table className="w-full text-xs text-right font-alexandria">
                    <thead className="bg-[#1A110B] text-white font-bold">
                      <tr>
                        <th className="p-2.5">درجة التحميص</th>
                        <th className="p-2.5">سعر الكيلو (1000 جم)</th>
                        <th className="p-2.5">سعر الـ 100 جم</th>
                        <th className="p-2.5">جردل اقتصادي (450 جم)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A110A]/10 bg-[#FAF8F5]">
                      <tr className="hover:bg-white transition-colors">
                        <td className="p-2.5 font-bold">فاتح (Light)</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">520 ج.م</td>
                        <td className="p-2.5">460 ج.م</td>
                        <td className="p-2.5">220 ج.م</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="p-2.5 font-bold">وسط (Medium)</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">520 ج.م</td>
                        <td className="p-2.5">460 ج.م</td>
                        <td className="p-2.5">220 ج.م</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="p-2.5 font-bold">غامق (Dark)</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">540 ج.م</td>
                        <td className="p-2.5">480 ج.م</td>
                        <td className="p-2.5">—</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="p-2.5 font-bold">محروق (Extra Dark)</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">580 ج.م</td>
                        <td className="p-2.5">—</td>
                        <td className="p-2.5">220 ج.م</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mohawaj Coffee Table */}
              <div className="space-y-2">
                <h3 className="font-amiri font-bold text-lg text-[#1A110B] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>بن محوج بدران (بالحبهان الأخضر والمستكة)</span>
                </h3>
                <div className="overflow-x-auto rounded-xl border border-[#1A110A]/15">
                  <table className="w-full text-xs text-right font-alexandria">
                    <thead className="bg-[#1A110B] text-white font-bold">
                      <tr>
                        <th className="p-2.5">درجة التحميص</th>
                        <th className="p-2.5">سعر الكيلو (1000 جم)</th>
                        <th className="p-2.5">سعر الـ 100 جم</th>
                        <th className="p-2.5">المواصفات والتحويج</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A110A]/10 bg-[#FAF8F5]">
                      <tr className="hover:bg-white transition-colors">
                        <td className="p-2.5 font-bold">فاتح محوج</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">600 ج.م</td>
                        <td className="p-2.5">560 ج.م</td>
                        <td className="p-2.5 text-[11px] text-gray-600">حبهان أخضر فاخر + مستكة يوناني</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="p-2.5 font-bold">وسط محوج</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">600 ج.م</td>
                        <td className="p-2.5">560 ج.م</td>
                        <td className="p-2.5 text-[11px] text-gray-600">الخلطة الأكثر طلباً ومبيعاً</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="p-2.5 font-bold">غامق محوج</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">620 ج.م</td>
                        <td className="p-2.5">—</td>
                        <td className="p-2.5 text-[11px] text-gray-600">قوام ثقيل ونكهة حبهان قوية</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="p-2.5 font-bold">محروق محوج</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">680 ج.م</td>
                        <td className="p-2.5">—</td>
                        <td className="p-2.5 text-[11px] text-gray-600">مرارة مركزة ومزاج عالي جداً</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Specialty Basics Quick Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#C5A059]/30 text-center">
                  <span className="text-[11px] font-bold text-gray-600 block">قهوة خضراء للرشاقة</span>
                  <strong className="font-price font-bold text-base text-[#1A110B] block mt-1">640 ج.م / ك</strong>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#C5A059]/30 text-center">
                  <span className="text-[11px] font-bold text-gray-600 block">قهوة عربي بالزعفران</span>
                  <strong className="font-price font-bold text-base text-[#1A110B] block mt-1">840 ج.م / ك</strong>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#C5A059]/30 text-center">
                  <span className="text-[11px] font-bold text-gray-600 block">شاي بدران السيلاني</span>
                  <strong className="font-price font-bold text-base text-[#1A110B] block mt-1">200 ج.م / ك</strong>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#C5A059]/30 text-center">
                  <span className="text-[11px] font-bold text-gray-600 block">نسكافيه جولد مجفف</span>
                  <strong className="font-price font-bold text-base text-[#1A110B] block mt-1">1,240 ج.م / ك</strong>
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE 3: ROYAL BLENDS & ESPRESSO ================= */}
          {(viewMode === "all" || currentPage === 3) && (
            <div className="bg-white rounded-2xl border-2 border-[#C5A059]/40 p-5 sm:p-8 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C5A059]" />
                  <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1A110B]">
                    2. التوليفات الملكية وخلطات الاسبريسو
                  </h2>
                </div>
                <span className="text-xs font-alexandria font-bold text-[#C5A059] bg-[#1A110B] px-3 py-1 rounded-full">
                  صفحة 3
                </span>
              </div>

              <p className="text-xs text-[#1A110A]/75 leading-relaxed">
                توليفات بدران الحصرية التي تميزنا بها عبر السنين، محسوبة النسب بين أجود أصناف الأرابيكا العالمية والروبوستا العطرية.
              </p>

              <div className="overflow-x-auto rounded-xl border border-[#1A110A]/15">
                <table className="w-full text-xs text-right font-alexandria">
                  <thead className="bg-[#1A110B] text-white font-bold">
                    <tr>
                      <th className="p-3">اسم التوليفة</th>
                      <th className="p-3">الوصف وطابع الفنجان</th>
                      <th className="p-3">ساده للكيلو</th>
                      <th className="p-3">محوج بالحبهان</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A110A]/10 bg-[#FAF8F5]">
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-3 font-bold text-[#1A110B]">توليفة اسبيشيال بدران الملكية</td>
                      <td className="p-3 text-[11px] text-gray-600">سر عائلة بدران: مزيج سحري من 4 أصناف أرابيكا فاخرة</td>
                      <td className="p-3 font-bold text-[#C5A059]">760 ج.م</td>
                      <td className="p-3 font-bold text-[#1A110B]">880 ج.م</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-3 font-bold text-[#1A110B]">توليفة السلطان الفاخرة</td>
                      <td className="p-3 text-[11px] text-gray-600">نكهة عميقة وقوام غني مصممة لصفوة الذواقة</td>
                      <td className="p-3 font-bold text-[#C5A059]">760 ج.م</td>
                      <td className="p-3 font-bold text-[#1A110B]">880 ج.م</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-3 font-bold text-[#1A110B]">توليفة الملكي الراقية</td>
                      <td className="p-3 text-[11px] text-gray-600">مزيج كولومبي وهندي وبرازيلي متناسق بنكهة هادئة</td>
                      <td className="p-3 font-bold text-[#C5A059]">800 ج.م</td>
                      <td className="p-3 font-bold text-[#1A110B]">920 ج.م</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-3 font-bold text-[#1A110B]">توليفة الأصلي التراثية</td>
                      <td className="p-3 text-[11px] text-gray-600">خلطة الأجداد التراثية التي انطلق بها محل بدران</td>
                      <td className="p-3 font-bold text-[#C5A059]">880 ج.م</td>
                      <td className="p-3 font-bold text-[#1A110B]">1,000 ج.م</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-3 font-bold text-[#1A110B]">توليفة العميد الخاصة</td>
                      <td className="p-3 text-[11px] text-gray-600">توليفة ثقيلة منتقاة لعشاق التركيز والوش الكثيف</td>
                      <td className="p-3 font-bold text-[#C5A059]">1,000 ج.م</td>
                      <td className="p-3 font-bold text-[#1A110B]">1,120 ج.م</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Espresso Blends Box */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#C5A059]/40 space-y-2">
                <h3 className="font-amiri font-bold text-base text-[#1A110B] flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-[#C5A059]" />
                  <span>خلطات الاسبريسو الاحترافية (Espresso Blends) للمكائن</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-lg border border-[#1A110A]/10 text-center">
                    <span className="text-xs font-bold text-gray-700 block">اسبريسو 30% أرابيكا</span>
                    <span className="text-[11px] text-gray-500 block">وش كثيف وكافيين عالي</span>
                    <strong className="font-price font-bold text-sm text-[#C5A059] block mt-1">680 ج.م / ك</strong>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#1A110A]/10 text-center">
                    <span className="text-xs font-bold text-gray-700 block">اسبريسو 50% أرابيكا</span>
                    <span className="text-[11px] text-gray-500 block">توازن مثالي بين الكريمة والنكهة</span>
                    <strong className="font-price font-bold text-sm text-[#C5A059] block mt-1">800 ج.م / ك</strong>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#1A110A]/10 text-center">
                    <span className="text-xs font-bold text-gray-700 block">اسبريسو 80% أرابيكا</span>
                    <span className="text-[11px] text-gray-500 block">نكهة أرابيكا أروماتية وكريمة ناعمة</span>
                    <strong className="font-price font-bold text-sm text-[#C5A059] block mt-1">960 ج.م / ك</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE 4: ETHIOPIAN HABASHI COFFEE ================= */}
          {(viewMode === "all" || currentPage === 4) && (
            <div className="bg-white rounded-2xl border-2 border-[#C5A059]/40 p-5 sm:p-8 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
                <div className="flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-[#C5A059]" />
                  <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1A110B]">
                    3. البن الحبشي الإثيوبي الأصيل
                  </h2>
                </div>
                <span className="text-xs font-alexandria font-bold text-[#C5A059] bg-[#1A110B] px-3 py-1 rounded-full">
                  صفحة 4
                </span>
              </div>

              <p className="text-xs text-[#1A110A]/75 leading-relaxed">
                مهد القهوة الأسطوري عالمياً؛ حبوب إثيوبية برية ومغسولة منتقاة من أشهر المرتفعات بطابع فاكهي ونوتات زهرية عطرية لا تضاهى.
              </p>

              <div className="overflow-x-auto rounded-xl border border-[#1A110A]/15">
                <table className="w-full text-xs text-right font-alexandria">
                  <thead className="bg-[#1A110B] text-white font-bold">
                    <tr>
                      <th className="p-3">الصنف الإثيوبي</th>
                      <th className="p-3">الإيحاءات والمميزات</th>
                      <th className="p-3">ساده (للكيلو)</th>
                      <th className="p-3">محوج بالحبهان</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A110A]/10 bg-[#FAF8F5]">
                    <tr className="hover:bg-white transition-colors bg-amber-50/50">
                      <td className="p-3 font-bold text-[#1A110B]">بن حبشي هراري عريق (Harar)</td>
                      <td className="p-3 text-[11px] text-gray-600">عطرية نبيذية وإيحاءات التوت البري — تاج القهوة الحبشية</td>
                      <td className="p-3 font-bold text-[#C5A059]">960 ج.م</td>
                      <td className="p-3 font-bold text-[#1A110B]">1,080 ج.م</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-3 font-bold text-[#1A110B]">
                        بن حبشي سيدامو إثيوبي (Sidamo)
                        <span className="mr-1.5 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">جديد</span>
                      </td>
                      <td className="p-3 text-[11px] text-gray-600">نكهات زهرية ياسمينية وحموضة حمضيات ناعمة وقوام حريري</td>
                      <td className="p-3 font-bold text-[#C5A059]">920 ج.م</td>
                      <td className="p-3 font-bold text-[#1A110B]">1,040 ج.م</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-3 font-bold text-[#1A110B]">
                        بن حبشي ليمو إثيوبي مختص (Limu)
                        <span className="mr-1.5 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">جديد</span>
                      </td>
                      <td className="p-3 text-[11px] text-gray-600">حبوب مغسولة فاكهية نبيذية وتوابل ناعمة وحلاوة سكرية</td>
                      <td className="p-3 font-bold text-[#C5A059]">1,080 ج.م</td>
                      <td className="p-3 font-bold text-[#1A110B]">1,200 ج.م</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-3 font-bold text-[#1A110B]">بن حبشي لقميتي (Leqemti)</td>
                      <td className="p-3 text-[11px] text-gray-600">طعم بلدي فاكهي خفيف معتدل الحموضة وسهل الشرب</td>
                      <td className="p-3 font-bold text-[#C5A059]">680 ج.م</td>
                      <td className="p-3 font-bold text-[#1A110B]">800 ج.م</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-3 font-bold text-[#1A110B]">بن حبشي ديمي أصيل (Djimmah)</td>
                      <td className="p-3 text-[11px] text-gray-600">عمق بري تراثي ونفحات عسل وتوابل برية أصيلة</td>
                      <td className="p-3 font-bold text-[#C5A059]">800 ج.م</td>
                      <td className="p-3 font-bold text-[#1A110B]">920 ج.م</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= PAGE 5: BRAZILIAN & INDIAN ================= */}
          {(viewMode === "all" || currentPage === 5) && (
            <div className="bg-white rounded-2xl border-2 border-[#C5A059]/40 p-5 sm:p-8 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
                <div className="flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-[#C5A059]" />
                  <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1A110B]">
                    4. البن البرازيلي والهندي (الأساس والرغوة)
                  </h2>
                </div>
                <span className="text-xs font-alexandria font-bold text-[#C5A059] bg-[#1A110B] px-3 py-1 rounded-full">
                  صفحة 5
                </span>
              </div>

              {/* Brazilian Section */}
              <div className="space-y-2">
                <h3 className="font-amiri font-bold text-lg text-[#1A110B] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>البن البرازيلي (أصل التوليفات والنعومة)</span>
                </h3>
                <div className="overflow-x-auto rounded-xl border border-[#1A110A]/15">
                  <table className="w-full text-xs text-right font-alexandria">
                    <thead className="bg-[#1A110B] text-white font-bold">
                      <tr>
                        <th className="p-2.5">الصنف</th>
                        <th className="p-2.5">المميزات</th>
                        <th className="p-2.5">ساده (ك)</th>
                        <th className="p-2.5">محوج (ك)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A110A]/10 bg-[#FAF8F5]">
                      <tr className="hover:bg-white transition-colors">
                        <td className="p-2.5 font-bold">برازيلي سيرادو مختص (Cerrado)</td>
                        <td className="p-2.5 text-gray-600 text-[11px]">مكسرات محمصة وشوكولاتة وقوام كامل</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">880 ج.م</td>
                        <td className="p-2.5 font-bold text-[#1A110B]">1,000 ج.م</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="p-2.5 font-bold">برازيلي سانتوس الفاخر (Santos)</td>
                        <td className="p-2.5 text-gray-600 text-[11px]">نعومة استثنائية ونسبة مرارة منخفضة جداً</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">720 ج.م</td>
                        <td className="p-2.5 font-bold text-[#1A110B]">840 ج.م</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="p-2.5 font-bold">برازيلي ريو مينيو (Rio Minas)</td>
                        <td className="p-2.5 text-gray-600 text-[11px]">طعم كلاسيكي تراثي قوي وحدّة محبوبة</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">600 ج.م</td>
                        <td className="p-2.5 font-bold text-[#1A110B]">720 ج.م</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Indian Section */}
              <div className="space-y-2 pt-2">
                <h3 className="font-amiri font-bold text-lg text-[#1A110B] flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-[#C5A059]" />
                  <span>البن الهندي (الرغوة والكريمة العالية)</span>
                </h3>
                <div className="overflow-x-auto rounded-xl border border-[#1A110A]/15">
                  <table className="w-full text-xs text-right font-alexandria">
                    <thead className="bg-[#1A110B] text-white font-bold">
                      <tr>
                        <th className="p-2.5">الصنف</th>
                        <th className="p-2.5">المميزات</th>
                        <th className="p-2.5">ساده (ك)</th>
                        <th className="p-2.5">محوج (ك)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A110A]/10 bg-[#FAF8F5]">
                      <tr className="hover:bg-white transition-colors">
                        <td className="p-2.5 font-bold">هندي بلانتيشن أرابيكا (Plantation)</td>
                        <td className="p-2.5 text-gray-600 text-[11px]">مغسول من المرتفعات، حموضة خفيفة وتوابل</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">760 ج.م</td>
                        <td className="p-2.5 font-bold text-[#1A110B]">880 ج.م</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="p-2.5 font-bold">هندي أرابيكا أصيل (Arabica)</td>
                        <td className="p-2.5 text-gray-600 text-[11px]">نكهات عطرية وقوام كريمي ممتاز</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">840 ج.م</td>
                        <td className="p-2.5 font-bold text-[#1A110B]">960 ج.م</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="p-2.5 font-bold">هندي روبوستا شيري (Cherry Robusta)</td>
                        <td className="p-2.5 text-gray-600 text-[11px]">سر الوش الكثيف والكريمة المتماسكة والكافيين</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">560 ج.م</td>
                        <td className="p-2.5 font-bold text-[#1A110B]">680 ج.م</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE 6: WORLD ARABICAS ================= */}
          {(viewMode === "all" || currentPage === 6) && (
            <div className="bg-white rounded-2xl border-2 border-[#C5A059]/40 p-5 sm:p-8 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C5A059]" />
                  <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1A110B]">
                    5. أرابيكات العالم الفاخرة (كولومبي، يمني، جواتيمالا...)
                  </h2>
                </div>
                <span className="text-xs font-alexandria font-bold text-[#C5A059] bg-[#1A110B] px-3 py-1 rounded-full">
                  صفحة 6
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#1A110A]/15">
                <table className="w-full text-xs text-right font-alexandria">
                  <thead className="bg-[#1A110B] text-white font-bold">
                    <tr>
                      <th className="p-2.5">الصنف ومصدره</th>
                      <th className="p-2.5">الإيحاءات المميزة</th>
                      <th className="p-2.5">ساده (ك)</th>
                      <th className="p-2.5">محوج (ك)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A110A]/10 bg-[#FAF8F5]">
                    <tr className="hover:bg-white transition-colors bg-amber-50/40">
                      <td className="p-2.5 font-bold">كولومبي غامق فاخر (Dark Supremo)</td>
                      <td className="p-2.5 text-gray-600 text-[11px]">شوكولاتة داكنة وقوام مخملي مكثف</td>
                      <td className="p-2.5 font-bold text-[#C5A059]">1,040 ج.م</td>
                      <td className="p-2.5 font-bold text-[#1A110B]">1,160 ج.م</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2.5 font-bold">كولومبي سوبريمو وسط</td>
                      <td className="p-2.5 text-gray-600 text-[11px]">نعومة شوكولاتة وكراميل ناعم وتوازن حريري</td>
                      <td className="p-2.5 font-bold text-[#C5A059]">1,000 ج.م</td>
                      <td className="p-2.5 font-bold text-[#1A110B]">1,120 ج.م</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors bg-amber-100/40">
                      <td className="p-2.5 font-bold text-[#1A110B]">بن يمني مطري أصيل (Yemeni Matari)</td>
                      <td className="p-2.5 text-gray-600 text-[11px]">جوهرة البن العربي وأغلاها: نكهة خمرية وتوابل معقدة</td>
                      <td className="p-2.5 font-bold text-[#C5A059]">1,880 ج.م</td>
                      <td className="p-2.5 font-bold text-[#1A110B]">2,000 ج.م</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2.5 font-bold">جواتيمالا أنتيجوا بركاني</td>
                      <td className="p-2.5 text-gray-600 text-[11px]">كاكاو خام ودخان بركاني فاخر وحلاوة طبيعية</td>
                      <td className="p-2.5 font-bold text-[#C5A059]">1,040 ج.م</td>
                      <td className="p-2.5 font-bold text-[#1A110B]">1,160 ج.م</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2.5 font-bold">بيرو عضوي فاخر (Peru Organic)</td>
                      <td className="p-2.5 text-gray-600 text-[11px]">جبال الأنديز: شوكولاتة بالحليب ونقاء استثنائي</td>
                      <td className="p-2.5 font-bold text-[#C5A059]">1,040 ج.م</td>
                      <td className="p-2.5 font-bold text-[#1A110B]">1,160 ج.م</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2.5 font-bold">مكسيكي مرتفعات فاخر</td>
                      <td className="p-2.5 text-gray-600 text-[11px]">نكهة بندق دافئة وكراميل بني ونهاية متوازنة</td>
                      <td className="p-2.5 font-bold text-[#C5A059]">1,040 ج.م</td>
                      <td className="p-2.5 font-bold text-[#1A110B]">1,160 ج.م</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2.5 font-bold">كيني فاكهي قوي (Kenya AA)</td>
                      <td className="p-2.5 text-gray-600 text-[11px]">حموضة فوسفورية منعشة ومذاق كشمش أسود</td>
                      <td className="p-2.5 font-bold text-[#C5A059]">960 ج.م</td>
                      <td className="p-2.5 font-bold text-[#1A110B]">1,080 ج.م</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2.5 font-bold">هندوراس كلاسيك متوازن</td>
                      <td className="p-2.5 text-gray-600 text-[11px]">سلاسة فائقة وحلاوة خفيفة للاستهلاك اليومي</td>
                      <td className="p-2.5 font-bold text-[#C5A059]">960 ج.م</td>
                      <td className="p-2.5 font-bold text-[#1A110B]">1,080 ج.م</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2.5 font-bold">فيتنامي روبوستا منتقى</td>
                      <td className="p-2.5 text-gray-600 text-[11px]">تركيز كافيين عالي ودعم وش الفنجان</td>
                      <td className="p-2.5 font-bold text-[#C5A059]">520 ج.م</td>
                      <td className="p-2.5 font-bold text-[#1A110B]">640 ج.م</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= PAGE 7: FRENCH COFFEE & SPECIALTY FLAVORS ================= */}
          {(viewMode === "all" || currentPage === 7) && (
            <div className="bg-white rounded-2xl border-2 border-[#C5A059]/40 p-5 sm:p-8 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
                <div className="flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-[#C5A059]" />
                  <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1A110B]">
                    6. الفرنساويات والخلطات المميزة
                  </h2>
                </div>
                <span className="text-xs font-alexandria font-bold text-[#C5A059] bg-[#1A110B] px-3 py-1 rounded-full">
                  صفحة 7
                </span>
              </div>

              {/* French Hazelnut Showcase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#C5A059]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-amiri font-bold text-base text-[#1A110B]">
                      فرنساوي بندق العميد الفاخر
                    </h3>
                    <span className="text-[10px] bg-[#C5A059] text-white px-2 py-0.5 rounded font-bold">
                      الأكثر طلباً
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    أعلى فئات القهوة الفرنسية كريمة غنية وبندق محمص منتقى
                  </p>
                  <div className="pt-2 border-t border-dashed border-[#1A110A]/10 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>عادي ناعم:</span>
                      <strong className="font-price font-bold text-[#C5A059]">640 ج.م / ك</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>مع قطع بندق حقيقية:</span>
                      <strong className="font-price font-bold text-[#C5A059]">680 ج.م / ك</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#C5A059]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-amiri font-bold text-base text-[#1A110B]">
                      قهوة فرنسية بالبندق بدران
                    </h3>
                    <span className="text-[10px] bg-[#1A110B] text-white px-2 py-0.5 rounded font-bold">
                      خلطة بدران
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    مزيج متناغم من البن الخفيف والكريمة مع خلاصة البندق الطبيعي
                  </p>
                  <div className="pt-2 border-t border-dashed border-[#1A110A]/10 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>عادي ناعم:</span>
                      <strong className="font-price font-bold text-[#C5A059]">520 ج.م / ك</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>مع قطع بندق:</span>
                      <strong className="font-price font-bold text-[#C5A059]">600 ج.م / ك</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flavors Table */}
              <div className="space-y-2">
                <h3 className="font-amiri font-bold text-base text-[#1A110B]">
                  نكهات القهوة الفرنسية والمشروبات الساخنة
                </h3>
                <div className="overflow-x-auto rounded-xl border border-[#1A110A]/15">
                  <table className="w-full text-xs text-right font-alexandria">
                    <thead className="bg-[#1A110B] text-white font-bold">
                      <tr>
                        <th className="p-2.5">المشروب / النكهة</th>
                        <th className="p-2.5">سعر الكيلو الكامل</th>
                        <th className="p-2.5">سعر الـ 250 جم</th>
                        <th className="p-2.5">المواصفات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A110A]/10 bg-[#FAF8F5]">
                      <tr>
                        <td className="p-2.5 font-bold">قهوة فرنسية كلاسيك بالكريمة</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">480 ج.م</td>
                        <td className="p-2.5">120 ج.م</td>
                        <td className="p-2.5 text-gray-600 text-[11px]">ناعمة مخملية خفيفة</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">فرنساوي شوكولاتة / موكا / فانيليا / كراميل</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">600 ج.م</td>
                        <td className="p-2.5">150 ج.م</td>
                        <td className="p-2.5 text-gray-600 text-[11px]">نكهات سويسرية وبلجيكية فاخرة</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">هوت شوكليت بدران</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">520 ج.م</td>
                        <td className="p-2.5">130 ج.م</td>
                        <td className="p-2.5 text-gray-600 text-[11px]">كاكاو خام نقي عالي الدسامة</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">كوفي ميكس فرنسي</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">480 ج.م</td>
                        <td className="p-2.5">120 ج.م</td>
                        <td className="p-2.5 text-gray-600 text-[11px]">تحضير سريع متكامل</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">فرنساوي فواكه (فراولة، مانجو، خوخ، موز، تفاح، برتقال)</td>
                        <td className="p-2.5 font-bold text-[#C5A059]">600 ج.م</td>
                        <td className="p-2.5">150 ج.م</td>
                        <td className="p-2.5 text-gray-600 text-[11px]">ابتكار بدران الحصري المنعش</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE 8: HONEY, TAHINA & OFFICIAL POLICY ================= */}
          {(viewMode === "all" || currentPage === 8) && (
            <div className="bg-white rounded-2xl border-2 border-[#C5A059]/40 p-5 sm:p-8 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C5A059]" />
                  <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1A110B]">
                    7. العسل الطبيعي، الطحينة، والسياسة الرسمية
                  </h2>
                </div>
                <span className="text-xs font-alexandria font-bold text-[#C5A059] bg-[#1A110B] px-3 py-1 rounded-full">
                  صفحة 8
                </span>
              </div>

              {/* Honey & Tahina Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-amiri font-bold text-base text-[#1A110B]">
                    العسل الطبيعي النقي 100%
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-[#1A110A]/15">
                    <table className="w-full text-xs text-right font-alexandria">
                      <tbody className="divide-y divide-[#1A110A]/10 bg-[#FAF8F5]">
                        <tr>
                          <td className="p-2 font-bold">عسل زهور البرسيم</td>
                          <td className="p-2 font-bold text-[#C5A059]">185 ج.م (ك)</td>
                          <td className="p-2 text-gray-500">95 ج.م (نصف)</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold">عسل إسكوبير فاخر</td>
                          <td className="p-2 font-bold text-[#C5A059]">200 ج.م (ك)</td>
                          <td className="p-2 text-gray-500">110 ج.م (نصف)</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold">عسل موالح زجاج</td>
                          <td className="p-2 font-bold text-[#C5A059]">230 ج.م (ك)</td>
                          <td className="p-2 text-gray-500">120 ج.م (نصف)</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold">عسل مكسرات ملكي</td>
                          <td className="p-2 font-bold text-[#C5A059]">300 ج.م (ك)</td>
                          <td className="p-2 text-gray-500">200 ج.م (نصف)</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold">عسل يمني حضرمي</td>
                          <td className="p-2 font-bold text-[#C5A059]" colSpan={2}>575 ج.م (عبوة فاخرة)</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold">عسل شمع طبيعي</td>
                          <td className="p-2 font-bold text-[#C5A059]" colSpan={2}>285 ج.م (كيلو زجاج)</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold">عسل أسود صعيدي</td>
                          <td className="p-2 font-bold text-[#C5A059]">75 ج.م (ك)</td>
                          <td className="p-2 text-gray-500">45 ج.م (نصف)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-amiri font-bold text-base text-[#1A110B]">
                      طحينة سمسم بلدي صافية
                    </h3>
                    <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#1A110A]/15 space-y-1 text-xs font-alexandria">
                      <div className="flex justify-between py-1 border-b border-gray-200">
                        <span>عبوة 325 جرام (سمسم معصور بارد):</span>
                        <strong className="font-price font-bold text-[#C5A059]">95 ج.م</strong>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>عبوة 700 جرام عائلية:</span>
                        <strong className="font-price font-bold text-[#C5A059]">180 ج.م</strong>
                      </div>
                    </div>
                  </div>

                  {/* Special Offers Recap */}
                  <div className="space-y-2">
                    <h3 className="font-amiri font-bold text-base text-[#1A110B]">
                      العروض الخاصة الحالية
                    </h3>
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs font-alexandria space-y-1 text-amber-950">
                      <div className="flex justify-between">
                        <span>فنجان العميد (100% أرابيكا):</span>
                        <strong className="text-emerald-700 font-bold">25 ج.م (بدلاً من 40)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>عرض الـ 100 فتلة (ينسون + نعناع):</span>
                        <strong className="text-emerald-700 font-bold">34 ج.م (بدلاً من 60)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>سموزي فواكه طبيعية:</span>
                        <strong className="text-emerald-700 font-bold">40 ج.م (بدلاً من 60)</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Payment & Fulfillment Policy Notice Box */}
              <div className="bg-[#1A110B] text-white p-4 sm:p-5 rounded-2xl border-2 border-[#C5A059] shadow-lg space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] font-amiri font-bold text-base sm:text-lg">
                  <Award className="w-5 h-5" />
                  <span>سياسة تأكيد الطلب وسداد القيمة المعتمدة:</span>
                </div>
                <p className="font-alexandria text-xs sm:text-sm text-[#FAF8F5]/90 leading-relaxed font-light">
                  يتم سداد كامل قيمة الأوردر أثناء التأكيد عبر الواتساب (عبر إنستاباي أو فودافون كاش)، ولن يتم تجهيز أو طحن أو خروج أي أوردر إلا بعد تحصيل المبلغ كاملاً لضمان الجودة والطحن الطازج عند الاستلام.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-[#C5A059] font-alexandria border-t border-[#C5A059]/30">
                  <span>فرع ميت غمر — خدمة العملاء والطلبات عبر الواتساب</span>
                  <span>بُـــن بَـــدْرَان 🤎 طعم يميّزك ... وجودة تثق بها</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Zoom Modal for Scanned Page Inspection */}
      {selectedScanImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedScanImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <span className="font-amiri font-bold text-lg text-[#1A110B]">
                معاينة الصفحة الأصلية عالية الدقة
              </span>
              <button
                type="button"
                onClick={() => setSelectedScanImage(null)}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-[75vh]">
              <Image
                src={selectedScanImage}
                alt="معاينة الصفحة المكبرة"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

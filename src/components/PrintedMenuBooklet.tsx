"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Printer,
  FileDown,
  Sparkles,
  Coffee,
  Flame,
  Award,
  Phone,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Grid,
  BookOpen,
  Info,
} from "lucide-react";
import { PRODUCTS_CATALOG } from "@/data/products";
import { SPECIAL_OFFERS } from "@/data/offers";

export default function PrintedMenuBooklet() {
  const [viewMode, setViewMode] = useState<"booklet" | "all">("booklet");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 8;

  const handlePrint = () => {
    window.print();
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages));
  };

  return (
    <div className="space-y-6 animate-fadeIn text-right">
      {/* Top Controls Bar - Hidden on Print */}
      <div className="print:hidden bg-white p-4 sm:p-5 rounded-2xl border border-[#C5A059]/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#C5A059]/15 text-[#C5A059]">
              <BookOpen className="w-5 h-5" />
            </span>
            <h3 className="font-amiri text-lg sm:text-xl font-bold text-[#1A110B]">
              كتالوج ومنيو بن بدران الرسمي — الطبعة المحدثة 2026
            </h3>
          </div>
          <p className="font-alexandria text-xs text-[#1A110A]/70 mt-1">
            تصميم مخصص للطباعة والمشاركة، متطابق 100% مع أسعار الفروع والمتجر
            الإلكتروني.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto justify-end">
          {/* View Mode Toggle */}
          <div className="inline-flex bg-[#1A110A]/5 p-1 rounded-xl border border-[#1A110A]/10 text-xs font-bold font-alexandria">
            <button
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
              onClick={() => setViewMode("all")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "all"
                  ? "bg-[#1A110B] text-white shadow-xs"
                  : "text-[#1A110B] hover:bg-[#1A110A]/10"
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>عرض الكل</span>
            </button>
          </div>

          {/* Print / Save PDF Button */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08d47] text-[#1A110B] font-bold text-xs sm:text-sm font-alexandria rounded-xl shadow-xs hover:shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة المنيو / حفظ PDF</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="print:hidden bg-amber-50 border border-amber-300/80 rounded-xl p-3 text-xs text-amber-950 flex items-center justify-between gap-3 shadow-2xs font-alexandria">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            جميع الأسعار في هذا الكتالوج محدثة تلقائياً وتتضمن آخر تعديلات فرع ميت
            غمر (الفرنساويات الجديدة + سيدامو وليمو الحبشي).
          </span>
        </div>
        <span className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded shrink-0">
          نسخة معتمدة
        </span>
      </div>

      {/* Booklet Navigation Controls - Only in booklet mode */}
      {viewMode === "booklet" && (
        <div className="print:hidden flex items-center justify-between bg-white p-3 rounded-xl border border-[#C5A059]/30 shadow-2xs">
          <button
            onClick={prevPage}
            className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#1A110B] hover:text-white text-[#1A110B] border border-[#1A110A]/15 text-xs font-bold font-alexandria flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-[#C5A059]" />
            <span>الصفحة السابقة</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-alexandria font-bold text-xs text-[#1A110B]">
              صفحة <span className="text-[#C5A059]">{currentPage}</span> من{" "}
              {totalPages}
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-6 h-6 rounded-md text-[11px] font-bold font-price flex items-center justify-center transition-all cursor-pointer ${
                    currentPage === idx + 1
                      ? "bg-[#1A110B] text-[#C5A059]"
                      : "bg-[#FAF8F5] text-[#1A110A]/70 hover:bg-[#1A110A]/10"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={nextPage}
            className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#1A110B] hover:text-white text-[#1A110B] border border-[#1A110A]/15 text-xs font-bold font-alexandria flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>الصفحة التالية</span>
            <ChevronLeft className="w-4 h-4 text-[#C5A059]" />
          </button>
        </div>
      )}

      {/* ========================================================
          PRINT PAGES CONTAINER (PRINT STYLED A4 BOOKLET)
          ======================================================== */}
      <div className="space-y-8 print:space-y-0 print:block">
        {/* ================= PAGE 1: COVER PAGE ================= */}
        {(viewMode === "all" || currentPage === 1) && (
          <div className="print-page relative bg-[#1A110B] text-[#FAF8F5] rounded-2xl md:rounded-3xl border-2 border-[#C5A059] p-6 sm:p-10 md:p-14 shadow-xl overflow-hidden min-h-[620px] flex flex-col justify-between print:min-h-screen print:rounded-none print:border-none print:shadow-none print:p-8">
            {/* Background Texture Accents */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Ornamental Frame Border inside page */}
            <div className="absolute inset-3 sm:inset-4 border border-[#C5A059]/40 rounded-xl md:rounded-2xl pointer-events-none" />

            {/* Header / Brand Top */}
            <div className="relative z-10 flex items-center justify-between border-b border-[#C5A059]/30 pb-4 sm:pb-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#C5A059] text-[#1A110B] rounded-full text-[11px] font-bold font-alexandria">
                  طبعة رسمية معتمدة
                </span>
                <span className="text-xs text-[#FAF8F5]/70 font-alexandria">
                  2026 — 1447 هـ
                </span>
              </div>
              <div className="text-left font-alexandria text-xs text-[#C5A059] font-semibold">
                بيت البن اليمني الأصيل
              </div>
            </div>

            {/* Main Center Title & Logo */}
            <div className="relative z-10 my-auto py-8 sm:py-12 text-center space-y-4 sm:space-y-6">
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
                قائمة الأسعار الشاملة والكتالوج الرسمي لأرقى أنواع البن العالمي
                المحمص طازجاً على أصوله، والتوليفات الحصرية المبتكرة.
              </p>
            </div>

            {/* Footer / Branch Details */}
            <div className="relative z-10 border-t border-[#C5A059]/30 pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-alexandria text-[#FAF8F5]/80">
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
          <div className="print-page bg-white rounded-2xl border border-[#C5A059]/40 p-5 sm:p-8 shadow-md print:shadow-none print:border-none print:p-6 space-y-6">
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

            <p className="font-alexandria text-xs text-[#1A110A]/75 leading-relaxed">
              البن الكلاسيكي النقي المفضل لملايين عشاق القهوة، متوفر بكافة درجات
              التحميص الأربعة وأوزان تناسب مختلف الاحتياجات.
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
                      <td className="p-2.5 text-[11px] text-gray-600">
                        حبهان أخضر فاخر + مستكة يوناني
                      </td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2.5 font-bold">وسط محوج</td>
                      <td className="p-2.5 font-bold text-[#C5A059]">600 ج.م</td>
                      <td className="p-2.5">560 ج.م</td>
                      <td className="p-2.5 text-[11px] text-gray-600">
                        الخلطة الأكثر طلباً ومبيعاً
                      </td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2.5 font-bold">غامق محوج</td>
                      <td className="p-2.5 font-bold text-[#C5A059]">620 ج.م</td>
                      <td className="p-2.5">—</td>
                      <td className="p-2.5 text-[11px] text-gray-600">
                        قوام ثقيل ونكهة حبهان قوية
                      </td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="p-2.5 font-bold">محروق محوج</td>
                      <td className="p-2.5 font-bold text-[#C5A059]">680 ج.م</td>
                      <td className="p-2.5">—</td>
                      <td className="p-2.5 text-[11px] text-gray-600">
                        مرارة مركزة ومزاج عالي جداً
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Specialty Basics Quick Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#C5A059]/30 text-center">
                <span className="text-[11px] font-bold text-gray-600 block">
                  قهوة خضراء للتخسيس
                </span>
                <strong className="font-price font-bold text-base text-[#1A110B] block mt-1">
                  640 ج.م / ك
                </strong>
              </div>
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#C5A059]/30 text-center">
                <span className="text-[11px] font-bold text-gray-600 block">
                  قهوة عربي بالزعفران
                </span>
                <strong className="font-price font-bold text-base text-[#1A110B] block mt-1">
                  840 ج.م / ك
                </strong>
              </div>
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#C5A059]/30 text-center">
                <span className="text-[11px] font-bold text-gray-600 block">
                  شاي بدران السيلاني
                </span>
                <strong className="font-price font-bold text-base text-[#1A110B] block mt-1">
                  200 ج.م / ك
                </strong>
              </div>
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#C5A059]/30 text-center">
                <span className="text-[11px] font-bold text-gray-600 block">
                  نسكافيه جولد مجفف
                </span>
                <strong className="font-price font-bold text-base text-[#1A110B] block mt-1">
                  1,240 ج.م / ك
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 3: ROYAL BLENDS & ESPRESSO ================= */}
        {(viewMode === "all" || currentPage === 3) && (
          <div className="print-page bg-white rounded-2xl border border-[#C5A059]/40 p-5 sm:p-8 shadow-md print:shadow-none print:border-none print:p-6 space-y-6">
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

            <p className="font-alexandria text-xs text-[#1A110A]/75 leading-relaxed">
              توليفات بدران الحصرية التي تميزنا بها عبر السنين، محسوبة النسب
              بين أجود أصناف الأرابيكا العالمية والروبوستا العطرية.
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
                    <td className="p-3 font-bold text-[#1A110B]">
                      توليفة اسبيشيال بدران الملكية
                    </td>
                    <td className="p-3 text-[11px] text-gray-600">
                      سر عائلة بدران: مزيج سحري من 4 أصناف أرابيكا فاخرة
                    </td>
                    <td className="p-3 font-bold text-[#C5A059]">760 ج.م</td>
                    <td className="p-3 font-bold text-[#1A110B]">880 ج.م</td>
                  </tr>
                  <tr className="hover:bg-white transition-colors">
                    <td className="p-3 font-bold text-[#1A110B]">
                      توليفة السلطان الفاخرة
                    </td>
                    <td className="p-3 text-[11px] text-gray-600">
                      نكهة عميقة وقوام غني مصممة لصفوة الذواقة
                    </td>
                    <td className="p-3 font-bold text-[#C5A059]">760 ج.م</td>
                    <td className="p-3 font-bold text-[#1A110B]">880 ج.م</td>
                  </tr>
                  <tr className="hover:bg-white transition-colors">
                    <td className="p-3 font-bold text-[#1A110B]">
                      توليفة الملكي الراقية
                    </td>
                    <td className="p-3 text-[11px] text-gray-600">
                      مزيج كولومبي وهندي وبرازيلي متناسق بنكهة هادئة
                    </td>
                    <td className="p-3 font-bold text-[#C5A059]">800 ج.م</td>
                    <td className="p-3 font-bold text-[#1A110B]">920 ج.م</td>
                  </tr>
                  <tr className="hover:bg-white transition-colors">
                    <td className="p-3 font-bold text-[#1A110B]">
                      توليفة الأصلي التراثية
                    </td>
                    <td className="p-3 text-[11px] text-gray-600">
                      خلطة الأجداد التراثية التي انطلق بها محل بدران
                    </td>
                    <td className="p-3 font-bold text-[#C5A059]">880 ج.م</td>
                    <td className="p-3 font-bold text-[#1A110B]">1,000 ج.م</td>
                  </tr>
                  <tr className="hover:bg-white transition-colors">
                    <td className="p-3 font-bold text-[#1A110B]">
                      توليفة العميد الخاصة
                    </td>
                    <td className="p-3 text-[11px] text-gray-600">
                      توليفة ثقيلة منتقاة لعشاق التركيز والوش الكثيف
                    </td>
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
                  <span className="text-xs font-bold text-gray-700 block">
                    اسبريسو 30% أرابيكا
                  </span>
                  <span className="text-[11px] text-gray-500 block">
                    وش كثيف وكافيين عالي
                  </span>
                  <strong className="font-price font-bold text-sm text-[#C5A059] block mt-1">
                    680 ج.م / ك
                  </strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#1A110A]/10 text-center">
                  <span className="text-xs font-bold text-gray-700 block">
                    اسبريسو 50% أرابيكا
                  </span>
                  <span className="text-[11px] text-gray-500 block">
                    توازن مثالي بين الكريمة والنكهة
                  </span>
                  <strong className="font-price font-bold text-sm text-[#C5A059] block mt-1">
                    800 ج.م / ك
                  </strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#1A110A]/10 text-center">
                  <span className="text-xs font-bold text-gray-700 block">
                    اسبريسو 80% أرابيكا
                  </span>
                  <span className="text-[11px] text-gray-500 block">
                    نكهة أرابيكا أروماتية وكريمة ناعمة
                  </span>
                  <strong className="font-price font-bold text-sm text-[#C5A059] block mt-1">
                    960 ج.م / ك
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 4: ETHIOPIAN HABASHI COFFEE (UPDATED WITH SIDAMO & LIMU) ================= */}
        {(viewMode === "all" || currentPage === 4) && (
          <div className="print-page bg-white rounded-2xl border border-[#C5A059]/40 p-5 sm:p-8 shadow-md print:shadow-none print:border-none print:p-6 space-y-6">
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

            <p className="font-alexandria text-xs text-[#1A110A]/75 leading-relaxed">
              مهد القهوة الأسطوري عالمياً؛ حبوب إثيوبية برية ومغسولة منتقاة من
              أشهر المرتفعات بطابع فاكهي ونوتات زهرية عطرية لا تضاهى.
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
                    <td className="p-3 font-bold text-[#1A110B]">
                      بن حبشي هراري عريق (Harar)
                    </td>
                    <td className="p-3 text-[11px] text-gray-600">
                      عطرية نبيذية وإيحاءات التوت البري — تاج القهوة الحبشية
                    </td>
                    <td className="p-3 font-bold text-[#C5A059]">960 ج.م</td>
                    <td className="p-3 font-bold text-[#1A110B]">1,080 ج.م</td>
                  </tr>
                  <tr className="hover:bg-white transition-colors">
                    <td className="p-3 font-bold text-[#1A110B]">
                      بن حبشي سيدامو إثيوبي (Sidamo)
                      <span className="mr-1.5 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                        جديد
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-gray-600">
                      نكهات زهرية ياسمينية وحموضة حمضيات ناعمة وقوام حريري
                    </td>
                    <td className="p-3 font-bold text-[#C5A059]">920 ج.م</td>
                    <td className="p-3 font-bold text-[#1A110B]">1,040 ج.م</td>
                  </tr>
                  <tr className="hover:bg-white transition-colors">
                    <td className="p-3 font-bold text-[#1A110B]">
                      بن حبشي ليمو إثيوبي مختص (Limu)
                      <span className="mr-1.5 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                        جديد
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-gray-600">
                      حبوب مغسولة فاكهية نبيذية وتوابل ناعمة وحلاوة سكرية
                    </td>
                    <td className="p-3 font-bold text-[#C5A059]">1,080 ج.م</td>
                    <td className="p-3 font-bold text-[#1A110B]">1,200 ج.م</td>
                  </tr>
                  <tr className="hover:bg-white transition-colors">
                    <td className="p-3 font-bold text-[#1A110B]">
                      بن حبشي لقميتي (Leqemti)
                    </td>
                    <td className="p-3 text-[11px] text-gray-600">
                      طعم بلدي فاكهي خفيف معتدل الحموضة وسهل الشرب
                    </td>
                    <td className="p-3 font-bold text-[#C5A059]">680 ج.م</td>
                    <td className="p-3 font-bold text-[#1A110B]">800 ج.م</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Note on Customization */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#C5A059]/30 text-xs font-alexandria flex items-center gap-2">
              <Info className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>
                <strong>تنويه التحضير:</strong> يمكن طلب أي صنف حبشي ساده أو
                محوج بحبهان هندي أخضر درجة أولى، أو طحنه اسبريسو أو تركي أو فلتر.
              </span>
            </div>
          </div>
        )}

        {/* ================= PAGE 5: BRAZILIAN & INDIAN BEANS ================= */}
        {(viewMode === "all" || currentPage === 5) && (
          <div className="print-page bg-white rounded-2xl border border-[#C5A059]/40 p-5 sm:p-8 shadow-md print:shadow-none print:border-none print:p-6 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-[#C5A059]" />
                <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1A110B]">
                  4. البن البرازيلي والبن الهندي
                </h2>
              </div>
              <span className="text-xs font-alexandria font-bold text-[#C5A059] bg-[#1A110B] px-3 py-1 rounded-full">
                صفحة 5
              </span>
            </div>

            {/* Brazilian Beans */}
            <div className="space-y-2">
              <h3 className="font-amiri font-bold text-lg text-[#1A110B]">
                أولاً: البن البرازيلي (حجر أساس القوام والنكهة المتوازنة)
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[#1A110A]/15">
                <table className="w-full text-xs text-right font-alexandria">
                  <thead className="bg-[#1A110B] text-white font-bold">
                    <tr>
                      <th className="p-2.5">الصنف البرازيلي</th>
                      <th className="p-2.5">المميزات والنكهة</th>
                      <th className="p-2.5">ساده (ك)</th>
                      <th className="p-2.5">محوج (ك)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A110A]/10 bg-[#FAF8F5]">
                    <tr>
                      <td className="p-2.5 font-bold">برازيلي سيرادو مختص</td>
                      <td className="p-2.5 text-gray-600">
                        شوكولاتة داكنة ومكسرات محمصة وقوام كامل
                      </td>
                      <td className="p-2.5 font-bold text-[#C5A059]">880 ج.م</td>
                      <td className="p-2.5 font-bold">1,000 ج.م</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">برازيلي سانتوس الفاخر</td>
                      <td className="p-2.5 text-gray-600">
                        نعومة حريرية ومرارة منخفضة جداً — الأكثر شعبية
                      </td>
                      <td className="p-2.5 font-bold text-[#C5A059]">720 ج.م</td>
                      <td className="p-2.5 font-bold">840 ج.م</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">برازيلي ريو مينيو</td>
                      <td className="p-2.5 text-gray-600">
                        طعم تقليدي قوي وحدّة محبوبة لعشاق القهوة الثقيلة
                      </td>
                      <td className="p-2.5 font-bold text-[#C5A059]">600 ج.م</td>
                      <td className="p-2.5 font-bold">720 ج.م</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Indian Beans */}
            <div className="space-y-2 pt-2">
              <h3 className="font-amiri font-bold text-lg text-[#1A110B]">
                ثانياً: البن الهندي (سر الوش الكثيف والرغوة المتماسكة)
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[#1A110A]/15">
                <table className="w-full text-xs text-right font-alexandria">
                  <thead className="bg-[#1A110B] text-white font-bold">
                    <tr>
                      <th className="p-2.5">الصنف الهندي</th>
                      <th className="p-2.5">المميزات والنكهة</th>
                      <th className="p-2.5">ساده (ك)</th>
                      <th className="p-2.5">محوج (ك)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A110A]/10 bg-[#FAF8F5]">
                    <tr>
                      <td className="p-2.5 font-bold">هندي أرابيكا أصيل</td>
                      <td className="p-2.5 text-gray-600">
                        حبوب أرابيكا هندية مختارة بنكهات عطرية وقوام كريمي
                      </td>
                      <td className="p-2.5 font-bold text-[#C5A059]">840 ج.م</td>
                      <td className="p-2.5 font-bold">960 ج.م</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">هندي بلانتيشن فاخر</td>
                      <td className="p-2.5 text-gray-600">
                        أرابيكا مغسولة من المرتفعات، حموضة خفيفة وتوابل ناعمة
                      </td>
                      <td className="p-2.5 font-bold text-[#C5A059]">760 ج.م</td>
                      <td className="p-2.5 font-bold">880 ج.م</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">هندي روبوستا شيري</td>
                      <td className="p-2.5 text-gray-600">
                        سر وش الفنجان الكثيف والكافيين العالي
                      </td>
                      <td className="p-2.5 font-bold text-[#C5A059]">560 ج.م</td>
                      <td className="p-2.5 font-bold">680 ج.م</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 6: WORLD ARABICAS & SINGLE ORIGINS ================= */}
        {(viewMode === "all" || currentPage === 6) && (
          <div className="print-page bg-white rounded-2xl border border-[#C5A059]/40 p-5 sm:p-8 shadow-md print:shadow-none print:border-none print:p-6 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-[#C5A059]" />
                <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1A110B]">
                  5. أرابيكات نادرة حول العالم
                </h2>
              </div>
              <span className="text-xs font-alexandria font-bold text-[#C5A059] bg-[#1A110B] px-3 py-1 rounded-full">
                صفحة 6
              </span>
            </div>

            <p className="font-alexandria text-xs text-[#1A110A]/75 leading-relaxed">
              أندر وأعرق محاصيل البن الأرابيكا العالمية المعتمدة من أشهر مزارع
              أمريكا الجنوبية والوسطى وإفريقيا وآسيا.
            </p>

            <div className="overflow-x-auto rounded-xl border border-[#1A110A]/15">
              <table className="w-full text-xs text-right font-alexandria">
                <thead className="bg-[#1A110B] text-white font-bold">
                  <tr>
                    <th className="p-2.5">المحصول والمنشأ</th>
                    <th className="p-2.5">المواصفات والإيحاءات</th>
                    <th className="p-2.5">ساده (ك)</th>
                    <th className="p-2.5">محوج (ك)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A110A]/10 bg-[#FAF8F5]">
                  <tr className="bg-amber-50/70">
                    <td className="p-2.5 font-bold text-[#1A110B]">
                      بن يمني مطري أصيل (Yemen)
                    </td>
                    <td className="p-2.5 text-gray-600">
                      جوهرة البن العربي؛ إيحاءات خمرية وتوابل وشوكولاتة معقدة
                    </td>
                    <td className="p-2.5 font-bold text-[#C5A059]">1,880 ج.م</td>
                    <td className="p-2.5 font-bold">2,000 ج.م</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">نيكاراجوا (Nicaragua)</td>
                    <td className="p-2.5 text-gray-600">
                      حبوب مرتفعات متوازنة مع إيحاءات مكسرات وسكر بني
                    </td>
                    <td className="p-2.5 font-bold text-[#C5A059]">1,120 ج.م</td>
                    <td className="p-2.5 font-bold">1,240 ج.م</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">
                      كولومبي سوبريمو (Colombia)
                    </td>
                    <td className="p-2.5 text-gray-600">
                      حموضة متوازنة نقية مع حلاوة الكراميل والمكسرات
                    </td>
                    <td className="p-2.5 font-bold text-[#C5A059]">
                      1,000 - 1,040 ج.م
                    </td>
                    <td className="p-2.5 font-bold">1,120 - 1,160 ج.م</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">بيرو عضوي (Peru)</td>
                    <td className="p-2.5 text-gray-600">
                      نقاء استثنائي وطعم شوكولاتة بالحليب ناعمة
                    </td>
                    <td className="p-2.5 font-bold text-[#C5A059]">1,040 ج.م</td>
                    <td className="p-2.5 font-bold">1,160 ج.م</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">
                      جواتيمالا أنتيجوا (Guatemala)
                    </td>
                    <td className="p-2.5 text-gray-600">
                      تربة بركانية تمنحه نكهة الكاكاو الخام ودخان خفيف
                    </td>
                    <td className="p-2.5 font-bold text-[#C5A059]">1,040 ج.م</td>
                    <td className="p-2.5 font-bold">1,160 ج.م</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">مكسيكي فاخر (Mexico)</td>
                    <td className="p-2.5 text-gray-600">
                      نكهة عطرية غنية ودرجات تحميص متعددة
                    </td>
                    <td className="p-2.5 font-bold text-[#C5A059]">
                      1,040 - 1,080 ج.م
                    </td>
                    <td className="p-2.5 font-bold">1,160 - 1,200 ج.م</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">
                      كوستاريكا تارازو (Costa Rica)
                    </td>
                    <td className="p-2.5 text-gray-600">
                      حموضة مشرقة ونكهات فواكه مجففة وعسل
                    </td>
                    <td className="p-2.5 font-bold text-[#C5A059]">1,080 ج.م</td>
                    <td className="p-2.5 font-bold">1,200 ج.م</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">كيني AA فاكهي (Kenya)</td>
                    <td className="p-2.5 text-gray-600">
                      حموضة منعشة ومذاق الكشمش الأسود وتوت العليق
                    </td>
                    <td className="p-2.5 font-bold text-[#C5A059]">
                      960 - 1,000 ج.م
                    </td>
                    <td className="p-2.5 font-bold">1,080 - 1,120 ج.م</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">هندوراس كلاسيك (Honduras)</td>
                    <td className="p-2.5 text-gray-600">
                      أرابيكا ناعمة متوازنة ومثالية للشرب اليومي
                    </td>
                    <td className="p-2.5 font-bold text-[#C5A059]">960 ج.م</td>
                    <td className="p-2.5 font-bold">1,080 ج.م</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">سومطرة إندونيسي (Sumatra)</td>
                    <td className="p-2.5 text-gray-600">
                      طابع ترابي عميق وشوكولاتة ثقيلة
                    </td>
                    <td className="p-2.5 font-bold text-[#C5A059]">960 ج.م</td>
                    <td className="p-2.5 font-bold">1,080 ج.م</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= PAGE 7: FRENCH COFFEE (UPDATED +40 EGP/KG) ================= */}
        {(viewMode === "all" || currentPage === 7) && (
          <div className="print-page bg-white rounded-2xl border border-[#C5A059]/40 p-5 sm:p-8 shadow-md print:shadow-none print:border-none print:p-6 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-[#C5A059]" />
                <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1A110B]">
                  6. الفرنساويات والخلطات الخاصة
                </h2>
              </div>
              <span className="text-xs font-alexandria font-bold text-[#C5A059] bg-[#1A110B] px-3 py-1 rounded-full">
                صفحة 7
              </span>
            </div>

            <p className="font-alexandria text-xs text-[#1A110A]/75 leading-relaxed">
              خلطات القهوة الفرنسية الناعمة بالكريمة الغنية والبندق والمكسرات
              والنكهات الطبيعية — (الأسعار محدثة ومعتمدة).
            </p>

            {/* Hazelnut French Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#C5A059]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-amiri font-bold text-base text-[#1A110B]">
                    قهوة فرنسية بندق العميد
                  </h3>
                  <span className="text-[10px] bg-[#C5A059] text-white px-2 py-0.5 rounded font-bold">
                    نخب أول
                  </span>
                </div>
                <p className="text-[11px] text-gray-600">
                  أجود أنواع البن الفرنسي بالبندق التركي المحمص والكريمة الغنية
                </p>
                <div className="pt-2 border-t border-dashed border-[#1A110A]/10 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>عادي ناعم:</span>
                    <strong className="font-price font-bold text-[#C5A059]">
                      680 ج.م / ك
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>مع قطع بندق مقرمشة:</span>
                    <strong className="font-price font-bold text-[#C5A059]">
                      720 ج.م / ك
                    </strong>
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
                    <strong className="font-price font-bold text-[#C5A059]">
                      560 ج.م / ك
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>مع قطع بندق:</span>
                    <strong className="font-price font-bold text-[#C5A059]">
                      640 ج.م / ك
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Flavors Grid Table */}
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
                      <td className="p-2.5 font-bold">
                        قهوة فرنسية كلاسيك بالكريمة
                      </td>
                      <td className="p-2.5 font-bold text-[#C5A059]">520 ج.م</td>
                      <td className="p-2.5">130 ج.م</td>
                      <td className="p-2.5 text-gray-600 text-[11px]">
                        ناعمة مخملية خفيفة
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">
                        فرنساوي شوكولاتة / موكا / فانيليا / كراميل
                      </td>
                      <td className="p-2.5 font-bold text-[#C5A059]">640 ج.م</td>
                      <td className="p-2.5">160 ج.م</td>
                      <td className="p-2.5 text-gray-600 text-[11px]">
                        نكهات سويسرية وبلجيكية فاخرة
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">هوت شوكليت بدران</td>
                      <td className="p-2.5 font-bold text-[#C5A059]">560 ج.م</td>
                      <td className="p-2.5">140 ج.م</td>
                      <td className="p-2.5 text-gray-600 text-[11px]">
                        كاكاو خام نقي عالي الدسامة
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">كوفي ميكس فرنسي</td>
                      <td className="p-2.5 font-bold text-[#C5A059]">520 ج.م</td>
                      <td className="p-2.5">130 ج.م</td>
                      <td className="p-2.5 text-gray-600 text-[11px]">
                        تحضير سريع متكامل
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">
                        فرنساوي فواكه (فراولة، مانجو، خوخ، موز، تفاح)
                      </td>
                      <td className="p-2.5 font-bold text-[#C5A059]">640 ج.م</td>
                      <td className="p-2.5">160 ج.م</td>
                      <td className="p-2.5 text-gray-600 text-[11px]">
                        ابتكار بدران الحصري المنعش
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 8: HONEY, TAHINA & POLICY ================= */}
        {(viewMode === "all" || currentPage === 8) && (
          <div className="print-page bg-white rounded-2xl border border-[#C5A059]/40 p-5 sm:p-8 shadow-md print:shadow-none print:border-none print:p-6 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C5A059]" />
                <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1A110B]">
                  7. العسل الطبيعي، الطحينة، وسياسة الطلب
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
                        <td className="p-2 font-bold text-[#C5A059]">
                          185 ج.م (ك)
                        </td>
                        <td className="p-2 text-gray-500">95 ج.م (نصف)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">عسل إسكوبير فاخر</td>
                        <td className="p-2 font-bold text-[#C5A059]">
                          200 ج.م (ك)
                        </td>
                        <td className="p-2 text-gray-500">110 ج.م (نصف)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">عسل موالح زجاج</td>
                        <td className="p-2 font-bold text-[#C5A059]">
                          230 ج.م (ك)
                        </td>
                        <td className="p-2 text-gray-500">120 ج.م (نصف)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">عسل مكسرات ملكي</td>
                        <td className="p-2 font-bold text-[#C5A059]">
                          300 ج.م (ك)
                        </td>
                        <td className="p-2 text-gray-500">200 ج.م (نصف)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">عسل يمني حضرمي</td>
                        <td className="p-2 font-bold text-[#C5A059]" colSpan={2}>
                          575 ج.م (عبوة فاخرة)
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">عسل شمع طبيعي</td>
                        <td className="p-2 font-bold text-[#C5A059]" colSpan={2}>
                          285 ج.م (كيلو زجاج)
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">عسل أسود صعيدي</td>
                        <td className="p-2 font-bold text-[#C5A059]">
                          75 ج.م (ك)
                        </td>
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
                      <strong className="font-price font-bold text-[#C5A059]">
                        95 ج.م
                      </strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>عبوة 700 جرام عائلية:</span>
                      <strong className="font-price font-bold text-[#C5A059]">
                        180 ج.م
                      </strong>
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
                      <strong className="text-emerald-700 font-bold">
                        25 ج.م (بدلاً من 40)
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>عرض الـ 100 فتلة (ينسون + نعناع):</span>
                      <strong className="text-emerald-700 font-bold">
                        34 ج.م (بدلاً من 60)
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>سموزي فواكه طبيعية:</span>
                      <strong className="text-emerald-700 font-bold">
                        40 ج.م (بدلاً من 60)
                      </strong>
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
                يتم سداد كامل قيمة الأوردر أثناء التأكيد عبر الواتساب (عبر إنستاباي
                أو فودافون كاش)، ولن يتم تجهيز أو طحن أو خروج أي أوردر إلا بعد
                تحصيل المبلغ كاملاً لضمان الجودة والطحن الطازج عند الاستلام.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-[#C5A059] font-alexandria border-t border-[#C5A059]/30">
                <span>فرع ميت غمر — خدمة العملاء والطلبات عبر الواتساب</span>
                <span>بُـــن بَـــدْرَان 🤎 طعم يميّزك ... وجودة تثق بها</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

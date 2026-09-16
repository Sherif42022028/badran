"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Coffee,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShoppingBag,
  Sliders,
  CheckCircle2,
  HelpCircle,
  Flame,
  Scale,
  Clock,
  Feather,
  Sun,
  Droplets,
  Gauge,
  Zap,
  Heart,
  Check,
  Compass,
} from "lucide-react";
import {
  FINDER_QUESTIONS,
  calculateBlendRecommendation,
  RecommendationResult,
} from "@/data/blendFinderQuestions";
import { Product } from "@/types/products";

interface BlendFinderProps {
  onApplyToBuilder?: (preset: {
    grams: Record<string, number>;
    preps: Record<string, "sada" | "mohawaj">;
    name: string;
  }) => void;
  onAddToCart?: (
    item: Product,
    selectedPrice: { unit: string; label: string; price: number },
    quantity?: number
  ) => void;
}

type QuizStep = "intro" | "questions" | "calculating" | "result";

// Authentic, restrained SVG micro-icons matching Badran's heritage design
const OPTION_ICONS: Record<string, React.ReactNode> = {
  light: <Feather className="w-4 h-4 text-[#C5A059]" />,
  medium: <Scale className="w-4 h-4 text-[#C5A059]" />,
  dark: <Flame className="w-4 h-4 text-[#C5A059]" />,
  choco: <Coffee className="w-4 h-4 text-[#C5A059]" />,
  fruity: <Sparkles className="w-4 h-4 text-[#C5A059]" />,
  spice: <Flame className="w-4 h-4 text-[#C5A059]" />,
  smoky: <Flame className="w-4 h-4 text-[#C5A059]" />,
  no_acidity: <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />,
  mild_acidity: <Sun className="w-4 h-4 text-[#C5A059]" />,
  high_acidity: <Sparkles className="w-4 h-4 text-[#C5A059]" />,
  sada: <Coffee className="w-4 h-4 text-[#C5A059]" />,
  mohawaj: <Sparkles className="w-4 h-4 text-[#C5A059]" />,
  turkish: <Coffee className="w-4 h-4 text-[#C5A059]" />,
  filter: <Droplets className="w-4 h-4 text-[#C5A059]" />,
  espresso: <Gauge className="w-4 h-4 text-[#C5A059]" />,
  high_caff: <Zap className="w-4 h-4 text-[#C5A059]" />,
  med_caff: <Scale className="w-4 h-4 text-[#C5A059]" />,
  low_caff: <Heart className="w-4 h-4 text-[#C5A059]" />,
};

export default function BlendFinder({
  onApplyToBuilder,
  onAddToCart,
}: BlendFinderProps) {
  const [step, setStep] = useState<QuizStep>("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [justSelectedOption, setJustSelectedOption] = useState<string | null>(null);
  const [addedDirectlyAlert, setAddedDirectlyAlert] = useState<boolean>(false);

  const totalQuestions = FINDER_QUESTIONS.length;
  const currentQuestion = FINDER_QUESTIONS[currentQuestionIndex];
  const progressPercent = Math.round(
    ((currentQuestionIndex + 1) / totalQuestions) * 100
  );

  // Start Quiz
  const handleStart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
    setStep("questions");
  };

  // Handle Option Selection
  const handleSelectOption = (optionId: string) => {
    setJustSelectedOption(optionId);

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: optionId,
    };
    setAnswers(updatedAnswers);

    // Subtle tactile delay before advancing
    setTimeout(() => {
      setJustSelectedOption(null);
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setStep("calculating");
        const computedResult = calculateBlendRecommendation(updatedAnswers);
        setResult(computedResult);

        setTimeout(() => {
          setStep("result");
        }, 1100);
      }
    }, 200);
  };

  // Back Button
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      setStep("intro");
    }
  };

  // Reset Quiz
  const handleReset = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
    setStep("intro");
  };

  // Apply to Builder
  const handleApplyToBuilderClick = () => {
    if (!result) return;

    const gramsMap: Record<string, number> = {};
    const prepsMap: Record<string, "sada" | "mohawaj"> = {};

    result.components.forEach((c) => {
      gramsMap[c.bean.id] = c.grams;
      prepsMap[c.bean.id] = c.preparation;
    });

    if (onApplyToBuilder) {
      onApplyToBuilder({
        grams: gramsMap,
        preps: prepsMap,
        name: result.blendTitle,
      });
    }

    const builderEl = document.getElementById("blend-builder");
    if (builderEl) {
      builderEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Add to Cart Directly
  const handleAddToCartDirectly = () => {
    if (!result || !onAddToCart) return;

    const blendProduct: Product = {
      id: `quiz-blend-${Date.now()}`,
      name: result.blendTitle,
      category: "blends",
      description: `${result.recipeSummary} | ${result.explanation}`,
      tier: 1,
      variantType: "none",
      basePrice: result.pricing.totalPrice,
      unitLabel: `${result.totalGrams} جم`,
    };

    onAddToCart(
      blendProduct,
      {
        unit: `${result.totalGrams} جم`,
        label: `${result.totalGrams} جم - ${result.recipeSummary}`,
        price: result.pricing.totalPrice,
      },
      1
    );

    setAddedDirectlyAlert(true);
    setTimeout(() => setAddedDirectlyAlert(false), 4000);
  };

  return (
    <section
      id="blend-finder"
      className="py-4 md:py-8 px-4 max-w-7xl mx-auto scroll-mt-24"
      aria-label="قسم مش لاقي توليفتك"
    >
      <div className="framed-section p-5 sm:p-8 md:p-10 bg-white">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center mb-8 border-b border-dashed border-[#C5A059]/40 pb-6">
          <span className="solid-badge text-xs md:text-sm mb-3 py-1 px-4 inline-flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <span>مش لاقي توليفتك؟</span>
          </span>

          <h2 className="font-calligraphy font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1A110B] leading-tight mt-1">
            دليل الذوق البلدي.. نجمعلك أقرب توليفة لمزاجك
          </h2>

          <p className="font-alexandria text-xs sm:text-sm text-[#1A110A]/75 max-w-2xl mx-auto mt-2.5 font-light leading-relaxed">
            جاوب على 6 أسئلة حسّية بسيطة وواضحة، وخبرة مطحنة بدران هتجمعلك نسب
            الخلطة المظبوطة بدقة بالجرام، مع التحويجة الأصلية اللي تظبط وش فنجانك.
          </p>
        </div>

        {/* ================= SCREEN 1: INTRO ================= */}
        {step === "intro" && (
          <div className="max-w-2xl mx-auto text-center py-4">
            {/* 3 Authentic Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-center font-alexandria text-xs text-[#1A110B]">
              <div className="flex items-center justify-center gap-2 p-3 bg-[#FAF8F5] rounded-lg border border-[#1A110B]/10">
                <Scale className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span className="font-semibold">وزن دقيق لأعلى صنفين</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-[#FAF8F5] rounded-lg border border-[#1A110B]/10">
                <Flame className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span className="font-semibold">على أصول التحميص البلدي</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-[#FAF8F5] rounded-lg border border-[#1A110B]/10">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span className="font-semibold">في أقل من دقيقة واحدة</span>
              </div>
            </div>

            {/* Action CTA */}
            <div>
              <button
                onClick={handleStart}
                className="w-full sm:w-auto bg-[#1A110B] hover:bg-[#2A1D15] text-[#FAF8F5] font-alexandria font-bold text-sm sm:text-base px-9 py-3.5 rounded-lg border border-[#C5A059]/50 transition-all duration-200 shadow-xs active:scale-95 inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Coffee className="w-4 h-4 text-[#C5A059]" />
                <span>ابدأ وجمّع توليفتك الآن</span>
                <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN 2: QUESTIONS ================= */}
        {step === "questions" && currentQuestion && (
          <div className="max-w-2xl mx-auto">
            {/* Navigation & Progress Header */}
            <div className="flex items-center justify-between gap-4 mb-3">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-xs font-alexandria font-semibold text-[#1A110B]/60 hover:text-[#1A110B] transition-colors cursor-pointer py-1"
                aria-label="الرجوع للسؤال السابق"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>السابق</span>
              </button>

              <span className="font-alexandria text-xs font-bold text-[#C5A059]">
                سؤال {currentQuestionIndex + 1} من {totalQuestions}
              </span>
            </div>

            {/* Progress Gauge */}
            <div className="w-full bg-[#FAF8F5] border border-[#1A110B]/10 h-2 rounded-full overflow-hidden mb-8">
              <div
                className="bg-[#C5A059] h-full transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Question Title */}
            <div className="text-center mb-7">
              <h3 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1A110B] mb-1.5 leading-snug">
                {currentQuestion.text}
              </h3>
              {currentQuestion.subtitle && (
                <p className="font-tajawal text-xs sm:text-sm text-[#1A110B]/65">
                  {currentQuestion.subtitle}
                </p>
              )}
            </div>

            {/* Option Cards (Craft Tasting Cards) */}
            <div
              className={`grid gap-3 ${
                currentQuestion.options.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : currentQuestion.options.length === 4
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-3"
              }`}
            >
              {currentQuestion.options.map((option) => {
                const isSelected =
                  justSelectedOption === option.id ||
                  answers[currentQuestion.id] === option.id;

                const icon = OPTION_ICONS[option.id] || (
                  <Coffee className="w-4 h-4 text-[#C5A059]" />
                );

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`text-right p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 relative ${
                      isSelected
                        ? "bg-[#1A110B] text-white border-[#C5A059] shadow-sm"
                        : "bg-[#FAF8F5] hover:bg-[#F3EFE9] text-[#1A110B] border-[#1A110B]/12 hover:border-[#C5A059]/50 shadow-2xs"
                    }`}
                  >
                    {/* Top Row: Refined Micro-icon & Check Indicator */}
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-[#C5A059]/60 bg-white/10"
                            : "border-[#1A110B]/10 bg-white"
                        }`}
                      >
                        {icon}
                      </div>

                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-[#C5A059] bg-[#C5A059] text-white"
                            : "border-[#1A110B]/20"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                    </div>

                    {/* Text Details */}
                    <div>
                      <h4
                        className={`font-alexandria font-bold text-sm leading-snug mb-1 ${
                          isSelected ? "text-white" : "text-[#1A110B]"
                        }`}
                      >
                        {option.label}
                      </h4>
                      {option.sublabel && (
                        <p
                          className={`font-tajawal text-xs leading-relaxed ${
                            isSelected ? "text-white/75" : "text-[#1A110B]/60"
                          }`}
                        >
                          {option.sublabel}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="text-center mt-5 text-[11px] font-tajawal text-[#1A110B]/45">
              اضغط على أي خيار للانتقال المباشر للسؤال التالي
            </div>
          </div>
        )}

        {/* ================= SCREEN 3: CALCULATING ================= */}
        {step === "calculating" && (
          <div className="max-w-md mx-auto text-center py-10">
            <div className="relative mx-auto w-14 h-14 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
              <Coffee className="w-6 h-6 text-[#C5A059]" />
            </div>

            <h3 className="font-amiri text-xl sm:text-2xl font-bold text-[#1A110B] mb-1.5">
              جاري موازنة حبوب البن وحساب النسب...
            </h3>
            <p className="font-tajawal text-xs sm:text-sm text-[#1A110B]/65">
              بنطابق إجاباتك مع حبوب البن ونسب التحميص البلدية بمطحنة بدران.
            </p>
          </div>
        )}

        {/* ================= SCREEN 4: RESULT SPEC SHEET ================= */}
        {step === "result" && result && (
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
              <span className="solid-badge text-xs py-0.5 px-3 mb-2 inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>توليفة معتمدة وموزونة لمزاجك</span>
              </span>
              <h3 className="font-calligraphy text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A110B] mb-1">
                دي توليفتك المقترحة
              </h3>
              <p className="font-alexandria text-xs sm:text-sm text-[#C5A059] font-semibold">
                {result.recipeSummary}
              </p>
            </div>

            {/* Spec Card */}
            <div className="bg-[#FAF8F5] rounded-xl border border-[#1A110B]/12 p-4 sm:p-5 mb-5 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-alexandria font-semibold text-[#1A110B]/75 mb-2.5">
                <span>توزيع النسب المئوية (إجمالي {result.totalGrams} جم)</span>
                <span>{result.preparation === "mohawaj" ? "محوج بالحبهان والمستكة" : "ساده صافي"}</span>
              </div>

              {/* Segmented Ratio Bar */}
              <div className="w-full h-4 rounded-md overflow-hidden flex mb-4 bg-gray-200">
                {result.components.map((comp, idx) => (
                  <div
                    key={comp.bean.id}
                    className="h-full flex items-center justify-center text-[10px] font-price font-bold text-white transition-all"
                    style={{
                      width: `${comp.percentage}%`,
                      backgroundColor: comp.bean.color || (idx === 0 ? "#1A110B" : "#C5A059"),
                    }}
                  >
                    {comp.percentage >= 18 ? `${comp.percentage}%` : ""}
                  </div>
                ))}
              </div>

              {/* Components Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-dashed border-[#1A110B]/10">
                {result.components.map((comp) => (
                  <div
                    key={comp.bean.id}
                    className="p-3 rounded-lg bg-white border border-[#1A110B]/8 flex items-start gap-2.5"
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0 mt-1"
                      style={{ backgroundColor: comp.bean.color || "#C5A059" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="font-alexandria text-xs sm:text-sm font-bold text-[#1A110B] truncate">
                          {comp.bean.name}
                        </span>
                        <span className="font-price font-bold text-xs text-[#C5A059] shrink-0">
                          {comp.percentage}% ({comp.grams} جم)
                        </span>
                      </div>
                      <p className="font-tajawal text-[11px] text-[#1A110B]/60 mt-0.5 leading-snug">
                        {comp.bean.blendRole}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why This Blend Box */}
            <div className="bg-[#F7F4EF] border-r-3 border-r-[#C5A059] border border-[#1A110B]/10 rounded-lg p-3.5 sm:p-4 mb-5 text-right">
              <h4 className="font-alexandria text-xs font-bold text-[#1A110B] mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>ليه التوليفة دي معمولة على مقاسك؟</span>
              </h4>
              <p className="font-tajawal text-xs leading-relaxed text-[#1A110B]/80">
                {result.explanation}
              </p>
            </div>

            {/* Price Overview Banner */}
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#FAF8F5] border border-[#C5A059]/30 mb-5">
              <div>
                <span className="font-alexandria text-xs text-[#1A110B]/70 block">
                  الوزن والسعر التقديري
                </span>
                <span className="font-alexandria text-xs font-bold text-[#1A110B]">
                  عبوة {result.totalGrams} جم طازة
                </span>
              </div>
              <div className="text-left">
                <span className="font-price text-xl sm:text-2xl font-bold text-[#1A110B]">
                  {result.pricing.totalPrice}
                </span>
                <span className="font-tajawal text-xs text-[#1A110B]/70 mr-1 font-bold">
                  ج.م
                </span>
              </div>
            </div>

            {/* Direct Added Success Alert */}
            {addedDirectlyAlert && (
              <div className="mb-4 p-2.5 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-[#1B7F3D] font-tajawal text-xs font-bold flex items-center justify-center gap-2 text-center">
                <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                <span>تمت إضافة التوليفة إلى سلة الطلبات بنجاح!</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-center mb-4 font-alexandria text-xs">
              <button
                onClick={handleApplyToBuilderClick}
                className="flex-1 bg-white hover:bg-[#FAF8F5] text-[#1A110B] font-bold py-3 px-4 rounded-lg border border-[#C5A059] transition-all shadow-2xs active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-[#C5A059]" />
                <span>أضفها لتوليفتك على مزاجك (تعديل)</span>
              </button>

              <button
                onClick={handleAddToCartDirectly}
                className="flex-1 bg-[#1A110B] hover:bg-[#2A1D15] text-[#FAF8F5] font-bold py-3 px-4 rounded-lg border border-[#C5A059]/50 transition-all shadow-2xs active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                <span>أضيفها للسلة فوراً (شراء مباشر)</span>
              </button>
            </div>

            {/* Retake */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-tajawal text-[#1A110B]/55 hover:text-[#C5A059] transition-colors cursor-pointer py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة الاختبار والبدء من جديد</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

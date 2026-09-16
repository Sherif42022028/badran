"use client";

import { useState } from "react";
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

    // Smooth delay for visual tap confirmation before advancing
    setTimeout(() => {
      setJustSelectedOption(null);
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Last question completed -> show calculating screen
        setStep("calculating");
        const computedResult = calculateBlendRecommendation(updatedAnswers);
        setResult(computedResult);

        // 1.2s realistic calculating delay for psychological trust
        setTimeout(() => {
          setStep("result");
        }, 1200);
      }
    }, 220);
  };

  // Go Back to Previous Question
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

  // 1. Apply to manual BlendBuilder
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

    // Smooth scroll down to the manual builder
    const builderEl = document.getElementById("blend-builder");
    if (builderEl) {
      builderEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 2. Add directly to Shopping Cart
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
      className="py-8 md:py-14 px-3 sm:px-5 max-w-5xl mx-auto scroll-mt-20"
      aria-label="قسم مش لاقي توليفتك"
    >
      <div className="relative rounded-2xl border border-[#C5A059]/40 bg-[#FAF8F5] shadow-xl overflow-hidden p-5 sm:p-8 md:p-10 transition-all duration-300">
        
        {/* Subtle Decorative Background Accents */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#3D120E]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* ================= SCREEN 1: INTRO ================= */}
        {step === "intro" && (
          <div className="relative z-10 text-center py-4 sm:py-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A110B]/5 border border-[#C5A059]/30 text-xs sm:text-sm font-tajawal font-bold text-[#C5A059] mb-4">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>مساعد الذوق الشخصي من بن بدران</span>
            </div>

            <h2 className="font-amiri text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A110B] mb-4 leading-snug">
              مش لاقي توليفتك؟ سيبها على خبرتنا
            </h2>

            <p className="font-tajawal text-base sm:text-lg text-[#1A110B]/80 max-w-2xl mx-auto mb-8 leading-relaxed">
              جاوب على 6 أسئلة حسّية بسيطة واحد ورا التاني، ونجمعلك أقرب توليفة
              تفصيلية لذوقك ومزاجك مع نسب الجرامات وطريقة التحويج الأنسب لفنجانك.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm font-tajawal text-[#1A110B]/70 mb-8">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                بدون كتابة أو مصطلحات معقدة
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                تاخد أقل من دقيقة واحدة
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                مبنية على أصول التحميص البلدي
              </span>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleStart}
                className="w-full sm:w-auto bg-[#1A110B] hover:bg-[#2A1D15] text-[#FAF8F5] font-alexandria font-bold text-base sm:text-lg px-9 py-4 rounded-xl border border-[#C5A059]/50 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-3 cursor-pointer group"
              >
                <Coffee className="w-5 h-5 text-[#C5A059] group-hover:rotate-12 transition-transform" />
                <span>ابدأ وجمّع توليفتك الآن</span>
                <ArrowLeft className="w-5 h-5 text-[#C5A059] group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN 2: QUESTIONS ================= */}
        {step === "questions" && currentQuestion && (
          <div className="relative z-10">
            {/* Top Navigation & Progress Header */}
            <div className="flex items-center justify-between gap-4 mb-5">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-tajawal font-bold text-[#1A110B]/70 hover:text-[#1A110B] hover:bg-black/5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                aria-label="الرجوع للسؤال السابق"
              >
                <ArrowRight className="w-4 h-4" />
                <span>رجوع</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-tajawal font-bold text-[#C5A059] bg-[#1A110B]/5 px-3 py-1 rounded-full border border-[#C5A059]/25">
                  سؤال {currentQuestionIndex + 1} من {totalQuestions}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#1A110B]/10 h-2 rounded-full overflow-hidden mb-8">
              <div
                className="bg-gradient-to-l from-[#C5A059] to-[#9E7A32] h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Question Title & Subtitle */}
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <h3 className="font-amiri text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A110B] mb-2 leading-snug">
                {currentQuestion.text}
              </h3>
              {currentQuestion.subtitle && (
                <p className="font-tajawal text-sm sm:text-base text-[#1A110B]/70">
                  {currentQuestion.subtitle}
                </p>
              )}
            </div>

            {/* Options Cards (3-4 Cards per Question) */}
            <div
              className={`grid gap-3.5 sm:gap-4 max-w-2xl mx-auto ${
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

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`text-right p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 text-right relative overflow-hidden group ${
                      isSelected
                        ? "bg-[#1A110B] text-white border-[#C5A059] shadow-md scale-[1.02]"
                        : "bg-white hover:bg-[#F3EFE9] text-[#1A110B] border-[#1A110B]/12 hover:border-[#C5A059]/60 shadow-xs hover:shadow-sm"
                    }`}
                  >
                    {/* Top row: Emoji & Selection Indicator */}
                    <div className="flex items-center justify-between w-full">
                      <span className="text-2xl sm:text-3xl filter drop-shadow-xs group-hover:scale-110 transition-transform">
                        {option.emoji || "☕"}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-[#C5A059] bg-[#C5A059] text-white"
                            : "border-[#1A110B]/20 group-hover:border-[#C5A059]"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>

                    {/* Bottom row: Text & Sublabel */}
                    <div className="mt-1">
                      <h4
                        className={`font-alexandria font-bold text-sm sm:text-base leading-snug mb-1 ${
                          isSelected ? "text-white" : "text-[#1A110B]"
                        }`}
                      >
                        {option.label}
                      </h4>
                      {option.sublabel && (
                        <p
                          className={`font-tajawal text-xs leading-relaxed ${
                            isSelected ? "text-white/80" : "text-[#1A110B]/60"
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

            {/* Quick helper footer */}
            <div className="text-center mt-6 text-[11px] sm:text-xs font-tajawal text-[#1A110B]/50">
              اضغط على أي اختيار للانتقال مباشرة للسؤال التالي
            </div>
          </div>
        )}

        {/* ================= SCREEN 3: CALCULATING ================= */}
        {step === "calculating" && (
          <div className="relative z-10 text-center py-12 sm:py-16">
            <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#C5A059]/20 border-t-[#C5A059] animate-spin" />
              <Coffee className="w-8 h-8 text-[#C5A059] animate-pulse" />
            </div>

            <h3 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1A110B] mb-2">
              بنجمعلك توليفتك المثالية...
            </h3>
            <p className="font-tajawal text-sm sm:text-base text-[#1A110B]/70 max-w-md mx-auto">
              بنطابق إجاباتك مع حبوب البن ونسب التحميص البلدية لنوصل لأعلى فنجان
              يظبط مزاجك.
            </p>
          </div>
        )}

        {/* ================= SCREEN 4: RESULT REVEAL ================= */}
        {step === "result" && result && (
          <div className="relative z-10">
            {/* Header Badge */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 bg-[#C5A059]/15 text-[#8C6D2B] border border-[#C5A059]/40 text-xs sm:text-sm font-tajawal font-bold px-3.5 py-1 rounded-full mb-3">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                توليفة مقترحة مفصلة على ذوقك
              </span>
              <h3 className="font-amiri text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A110B] mb-2 leading-tight">
                دي توليفتك المقترحة
              </h3>
              <p className="font-tajawal text-sm sm:text-base text-[#1A110B]/75 max-w-xl mx-auto">
                {result.recipeSummary}
              </p>
            </div>

            {/* Blend Visual Ratio Meter */}
            <div className="bg-white rounded-xl border border-[#1A110B]/10 p-5 sm:p-6 mb-6 shadow-xs max-w-2xl mx-auto">
              <div className="flex items-center justify-between text-xs font-tajawal font-bold text-[#1A110B]/70 mb-2">
                <span>توزيع نسب الخلطة (إجمالي {result.totalGrams} جم)</span>
                <span>النوع: {result.preparation === "mohawaj" ? "محوج بالحبهان والمستكة" : "ساده صافي"}</span>
              </div>

              {/* Multi-color ratio bar */}
              <div className="w-full h-5 rounded-lg overflow-hidden flex shadow-inner mb-4 bg-gray-100">
                {result.components.map((comp, idx) => (
                  <div
                    key={comp.bean.id}
                    className="h-full flex items-center justify-center text-[10px] font-price font-bold text-white transition-all"
                    style={{
                      width: `${comp.percentage}%`,
                      backgroundColor: comp.bean.color || (idx === 0 ? "#1A110B" : "#C5A059"),
                    }}
                    title={`${comp.bean.name}: ${comp.percentage}%`}
                  >
                    {comp.percentage >= 15 ? `${comp.percentage}%` : ""}
                  </div>
                ))}
              </div>

              {/* Components Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-dashed border-[#1A110B]/10">
                {result.components.map((comp) => (
                  <div
                    key={comp.bean.id}
                    className="p-3 rounded-lg bg-[#FAF8F5] border border-[#1A110B]/8 flex items-start gap-3"
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0 mt-1"
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
                      <p className="font-tajawal text-[11px] text-[#1A110B]/60 mt-0.5 leading-snug line-clamp-2">
                        {comp.bean.blendRole}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why this blend? (Personalized Rationale) */}
            <div className="bg-[#FAF8F5] border-r-4 border-r-[#C5A059] border border-[#1A110B]/10 rounded-xl p-4 sm:p-5 mb-6 max-w-2xl mx-auto text-right">
              <h4 className="font-alexandria text-xs sm:text-sm font-bold text-[#1A110B] mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#C5A059]" />
                ليه التوليفة دي معمولة على مقاسك؟
              </h4>
              <p className="font-tajawal text-xs sm:text-sm text-[#1A110B]/80 leading-relaxed">
                {result.explanation}
              </p>
            </div>

            {/* Price & Weight Overview Banner */}
            <div className="max-w-2xl mx-auto flex items-center justify-between p-4 rounded-xl bg-white border border-[#C5A059]/30 mb-6 shadow-xs">
              <div>
                <span className="font-tajawal text-xs text-[#1A110B]/70 block">
                  الوزن والسعر التقديري للتوليفة
                </span>
                <span className="font-alexandria text-sm font-bold text-[#1A110B]">
                  عبوة {result.totalGrams} جم طازة
                </span>
              </div>
              <div className="text-left">
                <span className="font-price text-2xl sm:text-3xl font-bold text-[#1A110B]">
                  {result.pricing.totalPrice}
                </span>
                <span className="font-tajawal text-xs text-[#1A110B]/70 mr-1 font-bold">
                  ج.م
                </span>
              </div>
            </div>

            {/* Added Directly Success Alert */}
            {addedDirectlyAlert && (
              <div className="max-w-2xl mx-auto mb-5 p-3 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-[#1B7F3D] font-tajawal text-xs sm:text-sm font-bold flex items-center justify-center gap-2 text-center animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                <span>تمت إضافة توليفتك المقترحة إلى سلة الطلبات بنجاح!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 items-stretch justify-center mb-5">
              {/* Button 1: Modify in BlendBuilder */}
              <button
                onClick={handleApplyToBuilderClick}
                className="flex-1 bg-[#FAF8F5] hover:bg-white text-[#1A110B] font-alexandria font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl border border-[#C5A059] hover:border-[#1A110B] transition-all shadow-xs active:scale-95 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Sliders className="w-4 h-4 text-[#C5A059] group-hover:rotate-45 transition-transform" />
                <span>أضفها لتوليفتك على مزاجك (تعديل)</span>
              </button>

              {/* Button 2: Add to Cart directly */}
              <button
                onClick={handleAddToCartDirectly}
                className="flex-1 bg-[#1A110B] hover:bg-[#2A1D15] text-[#FAF8F5] font-alexandria font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl border border-[#C5A059]/60 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <ShoppingBag className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" />
                <span>أضيفها للسلة على طول (شراء مباشر)</span>
              </button>
            </div>

            {/* Retake Link */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-tajawal font-bold text-[#1A110B]/60 hover:text-[#C5A059] transition-colors cursor-pointer py-1"
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

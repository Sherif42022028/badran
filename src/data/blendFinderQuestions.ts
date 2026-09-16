import { BLEND_COFFEE_BEANS, BlendBeanOrigin } from "@/data/blendOrigins";
import { calculateCustomBlend, BlendCalculationResult } from "@/lib/blendPricing";

export type BeanArchetype = "حبشي" | "برازيلي" | "هندي" | "كولومبي_غامق" | "أرابيكا";

export interface QuestionOption {
  id: string;
  label: string;
  sublabel?: string;
  emoji?: string;
  iconName?: string;
  scores?: Partial<Record<BeanArchetype, number>>;
  preparation?: "sada" | "mohawaj";
}

export interface FinderQuestion {
  id: string;
  text: string;
  subtitle?: string;
  options: QuestionOption[];
}

// Map archetypes to actual catalog beans from blendOrigins
export const ARCHETYPE_BEAN_MAP: Record<BeanArchetype, string> = {
  "حبشي": "hab-har",       // بن حبشي هراري إثيوبي عريق
  "برازيلي": "br-san",     // بن برازيلي سانتوس الفاخر
  "هندي": "in-rob",        // بن هندي روبوستا شيري
  "كولومبي_غامق": "ar-col-dark", // بن كولومبي غامق فاخر
  "أرابيكا": "ar-col-med", // بن كولومبي سوبريمو وسط
};

export const FINDER_QUESTIONS: FinderQuestion[] = [
  {
    id: "q1_body",
    text: "تحب قهوتك تبقى إيه؟",
    subtitle: "اختر الإحساس الأول اللي بتتمناه في فنجانك",
    options: [
      {
        id: "light",
        label: "خفيفة ومنعشة",
        sublabel: "نقية وسلسة على المعدة",
        emoji: "🍃",
        scores: { "حبشي": 3, "أرابيكا": 2 },
      },
      {
        id: "medium",
        label: "متوسطة ومتزنة",
        sublabel: "مظبوطة بميزان دهب بدون مرارة حادة",
        emoji: "⚖️",
        scores: { "برازيلي": 3, "أرابيكا": 1 },
      },
      {
        id: "dark",
        label: "تقيلة وقوية",
        sublabel: "قوام ثقيل ومزاج عالي يملى العين",
        emoji: "🔥",
        scores: { "هندي": 3, "كولومبي_غامق": 3 },
      },
    ],
  },
  {
    id: "q2_flavor",
    text: "إيه الطعم اللي بيسعدك أكتر؟",
    subtitle: "النغمة الأساسية اللي بتحب تحس بيها على لسانك",
    options: [
      {
        id: "choco",
        label: "شوكولاتة ومكسرات",
        sublabel: "نكهة كلاسيكية دافية ومخملية",
        emoji: "🍫",
        scores: { "برازيلي": 3, "كولومبي_غامق": 1 },
      },
      {
        id: "fruity",
        label: "فواكه وطعم منعش",
        sublabel: "إيحاءات توت وزهور طبيعية ساحرة",
        emoji: "🍒",
        scores: { "حبشي": 3 },
      },
      {
        id: "spice",
        label: "توابل دافية زي القرفة",
        sublabel: "طابع شرقي عريق بلمسة بهار ناعم",
        emoji: "🪵",
        scores: { "هندي": 2, "أرابيكا": 1 },
      },
      {
        id: "smoky",
        label: "طعم محمص وقوي (دخاني)",
        sublabel: "تحميص عميق ونكهة غنية محروقة بحرفية",
        emoji: "☕",
        scores: { "كولومبي_غامق": 3, "هندي": 1 },
      },
    ],
  },
  {
    id: "q3_acidity",
    text: "حموضة القهوة بتحبها إزاي؟",
    subtitle: "الحموضة هي الطعم الفاكهي الخفيف المنعش في القهوة الراقية",
    options: [
      {
        id: "no_acidity",
        label: "مش عايزها خالص، حلاوة واتزان بس",
        sublabel: "طعم كلاسيكي ناعم بدون أي لسعة",
        emoji: "🍯",
        scores: { "برازيلي": 3, "هندي": 1 },
      },
      {
        id: "mild_acidity",
        label: "شوية حموضة حلوة وخفيفة",
        sublabel: "توازن راقي بين الحلاوة والانتعاش",
        emoji: "🍊",
        scores: { "أرابيكا": 3, "برازيلي": 1 },
      },
      {
        id: "high_acidity",
        label: "حموضة واضحة زي الفاكهة",
        sublabel: "لمحبي القهوة المختصة والفاكهية الحيوية",
        emoji: "🍇",
        scores: { "حبشي": 3 },
      },
    ],
  },
  {
    id: "q4_prep",
    text: "ساده ولا محوج؟",
    subtitle: "طريقة إعداد الخلطة الأصلية من مطحنة بدران",
    options: [
      {
        id: "sada",
        label: "ساده",
        sublabel: "بن صافي نقي يبرز طعم الحبة الأصلي",
        emoji: "🤎",
        preparation: "sada",
      },
      {
        id: "mohawaj",
        label: "محوج (هيل وقرفة)",
        sublabel: "تحويجة بدران البلدية بالحبان الأخضر والمستكة",
        emoji: "✨",
        preparation: "mohawaj",
      },
    ],
  },
  {
    id: "q5_brew",
    text: "بتحضرها إزاي غالبًا؟",
    subtitle: "طريقة التحضير بتحدد الطحن ونوع الحبة الأنسب للوش والاستخلاص",
    options: [
      {
        id: "turkish",
        label: "كنكة تركي (مع الوش)",
        sublabel: "فنجان قهوة تركي شرقي بوش متماسك",
        emoji: "🫖",
        scores: { "هندي": 2, "برازيلي": 2 },
      },
      {
        id: "filter",
        label: "فلتر / دريب / V60",
        sublabel: "استخلاص بطيء صافي يبرز النكهات العطرية",
        emoji: "💧",
        scores: { "حبشي": 3, "أرابيكا": 2 },
      },
      {
        id: "espresso",
        label: "إسبريسو أو موكا بوت",
        sublabel: "استخلاص مضغوط وكريمة ذهبية كثيفة",
        emoji: "⚡",
        scores: { "برازيلي": 2, "كولومبي_غامق": 2, "هندي": 2 },
      },
    ],
  },
  {
    id: "q6_caffeine",
    text: "عايز الكافيين يبقى قد إيه؟",
    subtitle: "مستوى التركيز والصحيان اللي بتدور عليه",
    options: [
      {
        id: "high_caff",
        label: "قوي، يصحيني فوراً",
        sublabel: "جرعة كافيين عالية تبدأ بيها يومك بقوة",
        emoji: "🚀",
        scores: { "هندي": 3 },
      },
      {
        id: "med_caff",
        label: "متوسط وموزون",
        sublabel: "تركيز مظبوط ومريح طوال اليوم",
        emoji: "🌤️",
        scores: { "برازيلي": 2, "أرابيكا": 2 },
      },
      {
        id: "low_caff",
        label: "مش مهتم بالكافيين قد الطعم",
        sublabel: "الاستمتاع بالنكهة والعطرية هو الأساس",
        emoji: "🌸",
        scores: { "حبشي": 2, "كولومبي_غامق": 2 },
      },
    ],
  },
];

export interface RecommendationResult {
  blendTitle: string;
  recipeSummary: string;
  explanation: string;
  preparation: "sada" | "mohawaj";
  totalGrams: number;
  components: Array<{
    bean: BlendBeanOrigin;
    percentage: number;
    grams: number;
    preparation: "sada" | "mohawaj";
  }>;
  pricing: BlendCalculationResult;
}

/**
 * Calculate recommended blend based on recorded user answers.
 */
export function calculateBlendRecommendation(
  answers: Record<string, string>
): RecommendationResult {
  // 1. Initialize archetype scores
  const scores: Record<BeanArchetype, number> = {
    "حبشي": 0,
    "برازيلي": 0,
    "هندي": 0,
    "كولومبي_غامق": 0,
    "أرابيكا": 0,
  };

  let preparation: "sada" | "mohawaj" = "sada";

  // 2. Accumulate scores and determine preparation
  for (const q of FINDER_QUESTIONS) {
    const selectedOptionId = answers[q.id];
    if (!selectedOptionId) continue;

    const opt = q.options.find((o) => o.id === selectedOptionId);
    if (!opt) continue;

    if (opt.preparation) {
      preparation = opt.preparation;
    }

    if (opt.scores) {
      for (const arch of Object.keys(opt.scores) as BeanArchetype[]) {
        const val = opt.scores[arch] || 0;
        scores[arch] += val;
      }
    }
  }

  // 3. Sort archetypes descending
  const sortedArchetypes = (Object.keys(scores) as BeanArchetype[]).sort(
    (a, b) => scores[b] - scores[a]
  );

  const top1 = sortedArchetypes[0];
  const top2 = sortedArchetypes[1];

  const score1 = scores[top1] || 1;
  const score2 = scores[top2] || 0;

  let ratio1 = 100;
  let ratio2 = 0;

  // If top bean is more than double the second, make it single-origin 100%
  if (score2 === 0 || score1 > score2 * 2) {
    ratio1 = 100;
    ratio2 = 0;
  } else {
    // Round to nearest 5%
    const totalScore = score1 + score2;
    const rawRatio1 = (score1 / totalScore) * 100;
    ratio1 = Math.min(80, Math.max(20, Math.round(rawRatio1 / 5) * 5));
    ratio2 = 100 - ratio1;
  }

  const defaultTotalWeight = 250; // Grams
  const grams1 = ratio2 === 0 ? defaultTotalWeight : Math.round((defaultTotalWeight * ratio1) / 100);
  const grams2 = ratio2 === 0 ? 0 : defaultTotalWeight - grams1;

  // 4. Resolve bean entities from BLEND_COFFEE_BEANS
  const beanId1 = ARCHETYPE_BEAN_MAP[top1];
  const bean1 = BLEND_COFFEE_BEANS.find((b) => b.id === beanId1) || BLEND_COFFEE_BEANS[0];

  const components: RecommendationResult["components"] = [
    {
      bean: bean1,
      percentage: ratio1,
      grams: grams1,
      preparation,
    },
  ];

  if (ratio2 > 0) {
    const beanId2 = ARCHETYPE_BEAN_MAP[top2];
    const bean2 = BLEND_COFFEE_BEANS.find((b) => b.id === beanId2) || BLEND_COFFEE_BEANS[1];
    components.push({
      bean: bean2,
      percentage: ratio2,
      grams: grams2,
      preparation,
    });
  }

  // 5. Calculate pricing via existing calculation engine
  const pricingComponents = components.map((c) => ({
    bean: c.bean,
    grams: c.grams,
    preparation: c.preparation,
  }));

  const pricing = calculateCustomBlend(pricingComponents, "سادة", []);

  // 6. Formulate recipe summary and personalized explanation
  const prepLabel = preparation === "mohawaj" ? "محوج" : "ساده";
  const partsSummary = components
    .map((c) => `${c.percentage}% ${c.bean.name.replace(" الفاخر", "").replace(" أصيل", "").replace(" إثيوبي عريق", "")} (${prepLabel})`)
    .join(" + ");

  const blendTitle = `توليفة ذوقك الخاصة (${partsSummary})`;

  // Personalized explanation logic based on user choices
  const explanationParts: string[] = [];
  if (answers.q1_body === "dark") {
    explanationParts.push("اخترنا لك قواماً غنياً وثقيلاً يُشبع رغبتك في فنجان قوي");
  } else if (answers.q1_body === "light") {
    explanationParts.push("اخترنا لك توليفة ناعمة وخفيفة على المعدة تحتفظ بالانتعاش");
  } else {
    explanationParts.push("اخترنا لك توليفة متوازنة ومضبوطة تجمع بين النعومة وعمق الطعم");
  }

  if (answers.q2_flavor === "choco") {
    explanationParts.push("بلمسات واضحة من الشوكولاتة والمكسرات المحمصة");
  } else if (answers.q2_flavor === "fruity") {
    explanationParts.push("مع نفحات عطرية وفاكهية ناعمة تأسر الحواس");
  } else if (answers.q2_flavor === "smoky") {
    explanationParts.push("بتحميص عميق ونكهة دخانية دافية لأصحاب المزاج العالي");
  } else if (answers.q2_flavor === "spice") {
    explanationParts.push("مع نغمات توابل دافية تمنح الفنجان طابعاً شرقياً أصيلاً");
  }

  if (answers.q6_caffeine === "high_caff") {
    explanationParts.push("ودعمنا النسبة بحبوب تمنحك وشاً متماسكاً وجرعة صحيان فورية.");
  } else {
    explanationParts.push("بنسبة كافيين مريحة تناسب استمتاعك بالقهوة طوال اليوم.");
  }

  const explanation = explanationParts.join(" ") + (preparation === "mohawaj" ? "، متبلة بتحويجة بدران البلدية بالحبان الأخضر." : "، ساده بيور 100%.");

  return {
    blendTitle,
    recipeSummary: partsSummary,
    explanation,
    preparation,
    totalGrams: defaultTotalWeight,
    components,
    pricing,
  };
}

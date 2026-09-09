import { BlendBeanOrigin } from "@/data/blendOrigins";

export interface SelectedBlendComponent {
  bean: BlendBeanOrigin;
  grams: number; // >= 1
}

export interface BlendCalculationResult {
  totalGrams: number;
  coffeePrice: number;
  cardamomPrice: number;
  additionsPrice: number;
  totalPrice: number;
  weightedKiloPrice: number;
  componentsRatio: Array<{
    bean: BlendBeanOrigin;
    grams: number;
    percentage: number;
    subtotal: number;
  }>;
  summaryRecipe: string;
}

export const CARDAMOM_OPTIONS = [
  { id: "سادة", label: "سادة بدون حبهان", pricePerKilo: 0 },
  { id: "محوج خفيف", label: "محوج خفيف (+80 ج.م/ك)", pricePerKilo: 80 },
  { id: "محوج وسط", label: "محوج وسط (+120 ج.م/ك)", pricePerKilo: 120 },
  { id: "محوج رويال", label: "محوج رويال سوبر (+180 ج.م/ك)", pricePerKilo: 180 },
] as const;

export const ROAST_OPTIONS = ["فاتح", "وسط", "غامق", "محروق"] as const;

export const GRIND_OPTIONS = [
  "تركي ناعم كلاسيكي (مع الوش)",
  "اسبريسو مكائن احترافي",
  "فلتر وتقطير (V60 / Chemex)",
  "فرنش برس وكولد برو",
  "حبوب كاملة (بدون طحن)",
] as const;

export const ADDITIONS_LIST = [
  { id: "مستكة يوناني", label: "مستكة يوناني نقية", priceFixed: 20 },
  { id: "زعفران حر", label: "زعفران إيراني حر فاخر", priceFixed: 35 },
  { id: "زر ورد", label: "زر ورد جبلي معطر", priceFixed: 15 },
  { id: "جوزة الطيب", label: "جوزة الطيب وقرنفل", priceFixed: 15 },
] as const;

/**
 * Calculates weighted average price, total grams, and breakdown for a custom coffee blend.
 */
export function calculateCustomBlend(
  selectedComponents: SelectedBlendComponent[],
  cardamomId: string = "سادة",
  selectedAdditions: string[] = []
): BlendCalculationResult {
  const validComponents = selectedComponents.filter((c) => c.grams > 0);
  const totalGrams = validComponents.reduce((sum, c) => sum + c.grams, 0);

  if (totalGrams === 0) {
    return {
      totalGrams: 0,
      coffeePrice: 0,
      cardamomPrice: 0,
      additionsPrice: 0,
      totalPrice: 0,
      weightedKiloPrice: 0,
      componentsRatio: [],
      summaryRecipe: "",
    };
  }

  // 1. Raw Coffee Price: sum of (kiloPrice * grams / 1000)
  let coffeePrice = 0;
  const componentsRatio = validComponents.map((c) => {
    const subtotal = Math.round((c.bean.kiloPrice * c.grams) / 1000);
    coffeePrice += (c.bean.kiloPrice * c.grams) / 1000;
    const percentage = Math.round((c.grams / totalGrams) * 100);
    return {
      bean: c.bean,
      grams: c.grams,
      percentage,
      subtotal,
    };
  });

  coffeePrice = Math.round(coffeePrice);

  // 2. Cardamom adjustment (proportional to total grams)
  const cardamomOpt =
    CARDAMOM_OPTIONS.find((c) => c.id === cardamomId) || CARDAMOM_OPTIONS[0];
  const cardamomPrice = Math.round((cardamomOpt.pricePerKilo * totalGrams) / 1000);

  // 3. Additions price (scaled based on weight ratio)
  const weightScale = Math.max(0.5, totalGrams / 500);
  let additionsPrice = 0;
  selectedAdditions.forEach((addId) => {
    const found = ADDITIONS_LIST.find((a) => a.id === addId);
    if (found) {
      additionsPrice += Math.round(found.priceFixed * weightScale);
    }
  });

  const totalPrice = Math.max(10, coffeePrice + cardamomPrice + additionsPrice);
  const weightedKiloPrice = Math.round((totalPrice / totalGrams) * 1000);

  // 4. Detailed Recipe Summary String
  const parts = componentsRatio.map(
    (c) => `${c.grams}جم ${c.bean.name} (${c.percentage}%)`
  );
  const summaryRecipe = parts.join(" + ");

  return {
    totalGrams,
    coffeePrice,
    cardamomPrice,
    additionsPrice,
    totalPrice,
    weightedKiloPrice,
    componentsRatio,
    summaryRecipe,
  };
}

import { BlendBeanOrigin } from "@/data/blendOrigins";

export interface SelectedBlendComponent {
  bean: BlendBeanOrigin;
  grams: number; // >= 1
  preparation?: "sada" | "mohawaj";
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
    preparation: "sada" | "mohawaj";
    unitKiloPrice: number;
    percentage: number;
    subtotal: number;
  }>;
  summaryRecipe: string;
}

export const CARDAMOM_OPTIONS = [
  { id: "سادة", label: "سادة بدون حبهان إضافي", grams: 0, pricePerKilo: 0 },
  { id: "محوج خفيف", label: "تحويجة إضافية خفيفة (10 جم)", grams: 10, pricePerKilo: 80 },
  { id: "محوج وسط", label: "تحويجة إضافية وسط (20 جم)", grams: 20, pricePerKilo: 120 },
  { id: "محوج رويال", label: "تحويجة إضافية رويال سوبر (35 جم)", grams: 35, pricePerKilo: 180 },
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
  { id: "جينسنج", label: "جينسنج طبيعي فاخر", pricePerGram: 20, defaultGrams: 1 },
  { id: "جوزة الطيب", label: "جوزة الطيب مبشورة", pricePerGram: 8, defaultGrams: 1 },
  { id: "مستكة", label: "مستكة يوناني نقية", pricePerGram: 9, defaultGrams: 1 },
  { id: "قرنفل", label: "قرنفل بلدي مطحون", pricePerGram: 8, defaultGrams: 1 },
  { id: "زر ورد", label: "زر ورد جبلي معطر", pricePerGram: 8, defaultGrams: 1 },
] as const;

/**
 * Calculates weighted average price, total grams, and breakdown for a custom coffee blend.
 */
export function calculateCustomBlend(
  selectedComponents: SelectedBlendComponent[],
  cardamomId: string = "سادة",
  selectedAdditions: string[] | Record<string, number> = [],
  cardamomGramsOverride?: number
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

  // 1. Raw Coffee Price: sum of (effectiveKiloPrice * grams / 1000)
  let coffeePrice = 0;
  const componentsRatio = validComponents.map((c) => {
    const prep = c.preparation || "sada";
    const isMohawaj = prep === "mohawaj";
    const unitKiloPrice = isMohawaj
      ? (c.bean.mohawajPrice || c.bean.kiloPrice + 120)
      : (c.bean.sadaPrice || c.bean.kiloPrice);

    const subtotal = Math.round((unitKiloPrice * c.grams) / 1000);
    coffeePrice += (unitKiloPrice * c.grams) / 1000;
    const percentage = Math.round((c.grams / totalGrams) * 100);

    return {
      bean: c.bean,
      grams: c.grams,
      preparation: prep,
      unitKiloPrice,
      percentage,
      subtotal,
    };
  });

  coffeePrice = Math.round(coffeePrice);

  // 2. Extra Cardamom adjustment (if explicitly requested on top)
  let cardamomPrice = 0;
  if (cardamomGramsOverride !== undefined && cardamomGramsOverride > 0) {
    cardamomPrice = Math.round(cardamomGramsOverride * 2.2);
  } else if (cardamomId && cardamomId !== "سادة") {
    const cardamomOpt =
      CARDAMOM_OPTIONS.find((c) => c.id === cardamomId) || CARDAMOM_OPTIONS[0];
    cardamomPrice = Math.round((cardamomOpt.pricePerKilo * totalGrams) / 1000);
  }

  // 3. Additions price
  let additionsPrice = 0;
  if (Array.isArray(selectedAdditions)) {
    const weightScale = Math.max(0.5, totalGrams / 500);
    selectedAdditions.forEach((addId) => {
      const found = ADDITIONS_LIST.find((a) => a.id === addId);
      if (found) {
        additionsPrice += Math.round(found.pricePerGram * found.defaultGrams * weightScale);
      }
    });
  } else {
    // Record<string, number>
    Object.entries(selectedAdditions).forEach(([addId, grams]) => {
      if (grams > 0) {
        const found = ADDITIONS_LIST.find((a) => a.id === addId);
        if (found) {
          additionsPrice += Math.round(found.pricePerGram * grams);
        }
      }
    });
  }

  const totalPrice = Math.max(10, coffeePrice + cardamomPrice + additionsPrice);
  const weightedKiloPrice = Math.round((totalPrice / totalGrams) * 1000);

  // 4. Detailed Recipe Summary String
  const parts = componentsRatio.map(
    (c) => `${c.grams}جم ${c.bean.name} (${c.preparation === "mohawaj" ? "محوج" : "ساده"} - ${c.percentage}%)`
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

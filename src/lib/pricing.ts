import { Product, SelectedProductOptions } from "@/types/products";

/**
 * Checks if a product is eligible for custom grams selection.
 */
export function isProductEligibleForGrams(product: Product): boolean {
  if (
    product.category === "arabicas" ||
    product.category === "brazilian" ||
    product.category === "indian" ||
    product.category === "blends" ||
    product.category === "french"
  ) {
    return true;
  }

  if (product.tier === 2) {
    return true;
  }

  if (product.unitLabel?.includes("كيلو") || product.unitLabel?.includes("ك")) {
    return true;
  }

  if (product.category === "spices" && product.basePrice && product.basePrice >= 50) {
    return true;
  }

  return false;
}

/**
 * Calculates the exact price and label for a product based on user selections.
 * Supports custom grams calculation for all items sold by weight/kilo.
 */
export function calculateProductPrice(
  product: Product,
  options: SelectedProductOptions = {}
): { price: number; label: string } {
  const customGrams = options.customGrams;

  // Format gram label helper
  const formatGramLabel = (grams: number) => {
    return grams === 125
      ? "ثمن كيلو (125 جم)"
      : grams === 250
      ? "ربع كيلو (250 جم)"
      : grams === 500
      ? "نصف كيلو (500 جم)"
      : grams === 1000
      ? "كيلو كامل (1000 جم)"
      : `${grams} جم`;
  };

  // Tier 1: Fixed price
  if (product.tier === 1 || product.variantType === "none") {
    const base = product.basePrice || 0;
    if (customGrams && isProductEligibleForGrams(product)) {
      const calculated = Math.round((base * customGrams) / 1000);
      return {
        price: Math.max(calculated, 5),
        label: `${formatGramLabel(customGrams)}`,
      };
    }
    return {
      price: base,
      label: product.unitLabel || "سعر موحد",
    };
  }

  // Tier 2: Preparation (ساده / محوج) with optional grams selection
  if (product.tier === 2 && product.variants && product.variants.length > 0) {
    let chosenVariant = product.variants.find((v) => v.id === options.variantId);
    if (!chosenVariant) {
      chosenVariant = product.variants[0];
    }

    if (customGrams && customGrams > 0) {
      const kiloPrice = chosenVariant.price;
      const calculated = Math.round((kiloPrice * customGrams) / 1000);
      const cleanLabel = chosenVariant.label.replace(/\s*\(\d+\s*ج\.م\)/, "");
      return {
        price: Math.max(calculated, 10),
        label: `${cleanLabel} - ${formatGramLabel(customGrams)}`,
      };
    }

    return {
      price: chosenVariant.price,
      label: chosenVariant.label,
    };
  }

  // Tier 4: Weight & Packaging Variants
  if (product.tier === 4 && product.variants && product.variants.length > 0) {
    let chosenVariant = product.variants.find((v) => v.id === options.variantId);
    if (!chosenVariant) {
      chosenVariant = product.variants[0];
    }

    // If customGrams is selected and this variant or product is sold by kilo
    if (customGrams && isProductEligibleForGrams(product) && chosenVariant.label.includes("كيلو")) {
      const kiloPrice = chosenVariant.price;
      const calculated = Math.round((kiloPrice * customGrams) / 1000);
      const cleanLabel = chosenVariant.label.replace(/\s*\(\d+\s*ج\.م\)/, "").replace(/\s*\(كيلو\)/, "");
      return {
        price: Math.max(calculated, 10),
        label: `${cleanLabel} - ${formatGramLabel(customGrams)}`,
      };
    }

    return {
      price: chosenVariant.price,
      label: chosenVariant.label,
    };
  }

  // Tier 3: Size Variants
  if (product.variants && product.variants.length > 0) {
    let chosenVariant = product.variants.find((v) => v.id === options.variantId);
    if (!chosenVariant) {
      chosenVariant = product.variants[0];
    }
    return {
      price: chosenVariant.price,
      label: chosenVariant.label,
    };
  }

  // Tier 5: Matrix (option1 x option2)
  if (product.tier === 5 && product.matrix) {
    const opt1 = options.matrixOption1 || product.matrix.option1Values[0];
    const opt2 = options.matrixOption2 || product.matrix.option2Values[0];
    const key = `${opt1}|${opt2}`;
    const price = product.matrix.prices[key];

    if (price !== undefined) {
      return {
        price,
        label: `${opt1} | ${opt2}`,
      };
    }

    // Fallback if that combination doesn't exist
    const firstKey = Object.keys(product.matrix.prices)[0];
    const fallbackPrice = firstKey ? product.matrix.prices[firstKey] : 0;
    return {
      price: fallbackPrice,
      label: firstKey ? firstKey.replace("|", " | ") : "غير متاح",
    };
  }

  return {
    price: product.basePrice || 0,
    label: "افتراضي",
  };
}

/**
 * Returns the reference kilo price or base unit price for reference display (e.g. "سعر الكيلو: 480 ج.م")
 */
export function getBaseKiloPrice(
  product: Product,
  options?: SelectedProductOptions
): { price: number; label: string } | null {
  if (product.matrix) {
    const opt1 = options?.matrixOption1 || product.matrix.option1Values[0];
    const kiloKey = `${opt1}|كيلو`;
    if (product.matrix.prices[kiloKey]) {
      return {
        price: product.matrix.prices[kiloKey],
        label: "سعر الكيلو",
      };
    }
    // Fallback to first price in matrix
    const firstVal = Object.values(product.matrix.prices)[0] || 0;
    return {
      price: firstVal,
      label: "سعر الأساس",
    };
  }

  if (product.tier === 2 && product.variants && product.variants.length > 0) {
    const chosen = product.variants.find((v) => v.id === options?.variantId) || product.variants[0];
    return {
      price: chosen.price,
      label: "سعر الكيلو",
    };
  }

  if (product.tier === 1 && product.basePrice) {
    return {
      price: product.basePrice,
      label: product.unitLabel ? `سعر ${product.unitLabel}` : "سعر الكيلو",
    };
  }

  if (product.tier === 4 && product.variants && product.variants.length > 0) {
    const kiloVariant = product.variants.find(
      (v) => v.label.includes("كيلو") || v.label.includes("1000")
    );
    if (kiloVariant) {
      return {
        price: kiloVariant.price,
        label: "سعر الكيلو",
      };
    }
  }

  return null;
}

/**
 * Returns calculated prices for standard weight presets (125g, 250g, 500g, 1000g).
 */
export function getQuickWeightPresets(
  product: Product,
  options?: SelectedProductOptions
): Array<{ grams: number; title: string; shortLabel: string; price: number }> {
  const presets = [
    { grams: 125, title: "ثمن كيلو", shortLabel: "125 جم" },
    { grams: 250, title: "ربع كيلو", shortLabel: "250 جم" },
    { grams: 500, title: "نصف كيلو", shortLabel: "500 جم" },
    { grams: 1000, title: "كيلو كامل", shortLabel: "1000 جم" },
  ];

  // Base kilo price source
  let kiloPrice = 0;
  if (product.tier === 1) {
    kiloPrice = product.basePrice || 0;
  } else if (product.tier === 2 && product.variants && product.variants.length > 0) {
    const chosen = product.variants.find((v) => v.id === options?.variantId) || product.variants[0];
    kiloPrice = chosen.price;
  } else if (product.tier === 4 && product.variants && product.variants.length > 0) {
    const kiloVariant = product.variants.find(
      (v) => v.label.includes("كيلو") || v.label.includes("1000")
    );
    if (kiloVariant) {
      kiloPrice = kiloVariant.price;
    } else {
      kiloPrice = product.variants[0].price;
    }
  }

  return presets.map((p) => ({
    ...p,
    price: Math.max(Math.round((kiloPrice * p.grams) / 1000), 5),
  }));
}

/**
 * Generates a clean Arabic live summary line for the product card action footer
 * Example: "بن محوج — وسط — ربع كيلو (250 جم)"
 * Note: Price is omitted here to prevent redundancy with the button price.
 */
export function formatProductSelectionSummary(
  product: Product,
  options: SelectedProductOptions
): string {
  const parts: string[] = [product.name];

  if (product.matrix) {
    const roast = options.matrixOption1 || product.matrix.option1Values[0];
    const pack = options.matrixOption2 || product.matrix.option2Values[0];
    parts.push(roast, pack);
  } else if (product.tier === 2) {
    const chosen = product.variants?.find((v) => v.id === options.variantId) || product.variants?.[0];
    if (chosen) parts.push(chosen.label);
    if (options.customGrams) {
      const g = options.customGrams;
      const gLabel =
        g === 125
          ? "ثمن كيلو (125 جم)"
          : g === 250
          ? "ربع كيلو (250 جم)"
          : g === 500
          ? "نصف كيلو (500 جم)"
          : g === 1000
          ? "كيلو كامل (1000 جم)"
          : `${g} جم`;
      parts.push(gLabel);
    }
  } else if (isProductEligibleForGrams(product) && options.customGrams) {
    const g = options.customGrams;
    const gLabel =
      g === 125
        ? "ثمن كيلو (125 جم)"
        : g === 250
        ? "ربع كيلو (250 جم)"
        : g === 500
        ? "نصف كيلو (500 جم)"
        : g === 1000
        ? "كيلو كامل (1000 جم)"
        : `${g} جم`;
    parts.push(gLabel);
  } else if (product.variants && product.variants.length > 0) {
    const chosen = product.variants.find((v) => v.id === options.variantId) || product.variants[0];
    if (chosen) parts.push(chosen.label);
  }

  return parts.join(" — ");
}

/**
 * Returns default selected options for a product on first render.
 */
export function getDefaultProductOptions(product: Product): SelectedProductOptions {
  if (isProductEligibleForGrams(product)) {
    if (product.variants && product.variants.length > 0) {
      return {
        variantId: product.variants[0].id,
        variantLabel: product.variants[0].label,
        customGrams: 250, // default 250g (ربع كيلو)
      };
    }
    return {
      customGrams: 250,
    };
  }

  if (product.variants && product.variants.length > 0) {
    return {
      variantId: product.variants[0].id,
      variantLabel: product.variants[0].label,
    };
  }

  if (product.matrix) {
    return {
      matrixOption1: product.matrix.option1Values[0],
      matrixOption2: product.matrix.option2Values[0],
    };
  }

  return {};
}

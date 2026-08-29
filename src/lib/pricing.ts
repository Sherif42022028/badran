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
      ? "ثمن ك (125جم)"
      : grams === 250
      ? "ربع ك (250جم)"
      : grams === 500
      ? "نصف ك (500جم)"
      : grams === 1000
      ? "كيلو كامل"
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

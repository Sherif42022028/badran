import { Product, SelectedProductOptions } from "@/types/products";

/**
 * Calculates the exact price and label for a product based on user selections.
 * Supports custom grams calculation for coffee products sold by the kilo.
 */
export function calculateProductPrice(
  product: Product,
  options: SelectedProductOptions = {}
): { price: number; label: string } {
  // Tier 1: Fixed price
  if (product.tier === 1 || product.variantType === 'none') {
    const base = product.basePrice || 0;
    if (options.customGrams && product.unitLabel?.includes("كيلو")) {
      const calculated = Math.round((base * options.customGrams) / 1000);
      return {
        price: Math.max(calculated, 5),
        label: `${options.customGrams} جم`,
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

    if (options.customGrams && options.customGrams > 0) {
      const kiloPrice = chosenVariant.price;
      const calculated = Math.round((kiloPrice * options.customGrams) / 1000);
      const cleanLabel = chosenVariant.label.replace(/\s*\(\d+\s*ج\.م\)/, "");
      const gramsDisplay =
        options.customGrams === 125
          ? "ثمن ك (125جم)"
          : options.customGrams === 250
          ? "ربع ك (250جم)"
          : options.customGrams === 500
          ? "نصف ك (500جم)"
          : options.customGrams === 1000
          ? "كيلو كامل"
          : `${options.customGrams} جم`;

      return {
        price: Math.max(calculated, 10),
        label: `${cleanLabel} - ${gramsDisplay}`,
      };
    }

    return {
      price: chosenVariant.price,
      label: chosenVariant.label,
    };
  }

  // Tier 3, 4: Standard variants (sizes, weights)
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
  if (product.tier === 2 && product.variants && product.variants.length > 0) {
    return {
      variantId: product.variants[0].id,
      variantLabel: product.variants[0].label,
      customGrams: 250, // default to 250g (ربع كيلو) for coffee beans
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

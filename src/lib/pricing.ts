import { Product, SelectedProductOptions } from "@/types/products";

/**
 * Calculates the exact price and label for a product based on user selections.
 */
export function calculateProductPrice(
  product: Product,
  options: SelectedProductOptions = {}
): { price: number; label: string } {
  // Tier 1: Fixed price
  if (product.tier === 1 || product.variantType === 'none') {
    return {
      price: product.basePrice || 0,
      label: product.unitLabel || "سعر موحد",
    };
  }

  // Tier 2, 3, 4: Single choice variants (preparation, size, weight)
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

    // Fallback if that combination doesn't exist: find first available price
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
  if (product.variants && product.variants.length > 0) {
    return {
      variantId: product.variants[0].id,
      variantLabel: product.variants[0].label,
    };
  }

  if (product.matrix) {
    const opt1 = product.matrix.option1Values[0];
    const opt2 = product.matrix.option2Values[0];
    return {
      matrixOption1: opt1,
      matrixOption2: opt2,
    };
  }

  return {};
}

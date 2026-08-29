export type VariantTier = 1 | 2 | 3 | 4 | 5;

export type VariantType = 'none' | 'preparation' | 'size' | 'weight' | 'matrix';

export interface ProductVariant {
  id: string;
  label: string; // e.g. "ساده", "محوج" | "كبير", "صغير" | "ربع ك", "نص ك", "كيلو"
  price: number;
  unit?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string; // Category ID (one of the 11 categories)
  description?: string;
  tier: VariantTier;
  variantType: VariantType;
  badge?: string; // e.g. "خلطة بدران", "الأكثر طلباً", "فاخر"
  basePrice?: number; // for Tier 1
  unitLabel?: string; // e.g. "للكيلو", "للكوب", "للعبوة"
  variants?: ProductVariant[]; // for Tiers 2, 3, 4
  matrix?: {
    option1Name: string;
    option1Values: string[];
    option2Name: string;
    option2Values: string[];
    prices: Record<string, number>; // e.g. "فاتح|100 جم": 460
  };
  image?: string;
}

export interface SelectedProductOptions {
  variantId?: string;
  variantLabel?: string;
  matrixOption1?: string;
  matrixOption2?: string;
}

export interface CartItem {
  id: string; // unique cart line id (e.g. "prod1-sada" or "prod2-matrix-fatih-100g")
  product: Product;
  selectedOptions: SelectedProductOptions;
  selectedLabel: string; // display text like "ساده" or "وسط | 100 جم"
  unitPrice: number;
  quantity: number;
}

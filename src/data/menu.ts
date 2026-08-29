import { CategoryInfo, CATEGORIES_LIST, PRODUCTS_CATALOG } from "./products";
import { Product, ProductVariant } from "@/types/products";

export { CATEGORIES_LIST, PRODUCTS_CATALOG };
export type { CategoryInfo, Product, ProductVariant };

// Legacy Category and MenuItem interfaces for backward compatibility
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  prices: {
    unit: string;
    price: number;
  }[];
  isSpecial?: boolean;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export const CATEGORIES: Category[] = CATEGORIES_LIST.map((c) => ({
  id: c.id,
  name: c.name,
  iconName: c.iconName,
  description: c.description,
}));

// Mapped products for any component still expecting MENU_ITEMS
export const MENU_ITEMS: MenuItem[] = PRODUCTS_CATALOG.map((p) => {
  let prices: { unit: string; price: number }[] = [];

  if (p.variants && p.variants.length > 0) {
    prices = p.variants.map((v) => ({ unit: v.label, price: v.price }));
  } else if (p.matrix) {
    prices = Object.entries(p.matrix.prices).map(([combo, price]) => ({
      unit: combo.replace("|", " | "),
      price,
    }));
  } else {
    prices = [{ unit: p.unitLabel || "سعر موحد", price: p.basePrice || 0 }];
  }

  return {
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description || "",
    prices,
    isSpecial: Boolean(p.badge),
    image: p.image,
  };
});

export const PRINTED_MENU_PAGES = [
  { id: 1, src: "/1.jpg", title: "الواجهة والغلاف الرئيسي للمنيو" },
  { id: 2, src: "/2.jpg", title: "فهرس الأقسام الـ 11" },
  { id: 3, src: "/3.jpg", title: "الأساسيات والتحميص" },
  { id: 4, src: "/4.jpg", title: "العسل الطبيعي والطحينة" },
  { id: 5, src: "/5.jpg", title: "التحويج والبهارات الخاصة" },
  { id: 6, src: "/6.jpg", title: "الأعشاب والمستلزمات والتمور" },
  { id: 7, src: "/7.jpg", title: "الفرنساويات والأرابيكات والمشروبات" },
];

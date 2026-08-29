export interface SpecialOffer {
  id: string;
  image: string;
  title: string;
  description: string;
  badge?: string; // e.g. "خصم 20%", "عرض الأسبوع", "جديد بدران"
  discountPrice?: number;
  originalPrice?: number;
  active_from: string; // "YYYY-MM-DD"
  active_until: string; // "YYYY-MM-DD"
  ctaText?: string;
  whatsappMessage?: string;
}

export const SPECIAL_OFFERS: SpecialOffer[] = [
  {
    id: "offer-smoothie",
    image: "/offers/smoothie.jpeg",
    title: "سموزي بدران المنعش",
    description: "سموزي بنكهات غنية ومميزة مع الكريمة المخفوقة والمكونات الطبيعية الطازجة.",
    badge: "الأكثر طلباً",
    discountPrice: 60,
    originalPrice: 80,
    active_from: "2026-08-01",
    active_until: "2026-10-31",
    ctaText: "اطلب عرض السموزي",
    whatsappMessage: "السلام عليكم، حابب أطلب عرض سموزي بدران المنعش بسعر 60 ج.م.",
  },
  {
    id: "offer-anise-mint",
    image: "/offers/anise_mint.jpeg",
    title: "ينسون ونعناع بلدي بالأعشاب الطبيعية",
    description: "مشروب عشبي دافئ ومهدئ من أجود أعشاب الينسون البلدي وأوراق النعناع الأخضر المنعش.",
    badge: "طبيعي 100%",
    discountPrice: 40,
    originalPrice: 55,
    active_from: "2026-08-01",
    active_until: "2026-10-31",
    ctaText: "اطلب عرض الينسون والنعناع",
    whatsappMessage: "السلام عليكم، حابب أطلب عرض ينسون ونعناع بلدي بسعر 40 ج.م.",
  },
  {
    id: "offer-al-amid",
    image: "/offers/al_amid.jpg",
    title: "بن العميد الفاخر الأصلي",
    description: "توليفة بن العميد الشهيرة بحبوب الأرابيكا الفاخرة والتحويجة الملكية الخاصة لعشاق القهوة.",
    badge: "توليفة مميزة",
    discountPrice: 700,
    originalPrice: 850,
    active_from: "2026-08-01",
    active_until: "2026-10-31",
    ctaText: "اطلب بن العميد",
    whatsappMessage: "السلام عليكم، حابب أطلب عرض بن العميد الفاخر الأصلي من بن بدران.",
  },
];

/**
 * Returns only currently active offers based on today's date.
 */
export function getActiveOffers(offers: SpecialOffer[] = SPECIAL_OFFERS): SpecialOffer[] {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  return offers.filter((offer) => {
    const isAfterStart = !offer.active_from || offer.active_from <= today;
    const isBeforeEnd = !offer.active_until || offer.active_until >= today;
    return isAfterStart && isBeforeEnd;
  });
}

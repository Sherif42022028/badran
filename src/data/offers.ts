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
    id: "offer-smoothie-01",
    image: "/offers/smoothie.jpg",
    title: "سموزي بدران التراثي الفاخر",
    description: "سموزي غني بنكهة القهوة والكراميل والفواكه الطازجة مع كريمة مخفوقة وحبات البن المحمصة.",
    badge: "عرض خاص",
    discountPrice: 65,
    originalPrice: 85,
    active_from: "2026-08-01",
    active_until: "2026-09-30",
    ctaText: "اطلب عرض السموزي",
    whatsappMessage: "السلام عليكم، حابب أطلب عرض سموزي بدران الفاخر بسعر 65 ج.م.",
  },
  {
    id: "offer-anise-mint-02",
    image: "/offers/anise_mint.jpg",
    title: "ينسون ونعناع بلدي أصيل بالأعشاب الطبيعية",
    description: "توليفة أعشاب دافئة مهدئة منتقاة من أجود بذور الينسون النجمي وأوراق النعناع البلدي الأخضر.",
    badge: "طبيعي 100%",
    discountPrice: 45,
    originalPrice: 60,
    active_from: "2026-08-01",
    active_until: "2026-09-30",
    ctaText: "اطلب عرض الينسون والنعناع",
    whatsappMessage: "السلام عليكم، حابب أطلب عرض ينسون ونعناع بلدي فاخر بسعر 45 ج.م.",
  },
  {
    id: "offer-blends-weekly",
    image: "/1.jpg",
    title: "عرض الأسبوع: خصم 20% على توليفات بدران",
    description: "استمتع بخصم خاص على توليفة اسبيشيال بدران وتوليفة السلطان مع طحن مخصص مجاناً.",
    badge: "خصم 20%",
    active_from: "2026-08-20",
    active_until: "2026-09-15",
    ctaText: "اطلب توليفة العرض",
    whatsappMessage: "السلام عليكم، حابب أستفيد من عرض الأسبوع لخصم 20% على توليفات بن بدران.",
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

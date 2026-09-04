export interface SpecialOffer {
  id: string;
  image: string;
  title: string;
  description: string;
  badge?: string;
  discountPrice: number;
  originalPrice: number;
  active_from: string; // "YYYY-MM-DD"
  active_until: string; // "YYYY-MM-DD"
  ctaText?: string;
  whatsappMessage?: string;
}

export const SPECIAL_OFFERS: SpecialOffer[] = [
  {
    id: "offer-al-amid",
    image: "/offers/al_amid.jpg",
    title: "فنجان العميد بدران",
    description: "توليفة 100% أرابيكا • جودتها تستحق التجربة • طعم قوي ودسم ومذاق فريد وجودة عالية (طعم يميّزك ... وجودة تثق بها).",
    badge: "عرض خاص لفترة محدودة",
    discountPrice: 25,
    originalPrice: 40,
    active_from: "2026-08-01",
    active_until: "2026-12-31",
    ctaText: "اطلب فنجان العميد (25 ج.م)",
    whatsappMessage: "السلام عليكم، حابب أطلب عرض فنجان العميد بدران (توليفة 100% أرابيكا) بسعر 25 جنيه بدلاً من 40 جنيه.",
  },
  {
    id: "offer-smoothie",
    image: "/offers/smoothie.jpeg",
    title: "عرض خاص: سموزي (طازج • بارد • لذيذ)",
    description: "فواكه طبيعية 100% • بارد ومنعش • طاقة ونشاط • صحي ولذيذ (طعم يبقى معاك).",
    badge: "لفترة محدودة فقط!",
    discountPrice: 40,
    originalPrice: 60,
    active_from: "2026-08-01",
    active_until: "2026-12-31",
    ctaText: "اطلب عرض السموزي (40 ج.م)",
    whatsappMessage: "السلام عليكم، حابب أطلب عرض السموزي الطازج المنعش بسعر 40 جنيه بدلاً من 60 جنيه.",
  },
  {
    id: "offer-anise-mint",
    image: "/offers/anise_mint.jpeg",
    title: "عرض خاص: النعناع والينسون (طبيعة تنعش يومك)",
    description: "علبة نعناع 50 فتلة + علبة ينسون 50 فتلة (الإجمالي 100 فتلة) • جودة طبيعية 100% • بدون مواد صناعية وطعم رائع لصحة أفضل يومياً.",
    badge: "عرض الـ 100 فتلة",
    discountPrice: 34,
    originalPrice: 60,
    active_from: "2026-08-01",
    active_until: "2026-12-31",
    ctaText: "اطلب عرض الينسون والنعناع (34 ج.م)",
    whatsappMessage: "السلام عليكم، حابب أطلب عرض النعناع والينسون (علبة نعناع 50 فتلة + علبة ينسون 50 فتلة - الإجمالي 100 فتلة) بسعر 34 جنيه بدلاً من 60 جنيه.",
  },
  {
    id: "offer-milkshake",
    image: "/offers/milkshake.jpg",
    title: "عرض خاص: ميلك شيك (طعم يبرّد يومك)",
    description: "شوكولاتة • فراولة • فانيليا • قوام كريمي وطعم منعش لا يُقاوم من بيت البن اليمني بن بدران.",
    badge: "عرض خاص 60 ج.م",
    discountPrice: 60,
    originalPrice: 80,
    active_from: "2026-08-01",
    active_until: "2026-12-31",
    ctaText: "اطلب عرض الميلك شيك (60 ج.م)",
    whatsappMessage: "السلام عليكم، حابب أطلب عرض الميلك شيك المنعش من بن بدران (شوكولاتة / فراولة / فانيليا) بسعر 60 جنيه بدلاً من 80 جنيه.",
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

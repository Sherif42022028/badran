export interface BlendBeanOrigin {
  id: string;
  name: string;
  category: "all" | "brazilian" | "indian" | "habashi" | "world";
  categoryLabel: string;
  blendRole: string; // الدور الأساسي للصنف في التوليفة
  kiloPrice: number;
  description: string;
  flavorNotes: string[];
  color: string; // Color tag for the visual blend ratio chart
}

export const BLEND_COFFEE_BEANS: BlendBeanOrigin[] = [
  // ================= 1. البن البرازيلي (قاعدة التوليفات والقوام) =================
  {
    id: "br-san",
    name: "بن برازيلي سانتوس الفاخر",
    category: "brazilian",
    categoryLabel: "البن البرازيلي",
    blendRole: "قاعدة التوليفة ونعومة القوام",
    kiloPrice: 720,
    description: "البن البرازيلي الكلاسيكي المحبوب، حجر الأساس لأي توليفة بنعومة حريرية ومرارة منخفضة.",
    flavorNotes: ["حلاوة كراميل", "قوام ناعم", "توازن مثالي"],
    color: "#15803D", // green-700
  },
  {
    id: "br-cer",
    name: "بن برازيلي سيرادو مختص",
    category: "brazilian",
    categoryLabel: "البن البرازيلي",
    blendRole: "نكهة مكسرات وشوكولاتة غنية",
    kiloPrice: 880,
    description: "أرابيكا برازيلية نقية تعطي التوليفة بعداً غنياً بنكهات المكسرات المحمصة والشوكولاتة.",
    flavorNotes: ["مكسرات محمصة", "شوكولاتة داكنة", "قوام كامل"],
    color: "#16A34A", // green-600
  },
  {
    id: "br-rio",
    name: "بن برازيلي ريو مينيو",
    category: "brazilian",
    categoryLabel: "البن البرازيلي",
    blendRole: "قوام ثقيل ومزاج تقليدي عريق",
    kiloPrice: 600,
    description: "طعم تقليدي قوي وحدّة محبوبة لعشاق القهوة الشرقية الثقيلة ذات المزاج العالي.",
    flavorNotes: ["حدة كلاسيكية", "طعم ثقيل", "نكهة تراثية"],
    color: "#14532D", // green-900
  },

  // ================= 2. البن الهندي (الوش والرغوة المتماسكة والنكهة) =================
  {
    id: "in-rob",
    name: "بن هندي روبوستا شيري",
    category: "indian",
    categoryLabel: "البن الهندي",
    blendRole: "سر الوش الكثيف والرغوة المتماسكة",
    kiloPrice: 560,
    description: "الحبة السحرية لضبط وش الفنجان؛ تمنح التوليفة رغوة كثيفة متماسكة وقوة كافيين ممتازة.",
    flavorNotes: ["وش كريمي متماسك", "كافيين عالي", "ثقل القوام"],
    color: "#78350F", // amber-900
  },
  {
    id: "in-plan",
    name: "بن هندي بلانتيشن أرابيكا",
    category: "indian",
    categoryLabel: "البن الهندي",
    blendRole: "توابل شرقية خفيفة وتوازن",
    kiloPrice: 760,
    description: "أرابيكا هندية مغسولة من المرتفعات، تضيف للتوليفة لمسة توابل ناعمة وتوازناً راقياً.",
    flavorNotes: ["توابل خفيفة", "شوكولاتة بالحليب", "حموضة متزنة"],
    color: "#D97706", // amber-600
  },

  // ================= 3. البن الحبشي الإثيوبي (العطرية والريحة الفاكهية) =================
  {
    id: "hab-har",
    name: "بن حبشي هراري إثيوبي عريق",
    category: "habashi",
    categoryLabel: "البن الحبشي",
    blendRole: "عطرية فخمة وإيحاءات فاكهية نبيذية",
    kiloPrice: 960,
    description: "تاج التوليفات الراقية؛ يمنح الخلطة نكهة فاكهية نبيذية فريدة ورائحة عطرية تعبّأ المكان.",
    flavorNotes: ["توت بري", "فاكهي نبيذي", "عطرية ساحرة"],
    color: "#DC2626", // red-600
  },
  {
    id: "hab-sid",
    name: "بن حبشي سيدامو إثيوبي",
    category: "habashi",
    categoryLabel: "البن الحبشي",
    blendRole: "نكهات زهرية ياسمينية وحموضة ناعمة",
    kiloPrice: 920,
    description: "أرابيكا إثيوبية راقية من مرتفعات سيدامو بنكهات زهرية فاخرة وقوام حريري يمنح التوليفة تميزاً فريداً.",
    flavorNotes: ["زهور الياسمين", "حمضيات ناعمة", "قوام حريري"],
    color: "#B91C1C", // red-700
  },
  {
    id: "hab-lim",
    name: "بن حبشي ليمو إثيوبي مختص",
    category: "habashi",
    categoryLabel: "البن الحبشي",
    blendRole: "إيحاءات فاكهية نبيذية وحلاوة سكرية",
    kiloPrice: 1080,
    description: "حبوب أرابيكا مغسولة من منطقة ليمو، تضفي على التوليفة إيحاءات فاكهية نبيذية وتوازناً راقياً للغاية.",
    flavorNotes: ["فاكهي نبيذي", "حلاوة سكرية", "توابل خفيفة"],
    color: "#7F1D1D", // red-900
  },
  {
    id: "hab-djm",
    name: "بن حبشي ديمي أصيل",
    category: "habashi",
    categoryLabel: "البن الحبشي",
    blendRole: "عمق بري ونكهة بلدية أصيلة",
    kiloPrice: 800,
    description: "بن إثيوبي بري يضفي على التوليفة عمقاً تراثياً ونفحات من العسل والتوابل البرية.",
    flavorNotes: ["توابل برية", "عسل طبيعي", "عمق عريق"],
    color: "#991B1B", // red-800
  },

  // ================= 4. أرابيكات وروبوستا مكملة للتوليفات الفاخرة =================
  {
    id: "ar-col",
    name: "بن كولومبي سوبريمو نخب أول",
    category: "world",
    categoryLabel: "أصناف مكملة فاخرة",
    blendRole: "نعومة شوكولاتة وتوازن حريري",
    kiloPrice: 1080,
    description: "أرابيكا كولومبية نخب أول، تُدمج لرفع جودة التوليفة ومنحها نعومة حريرية وطعم شوكولاتة صافي.",
    flavorNotes: ["شوكولاتة صافية", "كراميل ناعم", "نعومة حريرية"],
    color: "#EA580C", // orange-600
  },
  {
    id: "ar-yem",
    name: "بن يمني مطري أصيل",
    category: "world",
    categoryLabel: "أصناف مكملة فاخرة",
    blendRole: "اللمسة الملكية للتوليفات الخاصة",
    kiloPrice: 1800,
    description: "أندر وأعرق حبوب البن عالمياً؛ إضافة 10% إلى 20% منه تحول أي توليفة إلى خلطة ملوك وأمراء.",
    flavorNotes: ["توابل ملكية", "شوكولاتة معقدة", "عطرية استثنائية"],
    color: "#C5A059", // badran gold
  },
  {
    id: "ar-gua",
    name: "بن جواتيمالا أنتيجوا بركاني",
    category: "world",
    categoryLabel: "أصناف مكملة فاخرة",
    blendRole: "نكهة كاكاو ودخان بركاني فاخر",
    kiloPrice: 1000,
    description: "حبوب من مرتفعات البراكين تضفي على التوليفة إيحاءات الكاكاو الخام ولمسة تدخين شرقية فاخرة.",
    flavorNotes: ["كاكاو خام", "لمسة تدخين راقية", "حلاوة طبيعية"],
    color: "#9333EA", // purple-600
  },
  {
    id: "ar-viet",
    name: "بن فيتنامي روبوستا منتقى",
    category: "world",
    categoryLabel: "أصناف مكملة فاخرة",
    blendRole: "قوة تركيز ورغوة اقتصادية كثيفة",
    kiloPrice: 520,
    description: "روبوستا فيتنامية نظيفة ومعالجة جيداً، ممتازة لزيادة تركيز الكافيين ودعم وش الفنجان.",
    flavorNotes: ["وش كثيف", "تركيز عالي", "طعم قوي"],
    color: "#475569", // slate-600
  },
];

export const BLEND_ORIGIN_CATEGORIES = [
  { id: "brazilian", label: "البن البرازيلي (الأساس والقوام)" },
  { id: "indian", label: "البن الهندي (الوش والرغوة)" },
  { id: "habashi", label: "البن الحبشي (العطرية والفاكهية)" },
  { id: "world", label: "أصناف مكملة فاخرة (يمني، كولومبي...)" },
] as const;

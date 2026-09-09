export interface BlendBeanOrigin {
  id: string;
  name: string;
  category: "all" | "indian" | "brazilian" | "habashi" | "arabicas" | "basics";
  categoryLabel: string;
  kiloPrice: number;
  description: string;
  flavorNotes: string[];
  color: string; // Color tag for the visual blend ratio chart
}

export const BLEND_COFFEE_BEANS: BlendBeanOrigin[] = [
  // ================= 1. البن الهندي =================
  {
    id: "in-plan",
    name: "بن هندي بلانتيشن فاخر",
    category: "indian",
    categoryLabel: "البن الهندي",
    kiloPrice: 760,
    description: "حبوب أرابيكا هندية مغسولة من المرتفعات، حموضة خفيفة ومذاق ناعم متوازن.",
    flavorNotes: ["شوكولاتة", "توابل خفيفة", "حموضة متزنة"],
    color: "#D97706", // amber-600
  },
  {
    id: "in-arab",
    name: "بن هندي أرابيكا أصيل",
    category: "indian",
    categoryLabel: "البن الهندي",
    kiloPrice: 840,
    description: "حبوب أرابيكا هندية مختارة بنكهات عطرية وقوام كريمي ممتاز للخلطات المتوازنة.",
    flavorNotes: ["عطري", "قوام كريمي", "حلاوة طبيعية"],
    color: "#B45309", // amber-700
  },
  {
    id: "in-rob",
    name: "بن هندي روبوستا قوي (وش متماسك)",
    category: "indian",
    categoryLabel: "البن الهندي",
    kiloPrice: 560,
    description: "روبوستا هندية منتقاة تمنح الفنجان وشاً سميكاً ورغوة كثيفة وكافيين عالي.",
    flavorNotes: ["وش كثيف", "كافيين عالي", "قوام قوي"],
    color: "#78350F", // amber-900
  },

  // ================= 2. البن البرازيلي =================
  {
    id: "br-cer",
    name: "بن برازيلي سيرادو مختص",
    category: "brazilian",
    categoryLabel: "البن البرازيلي",
    kiloPrice: 880,
    description: "من أشهر مزارع البرازيل المختصة، إيحاءات مكسرات وشوكولاتة وقوام ممتلئ غني.",
    flavorNotes: ["مكسرات محمصة", "شوكولاتة داكنة", "قوام كامل"],
    color: "#16A34A", // green-600
  },
  {
    id: "br-san",
    name: "بن برازيلي سانتوس الفاخر",
    category: "brazilian",
    categoryLabel: "البن البرازيلي",
    kiloPrice: 720,
    description: "البن البرازيلي الكلاسيكي المحبوب بنعومة حريرية ونسبة مرارة منخفضة جداً.",
    flavorNotes: ["ناعم", "كراميل", "مرارة منخفضة"],
    color: "#15803D", // green-700
  },
  {
    id: "br-rio",
    name: "بن برازيلي ريو مينيو",
    category: "brazilian",
    categoryLabel: "البن البرازيلي",
    kiloPrice: 600,
    description: "طعم تراثي قوي ومذاق تقليدي ثقيل يعطي قاعدة ممتازة للخلطات الشرقية.",
    flavorNotes: ["طعم ثقيل", "نكهة تراثية", "حدة كلاسيكية"],
    color: "#14532D", // green-900
  },

  // ================= 3. البن الحبشي =================
  {
    id: "hab-har",
    name: "بن حبشي هراري إثيوبي عريق",
    category: "habashi",
    categoryLabel: "البن الحبشي",
    kiloPrice: 960,
    description: "أعرق أنواع البن الإثيوبي بطعم فاكهي نبيذي وإيحاءات التوت البري والشوكولاتة.",
    flavorNotes: ["توت بري", "فاكهي نبيذي", "عطري فاخر"],
    color: "#DC2626", // red-600
  },
  {
    id: "hab-lek",
    name: "بن حبشي لقميتي فاخر",
    category: "habashi",
    categoryLabel: "البن الحبشي",
    kiloPrice: 880,
    description: "مذاق إثيوبي أصيل منتقى بعناية، حموضة فاكهية منعشة ونفحات ياسمين وزهور.",
    flavorNotes: ["ياسمين", "حمضيات منعشة", "فاكهي"],
    color: "#B91C1C", // red-700
  },
  {
    id: "hab-djm",
    name: "بن حبشي ديمي أصيل",
    category: "habashi",
    categoryLabel: "البن الحبشي",
    kiloPrice: 800,
    description: "قهوة إثيوبية برية قوية الإيحاءات تضفي عمقاً وسحراً استثنائياً لأي توليفة.",
    flavorNotes: ["توابل برية", "عسل طبيعي", "عمق عريق"],
    color: "#991B1B", // red-800
  },

  // ================= 4. أرابيكات عالمية أخرى =================
  {
    id: "ar-col",
    name: "بن كولومبي سوبريمو نخب أول",
    category: "arabicas",
    categoryLabel: "أرابيكات عالمية",
    kiloPrice: 1080,
    description: "الحبوب الأكبر حجماً في كولومبيا بنكهات الكراميل والحمضيات الخفيفة ولمسة مكسرات.",
    flavorNotes: ["كراميل", "حمضيات لطيفة", "قوام حريري"],
    color: "#EA580C", // orange-600
  },
  {
    id: "ar-yem",
    name: "بن يمني مطري أصيل (تاج الأرابيكا)",
    category: "arabicas",
    categoryLabel: "أرابيكات عالمية",
    kiloPrice: 1800,
    description: "من أقدم وأندر مزارع بني مطر باليمن، تجفيف طبيعي على أسطح المنازل بطعم خيالي.",
    flavorNotes: ["توابل نادرة", "شوكولاتة معقدة", "عطرية ملكية"],
    color: "#C5A059", // badran gold
  },
  {
    id: "ar-gua",
    name: "بن جواتيمالا أنتيجوا بركاني",
    category: "arabicas",
    categoryLabel: "أرابيكات عالمية",
    kiloPrice: 1000,
    description: "مزروع في تربة بركانية خصبة تمنحه إيحاءات الكاكاو والتوابل الدخانية الفاتنة.",
    flavorNotes: ["كاكاو نقي", "دخان خفيف", "حلاوة بركانية"],
    color: "#9333EA", // purple-600
  },
  {
    id: "ar-mex",
    name: "بن مكسيكي ألتورا عضوي",
    category: "arabicas",
    categoryLabel: "أرابيكات عالمية",
    kiloPrice: 920,
    description: "أرابيكا عضوية من مرتفعات المكسيك بطعم ناعم وقوام خفيف منعش.",
    flavorNotes: ["بندق ناعم", "سكر بني", "حموضة رقيقة"],
    color: "#7C3AED", // violet-600
  },
  {
    id: "ar-ken",
    name: "بن كيني بلاتينيوم غني",
    category: "arabicas",
    categoryLabel: "أرابيكات عالمية",
    kiloPrice: 1120,
    description: "إيحاءات الكشمش الأسود والحمضيات الفاتنة مع قوام ثقيل ونهاية متألقة.",
    flavorNotes: ["كشمش أسود", "حمضيات فوارة", "قوام ممتلئ"],
    color: "#C026D3", // fuchsia-600
  },
  {
    id: "ar-cos",
    name: "بن كوستاريكا تارازو فاخر",
    category: "arabicas",
    categoryLabel: "أرابيكات عالمية",
    kiloPrice: 1040,
    description: "نقاء استثنائي ونكهات التفاح الأخضر والعسل مع حموضة مشرقة متزنة.",
    flavorNotes: ["تفاح وعسل", "نقاء بلوري", "حموضة متزنة"],
    color: "#0284C7", // sky-600
  },
  {
    id: "ar-ind",
    name: "بن إندونيسي سومطرة ماندرين",
    category: "arabicas",
    categoryLabel: "أرابيكات عالمية",
    kiloPrice: 880,
    description: "معالجة تقشير رطب تمنحه قواماً شرابياً كثيفاً وإيحاءات أعشاب وتربة غنية.",
    flavorNotes: ["أعشاب خشبية", "قوام شرابي ثقيل", "توابل أرضية"],
    color: "#0D9488", // teal-600
  },

  // ================= 5. الأساسيات والتحميص =================
  {
    id: "bs-pl-med",
    name: "بن ساده بدران الكلاسيكي (وسط)",
    category: "basics",
    categoryLabel: "الأساسيات",
    kiloPrice: 520,
    description: "بن بدران النقي الأصلي بالتحميص الوسط المعتدل، قاعدة ذهبية لجميع التوليفات.",
    flavorNotes: ["كلاسيكي متوازن", "حلاوة خفيفة", "تحميص بدران"],
    color: "#713F12", // yellow-900
  },
  {
    id: "bs-pl-drk",
    name: "بن ساده بدران الكلاسيكي (غامق)",
    category: "basics",
    categoryLabel: "الأساسيات",
    kiloPrice: 540,
    description: "بن بدران بتحميص غامق كلاسيكي لعشاق المرارة المحببة والطعم الجريء.",
    flavorNotes: ["طعم جريء", "كراميل محروق", "مرارة أصيلة"],
    color: "#451A03", // amber-950
  },
  {
    id: "bs-grn",
    name: "قهوة خضراء بدران طبيعية",
    category: "basics",
    categoryLabel: "الأساسيات",
    kiloPrice: 640,
    description: "حبوب بن خضراء غير محمصة غنية بمضادات الأكسدة ومفيدة للرشاقة والحيوية.",
    flavorNotes: ["طبيعي 100%", "عشبي خفيف", "مضادات أكسدة"],
    color: "#65A30D", // lime-600
  },
];

export const BLEND_ORIGIN_CATEGORIES = [
  { id: "all", label: "كل أنواع البن" },
  { id: "indian", label: "البن الهندي" },
  { id: "brazilian", label: "البن البرازيلي" },
  { id: "habashi", label: "البن الحبشي" },
  { id: "arabicas", label: "أرابيكات عالمية" },
  { id: "basics", label: "الأساسيات" },
] as const;

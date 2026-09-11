export interface BlendBeanOrigin {
  id: string;
  name: string;
  category: "basics" | "brazilian" | "indian" | "habashi" | "world";
  categoryLabel: string;
  blendRole: string; // الدور الأساسي للصنف في التوليفة
  sadaPrice: number; // سعر الكيلو ساده
  mohawajPrice: number; // سعر الكيلو محوج بالحبهان
  kiloPrice: number; // السعر الافتراضي (ساده)
  description: string;
  flavorNotes: string[];
  color: string; // Color tag for the visual blend ratio chart
}

export const BLEND_COFFEE_BEANS: BlendBeanOrigin[] = [
  // ================= 1. الأساسيات ودرجات التحميص التقليدية =================
  {
    id: "base-light",
    name: "بن فاتح بدران الأصلي",
    category: "basics",
    categoryLabel: "الأساسيات والتحميص",
    blendRole: "حموضة منعشة ونكهة كلاسيكية خفيفة",
    sadaPrice: 520,
    mohawajPrice: 600,
    kiloPrice: 520,
    description: "تحميص فاتح نقي يحتفظ بكامل خواص الحبة الطبيعية، يمنح التوليفة إشراقة كلاسيكية وحموضة ناعمة محبوبة.",
    flavorNotes: ["تحميص خفيف", "حموضة ناعمة", "طعم نقي"],
    color: "#EAB308", // yellow-500
  },
  {
    id: "base-med",
    name: "بن وسط بدران الموزون",
    category: "basics",
    categoryLabel: "الأساسيات والتحميص",
    blendRole: "التوازن المثالي والقوام المعتدل",
    sadaPrice: 520,
    mohawajPrice: 600,
    kiloPrice: 520,
    description: "التحميص الذهبي الأكثر شعبية، يجمع بين نعومة الطعم وحلاوة الكراميل بدون أي مرارة حادة.",
    flavorNotes: ["توازن كلاسيكي", "قوام معتدل", "حلاوة خفيفة"],
    color: "#B45309", // amber-700
  },
  {
    id: "base-dark",
    name: "بن غامق بدران الثقيل",
    category: "basics",
    categoryLabel: "الأساسيات والتحميص",
    blendRole: "ثقل وقوة المزاج ومرارة محببة",
    sadaPrice: 540,
    mohawajPrice: 620,
    kiloPrice: 540,
    description: "تحميص داكن عميق يمنح الفنجان قواماً مخملياً ثقيلاً ونكهة تحميص شرقية قوية لأصحاب المزاج العالي.",
    flavorNotes: ["تحميص غامق", "قوام ثقيل", "نكهة قوية"],
    color: "#451A03", // amber-950
  },
  {
    id: "base-double",
    name: "بن محروق (دبل روست) بدران",
    category: "basics",
    categoryLabel: "الأساسيات والتحميص",
    blendRole: "مرارة مكثفة وحدّة استثنائية",
    sadaPrice: 580,
    mohawajPrice: 680,
    kiloPrice: 580,
    description: "درجة تحميص فرنسية شديدة لعشاق المرارة العالية واللون الداكن جداً والرائحة الدخانية النفاذة.",
    flavorNotes: ["دبل روست", "مرارة شديدة", "دخان محبب"],
    color: "#18181B", // zinc-900
  },

  // ================= 2. البن البرازيلي (قاعدة التوليفات والنعومة) =================
  {
    id: "br-san",
    name: "بن برازيلي سانتوس الفاخر",
    category: "brazilian",
    categoryLabel: "البن البرازيلي",
    blendRole: "قاعدة التوليفة ونعومة القوام",
    sadaPrice: 720,
    mohawajPrice: 840,
    kiloPrice: 720,
    description: "البن البرازيلي الكلاسيكي المحبوب، حجر الأساس لأي توليفة بنعومة حريرية ومرارة منخفضة للغاية.",
    flavorNotes: ["حلاوة كراميل", "قوام ناعم", "توازن مثالي"],
    color: "#15803D", // green-700
  },
  {
    id: "br-cer",
    name: "بن برازيلي سيرادو مختص",
    category: "brazilian",
    categoryLabel: "البن البرازيلي",
    blendRole: "نكهة مكسرات وشوكولاتة غنية",
    sadaPrice: 880,
    mohawajPrice: 1000,
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
    sadaPrice: 600,
    mohawajPrice: 720,
    kiloPrice: 600,
    description: "طعم تقليدي قوي وحدّة محبوبة لعشاق القهوة الشرقية الثقيلة ذات المزاج العالي.",
    flavorNotes: ["حدة كلاسيكية", "طعم ثقيل", "نكهة تراثية"],
    color: "#14532D", // green-900
  },

  // ================= 3. البن الهندي (الوش والرغوة المتماسكة والنكهة) =================
  {
    id: "in-rob",
    name: "بن هندي روبوستا شيري",
    category: "indian",
    categoryLabel: "البن الهندي",
    blendRole: "سر الوش الكثيف والرغوة المتماسكة",
    sadaPrice: 560,
    mohawajPrice: 680,
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
    sadaPrice: 760,
    mohawajPrice: 880,
    kiloPrice: 760,
    description: "أرابيكا هندية مغسولة من المرتفعات، تضيف للتوليفة لمسة توابل ناعمة وتوازناً راقياً.",
    flavorNotes: ["توابل خفيفة", "شوكولاتة بالحليب", "حموضة متزنة"],
    color: "#D97706", // amber-600
  },
  {
    id: "in-arab",
    name: "بن هندي أرابيكا أصيل",
    category: "indian",
    categoryLabel: "البن الهندي",
    blendRole: "عطرية مميزة وقوام كريمي",
    sadaPrice: 840,
    mohawajPrice: 960,
    kiloPrice: 840,
    description: "حبوب أرابيكا هندية مختارة بعناية تمنح التوليفة رائحة زكية وقواماً مخملياً سلساً.",
    flavorNotes: ["رائحة زكية", "قوام مخملي", "مرارة معتدلة"],
    color: "#92400E", // amber-800
  },

  // ================= 4. البن الحبشي الإثيوبي (العطرية والفاكهية) =================
  {
    id: "hab-har",
    name: "بن حبشي هراري إثيوبي عريق",
    category: "habashi",
    categoryLabel: "البن الحبشي",
    blendRole: "عطرية فخمة وإيحاءات فاكهية نبيذية",
    sadaPrice: 960,
    mohawajPrice: 1080,
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
    sadaPrice: 920,
    mohawajPrice: 1040,
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
    sadaPrice: 1080,
    mohawajPrice: 1200,
    kiloPrice: 1080,
    description: "حبوب أرابيكا مغسولة من منطقة ليمو، تضفي على التوليفة إيحاءات فاكهية نبيذية وتوازناً راقياً للغاية.",
    flavorNotes: ["فاكهي نبيذي", "حلاوة سكرية", "توابل خفيفة"],
    color: "#7F1D1D", // red-900
  },
  {
    id: "hab-leq",
    name: "بن حبشي لقميتي إثيوبي ناعم",
    category: "habashi",
    categoryLabel: "البن الحبشي",
    blendRole: "نكهة بلدية وقوام خفيف معتدل",
    sadaPrice: 680,
    mohawajPrice: 800,
    kiloPrice: 680,
    description: "بن إثيوبي ناعم بنكهة ترابية فاكهية محبوبة وقوام خفيف معتدل يناسب المزاج اليومي.",
    flavorNotes: ["فاكهي ترابي", "قوام خفيف", "حموضة متزنة"],
    color: "#EF4444", // red-500
  },
  {
    id: "hab-djm",
    name: "بن حبشي ديمي أصيل",
    category: "habashi",
    categoryLabel: "البن الحبشي",
    blendRole: "عمق بري ونكهة بلدية أصيلة",
    sadaPrice: 800,
    mohawajPrice: 920,
    kiloPrice: 800,
    description: "بن إثيوبي بري يضفي على التوليفة عمقاً تراثياً ونفحات من العسل والتوابل البرية.",
    flavorNotes: ["توابل برية", "عسل طبيعي", "عمق عريق"],
    color: "#991B1B", // red-800
  },

  // ================= 5. أرابيكات العالم الفاخرة (كولومبي، يمني، جواتيمالا...) =================
  {
    id: "ar-col-dark",
    name: "بن كولومبي غامق فاخر",
    category: "world",
    categoryLabel: "أرابيكات العالم الفاخرة",
    blendRole: "شوكولاتة داكنة وقوام مخملي مكثف",
    sadaPrice: 1040,
    mohawajPrice: 1160,
    kiloPrice: 1040,
    description: "أرابيكا كولومبية نخب أول بتحميص داكن متقن، تمنح التوليفة طعم شوكولاتة داكنة فاخرة وقواماً مركزاً.",
    flavorNotes: ["شوكولاتة داكنة", "كراميل محمص", "قوام مخملي"],
    color: "#C2410C", // orange-700
  },
  {
    id: "ar-col-med",
    name: "بن كولومبي سوبريمو وسط",
    category: "world",
    categoryLabel: "أرابيكات العالم الفاخرة",
    blendRole: "نعومة شوكولاتة وتوازن حريري نقي",
    sadaPrice: 1000,
    mohawajPrice: 1120,
    kiloPrice: 1000,
    description: "أرابيكا كولومبية نخب أول بتحميص وسطي، ترفع جودة التوليفة بنعومة حريرية وحلاوة طبيعية صافية.",
    flavorNotes: ["شوكولاتة صافية", "كراميل ناعم", "نعومة حريرية"],
    color: "#EA580C", // orange-600
  },
  {
    id: "ar-yem",
    name: "بن يمني مطري أصيل",
    category: "world",
    categoryLabel: "أرابيكات العالم الفاخرة",
    blendRole: "اللمسة الملكية للتوليفات الخاصة",
    sadaPrice: 1880,
    mohawajPrice: 2000,
    kiloPrice: 1880,
    description: "أندر وأعرق حبوب البن عالمياً؛ إضافة 10% إلى 20% منه تحول أي توليفة إلى خلطة ملوك وأمراء.",
    flavorNotes: ["توابل ملكية", "شوكولاتة معقدة", "عطرية استثنائية"],
    color: "#C5A059", // badran gold
  },
  {
    id: "ar-gua",
    name: "بن جواتيمالا أنتيجوا بركاني",
    category: "world",
    categoryLabel: "أرابيكات العالم الفاخرة",
    blendRole: "نكهة كاكاو ودخان بركاني فاخر",
    sadaPrice: 1040,
    mohawajPrice: 1160,
    kiloPrice: 1040,
    description: "حبوب من مرتفعات البراكين تضفي على التوليفة إيحاءات الكاكاو الخام ولمسة تدخين شرقية راقية.",
    flavorNotes: ["كاكاو خام", "لمسة تدخين راقية", "حلاوة طبيعية"],
    color: "#9333EA", // purple-600
  },
  {
    id: "ar-peru",
    name: "بن بيرو عضوي فاخر",
    category: "world",
    categoryLabel: "أرابيكات العالم الفاخرة",
    blendRole: "نقاء جبلي وشوكولاتة بالحليب",
    sadaPrice: 1040,
    mohawajPrice: 1160,
    kiloPrice: 1040,
    description: "أرابيكا من مرتفعات جبال الأنديز بنقاء استثنائي ونكهة ناعمة تشبه الشوكولاتة بالحليب والمكسرات الخفيفة.",
    flavorNotes: ["شوكولاتة بالحليب", "مكسرات خفيفة", "نقاء استثنائي"],
    color: "#0284C7", // sky-600
  },
  {
    id: "ar-mex",
    name: "بن مكسيكي مرتفعات فاخر",
    category: "world",
    categoryLabel: "أرابيكات العالم الفاخرة",
    blendRole: "نكهة غنية وإيحاءات بندق وكراميل",
    sadaPrice: 1040,
    mohawajPrice: 1160,
    kiloPrice: 1040,
    description: "بن مكسيكي منتقى من المرتفعات العالية، يضفي على الخلطة لمسة بندق دافئة ونهاية متوازنة في الفم.",
    flavorNotes: ["بندق دافئ", "كراميل بني", "توازن مثالي"],
    color: "#0D9488", // teal-600
  },
  {
    id: "ar-ken",
    name: "بن كيني فاكهي قوي",
    category: "world",
    categoryLabel: "أرابيكات العالم الفاخرة",
    blendRole: "حموضة فوسفورية منعشة ومذاق كشمش",
    sadaPrice: 960,
    mohawajPrice: 1080,
    kiloPrice: 960,
    description: "أرابيكا كينية مشهورة بحموضتها الفاكهية الحيوية ومذاق الكشمش الأسود المنعش الذي يوقظ الحواس.",
    flavorNotes: ["كشمش أسود", "حموضة منعشة", "حيوية عالية"],
    color: "#E11D48", // rose-600
  },
  {
    id: "ar-hond",
    name: "بن هندوراس كلاسيك متوازن",
    category: "world",
    categoryLabel: "أرابيكات العالم الفاخرة",
    blendRole: "نعومة وسلاسة للاستهلاك اليومي",
    sadaPrice: 960,
    mohawajPrice: 1080,
    kiloPrice: 960,
    description: "أرابيكا معتدلة وسلسة للغاية، مثالية لتنعيم التوليفة وربط مكوناتها بنعومة فائقة.",
    flavorNotes: ["سلاسة فائقة", "حلاوة خفيفة", "حموضة معتدلة"],
    color: "#059669", // emerald-600
  },
  {
    id: "ar-viet",
    name: "بن فيتنامي روبوستا منتقى",
    category: "world",
    categoryLabel: "أرابيكات العالم الفاخرة",
    blendRole: "قوة تركيز ورغوة اقتصادية كثيفة",
    sadaPrice: 520,
    mohawajPrice: 640,
    kiloPrice: 520,
    description: "روبوستا فيتنامية نظيفة ومعالجة جيداً، ممتازة لزيادة تركيز الكافيين ودعم وش الفنجان.",
    flavorNotes: ["وش كثيف", "تركيز عالي", "طعم قوي"],
    color: "#475569", // slate-600
  },
];

export const BLEND_ORIGIN_CATEGORIES = [
  { id: "basics", label: "الأساسيات والتحميص (فاتح، وسط، غامق)" },
  { id: "brazilian", label: "البن البرازيلي (الأساس والقوام)" },
  { id: "indian", label: "البن الهندي (الوش والرغوة)" },
  { id: "habashi", label: "البن الحبشي (العطرية والفاكهية)" },
  { id: "world", label: "أرابيكات العالم الفاخرة (كولومبي، يمني، جواتيمالا...)" },
] as const;

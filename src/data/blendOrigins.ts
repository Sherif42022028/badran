export type BlendCategoryType =
  | "badran_plain"
  | "brazilian"
  | "indian"
  | "habashi"
  | "latin_arabicas"
  | "afro_asian_arabicas"
  | "signature_blends";

export interface BlendBeanOrigin {
  id: string;
  name: string;
  category: BlendCategoryType;
  categoryLabel: string;
  blendRole: string; // الدور الأساسي للصنف في التوليفة
  roleBadge?: "crema" | "chocolate" | "aromatic" | "royal" | "classic"; // شارة الهدف السريع (وش، شوكولاتة، عطرية، ملوكي، كلاسيكي)
  sadaPrice: number; // سعر الكيلو ساده
  mohawajPrice: number; // سعر الكيلو محوج بالحبهان
  kiloPrice: number; // السعر الافتراضي (ساده)
  description: string;
  flavorNotes: string[];
  color: string; // Color tag for the visual blend ratio chart
}

export interface BlendOriginCategoryInfo {
  id: BlendCategoryType;
  label: string;
  sublabel: string;
  iconName: string;
  advice: string;
}

export const BLEND_ORIGIN_CATEGORIES: BlendOriginCategoryInfo[] = [
  {
    id: "badran_plain",
    label: "بن بدران السادة (الأساسي)",
    sublabel: "درجات التحميص الأصلية الأربعة",
    iconName: "Flame",
    advice: "بن بدران النقي بمستويات التحميص الأربعة (فاتح، وسط، غامق، محروق)؛ أساس فنجان القهوة التراثي في ميت غمر، يمكنك استخدامه كقاعدة رئيسية لتوليفة فنجانك أو مزج درجات مختلفة معاً.",
  },
  {
    id: "brazilian",
    label: "البن البرازيلي",
    sublabel: "حجر الأساس والنعومة",
    iconName: "Sun",
    advice: "حجر الأساس لأي توليفة؛ يمنح فنجانك قواماً مخملياً متوازناً ونعومة كلاسيكية بدون مرارة حادة. (النسبة المقترحة: 30% - 60%)",
  },
  {
    id: "indian",
    label: "البن الهندي",
    sublabel: "سر الوش والرغوة والكافيين",
    iconName: "Globe",
    advice: "سر الرغوة الذهبية الكثيفة؛ يضمن وشاً عريضاً متماسكاً يدوم حتى آخر قطرة مع دفعة كافيين ممتازة. (النسبة المقترحة: 15% - 25%)",
  },
  {
    id: "habashi",
    label: "البن الحبشي الإثيوبي",
    sublabel: "العطرية والفاكهية الأسطورية",
    iconName: "Coffee",
    advice: "تاج العطرية والروائح الزكية؛ يضفي على الخلطة نفحات زهرية وفاكهية نبيذية تعبّأ المكان. (النسبة المقترحة: 20% - 40%)",
  },
  {
    id: "latin_arabicas",
    label: "أرابيكات أمريكا اللاتينية",
    sublabel: "الشوكولاتة، الكراميل، والمكسرات",
    iconName: "Compass",
    advice: "أجود محاصيل الأنديز والبراكين (كولومبي، جواتيمالا، مكسيكي) لإضافة طعم الشوكولاتة والكراميل والبندق. (النسبة المقترحة: 20% - 50%)",
  },
  {
    id: "afro_asian_arabicas",
    label: "أرابيكات أفريقيا وآسيا النادرة",
    sublabel: "النوادر والمذاقات الإقليمية الفريدة",
    iconName: "Sparkles",
    advice: "أندر المحاصيل العالمية المعتمدة (يمني مطري، كيني، سومطرة) لتحويل فنجانك إلى تحفة خاصة بالغة الفخامة. (النسبة المقترحة: 10% - 30%)",
  },
  {
    id: "signature_blends",
    label: "توليفات بدران الملكية",
    sublabel: "خلطات متكاملة كأساس للتعديل",
    iconName: "Flame",
    advice: "خلطات عائلة بدران المتوارثة (اسبيشيال، السلطان، العميد)؛ يمكنك استخدامها كقاعدة وإضافة لمستك الخاصة عليها.",
  },
];

export const BLEND_COFFEE_BEANS: BlendBeanOrigin[] = [
  // ================= 0. بن بدران السادة الأصلي بجميع درجاته =================
  {
    id: "badran-plain-light",
    name: "بن ساده بدران (فاتح)",
    category: "badran_plain",
    categoryLabel: "بن بدران السادة",
    blendRole: "تحميص فاتح هادئ يحافظ على النقاء وحموضة خفيفة منعشة",
    roleBadge: "classic",
    sadaPrice: 520,
    mohawajPrice: 600,
    kiloPrice: 520,
    description: "البن السادة الأساسي من محامص بدران بدرجة تحميص فاتحة، خفيف وسلس على المعدة مع رغوة ذهبية صافية ومذاق نقي.",
    flavorNotes: ["تحميص فاتح", "خفيف وسلس", "نقاء المذاق", "رغوة ذهبية"],
    color: "#D4A373",
  },
  {
    id: "badran-plain-medium",
    name: "بن ساده بدران (وسط)",
    category: "badran_plain",
    categoryLabel: "بن بدران السادة",
    blendRole: "التحميص الأكثر توازناً وشهرة، يجمع القوام المظبوط والوش الكثيف",
    roleBadge: "classic",
    sadaPrice: 520,
    mohawajPrice: 600,
    kiloPrice: 520,
    description: "الدرجة الكلاسيكية الأكثر طلباً في ميت غمر، توازن عبقري بين القوام والوش دون مرارة طاغية، ممتازة كقاعدة يومية لأي توليفة.",
    flavorNotes: ["تحميص وسط كلاسيكي", "الأكثر طلباً", "وش متماسك", "توازن مثالي"],
    color: "#9C6644",
  },
  {
    id: "badran-plain-dark",
    name: "بن ساده بدران (غامق)",
    category: "badran_plain",
    categoryLabel: "بن بدران السادة",
    blendRole: "تحميص غامق عميق لعشاق النكهة القوية والمزاج الثقيل",
    roleBadge: "classic",
    sadaPrice: 540,
    mohawajPrice: 620,
    kiloPrice: 540,
    description: "تحميصة غامقة متقنة بلمسة دخانية محببة ومرارة بنية أصيلة تمنح الفنجان ثقلاً وتركيزاً عالياً لعشاق المزاج العالي.",
    flavorNotes: ["تحميص غامق", "نكهة قوية", "قوام ثقيل", "مرارة محببة"],
    color: "#582F0E",
  },
  {
    id: "badran-plain-extra-dark",
    name: "بن ساده بدران (محروق / دوبل دارك)",
    category: "badran_plain",
    categoryLabel: "بن بدران السادة",
    blendRole: "أعلى درجات التحميص لقوة استثنائية ونفحة تحميص فرنسي حادة",
    roleBadge: "classic",
    sadaPrice: 580,
    mohawajPrice: 660,
    kiloPrice: 580,
    description: "تحميص إكسترا غامق (دوبل دارك / محروق) لقهوة داكنة قوية ذات طابع مدخن حاد، ممتازة لإعطاء لسعة قوية وتركيز مضاعف لأي توليفة.",
    flavorNotes: ["تحميص إكسترا دارك", "دوبل دارك", "نكهة مدخنة حادة", "تركيز استثنائي"],
    color: "#2C1810",
  },

  // ================= 1. البن البرازيلي (حجر الأساس والنعومة) =================
  {
    id: "br-san",
    name: "بن برازيلي سانتوس الفاخر",
    category: "brazilian",
    categoryLabel: "البن البرازيلي",
    blendRole: "قاعدة التوليفة ونعومة القوام",
    roleBadge: "chocolate",
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
    roleBadge: "chocolate",
    sadaPrice: 880,
    mohawajPrice: 1000,
    kiloPrice: 880,
    description: "أرابيكا برازيلية نقية تعطي التوليفة بعداً غنياً بنكهات المكسرات المحمصة والشوكولاتة وقوام كامل.",
    flavorNotes: ["مكسرات محمصة", "شوكولاتة داكنة", "قوام كامل"],
    color: "#16A34A", // green-600
  },
  {
    id: "br-rio",
    name: "بن برازيلي ريو مينيو",
    category: "brazilian",
    categoryLabel: "البن البرازيلي",
    blendRole: "قوام ثقيل ومزاج تقليدي عريق",
    roleBadge: "crema",
    sadaPrice: 600,
    mohawajPrice: 720,
    kiloPrice: 600,
    description: "طعم تقليدي قوي وحدّة محبوبة لعشاق القهوة الشرقية الثقيلة ذات المزاج العالي.",
    flavorNotes: ["حدة كلاسيكية", "طعم ثقيل", "نكهة تراثية"],
    color: "#14532D", // green-900
  },

  // ================= 2. البن الهندي (الوش والرغوة والكريمة) =================
  {
    id: "in-rob",
    name: "بن هندي روبوستا شيري",
    category: "indian",
    categoryLabel: "البن الهندي",
    blendRole: "سر الوش الكثيف والرغوة المتماسكة",
    roleBadge: "crema",
    sadaPrice: 560,
    mohawajPrice: 680,
    kiloPrice: 560,
    description: "الحبة السحرية لضبط وش الفنجان؛ تمنح التوليفة رغوة ذهبية متماسكة وقوة كافيين ممتازة.",
    flavorNotes: ["وش كريمي متماسك", "كافيين عالي", "ثقل القوام"],
    color: "#78350F", // amber-900
  },
  {
    id: "in-plan",
    name: "بن هندي بلانتيشن أرابيكا فاخر",
    category: "indian",
    categoryLabel: "البن الهندي",
    blendRole: "توابل شرقية خفيفة وتوازن راقي",
    roleBadge: "aromatic",
    sadaPrice: 840,
    mohawajPrice: 960,
    kiloPrice: 840,
    description: "أرابيكا هندية مغسولة من المرتفعات، تضيف للتوليفة لمسة توابل ناعمة وتوازناً راقياً.",
    flavorNotes: ["توابل خفيفة", "شوكولاتة بالحليب", "حموضة متزنة"],
    color: "#D97706", // amber-600
  },
  {
    id: "in-arab",
    name: "بن هندي أرابيكا أصيل",
    category: "indian",
    categoryLabel: "البن الهندي",
    blendRole: "عطرية مميزة وقوام مخملي",
    roleBadge: "aromatic",
    sadaPrice: 840,
    mohawajPrice: 960,
    kiloPrice: 840,
    description: "حبوب أرابيكا هندية مختارة بعناية تمنح التوليفة رائحة زكية وقواماً مخملياً سلساً.",
    flavorNotes: ["رائحة زكية", "قوام مخملي", "مرارة معتدلة"],
    color: "#92400E", // amber-800
  },

  // ================= 3. البن الحبشي الإثيوبي (العطرية والفاكهية) =================
  {
    id: "hab-har",
    name: "بن حبشي هراري إثيوبي عريق",
    category: "habashi",
    categoryLabel: "البن الحبشي",
    blendRole: "عطرية فخمة وإيحاءات فاكهية نبيذية",
    roleBadge: "aromatic",
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
    roleBadge: "aromatic",
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
    roleBadge: "aromatic",
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
    roleBadge: "aromatic",
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
    roleBadge: "aromatic",
    sadaPrice: 800,
    mohawajPrice: 920,
    kiloPrice: 800,
    description: "بن إثيوبي بري يضفي على التوليفة عمقاً تراثياً ونفحات من العسل والتوابل البرية.",
    flavorNotes: ["توابل برية", "عسل طبيعي", "عمق عريق"],
    color: "#991B1B", // red-800
  },

  // ================= 4. أرابيكات أمريكا اللاتينية (الشوكولاتة والمكسرات) =================
  {
    id: "ar-col-dark",
    name: "بن كولومبي سوبريمو غامق فاخر",
    category: "latin_arabicas",
    categoryLabel: "أرابيكات أمريكا اللاتينية",
    blendRole: "شوكولاتة داكنة وقوام مخملي مكثف",
    roleBadge: "chocolate",
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
    category: "latin_arabicas",
    categoryLabel: "أرابيكات أمريكا اللاتينية",
    blendRole: "نعومة شوكولاتة وتوازن حريري نقي",
    roleBadge: "chocolate",
    sadaPrice: 1000,
    mohawajPrice: 1120,
    kiloPrice: 1000,
    description: "أرابيكا كولومبية نخب أول بتحميص وسطي، ترفع جودة التوليفة بنعومة حريرية وحلاوة طبيعية صافية.",
    flavorNotes: ["شوكولاتة صافية", "كراميل ناعم", "نعومة حريرية"],
    color: "#EA580C", // orange-600
  },
  {
    id: "ar-col-light",
    name: "بن كولومبي سوبريمو تحت الوسط",
    category: "latin_arabicas",
    categoryLabel: "أرابيكات أمريكا اللاتينية",
    blendRole: "حلاوة سكرية مع حموضة ناعمة منعشة",
    roleBadge: "chocolate",
    sadaPrice: 1000,
    mohawajPrice: 1120,
    kiloPrice: 1000,
    description: "تحميصة هادئة تبرز الحلاوة السكرية الطبيعية لحبوب كولومبيا وتضفي إشراقة ناعمة للتوليفة.",
    flavorNotes: ["حلاوة قصب السكر", "حموضة ناعمة", "سلاسة فائقة"],
    color: "#F97316", // orange-500
  },
  {
    id: "ar-gua",
    name: "بن جواتيمالا أنتيجوا بركاني",
    category: "latin_arabicas",
    categoryLabel: "أرابيكات أمريكا اللاتينية",
    blendRole: "نكهة كاكاو ودخان بركاني فاخر",
    roleBadge: "chocolate",
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
    category: "latin_arabicas",
    categoryLabel: "أرابيكات أمريكا اللاتينية",
    blendRole: "نقاء جبلي وشوكولاتة بالحليب",
    roleBadge: "chocolate",
    sadaPrice: 1040,
    mohawajPrice: 1160,
    kiloPrice: 1040,
    description: "أرابيكا من مرتفعات جبال الأنديز بنقاء استثنائي ونكهة ناعمة تشبه الشوكولاتة بالحليب والمكسرات الخفيفة.",
    flavorNotes: ["شوكولاتة بالحليب", "مكسرات خفيفة", "نقاء استثنائي"],
    color: "#0284C7", // sky-600
  },
  {
    id: "ar-mex-med",
    name: "بن مكسيكي مرتفعات وسط",
    category: "latin_arabicas",
    categoryLabel: "أرابيكات أمريكا اللاتينية",
    blendRole: "نكهة بندق دافئ ونهاية متوازنة",
    roleBadge: "chocolate",
    sadaPrice: 1040,
    mohawajPrice: 1160,
    kiloPrice: 1040,
    description: "بن مكسيكي من المرتفعات العالية بتحميص وسط، يضفي لمسة بندق دافئة ونهاية متوازنة في الفم.",
    flavorNotes: ["بندق دافئ", "كراميل بني", "توازن مثالي"],
    color: "#0D9488", // teal-600
  },
  {
    id: "ar-mex-dark",
    name: "بن مكسيكي مرتفعات غامق",
    category: "latin_arabicas",
    categoryLabel: "أرابيكات أمريكا اللاتينية",
    blendRole: "تحميص داكن عميق ونكهات كاكاو محمصة",
    roleBadge: "chocolate",
    sadaPrice: 1080,
    mohawajPrice: 1200,
    kiloPrice: 1080,
    description: "تحميص داكن يمنح حبوب المكسيك نكهة كاكاو مكثفة وقواماً مركزاً لمحبي القهوة الثقيلة.",
    flavorNotes: ["كاكاو محمص", "قوام ثقيل", "مرارة معتدلة"],
    color: "#0F766E", // teal-700
  },
  {
    id: "ar-costa",
    name: "بن كوستاريكا تارازو الفاخر",
    category: "latin_arabicas",
    categoryLabel: "أرابيكات أمريكا اللاتينية",
    blendRole: "إيحاءات عسلية وحمضيات راقية",
    roleBadge: "aromatic",
    sadaPrice: 1080,
    mohawajPrice: 1200,
    kiloPrice: 1080,
    description: "محصول تارازو الشهير عالمياً بنقاء استثنائي وحموضة برتقالية ناعمة وحلاوة عسلية غنية.",
    flavorNotes: ["عسل طبيعي", "حمضيات راقية", "قوام ناعم"],
    color: "#0284C7", // sky-600
  },
  {
    id: "ar-nic",
    name: "بن نيكاراجوا أرابيكا فاخر",
    category: "latin_arabicas",
    categoryLabel: "أرابيكات أمريكا اللاتينية",
    blendRole: "حموضة ناعمة ونوتات لوز ومكسرات",
    roleBadge: "chocolate",
    sadaPrice: 1120,
    mohawajPrice: 1240,
    kiloPrice: 1120,
    description: "حبات أرابيكا كبيرة الحجم بنكهات المكسرات واللوز الحلو وقوام ممتلئ يثري التوليفة.",
    flavorNotes: ["لوز حلو", "شوكولاتة", "حموضة متزنة"],
    color: "#4338CA", // indigo-700
  },
  {
    id: "ar-hond",
    name: "بن هندوراس كلاسيك متوازن",
    category: "latin_arabicas",
    categoryLabel: "أرابيكات أمريكا اللاتينية",
    blendRole: "نعومة وسلاسة للاستهلاك اليومي",
    roleBadge: "chocolate",
    sadaPrice: 960,
    mohawajPrice: 1080,
    kiloPrice: 960,
    description: "أرابيكا معتدلة وسلسة للغاية، مثالية لتنعيم التوليفة وربط مكوناتها بنعومة فائقة.",
    flavorNotes: ["سلاسة فائقة", "حلاوة خفيفة", "حموضة معتدلة"],
    color: "#059669", // emerald-600
  },
  {
    id: "ar-venez",
    name: "بن فنزويلا أرابيكا راقي",
    category: "latin_arabicas",
    categoryLabel: "أرابيكات أمريكا اللاتينية",
    blendRole: "طعم متزن ورائحة عطرية زكية",
    roleBadge: "aromatic",
    sadaPrice: 1080,
    mohawajPrice: 1200,
    kiloPrice: 1080,
    description: "أرابيكا كلاسيكية متوازنة بطابع كاريبي هادئ وقوام خفيف معتدل ورائحة ذكية.",
    flavorNotes: ["عطرية هادئة", "قوام متوازن", "حلاوة خفيفة"],
    color: "#6D28D9", // purple-700
  },

  // ================= 5. أرابيكات أفريقيا وآسيا النادرة (النوادر والعطرية الإقليمية) =================
  {
    id: "ar-yem",
    name: "بن يمني مطري أصيل",
    category: "afro_asian_arabicas",
    categoryLabel: "أرابيكات أفريقيا وآسيا النادرة",
    blendRole: "اللمسة الملكية للتوليفات الخاصة",
    roleBadge: "royal",
    sadaPrice: 1880,
    mohawajPrice: 2000,
    kiloPrice: 1880,
    description: "أندر وأعرق حبوب البن عالمياً؛ إضافة 10% إلى 20% منه تحول أي توليفة إلى خلطة ملوك وأمراء.",
    flavorNotes: ["توابل ملكية", "شوكولاتة معقدة", "عطرية استثنائية"],
    color: "#C5A059", // badran gold
  },
  {
    id: "ar-ken-med",
    name: "بن كيني فاكهي وسط (Kenya AA)",
    category: "afro_asian_arabicas",
    categoryLabel: "أرابيكات أفريقيا وآسيا النادرة",
    blendRole: "حموضة فوسفورية منعشة ومذاق كشمش",
    roleBadge: "aromatic",
    sadaPrice: 960,
    mohawajPrice: 1080,
    kiloPrice: 960,
    description: "أرابيكا كينية مشهورة بحموضتها الفاكهية الحيوية ومذاق الكشمش الأسود المنعش الذي يوقظ الحواس.",
    flavorNotes: ["كشمش أسود", "حموضة منعشة", "حيوية عالية"],
    color: "#E11D48", // rose-600
  },
  {
    id: "ar-ken-dark",
    name: "بن كيني غامق فاكهي",
    category: "afro_asian_arabicas",
    categoryLabel: "أرابيكات أفريقيا وآسيا النادرة",
    blendRole: "حموضة فاكهية داكنة وقوام مكثف",
    roleBadge: "aromatic",
    sadaPrice: 1000,
    mohawajPrice: 1120,
    kiloPrice: 1000,
    description: "تحميص داكن يجمع بين إيحاءات التوت الأسود الكيني والقوام الثقيل الممتلئ.",
    flavorNotes: ["توت أسود", "قوام مكثف", "نهاية عميقة"],
    color: "#BE123C", // rose-700
  },
  {
    id: "ar-tanzania",
    name: "بن تنزاني أرابيكا (كليمنجارو)",
    category: "afro_asian_arabicas",
    categoryLabel: "أرابيكات أفريقيا وآسيا النادرة",
    blendRole: "نكهات توت وحموضة برتقالية مبهجة",
    roleBadge: "aromatic",
    sadaPrice: 840,
    mohawajPrice: 960,
    kiloPrice: 840,
    description: "يزرع على سفوح جبل كليمنجارو، يتميز بنقاء الحموضة ونوتات الفواكه الاستوائية والقوام المتوسط.",
    flavorNotes: ["توت بري", "حمضيات مبهجة", "نقاء عالي"],
    color: "#2563EB", // blue-600
  },
  {
    id: "ar-uganda",
    name: "بن أوغندي أرابيكا (جبل إلجون)",
    category: "afro_asian_arabicas",
    categoryLabel: "أرابيكات أفريقيا وآسيا النادرة",
    blendRole: "شوكولاتة وقوام ممتلئ وسعر ممتاز",
    roleBadge: "chocolate",
    sadaPrice: 800,
    mohawajPrice: 920,
    kiloPrice: 800,
    description: "أرابيكا إفريقية ممتازة من جبل إلجون تمنح الفنجان قواماً ممتلئاً ونكهات الشوكولاتة بسعر اقتصادي.",
    flavorNotes: ["شوكولاتة", "قوام ممتلئ", "مرارة ناعمة"],
    color: "#1D4ED8", // blue-700
  },
  {
    id: "ar-sumatra",
    name: "بن سومطرة إندونيسي بركاني",
    category: "afro_asian_arabicas",
    categoryLabel: "أرابيكات أفريقيا وآسيا النادرة",
    blendRole: "قوام ثقيل ونكهات ترابية وعشبية",
    roleBadge: "crema",
    sadaPrice: 960,
    mohawajPrice: 1080,
    kiloPrice: 960,
    description: "معالج بالطريقة الرطبة التقليدية (Giling Basah)، يضفي على التوليفة قواماً سميكاً ونكهات ترابية معقدة.",
    flavorNotes: ["قوام سميك", "توابل ترابية", "أعشاب برية"],
    color: "#047857", // emerald-700
  },
  {
    id: "ar-gayo",
    name: "بن جايو سومطرة المختص",
    category: "afro_asian_arabicas",
    categoryLabel: "أرابيكات أفريقيا وآسيا النادرة",
    blendRole: "محصول مختص عالي التعقيد والأروماتيك",
    roleBadge: "royal",
    sadaPrice: 1080,
    mohawajPrice: 1200,
    kiloPrice: 1080,
    description: "من منطقة مرتفعات جايو الشهيرة، قهوة مختصة غنية بنكهات السكر البني والكاكاو والبهارات الدافئة.",
    flavorNotes: ["سكر بني", "بهارات دافئة", "كاكاو معقد"],
    color: "#065F46", // emerald-800
  },
  {
    id: "ar-vietnam",
    name: "بن فيتنامي أرابيكا نقي",
    category: "afro_asian_arabicas",
    categoryLabel: "أرابيكات أفريقيا وآسيا النادرة",
    blendRole: "أرابيكا خفيفة ونقية وسلسة",
    roleBadge: "chocolate",
    sadaPrice: 840,
    mohawajPrice: 960,
    kiloPrice: 840,
    description: "أرابيكا فيتنامية مغسولة خفيفة ونظيفة، تمنح التوليفة توازناً سلساً ومرارة هادئة.",
    flavorNotes: ["سلاسة خفيفة", "حموضة معتدلة", "طعم نقي"],
    color: "#64748B", // slate-500
  },
  {
    id: "ar-viet",
    name: "بن فيتنامي روبوستا منتقى",
    category: "afro_asian_arabicas",
    categoryLabel: "أرابيكات أفريقيا وآسيا النادرة",
    blendRole: "قوة تركيز ورغوة اقتصادية كثيفة",
    roleBadge: "crema",
    sadaPrice: 520,
    mohawajPrice: 640,
    kiloPrice: 520,
    description: "روبوستا فيتنامية نظيفة ومعالجة جيداً، ممتازة لزيادة تركيز الكافيين ودعم وش الفنجان.",
    flavorNotes: ["وش كثيف", "تركيز عالي", "طعم قوي"],
    color: "#475569", // slate-600
  },
  {
    id: "ar-w",
    name: "بن دابليو أرابيكا كلاسيك",
    category: "afro_asian_arabicas",
    categoryLabel: "أرابيكات أفريقيا وآسيا النادرة",
    blendRole: "أرابيكا يومية متوازنة واقتصادية",
    roleBadge: "chocolate",
    sadaPrice: 640,
    mohawajPrice: 760,
    kiloPrice: 640,
    description: "أرابيكا يومية ممتازة لربط التوليفة وتقديم فنجان متوازن المذاق بسعر اقتصادي.",
    flavorNotes: ["طعم يومي متوازن", "قوام معتدل", "مرارة هادئة"],
    color: "#334155", // slate-700
  },

  // ================= 6. توليفات بدران الملكية (العميد، السلطان، اسبيشيال...) =================
  {
    id: "blend-special-badran",
    name: "توليفة اسبيشيال بدران الملكية",
    category: "signature_blends",
    categoryLabel: "توليفات بدران الخاصة",
    blendRole: "سر عائلة بدران: مزيج سحري متوازن من 4 أصناف أرابيكا عالمية",
    roleBadge: "royal",
    sadaPrice: 760,
    mohawajPrice: 880,
    kiloPrice: 760,
    description: "سر الصنعة المتوارث في عائلة بدران: مزيج متناغم من 4 محاصيل أرابيكا عالمية منتقاة لتحقيق فنجان غني النكهة ذو رغوة متماسكة.",
    flavorNotes: ["سر الصنعة", "أرابيكا عالمية", "قوام مخملي", "رغوة متماسكة"],
    color: "#D97706", // amber-600
  },
  {
    id: "blend-sultan",
    name: "توليفة السلطان الفاخرة",
    category: "signature_blends",
    categoryLabel: "توليفات بدران الخاصة",
    blendRole: "توليفة ملوكية بنكهة عميقة وقوام غني لصفوة الذواقة",
    roleBadge: "royal",
    sadaPrice: 760,
    mohawajPrice: 880,
    kiloPrice: 760,
    description: "توليفة ملكية خاصة تمزج بين كثافة البن البرازيلي الفاخر ونكهة الأرابيكا المركزة لتمنحك فنجاناً سلطانياً فخماً.",
    flavorNotes: ["قوام ملوكي", "نكهة عميقة", "توازن فاخر", "كثافة ممتازة"],
    color: "#B45309", // amber-700
  },
  {
    id: "blend-ameed",
    name: "توليفة العميد الخاصة",
    category: "signature_blends",
    categoryLabel: "توليفات بدران الخاصة",
    blendRole: "توليفة ثقيلة لتركيز عالي ووش كثيف متماسك",
    roleBadge: "crema",
    sadaPrice: 1000,
    mohawajPrice: 1120,
    kiloPrice: 1000,
    description: "توليفة العميد الأكثر ثقلاً وتركيزاً، محمصة بحرفية لعشاق القهوة الثقيلة ذات الوش الذهبي العريض والتركيز العالي.",
    flavorNotes: ["تركيز عالي", "وش كثيف جداً", "قوام ثقيل", "مزاج عالي"],
    color: "#78350F", // amber-900
  },
  {
    id: "blend-malaki",
    name: "توليفة الملكي الراقية",
    category: "signature_blends",
    categoryLabel: "توليفات بدران الخاصة",
    blendRole: "مزيج ثلاثي كولومبي وهندي وبرازيلي بلمسة تحميص خاصة",
    roleBadge: "royal",
    sadaPrice: 800,
    mohawajPrice: 920,
    kiloPrice: 800,
    description: "توليفة ثلاثية متقنة تجمع بين حموضة الكولومبي الناعمة، وش الروبوستا الهندي، وقوام البرازيلي الكلاسيكي.",
    flavorNotes: ["توليفة ثلاثية", "كولومبي وبرازيلي", "وش هندي", "نكهة راقية"],
    color: "#854D0E", // yellow-800
  },
  {
    id: "blend-asli",
    name: "توليفة الأصلي التراثية",
    category: "signature_blends",
    categoryLabel: "توليفات بدران الخاصة",
    blendRole: "خلطة الأجداد التراثية التي انطلق بها محل بدران منذ عقود",
    roleBadge: "royal",
    sadaPrice: 880,
    mohawajPrice: 1000,
    kiloPrice: 880,
    description: "الخلطة التراثية الأصلية التي عُرف بها بن بدران في ميت غمر، تحميصة متوازنة تجمع عبق الماضي وجودة الحاضر.",
    flavorNotes: ["تراث بدران", "خلطة الأجداد", "نكهة أصيلة", "تحميصة ميت غمر"],
    color: "#C2410C", // orange-700
  },
];

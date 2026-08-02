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

export const CATEGORIES: Category[] = [
  {
    id: "special",
    name: "خلطات بن بدران الخاصة",
    iconName: "Sparkles",
    description: "سر التحميص والتوليف الخاص بعائلة بدران عبر السنين",
  },
  {
    id: "arabica",
    name: "الأرابيكات الفاخرة",
    iconName: "Coffee",
    description: "أنقى حبوب البن العالمي من كولومبيا وإثيوبيا واليمن",
  },
  {
    id: "french",
    name: "الفرنسويات والموكا",
    iconName: "CupSoda",
    description: "خلطات القهوة الفرنسية بالنكهات الغنية والكريمة الناعمة",
  },
  {
    id: "turkish",
    name: "البن التركي والتقليدي",
    iconName: "Flame",
    description: "البن التراثي المحمص بدقة (فاتح، وسط، غامق - سادة ومحوج)",
  },
  {
    id: "drinks",
    name: "المشروبات والاسبريسو",
    iconName: "Zap",
    description: "مشروبات القهوة الجاهزة والاسبريسو والكابوتشينو الطازج",
  },
];

export const MENU_ITEMS: MenuItem[] = [
  // خلطات بن بدران الخاصة
  {
    id: "b1",
    name: "توليفة بدران الملكية (سادة)",
    category: "special",
    description: "توليفة سحرية من 4 أنواع بن أرابيكا عالمية محصورة في محل بدران.",
    prices: [
      { unit: "ثمن كيلو (125جم)", price: 85 },
      { unit: "ربع كيلو (250جم)", price: 165 },
      { unit: "نصف كيلو (500جم)", price: 320 },
      { unit: "كيلو كامل", price: 630 },
    ],
    isSpecial: true,
  },
  {
    id: "b2",
    name: "توليفة بدران الملكية (محوج سوبر)",
    category: "special",
    description: "محوجة بحبهان هندي أخضر فرز أول + مستكة يوناني وجوزة الطيب وزر ورد.",
    prices: [
      { unit: "ثمن كيلو (125جم)", price: 105 },
      { unit: "ربع كيلو (250جم)", price: 200 },
      { unit: "نصف كيلو (500جم)", price: 390 },
      { unit: "كيلو كامل", price: 760 },
    ],
    isSpecial: true,
  },

  // الأرابيكات الفاخرة
  {
    id: "a1",
    name: "بن كولومبي ميديوم فاخر",
    category: "arabica",
    description: "حموضة متوازنة مع إيحاءات الشوكولاتة والمكسرات المحمصة.",
    prices: [
      { unit: "ثمن كيلو", price: 90 },
      { unit: "ربع كيلو", price: 175 },
      { unit: "كيلو كامل", price: 680 },
    ],
  },
  {
    id: "a2",
    name: "بن حبشي إثيوبي (يرجاتشيف)",
    category: "arabica",
    description: "مذاق فاكهي غني وزهري أصيل لعشاق القهوة المختصة.",
    prices: [
      { unit: "ثمن كيلو", price: 95 },
      { unit: "ربع كيلو", price: 185 },
      { unit: "كيلو كامل", price: 720 },
    ],
  },
  {
    id: "a3",
    name: "بن يمني محلي عالي الجودة",
    category: "arabica",
    description: "البن التراثي الأصيل بطعم قوي وعميق وتركيز استثنائي.",
    prices: [
      { unit: "ثمن كيلو", price: 120 },
      { unit: "ربع كيلو", price: 235 },
      { unit: "كيلو كامل", price: 900 },
    ],
    isSpecial: true,
  },

  // الفرنسويات
  {
    id: "f1",
    name: "قهوة فرنسية بالبندق المحمص",
    category: "french",
    description: "مزج البن الفاخر مع معجون البندق التركي الطبيعي والكريمة.",
    prices: [
      { unit: "عبوة 250جم", price: 120 },
      { unit: "عبوة 500جم", price: 230 },
      { unit: "كيلو سائب", price: 440 },
    ],
  },
  {
    id: "f2",
    name: "فرنساوي بالشوكلاتة والموكا",
    category: "french",
    description: "طعم الكاكاو البلجيكي الغني مع البن الفرنسي الناعم.",
    prices: [
      { unit: "عبوة 250جم", price: 115 },
      { unit: "عبوة 500جم", price: 220 },
      { unit: "كيلو سائب", price: 420 },
    ],
  },
  {
    id: "f3",
    name: "فرنساوي بالفانيليا الكريمة",
    category: "french",
    description: "نكهة فانيليا مدغشقر الساحرة مع قوام كريمي مخملي.",
    prices: [
      { unit: "عبوة 250جم", price: 110 },
      { unit: "عبوة 500جم", price: 210 },
      { unit: "كيلو سائب", price: 400 },
    ],
  },

  // البن التركي
  {
    id: "t1",
    name: "بن تركي فاتح (سادة)",
    category: "turkish",
    description: "تحميص خفيف يحافظ على النكهات الفاكهية والزهرية للبن.",
    prices: [
      { unit: "ثمن كيلو", price: 75 },
      { unit: "ربع كيلو", price: 145 },
      { unit: "كيلو كامل", price: 550 },
    ],
  },
  {
    id: "t2",
    name: "بن تركي وسط (محوج حبهان)",
    category: "turkish",
    description: "التحميص الأكثر طلباً، متوازن ومطعم بالحبهان الأخضر.",
    prices: [
      { unit: "ثمن كيلو", price: 85 },
      { unit: "ربع كيلو", price: 165 },
      { unit: "كيلو كامل", price: 620 },
    ],
  },
  {
    id: "t3",
    name: "بن تركي غامق (سادة / محوج)",
    category: "turkish",
    description: "تحميص غامق ثقيل وقوي لعشاق المزاج المظبوط والمرارة المحبوبة.",
    prices: [
      { unit: "ثمن كيلو", price: 80 },
      { unit: "ربع كيلو", price: 155 },
      { unit: "كيلو كامل", price: 590 },
    ],
  },

  // المشروبات الساخنة والاسبريسو
  {
    id: "d1",
    name: "اسبريسو بدران دبل سينجل أوريجين",
    category: "drinks",
    description: "استخلاص مثالي لكريمة ذهبية ومذاق مركز جداً.",
    prices: [{ unit: "فنجان دبل", price: 45 }],
  },
  {
    id: "d2",
    name: "كابوتشينو رغوة رويال",
    category: "drinks",
    description: "اسبريسو مركز مع حليب مبخر ورغوة حليب كثيفة ورشة قرفة.",
    prices: [{ unit: "كوب كبير", price: 55 }],
  },
  {
    id: "d3",
    name: "سبانيش لاتيه بارد / ساخن",
    category: "drinks",
    description: "مزيج الاسبريسو والحليب المكثف المحلى بطعم لا يقاوم.",
    prices: [{ unit: "كوب كبير", price: 65 }],
  },
];

export const PRINTED_MENU_PAGES = [
  { id: 1, src: "/1.jpg", title: "الواجهة والغلاف الرئيسي للمنيو" },
  { id: 2, src: "/2.jpg", title: "قائمة الأرابيكات والبن التراثي" },
  { id: 3, src: "/3.jpg", title: "الفرنصويات والخلطات الفرنسية" },
  { id: 4, src: "/4.jpg", title: "توليفات بدران المتميزة والأسعار" },
  { id: 5, src: "/5.jpg", title: "البن المحوج والحبهان والمستكة" },
  { id: 6, src: "/6.jpg", title: "المشروبات والاسبريسو الجاهز" },
  { id: 7, src: "/7.jpg", title: "عناوين الفروع وتفاصيل الخدمة" },
];

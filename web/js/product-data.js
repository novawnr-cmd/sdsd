/* ═══════════════════════════════════════════════════════════════════
   PRODUCT DATA – Centralized data source for آدم شوب
   ═══════════════════════════════════════════════════════════════════ */

var PRODUCTS = [
  {
    id: '1',
    name: 'آيفون 15 برو ماكس',
    price: 4500,
    oldPrice: 5200,
    rating: 4.8,
    reviews: 234,
    cat: 'electronics',
    sub: 'phones',
    image: '📱',
    images: [
      'https://placehold.co/600x600/12172A/3B7DFF?text=iPhone+15+Pro+Max+Front',
      'https://placehold.co/600x600/12172A/3B7DFF?text=iPhone+15+Pro+Max+Back',
      'https://placehold.co/600x600/12172A/3B7DFF?text=iPhone+15+Pro+Max+Side',
      'https://placehold.co/600x600/12172A/3B7DFF?text=iPhone+15+Pro+Max+Detail'
    ],
    discount: 13,
    description: 'هاتف آيفون 15 برو ماكس بأحدث معالج A17 Pro وكاميرا 48 ميجابيكسل. يأتي بتصميم تيتانيوم فاخر وشاشة Super Retina XDR بحجم 6.7 بوصة.',
    specs: {
      'الشاشة': '6.7 بوصة Super Retina XDR',
      'المعالج': 'A17 Pro',
      'الذاكرة': '256 جيجابايت',
      'الكاميرا': '48 + 12 + 12 ميجابيكسل',
      'البطارية': '4441 مللي أمبير',
      'نظام التشغيل': 'iOS 17'
    },
    colors: [
      { name: 'أزرق تيتانيوم', hex: '#3B4C5E' },
      { name: 'أسود تيتانيوم', hex: '#3C3C3C' },
      { name: 'أبيض تيتانيوم', hex: '#F5F5F0' },
      { name: 'رمادي تيتانيوم', hex: '#8A8A8A' }
    ],
    sizes: [],
    brand: 'أبل',
    warranty: 'سنة واحدة رسمية',
    sold: 1523
  },
  {
    id: '2',
    name: 'سماعات أبل برو',
    price: 1200,
    oldPrice: 1500,
    rating: 4.6,
    reviews: 189,
    cat: 'electronics',
    sub: 'headphones',
    image: '🎧',
    images: [
      'https://placehold.co/600x600/12172A/FF6B3B?text=AirPods+Pro+Front',
      'https://placehold.co/600x600/12172A/FF6B3B?text=AirPods+Pro+Case',
      'https://placehold.co/600x600/12172A/FF6B3B?text=AirPods+Pro+Side',
      'https://placehold.co/600x600/12172A/FF6B3B?text=AirPods+Pro+Detail'
    ],
    discount: 20,
    description: 'سماعات أبل برو اللاسلكية مع تقنية إلغاء الضوضاء النشط. توفر صوتاً مذهلاً مع تصميم مريح يناسب الاستخدام اليومي الطويل.',
    specs: {
      'نوع الاتصال': 'بلوتوث 5.3',
      'إلغاء الضوضاء': 'نشط مع شفافية',
      'عمر البطارية': '6 ساعات (30 مع العلبة)',
      'مقاومة الماء': 'IP54',
      'النظام': 'Chip H2',
      'اللون': 'أبيض'
    },
    colors: [
      { name: 'أبيض', hex: '#F5F5F5' },
      { name: 'أسود', hex: '#1C1C1C' }
    ],
    sizes: [],
    brand: 'أبل',
    warranty: 'سنة واحدة رسمية',
    sold: 2341
  },
  {
    id: '3',
    name: 'تلفزيون سامسونج 65 بوصة',
    price: 3800,
    oldPrice: 4500,
    rating: 4.7,
    reviews: 156,
    cat: 'electronics',
    sub: 'tv',
    image: '📺',
    images: [
      'https://placehold.co/600x600/0D1117/E8115F?text=Samsung+65+Front',
      'https://placehold.co/600x600/0D1117/E8115F?text=Samsung+65+Side',
      'https://placehold.co/600x600/0D1117/E8115F?text=Samsung+65+Back',
      'https://placehold.co/600x600/0D1117/E8115F?text=Samsung+65+Detail'
    ],
    discount: 16,
    description: 'تلفزيون سامسونج ذكي بشاشة 65 بوصة بدقة 4K UHD مع تقنية Quantum Dot. يوفر تجربة مشاهدة استثنائية بألوان نابضة بالحياة وصوت محيطي.',
    specs: {
      'الشاشة': '65 بوصة 4K QLED',
      'نوع اللوحة': 'Quantum Dot',
      'الدقة': '3840 × 2160',
      'معدل التحديث': '120 هرتز',
      'النظام': 'Tizen OS',
      'الاتصالات': 'HDMI × 3, USB × 2, Wi-Fi'
    },
    colors: [
      { name: 'أسود', hex: '#1C1C1C' },
      { name: 'فضي', hex: '#C0C0C0' },
      { name: 'رمادي غامق', hex: '#4A4A4A' }
    ],
    sizes: [],
    brand: 'سامسونج',
    warranty: 'سنتان رسمية',
    sold: 876
  },
  {
    id: '4',
    name: 'لابتوب ماك بوك برو',
    price: 6500,
    oldPrice: 7200,
    rating: 4.9,
    reviews: 312,
    cat: 'electronics',
    sub: 'laptops',
    image: '💻',
    images: [
      'https://placehold.co/600x600/1C1C2E/58A6FF?text=MacBook+Pro+Open',
      'https://placehold.co/600x600/1C1C2E/58A6FF?text=MacBook+Pro+Side',
      'https://placehold.co/600x600/1C1C2E/58A6FF?text=MacBook+Pro+Keyboard',
      'https://placehold.co/600x600/1C1C2E/58A6FF?text=MacBook+Pro+Ports'
    ],
    discount: 10,
    description: 'لابتوب ماك بوك برو بشريحة M3 Pro لأداء خارق. مناسب للمطورين والمصممين المحترفين مع شاشة Liquid Retina XDR وبطارية تدوم طوال اليوم.',
    specs: {
      'الشاشة': '14.2 بوصة Liquid Retina XDR',
      'المعالج': 'Apple M3 Pro',
      'الذاكرة': '18 جيجابايت RAM',
      'التخزين': '512 جيجابايت SSD',
      'البطارية': 'حتى 17 ساعة',
      'الوزن': '1.61 كجم'
    },
    colors: [
      { name: 'رمادي فضي', hex: '#848484' },
      { name: 'فضي', hex: '#C0C0C0' }
    ],
    sizes: [],
    brand: 'أبل',
    warranty: 'سنة واحدة رسمية',
    sold: 1089
  },
  {
    id: '5',
    name: 'تابلت آيباد برو',
    price: 2800,
    oldPrice: 3200,
    rating: 4.7,
    reviews: 178,
    cat: 'electronics',
    sub: 'tablets',
    image: '📟',
    images: [
      'https://placehold.co/600x600/2D1B4E/A78BFA?text=iPad+Pro+Front',
      'https://placehold.co/600x600/2D1B4E/A78BFA?text=iPad+Pro+Pencil',
      'https://placehold.co/600x600/2D1B4E/A78BFA?text=iPad+Pro+Side',
      'https://placehold.co/600x600/2D1B4E/A78BFA?text=iPad+Pro+Back'
    ],
    discount: 13,
    description: 'تابلت آيباد برو مع شاشة Liquid Retina XDR وبروcessoress M2. خيار مثالي للرسامين ومحترفي الإنتاجية مع دعم Apple Pencil.',
    specs: {
      'الشاشة': '12.9 بوصة Liquid Retina XDR',
      'المعالج': 'Apple M2',
      'الذاكرة': '8 جيجابايت RAM',
      'التخزين': '256 جيجابايت',
      'الكاميرا': '12 + 10 ميجابيكسل',
      'الوزن': '682 جرام'
    },
    colors: [
      { name: 'رمادي فضي', hex: '#848484' },
      { name: 'فضي', hex: '#C0C0C0' }
    ],
    sizes: [],
    brand: 'أبل',
    warranty: 'سنة واحدة رسمية',
    sold: 945
  },
  {
    id: '6',
    name: 'كاميرا سوني ألفا',
    price: 5500,
    oldPrice: 6000,
    rating: 4.8,
    reviews: 98,
    cat: 'electronics',
    sub: 'cameras',
    image: '📷',
    images: [
      'https://placehold.co/600x600/1A1A2E/F0C040?text=Sony+Alpha+Front',
      'https://placehold.co/600x600/1A1A2E/F0C040?text=Sony+Alpha+Lens',
      'https://placehold.co/600x600/1A1A2E/F0C040?text=Sony+Alpha+Back',
      'https://placehold.co/600x600/1A1A2E/F0C040?text=Sony+Alpha+Detail'
    ],
    discount: 8,
    description: 'كاميرا سوني ألفا_mirrorless بدقة 33 ميجابيكسل مع استقرار الصور五轴. مثالية للمصورين المحترفين وهواة التصوير퀄تي.',
    specs: {
      'الدقة': '33.1 ميجابيكسل',
      'نوع المستشعر': 'CMOS Full Frame',
      'الفيديو': '4K 60fps',
      'الاستقرار': 'IBIS 5 محاور',
      'الوزن': '650 جرام',
      'نوع العدسة': '-mount'
    },
    colors: [],
    sizes: [],
    brand: 'سوني',
    warranty: 'سنتان رسمية',
    sold: 432
  },
  {
    id: '7',
    name: 'بلايستيشن 5',
    price: 2200,
    oldPrice: 2500,
    rating: 4.9,
    reviews: 445,
    cat: 'electronics',
    sub: 'gaming',
    image: '🎮',
    images: [
      'https://placehold.co/600x600/0F1923/0070D1?text=PS5+Console+Front',
      'https://placehold.co/600x600/0F1923/0070D1?text=PS5+Controller',
      'https://placehold.co/600x600/0F1923/0070D1?text=PS5+Side',
      'https://placehold.co/600x600/0F1923/0070D1?text=PS5+Back+Ports'
    ],
    discount: 12,
    description: 'جهاز بلايستيشن 5 بأداء تمثيلي مبهر وتخزين SSD فائق السرعة. استمتع بأحدث ألعاب الجيل الجديد بتصميم أنيق وهادئ.',
    specs: {
      'المعالج': 'AMD Zen 2, 8 أنوية',
      'الرسوميات': 'RDNA 2, 10.28 TFLOPS',
      'التخزين': '825 جيجابايت SSD',
      'الذاكرة': '16 جيجابايت GDDR6',
      'الأقراص': '4K UHD Blu-ray',
      'الاتصال': 'Wi-Fi 6, Bluetooth 5.1'
    },
    colors: [],
    sizes: [],
    brand: 'سوني',
    warranty: 'سنة واحدة رسمية',
    sold: 3210
  },
  {
    id: '8',
    name: 'شاحن لاسلكي أبل',
    price: 180,
    oldPrice: 250,
    rating: 4.3,
    reviews: 567,
    cat: 'electronics',
    sub: 'accessories',
    image: '🔌',
    images: [
      'https://placehold.co/600x600/1A1A1A/4ADE80?text=Charger+Front',
      'https://placehold.co/600x600/1A1A1A/4ADE80?text=Charger+Phone',
      'https://placehold.co/600x600/1A1A1A/4ADE80?text=Charger+Side',
      'https://placehold.co/600x600/1A1A1A/4ADE80?text=Charger+Detail'
    ],
    discount: 28,
    description: 'شاحن لاسلكي أبل بقوة 15 واط مع تصميم أنيق ومضاد للانزلاق. يشحن جهازك بسرعة وأمان مع إضاءة LED للحالة.',
    specs: {
      'القدرة': '15 واط',
      'التكنولوجيا': 'Qi Wireless',
      'المدخل': 'USB-C',
      'التوافق': 'iPhone 8 وأحدث',
      'المادة': 'ألمنيوم وسيراميك',
      'اللون': 'أبيض'
    },
    colors: [],
    sizes: [],
    brand: 'أبل',
    warranty: 'سنة واحدة',
    sold: 4521
  },
  {
    id: '9',
    name: 'قميص قطني كلاسيك',
    price: 150,
    oldPrice: 200,
    rating: 4.4,
    reviews: 89,
    cat: 'fashion',
    sub: 'men',
    image: '👔',
    images: [
      'https://placehold.co/600x600/F8F4E8/5C4033?text=Shirt+Front',
      'https://placehold.co/600x600/F8F4E8/5C4033?text=Shirt+Back',
      'https://placehold.co/600x600/F8F4E8/5C4033?text=Shirt+Detail',
      'https://placehold.co/600x600/F8F4E8/5C4033?text=Shirt+Folded'
    ],
    discount: 25,
    description: 'قميص قطني 100% بقصة كلاسيكية أنيقة مناسبة للعمل والمناسبات. قماش مريح وسهل الكي مع جيوب أمامية وياقة تقليدية.',
    specs: {
      'القماش': 'قطن 100%',
      'القصة': 'كلاسيك',
      'الياقة': 'كلاسيكية',
      'الجيوب': 'جيب صدر واحد',
      'الغسل': 'غسالة آمنة',
      'الطول': 'كلاسيك'
    },
    colors: [],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    brand: 'زارا',
    warranty: 'استبدال خلال 14 يوم',
    sold: 1876
  },
  {
    id: '10',
    name: 'فستان سهرة أنيق',
    price: 450,
    oldPrice: 600,
    rating: 4.6,
    reviews: 134,
    cat: 'fashion',
    sub: 'women',
    image: '👗',
    images: [
      'https://placehold.co/600x600/FDF2F8/BE185D?text=Dress+Front',
      'https://placehold.co/600x600/FDF2F8/BE185D?text=Dress+Back',
      'https://placehold.co/600x600/FDF2F8/BE185D?text=Dress+Detail',
      'https://placehold.co/600x600/FDF2F8/BE185D?text=Dress+Model'
    ],
    discount: 25,
    description: 'فستان سهرة أنيق بقصة ملكية وقماش ساتان فاخر. مناسب للمناسبات الخاصة والحفلات مع تصميم يُبرز الأنوثة.',
    specs: {
      'القماش': 'ساتان بريميوم',
      'القصة': 'ملكية',
      'الطول': 'أرضي',
      'الإغلاق': 'سس خلفية',
      'البطانة': 'مبطنة بالكامل',
      'العناية': 'غسيل يدوي فقط'
    },
    colors: [],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    brand: 'مانجو',
    warranty: 'استبدال خلال 14 يوم',
    sold: 654
  },
  {
    id: '11',
    name: 'حذاء رياضي نايكي',
    price: 380,
    oldPrice: 450,
    rating: 4.5,
    reviews: 267,
    cat: 'fashion',
    sub: 'shoes',
    image: '👟',
    images: [
      'https://placehold.co/600x600/1C1C1C/F5F5F5?text=Nike+Shoe+Front',
      'https://placehold.co/600x600/1C1C1C/F5F5F5?text=Nike+Shoe+Side',
      'https://placehold.co/600x600/1C1C1C/F5F5F5?text=Nike+Shoe+Back',
      'https://placehold.co/600x600/1C1C1C/F5F5F5?text=Nike+Shoe+Sole'
    ],
    discount: 16,
    description: 'حذاء رياضي نايكي بتصميم عصري و Technology Air Max للراحة طوال اليوم. مثالي للجري والتمارين والإطلالات اليومية.',
    specs: {
      'المادة': 'شبكة محايدة + سينثتيك',
      'النعل': 'Air Max مرصوص',
      'الإغلاق': 'رباط',
      'بطانة': 'نسيج مبادل للهواء',
      'النعل الخارجي': 'مطاط مقاوم للتآكل',
      'الاستخدام': 'جري وتمارين'
    },
    colors: [
      { name: 'أسود', hex: '#1C1C1C' },
      { name: 'أبيض', hex: '#F5F5F5' },
      { name: 'أحمر', hex: '#DC2626' }
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    brand: 'نايكي',
    warranty: 'استبدال خلال 30 يوم',
    sold: 2987
  },
  {
    id: '12',
    name: 'حقيبة يد جل طبيعية',
    price: 650,
    oldPrice: 800,
    rating: 4.7,
    reviews: 78,
    cat: 'fashion',
    sub: 'bags',
    image: '👜',
    images: [
      'https://placehold.co/600x600/2C1810/D4A574?text=Bag+Front',
      'https://placehold.co/600x600/2C1810/D4A574?text=Bag+Back',
      'https://placehold.co/600x600/2C1810/D4A574?text=Bag+Inside',
      'https://placehold.co/600x600/2C1810/D4A574?text=Bag+Detail'
    ],
    discount: 19,
    description: 'حقيبة يد من الجلد الطبيعي الفاخر بتصميم كلاسيكي أنيق. تحتوي على عدة جيوب داخلية وخارجية ومناسبة للاستخدام اليومي.',
    specs: {
      'المادة': 'جلد طبيعي 100%',
      'الحجم': 'كبير',
      'الأبعاد': '35 × 28 × 12 سم',
      'الجيوب': '3 داخلية + 1 خارجية',
      'الإغلاق': 'inox مغناطيسي',
      'الوزن': '650 جرام'
    },
    colors: [
      { name: 'بني', hex: '#8B4513' },
      { name: 'أسود', hex: '#1C1C1C' },
      { name: 'بيج', hex: '#D4A574' }
    ],
    sizes: [],
    brand: 'كوتش',
    warranty: 'ضمان سنة على الجلد',
    sold: 534
  },
  {
    id: '13',
    name: 'ساعة رولكس كلاسيك',
    price: 12000,
    oldPrice: 14000,
    rating: 4.9,
    reviews: 56,
    cat: 'watches',
    sub: 'luxury',
    image: '⌚',
    images: [
      'https://placehold.co/600x600/0A1628/F5C542?text=Rolex+Front',
      'https://placehold.co/600x600/0A1628/F5C542?text=Rolex+Side',
      'https://placehold.co/600x600/0A1628/F5C542?text=Rolex+Back',
      'https://placehold.co/600x600/0A1628/F5C542?text=Rolex+Detail'
    ],
    discount: 14,
    description: 'ساعة رولكس Datejust كلاسيك بسوار أوستر ستيل 904L. حركة ميكانيكية ذاتية التعبئة مع عداد تاريخي ومقاومة للماء حتى 100 متر.',
    specs: {
      'المادة': 'أوستر ستيل 904L',
      'الحركة': 'ميكانيكية ذاتية التعبئة',
      'القطر': '41 ملم',
      'المقاومة للماء': '100 متر',
      'الزجاج': 'سافير كريستال',
      'الإطار': 'فحم الأسطوانة'
    },
    colors: [],
    sizes: [],
    brand: 'رولكس',
    warranty: 'ضمان 5 سنوات',
    sold: 189
  },
  {
    id: '14',
    name: 'ساعة أبل ووتش',
    price: 1800,
    oldPrice: 2100,
    rating: 4.7,
    reviews: 389,
    cat: 'watches',
    sub: 'smart',
    image: '⌚',
    images: [
      'https://placehold.co/600x600/1C1C1C/34D399?text=Apple+Watch+Front',
      'https://placehold.co/600x600/1C1C1C/34D399?text=Apple+Watch+Band',
      'https://placehold.co/600x600/1C1C1C/34D399?text=Apple+Watch+Side',
      'https://placehold.co/600x600/1C1C1C/34D399?text=Apple+Watch+Back'
    ],
    discount: 14,
    description: 'ساعة أبل ووتش Series 9 بشاشة Always-On Retina. تتبع اللياقة والصحة مع معالج S9 أسرع ومتانة أعلى.',
    specs: {
      'الشاشة': '45 ملم Always-On Retina',
      'المعالج': 'Apple S9 SiP',
      'المقاومة للماء': '50 متر',
      'البطارية': 'حتى 18 ساعة',
      'GPS': 'داخلي + خارجي',
      'المتتبعات': '心率, SpO2, حرارة'
    },
    colors: [],
    sizes: [],
    brand: 'أبل',
    warranty: 'سنة واحدة رسمية',
    sold: 2156
  },
  {
    id: '15',
    name: 'ساعة كاسيو رياضية',
    price: 280,
    oldPrice: 350,
    rating: 4.3,
    reviews: 234,
    cat: 'watches',
    sub: 'sport',
    image: '🏃',
    images: [
      'https://placehold.co/600x600/1A1A1A/00E676?text=Casio+Sport+Front',
      'https://placehold.co/600x600/1A1A1A/00E676?text=Casio+Sport+Side',
      'https://placehold.co/600x600/1A1A1A/00E676?text=Casio+Sport+Back',
      'https://placehold.co/600x600/1A1A1A/00E676?text=Casio+Sport+Detail'
    ],
    discount: 20,
    description: 'ساعة كاسيو رياضية متعددة الوظائف مقاومة للماء والصدمات. تحتوي على توقيت عالمي وساعة إيقاع و مؤقت و إضاءة خلفية.',
    specs: {
      'المادة': 'بلاستيك مقوى',
      'الحركة': 'رقمية',
      'المقاومة للماء': '100 متر',
      'الوظائف': 'ساعة إيقاع، توقيت عالمي',
      'البطارية': 'CR2016',
      'الوزن': '51 جرام'
    },
    colors: [],
    sizes: [],
    brand: 'كاسيو',
    warranty: 'سنتان رسمية',
    sold: 3456
  },
  {
    id: '16',
    name: 'عطر توم فورد',
    price: 850,
    oldPrice: 1000,
    rating: 4.8,
    reviews: 178,
    cat: 'beauty',
    sub: 'perfume',
    image: '🌸',
    images: [
      'https://placehold.co/600x600/1E120D/D4A054?text=Tom+Ford+Bottle',
      'https://placehold.co/600x600/1E120D/D4A054?text=Tom+Ford+Box',
      'https://placehold.co/600x600/1E120D/D4A054?text=Tom+Ford+Detail',
      'https://placehold.co/600x600/1E120D/D4A054?text=Tom+Ford+Spray'
    ],
    discount: 15,
    description: 'عطر توم فورد أو دي بارفيوم بتركيبة فاخرة تجمع بين روائح العود والمسك والورود. رائحة تدوم طويلاً تناسب جميع المناسبات.',
    specs: {
      'الحجم': '100 مل',
      'النوع': 'أو دي بارفيوم',
      'النوتات العلوية': 'برغموت، زعفران',
      'النوتات الوسطى': 'ورد، ياسمين',
      'النوتات السفلية': 'عود، مسك، عنبر',
      'الثبات': '12+ ساعة'
    },
    colors: [
      { name: 'ذهبي', hex: '#D4A054' },
      { name: 'أسود', hex: '#1E120D' }
    ],
    sizes: [],
    brand: 'توم فورد',
    warranty: 'أصلي 100%',
    sold: 1289
  },
  {
    id: '17',
    name: 'كريم تفتيح البشرة',
    price: 120,
    oldPrice: 180,
    rating: 4.2,
    reviews: 456,
    cat: 'beauty',
    sub: 'skincare',
    image: '🧴',
    images: [
      'https://placehold.co/600x600/F0FDF4/16A34A?text=Cream+Front',
      'https://placehold.co/600x600/F0FDF4/16A34A?text=Cream+Open',
      'https://placehold.co/600x600/F0FDF4/16A34A?text=Cream+Texture',
      'https://placehold.co/600x600/F0FDF4/16A34A?text=Cream+Ingredients'
    ],
    discount: 33,
    description: 'كريم تفتيح البشرة بتقنية متقدمة يحتوي على فيتامين C وحمض الهيالورونيك. يرطب البشرة ويقلل من البقع الداكنة ويمنحها إشراقة.',
    specs: {
      'الحجم': '50 مل',
      'المكونات الفعالة': 'فيتامين C، هيالورونيك أسيد',
      'نوع البشرة': 'جميع الأنواع',
      'الاستخدام': ' صباحاً ومساءً',
      'الحماية': 'SPF 30',
      'الخامة': 'كريم خفيف'
    },
    colors: [],
    sizes: [],
    brand: 'لوريال',
    warranty: 'استبدال إذا كان مغلقاً',
    sold: 5678
  },
  {
    id: '18',
    name: 'طقم مكياج كامل',
    price: 350,
    oldPrice: 450,
    rating: 4.5,
    reviews: 234,
    cat: 'beauty',
    sub: 'makeup',
    image: '💄',
    images: [
      'https://placehold.co/600x600/FDF2F8/EC4899?text=Makeup+Kit+Front',
      'https://placehold.co/600x600/FDF2F8/EC4899?text=Makeup+Kit+Open',
      'https://placehold.co/600x600/FDF2F8/EC4899?text=Makeup+Kit+Swatches',
      'https://placehold.co/600x600/FDF2F8/EC4899?text=Makeup+Kit+Detail'
    ],
    discount: 22,
    description: 'طقم مكياج كامل يحتوي على 24 ظل عيون وألوان خدود وأحمر شفاه وفرش. كل ما تحتاجينه في مجموعة واحدة أنيقة.',
    specs: {
      'عدد القطع': '24 قطعة',
      'الألوان': '24 ظل عيون',
      'الخدود': '4 ألوان',
      'أحمر الشفاه': '6 ألوان',
      'الفرش': '3 فرش احترافية',
      'الحقيبة': 'حقيبة سفر أنيقة'
    },
    colors: [],
    sizes: [],
    brand: 'مايبيلين',
    warranty: 'استبدال خلال 7 أيام',
    sold: 1876
  },
  {
    id: '19',
    name: 'كنب فاخر',
    price: 2500,
    oldPrice: 3000,
    rating: 4.6,
    reviews: 89,
    cat: 'home',
    sub: 'furniture',
    image: '🛋️',
    images: [
      'https://placehold.co/600x600/F5F5F0/8B7355?text=Sofa+Front',
      'https://placehold.co/600x600/F5F5F0/8B7355?text=Sofa+Side',
      'https://placehold.co/600x600/F5F5F0/8B7355?text=Sofa+Back',
      'https://placehold.co/600x600/F5F5F0/8B7355?text=Sofa+Detail'
    ],
    discount: 17,
    description: 'كنب فاخر ثلاثي مقعد بتصميم عصري وأقمشة بريميوم. مريح للغاية مع وسائد مدعومة وإطار خشبي متين.',
    specs: {
      'ال المقاعد': '3 مقاعد',
      'القماش': 'مخلوط قطن وبوليستر',
      'الإطار': 'خشب زان',
      'الإسفنج': 'كثيف عالي الكثافة',
      'الأبعاد': '220 × 90 × 85 سم',
      'الوزن': '45 كجم'
    },
    colors: [],
    sizes: [],
    brand: 'إيكيا',
    warranty: '5 سنوات على الإطار',
    sold: 345
  },
  {
    id: '20',
    name: 'طقم أواني مطبخ',
    price: 450,
    oldPrice: 600,
    rating: 4.4,
    reviews: 167,
    cat: 'home',
    sub: 'kitchen',
    image: '🍳',
    images: [
      'https://placehold.co/600x600/FDFDFD/1F2937?text=Cookware+Set+Front',
      'https://placehold.co/600x600/FDFDFD/1F2937?text=Cookware+Set+Detail',
      'https://placehold.co/600x600/FDFDFD/1F2937?text=Cookware+Set+Lid',
      'https://placehold.co/600x600/FDFDFD/1F2937?text=Cookware+Set+Handle'
    ],
    discount: 25,
    description: 'طقم أواني مطبخ من الفولاذ المقاوم للصدأ بـ 10 قطع. مقاوم للالتصاق وسريع التسخين مع مقبض مريح مقاوم للحرارة.',
    specs: {
      'عدد القطع': '10 قطع',
      'المادة': 'فولاذ مقاوم للصدأ 18/10',
      'الطلاء': 'سيراميك مضاد للالتصاق',
      'القلاية': 'آمنة لجميع الأفران',
      'الغسالة': 'آمنة للغسالة',
      'الأحجام': '16، 18، 20، 24 سم'
    },
    colors: [],
    sizes: [],
    brand: 'تيفال',
    warranty: '5 سنوات',
    sold: 2345
  },
  {
    id: '21',
    name: 'نظام إضاءة ذكي',
    price: 380,
    oldPrice: 500,
    rating: 4.5,
    reviews: 123,
    cat: 'home',
    sub: 'lighting',
    image: '💡',
    images: [
      'https://placehold.co/600x600/0F172A/FBBF24?text=Smart+Light+Bulb',
      'https://placehold.co/600x600/0F172A/FBBF24?text=Smart+Light+Colors',
      'https://placehold.co/600x600/0F172A/FBBF24?text=Smart+Light+App',
      'https://placehold.co/600x600/0F172A/FBBF24?text=Smart+Light+Setup'
    ],
    discount: 24,
    description: 'نظام إضاءة ذكي بـ 3 لمبات LED قابلة للتحكم بالصوت والتطبيق. تدعم 16 مليون لون مع جدولة وسينمائي ووضع التركيز.',
    specs: {
      'عدد اللمبات': '3 لمبات',
      'القدرة': '9 واط لكل لمبة',
      'التيار': '806 لومن',
      'الاتصال': 'Wi-Fi / Bluetooth',
      'التوافق': 'Alexa, Google Home',
      'العمر': '25,000 ساعة'
    },
    colors: [],
    sizes: [],
    brand: 'فيليبس',
    warranty: 'سنتان رسمية',
    sold: 1567
  },
  {
    id: '22',
    name: 'جهاز تمارين منزلي',
    price: 1200,
    oldPrice: 1500,
    rating: 4.6,
    reviews: 98,
    cat: 'sports',
    sub: 'gym',
    image: '🏋️',
    images: [
      'https://placehold.co/600x600/1A1A2E/E11D48?text=Gym+Machine+Front',
      'https://placehold.co/600x600/1A1A2E/E11D48?text=Gym+Machine+Side',
      'https://placehold.co/600x600/1A1A2E/E11D48?text=Gym+Machine+Detail',
      'https://placehold.co/600x600/1A1A2E/E11D48?text=Gym+Machine+Exercise'
    ],
    discount: 20,
    description: 'جهاز تمارين منزلي متعدد الوظائف يناسب أكثر من 30 تمارين. تصميم قوي ومتين مع تعديل مقاومة سلس.',
    specs: {
      'عدد التمارين': 'أكثر من 30 تمرين',
      'أقصى مقاومة': '90 كجم',
      'المادة': 'فولاذ مقاوم',
      'المساحة': '200 × 150 سم',
      'الوزن': '85 كجم',
      'الحد الأقصى للوزن': '150 كجم'
    },
    colors: [],
    sizes: ['كبير', 'متوسط', 'صغير'],
    brand: 'دايون فيتنس',
    warranty: '3 سنوات',
    sold: 678
  },
  {
    id: '23',
    name: 'كرة قدم احترافية',
    price: 180,
    oldPrice: 220,
    rating: 4.4,
    reviews: 345,
    cat: 'sports',
    sub: 'football',
    image: '⚽',
    images: [
      'https://placehold.co/600x600/FFFFFF/000000?text=Football+Front',
      'https://placehold.co/600x600/FFFFFF/000000?text=Football+Side',
      'https://placehold.co/600x600/FFFFFF/000000?text=Football+Panel',
      'https://placehold.co/600x600/FFFFFF/000000?text=Football+Detail'
    ],
    discount: 18,
    description: 'كرة قدم احترافية بمقاس 5 مطابقة لمعايير FIFA. خياطة يدوية مع لمسة نهائية مقاومة للماء.',
    specs: {
      'المقاس': 'الموسم الخامس (5)',
      'المادة': 'بوليوريثان',
      'الخياطة': 'يدوية',
      'الماء': 'مقاوم للماء',
      'الوزن': '410-450 جرام',
      'المعيار': 'FIFA Quality'
    },
    colors: [],
    sizes: ['مقاس 3', 'مقاس 4', 'مقاس 5'],
    brand: 'أديداس',
    warranty: '6 أشهر',
    sold: 4567
  },
  {
    id: '24',
    name: 'دفتر أطفال تعليمي',
    price: 45,
    oldPrice: 60,
    rating: 4.3,
    reviews: 567,
    cat: 'kids',
    sub: 'toys',
    image: '📚',
    images: [
      'https://placehold.co/600x600/FEF3C7/D97706?text=Book+Front',
      'https://placehold.co/600x600/FEF3C7/D97706?text=Book+Pages',
      'https://placehold.co/600x600/FEF3C7/D97706?text=Book+Activities',
      'https://placehold.co/600x600/FEF3C7/D97706?text=Book+Detail'
    ],
    discount: 25,
    description: 'دفتر تعليمي للأطفال يجمع بين الترفيه والتعليم. يحتوي على أنشطة ملونة وملصقات وقصص قصيرة تساعد على التعلم.',
    specs: {
      'العدد': 'دفتر واحد',
      'الصفحات': '64 صفحة',
      'العمر': '3-7 سنوات',
      'المحتوى': 'أحرف، أرقام، ألوان',
      'الملصقات': 'أكثر من 100 ملصق',
      'الغلاف': 'غلاف ورقي متين'
    },
    colors: [],
    sizes: ['كبير', 'متوسط', 'صغير'],
    brand: 'دار النشر',
    warranty: 'استبدال إذا تالف',
    sold: 8765
  },
  {
    id: '25',
    name: 'سماعة بلوتوث متحركة',
    price: 320,
    oldPrice: 400,
    rating: 4.5,
    reviews: 234,
    cat: 'electronics',
    sub: 'headphones',
    image: '🔊',
    images: [
      'https://placehold.co/600x600/1A0A2E/A855F7?text=Speaker+Front',
      'https://placehold.co/600x600/1A0A2E/A855F7?text=Speaker+Side',
      'https://placehold.co/600x600/1A0A2E/A855F7?text=Speaker+Top',
      'https://placehold.co/600x600/1A0A2E/A855F7?text=Speaker+Detail'
    ],
    discount: 20,
    description: 'سماعة بلوتوث متحركة بتصميم عصري مضاد للماء. صوت قوي 360 درجة مع إضاءة LED متحركة وعمر بطارية طويل.',
    specs: {
      'الاتصال': 'بلوتوث 5.0',
      'القدرة الصوتية': '20 واط',
      'المقاومة للماء': 'IPX7',
      'البطارية': '12 ساعة',
      'المدة': '3 ساعات للشحن',
      'النطاق': '10 متر'
    },
    colors: [],
    sizes: [],
    brand: 'JBL',
    warranty: 'سنة واحدة',
    sold: 2345
  },
  {
    id: '26',
    name: 'ساعة كاجوال كلاسيك',
    price: 200,
    oldPrice: 280,
    rating: 4.2,
    reviews: 145,
    cat: 'watches',
    sub: 'casual',
    image: '🕐',
    images: [
      'https://placehold.co/600x600/F5F0EB/6B5B4E?text=Casual+Watch+Front',
      'https://placehold.co/600x600/F5F0EB/6B5B4E?text=Casual+Watch+Side',
      'https://placehold.co/600x600/F5F0EB/6B5B4E?text=Casual+Watch+Back',
      'https://placehold.co/600x600/F5F0EB/6B5B4E?text=Casual+Watch+Detail'
    ],
    discount: 29,
    description: 'ساعة كاجوال كلاسيك بتصميم أنيق وخفيف الوزن. مثالية للاستخدام اليومي مع حركة يابانية دقيقة وسوار جلد فاخر.',
    specs: {
      'الحركة': 'يابانية كوارتز',
      'المادة': 'ستانلس ستيل',
      'السوار': 'جلد طبيعي',
      'القطر': '40 ملم',
      'المقاومة للماء': '30 متر',
      'البطارية': 'SR626SW'
    },
    colors: [],
    sizes: [],
    brand: 'كاسيو',
    warranty: 'سنة واحدة',
    sold: 1876
  },
  {
    id: '27',
    name: 'شامبو مغربي أصلي',
    price: 85,
    oldPrice: 110,
    rating: 4.6,
    reviews: 389,
    cat: 'beauty',
    sub: 'hair',
    image: '💇',
    images: [
      'https://placehold.co/600x600/F0FDF4/15803D?text=Shampoo+Bottle',
      'https://placehold.co/600x600/F0FDF4/15803D?text=Shampoo+Ingredients',
      'https://placehold.co/600x600/F0FDF4/15803D?text=Shampoo+Texture',
      'https://placehold.co/600x600/F0FDF4/15803D?text=Shampoo+Detail'
    ],
    discount: 23,
    description: 'شامبو مغربي أصيل مصنوع من أصل الأرغان الطبيعية. يغذي الشعر ويمنحه لمعاناً صحياً ونعومة فائقة.',
    specs: {
      'الحجم': '400 مل',
      'المكونات': 'أرغان، كيراتين، زيت الزيتون',
      'نوع الشعر': 'جميع الأنواع',
      'خالٍ من': 'بارابين، سلفات',
      'الرائحة': 'طبيعية منعشة',
      'الاستخدام': 'يومي'
    },
    colors: [],
    sizes: [],
    brand: 'أرغان مغربي',
    warranty: 'أصلي 100%',
    sold: 6543
  },
  {
    id: '28',
    name: 'نظارات رايلي شمسية',
    price: 280,
    oldPrice: 350,
    rating: 4.5,
    reviews: 167,
    cat: 'fashion',
    sub: 'sunglasses',
    image: '🕶️',
    images: [
      'https://placehold.co/600x600/1A1A1A/FCD34D?text=Sunglasses+Front',
      'https://placehold.co/600x600/1A1A1A/FCD34D?text=Sunglasses+Side',
      'https://placehold.co/600x600/1A1A1A/FCD34D?text=Sunglasses+Case',
      'https://placehold.co/600x600/1A1A1A/FCD34D?text=Sunglasses+Detail'
    ],
    discount: 20,
    description: 'نظارات شمسية رايلي بتصميم كلاسيكي خالد. عدسات مستقطبة بحماية UV400 مع إطار أنيق من معدن م高强度.',
    specs: {
      'العدسات': 'مستقطبة',
      'الحماية': 'UV400',
      'الإطار': 'معدن مقاوم للصدأ',
      'الوزن': '32 جرام',
      'العرض': '140 ملم',
      'المدة': '58 ملم'
    },
    colors: [
      { name: 'أسود', hex: '#1A1A1A' },
      { name: 'ذهبي', hex: '#C5A55A' },
      { name: 'فضي', hex: '#C0C0C0' }
    ],
    sizes: ['كبير', 'متوسط', 'صغير'],
    brand: 'رايلي',
    warranty: 'سنة واحدة على الإطار',
    sold: 2345
  },
  {
    id: '29',
    name: 'ساعة رياضية كاسيو',
    price: 350,
    oldPrice: 420,
    rating: 4.4,
    reviews: 278,
    cat: 'watches',
    sub: 'sport',
    image: '⌚',
    images: [
      'https://placehold.co/600x600/0A0A0A/22C55E?text=GShock+Front',
      'https://placehold.co/600x600/0A0A0A/22C55E?text=GShock+Side',
      'https://placehold.co/600x600/0A0A0A/22C55E?text=GShock+Back',
      'https://placehold.co/600x600/0A0A0A/22C55E?text=GShock+Detail'
    ],
    discount: 17,
    description: 'ساعة كاسيو G-Shock رياضية مقاومة للصدمات والماء. تصميم عصري مع شاشة LED و GPS و وظائف رياضية متقدمة.',
    specs: {
      'المادة': 'راتنج مقوى',
      'المقاومة للصدمات': 'نعم',
      'المقاومة للماء': '200 متر',
      'GPS': 'داخلي',
      'البطارية': '2 سنوات',
      'الوظائف': 'بصوميتر، عداد خطوات'
    },
    colors: [],
    sizes: [],
    brand: 'كاسيو',
    warranty: 'سنتان رسمية',
    sold: 1987
  },
  {
    id: '30',
    name: 'مجوهرات فضة إيطالية',
    price: 550,
    oldPrice: 700,
    rating: 4.7,
    reviews: 89,
    cat: 'fashion',
    sub: 'jewelry',
    image: '💍',
    images: [
      'https://placehold.co/600x600/F8F4FF/7C3AED?text=Jewelry+Ring+Front',
      'https://placehold.co/600x600/F8F4FF/7C3AED?text=Jewelry+Ring+Side',
      'https://placehold.co/600x600/F8F4FF/7C3AED?text=Jewelry+Box',
      'https://placehold.co/600x600/F8F4FF/7C3AED?text=Jewelry+Detail'
    ],
    discount: 21,
    description: 'طقم مجوهرات فضة إيطالية عيار 925 بتصميم راقي وأنيق. يشمل خاتم وقلادة وحلق بتصميم متناسق.',
    specs: {
      'المادة': 'فضة عيار 925',
      'المنشأ': 'إيطاليا',
      'القطع': 'خاتم + قلادة + حلق',
      'الوزن': '45 جرام',
      'الطلاء': 'روديوم مقاوم للتأكسد',
      'الحقيبة': 'حقيبة مخملية فاخرة'
    },
    colors: [],
    sizes: [],
    brand: 'بولجاري',
    warranty: 'ضمان مدى الحياة على الفضة',
    sold: 456
  },
  {
    id: '31',
    name: 'غسالة أطباق بوش',
    price: 1900,
    oldPrice: 2300,
    rating: 4.7,
    reviews: 134,
    cat: 'home',
    sub: 'kitchen',
    image: '🍽️',
    images: [
      'https://placehold.co/600x600/F8FAFC/3B82F6?text=Dishwasher+Front',
      'https://placehold.co/600x600/F8FAFC/3B82F6?text=Dishwasher+Open',
      'https://placehold.co/600x600/F8FAFC/3B82F6?text=Dishwasher+Inside',
      'https://placehold.co/600x600/F8FAFC/3B82F6?text=Dishwasher+Detail'
    ],
    discount: 17,
    description: 'غسالة أطباق بوش بسعة 14 طبق مع تقنية الأصوات المنخفضة و7 برامج غسيل. توفر نظافة مثالية مع استهلاك مواد كيميائية أقل.',
    specs: {
      'السعة': '14 طبق',
      'عدد البرامج': '7 برامج',
      'المستوى الصوتي': '44 ديسيبل',
      'استهلاك الطاقة': 'A+++',
      'الوزن': '32 كجم',
      'الأبعاد': '60 × 60 × 85 سم'
    },
    colors: [],
    sizes: [],
    brand: 'بوش',
    warranty: '5 سنوات',
    sold: 789
  },
  {
    id: '32',
    name: 'عربة أطفال يوبيبي',
    price: 950,
    oldPrice: 1200,
    rating: 4.8,
    reviews: 201,
    cat: 'kids',
    sub: 'strollers',
    image: '🚼',
    images: [
      'https://placehold.co/600x600/FFF7ED/EA580C?text=Stroller+Front',
      'https://placehold.co/600x600/FFF7ED/EA580C?text=Stroller+Folded',
      'https://placehold.co/600x600/FFF7ED/EA580C?text=Stroller+Side',
      'https://placehold.co/600x600/FFF7ED/EA580C?text=Stroller+Detail'
    ],
    discount: 21,
    description: 'عربة أطفال يوبيبي خفيفة ومتعددة الوظائف بتصميم عصري. تُطوى بسهولة بيد واحدة مع سقف قابل للتعديل و سلة تخزين كبيرة.',
    specs: {
      'الوزن': '8.5 كجم',
      'السقف': 'UPF 50+ قابل للتعديل',
      'الطي': 'يد واحدة',
      'العمر': '6 - 36 شهر',
      'حمولة': 'حتى 22 كجم',
      'العجلات': '4 عجلات مطاطية'
    },
    colors: [],
    sizes: [],
    brand: 'يوبيبي',
    warranty: 'سنتان رسمية',
    sold: 1234
  }
];

/* ═══════════════════════════════════════════════════════════════════
   CATEGORY / SUBCATEGORY MAP
   ═══════════════════════════════════════════════════════════════════ */

var catMap = {
  electronics: {
    name: 'الإلكترونيات', icon: '📱',
    desc: 'أحدث المنتجات الإلكترونية والأجهزة التقنية بأفضل الأسعار',
    subs: {
      phones:     { name: 'هواتف ذكية', icon: '📱' },
      tv:         { name: 'تلفاز', icon: '📺' },
      headphones: { name: 'سماعات', icon: '🎧' },
      laptops:    { name: 'لابتوب', icon: '💻' },
      tablets:    { name: 'تابلت', icon: '📟' },
      cameras:    { name: 'كاميرات', icon: '📷' },
      gaming:     { name: 'ألعاب', icon: '🎮' },
      accessories:{ name: 'ملحقات', icon: '🔌' }
    }
  },
  fashion: {
    name: 'أزياء', icon: '👕',
    desc: 'تشكيلة واسعة من الملابس والإكسسوارات العصرية',
    subs: {
      men:        { name: 'رجالي', icon: '👔' },
      women:      { name: 'نسائي', icon: '👗' },
      shoes:      { name: 'أحذية', icon: '👟' },
      bags:       { name: 'حقائب', icon: '👜' },
      jewelry:    { name: 'مجوهرات', icon: '💍' },
      sunglasses: { name: 'نظارات شمسية', icon: '🕶️' }
    }
  },
  watches: {
    name: 'ساعات', icon: '⌚',
    desc: 'تشكيلة من أفضل الساعات العالمية والمميزة',
    subs: {
      luxury: { name: 'ساعات فاخرة', icon: '⌚' },
      sport:  { name: 'ساعات رياضية', icon: '🏃' },
      smart:  { name: 'ساعات ذكية', icon: '⌚' },
      casual: { name: 'ساعات كاجوال', icon: '🕐' }
    }
  },
  beauty: {
    name: 'جمال وعناية', icon: '💄',
    desc: 'منتجات العناية بالبشرة والشعر والمكياج والعطور',
    subs: {
      skincare: { name: 'العناية بالبشرة', icon: '🧴' },
      makeup:   { name: 'مكياج', icon: '💄' },
      perfume:  { name: 'عطور', icon: '🌸' },
      hair:     { name: 'عناية بالشعر', icon: '💇' },
      grooming: { name: 'عناية رجالية', icon: '🪒' }
    }
  },
  home: {
    name: 'منزل وديكور', icon: '🏠',
    desc: 'أثاث ومطبخ وإضاءة وديكور لمنزل أنيق',
    subs: {
      furniture: { name: 'أثاث', icon: '🛋️' },
      kitchen:   { name: 'مطبخ', icon: '🍳' },
      lighting:  { name: 'إضاءة', icon: '💡' },
      decor:     { name: 'ديكور', icon: '🖼️' },
      bedroom:   { name: 'غرف نوم', icon: '🛏️' },
      bathroom:  { name: 'حمامات', icon: '🚿' }
    }
  },
  sports: {
    name: 'رياضة', icon: '⚽',
    desc: 'أجهزة رياضية وملابس ومعدات للرياضة والنشاط الخارجي',
    subs: {
      gym:     { name: 'أجهزة رياضية', icon: '🏋️' },
      football:{ name: 'كرة قدم', icon: '⚽' },
      apparel: { name: 'ملابس رياضية', icon: '🎽' },
      outdoor: { name: 'نشاط خارجي', icon: '🏕️' }
    }
  },
  kids: {
    name: 'أطفال', icon: '🧒',
    desc: 'لعب وملابس ومستلزمات الأطفال',
    subs: {
      toys:     { name: 'لعب', icon: '🧸' },
      clothing: { name: 'ملابس أطفال', icon: '👶' },
      strollers:{ name: 'عربات أطفال', icon: '🚼' },
      baby:     { name: 'مستلزمات infants', icon: '🍼' }
    }
  },
  automotive: {
    name: 'سيارات', icon: '🚗',
    desc: 'قطع غيار وإكسسوارات وزيوت وإطارات للسيارات',
    subs: {
      parts:       { name: 'قطع غيار', icon: '🔧' },
      accessories: { name: 'إكسسوارات', icon: '🚗' },
      oils:        { name: 'زيوت', icon: '🛢️' },
      tires:       { name: 'إطارات', icon: '🛞' }
    }
  }
};

/* ═══════════════════════════════════════════════════════════════════
   LOOKUP FUNCTIONS
   ═══════════════════════════════════════════════════════════════════ */

function getProductById(id) {
  return PRODUCTS.find(function(p) { return p.id === String(id); });
}

function getRelatedProducts(productId, count) {
  count = count || 4;
  var product = getProductById(productId);
  if (!product) return PRODUCTS.slice(0, count);
  return PRODUCTS.filter(function(p) {
    return p.id !== productId && (p.cat === product.cat || p.sub === product.sub);
  }).slice(0, count);
}

function getProductsByCategory(cat, sub) {
  return PRODUCTS.filter(function(p) {
    if (sub) return p.cat === cat && p.sub === sub;
    return p.cat === cat;
  });
}

function searchProducts(query) {
  if (!query) return [];
  var q = query.toLowerCase();
  return PRODUCTS.filter(function(p) {
    return p.name.toLowerCase().indexOf(q) !== -1 ||
           p.cat.toLowerCase().indexOf(q) !== -1 ||
           (p.brand && p.brand.toLowerCase().indexOf(q) !== -1);
  });
}

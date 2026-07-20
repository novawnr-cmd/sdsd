/* ═══════════════════════════════════════════════════════════════════
   SITE CONFIGURATION - آدم شوب
   عدّل هذا الملف لتغيير اللوقو، البانرات، والعروض في الصفحة الرئيسية
   ═══════════════════════════════════════════════════════════════════ */

var SITE_CONFIG = {

  /* ─────────────── اللوقو ─────────────── */
  // غيّر القيمة لاستخدام صورة لوقو بدلاً من الإيموجي
  // مثال: logo: 'images/logo.png'
  logo: {
    icon: '👜',           // إيموجي (اتركه فارغ إذا كنت تستخدم صورة)
    image: '',            // رابط صورة اللوقو (اتركه فارغ للإيموجي)
    nameAr: 'آدم شوب',
    nameEn: 'ADAM SHOP'
  },

  /* ─────────────── بانرات الصفحة الرئيسية (سلايدر) ─────────────── */
  // يمكنك إضافة/حذف/تعديل البانرات بسهولة
  // الصور: استخدم placehold.co للتجربة أو صور حقيقية
  heroBanners: [
    {
      image: 'https://placehold.co/1400x460/050810/3B7DFF?text=ADAM+SHOP+Marketplace',
      titleAr: 'تجربة <span class="accent">تسوق فاخرة</span> ومميزة',
      titleEn: 'A <span class="accent">Premium</span> Shopping Experience',
      subtitleAr: 'اكتشف عالم من المنتجات الفاخرة والإلكترونيات الأحدث بأفضل الأسعار مع ضمان الجودة والشحن السريع',
      subtitleEn: 'Discover premium products and latest electronics at the best prices with quality guarantee and fast shipping',
      link: 'pages/products.html',
      btnAr: 'تسوق الآن',
      btnEn: 'Shop Now'
    },
    {
      image: 'https://placehold.co/1400x460/0A0E1A/3B7DFF?text=Electronics+%E2%9C%A8',
      titleAr: 'أحدث <span class="accent">الإلكترونيات</span> والأجهزة',
      titleEn: 'Latest <span class="accent">Electronics</span> & Devices',
      subtitleAr: 'سماعات، ساعات ذكية، هواتف وأكثر منتجات تقنية مميزة',
      subtitleEn: 'Headphones, smart watches, phones and more premium tech products',
      link: 'pages/category.html?cat=electronics',
      btnAr: 'تسوق الآن',
      btnEn: 'Shop Now'
    },
    {
      image: 'https://placehold.co/1400x460/12172A/3B7DFF?text=Fashion+%E2%9B%A5%EF%B8%8F',
      titleAr: 'أزياء <span class="accent">فاخرة</span> من أرقى العلامات',
      titleEn: 'Premium <span class="accent">Fashion</span> from Top Brands',
      subtitleAr: 'تشكيلة واسعة من الملابس والإكسسوارات العصرية',
      subtitleEn: 'A wide collection of modern clothes and accessories',
      link: 'pages/category.html?cat=fashion',
      btnAr: 'تسوق الآن',
      btnEn: 'Shop Now'
    }
  ],

  /* ─────────────── بانر الوسط الترويجي ─────────────── */
  promoBanner: {
    image: 'https://placehold.co/400x250/12172A/3B7DFF?text=Fashion+Sale+%E2%9C%A8',
    titleAr: 'خصم <span class="text-accent">حتى 50%</span> على الأزياء',
    titleEn: 'Up to <span class="text-accent">50% Off</span> on Fashion',
    descAr: 'اكتشف تشكيلة الأزياء الفاخرة بأسعار استثنائية لفترة محدودة',
    descEn: 'Discover premium fashion collection at exceptional prices for a limited time',
    link: 'pages/category.html?cat=fashion',
    btnAr: 'تسوق الآن',
    btnEn: 'Shop Now'
  },

  /* ─────────────── عروض خاطفة ─────────────── */
  flashDeals: [
    {
      nameAr: 'سماعات AirPods Pro 2',
      nameEn: 'AirPods Pro 2',
      image: 'https://placehold.co/300x300/12172A/3B7DFF?text=AirPods',
      price: 799,
      oldPrice: 1229,
      discount: 35,
      sold: 72
    },
    {
      nameAr: 'ساعة Apple Watch Ultra',
      nameEn: 'Apple Watch Ultra',
      image: 'https://placehold.co/300x300/12172A/3B7DFF?text=Watch',
      price: 2899,
      oldPrice: 3999,
      discount: 28,
      sold: 58
    },
    {
      nameAr: 'ماك بوك برو M3',
      nameEn: 'MacBook Pro M3',
      image: 'https://placehold.co/300x300/12172A/3B7DFF?text=MacBook',
      price: 7199,
      oldPrice: 8999,
      discount: 20,
      sold: 45
    },
    {
      nameAr: 'آيباد برو 12.9 بوصة',
      nameEn: 'iPad Pro 12.9"',
      image: 'https://placehold.co/300x300/12172A/3B7DFF?text=iPad',
      price: 4199,
      oldPrice: 5599,
      discount: 25,
      sold: 62
    },
    {
      nameAr: 'حذاء Nike Air Max',
      nameEn: 'Nike Air Max',
      image: 'https://placehold.co/300x300/12172A/3B7DFF?text=Sneakers',
      price: 449,
      oldPrice: 749,
      discount: 40,
      sold: 80
    },
    {
      nameAr: 'عطر Dior Sauvage',
      nameEn: 'Dior Sauvage',
      image: 'https://placehold.co/300x300/12172A/3B7DFF?text=Perfume',
      price: 399,
      oldPrice: 569,
      discount: 30,
      sold: 55
    }
  ]
};

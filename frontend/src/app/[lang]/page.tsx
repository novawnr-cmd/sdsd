'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function LangHome() {
  const { lang } = useParams();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    if (lang === 'ar' || lang === 'en') {
      setLanguage(lang);
    }
  }, [lang, setLanguage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-dark-DEFAULT via-dark-50 to-primary/20 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">ادم شوب</h1>
          <p className="text-lg text-gray-300 mb-8">تسوّق بأفضل الأسعار</p>
          <a href="/products" className="inline-block px-8 py-3 bg-primary hover:bg-primary-600 text-dark-DEFAULT font-bold rounded-xl transition-all hover:shadow-gold-lg">تسوق الآن</a>
        </div>
      </section>

      <WhyUsSection />
      <NewsletterSection />
    </div>
  );
}

function WhyUsSection() {
  const features = [
    { title: 'توصيل سريع', desc: 'توصيل سريع لجميع أنحاء المملكة' },
    { title: 'دفع آمن', desc: 'طرق دفع متعددة وآمنة' },
    { title: 'إرجاع سهل', desc: 'سياسة إرجاع مرنة وسهلة' },
    { title: 'دعم عملاء', desc: 'فريق دعم متواصل على مدار الساعة' },
  ];
  return (
    <section className="py-12">
      <div className="text-center mb-8"><h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-dark-800">لماذا تتسوق معنا؟</h2></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div key={i} className="text-center p-6 bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5">
            <h3 className="font-semibold text-gray-900 dark:text-dark-800 mb-1">{f.title}</h3>
            <p className="text-sm text-gray-500 dark:text-dark-300">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-dark-800 mb-3">اشترك في نشرتنا البريدية</h2>
      <p className="text-gray-500 dark:text-dark-300 mb-6">احصل على أحدث العروض والخصومات</p>
      <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
        <input type="email" placeholder="أدخل بريدك الإلكتروني" className="flex-1 px-4 py-3 bg-white dark:bg-dark-50 border border-gray-200 dark:border-dark-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/50" />
        <button type="submit" className="px-6 py-3 bg-primary hover:bg-primary-600 text-dark-DEFAULT font-semibold rounded-xl transition-all hover:shadow-gold">اشترك</button>
      </form>
    </section>
  );
}

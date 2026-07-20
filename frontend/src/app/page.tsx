'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';

function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const loadUser = useAuthStore((s) => s.loadUser);
  const loadLocalCart = useCartStore((s) => s.loadLocalCart);
  const loadWishlist = useWishlistStore((s) => s.loadWishlist);

  useEffect(() => {
    setMounted(true);
    loadUser();
    loadLocalCart();
    loadWishlist();
  }, []);

  if (!mounted) return <LoadingScreen />;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--toast-bg, #fff)',
            color: 'var(--toast-color, #111827)',
            borderRadius: '12px',
            padding: '12px 16px',
          },
        }}
      />
    </>
  );
}

export default function Page() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Providers>
          <HomeContent />
        </Providers>
      </LanguageProvider>
    </ThemeProvider>
  );
}

function HomeContent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      <HeroSection />
      <CategoryGrid />
      <FlashDeals />
      <TrendingProducts />
      <WhyUsSection />
      <LatestProducts />
      <BestSellers />
      <NewsletterSection />
    </div>
  );
}

function HeroSection() {
  return <section><div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-dark-DEFAULT via-dark-50 to-primary/20 flex items-center justify-center"><div className="text-center px-6"><h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">Shop at the Best Prices</h1><p className="text-lg text-gray-300 mb-8">Discover thousands of products from the best sellers</p><a href="/products" className="inline-block px-8 py-3 bg-primary hover:bg-primary-600 text-dark-DEFAULT font-bold rounded-xl transition-all hover:shadow-gold-lg">Shop Now</a></div></div></section>;
}

import HeroBanner from '@/components/home/HeroBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import FlashDeals from '@/components/home/FlashDeals';
import TrendingProducts from '@/components/home/TrendingProducts';
import LatestProducts from '@/components/home/LatestProducts';
import BestSellers from '@/components/home/BestSellers';
import { FiTruck, FiShield, FiRotateCcw, FiHeadphones } from 'react-icons/fi';

function WhyUsSection() {
  const features = [
    { icon: FiTruck, title: 'Fast Delivery', desc: 'Fast delivery across the Kingdom' },
    { icon: FiShield, title: 'Secure Payment', desc: 'Multiple secure payment methods' },
    { icon: FiRotateCcw, title: 'Easy Returns', desc: 'Flexible and easy return policy' },
    { icon: FiHeadphones, title: '24/7 Support', desc: 'Support team available 24/7' },
  ];
  return (
    <section className="py-12">
      <div className="text-center mb-8"><h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-dark-800">Why Shop With Us?</h2></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div key={i} className="text-center p-6 bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><f.icon size={28} /></div>
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
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-dark-800 mb-3">Subscribe to Our Newsletter</h2>
      <p className="text-gray-500 dark:text-dark-300 mb-6">Get the latest deals and discounts</p>
      <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
        <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 bg-white dark:bg-dark-50 border border-gray-200 dark:border-dark-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/50" />
        <button type="submit" className="px-6 py-3 bg-primary hover:bg-primary-600 text-dark-DEFAULT font-semibold rounded-xl transition-all hover:shadow-gold">Subscribe</button>
      </form>
    </section>
  );
}

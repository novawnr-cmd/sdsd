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
import { useParams } from 'next/navigation';

export default function LangLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Providers>
          {children}
        </Providers>
      </LanguageProvider>
    </ThemeProvider>
  );
}

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
      <Toaster position="top-center" />
    </>
  );
}

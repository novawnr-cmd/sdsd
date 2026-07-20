import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ادم شوب | Adam Shop - Multi-Vendor Marketplace',
    template: '%s | ادم شوب Adam Shop',
  },
  description: 'Discover thousands of products from the best sellers in Saudi Arabia. Shop electronics, fashion, home goods and more.',
  keywords: ['marketplace', 'ecommerce', 'shopping', 'Saudi Arabia', 'Adam Shop', 'ادم شوب'],
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    siteName: 'ادم شوب Adam Shop',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  backupPhone?: string;
  avatar?: string;
  role: 'customer' | 'seller' | 'admin';
  city?: string;
  location?: { lat: number; lng: number; address: string };
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  _id: string;
  owner: string | User;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  banner?: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  location?: { lat: number; lng: number };
  rating: number;
  totalSales: number;
  isActive: boolean;
  isVerified: boolean;
  subscription?: Subscription;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: { ar: string; en: string };
  slug: string;
  icon?: string;
  image?: string;
  parent?: string;
  children?: Category[];
  productCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  _id: string;
  store: string | Store;
  category: string | Category;
  subcategory?: string | Category;
  name: { ar: string; en: string };
  slug: string;
  description: { ar: string; en: string };
  type: 'simple' | 'variable' | 'digital' | 'service';
  price: number;
  compareAtPrice?: number;
  sku?: string;
  barcode?: string;
  quantity?: number;
  images: string[];
  variants?: ProductVariant[];
  options?: ProductOption[];
  tags: string[];
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  rating: number;
  numReviews: number;
  totalSales: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  _id: string;
  name: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  image?: string;
  options: Record<string, string>;
  isActive: boolean;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: string | User;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: 'cod' | 'online' | 'wallet';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  subtotal: number;
  shippingCost: number;
  discount: number;
  tax: number;
  total: number;
  couponCode?: string;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
  location?: { lat: number; lng: number };
  isDefault?: boolean;
}

export interface Review {
  _id: string;
  product: string | Product;
  customer: string | User;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  _id: string;
  store: string | Store;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface Banner {
  _id: string;
  title: { ar: string; en: string };
  subtitle?: { ar: string; en: string };
  image: string;
  link?: string;
  position: 'hero' | 'sidebar' | 'footer';
  isActive: boolean;
  order: number;
  createdAt: string;
}

export interface WishlistItem {
  _id: string;
  product: Product;
  createdAt: string;
}

export interface Subscription {
  _id: string;
  store: string | Store;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  startDate: string;
  endDate: string;
  isActive: boolean;
  features: string[];
}

export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  monthlyRevenue: number;
  rating: number;
}

export interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingApprovals: number;
  monthlyGrowth: number;
}

export interface FilterOptions {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'bestselling';
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

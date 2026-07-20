import { Request } from "express";
import { Role, OrderStatus, ProductType, DiscountType, SubscriptionStatus } from "@prisma/client";

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}

export interface ProductCreateInput {
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  price: number;
  priceEn?: number;
  stock: number;
  categoryId: string;
  productType: ProductType;
  gallery?: string[];
  variants?: ProductVariantInput[];
}

export interface ProductVariantInput {
  color?: string;
  size?: string;
  price: number;
  stock: number;
  sku?: string;
  image?: string;
}

export interface OrderCreateInput {
  storeId: string;
  shippingAddress: string;
  city: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  backupPhone?: string;
  email?: string;
  notes?: string;
  items: OrderItemInput[];
  couponCode?: string;
}

export interface OrderItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
  color?: string;
  size?: string;
}

export interface CartItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
  color?: string;
  size?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface ProductQuery extends PaginationQuery {
  search?: string;
  categoryId?: string;
  storeId?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeSubscriptions: number;
  recentOrders: any[];
  monthlySales: any[];
}

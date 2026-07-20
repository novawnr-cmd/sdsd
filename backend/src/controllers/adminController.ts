import { Response } from "express";
import { AuthRequest } from "../types";
import prisma from "../config/database";
import { generateSlug, ensureUniqueSlug } from "../utils/slugify";
import { Prisma } from "@prisma/client";

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      pendingOrders,
      activeSubscriptions,
      monthlyRevenue,
      recentOrders,
      monthlySales,
      pendingApplications,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "SELLER" } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.order.aggregate({
        where: {
          status: { in: ["DELIVERED", "SHIPPED", "PROCESSING", "CONFIRMED"] },
          createdAt: { gte: startOfMonth },
        },
        _sum: { totalAmount: true },
      }),
      prisma.order.findMany({
        include: {
          customer: { select: { id: true, name: true } },
          store: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.order.groupBy({
        by: ["createdAt"],
        where: {
          createdAt: { gte: new Date(now.getFullYear(), now.getMonth() - 11, 1) },
          status: { in: ["DELIVERED", "SHIPPED", "PROCESSING", "CONFIRMED"] },
        },
        _sum: { totalAmount: true },
        _count: { id: true },
      }),
      prisma.sellerApplication.count({ where: { status: "PENDING" } }),
    ]);

    const totalRevenue = await prisma.order.aggregate({
      where: {
        status: { in: ["DELIVERED", "SHIPPED", "PROCESSING", "CONFIRMED"] },
      },
      _sum: { totalAmount: true },
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        pendingOrders,
        activeSubscriptions,
        monthlyRevenue: monthlyRevenue._sum.totalAmount || 0,
        pendingApplications,
        recentOrders,
        monthlySales,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const search = req.query.search as string;
    const role = req.query.role as string;

    const where: Prisma.UserWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ];
    }
    if (role) where.role = role as any;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, email: true, name: true, phone: true, city: true,
          avatar: true, role: true, isVerified: true, provider: true, createdAt: true,
          store: { select: { id: true, name: true, isActive: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSellers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        include: {
          user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
          _count: { select: { products: true, orders: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.store.count(),
    ]);

    res.status(200).json({
      success: true,
      data: stores,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get sellers error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const search = req.query.search as string;

    const where: Prisma.ProductWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nameEn: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          store: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get admin products error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const status = req.query.status as string;
    const search = req.query.search as string;

    const where: Prisma.OrderWhereInput = {};
    if (status) where.status = status as any;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { customer: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: { select: { id: true, name: true, email: true, phone: true } },
          store: { select: { id: true, name: true } },
          items: { include: { product: { select: { name: true, mainImage: true } } } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get admin orders error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true, children: true } },
        parent: { select: { id: true, name: true } },
      },
      orderBy: { name: "asc" },
    });

    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Get admin categories error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, nameEn, icon, image, parentId } = req.body;

    const existingSlugs = (await prisma.category.findMany({ select: { slug: true } })).map(c => c.slug);
    const slug = ensureUniqueSlug(generateSlug(nameEn || name), existingSlugs);

    const category = await prisma.category.create({
      data: {
        name,
        nameEn,
        slug,
        icon,
        image,
        parentId: parentId || null,
      },
    });

    res.status(201).json({ success: true, message: "Category created", data: category });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, nameEn, icon, image, parentId, isActive } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(nameEn !== undefined && { nameEn }),
        ...(icon !== undefined && { icon }),
        ...(image !== undefined && { image }),
        ...(parentId !== undefined && { parentId: parentId || null }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.status(200).json({ success: true, message: "Category updated", data: category });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }

    if (category._count.products > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete category with ${category._count.products} products`,
      });
      return;
    }

    await prisma.category.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const isApproved = req.query.isApproved as string;

    const where: any = {};
    if (isApproved !== undefined) where.isApproved = isApproved === "true";

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          customer: { select: { id: true, name: true, email: true, avatar: true } },
          product: { select: { id: true, name: true, mainImage: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get admin reviews error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const approveReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.review.update({
      where: { id },
      data: { isApproved: true },
    });

    res.status(200).json({ success: true, message: "Review approved" });
  } catch (error) {
    console.error("Approve review error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCoupons = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coupons = await prisma.coupon.findMany({
      include: { store: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    console.error("Get admin coupons error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSubscriptions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.subscription.count(),
    ]);

    res.status(200).json({
      success: true,
      data: subscriptions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get admin subscriptions error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createFlashDeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, discount, startTime, endTime } = req.body;

    const existing = await prisma.flashDeal.findUnique({ where: { productId } });
    if (existing) {
      res.status(400).json({ success: false, message: "Flash deal already exists for this product" });
      return;
    }

    const deal = await prisma.flashDeal.create({
      data: {
        productId,
        discount: parseFloat(discount),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
      include: { product: { select: { id: true, name: true, mainImage: true, price: true } } },
    });

    res.status(201).json({ success: true, message: "Flash deal created", data: deal });
  } catch (error) {
    console.error("Create flash deal error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteFlashDeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.flashDeal.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Flash deal deleted" });
  } catch (error) {
    console.error("Delete flash deal error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createBanner = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, titleEn, image, link, position, isActive } = req.body;

    const banner = await prisma.banner.create({
      data: {
        title,
        titleEn,
        image,
        link,
        position: position || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    res.status(201).json({ success: true, message: "Banner created", data: banner });
  } catch (error) {
    console.error("Create banner error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateBanner = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, titleEn, image, link, position, isActive } = req.body;

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(titleEn !== undefined && { titleEn }),
        ...(image && { image }),
        ...(link !== undefined && { link }),
        ...(position !== undefined && { position }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.status(200).json({ success: true, message: "Banner updated", data: banner });
  } catch (error) {
    console.error("Update banner error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteBanner = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.banner.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Banner deleted" });
  } catch (error) {
    console.error("Delete banner error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBanners = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { position: "asc" },
    });
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    console.error("Get banners error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getActiveBanners = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { position: "asc" },
    });
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    console.error("Get active banners error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateSiteSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const settings = req.body.settings;

    if (!Array.isArray(settings)) {
      res.status(400).json({ success: false, message: "Settings must be an array" });
      return;
    }

    for (const setting of settings) {
      await prisma.siteSettings.upsert({
        where: { key: setting.key },
        update: { value: setting.value, type: setting.type || "text" },
        create: {
          key: setting.key,
          value: setting.value,
          type: setting.type || "text",
        },
      });
    }

    res.status(200).json({ success: true, message: "Settings updated" });
  } catch (error) {
    console.error("Update site settings error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSiteSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const settings = await prisma.siteSettings.findMany();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error("Get site settings error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { period = "30" } = req.query;
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [salesData, ordersByStatus, usersByDay, topProducts, topStores] = await Promise.all([
      prisma.order.findMany({
        where: {
          createdAt: { gte: startDate },
          status: { in: ["DELIVERED", "SHIPPED", "PROCESSING", "CONFIRMED"] },
        },
        select: { totalAmount: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.order.groupBy({
        by: ["status"],
        where: { createdAt: { gte: startDate } },
        _count: { id: true },
        _sum: { totalAmount: true },
      }),
      prisma.user.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.product.findMany({
        include: {
          _count: { select: { orderItems: true } },
          reviews: { where: { isApproved: true }, select: { rating: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.store.findMany({
        include: {
          _count: { select: { orders: true } },
          orders: {
            where: { status: { in: ["DELIVERED", "SHIPPED", "PROCESSING", "CONFIRMED"] } },
            select: { totalAmount: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    // Aggregate sales by day
    const salesByDay: Record<string, number> = {};
    for (const sale of salesData) {
      const date = sale.createdAt.toISOString().slice(0, 10);
      salesByDay[date] = (salesByDay[date] || 0) + sale.totalAmount;
    }

    // Aggregate users by day
    const usersByDayAgg: Record<string, number> = {};
    for (const user of usersByDay) {
      const date = user.createdAt.toISOString().slice(0, 10);
      usersByDayAgg[date] = (usersByDayAgg[date] || 0) + 1;
    }

    const topProductsWithStats = topProducts.map((p) => ({
      id: p.id,
      name: p.name,
      mainImage: p.mainImage,
      totalOrders: p._count.orderItems,
      averageRating:
        p.reviews.length > 0
          ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
          : 0,
    })).sort((a, b) => b.totalOrders - a.totalOrders);

    const topStoresWithStats = topStores.map((s) => ({
      id: s.id,
      name: s.name,
      logo: s.logo,
      totalOrders: s._count.orders,
      totalRevenue: s.orders.reduce((sum, o) => sum + o.totalAmount, 0),
    })).sort((a, b) => b.totalRevenue - a.totalRevenue);

    res.status(200).json({
      success: true,
      data: {
        salesByDay: Object.entries(salesByDay).map(([date, amount]) => ({ date, amount })),
        ordersByStatus,
        usersByDay: Object.entries(usersByDayAgg).map(([date, count]) => ({ date, count })),
        topProducts: topProductsWithStats,
        topStores: topStoresWithStats,
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const adminUpdateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    if (status === "CANCELLED") {
      const orderItems = await prisma.orderItem.findMany({ where: { orderId: id } });
      for (const item of orderItems) {
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        } else {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }

    res.status(200).json({ success: true, message: "Order status updated", data: updatedOrder });
  } catch (error) {
    console.error("Admin update order status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const toggleStoreActive = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) {
      res.status(404).json({ success: false, message: "Store not found" });
      return;
    }

    const updated = await prisma.store.update({
      where: { id },
      data: { isActive: !store.isActive },
    });

    res.status(200).json({
      success: true,
      message: `Store ${updated.isActive ? "activated" : "deactivated"}`,
      data: updated,
    });
  } catch (error) {
    console.error("Toggle store active error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (id === req.user!.userId) {
      res.status(400).json({ success: false, message: "Cannot delete yourself" });
      return;
    }

    await prisma.user.delete({ where: { id } });
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const toggleUserVerification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isVerified: !user.isVerified },
    });

    res.status(200).json({
      success: true,
      message: `User ${updated.isVerified ? "verified" : "unverified"}`,
      data: { id: updated.id, isVerified: updated.isVerified },
    });
  } catch (error) {
    console.error("Toggle user verification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

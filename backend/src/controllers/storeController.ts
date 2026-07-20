import { Response } from "express";
import { AuthRequest } from "../types";
import prisma from "../config/database";
import { generateSlug, ensureUniqueSlug } from "../utils/slugify";

export const createStore = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, phone, email, city, latitude, longitude, logo } = req.body;

    const existingStore = await prisma.store.findUnique({ where: { userId: req.user!.userId } });
    if (existingStore) {
      res.status(400).json({ success: false, message: "You already have a store" });
      return;
    }

    const existingSlugs = (await prisma.store.findMany({ select: { slug: true } })).map(
      (s) => s.slug
    );
    const baseSlug = generateSlug(name);
    const slug = ensureUniqueSlug(baseSlug, existingSlugs);

    const store = await prisma.store.create({
      data: {
        name,
        slug,
        description,
        phone,
        email,
        city,
        latitude: latitude || null,
        longitude: longitude || null,
        logo: logo || null,
        userId: req.user!.userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Store created successfully. Waiting for admin approval.",
      data: store,
    });
  } catch (error) {
    console.error("Create store error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyStore = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const store = await prisma.store.findUnique({
      where: { userId: req.user!.userId },
      include: {
        _count: {
          select: { products: true, orders: true, coupons: true },
        },
      },
    });

    if (!store) {
      res.status(404).json({ success: false, message: "Store not found" });
      return;
    }

    const recentOrders = await prisma.order.findMany({
      where: { storeId: store.id },
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        items: {
          include: { product: { select: { name: true, mainImage: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const totalRevenue = await prisma.order.aggregate({
      where: { storeId: store.id, status: { in: ["DELIVERED", "SHIPPED", "PROCESSING", "CONFIRMED"] } },
      _sum: { totalAmount: true },
    });

    const pendingOrders = await prisma.order.count({
      where: { storeId: store.id, status: "PENDING" },
    });

    res.status(200).json({
      success: true,
      data: {
        ...store,
        productCount: store._count.products,
        orderCount: store._count.orders,
        couponCount: store._count.coupons,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        pendingOrders,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Get my store error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateStore = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const store = await prisma.store.findUnique({ where: { userId: req.user!.userId } });
    if (!store) {
      res.status(404).json({ success: false, message: "Store not found" });
      return;
    }

    const { name, description, phone, email, city, latitude, longitude, logo, receiveOrdersByEmail } = req.body;

    let slug = store.slug;
    if (name && name !== store.name) {
      const existingSlugs = (await prisma.store.findMany({
        where: { id: { not: store.id } },
        select: { slug: true },
      })).map((s) => s.slug);
      slug = ensureUniqueSlug(generateSlug(name), existingSlugs);
    }

    const updatedStore = await prisma.store.update({
      where: { id: store.id },
      data: {
        ...(name && { name }),
        ...(slug !== store.slug && { slug }),
        ...(description !== undefined && { description }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(city !== undefined && { city }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(logo && { logo }),
        ...(receiveOrdersByEmail !== undefined && { receiveOrdersByEmail }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Store updated successfully",
      data: updatedStore,
    });
  } catch (error) {
    console.error("Update store error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getStoreBySlug = async (req: any, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const store = await prisma.store.findUnique({
      where: { slug, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        description: true,
        phone: true,
        city: true,
        createdAt: true,
        _count: { select: { products: true } },
      },
    });

    if (!store) {
      res.status(404).json({ success: false, message: "Store not found" });
      return;
    }

    const products = await prisma.product.findMany({
      where: { storeId: store.id, isActive: true, isPaused: false },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        reviews: { where: { isApproved: true }, select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const productsWithStats = products.map((product) => {
      const { reviews, ...productData } = product;
      return {
        ...productData,
        averageRating:
          reviews.length > 0
            ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
            : 0,
        reviewCount: reviews.length,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        ...store,
        products: productsWithStats,
      },
    });
  } catch (error) {
    console.error("Get store by slug error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

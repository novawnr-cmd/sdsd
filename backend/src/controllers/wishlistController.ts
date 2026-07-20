import { Response } from "express";
import { AuthRequest } from "../types";
import prisma from "../config/database";

export const toggleWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId: req.user!.userId, productId } },
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      res.status(200).json({ success: true, message: "Removed from wishlist", data: { isWishlisted: false } });
    } else {
      await prisma.wishlist.create({
        data: { userId: req.user!.userId, productId },
      });
      res.status(201).json({ success: true, message: "Added to wishlist", data: { isWishlisted: true } });
    }
  } catch (error) {
    console.error("Toggle wishlist error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);

    const [wishlist, total] = await Promise.all([
      prisma.wishlist.findMany({
        where: { userId: req.user!.userId },
        include: {
          product: {
            include: {
              store: { select: { id: true, name: true, slug: true } },
              category: { select: { id: true, name: true, slug: true } },
              reviews: { where: { isApproved: true }, select: { rating: true } },
              variants: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.wishlist.count({ where: { userId: req.user!.userId } }),
    ]);

    const items = wishlist.map((w) => {
      const { reviews, ...productData } = w.product;
      return {
        ...w,
        product: {
          ...productData,
          averageRating:
            reviews.length > 0
              ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
              : 0,
          reviewCount: reviews.length,
        },
      };
    });

    res.status(200).json({
      success: true,
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

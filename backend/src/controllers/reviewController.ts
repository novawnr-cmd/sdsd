import { Response } from "express";
import { AuthRequest } from "../types";
import prisma from "../config/database";

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    const hasOrdered = await prisma.orderItem.findFirst({
      where: {
        product: { id: productId },
        order: {
          customerId: req.user!.userId,
          status: "DELIVERED",
        },
      },
    });

    const existingReview = await prisma.review.findUnique({
      where: { customerId_productId: { customerId: req.user!.userId, productId } },
    });

    if (existingReview) {
      res.status(400).json({ success: false, message: "You have already reviewed this product" });
      return;
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        customerId: req.user!.userId,
        productId,
        isApproved: !!hasOrdered,
      },
      include: {
        customer: { select: { id: true, name: true, avatar: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: hasOrdered
        ? "Review published successfully"
        : "Review submitted and awaiting approval",
      data: review,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProductReviews = async (req: any, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);

    const where: any = { productId };
    if (!req.user || req.user.role !== "ADMIN") {
      where.isApproved = true;
    }

    const [reviews, total, stats] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          customer: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where: { productId, isApproved: true },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    const ratingDistribution = await prisma.review.groupBy({
      by: ["rating"],
      where: { productId, isApproved: true },
      _count: { rating: true },
      orderBy: { rating: "asc" },
    });

    res.status(200).json({
      success: true,
      data: {
        reviews,
        stats: {
          averageRating: stats._avg.rating
            ? Math.round(stats._avg.rating * 10) / 10
            : 0,
          totalReviews: stats._count.rating,
          distribution: ratingDistribution.map((d) => ({
            rating: d.rating,
            count: d._count.rating,
          })),
        },
      },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get product reviews error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const approveReview = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      res.status(404).json({ success: false, message: "Review not found" });
      return;
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { isApproved: true },
    });

    res.status(200).json({
      success: true,
      message: "Review approved",
      data: updatedReview,
    });
  } catch (error) {
    console.error("Approve review error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteReview = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      res.status(404).json({ success: false, message: "Review not found" });
      return;
    }

    if (req.user.role !== "ADMIN" && review.customerId !== req.user.userId) {
      res.status(403).json({ success: false, message: "Not authorized" });
      return;
    }

    await prisma.review.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

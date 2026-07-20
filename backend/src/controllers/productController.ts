import { Request, Response } from "express";
import { AuthRequest, ProductQuery } from "../types";
import prisma from "../config/database";
import { generateSlug, ensureUniqueSlug } from "../utils/slugify";
import { Prisma } from "@prisma/client";

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name, nameEn, description, descriptionEn, price, priceEn,
      stock, categoryId, productType, gallery, variants
    } = req.body;

    const store = await prisma.store.findUnique({ where: { userId: req.user!.userId } });
    if (!store) {
      res.status(404).json({ success: false, message: "Store not found" });
      return;
    }

    const existingSlugs = (await prisma.product.findMany({ select: { slug: true } })).map(p => p.slug);
    const baseSlug = generateSlug(nameEn || name);
    const slug = ensureUniqueSlug(baseSlug, existingSlugs);

    const mainImage = req.file ? req.file.path : "";

    const product = await prisma.product.create({
      data: {
        name,
        nameEn,
        slug,
        description,
        descriptionEn,
        mainImage,
        gallery: gallery || [],
        price: parseFloat(price),
        priceEn: priceEn ? parseFloat(priceEn) : undefined,
        stock: parseInt(stock) || 0,
        productType: productType || "SIMPLE",
        categoryId,
        storeId: store.id,
        variants: variants && variants.length > 0
          ? {
              create: variants.map((v: any) => ({
                color: v.color || null,
                size: v.size || null,
                price: parseFloat(v.price),
                stock: parseInt(v.stock) || 0,
                sku: v.sku || null,
                image: v.image || null,
              })),
            }
          : undefined,
      },
      include: {
        variants: true,
        category: { select: { id: true, name: true, slug: true } },
        store: { select: { id: true, name: true, slug: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = "1", limit = "20", search, categoryId,
      storeId, minPrice, maxPrice, sortBy = "createdAt", order = "desc"
    } = req.query as ProductQuery;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      isPaused: false,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nameEn: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { descriptionEn: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (storeId) {
      where.storeId = storeId;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const validSortFields = ["createdAt", "price", "name"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, nameEn: true, slug: true } },
          store: { select: { id: true, name: true, slug: true, logo: true } },
          variants: true,
          reviews: { where: { isApproved: true }, select: { rating: true } },
        },
        skip,
        take: limitNum,
        orderBy: { [sortField]: order },
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithStats = products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
          : 0;
      const { reviews, ...productData } = product;
      return {
        ...productData,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      };
    });

    res.status(200).json({
      success: true,
      data: productsWithStats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, nameEn: true, slug: true, icon: true } },
        store: {
          select: {
            id: true, name: true, slug: true, logo: true, phone: true,
            city: true, isActive: true,
          },
        },
        variants: true,
        reviews: {
          where: { isApproved: true },
          include: { customer: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
        isPaused: false,
      },
      include: {
        reviews: { where: { isApproved: true }, select: { rating: true } },
        store: { select: { id: true, name: true } },
      },
      take: 6,
    });

    res.status(200).json({
      success: true,
      data: {
        ...product,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews.length,
        relatedProducts: relatedProducts.map((p) => {
          const { reviews, ...pData } = p;
          return {
            ...pData,
            averageRating:
              reviews.length > 0
                ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
                : 0,
          };
        }),
      },
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const store = await prisma.store.findUnique({ where: { userId: req.user!.userId } });
    if (!store) {
      res.status(404).json({ success: false, message: "Store not found" });
      return;
    }

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    if (existingProduct.storeId !== store.id && req.user!.role !== "ADMIN") {
      res.status(403).json({ success: false, message: "Not authorized" });
      return;
    }

    if (updateData.nameEn || updateData.name) {
      const existingSlugs = (await prisma.product.findMany({
        where: { id: { not: id } },
        select: { slug: true },
      })).map(p => p.slug);
      const baseSlug = generateSlug(updateData.nameEn || updateData.name);
      updateData.slug = ensureUniqueSlug(baseSlug, existingSlugs);
    }

    if (req.file) {
      updateData.mainImage = req.file.path;
    }

    if (updateData.variants) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.nameEn !== undefined && { nameEn: updateData.nameEn }),
        ...(updateData.slug && { slug: updateData.slug }),
        ...(updateData.description !== undefined && { description: updateData.description }),
        ...(updateData.descriptionEn !== undefined && { descriptionEn: updateData.descriptionEn }),
        ...(updateData.mainImage && { mainImage: updateData.mainImage }),
        ...(updateData.gallery && { gallery: updateData.gallery }),
        ...(updateData.price && { price: parseFloat(updateData.price) }),
        ...(updateData.priceEn !== undefined && { priceEn: updateData.priceEn ? parseFloat(updateData.priceEn) : null }),
        ...(updateData.stock !== undefined && { stock: parseInt(updateData.stock) }),
        ...(updateData.categoryId && { categoryId: updateData.categoryId }),
        ...(updateData.productType && { productType: updateData.productType }),
        ...(updateData.isActive !== undefined && { isActive: updateData.isActive }),
        ...(updateData.variants && {
          variants: {
            create: updateData.variants.map((v: any) => ({
              color: v.color || null,
              size: v.size || null,
              price: parseFloat(v.price),
              stock: parseInt(v.stock) || 0,
              sku: v.sku || null,
              image: v.image || null,
            })),
          },
        }),
      },
      include: { variants: true },
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const store = await prisma.store.findUnique({ where: { userId: req.user!.userId } });
    if (!store) {
      res.status(404).json({ success: false, message: "Store not found" });
      return;
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    if (product.storeId !== store.id && req.user!.role !== "ADMIN") {
      res.status(403).json({ success: false, message: "Not authorized" });
      return;
    }

    await prisma.product.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const togglePause = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const store = await prisma.store.findUnique({ where: { userId: req.user!.userId } });
    if (!store) {
      res.status(404).json({ success: false, message: "Store not found" });
      return;
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    if (product.storeId !== store.id) {
      res.status(403).json({ success: false, message: "Not authorized" });
      return;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { isPaused: !product.isPaused },
    });

    res.status(200).json({
      success: true,
      message: `Product ${updatedProduct.isPaused ? "paused" : "resumed"}`,
      data: { isPaused: updatedProduct.isPaused },
    });
  } catch (error) {
    console.error("Toggle pause error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getFlashDeals = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();

    const deals = await prisma.flashDeal.findMany({
      where: {
        isActive: true,
        startTime: { lte: now },
        endTime: { gte: now },
      },
      include: {
        product: {
          include: {
            store: { select: { id: true, name: true, slug: true } },
            reviews: { where: { isApproved: true }, select: { rating: true } },
          },
        },
      },
    });

    const dealsWithStats = deals.map((deal) => {
      const product = deal.product;
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
          : 0;
      const discountedPrice = product.price * (1 - deal.discount / 100);
      return {
        ...deal,
        product: {
          ...product,
          discountedPrice: Math.round(discountedPrice * 100) / 100,
          averageRating: Math.round(avgRating * 10) / 10,
          reviewCount: product.reviews.length,
        },
      };
    });

    res.status(200).json({ success: true, data: dealsWithStats });
  } catch (error) {
    console.error("Get flash deals error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTrending = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isPaused: false },
      include: {
        store: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } },
        reviews: { where: { isApproved: true }, select: { rating: true } },
        orderItems: { select: { quantity: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const productsWithScore = products
      .map((product) => {
        const totalSold = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        const avgRating =
          product.reviews.length > 0
            ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
            : 0;
        const score = totalSold * 0.6 + avgRating * 10 * 0.4;
        const { reviews, orderItems, ...productData } = product;
        return { ...productData, score, totalSold, averageRating: Math.round(avgRating * 10) / 10 };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    res.status(200).json({ success: true, data: productsWithScore });
  } catch (error) {
    console.error("Get trending error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getLatest = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);

    const products = await prisma.product.findMany({
      where: { isActive: true, isPaused: false },
      include: {
        store: { select: { id: true, name: true, slug: true, logo: true } },
        category: { select: { id: true, name: true, slug: true } },
        reviews: { where: { isApproved: true }, select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.product.count({
      where: { isActive: true, isPaused: false },
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
      data: productsWithStats,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get latest error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBestSellers = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isPaused: false },
      include: {
        store: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } },
        reviews: { where: { isApproved: true }, select: { rating: true } },
        orderItems: { select: { quantity: true } },
      },
    });

    const sorted = products
      .map((product) => {
        const totalSold = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        const { reviews, orderItems, ...productData } = product;
        const avgRating =
          reviews.length > 0
            ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
            : 0;
        return {
          ...productData,
          totalSold,
          averageRating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length,
        };
      })
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 20);

    res.status(200).json({ success: true, data: sorted });
  } catch (error) {
    console.error("Get best sellers error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getRecommended = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId, productId } = req.query;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      isPaused: false,
    };

    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    if (productId) {
      where.id = { not: productId as string };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        store: { select: { id: true, name: true, slug: true } },
        reviews: { where: { isApproved: true }, select: { rating: true } },
      },
      take: 12,
      orderBy: { createdAt: "desc" },
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

    res.status(200).json({ success: true, data: productsWithStats });
  } catch (error) {
    console.error("Get recommended error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, page = "1", limit = "20" } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(30, Math.max(1, parseInt(limit as string)));

    if (!q || (q as string).trim().length === 0) {
      res.status(200).json({ success: true, data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } });
      return;
    }

    const searchTerm = (q as string).trim();

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      isPaused: false,
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { nameEn: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { descriptionEn: { contains: searchTerm, mode: "insensitive" } },
      ],
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          store: { select: { id: true, name: true, slug: true } },
          category: { select: { id: true, name: true, slug: true } },
          reviews: { where: { isApproved: true }, select: { rating: true } },
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    const results = products.map((product) => {
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
      data: results,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Search products error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

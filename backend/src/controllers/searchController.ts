import { Request, Response } from "express";
import prisma from "../config/database";

export const liveSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || (q as string).trim().length < 2) {
      res.status(200).json({
        success: true,
        data: { products: [], categories: [], stores: [] },
      });
      return;
    }

    const searchTerm = (q as string).trim();

    const [products, categories, stores] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          isPaused: false,
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { nameEn: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          nameEn: true,
          slug: true,
          mainImage: true,
          price: true,
          store: { select: { id: true, name: true, slug: true } },
        },
        take: 10,
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { nameEn: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          nameEn: true,
          slug: true,
          icon: true,
          _count: { select: { products: true } },
        },
        take: 5,
      }),
      prisma.store.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          _count: { select: { products: true } },
        },
        take: 5,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        products: products.map((p) => ({
          ...p,
          type: "product",
        })),
        categories: categories.map((c) => ({
          ...c,
          productCount: c._count.products,
          type: "category",
        })),
        stores: stores.map((s) => ({
          ...s,
          productCount: s._count.products,
          type: "store",
        })),
      },
    });
  } catch (error) {
    console.error("Live search error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSearchSuggestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || (q as string).trim().length < 1) {
      res.status(200).json({ success: true, data: [] });
      return;
    }

    const searchTerm = (q as string).trim();

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isPaused: false,
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { nameEn: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      select: { name: true, nameEn: true },
      take: 5,
    });

    const suggestions = products
      .map((p) => p.nameEn || p.name)
      .filter(Boolean);

    res.status(200).json({ success: true, data: [...new Set(suggestions)] });
  } catch (error) {
    console.error("Search suggestions error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

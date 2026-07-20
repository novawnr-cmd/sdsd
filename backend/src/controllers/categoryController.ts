import { Request, Response } from "express";
import prisma from "../config/database";
import { generateSlug, ensureUniqueSlug } from "../utils/slugify";

interface CategoryTree {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
  icon: string | null;
  image: string | null;
  isActive: boolean;
  children: CategoryTree[];
}

const buildTree = (categories: any[], parentId: string | null = null): CategoryTree[] => {
  return categories
    .filter((cat) => cat.parentId === parentId)
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      nameEn: cat.nameEn,
      slug: cat.slug,
      icon: cat.icon,
      image: cat.image,
      isActive: cat.isActive,
      children: buildTree(categories, cat.id),
    }));
};

export const createCategory = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, nameEn, icon, image, parentId } = req.body;

    const existingSlugs = (await prisma.category.findMany({ select: { slug: true } })).map(
      (c) => c.slug
    );
    const baseSlug = generateSlug(nameEn || name);
    const slug = ensureUniqueSlug(baseSlug, existingSlugs);

    if (parentId) {
      const parent = await prisma.category.findUnique({ where: { id: parentId } });
      if (!parent) {
        res.status(404).json({ success: false, message: "Parent category not found" });
        return;
      }
    }

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

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });

    const tree = buildTree(categories);

    const flat = categories.map((cat) => ({
      ...cat,
      productCount: cat._count.products,
    }));

    res.status(200).json({
      success: true,
      data: { tree, flat },
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCategory = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, nameEn, icon, image, parentId, isActive } = req.body;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }

    if (parentId && parentId === id) {
      res.status(400).json({ success: false, message: "Category cannot be its own parent" });
      return;
    }

    let slug = existing.slug;
    if (name || nameEn) {
      const existingSlugs = (await prisma.category.findMany({
        where: { id: { not: id } },
        select: { slug: true },
      })).map((c) => c.slug);
      const baseSlug = generateSlug(nameEn || name || existing.name);
      slug = ensureUniqueSlug(baseSlug, existingSlugs);
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(nameEn !== undefined && { nameEn }),
        slug,
        ...(icon !== undefined && { icon }),
        ...(image !== undefined && { image }),
        ...(parentId !== undefined && { parentId: parentId || null }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteCategory = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true, children: true } } },
    });

    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }

    if (category._count.products > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete category with ${category._count.products} products. Move or delete products first.`,
      });
      return;
    }

    if (category._count.children > 0) {
      await prisma.category.updateMany({
        where: { parentId: id },
        data: { parentId: category.parentId },
      });
    }

    await prisma.category.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

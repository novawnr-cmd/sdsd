import { Response } from "express";
import { AuthRequest } from "../types";
import prisma from "../config/database";

export const createCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code, discount, discountType, minPurchase, maxUses, expiresAt } = req.body;

    const store = await prisma.store.findUnique({ where: { userId: req.user!.userId } });
    if (!store) {
      res.status(404).json({ success: false, message: "Store not found" });
      return;
    }

    const existingCoupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (existingCoupon) {
      res.status(400).json({ success: false, message: "Coupon code already exists" });
      return;
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discount: parseFloat(discount),
        discountType: discountType || "PERCENTAGE",
        minPurchase: minPurchase ? parseFloat(minPurchase) : null,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        storeId: store.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    console.error("Create coupon error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCoupons = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const store = await prisma.store.findUnique({ where: { userId: req.user!.userId } });
    if (!store) {
      res.status(404).json({ success: false, message: "Store not found" });
      return;
    }

    const coupons = await prisma.coupon.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    console.error("Get coupons error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const validateCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code, storeId, cartTotal } = req.body;

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

    if (!coupon) {
      res.status(404).json({ success: false, message: "Invalid coupon code" });
      return;
    }

    if (!coupon.isActive) {
      res.status(400).json({ success: false, message: "Coupon is no longer active" });
      return;
    }

    if (coupon.storeId !== storeId) {
      res.status(400).json({ success: false, message: "Invalid coupon for this store" });
      return;
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      res.status(400).json({ success: false, message: "Coupon has expired" });
      return;
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      res.status(400).json({ success: false, message: "Coupon usage limit reached" });
      return;
    }

    if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
      res.status(400).json({
        success: false,
        message: `Minimum purchase amount is ${coupon.minPurchase} LYD`,
      });
      return;
    }

    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = cartTotal * (coupon.discount / 100);
    } else {
      discountAmount = Math.min(coupon.discount, cartTotal);
    }

    res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discount: coupon.discount,
        discountType: coupon.discountType,
        discountAmount: Math.round(discountAmount * 100) / 100,
      },
    });
  } catch (error) {
    console.error("Validate coupon error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const store = await prisma.store.findUnique({ where: { userId: req.user!.userId } });
    if (!store) {
      res.status(404).json({ success: false, message: "Store not found" });
      return;
    }

    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon || coupon.storeId !== store.id) {
      res.status(404).json({ success: false, message: "Coupon not found" });
      return;
    }

    await prisma.coupon.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    console.error("Delete coupon error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

import { Response } from "express";
import { AuthRequest } from "../types";
import prisma from "../config/database";
import { sendSubscriptionRequest } from "../services/emailService";

export const createSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existing = await prisma.subscription.findUnique({
      where: { userId: req.user!.userId },
    });

    if (existing && existing.status === "ACTIVE" && new Date(existing.endDate) > new Date()) {
      res.status(400).json({ success: false, message: "You already have an active subscription" });
      return;
    }

    if (existing && existing.status === "ACTIVE") {
      await prisma.subscription.update({
        where: { id: existing.id },
        data: { status: "CANCELLED" },
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const subscription = await prisma.subscription.create({
      data: {
        userId: req.user!.userId,
        startDate,
        endDate,
        price: 30,
        status: "ACTIVE",
      },
    });

    // Update user role to seller
    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { role: "SELLER" },
    });

    // Notify admin
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
      if (user && process.env.ADMIN_EMAIL) {
        await sendSubscriptionRequest(process.env.ADMIN_EMAIL, user.name || "User", user.email);
      }
    } catch (emailError) {
      console.error("Subscription notification email error:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: subscription,
    });
  } catch (error) {
    console.error("Create subscription error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMySubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!subscription) {
      res.status(200).json({
        success: true,
        data: null,
        message: "No subscription found",
      });
      return;
    }

    // Auto-expire
    if (subscription.status === "ACTIVE" && new Date(subscription.endDate) < new Date()) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: "EXPIRED" },
      });
      subscription.status = "EXPIRED";
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    console.error("Get subscription error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

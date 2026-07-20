import { Response } from "express";
import { AuthRequest } from "../types";
import prisma from "../config/database";
import { sendNewSellerNotification, sendSubscriptionApproval, sendSellerApplicationRejected } from "../services/emailService";
import { generateSlug, ensureUniqueSlug } from "../utils/slugify";
import bcrypt from "bcryptjs";

export const submitApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { storeName, storeDescription, phone, city } = req.body;

    const existingApplication = await prisma.sellerApplication.findUnique({
      where: { userId: req.user!.userId },
    });

    if (existingApplication && existingApplication.status === "PENDING") {
      res.status(400).json({ success: false, message: "You already have a pending application" });
      return;
    }

    if (existingApplication && existingApplication.status === "APPROVED") {
      res.status(400).json({ success: false, message: "Your application has already been approved" });
      return;
    }

    const application = await prisma.sellerApplication.upsert({
      where: { userId: req.user!.userId },
      update: {
        storeName,
        storeDescription,
        phone,
        city,
        status: "PENDING",
      },
      create: {
        userId: req.user!.userId,
        storeName,
        storeDescription,
        phone,
        city,
      },
    });

    // Notify admin
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
      if (user && process.env.ADMIN_EMAIL) {
        await sendNewSellerNotification(
          process.env.ADMIN_EMAIL,
          user.name || "Unknown",
          storeName,
          user.email
        );
      }
    } catch (emailError) {
      console.error("Seller application notification error:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Application submitted successfully. We will review it shortly.",
      data: application,
    });
  } catch (error) {
    console.error("Submit application error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getApplications = async (req: any, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const status = req.query.status as string;

    const where: any = {};
    if (status) where.status = status;

    const [applications, total] = await Promise.all([
      prisma.sellerApplication.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.sellerApplication.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: applications,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const approveApplication = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const application = await prisma.sellerApplication.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!application) {
      res.status(404).json({ success: false, message: "Application not found" });
      return;
    }

    if (application.status === "APPROVED") {
      res.status(400).json({ success: false, message: "Application already approved" });
      return;
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    // Create subscription
    await prisma.subscription.upsert({
      where: { userId: application.userId },
      update: {
        status: "ACTIVE",
        startDate,
        endDate,
        price: 30,
      },
      create: {
        userId: application.userId,
        startDate,
        endDate,
        price: 30,
        status: "ACTIVE",
      },
    });

    // Update user role
    await prisma.user.update({
      where: { id: application.userId },
      data: { role: "SELLER" },
    });

    // Create store
    const existingSlugs = (await prisma.store.findMany({ select: { slug: true } })).map(s => s.slug);
    const slug = ensureUniqueSlug(generateSlug(application.storeName), existingSlugs);

    await prisma.store.upsert({
      where: { userId: application.userId },
      update: {
        name: application.storeName,
        slug,
        description: application.storeDescription,
        phone: application.phone,
        city: application.city,
        isActive: true,
      },
      create: {
        name: application.storeName,
        slug,
        description: application.storeDescription,
        phone: application.phone,
        city: application.city,
        userId: application.userId,
        isActive: true,
      },
    });

    // Update application
    await prisma.sellerApplication.update({
      where: { id },
      data: {
        status: "APPROVED",
        reviewedBy: req.user.userId,
        reviewedAt: new Date(),
      },
    });

    // Send approval email
    try {
      await sendSubscriptionApproval(
        application.user.email,
        application.user.name || "User",
        endDate
      );
    } catch (emailError) {
      console.error("Approval email error:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Application approved",
    });
  } catch (error) {
    console.error("Approve application error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const rejectApplication = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const application = await prisma.sellerApplication.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!application) {
      res.status(404).json({ success: false, message: "Application not found" });
      return;
    }

    await prisma.sellerApplication.update({
      where: { id },
      data: {
        status: "REJECTED",
        reviewedBy: req.user.userId,
        reviewedAt: new Date(),
      },
    });

    try {
      await sendSellerApplicationRejected(
        application.user.email,
        application.user.name || "User",
        reason
      );
    } catch (emailError) {
      console.error("Rejection email error:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Application rejected",
    });
  } catch (error) {
    console.error("Reject application error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { verifyAccessToken } from "../utils/generateTokens";
import prisma from "../config/database";

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "Access token required" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    }
  } catch (error) {
    // Continue without auth
  }
  next();
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== "ADMIN") {
    res.status(403).json({ success: false, message: "Admin access required" });
    return;
  }
  next();
};

export const isSeller = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    if (req.user.role === "ADMIN") {
      return next();
    }

    if (req.user.role !== "SELLER") {
      res.status(403).json({ success: false, message: "Seller access required" });
      return;
    }

    const store = await prisma.store.findUnique({
      where: { userId: req.user.userId },
    });

    if (!store || !store.isActive) {
      res.status(403).json({ success: false, message: "Active store required" });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const isCustomer = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || (req.user.role !== "CUSTOMER" && req.user.role !== "ADMIN")) {
    res.status(403).json({ success: false, message: "Customer access required" });
    return;
  }
  next();
};

export const hasActiveSubscription = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    if (req.user.role === "ADMIN") {
      return next();
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.userId },
    });

    if (!subscription || subscription.status !== "ACTIVE") {
      res.status(403).json({
        success: false,
        message: "Active subscription required to create products",
      });
      return;
    }

    if (new Date(subscription.endDate) < new Date()) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: "EXPIRED" },
      });
      res.status(403).json({
        success: false,
        message: "Subscription has expired. Please renew.",
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

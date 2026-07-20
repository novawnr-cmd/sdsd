import { Response } from "express";
import { AuthRequest, OrderItemInput } from "../types";
import prisma from "../config/database";
import { sendOrderConfirmation, sendSellerOrderNotification } from "../services/emailService";

const generateOrderNumber = async (): Promise<string> => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
  const orderCount = await prisma.order.count({
    where: {
      createdAt: {
        gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      },
    },
  });
  const seq = String(orderCount + 1).padStart(4, "0");
  return `AD-${dateStr}-${seq}`;
};

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      storeId, shippingAddress, city, latitude, longitude,
      phone, backupPhone, email, notes, items, couponCode
    } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ success: false, message: "Order must contain at least one item" });
      return;
    }

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store || !store.isActive) {
      res.status(404).json({ success: false, message: "Store not found or inactive" });
      return;
    }

    let totalAmount = 0;
    const orderItems: Array<{
      productId: string;
      variantId?: string;
      quantity: number;
      price: number;
      color?: string;
      size?: string;
    }> = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product || !product.isActive) {
        res.status(400).json({ success: false, message: `Product not found or unavailable` });
        return;
      }

      if (product.storeId !== storeId) {
        res.status(400).json({ success: false, message: `Product "${product.name}" does not belong to this store` });
        return;
      }

      let itemPrice = product.price;
      let availableStock = product.stock;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) {
          res.status(400).json({ success: false, message: `Variant not found for product "${product.name}"` });
          return;
        }
        itemPrice = variant.price;
        availableStock = variant.stock;

        if (variant.stock < item.quantity) {
          res.status(400).json({ success: false, message: `Insufficient stock for "${product.name}" (${item.color || ""} ${item.size || ""})` });
          return;
        }
      } else {
        if (product.stock < item.quantity) {
          res.status(400).json({ success: false, message: `Insufficient stock for "${product.name}"` });
          return;
        }
      }

      const itemTotal = itemPrice * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: itemPrice,
        color: item.color,
        size: item.size,
      });
    }

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive && coupon.storeId === storeId) {
        if (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date()) {
          if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
            if (!coupon.minPurchase || totalAmount >= coupon.minPurchase) {
              if (coupon.discountType === "PERCENTAGE") {
                totalAmount = totalAmount * (1 - coupon.discount / 100);
              } else {
                totalAmount = Math.max(0, totalAmount - coupon.discount);
              }
              await prisma.coupon.update({
                where: { id: coupon.id },
                data: { usedCount: { increment: 1 } },
              });
            }
          }
        }
      }
    }

    totalAmount = Math.round(totalAmount * 100) / 100;

    const orderNumber = await generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: req.user!.userId,
        storeId,
        totalAmount,
        shippingAddress,
        city,
        latitude: latitude || null,
        longitude: longitude || null,
        phone,
        backupPhone: backupPhone || null,
        email: email || null,
        notes: notes || null,
        items: {
          create: orderItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            price: item.price,
            color: item.color || null,
            size: item.size || null,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, nameEn: true, mainImage: true } },
            variant: true,
          },
        },
        customer: { select: { id: true, name: true, email: true } },
        store: { select: { id: true, name: true, email: true } },
      },
    });

    // Update stock
    for (const item of orderItems) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      } else {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    // Send emails
    try {
      await sendOrderConfirmation(
        order.customer.email,
        order.orderNumber,
        order.items.map((i) => ({
          name: i.product.name,
          quantity: i.quantity,
          price: i.price,
          image: i.product.mainImage,
        })),
        order.totalAmount,
        order.shippingAddress
      );

      if (store.email) {
        await sendSellerOrderNotification(
          store.email,
          store.name,
          order.orderNumber,
          order.items.map((i) => ({
            name: i.product.name,
            quantity: i.quantity,
            price: i.price,
          })),
          order.totalAmount,
          order.customer.name || "Customer",
          order.phone,
          order.shippingAddress
        );
      }
    } catch (emailError) {
      console.error("Order email error:", emailError);
    }

    // Clear cart if exists
    const cart = await prisma.cart.findUnique({ where: { userId: req.user!.userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const status = req.query.status as string;

    const where: any = { customerId: req.user!.userId };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true, nameEn: true, mainImage: true } },
              variant: true,
            },
          },
          store: { select: { id: true, name: true, slug: true, logo: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, nameEn: true, mainImage: true } },
            variant: true,
          },
        },
        store: { select: { id: true, name: true, slug: true, logo: true, phone: true } },
        customer: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    if (order.customerId !== req.user!.userId && req.user!.role !== "ADMIN") {
      const store = await prisma.store.findUnique({ where: { userId: req.user!.userId } });
      if (!store || store.id !== order.storeId) {
        res.status(403).json({ success: false, message: "Not authorized" });
        return;
      }
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getStoreOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const store = await prisma.store.findUnique({ where: { userId: req.user!.userId } });
    if (!store) {
      res.status(404).json({ success: false, message: "Store not found" });
      return;
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const status = req.query.status as string;

    const where: any = { storeId: store.id };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true, nameEn: true, mainImage: true } },
              variant: true,
            },
          },
          customer: { select: { id: true, name: true, phone: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get store orders error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    // Check authorization
    if (req.user!.role === "ADMIN") {
      // Admin can update any order
    } else {
      const store = await prisma.store.findUnique({ where: { userId: req.user!.userId } });
      if (!store || store.id !== order.storeId) {
        res.status(403).json({ success: false, message: "Not authorized" });
        return;
      }
    }

    const validTransitions: Record<string, string[]> = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["PROCESSING", "CANCELLED"],
      PROCESSING: ["SHIPPED", "CANCELLED"],
      SHIPPED: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Cannot transition from ${order.status} to ${status}`,
      });
      return;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    if (status === "CANCELLED") {
      const orderItems = await prisma.orderItem.findMany({ where: { orderId: id } });
      for (const item of orderItems) {
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        } else {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    if (order.customerId !== req.user!.userId) {
      res.status(403).json({ success: false, message: "Not authorized" });
      return;
    }

    if (!["PENDING", "CONFIRMED"].includes(order.status)) {
      res.status(400).json({
        success: false,
        message: "Order can only be cancelled while pending or confirmed",
      });
      return;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    // Restore stock
    const orderItems = await prisma.orderItem.findMany({ where: { orderId: id } });
    for (const item of orderItems) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      } else {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

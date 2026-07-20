import { Response } from "express";
import { AuthRequest } from "../types";
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

export const processCheckout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      shippingAddress,
      city,
      latitude,
      longitude,
      phone,
      backupPhone,
      email,
      notes,
      couponCode,
    } = req.body;

    // Validate address
    if (!shippingAddress || !city || !phone) {
      res.status(400).json({
        success: false,
        message: "Shipping address, city, and phone are required",
      });
      return;
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                store: { select: { id: true, name: true, email: true } },
                variants: true,
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ success: false, message: "Cart is empty" });
      return;
    }

    // Group items by store
    const storeGroups: Record<string, typeof cart.items> = {};
    for (const item of cart.items) {
      const storeId = item.product.storeId;
      if (!storeGroups[storeId]) {
        storeGroups[storeId] = [];
      }
      storeGroups[storeId].push(item);
    }

    const orders = [];

    for (const [storeId, storeItems] of Object.entries(storeGroups)) {
      let totalAmount = 0;
      const orderItemsData: Array<{
        productId: string;
        variantId?: string;
        quantity: number;
        price: number;
        color?: string;
        size?: string;
      }> = [];

      // Validate stock and calculate total
      for (const item of storeItems) {
        let itemPrice = item.product.price;
        let availableStock = item.product.stock;

        if (item.variantId && item.variant) {
          itemPrice = item.variant.price;
          availableStock = item.variant.stock;

          if (item.variant.stock < item.quantity) {
            res.status(400).json({
              success: false,
              message: `Insufficient stock for "${item.product.name}" (${item.color || ""} ${item.size || ""})`,
            });
            return;
          }
        } else {
          if (item.product.stock < item.quantity) {
            res.status(400).json({
              success: false,
              message: `Insufficient stock for "${item.product.name}"`,
            });
            return;
          }
        }

        totalAmount += itemPrice * item.quantity;

        orderItemsData.push({
          productId: item.productId,
          variantId: item.variantId || undefined,
          quantity: item.quantity,
          price: itemPrice,
          color: item.color || undefined,
          size: item.size || undefined,
        });
      }

      // Apply coupon if for this store
      if (couponCode) {
        const coupon = await prisma.coupon.findUnique({
          where: { code: couponCode.toUpperCase() },
        });

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
            create: orderItemsData.map((item) => ({
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
            },
          },
          customer: { select: { id: true, name: true, email: true } },
          store: { select: { id: true, name: true, email: true } },
        },
      });

      // Update stock
      for (const item of orderItemsData) {
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

        if (order.store.email) {
          await sendSellerOrderNotification(
            order.store.email,
            order.store.name,
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
        console.error("Checkout email error:", emailError);
      }

      orders.push(order);
    }

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.status(201).json({
      success: true,
      message: orders.length > 1
        ? `${orders.length} orders placed successfully`
        : "Order placed successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Process checkout error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

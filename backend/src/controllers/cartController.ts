import { Response } from "express";
import { AuthRequest, CartItemInput } from "../types";
import prisma from "../config/database";

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user!.userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                store: { select: { id: true, name: true, slug: true } },
                variants: true,
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user!.userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  store: { select: { id: true, name: true, slug: true } },
                  variants: true,
                },
              },
              variant: true,
            },
          },
        },
      });
    }

    let totalAmount = 0;
    for (const item of cart.items) {
      const price = item.variant ? item.variant.price : item.product.price;
      totalAmount += price * item.quantity;
    }

    res.status(200).json({
      success: true,
      data: {
        ...cart,
        totalAmount: Math.round(totalAmount * 100) / 100,
        itemCount: cart.items.length,
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, variantId, quantity = 1, color, size } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!product || !product.isActive) {
      res.status(404).json({ success: false, message: "Product not found or unavailable" });
      return;
    }

    if (variantId) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (!variant) {
        res.status(404).json({ success: false, message: "Variant not found" });
        return;
      }
      if (variant.stock < quantity) {
        res.status(400).json({ success: false, message: "Insufficient stock" });
        return;
      }
    } else {
      if (product.stock < quantity) {
        res.status(400).json({ success: false, message: "Insufficient stock" });
        return;
      }
    }

    let cart = await prisma.cart.findUnique({ where: { userId: req.user!.userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.user!.userId } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity,
          color: color || null,
          size: size || null,
        },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, nameEn: true, mainImage: true, price: true, store: { select: { id: true, name: true } } },
            },
            variant: true,
          },
        },
      },
    });

    let totalAmount = 0;
    for (const item of updatedCart!.items) {
      const price = item.variant ? item.variant.price : item.product.price;
      totalAmount += price * item.quantity;
    }

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: {
        ...updatedCart,
        totalAmount: Math.round(totalAmount * 100) / 100,
        itemCount: updatedCart!.items.length,
      },
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await prisma.cart.findUnique({ where: { userId: req.user!.userId } });
    if (!cart) {
      res.status(404).json({ success: false, message: "Cart not found" });
      return;
    }

    const cartItem = await prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!cartItem || cartItem.cartId !== cart.id) {
      res.status(404).json({ success: false, message: "Cart item not found" });
      return;
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      if (cartItem.variantId) {
        const variant = await prisma.productVariant.findUnique({ where: { id: cartItem.variantId } });
        if (variant && variant.stock < quantity) {
          res.status(400).json({ success: false, message: "Insufficient stock" });
          return;
        }
      } else {
        const product = await prisma.product.findUnique({ where: { id: cartItem.productId } });
        if (product && product.stock < quantity) {
          res.status(400).json({ success: false, message: "Insufficient stock" });
          return;
        }
      }

      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, nameEn: true, mainImage: true, price: true },
            },
            variant: true,
          },
        },
      },
    });

    let totalAmount = 0;
    for (const item of updatedCart!.items) {
      const price = item.variant ? item.variant.price : item.product.price;
      totalAmount += price * item.quantity;
    }

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: {
        ...updatedCart,
        totalAmount: Math.round(totalAmount * 100) / 100,
        itemCount: updatedCart!.items.length,
      },
    });
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;

    const cart = await prisma.cart.findUnique({ where: { userId: req.user!.userId } });
    if (!cart) {
      res.status(404).json({ success: false, message: "Cart not found" });
      return;
    }

    const cartItem = await prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!cartItem || cartItem.cartId !== cart.id) {
      res.status(404).json({ success: false, message: "Cart item not found" });
      return;
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, nameEn: true, mainImage: true, price: true },
            },
            variant: true,
          },
        },
      },
    });

    let totalAmount = 0;
    for (const item of updatedCart!.items) {
      const price = item.variant ? item.variant.price : item.product.price;
      totalAmount += price * item.quantity;
    }

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: {
        ...updatedCart,
        totalAmount: Math.round(totalAmount * 100) / 100,
        itemCount: updatedCart!.items.length,
      },
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user!.userId } });
    if (!cart) {
      res.status(404).json({ success: false, message: "Cart not found" });
      return;
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: { items: [], totalAmount: 0, itemCount: 0 },
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

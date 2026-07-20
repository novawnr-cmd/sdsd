import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { authenticate, isSeller } from "../middleware/auth";
import { orderLimiter } from "../middleware/rateLimiter";
import {
  createOrder,
  getOrders,
  getOrder,
  getStoreOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController";

const router = Router();

router.post(
  "/",
  authenticate,
  orderLimiter,
  validate([
    body("storeId").notEmpty().withMessage("Store ID is required"),
    body("shippingAddress").notEmpty().withMessage("Shipping address is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("items")
      .isArray({ min: 1 })
      .withMessage("At least one item is required"),
    body("items.*.productId").notEmpty().withMessage("Product ID is required"),
    body("items.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ]),
  createOrder
);

router.get("/", authenticate, getOrders);
router.get("/store", authenticate, isSeller, getStoreOrders);
router.get("/:id", authenticate, getOrder);
router.patch("/:id/status", authenticate, isSeller, updateOrderStatus);
router.patch("/:id/cancel", authenticate, cancelOrder);

export default router;
